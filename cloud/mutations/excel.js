const {
  withCompany,
} = require('../utils');

const accounting = require('accounting');

const moment = require('moment');

const concat = require('lodash.concat');

const group = require('lodash.groupby');
const forEach = require('lodash.foreach');

accounting.settings = {
  currency: {
    symbol : 'MAD',   // default currency symbol is '$'
    format: '%v', // controls output: %s = symbol, %v = value/number (can be object: see below)
    decimal : ',',  // decimal point separator
    thousand: ' ',  // thousands separator
    precision : 2,   // decimal places
  },
  number: {
    precision : 0,  // default precision on numbers is 0
    thousand: ' ',
    decimal : ','
  },
};

function formatMoney(value){
  return accounting.formatMoney(value);
}

const SaleClass = require('../types').Sale;
const ExpenseClass = require('../types').Expense;

const OperationClass = require('../types').Operation;

const formatError = require('../utils').formatError;

const getAccountName = require('../utils').getAccountName;

const VATDeclarationClass = require('../types').VATDeclaration;

const ExcelBuilder = require('excel-builder');
const EB = require('excel-builder/src/excel-builder.js');

module.exports.genExcel = function genExcel(request, response) {
  const companyId = request.params.companyId;

  withCompany(companyId, function (err, company) {

    if (err) {
      response.error(formatError(err));
      return;
    }

    const type = request.params.type;

    switch (type) {
      case 'VAT':

        createVATWorkbook(company, {declarationId: request.params.objectId,}, function (error, excel) {

          if (error) {
            response.error(formatError(error));
            return;
          }

          response.success({
            excel,
          });


        });

        break;

      default:
    }


  });
}

function createVATWorkbook(company, {declarationId}, cb) {
  const VATDeclaration = VATDeclarationClass({ id: company.id, });

  const query = new Parse.Query(VATDeclaration);
  query.get(declarationId, {
    success(declaration){

      const workbook = new ExcelBuilder.Workbook();

      Parse.Promise.when([
        createCompanyInfoSheet(workbook, company, declaration),
        createSalesSheet(workbook, company, declaration),
        createExpensesSheet(workbook, company, declaration),
      ]).then(function ([ companySheet, salesSheet, expensesSheet ]) {

        workbook.addWorksheet(companySheet);
        workbook.addWorksheet(salesSheet);
        workbook.addWorksheet(expensesSheet);

        return EB.createFile(workbook);
      }).then(function (dataBase64) {
        cb(null, dataBase64);
      }, function (error) {
        cb(error);
      });

    },

    error(error){
      cb(error);
    },
  });

}

function getCompanyInfo(workbook, sheet, company, title){
  const stylesheet = workbook.getStyleSheet();

  sheet.setRowInstructions(0, {
      height: 25,
    });
 sheet.setRowInstructions(1, {
      height: 25,
    });
 sheet.setRowInstructions(2, {
      height: 25,
    });

  const ice = company.get('ice') || '';
  const ifNo = company.get('if') || '';
  const taxNo = '';
  const displayName = company.get('displayName');

  const activity = company.get('activity') || '';
  const address = company.get('address') || '';

  const tel = company.get('tel') || '';
  const fax = company.get('fax') || '';
  const email = company.get('email') || '';

  const white = 'FFFFFF';

  const displayNameStyleLabelColor = '333333';
  const displayNameStyleLabelFontSize = 10;

  const borderColor = 'e1e1e1';

  const displayNameStyleLabel =  stylesheet.createFormat({
    font: {
      bold: true,
      color: displayNameStyleLabelColor,
      size: displayNameStyleLabelFontSize,
    },

    border: {
      bottom: {color: borderColor, style: 'thin'},
      top: {color: borderColor, style: 'thin'},
      left: {color: borderColor, style: 'thin'},
      right: {color: borderColor, style: 'thin'}
    },

    fill: {
      type: 'pattern',
      patternType: 'solid',
      fgColor: white,
    },

    alignment: {
      horizontal: 'left',
      vertical: 'center',
    },
  });

  const displayNameStyleValueColor = '808080';
  const displayNameStyleValueFontSize = 14;

  const displayNameStyleValue =  stylesheet.createFormat({
    font: {
      bold: true,
      color: displayNameStyleValueColor,
      size: displayNameStyleValueFontSize,
    },

    border: {
      bottom: {color: borderColor, style: 'thin'},
      top: {color: borderColor, style: 'thin'},
      left: {color: borderColor, style: 'thin'},
      right: {color: borderColor, style: 'thin'}
    },

    fill: {
      type: 'pattern',
      patternType: 'solid',
      fgColor: white,
    },

    alignment: {
      horizontal: 'left',
      vertical: 'center',
    },
  });

  const labelStyle =  stylesheet.createFormat({
    font: {
      bold: true,
      color: displayNameStyleLabelColor,
      size: 12,
    },

    border: {
      bottom: {color: borderColor, style: 'thin'},
      top: {color: borderColor, style: 'thin'},
      left: {color: borderColor, style: 'thin'},
      right: {color: borderColor, style: 'thin'}
    },

    fill: {
      type: 'pattern',
      patternType: 'solid',
      fgColor: white,
    },

    alignment: {
      horizontal: 'right',
      vertical: 'center',
    },
  });

  const valueStyle =  stylesheet.createFormat({
    font: {
      bold: true,
      color: displayNameStyleLabelColor,
      size: 12,
    },

    border: {
      bottom: {color: borderColor, style: 'thin'},
      top: {color: borderColor, style: 'thin'},
      left: {color: borderColor, style: 'thin'},
      right: {color: borderColor, style: 'thin'}
    },

    fill: {
      type: 'pattern',
      patternType: 'solid',
      fgColor: white,
    },

    alignment: {
      horizontal: 'left',
      vertical: 'center',
    },
  });

  const titleStyle =  stylesheet.createFormat({
    font: {
      bold: true,
      color: displayNameStyleValueColor,
      size: displayNameStyleValueFontSize,
    },

    border: {
      bottom: {color: borderColor, style: 'thin'},
      top: {color: borderColor, style: 'thin'},
      left: {color: borderColor, style: 'thin'},
      right: {color: borderColor, style: 'thin'}
    },

    fill: {
      type: 'pattern',
      patternType: 'solid',
      fgColor: white,
    },

    alignment: {
      horizontal: 'center',
      vertical: 'center',
    },
  });

  const data = [
    [ { value: 'Raison Social', metadata: { style: displayNameStyleLabel.id }, }, { value: `Ste ${displayName}`, metadata: { style: displayNameStyleValue.id, }, }, ],

    [ { value: 'IF:', metadata: { style : labelStyle.id, }, }, { value: ifNo, metadata: { style : valueStyle.id, }, }, '', { value: title, metadata: { style : titleStyle.id,  }, }, ],
    [ { value: 'ICE:', metadata: { style : labelStyle.id, }, }, { value: ice, metadata: { style : valueStyle.id, }, }, ],
    [],
  ];

  sheet.mergeCells('B1', 'D1');
  sheet.mergeCells('D2', 'I2');

  return data;
}

function createSalesSheet(workbook, company, declaration) {
  return getCompanyVATDeclarationSales(company, declaration).then(function(sales){

    const sheet = new ExcelBuilder.Worksheet({
      name: 'Produits',
    });

    const now = moment();

    const startDate = moment(declaration.get('periodStart'));

    const {
      regime,
      frequency,
    } = declaration.get('settings');

    const date = moment(startDate);

    const stylesheet = workbook.getStyleSheet();

    const groups = {};

    function getSales(){

      const emptyStore = new OperationDataListStore(
        []
      );

      forEach(
        group(sales, (op) => op.saleItem.VATPart.inputType === 3 || op.saleItem.VATPart.inputType === 'NO_VAT' ? 'HT' : 'TTC'), function(items, key){

          const store = new OperationDataListStore(
            items
          );

          groups[key] = store;
        });

      const borderColor = '000000';
      const white = 'FFFFFF';
      const black = '000000';

      const style = stylesheet.createFormat({
        font: {
          bold: true,
          color: black,
          size: 8,
        },

        border: {
          bottom: {color: borderColor, style: 'thin'},
          top: {color: borderColor, style: 'thin'},
          left: {color: borderColor, style: 'thin'},
          right: {color: borderColor, style: 'thin'}
        },

        fill: {
          type: 'pattern',
          patternType: 'solid',
          fgColor: white,
        },

        alignment: {
          horizontal: 'center',
          vertical: 'center',
          wrapText: true,
        },
      });

      function getPeriodInfo(){

        switch (frequency){
          case 'MONTHLY':

            return {
              periodNum: date.month() + 1,
              periodLabel: `Mensuelle`,
              periodYear: date.year()
            };

          case 'QUARTERLY':

            return {
              periodNum: date.quarter(),
              periodLabel: `Trimestre`,
              periodYear: date.year()
            };
        }
      }

      const {
        periodNum,
        periodLabel,
        periodYear,
      } = getPeriodInfo();

      function getTitle(key, line){

        sheet.mergeCells(`F${line}`, `G${line}`);

        sheet.setRowInstructions(line - 1, {
          height: 30,
        });

        const white = 'FFFFFF';
        const black = '000000';

        const borderColor = 'FF0000';

        const numStyle =  stylesheet.createFormat({
          font: {
            bold: true,
            italic: true,
            color: white,
            size: 12,
          },

          fill: {
            type: 'pattern',
            patternType: 'solid',
            fgColor: 'FF0000',
          },

          alignment: {
            horizontal: 'right',
            vertical: 'bottom',
          },
        });

        const labelStyle =  stylesheet.createFormat({
          font: {
            bold: true,
            italic: true,
            color: white,
            size: 14,
          },

          fill: {
            type: 'pattern',
            patternType: 'solid',
            fgColor: 'FF0000',
          },

          alignment: {
            horizontal: 'center',
            vertical: 'bottom',
          },
        });

        const yearStyle =  stylesheet.createFormat({
          font: {
            bold: true,
            italic: true,
            color: white,
            size: 12,
          },

          fill: {
            type: 'pattern',
            patternType: 'solid',
            fgColor: 'FF0000',
          },

          alignment: {
            horizontal: 'left',
            vertical: 'bottom',
          },
        });

        const data = [
          [ null, null, null, null, { value: periodNum, metadata: { style: numStyle.id, }, }, { value: `CA (${periodLabel}) ${key}`, metadata: { style: labelStyle.id, }, }, { value: '', metadata: { style: labelStyle.id, }, }, { value: periodYear, metadata: { style: yearStyle.id, }, }, ],
        ];

        return data;
      }

      function renderTTC(store){
        const line = 4 + 1;

        function getTableHeader(){
          const white = 'FFFFFF';
          const black = '000000';

          const borderColor = 'FFFFFF';

          const emptyBorderColor = 'e1e1e1';

          const bgColor = 'FF0000';

          const titleStyle =  stylesheet.createFormat({
            font: {
              bold: true,
              color: white,
              size: 8,
            },

            border: {
              // bottom: {color: borderColor, style: 'thin'},
              top: {color: borderColor, style: 'thin'},
              left: {color: borderColor, style: 'thin'},
              // right: {color: borderColor, style: 'thin'}
            },

            fill: {
              type: 'pattern',
              patternType: 'solid',
              fgColor: bgColor,
            },

            alignment: {
              horizontal: 'center',
              vertical: 'center',
              wrapText: true,
            },
          });

          const emptyStyle =  stylesheet.createFormat({
            border: {
              bottom: {color: emptyBorderColor, style: 'thin'},
              // top: {color: emptyBorderColor, style: 'thin'},
              left: {color: emptyBorderColor, style: 'thin'},
              right: {color: emptyBorderColor, style: 'thin'}
            },

            fill: {
              type: 'pattern',
              patternType: 'solid',
              fgColor: white,
            },

            alignment: {
              horizontal: 'center',
              vertical: 'center',
            },
          });

          sheet.setRowInstructions(line, {
            height: 30,
          });

          function getLabel(title){
            return {
              value: title,
              metadata: {
                style: titleStyle.id,
              }
            };
          }

          const getEmptyLabel = {
            value: '',
            metadata: {
              style: emptyStyle.id,
            }
          };

          const data = [
            [
              getLabel(`Date`),
              getLabel(`N°`),
              getLabel(`Client`),
              getLabel(`Adresse`),
              getLabel(`I.F`),
              getLabel(`Désignation`),
              getLabel(`Montant H.T`),
              getLabel(`T.V.A`),
              getLabel(`Montant T.V.A`),
              getLabel(`Montant T.T.C`),
              getLabel(`Date Règlem.`),
              getLabel(`Mode Règlem.`),
            ],
            [
              getEmptyLabel,
              getEmptyLabel,
              getEmptyLabel,
              getEmptyLabel,
              getEmptyLabel,
              getEmptyLabel,
              getEmptyLabel,
              getEmptyLabel,
              getEmptyLabel,
              getEmptyLabel,
              getEmptyLabel,
              getEmptyLabel,
            ],
          ];

          return data;
        }

        function renderTotals(){
          sheet.mergeCells(`B${line + 3 + store.getSize() + 1}`, `F${line + 3 + store.getSize() + 1}`);

          const black = '000000';

          const bgColor = 'FFFFFF';

          const totalStyle = stylesheet.createFormat({
            font: {
              bold: true,
              color: black,
              size: 8,
            },

            border: {
              bottom: {color: black, style: 'thin'},
              top: {color: black, style: 'thin'},
              left: {color: black, style: 'thin'},
              right: {color: black, style: 'thin'}
            },

            fill: {
              type: 'pattern',
              patternType: 'solid',
              fgColor: bgColor,
            },

            alignment: {
              horizontal: 'center',
              vertical: 'center',
              wrapText: true,
            },
          });

          const moneyStyle = stylesheet.createFormat({
            font: {
              bold: true,
              color: black,
              size: 8,
            },

            border: {
              bottom: {color: black, style: 'thin'},
              top: {color: black, style: 'thin'},
              left: {color: black, style: 'thin'},
              right: {color: black, style: 'thin'}
            },

            fill: {
              type: 'pattern',
              patternType: 'solid',
              fgColor: bgColor,
            },

            alignment: {
              horizontal: 'center',
              vertical: 'center',
            },
          });

          const emptyValue = {
            value: '',
            metadata: { style: totalStyle.id, },
          };

          return [[
            null,
            { value: `TOTAL TVA FACTURÉE TTC`, metadata: { style: totalStyle.id, }, },
            emptyValue, emptyValue, emptyValue, emptyValue,
            { value: formatMoney(store.totalHT), metadata: { style: moneyStyle.id, }, },
            emptyValue,
            { value: formatMoney(store.totalVAT), metadata: { style: moneyStyle.id, }, },
            { value: formatMoney(store.totalHT + store.totalVAT), metadata: { style: moneyStyle.id, }, },
          ]];
        }

        const lines = [];

        for(let rowIndex = 0, length = store.getSize(); rowIndex < length; rowIndex++){
          const obj = store.getObjectAt(rowIndex);

          lines.push([
            { value: moment(obj.sale.date).format('ll'), metadata: { style : style.id, }, }, // Date
            { value: obj.refNo, metadata: { style : style.id, }, }, // N°
            { value: obj.sale.customer ? obj.sale.customer.displayName : '', metadata: { style : style.id, }, }, // Client
            { value: obj.sale.customer ? obj.sale.billingAddress : '', metadata: { style : style.id, }, }, // Adresse
            { value: obj.sale.customer ? obj.sale.customer.if : '', metadata: { style : style.id, }, }, // I.F
            { value: getProductItem(obj.saleItem), metadata: { style : style.id, }, }, // Désignation
            { value: formatMoney(obj.amount), metadata: { style : style.id, }, }, // Montant H.T
            { value: obj.saleItem.VATPart && obj.saleItem.VATPart.value
              ? VAT_VALUE_FORMATTED[obj.saleItem.VATPart.value]
              : 'Exonéré', metadata: { style : style.id, }, }, // T.V.A
            { value: formatMoney(obj.VAT), metadata: { style : style.id, }, }, // Montant T.V.A
            { value: formatMoney(obj.amount + obj.VAT), metadata: { style : style.id, }, }, // Montant T.T.C
            { value: function(){
              switch(obj.sale.type){
                case 'Invoice': return moment(obj.sale.lastPaymentDate).format('ll');
                case 'Sale':    return moment(obj.sale.date).format('ll');
              }
            }(), metadata: { style : style.id, }, }, // Date Règlem.
            { value: function(){
              switch(obj.sale.type){
                case 'Invoice': return '';
                case 'Sale':    return paymentMethod[obj.sale.paymentMethod];
              }
            }(), metadata: { style : style.id, }, }, // Mode Règlem.

          ]);
        }

        return [
          ...getTitle('TTC', line),
          ...getTableHeader(),
          ...lines,
          [],
          ...renderTotals(),
          [],
          [],
        ];
      }

      function renderHT(store){
        const line = 4 + 1 + (
          groups['TTC']
            ? groups['TTC'].getSize() + 5 //
            : 5 //
        ) + 1;

        function getTableHeader(){
          const white = 'FFFFFF';
          const black = '000000';

          const borderColor = 'FFFFFF';

          const emptyBorderColor = 'e1e1e1';

          const bgColor = 'FF0000';

          const titleStyle =  stylesheet.createFormat({
            font: {
              bold: true,
              color: white,
              size: 8,
            },

            border: {
              // bottom: {color: borderColor, style: 'thin'},
              top: {color: borderColor, style: 'thin'},
              left: {color: borderColor, style: 'thin'},
              // right: {color: borderColor, style: 'thin'}
            },

            fill: {
              type: 'pattern',
              patternType: 'solid',
              fgColor: bgColor,
            },

            alignment: {
              horizontal: 'center',
              vertical: 'center',
              wrapText: true,
            },
          });

          const emptyStyle =  stylesheet.createFormat({
            border: {
              bottom: {color: emptyBorderColor, style: 'thin'},
              // top: {color: emptyBorderColor, style: 'thin'},
              left: {color: emptyBorderColor, style: 'thin'},
              right: {color: emptyBorderColor, style: 'thin'}
            },

            fill: {
              type: 'pattern',
              patternType: 'solid',
              fgColor: white,
            },

            alignment: {
              horizontal: 'center',
              vertical: 'center',
            },
          });

          sheet.setRowInstructions(line, {
            height: 30,
          });

          function getLabel(title){
            return {
              value: title,
              metadata: {
                style: titleStyle.id,
              }
            };
          }

          const getEmptyLabel = {
            value: '',
            metadata: {
              style: emptyStyle.id,
            }
          };

          const data = [
            [
              getLabel(`Date`),
              getLabel(`N°`),
              getLabel(`Client`),
              getLabel(`Adresse`),
              getLabel(`I.F`),
              getLabel(`Désignation`),
              getLabel(`Montant H.T`),
              getLabel(`Date Règlem.`),
              getLabel(`Mode Règlem.`),
            ],
            [
              getEmptyLabel,
              getEmptyLabel,
              getEmptyLabel,
              getEmptyLabel,
              getEmptyLabel,
              getEmptyLabel,
              getEmptyLabel,
              getEmptyLabel,
              getEmptyLabel,
            ],
          ];

          return data;
        }

        function renderTotals(){
          sheet.mergeCells(`B${line + 3 + store.getSize() + 1 + 1}`, `F${line + 3 + store.getSize() + 1 + 1}`);

          const black = '000000';

          const bgColor = 'FFFFFF';

          const totalStyle = stylesheet.createFormat({
            font: {
              bold: true,
              color: black,
              size: 8,
            },

            border: {
              bottom: {color: black, style: 'thin'},
              top: {color: black, style: 'thin'},
              left: {color: black, style: 'thin'},
              right: {color: black, style: 'thin'}
            },

            fill: {
              type: 'pattern',
              patternType: 'solid',
              fgColor: bgColor,
            },

            alignment: {
              horizontal: 'center',
              vertical: 'center',
              wrapText: true,
            },
          });

          const moneyStyle = stylesheet.createFormat({
            font: {
              bold: true,
              color: black,
              size: 8,
            },

            border: {
              bottom: {color: black, style: 'thin'},
              top: {color: black, style: 'thin'},
              left: {color: black, style: 'thin'},
              right: {color: black, style: 'thin'}
            },

            fill: {
              type: 'pattern',
              patternType: 'solid',
              fgColor: bgColor,
            },

            alignment: {
              horizontal: 'center',
              vertical: 'center',
            },
          });

          const emptyValue = {
            value: '',
            metadata: { style: totalStyle.id, },
          };

          return [[
            null,
            { value: `TOTAL TVA FACTURÉE HT`, metadata: { style: totalStyle.id, }, },
            emptyValue, emptyValue, emptyValue, emptyValue,
            { value: formatMoney(store.totalHT), metadata: { style: moneyStyle.id, }, },
          ]];
        }

        const lines = [];

        for(let rowIndex = 0, length = store.getSize(); rowIndex < length; rowIndex++){
          const obj = store.getObjectAt(rowIndex);

          lines.push([
            { value: moment(obj.sale.date).format('ll'), metadata: { style : style.id, }, }, // Date
            { value: obj.refNo, metadata: { style : style.id, }, }, // N°
            { value: obj.sale.customer ? obj.sale.customer.displayName : '', metadata: { style : style.id, }, }, // Client
            { value: obj.sale.customer ? obj.sale.billingAddress : '', metadata: { style : style.id, }, }, // Adresse
            { value: obj.sale.customer ? obj.sale.customer.if : '', metadata: { style : style.id, }, }, // I.F
            { value: getProductItem(obj.saleItem), metadata: { style : style.id, }, }, // Désignation
            { value: formatMoney(obj.amount), metadata: { style : style.id, }, }, // Montant H.T
            { value: function(){
              switch(obj.sale.type){
                case 'Bill': return moment(obj.sale.lastPaymentDate).format('ll');
                case 'Expense':    return moment(obj.sale.date).format('ll');
              }
            }(), metadata: { style : style.id, }, }, // Date Règlem.
            { value: function(){
              switch(obj.sale.type){
                case 'Bill': return null;
                case 'Expense':    return paymentMethod[obj.sale.paymentMethod];
              }
            }(), metadata: { style : style.id, }, }, // Mode Règlem.

          ]);
        }

        return [
          ...getTitle('HT', line),
          ...getTableHeader(),
          ...lines,
          [],
          ...renderTotals(),
          [],
        ];
      }

      function renderTotals(){
        const line = 4 + 1 + (
          groups['TTC']
            ? groups['TTC'].getSize() + 5 //
            : 5 //
        ) + 1;

        sheet.mergeCells(`B${line + 3 + (groups['HT'] ? groups['HT'].getSize() : 0) + 1 + 1 + 1 + 2}`, `F${line + 3 + (groups['HT'] ? groups['HT'].getSize() : 0) + 1 + 1 + 1 + 2}`);

        const black = '000000';

        const bgColor = 'FFFFFF';

        const totalStyle = stylesheet.createFormat({
          font: {
            bold: true,
            color: black,
            size: 8,
          },

          border: {
            bottom: {color: black, style: 'thin'},
            top: {color: black, style: 'thin'},
            left: {color: black, style: 'thin'},
            right: {color: black, style: 'thin'}
          },

          fill: {
            type: 'pattern',
            patternType: 'solid',
            fgColor: bgColor,
          },

          alignment: {
            horizontal: 'center',
            vertical: 'center',
            wrapText: true,
          },
        });

        const moneyStyle = stylesheet.createFormat({
          font: {
            bold: true,
            color: black,
            size: 8,
          },

          format: '# ##0,00',

          border: {
            bottom: {color: black, style: 'thin'},
            top: {color: black, style: 'thin'},
            left: {color: black, style: 'thin'},
            right: {color: black, style: 'thin'}
          },

          fill: {
            type: 'pattern',
            patternType: 'solid',
            fgColor: bgColor,
          },

          alignment: {
            horizontal: 'center',
            vertical: 'center',
          },
        });

        const emptyValue = {
          value: '',
          metadata: { style: totalStyle.id, },
        };

        const keys = Object.keys(groups);

        const totalHT = keys.reduce(function(sum, nextKey){
          return sum + groups[nextKey].totalHT;
        }, 0.0);

        const totalVAT = keys.reduce(function(sum, nextKey){
          return sum + groups[nextKey].totalVAT;
        }, 0.0);

        return [[
          null,
          { value: `TOTAL TVA FACTURÉE`, metadata: { style: totalStyle.id, }, },
          emptyValue, emptyValue, emptyValue, emptyValue,
          { value: formatMoney(totalHT), metadata: { style: moneyStyle.id, }, },
          emptyValue,
          { value: formatMoney(totalVAT), metadata: { style: moneyStyle.id, }, },
          { value: formatMoney(totalHT + totalVAT), metadata: { style: moneyStyle.id, }, },
        ]];
      }

      return [
        ...renderTTC(groups['TTC'] || emptyStore),
        ...renderHT(groups['HT'] || emptyStore),
        [],
        ...renderTotals(),
      ];
    }

    const data = [
      ...getCompanyInfo(workbook, sheet, company, 'T.V.A FACTURÉE'),
      ...getSales(),
    ];

    sheet.setData(data);

    sheet.setColumns([
      {width: 13}, // A
      {width: 13}, // B
      {width: 13}, // C
      {width: 13}, // D
      {width: 13}, // E
      {width: 30}, // F
      {width: 13}, // G
      {width: 13}, // H
      {width: 13}, // I
      {width: 13}, // J
      {width: 13}, // K
      {width: 13}, // L
    ]);

    return Promise.resolve(sheet);

  });
}

function createExpensesSheet(workbook, company, declaration) {
  return getCompanyVATDeclarationExpenses(company, declaration).then(function(expenses){

    const sheet = new ExcelBuilder.Worksheet({
      name: 'Charges',
    });

    const now = moment();

    const startDate = moment(declaration.get('periodStart'));

    const {
      regime,
      frequency,
    } = declaration.get('settings');

    const date = moment(startDate);

    const stylesheet = workbook.getStyleSheet();

    function getPeriodInfo(){

      switch (frequency){
        case 'MONTHLY':

          return {
            periodNum: date.month() + 1,
            periodLabel: `Mensuelle`,
            periodYear: date.year()
          };

        case 'QUARTERLY':

          return {
            periodNum: date.quarter(),
            periodLabel: `Trimestre`,
            periodYear: date.year()
          };
      }
    }

    const {
      periodNum,
      periodLabel,
      periodYear,
    } = getPeriodInfo();

    function getTitle(){
      sheet.mergeCells('F5', 'G5');

      sheet.setRowInstructions(4, {
        height: 30,
      });

      const white = 'FFFFFF';
      const black = '000000';

      const borderColor = '538DD5';

      const numStyle =  stylesheet.createFormat({
        font: {
          bold: true,
          italic: true,
          color: white,
          size: 12,
        },

        fill: {
          type: 'pattern',
          patternType: 'solid',
          fgColor: '538DD5',
        },

        alignment: {
          horizontal: 'right',
          vertical: 'bottom',
        },
      });

      const labelStyle =  stylesheet.createFormat({
        font: {
          bold: true,
          italic: true,
          color: white,
          size: 14,
        },

        fill: {
          type: 'pattern',
          patternType: 'solid',
          fgColor: '538DD5',
        },

        alignment: {
          horizontal: 'center',
          vertical: 'bottom',
        },
      });

      const yearStyle =  stylesheet.createFormat({
        font: {
          bold: true,
          italic: true,
          color: white,
          size: 12,
        },

        fill: {
          type: 'pattern',
          patternType: 'solid',
          fgColor: '538DD5',
        },

        alignment: {
          horizontal: 'left',
          vertical: 'bottom',
        },
      });

      const data = [
        [ null, null, null, null, { value: periodNum, metadata: { style: numStyle.id, }, }, { value: periodLabel, metadata: { style: labelStyle.id, }, }, { value: '', metadata: { style: labelStyle.id, }, }, { value: periodYear, metadata: { style: yearStyle.id, }, }, ],
      ];

      return data;
    }

    function getTableHeader(){
      const white = 'FFFFFF';
      const black = '000000';

      const borderColor = 'FFFFFF';

      const emptyBorderColor = 'e1e1e1';

      const bgColor = '0070C0';

      const titleStyle =  stylesheet.createFormat({
        font: {
          bold: true,
          color: white,
          size: 8,
        },

        border: {
          // bottom: {color: borderColor, style: 'thin'},
          top: {color: borderColor, style: 'thin'},
          left: {color: borderColor, style: 'thin'},
          // right: {color: borderColor, style: 'thin'}
        },

        fill: {
          type: 'pattern',
          patternType: 'solid',
          fgColor: bgColor,
        },

        alignment: {
          horizontal: 'center',
          vertical: 'center',
          wrapText: true,
        },
      });

      const emptyStyle =  stylesheet.createFormat({
        border: {
          bottom: {color: emptyBorderColor, style: 'thin'},
          // top: {color: emptyBorderColor, style: 'thin'},
          left: {color: emptyBorderColor, style: 'thin'},
          right: {color: emptyBorderColor, style: 'thin'}
        },

        fill: {
          type: 'pattern',
          patternType: 'solid',
          fgColor: white,
        },

        alignment: {
          horizontal: 'center',
          vertical: 'center',
        },
      });

      sheet.setRowInstructions(5, {
        height: 30,
      });

      function getLabel(title){
        return {
          value: title,
          metadata: {
            style: titleStyle.id,
          }
        };
      }

      const getEmptyLabel = {
        value: '',
        metadata: {
          style: emptyStyle.id,
        }
      };

      const data = [
        [
          getLabel(`Date`),
          getLabel(`N°`),
          getLabel(`Fournisseur`),
          getLabel(`Adresse`),
          getLabel(`I.F`),
          getLabel(`Désignation`),
          getLabel(`Montant H.T`),
          getLabel(`T.V.A`),
          getLabel(`Montant T.V.A`),
          getLabel(`Montant T.T.C`),
          getLabel(`Date Règlem.`),
          getLabel(`Mode Règlem.`),
        ],
        [
          getEmptyLabel,
          getEmptyLabel,
          getEmptyLabel,
          getEmptyLabel,
          getEmptyLabel,
          getEmptyLabel,
          getEmptyLabel,
          getEmptyLabel,
          getEmptyLabel,
          getEmptyLabel,
          getEmptyLabel,
          getEmptyLabel,
        ],
      ];

      return data;
    }

    function getLine(key){
      switch(key){
        case 'Value_20':

          return 7 + 1 + (groups['Value_20'] ? groups['Value_20'].getSize() + 1 : 1);

        case 'Value_14':

          return 7 + 1 + (groups['Value_20'] ? groups['Value_20'].getSize() + 1 : 1) + (groups['Value_14'] ? groups['Value_14'].getSize() + 3 : 3);

        case 'Value_10':

          return 7 + 1 + (groups['Value_20'] ? groups['Value_20'].getSize() + 1 : 1) + (groups['Value_14'] ? groups['Value_14'].getSize() + 3 : 3) + (groups['Value_10'] ? groups['Value_10'].getSize() + 3 : 3);

        case 'Value_7':

          return 7 + 1 + (groups['Value_20'] ? groups['Value_20'].getSize() + 1 : 1) + (groups['Value_14'] ? groups['Value_14'].getSize() + 3 : 3) + (groups['Value_10'] ? groups['Value_10'].getSize() + 3 : 3) + (groups['Value_7'] ? groups['Value_7'].getSize() + 3 : 3);

        case 'Value_Exempt':

          return 7 + 1 + (groups['Value_20'] ? groups['Value_20'].getSize() + 1 : 1) + (groups['Value_14'] ? groups['Value_14'].getSize() + 3 : 3) + (groups['Value_10'] ? groups['Value_10'].getSize() + 3 : 3) + (groups['Value_7'] ? groups['Value_7'].getSize() + 3 : 3) + (groups['Value_Exempt'] ? groups['Value_Exempt'].getSize() + 3 : 3);
      }
    }

    const groups = {};

    function getExpenses(){

      const emptyStore = new OperationDataListStore(
                  []
                );

      forEach(
        group(expenses, (op) => op.expenseItem.VATPart && op.expenseItem.VATPart.value ? VAT_KEY_TO_ID[op.expenseItem.VATPart.value] : 'Value_Exempt'), function(items, key){

          const store = new OperationDataListStore(
                  items
                );

          groups[key] = store;
        });

      const borderColor = '000000';
      const white = 'FFFFFF';
      const black = '000000';

      const style = stylesheet.createFormat({
        font: {
          bold: true,
          color: black,
          size: 8,
        },

        border: {
          bottom: {color: borderColor, style: 'thin'},
          top: {color: borderColor, style: 'thin'},
          left: {color: borderColor, style: 'thin'},
          right: {color: borderColor, style: 'thin'}
        },

        fill: {
          type: 'pattern',
          patternType: 'solid',
          fgColor: white,
        },

        alignment: {
          horizontal: 'center',
          vertical: 'center',
          wrapText: true,
        },
      });

      function renderGroup(store, key){
        const hasVAT = key_hasVAT[key];

        const lines = [];

        for(let rowIndex = 0, length = store.getSize(); rowIndex < length; rowIndex++){
          const obj = store.getObjectAt(rowIndex);

          lines.push([
            { value: moment(obj.expense.date).format('ll'), metadata: { style : style.id, }, }, // Date
            { value: obj.refNo, metadata: { style : style.id, }, }, // N°
            { value: obj.expense.payee ? obj.expense.payee.displayName : '', metadata: { style : style.id, }, }, // Fournisseur
            { value: obj.expense.payee ? obj.expense.mailingAddress : '', metadata: { style : style.id, }, }, // Adresse
            { value: obj.expense.payee ? obj.expense.payee.if : '', metadata: { style : style.id, }, }, // I.F
            { value: getExpenseItem(obj.expenseItem), metadata: { style : style.id, }, }, // Désignation
            { value: formatMoney(obj.amount), metadata: { style : style.id, }, }, // Montant H.T
            { value: obj.expenseItem.VATPart && obj.expenseItem.VATPart.value
                ? VAT_VALUE_FORMATTED[obj.expenseItem.VATPart.value]
                : 'Exonéré', metadata: { style : style.id, }, }, // T.V.A
            { value: formatMoney(obj.VAT), metadata: { style : style.id, }, }, // Montant T.V.A
            { value: formatMoney(obj.amount + obj.VAT), metadata: { style : style.id, }, }, // Montant T.T.C
            { value: function(){
              switch(obj.expense.type){
                 case 'Bill': return moment(obj.expense.lastPaymentDate).format('ll');
                 case 'Expense':    return moment(obj.expense.date).format('ll');
               }
            }(), metadata: { style : style.id, }, }, // Date Règlem.
            { value: function(){
              switch(obj.expense.type){
                case 'Bill': return null;
                case 'Expense':    return paymentMethod[obj.expense.paymentMethod];
              }
            }(), metadata: { style : style.id, }, }, // Mode Règlem.

          ]);
        }

        function renderTotals(){
          const line = getLine(key);

          sheet.mergeCells(`B${line}`, `F${line}`);

          const black = '000000';
          const white = 'FFFFFF';

          const bgColor = 'FFFFFF';

          const totalStyle = stylesheet.createFormat({
            font: {
              bold: true,
              color: black,
              size: 8,
            },

            border: {
              bottom: {color: black, style: 'thin'},
              top: {color: black, style: 'thin'},
              left: {color: black, style: 'thin'},
              right: {color: black, style: 'thin'}
            },

            fill: {
              type: 'pattern',
              patternType: 'solid',
              fgColor: 'A6A6A6',
            },

            alignment: {
              horizontal: 'center',
              vertical: 'center',
              wrapText: true,
            },
          });

          const totalStyle2 = stylesheet.createFormat({
            font: {
              bold: true,
              color: black,
              size: 8,
            },

            border: {
              bottom: {color: black, style: 'thin'},
              top: {color: black, style: 'thin'},
              left: {color: black, style: 'thin'},
              right: {color: black, style: 'thin'}
            },

            fill: {
              type: 'pattern',
              patternType: 'solid',
              fgColor: white,
            },

            alignment: {
              horizontal: 'center',
              vertical: 'center',
              wrapText: true,
            },
          });

          const emptyValue2 = {
            value: '',
            metadata: { style: totalStyle2.id, },
          };

          const moneyStyle = stylesheet.createFormat({
            font: {
              bold: true,
              color: black,
              size: 8,
            },

            border: {
              bottom: {color: black, style: 'thin'},
              top: {color: black, style: 'thin'},
              left: {color: black, style: 'thin'},
              right: {color: black, style: 'thin'}
            },

            fill: {
              type: 'pattern',
              patternType: 'solid',
              fgColor: bgColor,
            },

            alignment: {
              horizontal: 'center',
              vertical: 'center',
            },
          });

          const emptyValue = {
            value: '',
            metadata: { style: totalStyle.id, },
          };

          return [[
            null,
            { value: expenses_key_totals[key], metadata: { style: totalStyle.id, }, },
            emptyValue, emptyValue, emptyValue, emptyValue,
            { value: formatMoney(store.totalHT), metadata: { style: moneyStyle.id, }, },
            emptyValue2,
            { value: formatMoney(store.totalVAT), metadata: { style: moneyStyle.id, }, },
            { value: formatMoney(store.totalHT + store.totalVAT), metadata: { style: moneyStyle.id, }, },
          ]];
        }

        return [
          ...lines,
          [],
          ...renderTotals(),
        ];
      }

      return [
        ...renderGroup(groups['Value_20'] || emptyStore, 'Value_20'),
        [],
        ...renderGroup(groups['Value_14'] || emptyStore, 'Value_14'),
        [],
        ...renderGroup(groups['Value_10'] || emptyStore, 'Value_10'),
        [],
        ...renderGroup(groups['Value_7'] || emptyStore, 'Value_7'),
        [],
        ...renderGroup(groups['Value_Exempt'] || emptyStore, 'Value_Exempt'),
      ];
    }

    function renderTotals(){
      const line = getLine('Value_Exempt') + 2;

      sheet.mergeCells(`B${line}`, `F${line}`);

      const black = '000000';
      const white = 'FFFFFF';

      const bgColor = 'FFFFFF';

      const totalStyle = stylesheet.createFormat({
        font: {
          bold: true,
          color: black,
          size: 8,
        },

        border: {
          bottom: {color: black, style: 'thin'},
          top: {color: black, style: 'thin'},
          left: {color: black, style: 'thin'},
          right: {color: black, style: 'thin'}
        },

        fill: {
          type: 'pattern',
          patternType: 'solid',
          fgColor: '8DB4E2',
        },

        alignment: {
          horizontal: 'center',
          vertical: 'center',
          wrapText: true,
        },
      });

      const totalStyle2 = stylesheet.createFormat({
        font: {
          bold: true,
          color: black,
          size: 8,
        },

        border: {
          bottom: {color: black, style: 'thin'},
          top: {color: black, style: 'thin'},
          left: {color: black, style: 'thin'},
          right: {color: black, style: 'thin'}
        },

        fill: {
          type: 'pattern',
          patternType: 'solid',
          fgColor: white,
        },

        alignment: {
          horizontal: 'center',
          vertical: 'center',
          wrapText: true,
        },
      });

      const emptyValue2 = {
        value: '',
        metadata: { style: totalStyle2.id, },
      };

      const moneyStyle = stylesheet.createFormat({
        font: {
          bold: true,
          color: black,
          size: 8,
        },

        border: {
          bottom: {color: black, style: 'thin'},
          top: {color: black, style: 'thin'},
          left: {color: black, style: 'thin'},
          right: {color: black, style: 'thin'}
        },

        fill: {
          type: 'pattern',
          patternType: 'solid',
          fgColor: bgColor,
        },

        alignment: {
          horizontal: 'center',
          vertical: 'center',
        },
      });

      const emptyValue = {
        value: '',
        metadata: { style: totalStyle.id, },
      };

      const keys = Object.keys(groups);

      const totalHT = keys.reduce(function(sum, nextKey){
        return sum + groups[nextKey].totalHT;
      }, 0.0);

      const totalVAT = keys.reduce(function(sum, nextKey){
        return sum + groups[nextKey].totalVAT;
      }, 0.0);

      return [[
        null,
        { value: `TOTAL TVA FACTURÉE`, metadata: { style: totalStyle.id, }, },
        emptyValue, emptyValue, emptyValue, emptyValue,
        { value: formatMoney(totalHT), metadata: { style: moneyStyle.id, }, },
        emptyValue2,
        { value: formatMoney(totalVAT), metadata: { style: moneyStyle.id, }, },
        { value: formatMoney(totalHT + totalVAT), metadata: { style: moneyStyle.id, }, },
      ]];
    }

    const data = [
      ...getCompanyInfo(workbook, sheet, company, 'Déductions de T.V.A'),
      ...getTitle(),
      ...getTableHeader(),
      ...getExpenses(),
      [],
      ...renderTotals(),
    ];

    sheet.setData(data);

    sheet.setColumns([
      {width: 13}, // A
      {width: 13}, // B
      {width: 13}, // C
      {width: 13}, // D
      {width: 13}, // E
      {width: 30}, // F
      {width: 13}, // G
      {width: 13}, // H
      {width: 13}, // I
      {width: 13}, // J
      {width: 13}, // K
      {width: 13}, // L
    ]);

    return Promise.resolve(sheet);

  });
}

function createCompanyInfoSheet(workbook, company, declaration) {
  const sheet = new ExcelBuilder.Worksheet({
    name: 'Info Ste',
  });

  const now = moment();

  const startDate = moment(declaration.get('periodStart'));

  const {
    regime,
    frequency,
  } = declaration.get('settings');

  const ice = company.get('ice') || '';
  const ifNo = company.get('if') || '';
  const taxNo = '';
  const displayName = company.get('displayName');

  const activity = company.get('activity') || '';
  const address = company.get('address') || '';

  const tel = company.get('tel') || '';
  const fax = company.get('fax') || '';
  const email = company.get('email') || '';

  const stylesheet = workbook.getStyleSheet();

  const white = 'FFFFFF';

  const titleBgColor = '8DB4E2';

  const titleRowStyle =  stylesheet.createFormat({
    font: {
      bold: true,
      color: white,
      size: 14,
      underline: true,
    },

    border: {
      bottom: {color: black, style: 'thin'},
      top: {color: black, style: 'thin'},
      left: {color: black, style: 'thin'},
      right: {color: black, style: 'thin'}
    },

    fill: {
      type: 'pattern',
      patternType: 'solid',
      fgColor: titleBgColor,
    },

    alignment: {
      horizontal: 'center',
      vertical: 'center',
    },
  });

  const themeColor = stylesheet.createFormat({
    font: {
      bold: true,
      size: 18,
      color: {theme: 3},
    },

    border: {
      bottom: {color: black, style: 'thin'},
      top: {color: black, style: 'thin'},
      left: {color: black, style: 'thin'},
      right: {color: black, style: 'thin'}
    },

    alignment: {
      horizontal: 'center',
      vertical: 'center',
    },

    fill: {
      type: 'pattern',
      patternType: 'solid',
      fgColor: 'FFFFFFFF',
    },

  });

  const red = 'FFFF0000';
  const black = '00000000';

  const group1Color = black;
  const group1BgColor = 'EBF1DE';
  const group1 = stylesheet.createFormat({
    font: {
      color: group1Color,
      size: 16,
    },

    fill: {
      type: 'pattern',
      patternType: 'solid',
      fgColor: group1BgColor,
    },

    border: {
      bottom: {color: black, style: 'thin'},
      top: {color: black, style: 'thin'},
      left: {color: black, style: 'thin'},
      right: {color: black, style: 'thin'}
    },

    alignment: {
      horizontal: 'left',
      vertical: 'center',
    },

  });

  const group2Color = black;
  const group2BgColor = 'FDE9D9';
  const group2 = stylesheet.createFormat({
    font: {
      color: group2Color,
      size: 16,
    },

    fill: {
      type: 'pattern',
      patternType: 'solid',
      fgColor: group2BgColor,
    },

    border: {
      bottom: {color: black, style: 'thin'},
      top: {color: black, style: 'thin'},
      left: {color: black, style: 'thin'},
      right: {color: black, style: 'thin'}
    },

    alignment: {
      horizontal: 'left',
      vertical: 'center',
    },

  });

  const group3Color = black;
  const group3BgColor = 'DAEEF3';
  const group3 = stylesheet.createFormat({
    font: {
      color: group3Color,
      size: 16,
    },

    fill: {
      type: 'pattern',
      patternType: 'solid',
      fgColor: group3BgColor,
    },

    border: {
      bottom: {color: black, style: 'thin'},
      top: {color: black, style: 'thin'},
      left: {color: black, style: 'thin'},
      right: {color: black, style: 'thin'}
    },

    alignment: {
      horizontal: 'left',
      vertical: 'center',
    },

  });

  const group4Color = black;
  const group4BgColor = 'E4DFEC';
  const group4 = stylesheet.createFormat({
    font: {
      color: group4Color,
      size: 16,
    },

    fill: {
      type: 'pattern',
      patternType: 'solid',
      fgColor: group4BgColor,
    },

    border: {
      bottom: {color: black, style: 'thin'},
      top: {color: black, style: 'thin'},
      left: {color: black, style: 'thin'},
      right: {color: black, style: 'thin'}
    },

    alignment: {
      horizontal: 'left',
      vertical: 'center',
      wrapText: true,
    },

  });

  const group5Color = black;
  const group5BgColor = 'E26B0A';
  const group5 = stylesheet.createFormat({
    font: {
      color: group5Color,
      size: 16,
    },

    fill: {
      type: 'pattern',
      patternType: 'solid',
      fgColor: group5BgColor,
    },

    border: {
      bottom: {color: black, style: 'thin'},
      top: {color: black, style: 'thin'},
      left: {color: black, style: 'thin'},
      right: {color: black, style: 'thin'}
    },

    alignment: {
      horizontal: 'left',
      vertical: 'center',
    },

  });

  const group6Color = black;
  const group6BgColor = 'FFFF00';
  const group6 = stylesheet.createFormat({
    font: {
      color: group6Color,
      size: 16,
    },

    fill: {
      type: 'pattern',
      patternType: 'solid',
      fgColor: group6BgColor,
    },

    border: {
      bottom: {color: black, style: 'thin'},
      top: {color: black, style: 'thin'},
      left: {color: black, style: 'thin'},
      right: {color: black, style: 'thin'}
    },

    alignment: {
      horizontal: 'left',
      vertical: 'center',
    },

  });

  const data = [
    [],

    [{ value: 'Les information sur la société', metadata: {style: titleRowStyle.id} }, { value: '', metadata: {style: titleRowStyle.id}, }], // title

    [], // ROW 3

    [{ value: 'Année', metadata: {style: group1.id} }, {value : startDate.year(), metadata: {style: themeColor.id}, },],
    [{ value: 'Période', metadata: {style: group1.id} }, {value : getPeriod({ frequency, periodStart: startDate,  }), metadata: {style: themeColor.id}, },],

    [], // ROW 6

    [{ value: 'Regime', metadata: {style: group2.id} }, {value : getRegime(regime), metadata: {style: themeColor.id}, },],

    [], // ROW 8

    [{ value: 'N° ICE', metadata: {style: group3.id} }, {value : ice, metadata: {style: themeColor.id}, },],
    [{ value: 'N° d\'identification fiscale :', metadata: {style: group3.id} }, {value : ifNo, metadata: {style: themeColor.id}, },],
    [{ value: 'N° Taxe Profesionnel ', metadata: {style: group3.id} }, {value : taxNo, metadata: {style: themeColor.id}, },],
    [{ value: 'Nom,Prénom (s) ou Raison Sociale: ', metadata: {style: group3.id} }, {value : displayName, metadata: {style: themeColor.id, }},],
    [{ value: 'Activité principale :', metadata: {style: group3.id} }, {value : activity, metadata: {style: themeColor.id}, },],

    [], // ROW 14

    [{ value: 'Adresse du siège social,du principale établissement ou du domicile fiscal:', metadata: {style: group4.id} }, {value : address, metadata: {style: themeColor.id}, },],

    [], // ROW 16

    [{ value: 'Téléphone :', metadata: {style: group5.id} }, {value : tel, metadata: {style: themeColor.id}, },],
    [{ value: 'Fax :', metadata: {style: group5.id} }, {value : fax, metadata: {style: themeColor.id}, },],
    [{ value: 'e-mail:', metadata: {style: group5.id} }, {value : email, metadata: {style: themeColor.id}, },],

    [], // ROW 20

    [{ value: 'Date', metadata: {style: group6.id} }, {value : now.format('l'), metadata: {style: themeColor.id}, },],
  ];

  sheet.mergeCells('A1', 'B1');
  sheet.mergeCells('A2', 'B2');
  sheet.mergeCells('A3', 'B3');
  sheet.mergeCells('A6', 'B6');
  sheet.mergeCells('A8', 'B8');
  sheet.mergeCells('A14', 'B14');
  sheet.mergeCells('A16', 'B16');
  sheet.mergeCells('A20', 'B20');

  sheet.setData(data);

  for(let i = 0; i < data.length; i++){
    sheet.setRowInstructions(i, {
      height: 33,
    });
  }

  sheet.setRowInstructions(14, {
    height: 40,
  });

  sheet.setColumns([
    {width: 50},
    {width: 40},
  ]);

  return Promise.resolve(sheet);
}

function getPeriod({ frequency, periodStart,  }) {
  const date = moment(periodStart);

  switch (frequency){
    case 'MONTHLY':

      return `Mensuelle ${date.month() + 1}`;

    case 'QUARTERLY':

      return `Trimestre ${date.quarter()}`;
  }
}

function getRegime(regime) {
  switch (regime){
    case 1:
    case 'Standard':

      return `Encaissement`;

    case 2:
    case 'Debit':

      return `Débit`;
  }
}

function getCompanyVATDeclarationSales(company, declaration) {
  const Type = SaleClass({ id: company.id, });

  const Operation = OperationClass({ id: company.id, });

  const { periodStart, periodEnd, settings: { regime, }} = declaration.toJSON();

  function isStandard() {
    return regime === 1 || regime === 'Standard';
  }

  function getOperationsQuery() {
    const query = new Parse.Query(Operation);

    query.greaterThanOrEqualTo('date', new Date(periodStart.iso));
    query.lessThanOrEqualTo('date', new Date(periodEnd.iso));

    query.equalTo('isSale', true);

    return query;
  }

  function invoices() {

    function getInvoicesQuery() { // Invoices
      const query = new Parse.Query(Type);
      query.equalTo('kind', 'Invoice');

      query.greaterThanOrEqualTo('date', new Date(periodStart.iso));
      query.lessThanOrEqualTo('date', new Date(periodEnd.iso));

      if(isStandard()){
        query.equalTo('balanceDue', 0.0);
      }

      return query;
    }

    const opsQuery = getOperationsQuery();
    opsQuery.include([ 'invoice', 'invoiceItem', 'invoiceItem.item', 'invoice.customer' ]);

    opsQuery.exists('invoice');
    opsQuery.matchesQuery('invoice', getInvoicesQuery());

    return opsQuery.find();
  }

  function sales() {
    function getSalesQuery() { // Sales
      const query = new Parse.Query(Type);
      query.equalTo('kind', 'Sale');

      query.greaterThanOrEqualTo('date', new Date(periodStart.iso));
      query.lessThanOrEqualTo('date', new Date(periodEnd.iso));

      return query;
    }

    const opsQuery = getOperationsQuery();
    opsQuery.include([ 'sale', 'saleItem', 'saleItem.item', 'sale.customer', ]);

    opsQuery.exists('sale');
    opsQuery.matchesQuery('sale', getSalesQuery());

    return opsQuery.find();
  }

  return Promise.all([
    invoices(),
    sales(),

  ]).then(([ invoices, sales, ]) => decorateSales(concat(invoices, sales)));
}

function getCompanyVATDeclarationExpenses(company, declaration) {
  const Type = ExpenseClass({ id: company.id, });

  const Operation = OperationClass({ id: company.id, });

  const { periodStart, periodEnd, settings: { regime, }} = declaration.toJSON();

  function isStandard() {
    return regime === 1 || regime === 'Standard';
  }

  function getOperationsQuery() {
    const query = new Parse.Query(Operation);

    query.greaterThanOrEqualTo('date', new Date(periodStart.iso));
    query.lessThanOrEqualTo('date', new Date(periodEnd.iso));

    query.equalTo('isExpense', true);

    return query;
  }

  function bills() {

    function getBillsQuery() { // Bills
      const query = new Parse.Query(Type);
      query.equalTo('kind', 'Bill');

      query.greaterThanOrEqualTo('date', new Date(periodStart.iso));
      query.lessThanOrEqualTo('date', new Date(periodEnd.iso));

      if(isStandard()){
        query.equalTo('balanceDue', 0.0);
      }

      return query;
    }

    const opsQuery = getOperationsQuery();
    opsQuery.include([ 'bill', 'billItem', 'bill.payee', ]);

    opsQuery.exists('bill');
    opsQuery.matchesQuery('bill', getBillsQuery());

    return opsQuery.find();
  }

  function expenses() {
    function getExpensesQuery() { // Expenses
      const query = new Parse.Query(Type);
      query.equalTo('kind', 'Expense');

      query.greaterThanOrEqualTo('date', new Date(periodStart.iso));
      query.lessThanOrEqualTo('date', new Date(periodEnd.iso));

      query.equalTo('payeeType', 2);

      return query;
    }

    const opsQuery = getOperationsQuery();
    opsQuery.include([ 'expense', 'expenseItem', 'expense.payee', ]);

    opsQuery.exists('expense');
    opsQuery.matchesQuery('expense', getExpensesQuery());

    return opsQuery.find();
  }

  return Promise.all([
    bills(),
    expenses(),

  ]).then(([ bills, expenses, ]) => decorateExpenses(concat(bills, expenses)));
}

function decorateExpense({ balanceDue, total, totalHT, VAT, inputType, id, payee, paymentRef, creditToAccountCode, paymentMethod, mailingAddress, date, memo, }) {
  return {
    id,
    date: date.iso,
    mailingAddress,
    paymentMethod,
    paymentRef,
    creditToAccountCode,
    type: 'Expense',
    payee,
    balanceDue,
    total: total,
    totalAmountPaid: total,
    memo,
    totalHT, VAT, inputType,
  };
}

function decorateBill({ lastPaymentDate, balanceDue, total, totalHT, VAT, inputType, id, payee, paymentRef, mailingAddress, terms, date, dueDate, memo, }) {

  return {
    id,
    terms,
    date: date.iso,
    paymentRef,
    mailingAddress,
    type: 'Bill',
    payee,
    dueDate: dueDate.iso,
    totalAmount: total,
    balanceDue,
    total: total,
    memo,
    totalHT, VAT, inputType,
    lastPaymentDate,
  };
}

function decorateSale({
  totalHT, VAT, id, refNo, customer, balanceDue, total, paymentRef, inputType, depositToAccountCode, paymentMethod, billingAddress, date, discountType, discountValue, memo, }) {
  return {
    id,
    date: date.iso,
    billingAddress,
    paymentMethod,
    paymentRef,
    depositToAccountCode,
    type: 'Sale',
    refNo: parseInt(refNo),
    customer,
    discountType, discountValue,
    balanceDue,
    total,
    totalAmountReceived: total,
    memo,
    totalHT, VAT,
    inputType,
  };
}

function decorateInvoice({ lastPaymentDate, totalHT, VAT, balanceDue, total, id, refNo, customer, inputType, billingAddress, terms, date, dueDate, discountType, discountValue, memo, }) {
  return {
    id,
    terms,
    date: date.iso,
    billingAddress,
    type: 'Invoice',
    refNo: parseInt(refNo),
    customer,
    dueDate: dueDate.iso,
    discountType, discountValue,
    totalAmount: total,
    balanceDue,
    total: total,
    memo,
    totalHT, VAT,
    inputType,
    lastPaymentDate,
  };
}

function decorateSales(sales) {
  const list = [];

  for(let i = 0; i < sales.length; i++){
    const el = sales[i];

    list.push(decorateOp(el.toJSON()));
  }

  return list;
}


function decorateExpenses(expenses) {

  const list = [];

  for(let i = 0; i < expenses.length; i++){
    const el = expenses[i];

    list.push(decorateOp(el.toJSON()));

  }

  return list;
}

function getProductItem(obj){
  return obj.item.displayName;
}

function getExpenseItem(obj){
  return getAccountName(obj.accountCode);
}

const paymentMethod = {
  Cash:       'Espèces',
  1:       'Espèces',
  Check:      'Chèque',
  2:      'Chèque',
  Creditcard: 'Carte bancaire',
  3: 'Carte bancaire',
};

function decorateOp(el){
  switch (el.transactionType) {
    case 'Bill':     return Object.assign({}, el, { expenseItem: el.billItem, expense: decorateBill(el.bill), });
    case 'Expense':  return Object.assign({}, el, { expenseItem: el.expenseItem, expense: decorateExpense(el.expense), });

    case 'Sale':     return Object.assign({}, el, { saleItem: el.saleItem, sale: decorateSale(el.sale), });
    case 'Invoice':  return Object.assign({}, el, { saleItem: el.invoiceItem, sale: decorateInvoice(el.invoice), });
  }

}

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

const VAT_KEY_TO_ID = {
  Value_20: 'Value_20',
  Value_14: 'Value_14',
  Value_10: 'Value_10',
  Value_Exempt: 'Value_Exempt',
  Value_7: 'Value_7',

  1: 'Value_20',
  2: 'Value_14',
  3: 'Value_10',
  4: 'Value_Exempt',
  5: 'Value_7',
};


const VAT_VALUE_FORMATTED = {
  Value_20: '20%',
  Value_14: '14%',
  Value_10: '10%',
  Value_7: '7%',
  Value_Exempt: 'Exonéré',

  1: '20%',
  2: '14%',
  3: '10%',
  4: 'Exonéré',
  5: '7%',
};

const titleExpenses = {
  Value_20: 'TVA 20%',
  Value_14: 'TVA 14%',
  Value_10: 'TVA 10%',
  Value_7: 'TVA 7%',
  Value_Exempt: 'TVA Exonéré',
};

const key_hasVAT = {
  Value_20: true,
  Value_14: true,
  Value_10: true,
  Value_7: true,
  Value_Exempt: false,
};

const expenses_key_totals = {
  Value_20: 'TOTAL TVA 20%',
  Value_14: 'TOTAL TVA 14%',
  Value_10: 'TOTAL TVA 10%',
  Value_7: 'TOTAL TVA 7%',
  Value_Exempt: 'TOTAL TVA Exonéré',
};

class OperationDataListStore {
  constructor(ops) {
    this.size = ops.length;
    this._cache = ops;
  }

  getObjectAt(index) {
    if (index < 0 || index > this.size) {
      throw 'IllegalIndexException';
    }

    return this._cache[index];
  }

  get totalVAT(){
    if(this.__totalVAT){
      return this.__totalVAT;
    }

    let amount = 0.0;

    for(let i = 0; i < this.size; i++){
      amount += this._cache[i].VAT;
    }

    this.__totalVAT = amount;

    return amount;
  }

  get totalHT(){

    if(this.__totalHT){
      return this.__totalHT;
    }

    let amount = 0.0;

    for(let i = 0; i < this.size; i++){
      amount += this._cache[i].amount;
    }

    this.__totalHT = amount;

    return amount;
  }

  /**
   * Populates the entire cache with data.
   * Use with Caution! Behaves slowly for large sizes
   * ex. 100,000 rows
   */
  getAll() {
    return this._cache.slice();
  }

  getSize() {
    return this.size;
  }
}
