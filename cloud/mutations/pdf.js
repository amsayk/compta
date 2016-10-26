// const pdfMake = require('pdfmake');
const pdfMakePrinter = require('pdfmake/src/printer');

const {
  withCompany,
} = require('../utils');

const Jimp = require('jimp');

const writtenNumber = require('written-number');

const group = require('lodash.groupby');
const forEach = require('lodash.foreach');
const filter = require('lodash.filter');
const compact = require('lodash.compact');
const isEmpty = require('lodash.isempty');

const legalFormsTextMap = {
  1: 'SARL',
  2: 'SA',
  3: 'SNC',
  4: 'SARL(AU)',
  SARL: 'SARL', SA: 'SA', SNC: 'SNC', SARL_AU: 'SARL(AU)',
};

const {formatAddress} = require('../types');

const InvoiceClass = require('../types').Invoice;
const InvoiceItemClass = require('../types').InvoiceItem;
const SaleItemClass = require('../types').SaleItem;
const SaleClass = require('../types').Sale;

const {getAccountName} = require('../utils');

const accounting = require('accounting');

const moment = require('moment');

const PaymentOfInvoicesItemClass = require('../types').PaymentOfInvoicesItem;

const {formatError} = require('../utils');

accounting.settings = {
  currency: {
    symbol: 'MAD',   // default currency symbol is '$'
    format: '%v %s', // controls output: %s = symbol, %v = value/number (can be object: see below)
    decimal: ',',  // decimal point separator
    thousand: ' ',  // thousands separator
    precision: 2,   // decimal places
  },
  number: {
    precision: 0,  // default precision on numbers is 0
    thousand: ' ',
    decimal: ','
  },
};

function formatMoney(value) {
  return accounting.formatMoney(value);
}

module.exports.genPdf = function genPdf(request, response) {
  const companyId = request.params.companyId;

  withCompany(companyId, function (err, company) {

    if (err) {
      response.error(formatError(err));
      return;
    }

    const type = request.params.type;

    const id = request.params.objectId;

    switch (type) {
      case 'Invoice':

        genInvoicePdf2(company, id, function (error, pdfDoc) {

          if (error) {
            response.error(formatError(error));
            return;
          }

          createPdfBinary(pdfDoc, function (err, pdf) {

            if (err) {
              response.error(formatError(err));
              return;
            }

            response.success({
              pdf,
            });

          });

        });

        break;

      case 'Sale':

        genSalePdf2(company, id, function (error, pdfDoc) {

          if (error) {
            response.error(formatError(error));
            return;
          }

          createPdfBinary(pdfDoc, function (err, pdf) {

            if (err) {
              response.error(formatError(err));
              return;
            }

            response.success({
              pdf,
            });

          });

        });

        break;

      default:
    }


  });
}

function readCompanyLogoBase64(company) {
  const Type = Parse.Object.extend('File_' + company.id);

  const qry = new Parse.Query(Type);

  qry.equalTo('company', company);
  qry.equalTo('type', 'Logo');

  qry.descending('createdAt');

  return qry.first().then(function (logo) {

    if (logo) {
      return new Promise((resolve, reject) => {
        const url = logo.has('file') ? logo.get('file').url() : null;

        if (!url) {
          resolve(null);
          return;
        }

        Jimp.read(url, function (err, m) {

          if (err) return resolve(null);

          const mime = logo.get('contentType');

          const iScale = m.bitmap.width / m.bitmap.height;

          const scale = Math.min(150, m.bitmap.width) / Math.min(128, m.bitmap.height);

          const value = iScale / scale;

          m.scale(
            value
          ).getBuffer(mime, function (error, buf) {
            if (!error) {
              const data = 'data:' + mime + ';base64,' + buf.toString('base64');
              resolve({
                uri: data,
                width: Math.min(150, m.bitmap.width),
                height: Math.min(128, m.bitmap.height),
              });
            } else {
              resolve(null);
            }
          });

        });

      });
    } else {
      return null;
    }

  }, function () {
    return null;
  });
}

function genInvoicePdf2(company, id, cb) {
  const PaymentOfInvoicesItem = PaymentOfInvoicesItemClass({id: company.id,});

  const InvoiceItem = InvoiceItemClass({id: company.id,});

  const Invoice = InvoiceClass({id: company.id,});

  function getInvoice() {
    return new Promise((resolve, reject) => {
      const query = new Parse.Query(Invoice);
      query.include(['customer']);
      query.get(id, {
        success(invoice){
          resolve(invoice.toJSON());
        },

        error(error){
          reject(error);
        },
      })
    });
  }

  function getInvoiceItems() {
    const query = new Parse.Query(InvoiceItem);
    query.equalTo('invoice', Invoice.createWithoutData(id));

    query.include(['item']);

    return query.find().then(items => items.map(item => item.toJSON()));
  }

  function getInvoicePayments() {
    const query = new Parse.Query(PaymentOfInvoicesItem);
    query.equalTo('invoice', Invoice.createWithoutData(id));

    query.include(['payment']);

    return query.find().then(items => items.map(item => item.toJSON()));
  }

  Promise.all([
    readCompanyLogoBase64(company),
    getInvoice(),
    getInvoiceItems(),
    getInvoicePayments(),
  ]).then(function ([ logo, invoice, _items, _payments, ]) {

    const VAT_percentages = {};

    const subtotalHT = invoice.totalHT;

    const itemsTotalDiscount = _items
      .reduce((sum, {qty, rate, discountPart : itemDiscountPart, VATPart : itemVATPart,}) => {

        const entryValue = qty * rate;

        const amountHT__BeforeDiscount = itemGetAmount__HT(entryValue, itemVATPart);

        const itemDiscount = itemGetDiscount(amountHT__BeforeDiscount, itemDiscountPart);

        return sum + itemDiscount;
      }, 0.0);

    const totalDiscount = getTotalDiscount(subtotalHT - itemsTotalDiscount, {
      type: invoice.discountType,
      value: invoice.discountValue,
    });

    const discount = totalDiscount + itemsTotalDiscount;

    const amountPaid = _payments.reduce(function (sum, next) {
      return sum + next.amount;
    }, 0.0);

    const noQty = _items.filter(({item, qty}) => {
      return (item.type === 'Service' || item.type === 2) && qty === 1;
    });

    const items = _items.map(function ({description, item, qty, rate, discountPart : itemDiscountPart, VATPart : itemVATPart,}) {

      const entryValue = qty * rate;

      const amountHT__BeforeDiscount = itemGetAmount__HT(entryValue, itemVATPart);

      const itemTotalDiscount = itemGetTotalDiscountPart(amountHT__BeforeDiscount, itemDiscountPart);

      const amountHT = amountHT__BeforeDiscount - itemTotalDiscount;

      const taxableAmount = amountHT;

      function itemGetTotalDiscountPart(amountHT__BeforeDiscount, itemDiscountPart) {
        const itemDiscount = itemGetDiscount(amountHT__BeforeDiscount, itemDiscountPart);

        const amountPercentage = (amountHT__BeforeDiscount * 100 / subtotalHT);

        const discountPart = amountPercentage / 100 * totalDiscount;

        return itemDiscount + discountPart;
      }

      if (itemVATPart && itemVATPart.value && itemVATPart.value !== 'Value_Exempt' && itemVATPart.value !== 4) {
        const {inputType, value = 'Value_Exempt',} = itemVATPart;

        switch (inputType) {
          case 1:
          case 'HT':

            (function () {
              if (!VAT_percentages[value]) {
                VAT_percentages[value] = 0;
              }

              const VAT = itemGeVATPart__Amount(taxableAmount, itemVATPart);

              VAT_percentages[value] = +VAT;
            })();
            break;

          case 2:
          case 'TTC':

            (function () {
              if (!VAT_percentages[value]) {
                VAT_percentages[value] = 0;
              }

              const VAT = itemGeVATPart__Amount(taxableAmount, itemVATPart);

              VAT_percentages[value] = +VAT;
            })();
            break;

          case 3:
          case 'NO_VAT':

            break;

          default:
        }
      }

      if (noQty) {
        return discount > 0.0 ? [

          {
            text: item
              ? item.displayName || description
              : description, style: ['firstHeaderRow', 'bold'],
          },

          {text: formatMoney(taxableAmount), style: ['headerRow', 'alignLeft'],},

          {text: formatMoney(qty * taxableAmount), style: ['headerRow', 'alignLeft'],},

          {
            text: String(itemVATPart && itemVATPart.value
              ? VAT_VALUE_FORMATTED[itemVATPart.value]
              : 'Exonéré'), style: ['headerRow', 'alignLeft'],
          },

          {text: formatMoney(itemTotalDiscount), style: ['lastHeaderRow', 'alignRight'],},

        ] : [

          {
            text: item
              ? item.displayName || description
              : description, style: ['firstHeaderRow', 'bold'],
          },

          {text: formatMoney(taxableAmount), style: ['headerRow', 'alignLeft'],},

          {text: formatMoney(qty * taxableAmount), style: ['headerRow', 'alignLeft'],},

          {
            text: String(itemVATPart && itemVATPart.value
              ? VAT_VALUE_FORMATTED[itemVATPart.value]
              : 'Exonéré'), style: ['lastHeaderRow', 'alignLeft'],
          },
        ];
      }

      return discount > 0.0 ? [

        {
          text: item
            ? item.displayName || description
            : description, style: ['firstHeaderRow', 'bold'],
        },

        {text: String(qty), style: ['headerRow', 'alignCenter'],},

        {text: formatMoney(taxableAmount), style: ['headerRow', 'alignCenter'],},

        {text: formatMoney(qty * taxableAmount), style: ['headerRow', 'alignLeft'],},

        {
          text: String(itemVATPart && itemVATPart.value
            ? VAT_VALUE_FORMATTED[itemVATPart.value]
            : 'Exonéré'), style: ['headerRow', 'alignRight'],
        },

        {text: formatMoney(itemTotalDiscount), style: ['lastHeaderRow', 'alignRight'],},

      ] : [

        {
          text: item
            ? item.displayName || description
            : description, style: ['firstHeaderRow', 'bold'],
        },

        {text: String(qty), style: ['headerRow', 'alignCenter'],},

        {text: formatMoney(taxableAmount), style: ['headerRow', 'alignCenter'],},

        {text: formatMoney(qty * taxableAmount), style: ['headerRow', 'alignLeft'],},

        {
          text: String(itemVATPart && itemVATPart.value
            ? VAT_VALUE_FORMATTED[itemVATPart.value]
            : 'Exonéré'), style: ['lastHeaderRow', 'alignRight'],
        },
      ];
    });

    const {
      IF,
    } = getCompanyVATSettings(company);

    const VATEnabled = company.has('VATEnabled') ? company.get('VATEnabled') : false;

    const Name = company.has('displayName') ? company.get('displayName') : null;
    const Email = company.has('email') ? company.get('email') : null;
    const Site = company.has('webSite') ? company.get('webSite') : null;
    const LegalForm = company.has('legalForm') ? company.get('legalForm') : null;
    const RC = company.has('rc') ? company.get('rc') : null;
    const Address = (company.has('address') ? company.get('address') : '\n\n').split('\n');

    const hasVAT = invoice.VAT > 0;

    const dd = {
      pageMargins: logo ? [25, 100, 25, 50] : [0, 0, 0, 50],

      pageSize: 'LEGAL',
      pageOrientation: 'portrait',

      content: [],

      styles: {

        logo: {},

        companyName: {
          bold: true,
          fontSize: 22,
        },

        line: {
          margin: [0, 10, 0, 0],
        },

        line2: {
          margin: [0, 4, 0, 0],
        },
        line3: {
          margin: [0, 0, 0, 0],
        },

        addressLine: {
          // italics: true,
          // color: 'darkgrey',
        },

        title: {
          margin: [0, 25, 0, 15],
          fontSize: 20,
          color: '#169cee',
        },

        customerInfoHeader: {
          bold: true,
          fontSize: 14,
        },

        bold: {
          bold: true,
        },

        italic: {
          // italics: true,
        },

        headerTable: {
          fontSize: 9,
          color: '#169cee',
          fillColor: '#e3eaf3',
          margin: [-25, 30, -25, 0],
        },

        bodyTable: {
          fontSize: 9,
          // color: '#169cee',
          // fillColor: '#e3eaf3',
          margin: [-25, 0, -25, 15],
        },

        firstHeaderRow: {
          margin: [25, 3, 0, 3],
        },

        lastHeaderRow: {
          margin: [0, 3, 25, 3],
        },

        headerRow: {
          margin: [15, 3],
        },

        'VAT-introText': {
          fontSize: 14,
          margin: [0, 30, 0, 5]
        },

        alignRight: {
          alignment: 'right',
        },

        alignLeft: {
          alignment: 'left',
        },

        alignCenter: {
          alignment: 'center',
        },

        'VAT-tableHeader': {
          fontSize: 9,
          color: '#169cee',
          fillColor: '#e3eaf3',
          margin: [-25, 5, -25, 0],
        },

        'VAT-bodyTable': {
          fontSize: 9,
          // color: '#169cee',
          // fillColor: '#e3eaf3',
          margin: [-25, 0, -25, 30],
        },

        totalsTable: {
          margin: [0, 15, 0, 0],
        },

      },

      images: {
        logo: logo ? logo.uri : undefined,
      },

      defaultStyle: {
        fontSize: 9,
      },

      footer: function () {

        const Line1Text = function () {
          const displayName = company.get('displayName');
          const capital = company.get('capital');

          const legalFormText = (LegalForm ? ' ' + legalFormsTextMap[String(LegalForm)] : '');

          return compact(
            [displayName + legalFormText, isEmpty(capital) ? null : ['CAPITAL', capital].join(' ')]).join(' · ');
        }();

        const MoreInfo = function () {

          const addr = [compact([
            company.get('company_streetAddress'),
            company.get('company_postalCode'),
            company.get('company_cityTown'),
          ]).join(', ')];

          const ICE = isEmpty(company.get('ice')) ? [] : ['ICE' + ' : ' + company.get('ice')];
          const RC = isEmpty(company.get('rc')) ? [] : ['RC' + ' : ' + company.get('rc')];
          const Patente = isEmpty(company.get('patente')) ? [] : ['Patente' + ' : ' + company.get('patente')];
          const IF = isEmpty(company.get('if')) ? [] : ['IF' + ' : ' + company.get('if')];
          const CNSS = isEmpty(company.get('cnss')) ? [] : ['CNSS' + ' : ' + company.get('cnss')];

          return compact([
            ...addr,
            ...ICE,
            ...RC,
            ...Patente,
            ...IF,
            ...CNSS,
          ]).join(' · ');
        }();

        const ContactInfo = function () {
          const Tel = isEmpty(company.get('tel')) ? [] : ['Tél' + ' : ' + company.get('tel')];
          const Fax = isEmpty(company.get('fax')) ? [] : ['Fax' + ' : ' + company.get('fax')];
          const Email = isEmpty(company.get('email')) ? [] : ['E-mail' + ' : ' + company.get('email')];
          const Website = isEmpty(company.get('webSite')) ? [] : ['Web' + ' : ' + company.get('webSite')];

          return compact([
            ...Tel,
            ...Fax,
            ...Email,
            ...Website,
          ]).join(' · ');
        }();

        return {
          margin: [50],
          columns: [
            {width: '*', text: ''},

            {
              width: 'auto',
              style: ['alignCenter'],
              table: {
                widths: ['100%'],
                body: [

                  // line
                  [{
                    columnGap: -7,
                    columns: [

                      {
                        width: '30%',
                        table: {
                          widths: ['*'],
                          body: [[' '], [' ']]
                        },
                        layout: {
                          hLineColor: function (i, node) {
                            return '#169cee';
                          },
                          hLineWidth: function (i, node) {
                            return i === 0 ? 1 : 0;
                          },
                          vLineWidth: function (i, node) {
                            return 0;
                          },
                        }
                      },

                      {
                        width: '30%',
                        text: Line1Text,
                        marginTop: -5,
                        marginLeft: 7,
                        marginRight: 7,
                        style: ['bold'],
                      },

                      {
                        width: '30%',
                        table: {
                          widths: ['*'],
                          body: [[' '], [' ']]
                        },
                        layout: {
                          hLineColor: function (i, node) {
                            return '#169cee';
                          },
                          hLineWidth: function (i, node) {
                            return i === 0 ? 1 : 0;
                          },
                          vLineWidth: function (i, node) {
                            return 0;
                          },
                        }
                      },

                    ],
                    style: ['alignCenter'],
                    absolutePosition: {x: 50, y: 0,},
                  }],

                  // more info,
                  [{
                    columns: [
                      {
                        table: {
                          widths: ['100%'],
                          body: [
                            [{
                              text: MoreInfo,
                              style: ['bold'],
                            }]
                          ],
                        }, layout: 'noBorders',
                      },
                    ],
                    style: ['alignCenter'],
                    absolutePosition: {x: 25, y: 10,},
                  }],

                  // contact info
                  [{
                    columns: [
                      {
                        table: {
                          widths: ['100%'],
                          body: [
                            [{
                              text: ContactInfo,
                              style: ['bold'],
                            }]
                          ],
                        }, layout: 'noBorders',
                      },
                    ],
                    style: ['alignCenter'],
                    absolutePosition: {x: 25, y: 25,},
                  }],

                ],

              },

              layout: 'noBorders',
            },

            {width: '*', text: ''},
          ]
        };
      },

    };

    const _date = moment().format('l');
    const refNo = String(invoice.refNo);
    const _city = company.has('company_cityTown') ? company.get('company_cityTown') + ' ' : '';

    // Company name
    if (logo) {

      dd.header = {
        margin: [25],
        columns: [
          {
            table: {
              widths: ['50%', '50%'],
              body: [
                [
                  {
                    image: 'logo',

                    // fit: [ logo.width, logo.height ],

                    // width: 512, height: 128,
                    width: logo.width, height: logo.height,

                    style: ['alignLeft'],

                  },

                  {
                    table: {
                      widths: ['100%'],
                      body: [

                        // ROW #1
                        [{
                          text: 'Facture',
                          fontSize: 30,
                          margin: [25, 25],
                          absolutePosition: {x: 450, y: 25,},
                          style: ['bold', 'italic',],
                        }],

                        // ROW #2
                        [{
                          text: `${_city}le : ${_date}`,
                          absolutePosition: {x: 537 - (_date.length + _city.length - 1) * 5.2, y: 60,},
                        }],

                        // ROW #3
                        [{
                          text: `Numéro : ${refNo}`,
                          absolutePosition: {x: 506 - refNo.length * 5.2, y: 72,},
                        }],

                      ],
                    },

                    layout: 'noBorders',

                  },

                ],

              ]
            },
            layout: 'noBorders',
          }
        ]
      };

    } else {

      dd.content.push({
        margin: [25],
        columns: [
          {
            table: {
              widths: ['50%', '50%'],
              body: [
                [
                  {
                    text: company.get('displayName'),
                    style: ['companyName', 'alignLeft', 'bold'],
                    absolutePosition: {x: 25, y: 25,},

                  },

                  {
                    table: {
                      widths: ['100%'],
                      body: [

                        // ROW #1
                        [{
                          text: 'Facture',
                          fontSize: 30,
                          margin: [25, 25],
                          absolutePosition: {x: 450, y: 25,},
                          style: ['bold', 'italic',],
                        }],

                        // ROW #2
                        [{
                          text: `le, ${_date}`,
                          absolutePosition: {x: 537 - _date.length * 5.2, y: 58,},
                        }],

                        // ROW #3
                        [{
                          text: `Numéro : ${refNo}`,
                          absolutePosition: {x: 506 - refNo.length * 5.2, y: 69,},
                        }],

                      ],
                    },

                    layout: 'noBorders',
                  },

                ],

              ]
            },
            layout: 'noBorders',
          }
        ]
      });
    }

    // Company info

    const eName = invoice.customer.displayName;
    const eCompany = invoice.customer.affiliation;
    const eAddr = compact([
      invoice.customer.billing_streetAddress,
      invoice.customer.billing_cityTown,
      invoice.customer.billing_postalCode,
    ]).join(', ');
    const eCity = invoice.customer.billing_cityTown;
    const eTel = invoice.customer.phone || invoice.customer.mobile;

    dd.content.push({
      marginLeft: 175,
      columns: [
        {
          width: 350,
          table: {
            widths: ['100%'],
            body: [
              [{
                marginLeft: 5,
                marginTop: -5,
                marginBottom: 5,
                columns: [
                  {
                    width: 75,
                    stack: function () {
                      const stack = [];

                      if (eName) {
                        stack.push({text: 'Adressé à:', style: ['line', 'addressLine'],});
                      }
                      if (!isEmpty(eCompany)) {
                        stack.push({text: 'Société:', style: ['line', 'addressLine'],});
                      }

                      if (!isEmpty(eAddr)) {
                        stack.push({text: 'Adresse:', style: ['line', 'addressLine'],});
                      }

                      if (eCity) {
                        stack.push({text: 'Ville:', style: ['line', 'addressLine'],});
                      }

                      if (eTel) {
                        stack.push({text: 'Tél:', style: ['line', 'addressLine'],});
                      }

                      return stack;
                    }(),
                  },

                  {
                    stack: function () {
                      const stack = [];

                      if (eName) {
                        stack.push({text: eName, style: ['bold', 'line', 'addressLine'],});
                      }
                      if (!isEmpty(eCompany)) {
                        stack.push({text: eCompany, style: ['bold', 'line', 'addressLine'],});
                      }

                      if (!isEmpty(eAddr)) {
                        stack.push({text: eAddr, style: ['bold', 'line', 'addressLine'],});
                      }

                      if (eCity) {
                        stack.push({text: eCity, style: ['bold', 'line', 'addressLine'],});
                      }

                      if (eTel) {
                        stack.push({text: eTel, style: ['bold', 'line', 'addressLine'],});
                      }

                      return stack;
                    }(),
                  }

                ],
              }]
            ]
          },
          layout: {
            hLineWidth: function (i, node) {
              return 0.7;
            },
            vLineWidth: function (i, node) {
              return 0.7;
            },
          },
        }
      ]

    });

    // Title
    // dd.content.push({
    //   text: 'Facture',
    //   style: 'title',
    // });

    // Invoice details + Customer details
    // dd.content.push({
    //
    //   columns: [
    //
    //     // Invoice details
    //     {
    //       columns: [
    //
    //         {
    //           stack: function () {
    //             const stack = [];
    //
    //             stack.push({
    //               text: 'Date',
    //               style: ['line', 'bold',],
    //             });
    //
    //             stack.push({
    //               text: 'N°',
    //               style: ['line', 'bold',],
    //             });
    //
    //             stack.push({
    //               text: 'Paiement dû',
    //               style: ['line', 'bold',],
    //             });
    //
    //             stack.push({
    //               text: 'Conditions',
    //               style: ['line', 'bold',],
    //             });
    //
    //             return stack;
    //           }(),
    //           alignment: 'right',
    //           width: '*',
    //         },
    //
    //         {
    //           stack: function () {
    //             const stack = [];
    //
    //             stack.push({
    //               text: moment(invoice.date).format('ll'),
    //               style: ['line'],
    //             });
    //
    //             stack.push({
    //               text: String(invoice.refNo),
    //               style: ['line'],
    //             });
    //
    //             stack.push({
    //               text: moment(invoice.dueDate).format('ll'),
    //               style: ['line'],
    //             });
    //
    //             if (invoice.terms === 5 || invoice.terms === 'Custom') {
    //               const numDays = Math.abs(moment(invoice.date).diff(moment(invoice.dueDate), 'days'));
    //
    //               stack.push({
    //                 text: `${numDays} jour${numDays > 1 ? 's' : ''}`,
    //                 style: ['line'],
    //               });
    //
    //             } else {
    //
    //               stack.push({
    //                 text: TermsMap[invoice.terms],
    //                 style: ['line'],
    //               });
    //
    //             }
    //
    //             return stack;
    //           }(),
    //           alignment: 'left',
    //         },
    //
    //       ],
    //
    //       columnGap: 10,
    //       margin: [25, 0, 0, 0,],
    //     },
    //
    //     // Customer details
    //     {
    //       stack: function () {
    //         const stack = [];
    //
    //         stack.push({
    //           text: 'DESTINATAIRE',
    //           style: ['customerInfoHeader', 'line'],
    //         });
    //
    //         if (invoice.customer) {
    //           stack.push({text: invoice.customer.displayName, style: ['line2']});
    //         }
    //
    //         const billingAddress = invoice.billingAddress
    //           ? invoice.billingAddress.split('\n')
    //           : (invoice.customer ? getCustomerBillingAddress(invoice.customer) : []);
    //
    //         billingAddress.forEach(function (line) {
    //           stack.push({text: line, style: invoice.customer ? ['line', 'addressLine'] : ['line2', 'addressLine']});
    //         });
    //
    //         return stack;
    //       }(),
    //     },
    //
    //   ],
    //
    //   columnGap: 50,
    //
    // });

    // Line sep
    // dd.content.push({
    //   table: {
    //     widths: ['*'],
    //     body: [[' '], [' ']]
    //   },
    //   layout: {
    //     hLineColor: function (i, node) {
    //       return '#169cee';
    //     },
    //     hLineWidth: function (i, node) {
    //       return (i === 0 || i === node.table.body.length) ? 0 : 0.5;
    //     },
    //     vLineWidth: function (i, node) {
    //       return 0;
    //     },
    //   }
    // });

    // Items header row
    dd.content.push({
      style: 'headerTable',
      marginTop: 50,
      marginLeft: 15,
      marginRight: 15,
      width: 550,
      table: {
        widths: function () {
          if (noQty) {
            return discount > 0.0 ? ['*', 115, 115, 50, 75] : ['*', 115, 115, 50];
          }
          return discount > 0.0 ? ['*', 50, 115, 115, 50, 75] : ['*', 50, 115, 115, 50];
        }(),
        body: [
          function () {

            if (noQty) {
              return discount > 0.0 ? [
                {text: 'PRESTATION', style: ['firstHeaderRow'],},
                {text: 'P. U.', style: ['headerRow', 'alignLeft']},
                {text: 'MONTANT', style: ['headerRow', 'alignLeft'],},
                {text: 'TVA', style: ['headerRow', 'alignLeft'],},
                {text: 'REMISE', style: ['lastHeaderRow', 'alignRight'],},
              ] : [
                {text: 'PRESTATION', style: ['firstHeaderRow'],},
                {text: 'P. U.', style: ['headerRow', 'alignLeft'],},
                {text: 'MONTANT', style: ['headerRow', 'alignLeft'],},
                {text: 'TVA', style: ['lastHeaderRow', 'alignLeft'],},
              ];
            }

            return discount > 0.0 ? [
              {text: 'ACTIVITÉ', style: ['firstHeaderRow'],},
              {text: 'QTÉ', style: ['headerRow'],},
              {text: 'P. U.', style: ['headerRow'],},
              {text: 'MONTANT', style: ['headerRow', 'alignLeft'],},
              {text: 'TVA', style: ['headerRow', 'alignRight'],},
              {text: 'REMISE', style: ['lastHeaderRow', 'alignRight'],},
            ] : [
              {text: 'ACTIVITÉ', style: ['firstHeaderRow'],},
              {text: 'QTÉ', style: ['headerRow'],},
              {text: 'P. U.', style: ['headerRow'],},
              {text: 'MONTANT', style: ['headerRow', 'alignLeft'],},
              {text: 'TVA', style: ['lastHeaderRow', 'alignRight'],},
            ];

          }()
        ]
      },
      layout: 'noBorders',
    });

    // Items table
    dd.content.push({
      style: 'bodyTable',
      marginLeft: 15,
      marginRight: 15,
      table: {
        widths: function () {
          if (noQty) {
            return discount > 0.0 ? ['*', 115, 115, 50, 75] : ['*', 115, 115, 50];
          }
          return discount > 0.0 ? ['*', 50, 115, 115, 50, 75] : ['*', 50, 115, 115, 50];
        }(),
        body: items
      },
      layout: 'noBorders',
    });

    // Dash line
    dd.content.push({
      canvas: [
        {
          type: 'line',
          x1: 15,
          y1: 5,
          x2: 550,
          y2: 5,
          lineWidth: 0.5,
          dash: {length: 2,},
          lineColor: 'darkgrey',
          opacity: 0.8,
          strokeOpacity: 0.5,
        }
      ]
    });

    if (hasVAT) {

      dd.content.push({
        width: 550,
        marginLeft: 15,
        marginRight: 15,
        columns: [

          // Column 1
          {
            stack: [{
              columns: [
                {
                  width: 200,
                  table: {
                    widths: ['100%'],
                    body: [
                      [{
                        marginLeft: 5,
                        marginTop: -5,
                        marginBottom: 5,
                        columns: function () {
                          const hasPayment = invoice.balanceDue === 0 && _payments.length > 0;
                          const max = moment.max(..._payments.map(p => p.date));
                          return [
                            {
                              width: 100,
                              stack: function () {
                                const stack = [];

                                stack.push({text: 'Mode de paiement:', style: ['line', 'addressLine'],});
                                stack.push({text: 'Nº:', style: ['line', 'addressLine'],});
                                stack.push({text: 'Date d\'expiration:', style: ['line', 'addressLine'],});

                                hasPayment && max && stack.push({text: 'Date de paiement:', style: ['line', 'addressLine'],});

                                return stack;
                              }(),
                            },

                            {
                              stack: function () {
                                const stack = [];

                                stack.push({
                                  text: hasPayment ? paymentMethod[_payments[_payments.length - 1].paymentMethod] || ' ' : '  ',
                                  style: ['bold', 'line', 'addressLine'],
                                });
                                stack.push({
                                  text: hasPayment ? _payments[_payments.length - 1].paymentRef || '  ' : '  ',
                                  style: ['bold', 'line', 'addressLine'],
                                });
                                stack.push({
                                  text: moment(invoice.dueDate).format('l'),
                                  style: ['bold', 'line', 'addressLine'],
                                });

                                hasPayment && max && stack.push({
                                  text: moment(max).format('l'),
                                  style: ['bold', 'line', 'addressLine'],
                                });

                                return stack;
                              }(),
                            }

                          ];
                        }(),
                      }]
                    ]
                  },
                  layout: {
                    hLineWidth: function (i, node) {
                      return 0.7;
                    },
                    vLineWidth: function (i, node) {
                      return 0.7;
                    },
                  }
                }
              ]
            }],
            width: 'auto',
            alignment: 'left',
            margin: [0, 15, 15, 0],
          },

          // Column 2
          {
            style: ['totalsTable'],
            table: {
              widths: ['*', 75, 75],
              body: [
                [
                  '',
                  {text: 'Total HT', style: ['line3'],},
                  {text: formatMoney(invoice.totalHT), style: ['alignRight', 'line3'],},
                ],

                discount > 0
                  ? [
                  '',
                  {text: 'REMISE', style: ['line3'],},
                  {text: `-${formatMoney(discount)}`, style: ['alignRight', 'line3'],},
                ]
                  : [
                  '',
                  {text: '', style: ['line3'],},
                  {text: '', style: ['line3'],},
                ],

                // [
                //   '',
                //   {text: 'Total TVA', style: ['line3'],},
                //   {text: formatMoney(invoice.VAT), style: ['alignRight', 'line3'],},
                // ],

                ...Object.keys(VAT_percentages).map(function (key) {
                  const amount = VAT_percentages[key];
                  return [
                    '',
                    {text: `TVA de ${VAT_VALUE_FORMATTED[key]}`, style: ['bold', 'line3'],},
                    {text: formatMoney(amount), style: ['alignRight', 'line3'],},
                  ];
                }),

                [
                  '',
                  {text: 'Total TTC', style: ['line3'],},
                  {text: formatMoney(invoice.total), style: ['alignRight', 'line3'],},
                ],

                amountPaid > 0
                  ? [
                  '',
                  {text: 'MONTANT REÇU', style: ['line3'],},
                  {text: formatMoney(amountPaid), style: ['alignRight', 'line3'],},
                ]
                  : [
                  '',
                  {text: '', style: ['line3'],},
                  {text: '', style: ['line3'],},
                ],

                [
                  '',
                  {text: 'SOLDE À PAYER', style: ['line3'],},
                  {text: `${formatMoney(invoice.balanceDue)} MAD`, style: ['alignRight', 'line3', 'bold'],},
                ]
              ]
            },
            layout: 'noBorders',
          },

        ]
      });

    } else {

      dd.content.push({
        width: 550,
        marginLeft: 15,
        marginRight: 15,
        columns: [

          // Column 1
          {
            stack: [{
              columns: [
                {
                  width: 200,
                  table: {
                    widths: ['100%'],
                    body: [
                      [{
                        marginLeft: 5,
                        marginTop: -5,
                        marginBottom: 5,
                        columns: function () {
                          const hasPayment = invoice.balanceDue === 0 && _payments.length > 0;
                          const max = moment.max(..._payments.map(p => p.date));
                          return [
                            {
                              width: 100,
                              stack: function () {
                                const stack = [];

                                stack.push({text: 'Mode de paiement:', style: ['line', 'addressLine'],});
                                stack.push({text: 'Nº:', style: ['line', 'addressLine'],});
                                stack.push({text: 'Date d\'expiration:', style: ['line', 'addressLine'],});

                                hasPayment && max && stack.push({text: 'Date de paiement:', style: ['line', 'addressLine'],});

                                return stack;
                              }(),
                            },

                            {
                              stack: function () {
                                const stack = [];

                                stack.push({
                                  text: hasPayment ? paymentMethod[_payments[_payments.length - 1].paymentMethod] || ' ' : '  ',
                                  style: ['bold', 'line', 'addressLine'],
                                });
                                stack.push({
                                  text: hasPayment ? _payments[_payments.length - 1].paymentRef || '  ' : '  ',
                                  style: ['bold', 'line', 'addressLine'],
                                });
                                stack.push({
                                  text: moment(invoice.dueDate).format('l'),
                                  style: ['bold', 'line', 'addressLine'],
                                });

                                hasPayment && max && stack.push({
                                  text: moment(max).format('l'),
                                  style: ['bold', 'line', 'addressLine'],
                                });

                                return stack;
                              }(),
                            }

                          ];
                        }(),
                      }]
                    ]
                  },
                  layout: {
                    hLineWidth: function (i, node) {
                      return 0.7;
                    },
                    vLineWidth: function (i, node) {
                      return 0.7;
                    },
                  }
                }
              ]
            }],
            width: 'auto',
            alignment: 'left',
            margin: [0, 15, 0, 0],
          },

          // Column 2
          {
            style: ['totalsTable'],
            table: {
              widths: ['*', 75, 75],
              body: [
                [
                  '',
                  {text: discount > 0 ? 'Sous-Total' : 'Total', style: ['line3'],},
                  {text: formatMoney(invoice.total + discount), style: ['alignRight', 'line3'],},
                ],

                discount > 0
                  ? [
                  '',
                  {text: 'REMISE', style: ['line3'],},
                  {text: `-${formatMoney(discount)}`, style: ['alignRight', 'line3'],},
                ]
                  : [
                  '',
                  {text: '', style: ['line3'],},
                  {text: '', style: ['line3'],},
                ],

                discount > 0
                  ? [
                  '',
                  {text: 'Total', style: ['line3'],},
                  {text: formatMoney(invoice.total), style: ['alignRight', 'line3'],},
                ]
                  : [
                  '',
                  {text: '', style: ['line3'],},
                  {text: '', style: ['line3'],},
                ],

                amountPaid > 0
                  ? [
                  '',
                  {text: 'MONTANT REÇU', style: ['line'],},
                  {text: formatMoney(amountPaid), style: ['alignRight', 'line3'],},
                ]
                  : [
                  '',
                  {text: '', style: ['line3'],},
                  {text: '', style: ['line3'],},
                ],

                [
                  '',
                  {text: 'SOLDE À PAYER', style: ['line3'],},
                  {text: `${formatMoney(invoice.balanceDue)} MAD`, style: ['alignRight', 'line3', 'bold'],},
                ]
              ]
            },
            layout: 'noBorders',
          }

        ]

      });

    }

    // Amount to text
    dd.content.push({
      marginTop: 25,
      marginLeft: 100,
      marginRight: 15,
      table: {
        widths: ['100%'],
        body: [

          [{
            columnGap: -7,
            columns: [
              {
                // alignment: 'left',
                text: 'Arrête la présente Facture à la somme de:',
              }, {
                // alignment: 'left',
                text: writtenNumber(invoice.total, {lang: 'fr'}).toUpperCase() + ' DIRHAMS',
                bold: true,
              },
            ]
          }]
        ]
      },
      layout: {
        hLineWidth: function (i, node) {
          return 0.7;
        },
        vLineWidth: function (i, node) {
          return 0.7;
        },
      },
    });

    // cadre
    dd.content.push({
      marginTop: 25,
      marginLeft: 100,
      marginRight: 15,
      table: {
        widths: ['100%'],
        body: [

          [{
            columns: [
              {
                marginTop: 5,
                marginBottom: 75,
                alignment: 'center',
                text: 'Cadre reservé à la société',
              },
            ]
          }]
        ]
      },
      layout: {
        hLineWidth: function (i, node) {
          return 0.7;
        },
        vLineWidth: function (i, node) {
          return 0.7;
        },
      },
    });

    // if (hasVAT) {
    //
    //   const VAT_Items = [];
    //
    //   forEach(group(filter(_items, ({VATPart,}) => VATPart && VATPart.value && VATPart.value !== 4 && VATPart.value !== 'Value_Exempt'), ({VATPart,}) => VATPart.value), function (items, key) {
    //
    //     const {totalHT, totalVAT,} = items.reduce(function ({totalHT, totalVAT,}, {qty, rate, VATPart : {value, inputType : itemInputType,}}) {
    //
    //       const entryValue = qty * rate;
    //
    //       const VAT_percentage = value ? VAT_ID_TO_VALUE[value] : 0.0;
    //
    //       switch (itemInputType) {
    //         case 1:
    //         case 'HT':
    //
    //           // entryValue is HT
    //           totalHT += entryValue;
    //           totalVAT += VAT_percentage * entryValue;
    //
    //           break;
    //
    //         case 2:
    //         case 'TTC':
    //
    //           // entryValue is TTC
    //           (function () {
    //
    //             const entryValueHT = entryValue / (1 + VAT_percentage);
    //
    //             totalHT += entryValueHT;
    //             totalVAT += VAT_percentage * entryValueHT;
    //
    //           })();
    //
    //           break;
    //
    //         case 3:
    //         case 'NO_VAT':
    //
    //           totalHT += entryValue;
    //           totalVAT += VAT_percentage * entryValue;
    //
    //           break;
    //
    //         default:
    //
    //           throw new Error(`VAT component: Invalid item inputType`, itemInputType);
    //       }
    //
    //       return {totalHT, totalVAT,};
    //     }, {totalHT: 0.0, totalVAT: 0.0,});
    //
    //
    //     VAT_Items.push([
    //       {text: `TVA de ${VAT_VALUE_FORMATTED[key]}`, style: ['firstHeaderRow', 'alignRight'],},
    //       {text: formatMoney(totalVAT), style: ['headerRow', 'alignRight'],},
    //       {text: formatMoney(totalHT), style: ['lastHeaderRow', 'alignRight'],},
    //     ]);
    //   });
    //
    //   if (VAT_Items.length > 0) {
    //
    //     dd.content.push({
    //       text: 'RÉCAPITULATIF DE TVA',
    //       style: 'VAT-introText',
    //     });
    //
    //     // VAT table header row
    //     dd.content.push({
    //       style: ['VAT-tableHeader'],
    //       table: {
    //         widths: ['*', '*', '*'],
    //         body: [
    //           [
    //             {text: 'TAUX', style: ['firstHeaderRow', 'alignRight'],},
    //             {text: 'MONTANT DE TVA', style: ['headerRow', 'alignRight'],},
    //             {text: 'BASE HT', style: ['lastHeaderRow', 'alignRight'],},
    //           ]
    //         ]
    //       },
    //       layout: 'noBorders',
    //     });
    //
    //     // VAT table items
    //     dd.content.push({
    //       style: ['VAT-bodyTable'],
    //       table: {
    //         widths: ['*', '*', '*'],
    //         body: VAT_Items
    //       },
    //       layout: 'noBorders',
    //     });
    //   }
    //
    // }

    if (invoice.balanceDue === 0.0) {
      // dd.watermark = 'PAYÉ';
      dd.watermark = {
        text: 'PAYÉ',
        color: 'darkgrey',
        opacity: 0.3,
        // font: 'Courier',
        bold: true,
        // italics: true
      };
    }

    cb(null, dd);

  }, function (error) {
    cb(error);
  });

}

function genSalePdf2(company, id, cb) {
  const SaleItem = SaleItemClass({id: company.id,});

  const Sale = SaleClass({id: company.id,});

  function getSale() {
    return new Promise((resolve, reject) => {
      const query = new Parse.Query(Sale);
      query.include(['customer']);
      query.get(id, {
        success(sale){
          resolve(sale.toJSON());
        },

        error(error){
          reject(error);
        },
      })
    });
  }

  function getSaleItems() {
    const query = new Parse.Query(SaleItem);
    query.equalTo('sale', Sale.createWithoutData(id));

    query.include(['item']);

    return query.find().then(items => items.map(item => item.toJSON()));
  }


  Promise.all([
    readCompanyLogoBase64(company),
    getSale(),
    getSaleItems(),
  ]).then(function ([ logo, sale, _items, ]) {

    const VAT_percentages = {};

    const subtotalHT = sale.totalHT;

    const itemsTotalDiscount = _items
      .reduce((sum, {qty, rate, discountPart : itemDiscountPart, VATPart : itemVATPart,}) => {

        const entryValue = qty * rate;

        const amountHT__BeforeDiscount = itemGetAmount__HT(entryValue, itemVATPart);

        const itemDiscount = itemGetDiscount(amountHT__BeforeDiscount, itemDiscountPart);

        return sum + itemDiscount;
      }, 0.0);

    const totalDiscount = getTotalDiscount(subtotalHT - itemsTotalDiscount, {
      type: sale.discountType,
      value: sale.discountValue,
    });

    const discount = totalDiscount + itemsTotalDiscount;

    const noQty = _items.filter(({item, qty}) => {
      return (item.type === 'Service' || item.type === 2) && qty === 1;
    });

    const items = _items.map(function ({description, item, qty, rate, discountPart : itemDiscountPart, VATPart : itemVATPart,}) {

      const entryValue = qty * rate;

      const amountHT__BeforeDiscount = itemGetAmount__HT(entryValue, itemVATPart);

      const itemTotalDiscount = itemGetTotalDiscountPart(amountHT__BeforeDiscount, itemDiscountPart);

      const amountHT = amountHT__BeforeDiscount - itemTotalDiscount;

      const taxableAmount = amountHT;

      function itemGetTotalDiscountPart(amountHT__BeforeDiscount, itemDiscountPart) {
        const itemDiscount = itemGetDiscount(amountHT__BeforeDiscount, itemDiscountPart);

        const amountPercentage = (amountHT__BeforeDiscount * 100 / subtotalHT);

        const discountPart = amountPercentage / 100 * totalDiscount;

        return itemDiscount + discountPart;
      }

      if (itemVATPart && itemVATPart.value && itemVATPart.value !== 'Value_Exempt' && itemVATPart.value !== 4) {
        const {inputType, value = 'Value_Exempt',} = itemVATPart;

        switch (inputType) {
          case 1:
          case 'HT':

            (function () {
              if (!VAT_percentages[value]) {
                VAT_percentages[value] = 0;
              }

              const VAT = itemGeVATPart__Amount(taxableAmount, itemVATPart);

              VAT_percentages[value] = +VAT;
            })();
            break;

          case 2:
          case 'TTC':

            (function () {
              if (!VAT_percentages[value]) {
                VAT_percentages[value] = 0;
              }

              const VAT = itemGeVATPart__Amount(taxableAmount, itemVATPart);

              VAT_percentages[value] = +VAT;
            })();
            break;

          case 3:
          case 'NO_VAT':

            break;

          default:
        }
      }

      if (noQty) {
        return discount > 0.0 ? [

          {
            text: item
              ? item.displayName || description
              : description, style: ['firstHeaderRow', 'bold'],
          },

          {text: formatMoney(taxableAmount), style: ['headerRow', 'alignLeft'],},

          {text: formatMoney(qty * taxableAmount), style: ['headerRow', 'alignLeft'],},

          {
            text: String(itemVATPart && itemVATPart.value
              ? VAT_VALUE_FORMATTED[itemVATPart.value]
              : 'Exonéré'), style: ['headerRow', 'alignLeft'],
          },

          {text: formatMoney(itemTotalDiscount), style: ['lastHeaderRow', 'alignRight'],},

        ] : [

          {
            text: item
              ? item.displayName || description
              : description, style: ['firstHeaderRow', 'bold'],
          },

          {text: formatMoney(taxableAmount), style: ['headerRow', 'alignLeft'],},

          {text: formatMoney(qty * taxableAmount), style: ['headerRow', 'alignLeft'],},

          {
            text: String(itemVATPart && itemVATPart.value
              ? VAT_VALUE_FORMATTED[itemVATPart.value]
              : 'Exonéré'), style: ['lastHeaderRow', 'alignLeft'],
          },
        ];
      }

      return discount > 0.0 ? [

        {
          text: item
            ? item.displayName || description
            : description, style: ['firstHeaderRow', 'bold'],
        },

        {text: String(qty), style: ['headerRow', 'alignCenter'],},

        {text: formatMoney(taxableAmount), style: ['headerRow', 'alignCenter'],},

        {text: formatMoney(qty * taxableAmount), style: ['headerRow', 'alignLeft'],},

        {
          text: String(itemVATPart && itemVATPart.value
            ? VAT_VALUE_FORMATTED[itemVATPart.value]
            : 'Exonéré'), style: ['headerRow', 'alignRight'],
        },

        {text: formatMoney(itemTotalDiscount), style: ['lastHeaderRow', 'alignRight'],},

      ] : [

        {
          text: item
            ? item.displayName || description
            : description, style: ['firstHeaderRow', 'bold'],
        },

        {text: String(qty), style: ['headerRow', 'alignCenter'],},

        {text: formatMoney(taxableAmount), style: ['headerRow', 'alignCenter'],},

        {text: formatMoney(qty * taxableAmount), style: ['headerRow', 'alignLeft'],},

        {
          text: String(itemVATPart && itemVATPart.value
            ? VAT_VALUE_FORMATTED[itemVATPart.value]
            : 'Exonéré'), style: ['lastHeaderRow', 'alignRight'],
        },
      ];
    });

    const {
      IF,
    } = getCompanyVATSettings(company);

    const VATEnabled = company.has('VATEnabled') ? company.get('VATEnabled') : false;

    const Name = company.has('displayName') ? company.get('displayName') : null;
    const Email = company.has('email') ? company.get('email') : null;
    const Site = company.has('webSite') ? company.get('webSite') : null;
    const LegalForm = company.has('legalForm') ? company.get('legalForm') : null;
    const RC = company.has('rc') ? company.get('rc') : null;
    const Address = (company.has('address') ? company.get('address') : '\n\n').split('\n');

    const hasVAT = sale.VAT > 0;

    const dd = {
      pageMargins: logo ? [25, 100, 25, 50] : [0, 0, 0, 50],

      pageSize: 'LEGAL',
      pageOrientation: 'portrait',

      content: [],

      styles: {

        logo: {},

        companyName: {
          bold: true,
          fontSize: 22,
        },

        line: {
          margin: [0, 10, 0, 0],
        },

        line2: {
          margin: [0, 4, 0, 0],
        },
        line3: {
          margin: [0, 0, 0, 0],
        },

        addressLine: {
          // italics: true,
          // color: 'darkgrey',
        },

        title: {
          margin: [0, 25, 0, 15],
          fontSize: 20,
          color: '#169cee',
        },

        customerInfoHeader: {
          bold: true,
          fontSize: 14,
        },

        bold: {
          bold: true,
        },

        italic: {
          // italics: true,
        },

        headerTable: {
          fontSize: 9,
          color: '#169cee',
          fillColor: '#e3eaf3',
          margin: [-25, 30, -25, 0],
        },

        bodyTable: {
          fontSize: 9,
          // color: '#169cee',
          // fillColor: '#e3eaf3',
          margin: [-25, 0, -25, 15],
        },

        firstHeaderRow: {
          margin: [25, 3, 0, 3],
        },

        lastHeaderRow: {
          margin: [0, 3, 25, 3],
        },

        headerRow: {
          margin: [15, 3],
        },

        'VAT-introText': {
          fontSize: 14,
          margin: [0, 30, 0, 5]
        },

        alignRight: {
          alignment: 'right',
        },

        alignLeft: {
          alignment: 'left',
        },

        alignCenter: {
          alignment: 'center',
        },

        'VAT-tableHeader': {
          fontSize: 9,
          color: '#169cee',
          fillColor: '#e3eaf3',
          margin: [-25, 5, -25, 0],
        },

        'VAT-bodyTable': {
          fontSize: 9,
          // color: '#169cee',
          // fillColor: '#e3eaf3',
          margin: [-25, 0, -25, 30],
        },

        totalsTable: {
          margin: [0, 15, 0, 0],
        },

      },

      images: {
        logo: logo ? logo.uri : undefined,
      },

      defaultStyle: {
        fontSize: 9,
      },

      footer: function () {

        const Line1Text = function () {
          const displayName = company.get('displayName');
          const capital = company.get('capital');

          const legalFormText = (LegalForm ? ' ' + legalFormsTextMap[String(LegalForm)] : '');

          return compact(
            [displayName + legalFormText, isEmpty(capital) ? null : ['CAPITAL', capital].join(' ')]).join(' · ');
        }();

        const MoreInfo = function () {

          const addr = [compact([
            company.get('company_streetAddress'),
            company.get('company_postalCode'),
            company.get('company_cityTown'),
          ]).join(', ')];

          const ICE = isEmpty(company.get('ice')) ? [] : ['ICE' + ' : ' + company.get('ice')];
          const RC = isEmpty(company.get('rc')) ? [] : ['RC' + ' : ' + company.get('rc')];
          const Patente = isEmpty(company.get('patente')) ? [] : ['Patente' + ' : ' + company.get('patente')];
          const IF = isEmpty(company.get('if')) ? [] : ['IF' + ' : ' + company.get('if')];
          const CNSS = isEmpty(company.get('cnss')) ? [] : ['CNSS' + ' : ' + company.get('cnss')];

          return compact([
            ...addr,
            ...ICE,
            ...RC,
            ...Patente,
            ...IF,
            ...CNSS,
          ]).join(' · ');
        }();

        const ContactInfo = function () {
          const Tel = isEmpty(company.get('tel')) ? [] : ['Tél' + ' : ' + company.get('tel')];
          const Fax = isEmpty(company.get('fax')) ? [] : ['Fax' + ' : ' + company.get('fax')];
          const Email = isEmpty(company.get('email')) ? [] : ['E-mail' + ' : ' + company.get('email')];
          const Website = isEmpty(company.get('webSite')) ? [] : ['Web' + ' : ' + company.get('webSite')];

          return compact([
            ...Tel,
            ...Fax,
            ...Email,
            ...Website,
          ]).join(' · ');
        }();

        return {
          margin: [50],
          columns: [
            {width: '*', text: ''},

            {
              width: 'auto',
              style: ['alignCenter'],
              table: {
                widths: ['100%'],
                body: [

                  // line
                  [{
                    columnGap: -7,
                    columns: [

                      {
                        width: '30%',
                        table: {
                          widths: ['*'],
                          body: [[' '], [' ']]
                        },
                        layout: {
                          hLineColor: function (i, node) {
                            return '#169cee';
                          },
                          hLineWidth: function (i, node) {
                            return i === 0 ? 1 : 0;
                          },
                          vLineWidth: function (i, node) {
                            return 0;
                          },
                        }
                      },

                      {
                        width: '30%',
                        text: Line1Text,
                        marginTop: -5,
                        marginLeft: 7,
                        marginRight: 7,
                        style: ['bold'],
                      },

                      {
                        width: '30%',
                        table: {
                          widths: ['*'],
                          body: [[' '], [' ']]
                        },
                        layout: {
                          hLineColor: function (i, node) {
                            return '#169cee';
                          },
                          hLineWidth: function (i, node) {
                            return i === 0 ? 1 : 0;
                          },
                          vLineWidth: function (i, node) {
                            return 0;
                          },
                        }
                      },

                    ],
                    style: ['alignCenter'],
                    absolutePosition: {x: 50, y: 0,},
                  }],

                  // more info,
                  [{
                    columns: [
                      {
                        table: {
                          widths: ['100%'],
                          body: [
                            [{
                              text: MoreInfo,
                              style: ['bold'],
                            }]
                          ],
                        }, layout: 'noBorders',
                      },
                    ],
                    style: ['alignCenter'],
                    absolutePosition: {x: 25, y: 10,},
                  }],

                  // contact info
                  [{
                    columns: [
                      {
                        table: {
                          widths: ['100%'],
                          body: [
                            [{
                              text: ContactInfo,
                              style: ['bold'],
                            }]
                          ],
                        }, layout: 'noBorders',
                      },
                    ],
                    style: ['alignCenter'],
                    absolutePosition: {x: 25, y: 25,},
                  }],

                ],

              },

              layout: 'noBorders',
            },

            {width: '*', text: ''},
          ]
        };
      },

    };

    const _date = moment().format('l');
    const refNo = String(sale.refNo);
    const _city = company.has('company_cityTown') ? company.get('company_cityTown') + ' ' : '';

    // Company name
    if (logo) {

      dd.header = {
        margin: [25],
        columns: [
          {
            table: {
              widths: ['50%', '50%'],
              body: [
                [
                  {
                    image: 'logo',

                    // fit: [ logo.width, logo.height ],

                    // width: 512, height: 128,
                    width: logo.width, height: logo.height,

                    style: ['alignLeft'],

                  },

                  {
                    table: {
                      widths: ['100%'],
                      body: [

                        // ROW #1
                        [{
                          text: 'Facture',
                          fontSize: 30,
                          margin: [25, 25],
                          absolutePosition: {x: 450, y: 25,},
                          style: ['bold', 'italic',],
                        }],

                        // ROW #2
                        [{
                          text: `${_city}le : ${_date}`,
                          absolutePosition: {x: 537 - (_date.length + _city.length - 1) * 5.2, y: 60,},
                        }],

                        // ROW #3
                        [{
                          text: `Numéro : ${refNo}`,
                          absolutePosition: {x: 506 - refNo.length * 5.2, y: 72,},
                        }],

                      ],
                    },

                    layout: 'noBorders',

                  },

                ],

              ]
            },
            layout: 'noBorders',
          }
        ]
      };

    } else {

      dd.content.push({
        margin: [25],
        columns: [
          {
            table: {
              widths: ['50%', '50%'],
              body: [
                [
                  {
                    text: company.get('displayName'),
                    style: ['companyName', 'alignLeft', 'bold'],
                    absolutePosition: {x: 25, y: 25,},

                  },

                  {
                    table: {
                      widths: ['100%'],
                      body: [

                        // ROW #1
                        [{
                          text: 'Facture',
                          fontSize: 30,
                          margin: [25, 25],
                          absolutePosition: {x: 450, y: 25,},
                          style: ['bold', 'italic',],
                        }],

                        // ROW #2
                        [{
                          text: `le, ${_date}`,
                          absolutePosition: {x: 537 - _date.length * 5.2, y: 58,},
                        }],

                        // ROW #3
                        [{
                          text: `Numéro : ${refNo}`,
                          absolutePosition: {x: 506 - refNo.length * 5.2, y: 69,},
                        }],

                      ],
                    },

                    layout: 'noBorders',
                  },

                ],

              ]
            },
            layout: 'noBorders',
          }
        ]
      });
    }

    // Company info

    const eName = sale.customer.displayName;
    const eCompany = sale.customer.affiliation;
    const eAddr = compact([
      sale.customer.billing_streetAddress,
      sale.customer.billing_cityTown,
      sale.customer.billing_postalCode,
    ]).join(', ');
    const eCity = sale.customer.billing_cityTown;
    const eTel = sale.customer.phone || sale.customer.mobile;

    dd.content.push({
      marginLeft: 175,
      columns: [
        {
          width: 350,
          table: {
            widths: ['100%'],
            body: [
              [{
                marginLeft: 5,
                marginTop: -5,
                marginBottom: 5,
                columns: [
                  {
                    width: 75,
                    stack: function () {
                      const stack = [];

                      if (eName) {
                        stack.push({text: 'Adressé à:', style: ['line', 'addressLine'],});
                      }
                      if (!isEmpty(eCompany)) {
                        stack.push({text: 'Société:', style: ['line', 'addressLine'],});
                      }

                      if (!isEmpty(eAddr)) {
                        stack.push({text: 'Adresse:', style: ['line', 'addressLine'],});
                      }

                      if (eCity) {
                        stack.push({text: 'Ville:', style: ['line', 'addressLine'],});
                      }

                      if (eTel) {
                        stack.push({text: 'Tél:', style: ['line', 'addressLine'],});
                      }

                      return stack;
                    }(),
                  },

                  {
                    stack: function () {
                      const stack = [];

                      if (eName) {
                        stack.push({text: eName, style: ['bold', 'line', 'addressLine'],});
                      }
                      if (!isEmpty(eCompany)) {
                        stack.push({text: eCompany, style: ['bold', 'line', 'addressLine'],});
                      }

                      if (!isEmpty(eAddr)) {
                        stack.push({text: eAddr, style: ['bold', 'line', 'addressLine'],});
                      }

                      if (eCity) {
                        stack.push({text: eCity, style: ['bold', 'line', 'addressLine'],});
                      }

                      if (eTel) {
                        stack.push({text: eTel, style: ['bold', 'line', 'addressLine'],});
                      }

                      return stack;
                    }(),
                  }

                ],
              }]
            ]
          },
          layout: {
            hLineWidth: function (i, node) {
              return 0.7;
            },
            vLineWidth: function (i, node) {
              return 0.7;
            },
          },
        }
      ]

    });

    // Title
    // dd.content.push({
    //   text: 'Facture',
    //   style: 'title',
    // });

    // Invoice details + Customer details
    // dd.content.push({
    //
    //   columns: [
    //
    //     // Invoice details
    //     {
    //       columns: [
    //
    //         {
    //           stack: function () {
    //             const stack = [];
    //
    //             stack.push({
    //               text: 'Date',
    //               style: ['line', 'bold',],
    //             });
    //
    //             stack.push({
    //               text: 'N°',
    //               style: ['line', 'bold',],
    //             });
    //
    //             stack.push({
    //               text: 'Paiement dû',
    //               style: ['line', 'bold',],
    //             });
    //
    //             stack.push({
    //               text: 'Conditions',
    //               style: ['line', 'bold',],
    //             });
    //
    //             return stack;
    //           }(),
    //           alignment: 'right',
    //           width: '*',
    //         },
    //
    //         {
    //           stack: function () {
    //             const stack = [];
    //
    //             stack.push({
    //               text: moment(sale.date).format('ll'),
    //               style: ['line'],
    //             });
    //
    //             stack.push({
    //               text: String(sale.refNo),
    //               style: ['line'],
    //             });
    //
    //             stack.push({
    //               text: moment(sale.date).format('ll'),
    //               style: ['line'],
    //             });
    //
    //             if (sale.terms === 5 || sale.terms === 'Custom') {
    //               const numDays = Math.abs(moment(sale.date).diff(moment(sale.date), 'days'));
    //
    //               stack.push({
    //                 text: `${numDays} jour${numDays > 1 ? 's' : ''}`,
    //                 style: ['line'],
    //               });
    //
    //             } else {
    //
    //               stack.push({
    //                 text: TermsMap[sale.terms],
    //                 style: ['line'],
    //               });
    //
    //             }
    //
    //             return stack;
    //           }(),
    //           alignment: 'left',
    //         },
    //
    //       ],
    //
    //       columnGap: 10,
    //       margin: [25, 0, 0, 0,],
    //     },
    //
    //     // Customer details
    //     {
    //       stack: function () {
    //         const stack = [];
    //
    //         stack.push({
    //           text: 'DESTINATAIRE',
    //           style: ['customerInfoHeader', 'line'],
    //         });
    //
    //         if (sale.customer) {
    //           stack.push({text: sale.customer.displayName, style: ['line2']});
    //         }
    //
    //         const billingAddress = sale.billingAddress
    //           ? sale.billingAddress.split('\n')
    //           : (sale.customer ? getCustomerBillingAddress(sale.customer) : []);
    //
    //         billingAddress.forEach(function (line) {
    //           stack.push({text: line, style: sale.customer ? ['line', 'addressLine'] : ['line2', 'addressLine']});
    //         });
    //
    //         return stack;
    //       }(),
    //     },
    //
    //   ],
    //
    //   columnGap: 50,
    //
    // });

    // Line sep
    // dd.content.push({
    //   table: {
    //     widths: ['*'],
    //     body: [[' '], [' ']]
    //   },
    //   layout: {
    //     hLineColor: function (i, node) {
    //       return '#169cee';
    //     },
    //     hLineWidth: function (i, node) {
    //       return (i === 0 || i === node.table.body.length) ? 0 : 0.5;
    //     },
    //     vLineWidth: function (i, node) {
    //       return 0;
    //     },
    //   }
    // });

    // Items header row
    dd.content.push({
      style: 'headerTable',
      marginTop: 50,
      marginLeft: 15,
      marginRight: 15,
      width: 550,
      table: {
        widths: function () {
          if (noQty) {
            return discount > 0.0 ? ['*', 115, 115, 50, 75] : ['*', 115, 115, 50];
          }
          return discount > 0.0 ? ['*', 50, 115, 115, 50, 75] : ['*', 50, 115, 115, 50];
        }(),
        body: [
          function () {

            if (noQty) {
              return discount > 0.0 ? [
                {text: 'PRESTATION', style: ['firstHeaderRow'],},
                {text: 'P. U.', style: ['headerRow', 'alignLeft']},
                {text: 'MONTANT', style: ['headerRow', 'alignLeft'],},
                {text: 'TVA', style: ['headerRow', 'alignLeft'],},
                {text: 'REMISE', style: ['lastHeaderRow', 'alignRight'],},
              ] : [
                {text: 'PRESTATION', style: ['firstHeaderRow'],},
                {text: 'P. U.', style: ['headerRow', 'alignLeft'],},
                {text: 'MONTANT', style: ['headerRow', 'alignLeft'],},
                {text: 'TVA', style: ['lastHeaderRow', 'alignLeft'],},
              ];
            }

            return discount > 0.0 ? [
              {text: 'ACTIVITÉ', style: ['firstHeaderRow'],},
              {text: 'QTÉ', style: ['headerRow'],},
              {text: 'P. U.', style: ['headerRow'],},
              {text: 'MONTANT', style: ['headerRow', 'alignLeft'],},
              {text: 'TVA', style: ['headerRow', 'alignRight'],},
              {text: 'REMISE', style: ['lastHeaderRow', 'alignRight'],},
            ] : [
              {text: 'ACTIVITÉ', style: ['firstHeaderRow'],},
              {text: 'QTÉ', style: ['headerRow'],},
              {text: 'P. U.', style: ['headerRow'],},
              {text: 'MONTANT', style: ['headerRow', 'alignLeft'],},
              {text: 'TVA', style: ['lastHeaderRow', 'alignRight'],},
            ];

          }()
        ]
      },
      layout: 'noBorders',
    });

// Items table
    dd.content.push({
      style: 'bodyTable',
      marginLeft: 15,
      marginRight: 15,
      table: {
        widths: function () {
          if (noQty) {
            return discount > 0.0 ? ['*', 115, 115, 50, 75] : ['*', 115, 115, 50];
          }
          return discount > 0.0 ? ['*', 50, 115, 115, 50, 75] : ['*', 50, 115, 115, 50];
        }(),
        body: items
      },
      layout: 'noBorders',
    });

// Dash line
    dd.content.push({
      canvas: [
        {
          type: 'line',
          x1: 15,
          y1: 5,
          x2: 550,
          y2: 5,
          lineWidth: 0.5,
          dash: {length: 2,},
          lineColor: 'darkgrey',
          opacity: 0.8,
          strokeOpacity: 0.5,
        }
      ]
    });

    if (hasVAT) {

      dd.content.push({
        width: 550,
        marginLeft: 15,
        marginRight: 15,
        columns: [

          // Column 1
          {
            stack: [{
              columns: [
                {
                  width: 200,
                  table: {
                    widths: ['100%'],
                    body: [
                      [{
                        marginLeft: 5,
                        marginTop: -5,
                        marginBottom: 5,
                        columns: function () {
                          return [
                            {
                              width: 100,
                              stack: function () {
                                const stack = [];

                                stack.push({text: 'Mode de paiement:', style: ['line', 'addressLine'],});
                                stack.push({text: 'Nº:', style: ['line', 'addressLine'],});
                                stack.push({text: 'Date de paiement:', style: ['line', 'addressLine'],});

                                return stack;
                              }(),
                            },

                            {
                              stack: function () {
                                const stack = [];

                                stack.push({
                                  text: paymentMethod[sale.paymentMethod] || ' ',
                                  style: ['bold', 'line', 'addressLine'],
                                });
                                stack.push({
                                  text: sale.paymentRef || ' ',
                                  style: ['bold', 'line', 'addressLine'],
                                });
                                stack.push({
                                  text: moment(sale.date).format('l'),
                                  style: ['bold', 'line', 'addressLine'],
                                });

                                return stack;
                              }(),
                            }

                          ];
                        }(),
                      }]
                    ]
                  },
                  layout: {
                    hLineWidth: function (i, node) {
                      return 0.7;
                    },
                    vLineWidth: function (i, node) {
                      return 0.7;
                    },
                  }
                }
              ]
            }],
            width: 'auto',
            alignment: 'left',
            margin: [0, 15, 15, 0],
          },

          // Column 2
          {
            style: ['totalsTable'],
            table: {
              widths: ['*', 75, 75],
              body: [
                [
                  '',
                  {text: 'Total HT', style: ['line3'],},
                  {text: formatMoney(sale.totalHT), style: ['alignRight', 'line3'],},
                ],

                discount > 0
                  ? [
                  '',
                  {text: 'REMISE', style: ['line3'],},
                  {text: `-${formatMoney(discount)}`, style: ['alignRight', 'line3'],},
                ]
                  : [
                  '',
                  {text: '', style: ['line3'],},
                  {text: '', style: ['line3'],},
                ],

                // [
                //   '',
                //   {text: 'Total TVA', style: ['line3'],},
                //   {text: formatMoney(sale.VAT), style: ['alignRight', 'line3'],},
                // ],

                ...Object.keys(VAT_percentages).map(function (key) {
                  const amount = VAT_percentages[key];
                  return [
                    '',
                    {text: `TVA de ${VAT_VALUE_FORMATTED[key]}`, style: ['bold', 'line3'],},
                    {text: formatMoney(amount), style: ['alignRight', 'line3'],},
                  ];
                }),

                [
                  '',
                  {text: 'Total TTC', style: ['line3'],},
                  {text: formatMoney(sale.total), style: ['bold', 'alignRight', 'line3'],},
                ],

                // amountPaid > 0
                //   ? [
                //   '',
                //   {text: 'MONTANT REÇU', style: ['line3'],},
                //   {text: formatMoney(amountPaid), style: ['alignRight', 'line3'],},
                // ]
                //   : [
                //   '',
                //   {text: '', style: ['line3'],},
                //   {text: '', style: ['line3'],},
                // ],

                // [
                //   '',
                //   {text: 'SOLDE À PAYER', style: ['line3'],},
                //   {text: `${formatMoney(sale.balanceDue)} MAD`, style: ['alignRight', 'line3', 'bold'],},
                // ]
              ]
            },
            layout: 'noBorders',
          },

        ]
      });

    } else {

      dd.content.push({
        width: 550,
        marginLeft: 15,
        marginRight: 15,
        columns: [

          // Column 1
          {
            stack: [{
              columns: [
                {
                  width: 200,
                  table: {
                    widths: ['100%'],
                    body: [
                      [{
                        marginLeft: 5,
                        marginTop: -5,
                        marginBottom: 5,
                        columns: function () {
                          return [
                            {
                              width: 100,
                              stack: function () {
                                const stack = [];

                                stack.push({text: 'Mode de paiement:', style: ['line', 'addressLine'],});
                                stack.push({text: 'Nº:', style: ['line', 'addressLine'],});
                                stack.push({text: 'Date d\'expiration:', style: ['line', 'addressLine'],});

                                return stack;
                              }(),
                            },

                            {
                              stack: function () {
                                const stack = [];

                                stack.push({
                                  text: paymentMethod[sale.paymentMethod] || ' ',
                                  style: ['bold', 'line', 'addressLine'],
                                });
                                stack.push({
                                  text: sale.paymentRef || ' ',
                                  style: ['bold', 'line', 'addressLine'],
                                });
                                stack.push({
                                  text: moment(sale.date).format('l'),
                                  style: ['bold', 'line', 'addressLine'],
                                });

                                return stack;
                              }(),
                            }

                          ];
                        }(),
                      }]
                    ]
                  },
                  layout: {
                    hLineWidth: function (i, node) {
                      return 0.7;
                    },
                    vLineWidth: function (i, node) {
                      return 0.7;
                    },
                  }
                }
              ]
            }],
            width: 'auto',
            alignment: 'left',
            margin: [0, 15, 0, 0],
          },

          // Column 2
          {
            style: ['totalsTable'],
            table: {
              widths: ['*', 75, 75],
              body: [
                [
                  '',
                  {text: discount > 0 ? 'Sous-Total' : 'Total', style: ['line3'],},
                  {text: formatMoney(sale.total + discount), bold: (discount === 0), style: ['alignRight', 'line3'],},
                ],

                discount > 0
                  ? [
                  '',
                  {text: 'REMISE', style: ['line3'],},
                  {text: `-${formatMoney(discount)}`, style: ['alignRight', 'line3'],},
                ]
                  : [
                  '',
                  {text: '', style: ['line3'],},
                  {text: '', style: ['line3'],},
                ],

                discount > 0
                  ? [
                  '',
                  {text: 'Total', style: ['line3'],},
                  {text: formatMoney(sale.total), style: ['bold', 'alignRight', 'line3'],},
                ]
                  : [
                  '',
                  {text: '', style: ['line3'],},
                  {text: '', style: ['line3'],},
                ],

                // amountPaid > 0
                //   ? [
                //   '',
                //   {text: 'MONTANT REÇU', style: ['line'],},
                //   {text: formatMoney(amountPaid), style: ['alignRight', 'line3'],},
                // ]
                //   : [
                //   '',
                //   {text: '', style: ['line3'],},
                //   {text: '', style: ['line3'],},
                // ],

                // [
                //   '',
                //   {text: 'SOLDE À PAYER', style: ['line3'],},
                //   {text: `${formatMoney(sale.balanceDue)} MAD`, style: ['alignRight', 'line3', 'bold'],},
                // ]
              ]
            },
            layout: 'noBorders',
          }

        ]

      });

    }

    // Amount to text
    dd.content.push({
      marginTop: 25,
      marginLeft: 100,
      marginRight: 15,
      table: {
        widths: ['100%'],
        body: [

          [{
            columnGap: -7,
            columns: [
              {
                // alignment: 'left',
                text: 'Arrête la présente Facture à la somme de:',
              }, {
                // alignment: 'left',
                text: writtenNumber(sale.total, {lang: 'fr'}).toUpperCase() + ' DIRHAMS',
                bold: true,
              },
            ]
          }]
        ]
      },
      layout: {
        hLineWidth: function (i, node) {
          return 0.7;
        },
        vLineWidth: function (i, node) {
          return 0.7;
        },
      },
    });

    // cadre
    dd.content.push({
      marginTop: 25,
      marginLeft: 100,
      marginRight: 15,
      table: {
        widths: ['100%'],
        body: [

          [{
            columns: [
              {
                marginTop: 5,
                marginBottom: 75,
                alignment: 'center',
                text: 'Cadre reservé à la société',
              },
            ]
          }]
        ]
      },
      layout: {
        hLineWidth: function (i, node) {
          return 0.7;
        },
        vLineWidth: function (i, node) {
          return 0.7;
        },
      },
    });

    // if (hasVAT) {
    //
    //   const VAT_Items = [];
    //
    //   forEach(group(filter(_items, ({VATPart,}) => VATPart && VATPart.value && VATPart.value !== 4 && VATPart.value !== 'Value_Exempt'), ({VATPart,}) => VATPart.value), function (items, key) {
    //
    //     const {totalHT, totalVAT,} = items.reduce(function ({totalHT, totalVAT,}, {qty, rate, VATPart : {value, inputType : itemInputType,}}) {
    //
    //       const entryValue = qty * rate;
    //
    //       const VAT_percentage = value ? VAT_ID_TO_VALUE[value] : 0.0;
    //
    //       switch (itemInputType) {
    //         case 1:
    //         case 'HT':
    //
    //           // entryValue is HT
    //           totalHT += entryValue;
    //           totalVAT += VAT_percentage * entryValue;
    //
    //           break;
    //
    //         case 2:
    //         case 'TTC':
    //
    //           // entryValue is TTC
    //           (function () {
    //
    //             const entryValueHT = entryValue / (1 + VAT_percentage);
    //
    //             totalHT += entryValueHT;
    //             totalVAT += VAT_percentage * entryValueHT;
    //
    //           })();
    //
    //           break;
    //
    //         case 3:
    //         case 'NO_VAT':
    //
    //           totalHT += entryValue;
    //           totalVAT += VAT_percentage * entryValue;
    //
    //           break;
    //
    //         default:
    //
    //           throw new Error(`VAT component: Invalid item inputType`, itemInputType);
    //       }
    //
    //       return {totalHT, totalVAT,};
    //     }, {totalHT: 0.0, totalVAT: 0.0,});
    //
    //
    //     VAT_Items.push([
    //       {text: `TVA de ${VAT_VALUE_FORMATTED[key]}`, style: ['firstHeaderRow', 'alignRight'],},
    //       {text: formatMoney(totalVAT), style: ['headerRow', 'alignRight'],},
    //       {text: formatMoney(totalHT), style: ['lastHeaderRow', 'alignRight'],},
    //     ]);
    //   });
    //
    //   if (VAT_Items.length > 0) {
    //
    //     dd.content.push({
    //       text: 'RÉCAPITULATIF DE TVA',
    //       style: 'VAT-introText',
    //     });
    //
    //     // VAT table header row
    //     dd.content.push({
    //       style: ['VAT-tableHeader'],
    //       table: {
    //         widths: ['*', '*', '*'],
    //         body: [
    //           [
    //             {text: 'TAUX', style: ['firstHeaderRow', 'alignRight'],},
    //             {text: 'MONTANT DE TVA', style: ['headerRow', 'alignRight'],},
    //             {text: 'BASE HT', style: ['lastHeaderRow', 'alignRight'],},
    //           ]
    //         ]
    //       },
    //       layout: 'noBorders',
    //     });
    //
    //     // VAT table items
    //     dd.content.push({
    //       style: ['VAT-bodyTable'],
    //       table: {
    //         widths: ['*', '*', '*'],
    //         body: VAT_Items
    //       },
    //       layout: 'noBorders',
    //     });
    //   }
    //
// }

    if (sale.balanceDue === 0.0) {
      dd.watermark = 'PAYÉ';
      dd.watermark = {
        text: 'PAYÉ',
        color: 'darkgrey',
        opacity: 0.3,
        // font: 'Courier',
        bold: true,
        // italics: true
      };
    }

    cb(null, dd);

  }, function (error) {
    cb(error);
  });

}

function genInvoicePdf(company, id, cb) {
  const PaymentOfInvoicesItem = PaymentOfInvoicesItemClass({id: company.id,});

  const InvoiceItem = InvoiceItemClass({id: company.id,});

  const Invoice = InvoiceClass({id: company.id,});

  function getInvoice() {
    return new Promise((resolve, reject) => {
      const query = new Parse.Query(Invoice);
      query.include(['customer']);
      query.get(id, {
        success(invoice){
          resolve(invoice.toJSON());
        },

        error(error){
          reject(error);
        },
      })
    });
  }

  function getInvoiceItems() {
    const query = new Parse.Query(InvoiceItem);
    query.equalTo('invoice', Invoice.createWithoutData(id));

    query.include(['item']);

    return query.find().then(items => items.map(item => item.toJSON()));
  }

  function getInvoicePayments() {
    const query = new Parse.Query(PaymentOfInvoicesItem);
    query.equalTo('invoice', Invoice.createWithoutData(id));

    query.include(['payment']);

    return query.find().then(items => items.map(item => item.toJSON()));
  }

  Promise.all([
    getInvoice(),
    getInvoiceItems(),
    getInvoicePayments(),
  ]).then(function ([ invoice, _items, _payments, ]) {

    const subtotalHT = invoice.totalHT;

    const itemsTotalDiscount = _items
      .reduce((sum, {qty, rate, discountPart : itemDiscountPart, VATPart : itemVATPart,}) => {

        const entryValue = qty * rate;

        const amountHT__BeforeDiscount = itemGetAmount__HT(entryValue, itemVATPart);

        const itemDiscount = itemGetDiscount(amountHT__BeforeDiscount, itemDiscountPart);

        return sum + itemDiscount;
      }, 0.0);

    const totalDiscount = getTotalDiscount(subtotalHT - itemsTotalDiscount, {
      type: invoice.discountType,
      value: invoice.discountValue,
    });

    const items = _items.map(function ({description, item, qty, rate, discountPart : itemDiscountPart, VATPart : itemVATPart,}) {

      const entryValue = qty * rate;

      const amountHT__BeforeDiscount = itemGetAmount__HT(entryValue, itemVATPart);

      const itemTotalDiscount = itemGetTotalDiscountPart(amountHT__BeforeDiscount, itemDiscountPart);

      const amountHT = amountHT__BeforeDiscount - itemTotalDiscount;

      const taxableAmount = amountHT;

      function itemGetTotalDiscountPart(amountHT__BeforeDiscount, itemDiscountPart) {
        const itemDiscount = itemGetDiscount(amountHT__BeforeDiscount, itemDiscountPart);

        const amountPercentage = (amountHT__BeforeDiscount * 100 / subtotalHT);

        const discountPart = amountPercentage / 100 * totalDiscount;

        return itemDiscount + discountPart;
      }

      return [

        {
          text: item
            ? item.displayName || description
            : description, style: ['firstHeaderRow', 'bold'],
        },

        {text: String(qty), style: ['headerRow', 'alignCenter'],},

        {text: formatMoney(taxableAmount), style: ['headerRow', 'alignCenter'],},

        {text: formatMoney(qty * taxableAmount), style: ['headerRow', 'alignCenter'],},

        {
          text: String(itemVATPart && itemVATPart.value
            ? VAT_VALUE_FORMATTED[itemVATPart.value]
            : 'Exonéré'), style: ['lastHeaderRow', 'alignRight'],
        },
      ];
    });

    const {
      IF,
    } = getCompanyVATSettings(company);

    const VATEnabled = company.has('VATEnabled') ? company.get('VATEnabled') : false;

    const Email = company.has('email') ? company.get('email') : null;
    const Site = company.has('webSite') ? company.get('webSite') : null;
    const LegalForm = company.has('legalForm') ? company.get('legalForm') : null;
    const RC = company.has('rc') ? company.get('rc') : null;
    const Address = (company.has('address') ? company.get('address') : '\n\n').split('\n');

    const hasVAT = invoice.VAT > 0;

    const dd = {
      content: [],

      styles: {

        companyName: {
          bold: true,
        },

        line: {
          margin: [0, 10, 0, 0],
        },

        line2: {
          margin: [0, 4, 0, 0],
        },
        line3: {
          margin: [0, 5, 0, 0],
        },

        addressLine: {
          // italics: true,
          // color: 'darkgrey',
        },

        title: {
          margin: [0, 25, 0, 15],
          fontSize: 20,
          color: '#169cee',
        },

        customerInfoHeader: {
          bold: true,
          fontSize: 14,
        },

        bold: {
          bold: true,
        },

        headerTable: {
          fontSize: 9,
          color: '#169cee',
          fillColor: '#e3eaf3',
          margin: [-25, 30, -25, 0],
        },

        bodyTable: {
          fontSize: 9,
          // color: '#169cee',
          // fillColor: '#e3eaf3',
          margin: [-25, 0, -25, 15],
        },

        firstHeaderRow: {
          margin: [25, 3, 0, 3],
        },

        lastHeaderRow: {
          margin: [0, 3, 25, 3],
        },

        headerRow: {
          margin: [15, 3],
        },

        'VAT-introText': {
          fontSize: 14,
          margin: [0, 30, 0, 5]
        },

        alignRight: {
          alignment: 'right',
        },

        alignLeft: {
          alignment: 'left',
        },

        alignCenter: {
          alignment: 'center',
        },

        'VAT-tableHeader': {
          fontSize: 9,
          color: '#169cee',
          fillColor: '#e3eaf3',
          margin: [-25, 5, -25, 0],
        },

        'VAT-bodyTable': {
          fontSize: 9,
          // color: '#169cee',
          // fillColor: '#e3eaf3',
          margin: [-25, 0, -25, 30],
        },

        totalsTable: {
          margin: [0, 15, 0, 0],
        },

      },

      defaultStyle: {
        fontSize: 9,
      },

    };

    // Company name
    dd.content.push({
      text: company.get('displayName'),
      style: 'companyName',
    });

    // Company info
    dd.content.push({

      columns: [

        {
          stack: function () {
            const stack = [];

            Address.forEach(function (line) {
              stack.push({text: line, style: ['line', 'addressLine'],});
            });

            if (Email) {
              stack.push({text: Email, style: ['line', 'addressLine'],});
            }

            if (Site) {
              stack.push({text: Site, style: ['line', 'addressLine'],});
            }

            if (VATEnabled) {
              stack.push({text: `N° de TVA : ${IF}`, style: ['line', 'addressLine'],});
            }

            if (LegalForm && LegalFormsMap[LegalForm]) {
              stack.push({text: LegalFormsMap[LegalForm], style: ['line', 'addressLine'],});
            }
            if (RC) {
              stack.push({text: RC, style: ['line', 'addressLine'],});
            }

            return stack;
          }(),
        }

      ],


    });

    // Title
    dd.content.push({
      text: 'Facture',
      style: 'title',
    });

    // Invoice details + Customer details
    dd.content.push({

      columns: [

        // Invoice details
        {
          columns: [

            {
              stack: function () {
                const stack = [];

                stack.push({
                  text: 'Date',
                  style: ['line', 'bold',],
                });

                stack.push({
                  text: 'N°',
                  style: ['line', 'bold',],
                });

                stack.push({
                  text: 'Paiement dû',
                  style: ['line', 'bold',],
                });

                stack.push({
                  text: 'Conditions',
                  style: ['line', 'bold',],
                });

                return stack;
              }(),
              alignment: 'right',
              width: '*',
            },

            {
              stack: function () {
                const stack = [];

                stack.push({
                  text: moment(invoice.date).format('ll'),
                  style: ['line'],
                });

                stack.push({
                  text: String(invoice.refNo),
                  style: ['line'],
                });

                stack.push({
                  text: moment(invoice.dueDate).format('ll'),
                  style: ['line'],
                });

                if (invoice.terms === 5 || invoice.terms === 'Custom') {
                  const numDays = Math.abs(moment(invoice.date).diff(moment(invoice.dueDate), 'days'));

                  stack.push({
                    text: `${numDays} jour${numDays > 1 ? 's' : ''}`,
                    style: ['line'],
                  });

                } else {

                  stack.push({
                    text: TermsMap[invoice.terms],
                    style: ['line'],
                  });

                }

                return stack;
              }(),
              alignment: 'left',
            },

          ],

          columnGap: 10,
          margin: [25, 0, 0, 0,],
        },

        // Customer details
        {
          stack: function () {
            const stack = [];

            stack.push({
              text: 'DESTINATAIRE',
              style: ['customerInfoHeader', 'line'],
            });

            if (invoice.customer) {
              stack.push({text: invoice.customer.displayName, style: ['line2']});
            }

            const billingAddress = invoice.billingAddress
              ? invoice.billingAddress.split('\n')
              : (invoice.customer ? getCustomerBillingAddress(invoice.customer) : []);

            billingAddress.forEach(function (line) {
              stack.push({text: line, style: invoice.customer ? ['line', 'addressLine'] : ['line2', 'addressLine']});
            });

            return stack;
          }(),
        },

      ],

      columnGap: 50,

    });

    // Line sep
    dd.content.push({
      table: {
        widths: ['*'],
        body: [[' '], [' ']]
      },
      layout: {
        hLineColor: function (i, node) {
          return '#169cee';
        },
        hLineWidth: function (i, node) {
          return (i === 0 || i === node.table.body.length) ? 0 : 0.5;
        },
        vLineWidth: function (i, node) {
          return 0;
        },
      }
    });

    // Items header row
    dd.content.push({
      style: 'headerTable',
      table: {
        widths: ['*', 50, 115, 75, 115],
        body: [
          [
            {text: 'ACTIVITÉ', style: ['firstHeaderRow'],},
            {text: 'QTÉ', style: ['headerRow'],},
            {text: 'TAUX/PRIX UNIT.', style: ['headerRow'],},
            {text: 'MONTANT', style: ['headerRow'],},
            {text: 'TVA', style: ['lastHeaderRow', 'alignRight'],},
          ]
        ]
      },
      layout: 'noBorders',
    });

    // Items table
    dd.content.push({
      style: 'bodyTable',
      table: {
        widths: ['*', 50, 115, 75, 115],
        body: items
      },
      layout: 'noBorders',
    });

    // Dash line
    dd.content.push({
      canvas: [
        {
          type: 'line',
          x1: 0,
          y1: 5,
          x2: 520,
          y2: 5,
          lineWidth: 0.5,
          dash: {length: 2,},
          lineColor: 'darkgrey',
          opacity: 0.8,
          strokeOpacity: 0.5,
        }
      ]
    });

    if (hasVAT) {

      const amountPaid = _payments.reduce(function (sum, next) {
        return sum + next.amount;
      }, 0.0);

      const discount = totalDiscount + itemsTotalDiscount;

      dd.content.push({
        columns: [

          // Column 1
          {
            stack: invoice.balanceDue === 0 && _payments.length > 0
              ? [
              `Mode de paiement: ${paymentMethod[_payments[_payments.length - 1].payment.paymentMethod]}`
            ]
              : [],
            width: 'auto',
            alignment: 'left',
            margin: [0, 15, 0, 0],
          },

          // Column 2
          {
            style: ['totalsTable'],
            table: {
              widths: ['*', 75, 75],
              body: [
                [
                  '',
                  {text: 'Total HT', style: ['line3'],},
                  {text: formatMoney(invoice.totalHT), style: ['alignRight', 'line3'],},
                ],

                discount > 0
                  ? [
                  '',
                  {text: 'REMISE', style: ['line3'],},
                  {text: `-${formatMoney(discount)}`, style: ['alignRight', 'line3'],},
                ]
                  : [
                  '',
                  {text: '', style: ['line3'],},
                  {text: '', style: ['line3'],},
                ],

                [
                  '',
                  {text: 'Total TVA', style: ['line3'],},
                  {text: formatMoney(invoice.VAT), style: ['alignRight', 'line3'],},
                ],
                [
                  '',
                  {text: 'Total TTC', style: ['line'],},
                  {text: formatMoney(invoice.total), style: ['alignRight', 'line3'],},
                ],

                amountPaid > 0
                  ? [
                  '',
                  {text: 'MONTANT REÇU', style: ['line3'],},
                  {text: formatMoney(amountPaid), style: ['alignRight', 'line3'],},
                ]
                  : [
                  '',
                  {text: '', style: ['line3'],},
                  {text: '', style: ['line3'],},
                ],

                [
                  '',
                  {text: 'SOLDE À PAYER', style: ['line3'],},
                  {text: `${formatMoney(invoice.balanceDue)} MAD`, style: ['alignRight', 'line3', 'bold'],},
                ]
              ]
            },
            layout: 'noBorders',
          },

        ]
      });

    } else {

      const amountPaid = _payments.reduce(function (sum, next) {
        return sum + next.amount;
      }, 0.0);

      const discount = totalDiscount + itemsTotalDiscount;

      dd.content.push({

        columns: [

          // Column 1
          {
            stack: invoice.balanceDue === 0 && _payments.length > 0
              ? [
              `Mode de paiement: ${paymentMethod[_payments[_payments.length - 1].paymentMethod]}`
            ]
              : [],
            width: 'auto',
            alignment: 'left',
            margin: [0, 15, 0, 0],
          },

          // Column 2
          {
            style: ['totalsTable'],
            table: {
              widths: ['*', 75, 75],
              body: [
                [
                  '',
                  {text: 'Total', style: ['line3'],},
                  {text: formatMoney(invoice.total), style: ['alignRight', 'line3'],},
                ],

                discount > 0
                  ? [
                  '',
                  {text: 'REMISE', style: ['line3'],},
                  {text: `-${formatMoney(discount)}`, style: ['alignRight', 'line3'],},
                ]
                  : [
                  '',
                  {text: '', style: ['line3'],},
                  {text: '', style: ['line3'],},
                ],

                amountPaid > 0
                  ? [
                  '',
                  {text: 'MONTANT REÇU', style: ['line'],},
                  {text: formatMoney(amountPaid), style: ['alignRight', 'line3'],},
                ]
                  : [
                  '',
                  {text: '', style: ['line3'],},
                  {text: '', style: ['line3'],},
                ],

                [
                  '',
                  {text: 'SOLDE À PAYER', style: ['line3'],},
                  {text: `${formatMoney(invoice.balanceDue)} MAD`, style: ['alignRight', 'line3', 'bold'],},
                ]
              ]
            },
            layout: 'noBorders',
          }

        ]

      });

    }

    if (hasVAT) {

      const VAT_Items = [];

      forEach(group(filter(_items, ({VATPart,}) => VATPart && VATPart.value && VATPart.value !== 4 && VATPart.value !== 'Value_Exempt'), ({VATPart,}) => VATPart.value), function (items, key) {

        const {totalHT, totalVAT,} = items.reduce(function ({totalHT, totalVAT,}, {qty, rate, VATPart : {value, inputType : itemInputType,}}) {

          const entryValue = qty * rate;

          const VAT_percentage = value ? VAT_ID_TO_VALUE[value] : 0.0;

          switch (itemInputType) {
            case 1:
            case 'HT':

              // entryValue is HT
              totalHT += entryValue;
              totalVAT += VAT_percentage * entryValue;

              break;

            case 2:
            case 'TTC':

              // entryValue is TTC
              (function () {

                const entryValueHT = entryValue / (1 + VAT_percentage);

                totalHT += entryValueHT;
                totalVAT += VAT_percentage * entryValueHT;

              })();

              break;

            case 3:
            case 'NO_VAT':

              totalHT += entryValue;
              totalVAT += VAT_percentage * entryValue;

              break;

            default:

              throw new Error(`VAT component: Invalid item inputType`, itemInputType);
          }

          return {totalHT, totalVAT,};
        }, {totalHT: 0.0, totalVAT: 0.0,});


        VAT_Items.push([
          {text: `TVA de ${VAT_VALUE_FORMATTED[key]}`, style: ['firstHeaderRow', 'alignRight'],},
          {text: formatMoney(totalVAT), style: ['headerRow', 'alignRight'],},
          {text: formatMoney(totalHT), style: ['lastHeaderRow', 'alignRight'],},
        ]);
      });

      if (VAT_Items.length > 0) {

        dd.content.push({
          text: 'RÉCAPITULATIF DE TVA',
          style: 'VAT-introText',
        });

        // VAT table header row
        dd.content.push({
          style: ['VAT-tableHeader'],
          table: {
            widths: ['*', '*', '*'],
            body: [
              [
                {text: 'TAUX', style: ['firstHeaderRow', 'alignRight'],},
                {text: 'MONTANT DE TVA', style: ['headerRow', 'alignRight'],},
                {text: 'BASE HT', style: ['lastHeaderRow', 'alignRight'],},
              ]
            ]
          },
          layout: 'noBorders',
        });

        // VAT table items
        dd.content.push({
          style: ['VAT-bodyTable'],
          table: {
            widths: ['*', '*', '*'],
            body: VAT_Items
          },
          layout: 'noBorders',
        });
      }

    }

    if (invoice.balanceDue === 0.0) {
      dd.watermark = 'Payé';
      // dd.watermark = {
      //   text: 'Payé',
      //   color: 'darkgrey',
      //   opacity: 0.3,
      //   // font: 'Courier',
      //   bold: true,
      //   italics: true
      // };
    }

    cb(null, dd);

  }, function (error) {
    cb(error);
  });

}

function genSalePdf(company, id, cb) {
  const SaleItem = SaleItemClass({id: company.id,});

  const Sale = SaleClass({id: company.id,});

  function getSale() {
    return new Promise((resolve, reject) => {
      const query = new Parse.Query(Sale);
      query.include(['customer']);
      query.get(id, {
        success(sale){
          resolve(sale.toJSON());
        },

        error(error){
          reject(error);
        },
      })
    });
  }

  function getSaleItems() {
    const query = new Parse.Query(SaleItem);
    query.equalTo('sale', Sale.createWithoutData(id));

    query.include(['item']);

    return query.find().then(items => items.map(item => item.toJSON()));
  }


  Promise.all([
    getSale(),
    getSaleItems(),
  ]).then(function ([ sale, _items, ]) {

    const subtotalHT = sale.totalHT;

    const itemsTotalDiscount = _items
      .reduce((sum, {qty, rate, discountPart : itemDiscountPart, VATPart : itemVATPart,}) => {

        const entryValue = qty * rate;

        const amountHT__BeforeDiscount = itemGetAmount__HT(entryValue, itemVATPart);

        const itemDiscount = itemGetDiscount(amountHT__BeforeDiscount, itemDiscountPart);

        return sum + itemDiscount;
      }, 0.0);

    const totalDiscount = getTotalDiscount(subtotalHT - itemsTotalDiscount, {
      type: sale.discountType,
      value: sale.discountValue,
    });

    const items = _items.map(function ({description, item, qty, rate, discountPart : itemDiscountPart, VATPart : itemVATPart,}) {

      const entryValue = qty * rate;

      const amountHT__BeforeDiscount = itemGetAmount__HT(entryValue, itemVATPart);

      const itemTotalDiscount = itemGetTotalDiscountPart(amountHT__BeforeDiscount, itemDiscountPart);

      const amountHT = amountHT__BeforeDiscount - itemTotalDiscount;

      const taxableAmount = amountHT;

      function itemGetTotalDiscountPart(amountHT__BeforeDiscount, itemDiscountPart) {
        const itemDiscount = itemGetDiscount(amountHT__BeforeDiscount, itemDiscountPart);

        const amountPercentage = (amountHT__BeforeDiscount * 100 / subtotalHT);

        const discountPart = amountPercentage / 100 * totalDiscount;

        return itemDiscount + discountPart;
      }

      return [

        {
          text: item
            ? item.displayName || description
            : description, style: ['firstHeaderRow', 'bold'],
        },

        {text: String(qty), style: ['headerRow', 'alignCenter'],},

        {text: formatMoney(taxableAmount), style: ['headerRow', 'alignCenter'],},

        {text: formatMoney(qty * taxableAmount), style: ['headerRow', 'alignCenter'],},

        {
          text: String(itemVATPart && itemVATPart.value
            ? VAT_VALUE_FORMATTED[itemVATPart.value]
            : 'Exonéré'), style: ['lastHeaderRow', 'alignRight'],
        },
      ];
    });

    const {
      IF,
    } = getCompanyVATSettings(company);

    const VATEnabled = company.has('VATEnabled') ? company.get('VATEnabled') : false;

    const Email = company.has('email') ? company.get('email') : null;
    const Site = company.has('webSite') ? company.get('webSite') : null;
    const LegalForm = company.has('legalForm') ? company.get('legalForm') : null;
    const RC = company.has('rc') ? company.get('rc') : null;
    const Address = (company.has('address') ? company.get('address') : '\n\n').split('\n');

    const hasVAT = sale.VAT > 0;

    const dd = {
      content: [],

      styles: {

        companyName: {
          bold: true,
        },

        line: {
          margin: [0, 10, 0, 0],
        },

        line2: {
          margin: [0, 4, 0, 0],
        },
        line3: {
          margin: [0, 5, 0, 0],
        },

        addressLine: {
          // italics: true,
          // color: 'darkgrey',
        },

        title: {
          margin: [0, 25, 0, 15],
          fontSize: 20,
          color: '#169cee',
        },

        customerInfoHeader: {
          bold: true,
          fontSize: 14,
        },

        bold: {
          bold: true,
        },

        headerTable: {
          fontSize: 9,
          color: '#169cee',
          fillColor: '#e3eaf3',
          margin: [-25, 30, -25, 0],
        },

        bodyTable: {
          fontSize: 9,
          // color: '#169cee',
          // fillColor: '#e3eaf3',
          margin: [-25, 0, -25, 15],
        },

        firstHeaderRow: {
          margin: [25, 3, 0, 3],
        },

        lastHeaderRow: {
          margin: [0, 3, 25, 3],
        },

        headerRow: {
          margin: [15, 3],
        },

        'VAT-introText': {
          fontSize: 14,
          margin: [0, 30, 0, 5]
        },

        alignRight: {
          alignment: 'right',
        },

        alignLeft: {
          alignment: 'left',
        },

        alignCenter: {
          alignment: 'center',
        },

        'VAT-tableHeader': {
          fontSize: 9,
          color: '#169cee',
          fillColor: '#e3eaf3',
          margin: [-25, 5, -25, 0],
        },

        'VAT-bodyTable': {
          fontSize: 9,
          // color: '#169cee',
          // fillColor: '#e3eaf3',
          margin: [-25, 0, -25, 30],
        },

        totalsTable: {
          margin: [0, 15, 0, 0],
        },

      },

      defaultStyle: {
        fontSize: 9,
      },

    };

    // Company name
    dd.content.push({
      text: company.get('displayName'),
      style: 'companyName',
    });

    // Company info
    dd.content.push({

      columns: [

        {
          stack: function () {
            const stack = [];

            Address.forEach(function (line) {
              stack.push({text: line, style: ['line', 'addressLine'],});
            });

            if (Email) {
              stack.push({text: Email, style: ['line', 'addressLine'],});
            }

            if (Site) {
              stack.push({text: Site, style: ['line', 'addressLine'],});
            }

            if (VATEnabled) {
              stack.push({text: `N° de TVA : ${IF}`, style: ['line', 'addressLine'],});
            }

            if (LegalForm && LegalFormsMap[LegalForm]) {
              stack.push({text: LegalFormsMap[LegalForm], style: ['line', 'addressLine'],});
            }
            if (RC) {
              stack.push({text: RC, style: ['line', 'addressLine'],});
            }

            return stack;
          }(),
        }

      ],


    });

    // Title
    dd.content.push({
      text: 'REÇU DE VENTE',
      style: 'title',
    });

    // Sale details + Customer details
    dd.content.push({

      columns: [

        // Sale details
        {
          columns: [

            {
              stack: function () {
                const stack = [];

                stack.push({
                  text: 'Date',
                  style: ['line', 'bold',],
                });

                stack.push({
                  text: 'REÇU N°',
                  style: ['line', 'bold',],
                });

                stack.push({
                  text: 'Mode de paiement',
                  style: ['line', 'bold',],
                });

                return stack;
              }(),
              alignment: 'right',
              width: '*',
            },

            {
              stack: function () {
                const stack = [];

                stack.push({
                  text: moment(sale.date).format('ll'),
                  style: ['line'],
                });

                stack.push({
                  text: String(sale.refNo),
                  style: ['line'],
                });

                stack.push({
                  text: paymentMethod[sale.paymentMethod],
                  style: ['line'],
                });

                return stack;
              }(),
              alignment: 'left',
            },

          ],

          columnGap: 10,
          margin: [25, 0, 0, 0,],
        },

        // Customer details
        {
          stack: function () {
            const stack = [];

            stack.push({
              text: 'FACTURER À',
              style: ['customerInfoHeader', 'line'],
            });

            if (sale.customer) {
              stack.push({text: sale.customer.displayName, style: ['line2']});
            }

            const billingAddress = sale.billingAddress
              ? sale.billingAddress.split('\n')
              : (sale.customer ? getCustomerBillingAddress(sale.customer) : []);

            billingAddress.forEach(function (line) {
              stack.push({text: line, style: sale.customer ? ['line', 'addressLine'] : ['line2', 'addressLine']});
            });

            return stack;
          }(),
        },

      ],

      columnGap: 50,

    });

    // Line sep
    dd.content.push({
      table: {
        widths: ['*'],
        body: [[' '], [' ']]
      },
      layout: {
        hLineColor: function (i, node) {
          return '#169cee';
        },
        hLineWidth: function (i, node) {
          return (i === 0 || i === node.table.body.length) ? 0 : 0.5;
        },
        vLineWidth: function (i, node) {
          return 0;
        },
      }
    });

    // Items header row
    dd.content.push({
      style: 'headerTable',
      table: {
        widths: ['*', 50, 115, 75, 115],
        body: [
          [
            {text: 'ACTIVITÉ', style: ['firstHeaderRow'],},
            {text: 'QTÉ', style: ['headerRow'],},
            {text: 'TAUX/PRIX UNIT.', style: ['headerRow'],},
            {text: 'MONTANT', style: ['headerRow'],},
            {text: 'TVA', style: ['lastHeaderRow', 'alignRight'],},
          ]
        ]
      },
      layout: 'noBorders',
    });

    // Items table
    dd.content.push({
      style: 'bodyTable',
      table: {
        widths: ['*', 50, 115, 75, 115],
        body: items
      },
      layout: 'noBorders',
    });

    // Dash line
    dd.content.push({
      canvas: [
        {
          type: 'line',
          x1: 0,
          y1: 5,
          x2: 520,
          y2: 5,
          lineWidth: 0.5,
          dash: {length: 2,},
          lineColor: 'darkgrey',
          opacity: 0.8,
          strokeOpacity: 0.5,
        }
      ]
    });

    if (hasVAT) {

      const discount = totalDiscount + itemsTotalDiscount;

      dd.content.push({
        columns: [

          // Column 1
          {
            stack: [],
            width: 'auto',
            alignment: 'left',
            margin: [0, 15, 0, 0],
          },

          // Column 2
          {
            style: ['totalsTable'],
            table: {
              widths: ['*', 75, 75],
              body: [
                [
                  '',
                  {text: 'Total HT', style: ['line3'],},
                  {text: formatMoney(sale.totalHT), style: ['alignRight', 'line3'],},
                ],

                discount > 0
                  ? [
                  '',
                  {text: 'REMISE', style: ['line3'],},
                  {text: `-${formatMoney(discount)}`, style: ['alignRight', 'line3'],},
                ]
                  : [
                  '',
                  {text: '', style: ['line3'],},
                  {text: '', style: ['line3'],},
                ],

                [
                  '',
                  {text: 'Total TVA', style: ['line3'],},
                  {text: formatMoney(sale.VAT), style: ['alignRight', 'line3'],},
                ],
                [
                  '',
                  {text: 'Total TTC', style: ['line'],},
                  {text: formatMoney(sale.total), style: ['alignRight', 'line3'],},
                ],

                [
                  '',
                  {text: 'MONTANT REÇU', style: ['line3'],},
                  {text: formatMoney(sale.total), style: ['alignRight', 'line3'],},
                ],

                [
                  '',
                  {text: 'SOLDE À PAYER', style: ['line3'],},
                  {text: `${formatMoney(sale.balanceDue)} MAD`, style: ['alignRight', 'line3', 'bold'],},
                ]
              ]
            },
            layout: 'noBorders',
          },

        ]
      });

    } else {

      const discount = totalDiscount + itemsTotalDiscount;

      dd.content.push({

        columns: [

          // Column 1
          {
            stack: [],
            width: 'auto',
            alignment: 'left',
            margin: [0, 15, 0, 0],
          },

          // Column 2
          {
            style: ['totalsTable'],
            table: {
              widths: ['*', 75, 75],
              body: [
                [
                  '',
                  {text: 'Total', style: ['line3'],},
                  {text: formatMoney(sale.total), style: ['alignRight', 'line3'],},
                ],

                discount > 0
                  ? [
                  '',
                  {text: 'REMISE', style: ['line3'],},
                  {text: `-${formatMoney(discount)}`, style: ['alignRight', 'line3'],},
                ]
                  : [
                  '',
                  {text: '', style: ['line3'],},
                  {text: '', style: ['line3'],},
                ],

                [
                  '',
                  {text: 'MONTANT REÇU', style: ['line'],},
                  {text: formatMoney(sale.total), style: ['alignRight', 'line3'],},
                ],

                [
                  '',
                  {text: 'SOLDE À PAYER', style: ['line3'],},
                  {text: `${formatMoney(sale.balanceDue)} MAD`, style: ['alignRight', 'line3', 'bold'],},
                ]
              ]
            },
            layout: 'noBorders',
          }

        ]

      });

    }

    if (hasVAT) {

      const VAT_Items = [];

      forEach(group(filter(_items, ({VATPart,}) => VATPart && VATPart.value && VATPart.value !== 4 && VATPart.value !== 'Value_Exempt'), ({VATPart,}) => VATPart.value), function (items, key) {

        const {totalHT, totalVAT,} = items.reduce(function ({totalHT, totalVAT,}, {qty, rate, VATPart : {value, inputType : itemInputType,}}) {

          const entryValue = qty * rate;

          const VAT_percentage = value ? VAT_ID_TO_VALUE[value] : 0.0;

          switch (itemInputType) {
            case 1:
            case 'HT':

              // entryValue is HT
              totalHT += entryValue;
              totalVAT += VAT_percentage * entryValue;

              break;

            case 2:
            case 'TTC':

              // entryValue is TTC
              (function () {

                const entryValueHT = entryValue / (1 + VAT_percentage);

                totalHT += entryValueHT;
                totalVAT += VAT_percentage * entryValueHT;

              })();

              break;

            case 3:
            case 'NO_VAT':

              totalHT += entryValue;
              totalVAT += VAT_percentage * entryValue;

              break;

            default:

              throw new Error(`VAT component: Invalid item inputType`, itemInputType);
          }

          return {totalHT, totalVAT,};
        }, {totalHT: 0.0, totalVAT: 0.0,});


        VAT_Items.push([
          {text: `TVA de ${VAT_VALUE_FORMATTED[key]}`, style: ['firstHeaderRow', 'alignRight'],},
          {text: formatMoney(totalVAT), style: ['headerRow', 'alignRight'],},
          {text: formatMoney(totalHT), style: ['lastHeaderRow', 'alignRight'],},
        ]);
      });

      if (VAT_Items.length > 0) {

        dd.content.push({
          text: 'RÉCAPITULATIF DE TVA',
          style: 'VAT-introText',
        });

        // VAT table header row
        dd.content.push({
          style: ['VAT-tableHeader'],
          table: {
            widths: ['*', '*', '*'],
            body: [
              [
                {text: 'TAUX', style: ['firstHeaderRow', 'alignRight'],},
                {text: 'MONTANT DE TVA', style: ['headerRow', 'alignRight'],},
                {text: 'BASE HT', style: ['lastHeaderRow', 'alignRight'],},
              ]
            ]
          },
          layout: 'noBorders',
        });

        // VAT table items
        dd.content.push({
          style: ['VAT-bodyTable'],
          table: {
            widths: ['*', '*', '*'],
            body: VAT_Items
          },
          layout: 'noBorders',
        });
      }

    }

    cb(null, dd);

  }, function (error) {
    cb(error);
  });

}

const fontDescriptors = {
  Roboto: {
    normal: 'public/fonts/Roboto-Regular.ttf',
    bold: 'public/fonts/Roboto-Medium.ttf',
    italics: 'public/fonts/Roboto-Italic.ttf',
    bolditalics: 'public/fonts/Roboto-Italic.ttf'
  }
};

function createPdfBinary(pdfDoc, callback) {
  const printer = new pdfMakePrinter(fontDescriptors);

  const doc = printer.createPdfKitDocument(pdfDoc);

  const chunks = [];

  doc.on('data', function (chunk) {
    chunks.push(chunk);
  });
  doc.on('end', function () {
    const result = Buffer.concat(chunks);
    callback(null, 'data:application/pdf;base64,' + result.toString('base64'));
  });
  doc.on('error', function (err) {
    callback(err);
  });

  doc.end();
}

function getCustomerBillingAddress({
  displayName,
  billing_streetAddress,
  billing_cityTown,
  billing_stateProvince,
  billing_postalCode,
  billing_country,
}) {
  const addr = formatAddress({
    address: billing_streetAddress,
    city: billing_cityTown,
    // subdivision: billing_stateProvince,
    postalCode: billing_postalCode,
    country: billing_country,
  });

  return addr;
}

function getCompanyVATSettings(company) {
  return {
    startDate: company.get('VATSetting_startDate'),
    agency: company.get('VATSetting_agency'),
    IF: company.get('VATSetting_IF'),
    frequency: company.has('VATSetting_frequency') ? company.get('VATSetting_frequency') : null,
    regime: company.has('VATSetting_regime') ? parseInt(company.get('VATSetting_regime')) : null,
    percentages: company.get('VATSetting_percentages') || [],
  }
}

const TermsMap = {
  1: 'Payable dès réception',
  2: `15 jours`,
  3: `30 jours`,
  4: `60 jours`,

  OnReception: 'Payable dès réception',
  Net_15: `15 jours`,
  Net_30: `30 jours`,
  Net_60: `60 jours`,
};

const paymentMethod = {
  Cash: 'Espèces',
  1: 'Espèces',

  Check: 'Chèque',
  2: 'Chèque',

  Creditcard: 'Carte bancaire',
  3: 'Carte bancaire',
};

const LegalFormsMap = {1: 'SARL', 2: 'SA', 3: 'SNC', 4: 'SARL_AU',};

const VAT_VALUE_FORMATTED = {
  Value_20: '20%',
  Value_14: '14%',
  Value_10: '10%',
  Value_7: '7%',
  Value_Exempt: 'Exonéré',

  1: '20%',
  2: '14%',
  3: '10%',
  5: '7%',
  4: 'Exonéré',
};

const VAT_ID_TO_VALUE = {
  Value_20: 0.20,
  Value_14: 0.14,
  Value_10: 0.1,
  Value_Exempt: 0.0,
  Value_7: 0.07,

  1: 0.20,
  2: 0.14,
  3: 0.1,
  4: 0.0,
  5: 0.07,
};

function itemGetDiscount(amount, spec/*{type, value}*/) {
  switch (spec.type) {
    case 'Value':
      return spec.value || 0.0;
    case 1:
      return spec.value || 0.0;

    case 'Percent':
      return amount * ((spec.value || 0.0) / 100);
    case 2:
      return amount * ((spec.value || 0.0) / 100);
  }
}

function getTotalDiscount(subtotal, {type, value}) {
  switch (type) {
    case 1:
      return value || 0.0;
    case 'Value':
      return value || 0.0;

    case 2:
      return subtotal * ((value || 0.0) / 100);
    case 'Percent':
      return subtotal * ((value || 0.0) / 100);
  }
}

function itemGeVATPart__Amount(taxableAmount /* ALWAYS HT */, itemVATPart) {

  if (itemVATPart) {
    const {inputType, value = 'Value_Exempt',} = itemVATPart;

    // taxableAmount is HT: VAT = %VAT * taxableAmountHT
    return function () {
      const VAT_percentage = value ? VAT_ID_TO_VALUE[value] : 0.0;

      const taxableAmountHT = taxableAmount;

      const VAT_amount = VAT_percentage * taxableAmountHT;

      return VAT_amount;
    }();

  }

  return 0;
}

function itemGetAmount__TTC(entryValue, itemVATPart) {
  if (itemVATPart) {
    const {inputType, value = 'Value_Exempt',} = itemVATPart;

    switch (inputType) {
      case 1:
      case 'HT':

        // entryValue is HT: TTC = (1 + %VAT) * entryValueHT;
        return (1 + VAT_ID_TO_VALUE[value]) * entryValue;

      case 2:
      case 'TTC':

        // entryValue is TTC: TTC = entryValueTTC;
        return entryValue;

      case 3:
      case 'NO_VAT':

        return entryValue;

      default:

        throw new Error(`itemGetAmount__TTC: Invalid inputType`, inputType);
    }
  }

  return entryValue;
}

function itemGetAmount__HT(entryValue, itemVATPart) {
  if (itemVATPart) {
    const {inputType, value = 'Value_Exempt',} = itemVATPart;

    switch (inputType) {
      case 1:
      case 'HT':

        // entryValue is HT: HT = entryValueHT;
        return entryValue;

      case 2:
      case 'TTC':

        // entryValue is TTC: HT =  entryValueTTC / (1 + %VAT);
        return entryValue / (1 + VAT_ID_TO_VALUE[value]);

      case 3:
      case 'NO_VAT':

        return entryValue;

      default:

        throw new Error(`itemGetAmount__HT: Invalid inputType`, inputType);
    }
  }

  return entryValue;
}
