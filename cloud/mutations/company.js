const setup = require('../setup');

const makeWords = require('../makeWords');

// const Parse = require('parse/node');

const forEach = require('lodash.foreach');
const map = require('lodash.map');

const resetTransactionsSeq = require('../utils').resetTransactionsSeq;

const makeAlias = require('../utils').makeAlias;
const formatError = require('../utils').formatError;
const withCompany = require('../utils').withCompany;

const createParseObjectPointer = require('../utils').createParseObjectPointer;

const Company = require('../types').Company;

const VATDeclarationClass = require('../types').VATDeclaration;

const ProductClass = require('../types').Product;

const AccountClass = require('../types').Account;
const TransactionClass = require('../types').Transaction;
const OperationClass = require('../types').Operation;

const FileClass = require('../types').File;

const InvoiceClass = require('../types').Invoice;
const BillClass = require('../types').Bill;
const ExpenseClass = require('../types').Expense;
const PaymentOfInvoicesClass = require('../types').PaymentOfInvoices;
const PaymentOfBillsClass = require('../types').PaymentOfBills;
const SaleClass = require('../types').Sale;

const EmployeeClass = require('../types').Employee;
const CustomerClass = require('../types').Customer;
const VendorClass = require('../types').Vendor;

const InvoiceItemClass = require('../types').InvoiceItem;
const BillItemClass = require('../types').BillItem;
const SaleItemClass = require('../types').SaleItem;
const ExpenseItemClass = require('../types').ExpenseItem;
const PaymentOfInvoicesItemClass = require('../types').PaymentOfInvoicesItem;
const PaymentOfBillsItemClass = require('../types').PaymentOfBillsItem;

const moment = require('moment');
require('moment-range');

const {addInvoice, delInvoice} = require('./invoice');
const {addSale, delSale} = require('./sale');
const {receivePaymentOfInvoices, delPaymentOfInvoices} = require('./paymentOfInvoices');

const {addBill, delBill} = require('./bill');
const {addExpense, delExpense} = require('./expense');
const {makePaymentOfBills, delPaymentOfBills} = require('./paymentOfBills');

const {genPdf,} = require('./pdf');
const {genExcel,} = require('./excel');

const {delFile} = require('./file');

const legalFormsMap = {
  1: 1,
  2: 2,
  3: 3,
  4: 4,
  SARL: 1, SA:2, SNC:3, SARL_AU:4,
};

Parse.Cloud.define('genPdf', genPdf);

Parse.Cloud.define('genExcel', genExcel);

Parse.Cloud.define('delFile', delFile);

Parse.Cloud.define('addInvoice', addInvoice);
Parse.Cloud.define('delInvoice', delInvoice);

Parse.Cloud.define('addSale', addSale);
Parse.Cloud.define('delSale', delSale);

Parse.Cloud.define('addExpense', addExpense);
Parse.Cloud.define('delExpense', delExpense);

Parse.Cloud.define('delPaymentOfInvoices', delPaymentOfInvoices);
Parse.Cloud.define('receivePaymentOfInvoices', receivePaymentOfInvoices);

Parse.Cloud.define('addBill', addBill);
Parse.Cloud.define('delBill', delBill);

Parse.Cloud.define('makePaymentOfBills', makePaymentOfBills);
Parse.Cloud.define('delPaymentOfBills', delPaymentOfBills);

Parse.Cloud.beforeSave(Company, function (request, response) {
  response.success();
});

Parse.Cloud.afterSave(Company, function (request) {
  if (!request.object.existed()) {
    setup(request.object);
  }
});
Parse.Cloud.afterDelete(Company, function (request) {
  const company = request.object;

  const promises = [];

  promises.push(
    resetTransactionsSeq(company)
  );

  // Delete all products
  promises.push((function () {
    const Product = ProductClass(company);
    const query = new Parse.Query(Product);
    query.select([]);
    query.limit(100000);
    return query.find().then(function (objects) {
      return Parse.Object.destroyAll(objects);
    });
  })());

  // Delete all transactions
  promises.push((function () {
    const Transaction = TransactionClass(company);
    const query = new Parse.Query(Transaction);
    query.select([]);
    query.limit(100000);
    return query.find().then(function (objects) {
      return Parse.Object.destroyAll(objects);
    });
  })());

  // Delete all expenses
  promises.push((function () {
    const Expense = ExpenseClass(company);
    const query = new Parse.Query(Expense);
    query.select([]);
    return query.find().then(function (objects) {
      return Parse.Object.destroyAll(objects);
    });
  })());

  // Delete all sales
  promises.push((function () {
    const Sale = SaleClass(company);
    const query = new Parse.Query(Sale);
    query.select([]);
    return query.find().then(function (objects) {
      return Parse.Object.destroyAll(objects);
    });
  })());

  // Delete all payments
  promises.push((function () {
    const PaymentOfInvoices = PaymentOfInvoicesClass(company);
    const query = new Parse.Query(PaymentOfInvoices);
    query.select([]);
    query.limit(100000);
    return query.find().then(function (objects) {
      return Parse.Object.destroyAll(objects);
    });
  })());

  // Delete all invoices
  promises.push((function () {
    const Invoice = InvoiceClass(company);
    const query = new Parse.Query(Invoice);
    query.select([]);
    query.limit(100000);
    return query.find().then(function (objects) {
      return Parse.Object.destroyAll(objects);
    });
  })());

  // Delete all operations
  promises.push((function () {
    const Operation = OperationClass(company);
    const query = new Parse.Query(Operation);
    query.select([]);
    query.limit(100000);
    return query.find().then(function (objects) {
      return Parse.Object.destroyAll(objects);
    });
  })());

  // Delete all vendors
  promises.push((function () {
    const Vendor = VendorClass(company);
    const query = new Parse.Query(Vendor);
    query.select([]);
    query.limit(100000);
    return query.find().then(function (objects) {
      return Parse.Object.destroyAll(objects);
    });
  })());

  // Delete all employees
  promises.push((function () {
    const Employee = EmployeeClass(company);
    const query = new Parse.Query(Employee);
    query.select([]);
    query.limit(100000);
    return query.find().then(function (objects) {
      return Parse.Object.destroyAll(objects);
    });
  })());

  // Delete all customers
  promises.push((function () {
    const Customer = CustomerClass(company);
    const query = new Parse.Query(Customer);
    query.select([]);
    query.limit(100000);
    return query.find().then(function (objects) {
      return Parse.Object.destroyAll(objects);
    });
  })());

  // Delete all files
  promises.push((function () {
    const File = FileClass(company);
    const query = new Parse.Query(File);
    query.select([]);
    query.limit(100000);
    return query.find().then(function (objects) {
      return Parse.Object.destroyAll(objects);
    });
  })());

  // Delete all accounts
  const Account = AccountClass(company);
  const query = new Parse.Query(Account);
  query.select([]);
  query.limit(100000);

  promises.push(
    query.find().then(function (objects) {
      return Parse.Object.destroyAll(objects);
    })
  );

  return Parse.Promise.when(promises)
    .then(
      function () {
      },
      function (error) {
      }
    );
});

Parse.Cloud.define('getCompanyCurrentVATDeclaration', function (request, response) {
  const companyId = request.params.companyId;


  const VATDeclaration = VATDeclarationClass({id: request.params.companyId,});

  const qry = new Parse.Query(VATDeclaration);

  const now = moment().toDate();

  qry.lessThanOrEqualTo('periodStart', now);
  qry.greaterThanOrEqualTo('periodEnd', now);

  qry.first({
    success(decl){

      if (decl) {
        response.success(decl);
      } else {

        withCompany(companyId, function (err, company) {

          if (err) {
            response.error(formatError(err));
          }

          if (company.has('VATEnabled') ? company.get('VATEnabled') : false) {

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

            const settings = getCompanyVATSettings(company);

            const frequencyMap = {
              MONTHLY: 'month',
              QUARTERLY: 'quarter',
            };

            const unit = frequencyMap[settings.frequency];

            const periodStart = moment.utc(now).startOf(unit);
            const periodEnd = moment.utc(now).endOf(unit);

            const decl = new VATDeclaration();

            decl.set('company', company);

            decl.set('periodStart', periodStart.toDate());
            decl.set('periodEnd', periodEnd.toDate());

            decl.set('settings', settings);

            decl.save(null).then(function (obj) {
              response.success(obj);
            }, function () {
              response.error(formatError(e));
            });

          } else {
            response.success(null);
          }


        });
      }
    },

    error(e){
      response.error(formatError(e));
    },
  });

});


Parse.Cloud.define('setupVAT', function (request, response) {
  const companyId = request.params.companyId;

  const VAT_percentages = [{
    value: 1, // 20,
  }, {
    value: 2, // 14,
  }, {
    value: 3, // 10,
  }, {
    value: 5, // 7,
  }, {
    value: 4, // 0,
  }];

  // const PERCENTAGES_VALUES = [{
  //   id: 1,
  //   value: 20,
  // }, {
  //   id: 2,
  //   value: 14,
  // }, {
  //   id: 3,
  //   value: 10,
  // }, {
  //   id: 4,
  //   value: 0,
  // }, {
  //   id: 5,
  //   value: 7,
  // }];

  withCompany(companyId, function (err, company) {

    if (err) {
      response.error(formatError(err));
    }

    try {

      const VATDeclaration = VATDeclarationClass({id: request.params.companyId,});

      const agency = request.params.agency;
      const IF = request.params.IF;
      const startDate = request.params.startDate;
      const regime = request.params.regime;
      const frequency = request.params.frequency; // monthly or quarterly

      const settings = {
        agency,
        IF,
        startDate,
        regime,
        frequency,
        percentages: VAT_percentages,
      };

      company.set('VATEnabled', true);

      const regimeMap = {
        Standard: 1,
        Debit: 2,
        1: 1,
        2: 2,
      };

      function getCompanyVATSettings(company) {
        return {
          startDate: company.get('VATSetting_startDate'),
          agency: company.get('VATSetting_agency'),
          IF: company.get('VATSetting_IF'),
          frequency: company.has('VATSetting_frequency') ? company.get('VATSetting_frequency') : undefined,
          regime: company.has('VATSetting_regime') ? parseInt(company.get('VATSetting_regime')) : null,
          percentages: company.get('VATSetting_percentages') || [],
        }
      }

      const companyVATSettings = getCompanyVATSettings(company);

      const {
        frequency : oldFrequency = 'MONTHLY',
      } = companyVATSettings;

      forEach(settings, function (value, key) {

        company.set(`VATSetting_${key}`, function () {
          switch (key) {
            case 'startDate':

              return moment(value).toDate();

            case 'frequency':

              return value;

            case 'regime':

              return regimeMap[value];

            default:

              return value;

          }
        }());

      });

      const frequencyMap = {
        MONTHLY: 'month',
        QUARTERLY: 'quarter',
      };

      const frequencyMapPlural = {
        MONTHLY: 'months',
        QUARTERLY: 'quarters',
      };

      let declarationIds = [];

      function dropDeclarations() {
        const qry = new Parse.Query(VATDeclaration);

        // const {
        //   frequency : oldFrequency = 'MONTHLY',
        // } = companyVATSettings;

        const parentMap = {
          MONTHLY: {
            MONTHLY: 'month',
            QUARTERLY: 'quarter',
          },

          QUARTERLY: {
            MONTHLY: 'quarter',
            QUARTERLY: 'quarter',
          },
        };

        const unit = parentMap[oldFrequency][frequency];

        // const range = moment.range(
        //   moment.utc(startDate).startOf(unit),
        //   moment.utc().endOf(unit));

        const start = moment.utc(startDate).startOf(unit);

        qry.greaterThanOrEqualTo('periodStart', start.toDate());

        // qry.greaterThanOrEqualTo('periodStart', moment(range.start).toDate());
        // qry.lessThanOrEqualTo('periodEnd', moment(range.end).toDate());

        qry.limit(10000);

        return qry.find().then(declarations => {
          declarationIds = declarationIds.concat(declarations.map(o => o.id));
          return Parse.Object.destroyAll(declarations);
        });
      }

      function declarations(obj) {
        const unit = frequencyMap[frequency];

        // const {
        //   frequency : oldFrequency = 'MONTHLY',
        // } = companyVATSettings;

        const parentMap = {
          MONTHLY: {
            MONTHLY: 'month',
            QUARTERLY: 'quarter',
          },

          QUARTERLY: {
            MONTHLY: 'quarter',
            QUARTERLY: 'quarter',
          },
        };

        const startUnit = parentMap[oldFrequency][frequency];

        const range = moment.range(
          moment.utc(startDate).startOf(startUnit),
          moment.utc().endOf(unit));

        const periods = [];

        range.by(frequencyMapPlural[frequency], function (d) {

          periods.push({
            periodStart: moment.utc(d),
            periodEnd: moment.utc(d).endOf(unit),
          });

        });

        return map(periods, function ({periodStart, periodEnd,}) {
          const decl = new VATDeclaration();

          decl.set('company', obj);

          decl.set('periodStart', periodStart.toDate());
          decl.set('periodEnd', periodEnd.toDate());

          decl.set('settings', settings);

          return decl;
        });
      }

      company.save(null).then((obj) => {
        return dropDeclarations().then(() => {
          const os = declarations(obj);
          return Parse.Object.saveAll(os).then(objs => {
            declarationIds = declarationIds.concat(objs.map(o => o.id));
            return objs;
          });
        });
      }).then(
        function () {
          response.success({ declarations: declarationIds, });
        }, function (error) {
          response.error(formatError(error));
        }
      );

    } catch (e) {
      response.error(formatError(e));
    }

  });
});

Parse.Cloud.define('createOrUpdateCompany', function (request, response) {
  const company = new Company();

  const id = request.params.id;

  if(id){

    company.id = id;

    return company.fetch().then(function (obj) {

      request.params.fieldInfos.forEach(function (fieldInfo) {
        if (fieldInfo.fieldName === 'legalForm') {
          // obj.set(fieldInfo.fieldName, fieldInfo.value && parseInt(fieldInfo.value));
          obj.set(fieldInfo.fieldName, legalFormsMap[fieldInfo.value]);
          return;
        }

        if (fieldInfo.fieldName === 'logo') {
          return;
        }

        obj.set(fieldInfo.fieldName, fieldInfo.value);

        if (fieldInfo.fieldName === 'displayName') {
          obj.set('displayNameLowerCase', makeAlias(fieldInfo.value));
        }
      });

      obj.set('words', makeWords([
        obj.get('displayName'),
        obj.get('activity'),
      ]));

      return obj.save(null).then(obj => {
        const logo = request.params.logo;

        if (typeof logo !== 'undefined') {

          function dropLogos() {
            const File = FileClass({id: obj.id,});
            const q = new Parse.Query(File);
            q.equalTo('type', 'Logo');
            q.equalTo('company', obj);
            return q.find().then(logos => Parse.Object.destroyAll(logos));
          }

          if (logo) {
            const fp = new Parse.File(logo.name, {base64: logo.dataBase64,}, logo.type);
            return fp.save(null).then(fileObj => {
              const File = FileClass({id: obj.id,});
              const myLogo = new File();

              myLogo.set('name', logo.name);
              myLogo.set('contentType', logo.type);
              myLogo.set('size', logo.size);
              myLogo.set('file', fileObj);

              // myLogo.set('company', { className: 'Company', id: obj.id, });

              myLogo.set('type', 'Logo');
              myLogo.set('company', obj);

              return dropLogos().then(() => {
                return myLogo.save(null);
              });
            }).then(() => obj);
          } else {
            return dropLogos().then(() => {
              return obj;
            });
          }
        }

        return obj;
      });
    }).then(
      function (object) {
        response.success({companyId: object.id});
      },
      function (error) {
        response.error(formatError(error));
      }
    );

  }else{

    request.params.fieldInfos.forEach(function (fieldInfo) {
      if (fieldInfo.fieldName === 'legalForm') {
        // company.set(fieldInfo.fieldName, fieldInfo.value && parseInt(fieldInfo.value));
        company.set(fieldInfo.fieldName, legalFormsMap[fieldInfo.value]);
        return;
      }

      if (fieldInfo.fieldName === 'logo') {
        return;
      }

      company.set(fieldInfo.fieldName, fieldInfo.value);

      if (fieldInfo.fieldName === 'displayName') {
        company.set('displayNameLowerCase', makeAlias(fieldInfo.value));
      }
    });

    company.set('words', makeWords([
      company.get('displayName'),
      company.get('activity'),
    ]));

    return company.save(null).then(obj => {
      const logo = request.params.logo;

      if (typeof logo !== 'undefined') {

        if (logo) {
          const fp = new Parse.File(logo.name, {base64: logo.dataBase64,}, logo.type);
          return fp.save(null).then(fileObj => {
            const File = FileClass({id: obj.id,});
            const myLogo = new File();

            myLogo.set('name', logo.name);
            myLogo.set('contentType', logo.type);
            myLogo.set('size', logo.size);
            myLogo.set('file', fileObj);

            myLogo.set('type', 'Logo');
            myLogo.set('company', obj);

            return myLogo.save(null);
          }).then(() => obj);
        } else {
          return obj;
        }
      }

      return company;
    }).then(
      function (object) {
        response.success({companyId: object.id});
      },
      function (error) {
        response.error(formatError(error));
      }
    );
  }

});

Parse.Cloud.define('updateCompany', function (request, response) {
  const company = new Company();

  company.id = request.params.id;

  return company.fetch().then(function (obj) {

    request.params.fieldInfos.forEach(function (fieldInfo) {
      if (fieldInfo.fieldName === 'legalForm') {
        // obj.set(fieldInfo.fieldName, fieldInfo.value && parseInt(fieldInfo.value));
        obj.set(fieldInfo.fieldName, legalFormsMap[fieldInfo.value]);
        return;
      }

      if (fieldInfo.fieldName === 'logo') {
        return;
      }

      obj.set(fieldInfo.fieldName, fieldInfo.value);

      if (fieldInfo.fieldName === 'displayName') {
        obj.set('displayNameLowerCase', makeAlias(fieldInfo.value));
      }
    });

    obj.set('words', makeWords([
      obj.get('displayName'),
      obj.get('activity'),
    ]));

    return obj.save(null).then(obj => {
      const logo = request.params.logo;

      if (typeof logo !== 'undefined') {

        function dropLogos() {
          const File = FileClass({id: obj.id,});
          const q = new Parse.Query(File);
          q.equalTo('type', 'Logo');
          q.equalTo('company', obj);
          return q.find().then(logos => Parse.Object.destroyAll(logos));
        }

        if (logo) {
          const fp = new Parse.File(logo.name, {base64: logo.dataBase64,}, logo.type);
          return fp.save(null).then(fileObj => {
            const File = FileClass({id: obj.id,});
            const myLogo = new File();

            myLogo.set('name', logo.name);
            myLogo.set('contentType', logo.type);
            myLogo.set('size', logo.size);
            myLogo.set('file', fileObj);

            // myLogo.set('company', { className: 'Company', id: obj.id, });

            myLogo.set('type', 'Logo');
            myLogo.set('company', obj);

            return dropLogos().then(() => {
              return myLogo.save(null);
            });
          }).then(() => obj);
        } else {
          return dropLogos().then(() => {
            return obj;
          });
        }
      }

      return obj;
    });
  }).then(
    function (object) {
      response.success({updatedCompanyId: object.id});
    },
    function (error) {
      response.error(formatError(error));
    }
  );

});

Parse.Cloud.define('updateCompanySettings', function (request, response) {
  const company = new Company();

  company.id = request.params.id;

  var error = null;

  Object.keys(request.params.settings).forEach(function (fieldName) {

    if (error) {
      return;
    }

    if (fieldName === 'periodType') {
      company.set(fieldName, request.params.settings[fieldName]);
      return;
    }

    if (fieldName === 'closureEnabled' && request.params.settings['closureEnabled']) {
      const closureDate = request.params.settings['closureDate'];
      if (!closureDate || !moment(closureDate).isValid()) {
        error = new Error('Invalid closureDate');
        return;
      }
    }

    company.set('settings_key_' + fieldName, request.params.settings[fieldName]);
  });

  if (error) {
    response.error(formatError(error));
    return;
  }

  return company.save(null).then(
    function (object) {
      response.success({updatedCompanyId: object.id})
    },
    function (error) {
      response.error(error)
    }
  );
});

Parse.Cloud.define('updateCustomerNotes', function (request, response) {
  const Customer = CustomerClass({id: request.params.companyId});
  const customer = new Customer();

  customer.id = request.params.id;

  customer.fetch().then(function (obj) {

    obj.set('notes', request.params.notes);

    obj.set('words', makeWords([
      obj.get('displayName'),
      obj.get('notes'),
    ]));

    return obj.save(null);
  }).then(
    function (object) {
      response.success({updatedCustomerId: object.id,});
    }).catch(function (error) {
    response.error(formatError(error));
  });

  // customer.set('notes', request.params.notes);

  // return customer.save(null).then(
  //   function (object) {
  //     response.success({updatedCustomerId: object.id})
  //   },
  //   function (error) {
  //     console.log(error);
  //     response.error(formatError(error));
  //   }
  // );
});
Parse.Cloud.define('updateVendorNotes', function (request, response) {
  const Vendor = VendorClass({id: request.params.companyId})
  const vendor = new Vendor();

  vendor.id = request.params.id;

  vendor.fetch().then(function (obj) {

    obj.set('notes', request.params.notes);

    obj.set('words', makeWords([
      obj.get('displayName'),
      obj.get('notes'),
    ]));

    return obj.save(null);
  }).then(
    function (object) {
      response.success({updatedVendorId: object.id,});
    }).catch(function (error) {
    response.error(formatError(error));
  });

  // vendor.set('notes', request.params.notes);

  // return vendor.save(null).then(
  //   function (object) {
  //     response.success({ updatedVendorId: object.id})
  //   },
  //   function (error) {
  //     response.error(error)
  //   }
  // );
});

Parse.Cloud.define('updateCompanySalesSettings', function (request, response) {
  const company = new Company();

  company.id = request.params.id;

  Object.keys(request.params.settings).forEach(function (fieldName) {
    company.set('sales_setting_key_' + fieldName, request.params.settings[fieldName]);
  });

  return company.save(null).then(
    function (object) {
      response.success({updatedCompanyId: object.id})
    },
    function (error) {
      response.error(error)
    }
  );
});

Parse.Cloud.define('updateCompanyExpensesSettings', function (request, response) {
  const company = new Company();

  company.id = request.params.id;

  Object.keys(request.params.settings).forEach(function (fieldName) {
    company.set('expenses_setting_key_' + fieldName, request.params.settings[fieldName]);
  });

  return company.save(null).then(
    function (object) {
      response.success({updatedCompanyId: object.id})
    },
    function (error) {
      response.error(error)
    }
  );
});

Parse.Cloud.define('updateCompanyPaymentsSettings', function (request, response) {
  const company = new Company();

  company.id = request.params.id;

  Object.keys(request.params.settings).forEach(function (fieldName) {
    company.set('payments_setting_key_' + fieldName, request.params.settings[fieldName]);
  });

  return company.save(null).then(
    function (object) {
      response.success({updatedCompanyId: object.id})
    },
    function (error) {
      response.error(error)
    }
  );
});

Parse.Cloud.define('resetApp', function (request, response) {
  const query = new Parse.Query(Company);
  query.find().then(
    function (objects) {
      return Parse.Object.destroyAll(objects);
    }
  ).then(
    function () {
      response.success({ok: true});
    },
    function (error) {
      response.error(formatError(error));
    }
  );
});

Parse.Cloud.define('delCompany', function (request, response) {
  const company = new Company();
  company.id = request.params.id;

  company.set('deleted', true);

  return company.save(null).then(
    function (result) {
      response.success({deletedCompanyId: result.id})
    },

    function (error) {
      response.error(error)
    }
  );
});

Parse.Cloud.define('addProduct', function (request, response) {
  const File = FileClass({id: request.params.companyId,});

  const Product = ProductClass({id: request.params.companyId});
  const product = new Product();

  if (typeof request.params.id !== 'undefined') {
    product.id = request.params.id;

    return product.fetch().then(function (obj) {

      request.params.fieldInfos.forEach(function (fieldInfo) {
        if (fieldInfo.fieldName === 'image') {
          // TODO: save image here
          return;
        }

        if (fieldInfo.fieldName === 'salesVATPart' || fieldInfo.fieldName === 'purchaseVATPart') {
          obj.set(fieldInfo.fieldName, fieldInfo.value ? JSON.parse(fieldInfo.value) : null);
          return;
        }

        if (fieldInfo.fieldName === 'salesEnabled' || fieldInfo.fieldName === 'purchaseEnabled' || fieldInfo.fieldName === 'active') {
          obj.set(fieldInfo.fieldName, fieldInfo.value === 'true');
          return;
        }

        obj.set(fieldInfo.fieldName, fieldInfo.value);

        if (fieldInfo.fieldName === 'displayName') {
          obj.set('displayNameLowerCase', makeAlias(fieldInfo.value));
        }
      });

      obj.set('words', makeWords([
        obj.get('displayName'),
        obj.get('salesDesc'),
        obj.get('purchaseDesc'),
      ]));

      // const image = request.params.image;
      //
      // if(typeof image !== 'undefined'){
      //   if(image){
      //     const fp = new Parse.File(image.name, { base64: image.dataBase64, }, image.type);
      //     return fp.save(null).then(fileObj => {
      //       const File = FileClass({ id: request.params.companyId, });
      //       const myImage = new File();
      //
      //       myImage.set('name', image.name);
      //       myImage.set('contentType', image.type);
      //       myImage.set('size', image.size);
      //       myImage.set('file', fileObj);
      //
      //       myImage.set('company', { className: 'Company', id: request.params.companyId});
      //
      //       myImage.set('type', 'Item');
      //       myImage.set('item', obj);
      //
      //       return myImage.save(null).then(myImage => {
      //         obj.set('image', myImage);
      //         return obj.save(null);
      //       });
      //     });
      //   }else{
      //     obj.set('image', null);
      //   }
      // }

      return obj.save(null).then(obj => {
        const image = request.params.image;

        if (typeof image !== 'undefined') {

          function dropImages() {
            const q = new Parse.Query(File);
            q.equalTo('type', 'Item');
            q.equalTo('item', obj);
            return q.find().then(logos => Parse.Object.destroyAll(logos));
          }

          if (image) {
            const fp = new Parse.File(image.name, {base64: image.dataBase64,}, image.type);
            return fp.save(null).then(fileObj => {
              const myImage = new File();

              myImage.set('name', image.name);
              myImage.set('contentType', image.type);
              myImage.set('size', image.size);
              myImage.set('file', fileObj);

              // myImage.set('company', { __type: 'Pointer', className: 'Company', objectId: request.params.companyId, });
              myImage.set('company', createParseObjectPointer(Parse, 'Company', request.params.companyId));

              myImage.set('type', 'Item');
              myImage.set('item', obj);

              return dropImages().then(() => myImage.save(null)).then(() => obj);
            });
          } else {
            return dropImages().then(() => obj);
          }
        }

        return obj;
      });
    }).then(
      function (object) {
        response.success({addedProductId: object.id,});
      },
      function (error) {
        response.error(formatError(error));
      }
    );
  }

  request.params.fieldInfos.forEach(function (fieldInfo) {
    if (fieldInfo.fieldName === 'image') {
      // TODO: save image here
      return;
    }

    if (fieldInfo.fieldName === 'salesVATPart' || fieldInfo.fieldName === 'purchaseVATPart') {
      product.set(fieldInfo.fieldName, fieldInfo.value ? JSON.parse(fieldInfo.value) : null);
      return;
    }

    if (fieldInfo.fieldName === 'salesEnabled' || fieldInfo.fieldName === 'purchaseEnabled' || fieldInfo.fieldName === 'active') {
      product.set(fieldInfo.fieldName, fieldInfo.value === 'true');
      return;
    }

    product.set(fieldInfo.fieldName, fieldInfo.value);

    if (fieldInfo.fieldName === 'displayName') {
      product.set('displayNameLowerCase', makeAlias(fieldInfo.value));
    }
  });

  product.set('words', makeWords([
    product.get('displayName'),
    product.get('salesDesc'),
    product.get('purchaseDesc'),
  ]));

  product.set('company', {className: 'Company', id: request.params.companyId});
  product.set('user', request.user ? {className: '_User', id: request.user.id} : null);

  // const image = request.params.image;
  //
  // if(typeof image !== 'undefined'){
  //   if(image){
  //     const fp = new Parse.File(image.name, { base64: image.dataBase64, }, image.type);
  //     return fp.save(null).then(fileObj => {
  //       const File = FileClass({ id: request.params.companyId, });
  //       const myImage = new File();
  //
  //       myImage.set('name', image.name);
  //       myImage.set('contentType', image.type);
  //       myImage.set('size', image.size);
  //       myImage.set('file', fileObj);
  //
  //       myImage.set('company', { className: 'Company', id: request.params.companyId});
  //
  //       myImage.set('type', 'Item');
  //
  //       return myImage.save(null).then(myImage => {
  //         product.set('image', myImage);
  //         return product.save(null).then(obj => {
  //           myImage.set('item', obj);
  //           return myImage.save().then(() => obj);
  //         });
  //       });
  //     });
  //   }
  // }

  return product.save(null).then(obj => {
    const image = request.params.image;

    if (typeof image !== 'undefined') {

      function dropImages() {
        const q = new Parse.Query(File);
        q.equalTo('type', 'Item');
        q.equalTo('item', obj);
        return q.find().then(logos => Parse.Object.destroyAll(logos));
      }

      if (image) {
        const fp = new Parse.File(image.name, {base64: image.dataBase64,}, image.type);
        return fp.save(null).then(fileObj => {
          const myImage = new File();

          myImage.set('name', image.name);
          myImage.set('contentType', image.type);
          myImage.set('size', image.size);
          myImage.set('file', fileObj);

          myImage.set('company', createParseObjectPointer(Parse, 'Company', request.params.companyId));

          myImage.set('type', 'Item');
          myImage.set('item', obj);

          return dropImages().then(() => myImage.save(null)).then(() => obj);
        });
      } else {
        return dropImages().then(() => obj);
      }
    }

    return obj;
  }).then(
    function (object) {
      response.success({addedProductId: object.id})
    },
    function (error) {
      response.error(error)
    }
  );
});

Parse.Cloud.define('delProduct', function (request, response) {
  const Product = ProductClass({id: request.params.companyId,})
  const product = new Product();
  product.id = request.params.id;

  return product.destroy().then(
    function (result) {
      // console.log('Delete product returned: ' + JSON.stringify(result));
      response.success({deletedProductId: result.objectId})
    },

    function (error) {
      response.error(error)
    }
  );
});

Parse.Cloud.define('addCompany', function (request, response) {
  const company = new Company();

  if (typeof request.params.id !== 'undefined') {
    company.id = request.params.id;

    return company.fetch().then(function (obj) {

      obj.set('displayName', request.params.displayName);
      obj.set('displayNameLowerCase', makeAlias(request.params.displayName));

      obj.set('periodType', request.params.periodType);

      obj.set('words', makeWords([
        obj.get('displayName'),
        obj.get('activity'),
      ]));

      return obj.save(null);
    }).then(
      function (object) {
        response.success({addedCompanyId: object.id});
      },
      function (error) {
        response.error(formatError(error));
      }
    );
  } else {
    company.set('kind', 'Company');
  }

  company.set('displayName', request.params.displayName);
  company.set('displayNameLowerCase', makeAlias(request.params.displayName));

  company.set('user', request.user ? {className: '_User', id: request.user.id} : null);

  company.set('periodType', request.params.periodType);

  company.set('words', makeWords([
    company.get('displayName'),
    company.get('activity'),
  ]));

  return company.save(null).then(
    function (object) {
      response.success({addedCompanyId: object.id})
    },
    function (error) {
      response.error(error)
    }
  );
});

Parse.Cloud.define('addEmployee', function (request, response) {
  const Employee = EmployeeClass({id: request.params.companyId});
  const employee = new Employee();

  if (typeof request.params.id !== 'undefined') {
    employee.id = request.params.id;

    return employee.fetch().then(function (obj) {

      request.params.fieldInfos.forEach(function (fieldInfo) {
        const fieldName = fieldInfo.fieldName;
        const value = fieldInfo.value;

        if (fieldName === 'displayName') {
          obj.set('displayNameLowerCase', makeAlias(value));
        }

        if (fieldName === 'active') {
          obj.set(fieldName, value === 'true');
          return;
        }

        obj.set(fieldName, value);
      });

      obj.set('words', makeWords([
        obj.get('displayName'),
        obj.get('notes'),

        obj.get('address_streetAddress'),
        obj.get('address_cityTown'),
        obj.get('address_stateProvince'),
        obj.get('address_postalCode'),
        obj.get('address_country'),
      ]));

      return obj.save(null);
    }).then(
      function (object) {
        response.success({addedEmployeeId: object.id,});
      },
      function (error) {
        response.error(formatError(error));
      }
    );
  }

  request.params.fieldInfos.forEach(function (fieldInfo) {
    const fieldName = fieldInfo.fieldName;
    const value = fieldInfo.value;

    if (fieldName === 'active') {
      employee.set(fieldName, value === 'true');
      return;
    }

    if (fieldName === 'displayName') {
      employee.set('displayNameLowerCase', makeAlias(value));
    }

    employee.set(fieldName, value);
  });

  employee.set('words', makeWords([
    employee.get('displayName'),
    employee.get('notes'),

    employee.get('address_streetAddress'),
    employee.get('address_cityTown'),
    employee.get('address_stateProvince'),
    employee.get('address_postalCode'),
    employee.get('address_country'),
  ]));

  employee.set('company', {className: 'Company', id: request.params.companyId});
  employee.set('user', request.user ? {className: '_User', id: request.user.id} : null);

  // 1. save employee

  return employee.save(null).then(function (object) {
    response.success({addedEmployeeId: object.id})
  }, function (error) {
    response.error(error)
  });
});
Parse.Cloud.define('delEmployee', function (request, response) {
  const Employee = EmployeeClass({id: request.params.companyId,})
  const product = new Employee();
  product.id = request.params.id;

  return product.destroy().then(
    function (result) {
      // console.log('Delete product returned: ' + JSON.stringify(result));
      response.success({deletedEmployeeId: result.objectId})
    },

    function (error) {
      response.error(error)
    }
  );
});

Parse.Cloud.define('addCustomer', function (request, response) {
  const Customer = CustomerClass({id: request.params.companyId});
  const customer = new Customer();

  if (typeof request.params.id !== 'undefined') {
    customer.id = request.params.id;

    return customer.fetch().then(function (obj) {

      request.params.fieldInfos.forEach(function (fieldInfo) {
        const fieldName = fieldInfo.fieldName;
        const value = fieldInfo.value;

        if (fieldName === 'active') {
          obj.set(fieldName, value === 'true');
          return;
        }

        if (fieldName === 'displayName') {
          obj.set('displayNameLowerCase', makeAlias(value));
        }

        obj.set(fieldName, value);
      });

      obj.set('words', makeWords([
        obj.get('displayName'),
        obj.get('affiliation'),
        obj.get('notes'),

        obj.get('billing_streetAddress'),
        obj.get('billing_cityTown'),
        obj.get('billing_stateProvince'),
        obj.get('billing_postalCode'),
        obj.get('billing_country'),
      ]));

      return obj.save(null);
    }).then(
      function (object) {
        response.success({addedCustomerId: object.id,});
      },
      function (error) {
        response.error(formatError(error));
      }
    );
  }

  request.params.fieldInfos.forEach(function (fieldInfo) {
    const fieldName = fieldInfo.fieldName;
    const value = fieldInfo.value;

    if (fieldName === 'active') {
      employee.set(fieldName, value === 'true');
      return;
    }

    if (fieldName === 'displayName') {
      customer.set('displayNameLowerCase', makeAlias(value));
    }

    customer.set(fieldName, value);
  });

  customer.set('words', makeWords([
    customer.get('displayName'),
    customer.get('affiliation'),
    customer.get('notes'),

    customer.get('billing_streetAddress'),
    customer.get('billing_cityTown'),
    customer.get('billing_stateProvince'),
    customer.get('billing_postalCode'),
    customer.get('billing_country'),
  ]));

  customer.set('company', {className: 'Company', id: request.params.companyId});
  customer.set('user', request.user ? {className: '_User', id: request.user.id} : null);

  // 1. save customer

  return customer.save(null).then(function (object) {
    response.success({addedCustomerId: object.id})
  }, function (error) {
    response.error(error)
  });
});
Parse.Cloud.define('delCustomer', function (request, response) {
  const Customer = CustomerClass({id: request.params.companyId,})
  const customer = new Customer();
  customer.id = request.params.id;

  return customer.destroy().then(
    function (result) {
      // console.log('Delete customer returned: ' + JSON.stringify(result));
      response.success({deletedCustomerId: result.objectId})
    },

    function (error) {
      response.error(error)
    }
  );
});


Parse.Cloud.define('addVendor', function (request, response) {
  const Vendor = VendorClass({id: request.params.companyId});
  const vendor = new Vendor();

  if (typeof request.params.id !== 'undefined') {
    vendor.id = request.params.id;

    return vendor.fetch().then(function (obj) {

      request.params.fieldInfos.forEach(function (fieldInfo) {
        const fieldName = fieldInfo.fieldName;
        const value = fieldInfo.value;

        if (fieldName === 'active') {
          obj.set(fieldName, value === 'true');
          return;
        }

        if (fieldName === 'displayName') {
          obj.set('displayNameLowerCase', makeAlias(value));
        }

        obj.set(fieldName, value);
      });

      obj.set('words', makeWords([
        obj.get('displayName'),
        obj.get('affiliation'),
        obj.get('notes'),

        obj.get('mailing_streetAddress'),
        obj.get('mailing_cityTown'),
        obj.get('mailing_stateProvince'),
        obj.get('mailing_postalCode'),
        obj.get('mailing_country'),
      ]));

      return obj.save(null);
    }).then(
      function (object) {
        response.success({addedVendorId: object.id,});
      },
      function (error) {
        response.error(formatError(error));
      }
    );
  }

  request.params.fieldInfos.forEach(function (fieldInfo) {
    const fieldName = fieldInfo.fieldName;
    const value = fieldInfo.value;

    if (fieldName === 'active') {
      vendor.set(fieldName, value === 'true');
      return;
    }

    if (fieldName === 'displayName') {
      vendor.set('displayNameLowerCase', makeAlias(value));
    }

    vendor.set(fieldName, value);
  });

  vendor.set('words', makeWords([
    vendor.get('displayName'),
    vendor.get('affiliation'),
    vendor.get('notes'),

    vendor.get('mailing_streetAddress'),
    vendor.get('mailing_cityTown'),
    vendor.get('mailing_stateProvince'),
    vendor.get('mailing_postalCode'),
    vendor.get('mailing_country'),
  ]));

  vendor.set('company', {className: 'Company', id: request.params.companyId});
  vendor.set('user', request.user ? {className: '_User', id: request.user.id} : null);

  // 1. save vendor

  return vendor.save(null).then(function (object) {
    response.success({addedVendorId: object.id,});
  }, function (error) {
    response.error(formatError(error));
  });
});
Parse.Cloud.define('delVendor', function (request, response) {
  const Vendor = VendorClass({id: request.params.companyId,})
  const vendor = new Vendor();
  vendor.id = request.params.id;

  return vendor.destroy().then(
    function (result) {
      // console.log('Delete vendor returned: ' + JSON.stringify(result));
      response.success({deletedVendorId: result.objectId})
    },

    function (error) {
      response.error(error)
    }
  );
});
