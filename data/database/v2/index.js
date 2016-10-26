/**
 *  Copyright (c) 2015, Epsilon, SARL.
 *  All rights reserved.
 *
 */

const Parse = require('parse');

const Account = require('../Account');
const Company = require('../Company');
const Transaction = require('../Transaction');
const Operation = require('../Operation');

const Bank = require('../Bank');

const People = require('./People');

const Product = require('../Product');

const VATDeclaration = require('../VATDeclaration');

const File = require('../File');

const Expense = require('./Expense');
const Sale = require('./Sale');

const InvoiceItem = require('../InvoiceItem');
const PaymentOfInvoicesItem = require('../PaymentOfInvoicesItem');
const PaymentOfBillsItem = require('../PaymentOfBillsItem');

const ExpenseItem = require('../ExpenseItem');
const BillItem = require('../BillItem');

const SaleItem = require('../SaleItem');

const concat = require('lodash.concat');
const map = require('lodash.map');
const compact = require('lodash.compact');
const group = require('lodash.groupby');

const chartOfAccounts = require('../accounts.json');

const moment = require('moment');

const { DEFAULT_RECENT_DAYS, } = require('../../constants');

const { parseIDLoader, parseTableLoader, parseTableCountLoader, } = require('../loaders');

module.exports.getViewer = function getViewer() {
  return Parse.User.current();
};

module.exports.getUser = function getUser(id) {
  return parseIDLoader.load([Parse.User, id]);
};

module.exports.getVATDeclaration = function getVATDeclaration(info) { return getTypeById(VATDeclaration, info); };

module.exports.getCompanyVATDeclarationHistory = function getCompanyVATDeclarationHistory(company){
  const qry = new Parse.Query(VATDeclaration({ id: company.id, }));
  qry.descending('periodStart');
  qry.limit(100000);
  return qry.find();
};
module.exports.getVATDeclarationAtDate = function getVATDeclarationAtDate(companyId, date){
  const qry = new Parse.Query(VATDeclaration({ id: companyId, }));

  qry.lessThanOrEqualTo('periodStart', new Date(date));
  qry.greaterThanOrEqualTo('periodEnd', new Date(date));

  return qry.first();
};
module.exports.getVATDeclarationById = function getVATDeclarationById({ id: companyId, }, id){
  const Type = VATDeclaration({ id: companyId, });
  return parseIDLoader.load([Type, id]);
};
module.exports.getCompanyCurrentVATDeclaration = function getCompanyCurrentVATDeclaration(company){
  return Parse.Cloud.run('getCompanyCurrentVATDeclaration', { companyId: company.id, });
};

module.exports.getProduct = function getProduct(info) { return getTypeById(Product, info); };
module.exports.getFile = function getFile(info) { return getTypeById(File, info); };

module.exports.getBank = function getBank(info) { return getTypeById(Bank, info); };

module.exports.getEmployee = function getEmployee(info) { return getTypeById(People, info); };
module.exports.getCustomer = function getCustomer(info) { return getTypeById(People, info); };
module.exports.getVendor = function getVendor(info) { return getTypeById(People, info); };

module.exports.getExpense = function getExpense(info) { return getTypeById(Expense, info); };
module.exports.getSale = function getSale(info) { return getTypeById(Sale, info); };
module.exports.getInvoice = function getInvoice(info) { return getTypeById(Sale, info); };

module.exports.getBill = function getBill(info) { return getTypeById(Expense, info); };
module.exports.getPaymentOfInvoices = function getPaymentOfInvoices(info) { return getTypeById(Sale, info); };
module.exports.getPaymentOfBills = function getPaymentOfBills(info) { return getTypeById(Expense, info); };

module.exports.getInvoiceItem = function getInvoiceItem(info) { return getTypeById(InvoiceItem, info); };
module.exports.getPaymentOfInvoicesItem = function getPaymentOfInvoicesItem(info) { return getTypeById(PaymentOfInvoicesItem, info); };
module.exports.getPaymentOfBillsItem = function getPaymentOfBillsItem(info) { return getTypeById(PaymentOfBillsItem, info); };

module.exports.getExpenseItem = function getExpenseItem(info) { return getTypeById(ExpenseItem, info); };
module.exports.getBillItem = function getBillItem(info) { return getTypeById(BillItem, info); };
module.exports.getSaleItem = function getSaleItem(info) { return getTypeById(SaleItem, info); };

module.exports.getTransaction = function getTransaction(info) {
  return getTypeById(Transaction, info);
};

module.exports.getCompany = function getCompany(id) {
  return parseIDLoader.load([Company, id]);
};

module.exports.getCompanies = function getCompanies() {
  return parseTableLoader.load(Company);
};

module.exports.getCompanyProducts = function getCompanyProducts(company) {
  return parseTableLoader.load(Product({id: company.id}));
};

module.exports.getBankAccounts = function getBankAccounts() {

  return [
    { ...chartOfAccounts['5.1.6.1.1'], icon: 'attach_money', __type: 'Bank', },
    { ...chartOfAccounts['5.1.4.1'], icon: 'account_balance', __type: 'Bank', },
  ];
};

module.exports.getOperation = function getOperation(info) {
  return getTypeById(Operation, info);
};

module.exports.getOperationsByCategories = function getOperationsByCategories({ companyId, from, to, type, categories, }) {
  const qry = new Parse.Query(Operation({ id: companyId, }));

  if(process.env.NODE_ENV !== 'production'){
    console.assert(Array.isArray(categories, 'categories should be an array'));
  }

  qry.containedIn('categoryCode', categories);
  if(type){
    qry.equalTo('type', type);
  }
  if(from){
    qry.greaterThanOrEqualTo('date', new Date(from));
  }
  if(to){
    qry.lessThanOrEqualTo('date', new Date(to));
  }
  qry.ascending('date');
  qry.limit(100000);
  return qry.find();
};

module.exports.getAccount = function getAccount(info) {
  return getTypeById(Account, info);
};

module.exports.getCompanyAccounts = function getCompanyAccounts(company) {
  return parseTableLoader.load(Account({id: company.id}));
};

module.exports.getTransactions = function getTransactions(company) {
  return parseTableLoader.load(Transaction({id: company.id}));
};

module.exports.getTransactionOperations = function getTransactionOperations({ companyId, id, }) {
  const qry = new Parse.Query(Operation({ id: companyId, }));
  qry.equalTo('transaction', Transaction({ id: companyId, }).createWithoutData(id));
  qry.limit(100000);
  return qry.find();
};

module.exports.getTransactionByType = function getTransactionByType({ type, companyId, id, }) {
  const qry = new Parse.Query(Transaction({ id: companyId, }));
  qry.equalTo('transactionType', type);

  switch(type){
    case 'Invoice':           qry.equalTo('invoice', Sale({ id: companyId, }).createWithoutData(id)); break;
    case 'Sale':              qry.equalTo('sale', Sale({ id: companyId, }).createWithoutData(id)); break;
    case 'PaymentOfInvoices': qry.equalTo('paymentOfInvoices', Sale({ id: companyId, }).createWithoutData(id)); break;

    case 'Bill':           qry.equalTo('bill', Expense({ id: companyId, }).createWithoutData(id)); break;
    case 'Expense':        qry.equalTo('expense', Expense({ id: companyId, }).createWithoutData(id)); break;
    case 'PaymentOfBills': qry.equalTo('paymentOfBills', Expense({ id: companyId, }).createWithoutData(id)); break;
  }

  return qry.first();
};

module.exports.declaration_sales_getTotalVAT = function declaration_sales_getTotalVAT(company, declaration) {
  const Type = Sale({ id: company.id, });

  const { periodStart, periodEnd, settings: { regime, }} = declaration;

  function isStandard() {
    return regime === 1 || regime === 'Standard';
  }

  function getQuery() { // Invoices + Sales
    // const query = function(){
    //   const q0 = new Parse.Query(Type);
    //   q0.equalTo('kind', 'Invoice');
    //
    //   const q1 = new Parse.Query(Type);
    //   q1.equalTo('kind', 'Sale');
    //
    //   return Parse.Query.or(
    //     q0,
    //     q1);
    // }();

    const query = new Parse.Query(Type);
    query.containedIn('kind', [ 'Invoice', 'Sale', ]);

    query.greaterThanOrEqualTo('date', new Date(periodStart));
    query.lessThanOrEqualTo('date', new Date(periodEnd));

    if(isStandard()){
      query.equalTo('balanceDue', 0.0);
    }

    return query;
  }

  return new Promise((resolve) => {
    let totalVAT = 0.0;

    getQuery().each(
      function(obj){
        totalVAT += obj.get('VAT');
      }, {
        success: function(){
          resolve(totalVAT);
        },

        error: function(error){
          reject(error);
        }
      }
    );

  });
};

module.exports.declaration_expenses_getTotalVAT = function declaration_expenses_getTotalVAT(company, declaration) {
  const Type = Expense({ id: company.id, });

  const { periodStart, periodEnd, settings: { regime, }} = declaration;

  function isStandard() {
    return regime === 1 || regime === 'Standard';
  }

  function getQuery() { // Bills + Expenses
    // const query = function(){
    //   const q0 = new Parse.Query(Type);
    //   q0.equalTo('kind', 'Expense');
    //
    //   const q1 = new Parse.Query(Type);
    //   q1.equalTo('kind', 'Bill');
    //
    //   return Parse.Query.or(
    //     q0,
    //     q1);
    // }();

    const query = new Parse.Query(Type);
    query.containedIn('kind', [ 'Bill', 'Expense', ]);

    query.greaterThanOrEqualTo('date', new Date(periodStart));
    query.lessThanOrEqualTo('date', new Date(periodEnd));

    if(isStandard()){
      query.equalTo('balanceDue', 0.0);
    }

    return query;
  }

  return new Promise((resolve) => {
    let totalVAT = 0.0;

    getQuery().each(
      function(obj){
        totalVAT += obj.get('VAT');
      }, {
        success: function(){
          resolve(totalVAT);
        },

        error: function(error){
          reject(error);
        }
      }
    );

  });
};

module.exports._getCompanyVATDeclarationSales = function _getCompanyVATDeclarationSales(company, declaration) {
  const Type = Sale({ id: company.id, });

  const { periodStart, periodEnd, settings: { regime, }} = declaration;

  function isStandard() {
    return regime === 1 || regime === 'Standard';
  }

  function getOperationsQuery() {
    const query = new Parse.Query(Operation({ id: company.id, }));

    query.greaterThanOrEqualTo('date', new Date(periodStart));
    query.lessThanOrEqualTo('date', new Date(periodEnd));

    query.equalTo('isSale', true);

    return query;
  }

  function invoices() {

    function getInvoicesQuery() { // Invoices
      const query = new Parse.Query(Type);
      query.equalTo('kind', 'Invoice');

      query.greaterThanOrEqualTo('date', new Date(periodStart));
      query.lessThanOrEqualTo('date', new Date(periodEnd));

      if(isStandard()){
        query.equalTo('balanceDue', 0.0);
      }

      return query;
    }

    const opsQuery = getOperationsQuery();
    opsQuery.include([ 'invoice', 'invoiceItem' ]);

    opsQuery.exists('invoice');
    opsQuery.matchesQuery('invoice', getInvoicesQuery());

    return opsQuery.find();
  }

  function sales() {
    function getSalesQuery() { // Sales
      const query = new Parse.Query(Type);
      query.equalTo('kind', 'Sale');

      query.greaterThanOrEqualTo('date', new Date(periodStart));
      query.lessThanOrEqualTo('date', new Date(periodEnd));

      return query;
    }

    const opsQuery = getOperationsQuery();
    opsQuery.include([ 'sale', 'saleItem' ]);

    opsQuery.exists('sale');
    opsQuery.matchesQuery('sale', getSalesQuery());

    return opsQuery.find();
  }

  function report() {
    return new Promise((resolve) => {
      let totalHT = 0.0;
      let totalVAT = 0.0;

      function getCountQuery() { // Invoices + Sales
        const query = new Parse.Query(Type);
        query.containedIn('kind', [ 'Invoice', 'Sale', ]);

        query.greaterThanOrEqualTo('date', new Date(periodStart));
        query.lessThanOrEqualTo('date', new Date(periodEnd));

        if(isStandard()){
          query.equalTo('balanceDue', 0.0);
        }

        return query;
      }

      getCountQuery().each(
        function(obj){
          totalHT += obj.get('totalHT');
          totalVAT += obj.get('VAT');
        }, {
          success: function(){
            resolve({ totalVAT, totalHT, });
          },

          error: function(error){
            reject(error);
          }
        }
      );

    });
  }

  return Promise.all([
    report(),
    invoices(),
    sales(),

  ]).then(([ { ...propsReport, }, invoices, sales, ]) => ({ ...propsReport, sales: concat(invoices, sales), }));
};

module.exports._getCompanyVATDeclarationExpenses = function _getCompanyVATDeclarationExpenses(company, declaration) {
  const Type = Expense({ id: company.id, });

  const { periodStart, periodEnd, settings: { regime, }} = declaration;

  function isStandard() {
    return regime === 1 || regime === 'Standard';
  }

  function getOperationsQuery() {
    const query = new Parse.Query(Operation({ id: company.id, }));

    query.greaterThanOrEqualTo('date', new Date(periodStart));
    query.lessThanOrEqualTo('date', new Date(periodEnd));

    query.equalTo('isExpense', true);

    return query;
  }

  function bills() {

    function getBillsQuery() { // Bills
      const query = new Parse.Query(Type);
      query.equalTo('kind', 'Bill');

      query.greaterThanOrEqualTo('date', new Date(periodStart));
      query.lessThanOrEqualTo('date', new Date(periodEnd));

      if(isStandard()){
        query.equalTo('balanceDue', 0.0);
      }

      return query;
    }

    const opsQuery = getOperationsQuery();
    opsQuery.include([ 'bill', 'billItem' ]);

    opsQuery.exists('bill');
    opsQuery.matchesQuery('bill', getBillsQuery());

    return opsQuery.find();
  }

  function expenses() {
    function getExpensesQuery() { // Expenses
      const query = new Parse.Query(Type);
      query.equalTo('kind', 'Expense');

      query.greaterThanOrEqualTo('date', new Date(periodStart));
      query.lessThanOrEqualTo('date', new Date(periodEnd));

      query.equalTo('payeeType', 2);

      return query;
    }

    const opsQuery = getOperationsQuery();
    opsQuery.include([ 'expense', 'expenseItem' ]);

    opsQuery.exists('expense');
    opsQuery.matchesQuery('expense', getExpensesQuery());

    return opsQuery.find();
  }

  function report() {
    return new Promise((resolve) => {
      let totalHT = 0.0;
      let totalVAT = 0.0;

      function getCountQuery() { // Bills + Expenses
        const query = new Parse.Query(Type);
        query.containedIn('kind', [ 'Bill', 'Expense', ]);

        query.greaterThanOrEqualTo('date', new Date(periodStart));
        query.lessThanOrEqualTo('date', new Date(periodEnd));

        if(isStandard()){
          query.equalTo('balanceDue', 0.0);
        }

        return query;
      }

      getCountQuery().each(
        function(obj){
          totalHT += obj.get('totalHT');
          totalVAT += obj.get('VAT');
        }, {
          success: function(){
            resolve({ totalVAT, totalHT, });
          },

          error: function(error){
            reject(error);
          }
        }
      );

    });
  }

  return Promise.all([
    report(),
    bills(),
    expenses(),

  ]).then(([ { ...propsReport, }, bills, expenses, ]) => ({ ...propsReport, expenses: concat(bills, expenses), }));
};

// module.exports.getCompanyVATDeclarationSales = function getCompanyVATDeclarationSales(company, declaration) {
//   const Type = Sale({ id: company.id, });
//
//   const { periodStart, periodEnd, settings: { regime, }} = declaration;
//
//   function isStandard() {
//     return regime === 1 || regime === 'Standard';
//   }
//
//   function sales() {
//     function getSalesQuery() { // Sales: Invoices + Sales
//       const query = new Parse.Query(Type);
//       query.containedIn('kind', [ 'Sale', 'Invoice', ]);
//
//       query.greaterThanOrEqualTo('date', new Date(periodStart));
//       query.lessThanOrEqualTo('date', new Date(periodEnd));
//
//       if(isStandard()){
//             query.equalTo('balanceDue', 0.0);
//           }
//
//       return query;
//     }
//
//     const opsQuery = getSalesQuery();
//     return opsQuery.find();
//   }
//
//   function report() {
//     return new Promise((resolve) => {
//       let totalHT = 0.0;
//       let totalVAT = 0.0;
//
//       function getCountQuery() { // Invoices + Sales
//         const query = new Parse.Query(Type);
//         query.containedIn('kind', [ 'Invoice', 'Sale', ]);
//
//         query.greaterThanOrEqualTo('date', new Date(periodStart));
//         query.lessThanOrEqualTo('date', new Date(periodEnd));
//
//         if(isStandard()){
//           query.equalTo('balanceDue', 0.0);
//         }
//
//         return query;
//       }
//
//       getCountQuery().each(
//         function(obj){
//           totalHT += obj.get('totalHT');
//           totalVAT += obj.get('VAT');
//         }, {
//           success: function(){
//             resolve({ totalVAT, totalHT, });
//           },
//
//           error: function(error){
//             reject(error);
//           }
//         }
//       );
//
//     });
//   }
//
//   return Promise.all([
//     report(),
//     sales(),
//
//   ]).then(([ { ...props, }, sales, ]) => ({ ...props, sales, }));
// }
//
// module.exports.getCompanyVATDeclarationExpenses = function getCompanyVATDeclarationExpenses(company, declaration) {
//   const Type = Expense({ id: company.id, });
//
//   const { periodStart, periodEnd, settings: { regime, }} = declaration;
//
//   function isStandard() {
//     return regime === 1 || regime === 'Standard';
//   }
//
//   function expenses() {
//     function getExpensesQuery() { // Expenses: Bills + Expenses
//       const query = new Parse.Query(Type);
//       query.containedIn('kind', [ 'Expense', 'Bill', ]);
//
//       query.greaterThanOrEqualTo('date', new Date(periodStart));
//       query.lessThanOrEqualTo('date', new Date(periodEnd));
//
//       if(isStandard()){
//         query.equalTo('balanceDue', 0.0);
//       }
//
//       return query;
//     }
//
//     const opsQuery = getExpensesQuery();
//     return opsQuery.find();
//   }
//
//   function report() {
//     return new Promise((resolve) => {
//       let totalHT = 0.0;
//       let totalVAT = 0.0;
//
//       function getCountQuery() { // Bills + Expenses
//         const query = new Parse.Query(Type);
//         query.containedIn('kind', [ 'Bill', 'Expense', ]);
//
//         query.greaterThanOrEqualTo('date', new Date(periodStart));
//         query.lessThanOrEqualTo('date', new Date(periodEnd));
//
//         if(isStandard()){
//           query.equalTo('balanceDue', 0.0);
//         }
//
//         return query;
//       }
//
//       getCountQuery().each(
//         function(obj){
//           totalHT += obj.get('totalHT');
//           totalVAT += obj.get('VAT');
//         }, {
//           success: function(){
//             resolve({ totalVAT, totalHT, });
//           },
//
//           error: function(error){
//             reject(error);
//           }
//         }
//       );
//
//     });
//   }
//
//   return Promise.all([
//     report(),
//     expenses(),
//
//   ]).then(([ { ...props, }, expenses, ]) => ({ ...props, expenses, }));
// }

module.exports.getObjectFiles = function getObjectFiles(obj, type) {
  const companyId = obj.get('company').id;
  const Type = File({ id: companyId, });

  const qry = new Parse.Query(Type);

  switch (type){
    case 'Invoice':

      qry.equalTo('invoice', obj);
      break;

    case 'Sale':

      qry.equalTo('sale', obj);
      break;

    case 'PaymentOfInvoices':

      qry.equalTo('paymentOfInvoices', obj);
      break;

    case 'Expense':

      qry.equalTo('expense', obj);
      break;

    case 'Bill':

      qry.equalTo('bill', obj);
      break;

    case 'PaymentOfBills':

      qry.equalTo('paymentOfBills', obj);
      break;

    case 'Transaction':

      qry.equalTo('transaction', obj);
      break;

    case 'Operation':

      qry.equalTo('operation', obj);
      break;

  }

  qry.equalTo('type', type);

  qry.descending('createdAt');

  return qry.find().catch(() => []);
};

module.exports.getObjectFile = function getObjectFile(obj, type) {
  const companyId = type === 'Logo' ? obj.id : obj.get('company').id;
  const Type = File({ id: companyId, });

  const qry = new Parse.Query(Type);

  switch (type){
    // case 'Avatar':
    //
    //   qry.equalTo('owner', obj);
    //   break;

    case 'Logo':

      qry.equalTo('company', obj);
      break;

    case 'Vendor':

      qry.equalTo('vendor', obj);
      break;

    case 'Customer':

      qry.equalTo('customer', obj);
      break;

    case 'Employee':

      qry.equalTo('employee', obj);
      break;

    case 'Item':

      qry.equalTo('item', obj);
      break;
  }

  qry.equalTo('type', type);

  qry.descending('createdAt');

  return qry.first();
};

module.exports.getCompanyExpenses = function getCompanyExpenses(company) {
  return parseTableLoader.load(Expense({id: company.id}));
};
module.exports.getCompanySales = function getCompanySales(company) {
  return parseTableLoader.load(Sale({id: company.id}));
};
module.exports.getCompanyInvoices = function getCompanyInvoices(company) {
  return parseTableLoader.load(Sale({id: company.id}));
};
module.exports.getCompanyInvoicesTotalCount = function getCompanyInvoicesTotalCount(company) {
  return countByType(Sale({id: company.id}));
};
module.exports.getCompanyBills = function getCompanyBills(company) {
  return parseTableLoader.load(Expense({id: company.id}));
};
module.exports.getCompanyBillsTotalCount = function getCompanyBillsTotalCount(company) {
  return countByType(Expense({id: company.id}));
};
module.exports.getCompanyPaymentsOfInvoices = function getCompanyPaymentsOfInvoices(company) {
  return parseTableLoader.load(Sale({id: company.id}));
};
module.exports.getCompanyPaymentsOfBills = function getCompanyPaymentsOfBills(company) {
  return parseTableLoader.load(Expense({id: company.id}));
};

module.exports.getInvoiceItems = function getInvoiceItems(invoice) {
  const companyId = invoice.get('company').id;
  const Type = InvoiceItem({ id: companyId, });

  const qry = new Parse.Query(Type);

  qry.equalTo('invoice', Sale({ id: companyId, }).createWithoutData(invoice.id));
  qry.include([ 'invoice', 'item' ]);

  qry.ascending('index');

  return qry.find();
};
module.exports.getBillItems = function getBillItems(bill) {
  const companyId = bill.get('company').id;
  const Type = BillItem({ id: companyId, });

  const qry = new Parse.Query(Type);

  qry.equalTo('bill', Expense({id: companyId}).createWithoutData(bill.id));

  qry.include([ 'bill' ]);
  qry.ascending('index');

  return qry.find();
};

module.exports.getAccountsByCategories = function getAccountsByCategories(categories) {
  return Object.keys(chartOfAccounts).reduce(function (accounts, code) {
    const account = chartOfAccounts[code];
    (categories.indexOf(account._categoryCode) !== -1) && accounts.push(account);
    return accounts;
  }, []);
};

module.exports.getInvoicePayments = function getInvoicePayments(invoice) {
  const qry = new Parse.Query(PaymentOfInvoicesItem({id: invoice.get('company').id}));
  qry.equalTo('invoice', Parse.Object.extend('Sale_' + invoice.get('company').id).createWithoutData(invoice.id));
  qry.include(['payment', 'invoice']);
  qry.descending('date');
  return qry.find();
};
module.exports.getPaymentOfInvoicesItems = function getPaymentOfInvoicesItems(payment) {
  const qry = new Parse.Query(PaymentOfInvoicesItem({id: payment.get('company').id}));
  qry.equalTo('payment', Parse.Object.extend('Sale_' + payment.get('company').id).createWithoutData(payment.id));
  qry.include(['payment', 'invoice']);
  return qry.find();
};
module.exports.getBillPayments = function getBillPayments(bill) {
  console.assert(bill.get('company').id);
  const qry = new Parse.Query(PaymentOfBillsItem({id: bill.get('company').id}));
  qry.equalTo('bill', Parse.Object.extend('Expense_' + bill.get('company').id).createWithoutData(bill.id));
  qry.include(['payment', 'bill']);
  qry.descending('date');
  return qry.find();
};
module.exports.getPaymentOfBillsItems = function getPaymentOfBillsItems(payment) {
  const qry = new Parse.Query(PaymentOfBillsItem({id: payment.get('company').id}));
  qry.equalTo('payment', Parse.Object.extend('Expense_' + payment.get('company').id).createWithoutData(payment.id));
  qry.include(['payment', 'bill']);
  return qry.find();
};

module.exports.getCompanyPeople = function getCompanyPeople(company) {
  return parseTableLoader.load(
    Parse.Object.extend('People_' + company.id));
};

module.exports.getCompanyVendors = function getCompanyVendors(company) {
  const qry = new Parse.Query(People({id: company.id}));
  qry.equalTo('kind', 'Vendor');
  return qry.find();
};

module.exports.getCompanyCustomers = function getCompanyCustomers(company) {
  const qry = new Parse.Query(People({id: company.id}));
  qry.equalTo('kind', 'Customer');
  return qry.find();
};

module.exports.getCompanyEmployees = function getCompanyEmployees(company) {
  const qry = new Parse.Query(People({id: company.id}));
  qry.equalTo('kind', 'Employee');
  return qry.find();
};

module.exports.getSaleItems = function getSaleItems(sale) {
  const qry = new Parse.Query(SaleItem({id: sale.get('company').id}));
  qry.equalTo('sale', Parse.Object.extend('Sale_' + sale.get('company').id).createWithoutData(sale.id));
  qry.include([ 'sale', 'item' ]);
  qry.ascending('index');
  return qry.find();
};
module.exports.getExpenseItems = function getExpenseItems(expense) {
  const qry = new Parse.Query(ExpenseItem({id: expense.get('company').id}));
  qry.equalTo('expense', Parse.Object.extend('Expense_' + expense.get('company').id).createWithoutData(expense.id));
  qry.include([ 'expense' ]);
  qry.ascending('index');
  return qry.find();
};

module.exports.getChartAccountList = function getChartAccountList() {
  return Object.keys(chartOfAccounts).reduce(function (accounts, code) {
    accounts.push(chartOfAccounts[code]);
    return accounts;
  }, []);
};

module.exports.queryOpenInvoices = function queryOpenInvoices(company, {from,}) {
  const Type = Sale({id: company.id});

  function getQuery() {
    const query = new Parse.Query(Type);

    query.equalTo('kind', 'Invoice');

    query.greaterThanOrEqualTo('date',
      from ? new Date(from) : moment().subtract(365, 'days').toDate());
    query.greaterThan('balanceDue', 0.0);
    return query;
  }

  return getQuery().find();
};

module.exports.queryCustomerOpenInvoices = function queryCustomerOpenInvoices(company, {from, id,}) {
  const Type = Sale({id: company.id});

  function getQuery() {
    const query = new Parse.Query(Type);

    query.equalTo('kind', 'Invoice');

    query.equalTo('customer',
      Parse.Object.extend(`People_${company.id}`).createWithoutData(id));

    if(from){
      query.greaterThanOrEqualTo('date',
        new Date(from));
    }

    query.greaterThan('balanceDue', 0.0);
    return query;
  }

  return getQuery().find();
};

module.exports.querySalesRecentlyPaid = function querySalesRecentlyPaid(company, {from,}) {

  function getSalesQuery() {
    const Type = Sale({id: company.id});
    const query = new Parse.Query(Type);

    query.equalTo('kind', 'Sale');

    query.greaterThanOrEqualTo('date',
      from ? new Date(from) : moment().subtract(DEFAULT_RECENT_DAYS, 'days').toDate());
    return query;
  }

  function getPaymentsOfInvoicesQuery() {
    const Type = Sale({id: company.id});
    const query = new Parse.Query(Type);

    query.equalTo('kind', 'PaymentOfInvoices');

    query.greaterThanOrEqualTo('date',
      from ? new Date(from) : moment().subtract(DEFAULT_RECENT_DAYS, 'days').toDate());
    return query;
  }

  const mainQuery = Parse.Query.or(
    getSalesQuery(), getPaymentsOfInvoicesQuery());

  mainQuery.ascending('date');

  return mainQuery.find();
};

module.exports.queryOverdueInvoices = function queryOverdueInvoices(company, {from,}) {
  const Type = Sale({id: company.id});

  function getQuery() {
    const query = new Parse.Query(Type);

    query.equalTo('kind', 'Invoice');

    query.greaterThanOrEqualTo('date',
      from ? new Date(from) : moment().subtract(365, 'days').toDate());
    query.greaterThan('balanceDue', 0.0);
    query.lessThan('dueDate', moment().startOf('day').toDate());
    return query;
  }

  return getQuery().find();
};
module.exports.queryCustomerOverdueInvoices = function queryCustomerOverdueInvoices(company, {from, id,}) {
  const Type = Sale({id: company.id});

  function getQuery() {
    const query = new Parse.Query(Type);

    query.equalTo('kind', 'Invoice');

    query.equalTo('customer',
      Parse.Object.extend(`People_${company.id}`).createWithoutData(id));

    if(from){
      query.greaterThanOrEqualTo('date',
        new Date(from));
    }

    query.greaterThan('balanceDue', 0.0);
    query.lessThan('dueDate', moment().startOf('day').toDate());
    return query;
  }

  return getQuery().find();
};

function queryInvoices(company, { offset, limit, type, status, from, to, sortKey = 'date', sortDir = -1, customer, }, last365Days = true) {
  const Type = Sale({id: company.id});

  if(type !== 'invoices' && type !== 'open' && type !== 'overdue' && type !== 'recent' && type !== 'ALL'){
    return Promise.resolve({count: 0, results: []});
  }

  function getQuery(doSort = true) {
    const query = new Parse.Query(Type);

    query.equalTo('kind', 'Invoice');

    if(doSort){

      switch (sortKey) {
        case 'date':
          query[ sortDir === -1 ? 'descending' : 'ascending' ]('date');
          break;
        case 'dueDate':
          query[ sortDir === -1 ? 'descending' : 'ascending' ](sortDir === -1 ? 'dueDate,date' : 'dueDate');
          if(sortKey === 1){
            query.addDescending('date');
          }
          break;
        case 'balanceDue':
          query[ sortDir === -1 ? 'descending' : 'ascending' ](sortDir === -1 ? 'balanceDue,date' : 'balanceDue');
          if(sortKey === 1){
            query.addDescending('date');
          }
          break;
        case 'total':
          query[ sortDir === -1 ? 'descending' : 'ascending' ](sortDir === -1 ? 'total,date' : 'total');
          if(sortKey === 1){
            query.addDescending('date');
          }
          break;
        case 'totalHT':
          query[ sortDir === -1 ? 'descending' : 'ascending' ](sortDir === -1 ? 'totalHT,date' : 'totalHT');
          if(sortKey === 1){
            query.addDescending('date');
          }
          break;
        case 'VAT':
          query[ sortDir === -1 ? 'descending' : 'ascending' ](sortDir === -1 ? 'VAT,date' : 'VAT');
          if(sortKey === 1){
            query.addDescending('date');
          }
          break;
      }
    }

    switch (status) {
      case 'closed':
        query.equalTo('balanceDue', 0.0);
        break;

      case 'open':
        query.greaterThan('balanceDue', 0.0);
        break;

      case 'overdue':
        query.greaterThan('balanceDue', 0.0);
        query.lessThan('dueDate', moment().startOf('day').toDate());
        break;
    }
    if(customer){
      query.equalTo('customer',
        Parse.Object.extend(`People_${company.id}`).createWithoutData(customer));
    }
    if(!from && !to){
      last365Days && query.greaterThanOrEqualTo('date', moment().subtract(365, 'days').startOf('day').toDate())
    }else{
      to && query.lessThanOrEqualTo('date', new Date(to));
      from && query.greaterThanOrEqualTo('date', new Date(from));
    }
    return query;
  }

  return Promise.all([
    new Promise((resolve) => {
      let count = 0;
      let sumOfTotals = 0.0;
      let sumOfBalances = 0.0;

      getQuery(false).each(
        function(obj){
          count += 1;
          sumOfTotals += obj.get('total');
          sumOfBalances += obj.get('balanceDue');
        }, {
          success: function(){
            resolve({ count, sumOfTotals, sumOfBalances, });
          },

          error: function(error){
            reject(error);
          }
        }
      );

    }),
    function(){
      const q = getQuery();
      q.skip(offset);
      q.limit(limit);
      return q.find();
    }()
  ]).then(([ { count, sumOfTotals, sumOfBalances, }, results ]) => ({ count, invoicesSumOfTotals : sumOfTotals, invoicesSumOfBalances : sumOfBalances, results, }));
}
function querySales(company, {offset, limit, type, from, to, sortKey = 'date', sortDir = -1, customer,}, last365Days = true) {
  const Type = Sale({id: company.id});

  if(type !== 'sales' && type !== 'recent' && type !== 'money' && type !== 'ALL'){
    return Promise.resolve({count: 0, results: []});
  }

  function getQuery(doSort = true) {
    const query = new Parse.Query(Type);

    query.equalTo('kind', 'Sale');

    if (doSort) {
      switch (sortKey) {
        case 'date':
          query[sortDir === -1 ? 'descending' : 'ascending']('date');
          break;
        case 'balanceDue':
          query[sortDir === -1 ? 'descending' : 'ascending'](sortDir === -1 ? 'balanceDue,date' : 'balanceDue');
          if (sortKey === 1) {
            query.addDescending('date');
          }
          break;
        case 'total':
          query[sortDir === -1 ? 'descending' : 'ascending'](sortDir === -1 ? 'total,date' : 'total');
          if (sortKey === 1) {
            query.addDescending('date');
          }
          break;
        case 'totalHT':
          query[sortDir === -1 ? 'descending' : 'ascending'](sortDir === -1 ? 'totalHT,date' : 'totalHT');
          if (sortKey === 1) {
            query.addDescending('date');
          }
          break;
        case 'VAT':
          query[sortDir === -1 ? 'descending' : 'ascending'](sortDir === -1 ? 'VAT,date' : 'VAT');
          if (sortKey === 1) {
            query.addDescending('date');
          }
          break;
      }
    }
    if(customer){
      query.equalTo('customer',
        Parse.Object.extend(`People_${company.id}`).createWithoutData(customer));
    }
    if(!from && !to){
      last365Days && query.greaterThanOrEqualTo('date', moment().subtract(365, 'days').startOf('day').toDate())
    }else{
      to && query.lessThanOrEqualTo('date', new Date(to));
      from && query.greaterThanOrEqualTo('date', new Date(from));
    }
    return query;
  }

  return Promise.all([
    new Promise((resolve) => {
      let count = 0;
      let sumOfTotals = 0.0;

      getQuery(false).each(
        function(obj){
          count += 1;
          sumOfTotals += obj.get('total');
        }, {
          success: function(){
            resolve({ count, sumOfTotals, });
          },

          error: function(error){
            reject(error);
          }
        }
      );

    }),
    function(){
      const q = getQuery();
      q.skip(offset);
      q.limit(limit);
      return q.find();
    }()
  ]).then(([ { count, sumOfTotals, }, results ]) => ({ count, salesSumOfTotals : sumOfTotals, salesSumOfBalances : 0.0, results, }));
}
function queryPaymentsOfInvoices(company, {offset, limit, type, from, to, sortKey = 'date', sortDir = -1, customer,}, last365Days = true) {
  const Type = Sale({id: company.id});

  if(type !== 'payments' && type !== 'money' && type !== 'ALL'){
    return Promise.resolve({count: 0, results: []});
  }

  function getQuery(doSort = true) {
    const query = new Parse.Query(Type);

    query.equalTo('kind', 'PaymentOfInvoices');

    if (doSort) {
      switch (sortKey) {
        case 'date':
          query[sortDir === -1 ? 'descending' : 'ascending']('date');
          break;
        case 'balanceDue':
          query[sortDir === -1 ? 'descending' : 'ascending'](sortDir === -1 ? 'balanceDue,date' : 'balanceDue');
          if (sortKey === 1) {
            query.addDescending('date');
          }
          break;
        case 'total':
          query[sortDir === -1 ? 'descending' : 'ascending'](sortDir === -1 ? 'total,date' : 'total');
          if (sortKey === 1) {
            query.addDescending('date');
          }
          break;
        case 'totalHT':
          query[sortDir === -1 ? 'descending' : 'ascending'](sortDir === -1 ? 'totalHT,date' : 'totalHT');
          if (sortKey === 1) {
            query.addDescending('date');
          }
          break;
        case 'VAT':
          query[sortDir === -1 ? 'descending' : 'ascending'](sortDir === -1 ? 'VAT,date' : 'VAT');
          if (sortKey === 1) {
            query.addDescending('date');
          }
          break;
      }
    }
    // TODO: query customers on items using matchesKeyInQuery
    if(customer){
      query.equalTo('customer',
        Parse.Object.extend(`People_${company.id}`).createWithoutData(customer));
    }

    if(!from && !to){
      last365Days && query.greaterThanOrEqualTo('date', moment().subtract(365, 'days').startOf('day').toDate())
    }else{
      to && query.lessThanOrEqualTo('date', new Date(to));
      from && query.greaterThanOrEqualTo('date', new Date(from));
    }
    return query;
  }

  return Promise.all([
    new Promise((resolve) => {
      let count = 0;
      let sumOfTotals = 0.0;
      let sumOfCredits = 0.0;

      getQuery(false).each(
        function(obj){
          count += 1;
          sumOfTotals += obj.get('amountReceived');
          sumOfCredits += obj.get('amountToCredit');
        }, {
          success: function(){
            resolve({ count, sumOfTotals, sumOfCredits, });
          },

          error: function(error){
            reject(error);
          }
        }
      );

    }),
    function(){
      const q = getQuery();
      q.skip(offset);
      q.limit(limit);
      return q.find();
    }()
  ]).then(([ { count, sumOfTotals, sumOfCredits, }, results ]) => ({ count, paymentsSumOfTotals : sumOfTotals, paymentsSumOfCredits : sumOfCredits, results, }));
}

function customersQueryInvoices(company, {offset, limit, type, status, from, to, sortKey = 'date', sortDir = -1,}, last365Days = false) {
  const Type = Sale({id: company.id});

  if(type !== 'invoices' && type !== 'recent' && type !== 'ALL'){
    return Promise.resolve({count: 0, results: []});
  }

  function aggregateResult(results){
    let count = 0;
    const xs = map(

      group(results, obj => obj.get('customer').id),

      objs => {
        count++;
        return objs[0].get('customer');
      }
    );
    return {
      results: Parse.Object.fetchAllIfNeeded(xs),
      count,
    };
  }

  function getQuery() {
    const query = new Parse.Query(Type);

    query.equalTo('kind', 'Invoice');

    query.include([ 'customer' ]);

    switch (status) {
      case 'closed':
        query.equalTo('balanceDue', 0.0);
        break;

      case 'open':
        query.greaterThan('balanceDue', 0.0);
        break;

      case 'overdue':
        query.greaterThan('balanceDue', 0.0);
        query.lessThan('dueDate', moment().startOf('day').toDate());
        break;
    }

    if(!from && !to){
      last365Days && query.greaterThanOrEqualTo('date', moment().subtract(365, 'days').startOf('day').toDate())
    }else{
      to && query.lessThanOrEqualTo('date', new Date(to));
      from && query.greaterThanOrEqualTo('date', new Date(from));
    }
    return query;
  }

  return Promise.all([

    function(){
      const q = getQuery();
      // q.limit(offset + limit);
      q.limit(100000);
      return q.find();
    }()
  ]).then(([ results ]) => ({ ...aggregateResult(results), }));
}
function customersQuerySales(company, {offset, limit, type, from, to, sortKey = 'date', sortDir = -1,}, last365Days = false) {
  const Type = Sale({id: company.id});

  if(type !== 'sales' && type !== 'recent' && type !== 'money' && type !== 'ALL'){
    return Promise.resolve({count: 0, results: []});
  }

  function aggregateResult(results){
    let count = 0;
    const xs = map(

      group(results, obj => obj.get('customer').id),

      objs => {
        count++;
        return objs[0].get('customer');
      }
    );
    return {
      results: Parse.Object.fetchAllIfNeeded(xs),
      count,
    };
  }

  function getQuery() {
    const query = new Parse.Query(Type);

    query.equalTo('kind', 'Sale');

    query.include([ 'customer' ]);

    if(!from && !to){
      last365Days && query.greaterThanOrEqualTo('date', moment().subtract(365, 'days').startOf('day').toDate())
    }else{
      to && query.lessThanOrEqualTo('date', new Date(to));
      from && query.greaterThanOrEqualTo('date', new Date(from));
    }
    return query;
  }

  return Promise.all([
    function(){
      const q = getQuery();
      // q.limit(offset + limit);
      q.limit(100000);
      return q.find();
    }()
  ]).then(([ results ]) => ({ ...aggregateResult(results), }));
}
function customersQueryPaymentsOfInvoices(company, {offset, limit, type, from, to, sortKey = 'date', sortDir = -1,}, last365Days = false) {
  const Type = Sale({id: company.id});

  if(type !== 'payments' && type !== 'money' && type !== 'ALL'){
    return Promise.resolve({count: 0, results: []});
  }

  function aggregateResult(results){
    let count = 0;
    const xs = map(

      group(results, obj => obj.get('customer').id),

      objs => {
        count++;
        return objs[0].get('customer');
      }
    );
    return {
      results: Parse.Object.fetchAllIfNeeded(xs),
      count,
    };
  }

  function getQuery() {
    const query = new Parse.Query(Type);

    query.equalTo('kind', 'PaymentOfInvoices');

    query.include([ 'customer' ]);

    if(!from && !to){
      last365Days && query.greaterThanOrEqualTo('date', moment().subtract(365, 'days').startOf('day').toDate())
    }else{
      to && query.lessThanOrEqualTo('date', new Date(to));
      from && query.greaterThanOrEqualTo('date', new Date(from));
    }
    return query;
  }

  return Promise.all([
    function(){
      const q = getQuery();
      // q.limit(offset + limit);
      q.limit(100000);
      return q.find();
    }()
  ]).then(([ results ]) => ({ ...aggregateResult(results), }));
}

function queryOpenBills(company, {from,}) {
  const Type = Expense({id: company.id});

  function getQuery() {
    const query = new Parse.Query(Type);

    query.equalTo('kind', 'Bill');

    query.greaterThanOrEqualTo('date',
      from ? new Date(from) : moment().subtract(365, 'days').toDate());
    query.greaterThan('balanceDue', 0.0);
    return query;
  }

  return getQuery().find();
}
function queryVendorOpenBills(company, {from, id,}) {
  const Type = Expense({id: company.id});

  function getQuery() {
    const query = new Parse.Query(Type);

    query.equalTo('kind', 'Bill');

    query.equalTo('payee',
      Parse.Object.extend(`People_${company.id}`).createWithoutData(id));

    if(from){
      query.greaterThanOrEqualTo('date',
        new Date(from));
    }

    query.greaterThan('balanceDue', 0.0);
    return query;
  }

  return getQuery().find();
}

module.exports.queryExpensesRecentlyPaid = function queryExpensesRecentlyPaid(company, {from,}) {

  function getExpensesQuery() {
    const Type = Expense({id: company.id});

    const query = new Parse.Query(Type);
    query.equalTo('kind', 'Expense');

    query.greaterThanOrEqualTo('date',
      from ? new Date(from) : moment().subtract(DEFAULT_RECENT_DAYS, 'days').toDate());
    return query;
  }

  function getPaymentsOfBillsQuery() {
    const Type = Expense({id: company.id});

    const query = new Parse.Query(Type);
    query.equalTo('kind', 'PaymentOfBills');

    query.greaterThanOrEqualTo('date',
      from ? new Date(from) : moment().subtract(DEFAULT_RECENT_DAYS, 'days').toDate());
    return query;
  }

  const mainQuery = Parse.Query.or(
    getExpensesQuery(), getPaymentsOfBillsQuery());

  mainQuery.ascending('date');

  return mainQuery.find();
};

module.exports.queryOverdueBills = function queryOverdueBills(company, {from,}) {
  const Type = Expense({id: company.id});

  function getQuery() {
    const query = new Parse.Query(Type);

    query.equalTo('kind', 'Bill');

    query.greaterThanOrEqualTo('date',
      from ? new Date(from) : moment().subtract(365, 'days').toDate());
    query.greaterThan('balanceDue', 0.0);
    query.lessThan('dueDate', moment().startOf('day').toDate());
    return query;
  }

  return getQuery().find();
};
module.exports.queryVendorOverdueBills = function queryVendorOverdueBills(company, {from, id,}) {
  const Type = Expense({id: company.id});

  function getQuery() {
    const query = new Parse.Query(Type);

    query.equalTo('payee',
      Parse.Object.extend(`People_${company.id}`).createWithoutData(id));

    if(from){
      query.greaterThanOrEqualTo('date',
        new Date(from));
    }

    query.greaterThan('balanceDue', 0.0);
    query.lessThan('dueDate', moment().startOf('day').toDate());
    return query;
  }

  return getQuery().find();
};

function queryExpenses(company, { offset, limit, type, from, to, sortKey = 'date', sortDir = -1, payee, customer, }, last365Days = true) {
  const Type = Expense({id: company.id});

  if(type !== 'expenses' && type !== 'recent' && type !== 'money' && type !== 'ALL'){
    return Promise.resolve({count: 0, results: []});
  }

  function getQuery(doSort = true) {
    const query = new Parse.Query(Type);

    query.equalTo('kind', 'Expense');

    if (doSort) {
      switch (sortKey) {
        case 'date':
          query[sortDir === -1 ? 'descending' : 'ascending']('date');
          break;
        case 'dueDate':
          query[sortDir === -1 ? 'descending' : 'ascending'](sortDir === -1 ? 'dueDate,date' : 'dueDate');
          if (sortKey === 1) {
            query.addDescending('date');
          }
          break;
        case 'balanceDue':
          query[sortDir === -1 ? 'descending' : 'ascending'](sortDir === -1 ? 'balanceDue,date' : 'balanceDue');
          if (sortKey === 1) {
            query.addDescending('date');
          }
          break;
        case 'total':
          query[sortDir === -1 ? 'descending' : 'ascending'](sortDir === -1 ? 'total,date' : 'total');
          if (sortKey === 1) {
            query.addDescending('date');
          }
          break;
        case 'totalHT':
          query[sortDir === -1 ? 'descending' : 'ascending'](sortDir === -1 ? 'totalHT,date' : 'totalHT');
          if (sortKey === 1) {
            query.addDescending('date');
          }
          break;
        case 'VAT':
          query[sortDir === -1 ? 'descending' : 'ascending'](sortDir === -1 ? 'VAT,date' : 'VAT');
          if (sortKey === 1) {
            query.addDescending('date');
          }
          break;
      }
    }
    if(payee){
      query.equalTo('vendor',
        Parse.Object.extend(`People_${company.id}`).createWithoutData(payee));
    }
    if(customer){
      query.equalTo('customer',
        Parse.Object.extend(`People_${company.id}`).createWithoutData(customer));
    }
    if(!from && !to){
      last365Days && query.greaterThanOrEqualTo('date', moment().subtract(365, 'days').startOf('day').toDate())
    }else{
      to && query.lessThanOrEqualTo('date', new Date(to));
      from && query.greaterThanOrEqualTo('date', new Date(from));
    }
    return query;
  }

  return Promise.all([
    new Promise((resolve) => {
      let count = 0;
      let sumOfTotals = 0.0;

      getQuery(false).each(
        function(obj){
          count += 1;
          sumOfTotals += obj.get('total');
        }, {
          success: function(){
            resolve({ count, sumOfTotals, });
          },

          error: function(error){
            reject(error);
          }
        }
      );

    }),
    function(){
      const q = getQuery();
      q.skip(offset);
      q.limit(limit);
      return q.find();
    }()
  ]).then(([ { count, sumOfTotals, }, results ]) => ({ count, expensesSumOfTotals : sumOfTotals, expensesSumOfBalances : 0.0, results, }));
}

function queryBills(company, {offset, limit, type, status, from, to, sortKey = 'date', sortDir = -1, payee, customer,}, last365Days = true) {
  const Type = Expense({id: company.id});

  if(customer){
    return Promise.resolve({count: 0, results: []});
  }

  if(type !== 'bills' && type !== 'open' && type !== 'overdue' && type !== 'recent' && type !== 'ALL'){
    return Promise.resolve({count: 0, results: []});
  }

  function getQuery(doSort = true) {
    const query = new Parse.Query(Type);

    query.equalTo('kind', 'Bill');

    if (doSort) {
      switch (sortKey) {
        case 'date':
          query[sortDir === -1 ? 'descending' : 'ascending']('date');
          break;
        case 'dueDate':
          query[sortDir === -1 ? 'descending' : 'ascending'](sortDir === -1 ? 'dueDate,date' : 'dueDate');
          if (sortKey === 1) {
            query.addDescending('date');
          }
          break;
        case 'balanceDue':
          query[sortDir === -1 ? 'descending' : 'ascending'](sortDir === -1 ? 'balanceDue,date' : 'balanceDue');
          if (sortKey === 1) {
            query.addDescending('date');
          }
          break;
        case 'total':
          query[sortDir === -1 ? 'descending' : 'ascending'](sortDir === -1 ? 'total,date' : 'total');
          if (sortKey === 1) {
            query.addDescending('date');
          }
          break;
        case 'totalHT':
          query[sortDir === -1 ? 'descending' : 'ascending'](sortDir === -1 ? 'totalHT,date' : 'totalHT');
          if (sortKey === 1) {
            query.addDescending('date');
          }
          break;
        case 'VAT':
          query[sortDir === -1 ? 'descending' : 'ascending'](sortDir === -1 ? 'VAT,date' : 'VAT');
          if (sortKey === 1) {
            query.addDescending('date');
          }
          break;
      }
    }
    switch (status) {
      case 'closed':
        query.equalTo('balanceDue', 0.0);
        break;

      case 'open':
        query.greaterThan('balanceDue', 0.0);
        break;

      case 'overdue':
        query.greaterThan('balanceDue', 0.0);
        query.lessThan('dueDate', moment().startOf('day').toDate());
        break;
    }
    if(payee){
      query.equalTo('payee',
        Parse.Object.extend(`People_${company.id}`).createWithoutData(payee));
    }
    if(!from && !to){
      last365Days && query.greaterThanOrEqualTo('date', moment().subtract(365, 'days').startOf('day').toDate())
    }else{
      to && query.lessThanOrEqualTo('date', new Date(to));
      from && query.greaterThanOrEqualTo('date', new Date(from));
    }
    return query;
  }

  return Promise.all([
    new Promise((resolve) => {
      let count = 0;
      let sumOfTotals = 0.0;
      let sumOfBalances = 0.0;

      getQuery(false).each(
        function(obj){
          count += 1;
          sumOfTotals += obj.get('total');
          sumOfBalances += obj.get('balanceDue');
        }, {
          success: function(){
            resolve({ count, sumOfTotals, sumOfBalances, });
          },

          error: function(error){
            reject(error);
          }
        }
      );

    }),
    function(){
      const q = getQuery();
      q.skip(offset);
      q.limit(limit);
      return q.find();
    }()
  ]).then(([ { count, sumOfTotals, sumOfBalances, }, results ]) => ({ count, billsSumOfTotals : sumOfTotals, billsSumOfBalances : sumOfBalances, results, }));
}

function queryPaymentsOfBills(company, {offset, limit, type, from, to, sortKey = 'date', sortDir = -1, payee, customer, }, last365Days = true) {
  const Type = Expense({id: company.id});

  if(customer){
    return Promise.resolve({count: 0, results: []});
  }

  if(type !== 'payments' && type !== 'money' && type !== 'ALL'){
    return Promise.resolve({count: 0, results: []});
  }

  function getQuery(doSort = true) {
    const query = new Parse.Query(Type);

    query.equalTo('kind', 'PaymentOfBills');

    if (doSort) {
      switch (sortKey) {
        case 'date':
          query[sortDir === -1 ? 'descending' : 'ascending']('date');
          break;
        case 'balanceDue':
          query[sortDir === -1 ? 'descending' : 'ascending'](sortDir === -1 ? 'balanceDue,date' : 'balanceDue');
          if (sortKey === 1) {
            query.addDescending('date');
          }
          break;
        case 'total':
          query[sortDir === -1 ? 'descending' : 'ascending'](sortDir === -1 ? 'total,date' : 'total');
          if (sortKey === 1) {
            query.addDescending('date');
          }
          break;
        case 'totalHT':
          query[sortDir === -1 ? 'descending' : 'ascending'](sortDir === -1 ? 'totalHT,date' : 'totalHT');
          if (sortKey === 1) {
            query.addDescending('date');
          }
          break;
        case 'VAT':
          query[sortDir === -1 ? 'descending' : 'ascending'](sortDir === -1 ? 'VAT,date' : 'VAT');
          if (sortKey === 1) {
            query.addDescending('date');
          }
          break;
      }
    }
    // TODO: query customers on items using matchesKeyInQuery
    if(payee){
      query.equalTo('payee',
        Parse.Object.extend(`People_${company.id}`).createWithoutData(payee));
    }

    if(!from && !to){
      last365Days && query.greaterThanOrEqualTo('date', moment().subtract(365, 'days').startOf('day').toDate())
    }else{
      to && query.lessThanOrEqualTo('date', new Date(to));
      from && query.greaterThanOrEqualTo('date', new Date(from));
    }
    return query;
  }

  return Promise.all([
    new Promise((resolve) => {
      let count = 0;
      let sumOfTotals = 0.0;
      let sumOfCredits = 0.0;

      getQuery(false).each(
        function(obj){
          count += 1;
          sumOfTotals += obj.get('amountReceived');
          sumOfCredits += obj.get('amountToCredit');
        }, {
          success: function(){
            resolve({ count, sumOfTotals, sumOfCredits, });
          },

          error: function(error){
            reject(error);
          }
        }
      );

    }),
    function(){
      const q = getQuery();
      q.skip(offset);
      q.limit(limit);
      return q.find();
    }()
  ]).then(([ { count, sumOfTotals, sumOfCredits, }, results ]) => ({ count, paymentsSumOfTotals : sumOfTotals, paymentsSumOfCredits : sumOfCredits, results, }));
}

module.exports.getVendorOpenBills = function getVendorOpenBills(company, {id}){
  const Type = Expense({id: company.id});
  const query = new Parse.Query(Type);

  query.equalTo('kind', 'Bill');

  query.equalTo('payee',
    Parse.Object.extend(`People_${company.id}`).createWithoutData(id));
  query.greaterThan('balanceDue', 0.0);
  query.limit(100000);
  return query.find();
};

module.exports.getPaymentOfBillsFromPaymentOfBillsItem = function getPaymentOfBillsFromPaymentOfBillsItem(company, id){
  const Type = PaymentOfBillsItem({id: company.id});
  const query = new Parse.Query(Type);
  query.include([ 'payment' ]);
  return query.get(id)
    .then(obj => {
      const p = obj.get('payment');
      p.__type = 'PaymentOfBills';
      return p;
    });
};

module.exports.getCustomerOpenInvoices = function getCustomerOpenInvoices(company, {id}){
  const Type = Sale({id: company.id});
  const query = new Parse.Query(Type);

  query.equalTo('kind', 'Invoice');

  query.equalTo('customer',
    Parse.Object.extend(`People_${company.id}`).createWithoutData(id));
  query.greaterThan('balanceDue', 0.0);
  query.limit(100000);
  return query.find();
};

module.exports.getPaymentOfInvoicesFromPaymentOfInvoicesItem = function getPaymentOfInvoicesFromPaymentOfInvoicesItem(company, id){
  const Type = PaymentOfInvoicesItem({id: company.id});
  const query = new Parse.Query(Type);
  query.include([ 'payment' ]);
  return query.get(id)
    .then(obj => {
      const p = obj.get('payment');
      p.__type = 'PaymentOfInvoices';
      return p;
    });
};

function vendorsQueryExpenses(company, { offset, limit, type, from, to, sortKey = 'date', sortDir = -1, }, last365Days = false) {
  const Type = Expense({id: company.id});

  if(type !== 'expenses' && type !== 'recent' && type !== 'money' && type !== 'ALL'){
    return Promise.resolve({count: 0, results: []});
  }

  function getPayee(obj){
    return obj.get('vendor');

    // if(obj.has('vendor')){
    //   return obj.get('vendor');
    // }

    // if(obj.has('customer')){
    //   return obj.get('customer');
    // }

    // if(obj.has('employee')){
    //   return obj.get('employee');
    // }

    // return undefined;
  }

  function aggregateResult(results){
    let count = 0;
    const xs = map(

      group(results, obj => getPayee(obj).id),

      objs => {
        const expense = objs[0];

        const payee = getPayee(expense);
        if(expense.get('payeeType') === 'Vendor' || expense.get('payeeType') === 2){
          count++;
          return payee;
        }

        return null;
      }
    );
    return {
      results: Parse.Object.fetchAllIfNeeded(compact(xs)),
      count,
    };
  }

  function getQuery() {
    const query = new Parse.Query(Type);

    query.equalTo('kind', 'Expense');

    query.exists('vendor');

    query.include([ 'vendor' ]);

    if(!from && !to){
      last365Days && query.greaterThanOrEqualTo('date', moment().subtract(365, 'days').startOf('day').toDate())
    }else{
      to && query.lessThanOrEqualTo('date', new Date(to));
      from && query.greaterThanOrEqualTo('date', new Date(from));
    }
    return query;
  }

  return Promise.all([
    function(){
      const q = getQuery();
      // q.limit(offset + limit);
      q.limit(100000);
      return q.find();
    }()
  ]).then(([ results ]) => ({ ...aggregateResult(results), }));
}

module.exports.customersQueryExpenses = function customersQueryExpenses(company, { offset, limit, type, from, to, sortKey = 'date', sortDir = -1, }, last365Days = false) {
  const Type = Expense({id: company.id});

  if(type !== 'expenses' && type !== 'recent' && type !== 'money' && type !== 'ALL'){
    return Promise.resolve({count: 0, results: []});
  }

  function aggregateResult(results){
    let count = 0;
    const xs = map(

      group(results, obj => obj.get('customer').id),

      objs => {
        const expense = objs[0];
        const payee = expense.get('customer');
        if(expense.get('payeeType') === 'Customer' || expense.get('payeeType') === 1){
          count++;
          return payee;
        }

        return null;
      }
    );
    return {
      results: Parse.Object.fetchAllIfNeeded(compact(xs)),
      count,
    };
  }

  function getQuery() {
    const query = new Parse.Query(Type);

    query.equalTo('kind', 'Expense');

    query.exists('customer');

    query.include([ 'customer' ]);

    if(!from && !to){
      last365Days && query.greaterThanOrEqualTo('date', moment().subtract(365, 'days').startOf('day').toDate())
    }else{
      to && query.lessThanOrEqualTo('date', new Date(to));
      from && query.greaterThanOrEqualTo('date', new Date(from));
    }
    return query;
  }

  return Promise.all([
    function(){
      const q = getQuery();
      // q.limit(offset + limit);
      q.limit(100000);
      return q.find();
    }()
  ]).then(([ results ]) => ({ ...aggregateResult(results), }));
};

function vendorsQueryBills(company, {offset, limit, type, status, from, to, sortKey = 'date', sortDir = -1,}, last365Days = false) {
  const Type = Expense({id: company.id});

  if(type !== 'bills' && type !== 'recent' && type !== 'ALL'){
    return Promise.resolve({count: 0, results: []});
  }

  function aggregateResult(results){
    let count = 0;
    const xs = map(

      group(results, obj => obj.get('payee').id),

      objs => {
        count++;
        return objs[0].get('payee');
      }
    );
    return {
      results: Parse.Object.fetchAllIfNeeded(xs),
      count,
    };
  }

  function getQuery() {
    const query = new Parse.Query(Type);

    query.equalTo('kind', 'Bill');

    query.include([ 'payee' ]);

    switch (status) {
      case 'closed':
        query.equalTo('balanceDue', 0.0);
        break;

      case 'open':
        query.greaterThan('balanceDue', 0.0);
        break;

      case 'overdue':
        query.greaterThan('balanceDue', 0.0);
        query.lessThan('dueDate', moment().startOf('day').toDate());
        break;
    }
    if(!from && !to){
      last365Days && query.greaterThanOrEqualTo('date', moment().subtract(365, 'days').startOf('day').toDate())
    }else{
      to && query.lessThanOrEqualTo('date', new Date(to));
      from && query.greaterThanOrEqualTo('date', new Date(from));
    }
    return query;
  }

  return Promise.all([
    function(){
      const q = getQuery();
      // q.limit(offset + limit);
      q.limit(100000);
      return q.find();
    }()
  ]).then(([ results ]) => ({ ...aggregateResult(results), }));
}

function vendorsQueryPaymentsOfBills(company, {offset, limit, type, from, to, sortKey = 'date', sortDir = -1,}, last365Days = false) {
  const Type = Expense({id: company.id});

  if(type !== 'payments' && type !== 'money' && type !== 'ALL'){
    return Promise.resolve({count: 0, results: []});
  }

  function aggregateResult(results){
    let count = 0;
    const xs = map(

      group(results, obj => obj.get('payee').id),

      objs => {
        const payee = objs[0].get('payee');
        count++;
        return objs[0].get('payee');
      }
    );
    return {
      results: Parse.Object.fetchAllIfNeeded(xs),
      count,
    };
  }

  function getQuery() {
    const query = new Parse.Query(Type);

    query.equalTo('kind', 'PaymentOfBills');

    query.include([ 'payee' ]);

    if(!from && !to){
      last365Days && query.greaterThanOrEqualTo('date', moment().subtract(365, 'days').startOf('day').toDate())
    }else{
      to && query.lessThanOrEqualTo('date', new Date(to));
      from && query.greaterThanOrEqualTo('date', new Date(from));
    }
    return query;
  }

  return Promise.all([
    function(){
      const q = getQuery();
      // q.limit(offset + limit);
      q.limit(100000);
      return q.find();
    }()
  ]).then(([ results ]) => ({ ...aggregateResult(results), }));
}

const User = Parse.User;

module.exports.getObjectByType = function getObjectByType(Type, {companyId, id}) {
  return parseIDLoader.load([Type({id: companyId}), id]);
};

module.exports.getObjectsByType = function getObjectsByType(Type, {companyId}) {
  return parseTableLoader.load(Type({id: companyId}));
};

function getTypeById(Type, info) {
  const delimiterPos = info.indexOf(':');
  const id = info.substring(0, delimiterPos);
  const companyId = info.substring(delimiterPos + 1);
  return parseIDLoader.load([Type({id: companyId}), id]);
}

function countByType(Type) {
  return parseTableCountLoader.load(Type);
}

// V2

module.exports.ops__querySales = function ops__querySales(company, { offset, limit, type, status, from, to, sortKey = 'date', sortDir = -1, customer, }, last365Days = true){

  if(type === 'invoices' || type === 'open' || type === 'overdue'){
    return queryInvoices(...arguments);
  }

  if(type === 'sales'){
    return querySales(...arguments);
  }

  if(type === 'payments'){
    return queryPaymentsOfInvoices(...arguments);
  }

  if(type === 'ALL'){
    return function(){
      const Type = Sale({ id: company.id, }); // Parse.Object.extend('Sale_' + company.id);

      function getQuery(doSort = true) {
        const query = new Parse.Query(Type);

        if (doSort) {
          switch (sortKey) {
            case 'date':
              query[sortDir === -1 ? 'descending' : 'ascending']('date');
              break;
            case 'dueDate':
              query[sortDir === -1 ? 'descending' : 'ascending'](sortDir === -1 ? 'dueDate,date' : 'dueDate');
              if (sortKey === 1) {
                query.addDescending('date');
              }
              break;
            case 'balanceDue':
              query[sortDir === -1 ? 'descending' : 'ascending'](sortDir === -1 ? 'balanceDue,date' : 'balanceDue');
              if (sortKey === 1) {
                query.addDescending('date');
              }
              break;
            case 'total':
              query[sortDir === -1 ? 'descending' : 'ascending'](sortDir === -1 ? 'total,date' : 'total');
              if (sortKey === 1) {
                query.addDescending('date');
              }
              break;
            case 'totalHT':
              query[sortDir === -1 ? 'descending' : 'ascending'](sortDir === -1 ? 'totalHT,date' : 'totalHT');
              if (sortKey === 1) {
                query.addDescending('date');
              }
              break;
            case 'VAT':
              query[sortDir === -1 ? 'descending' : 'ascending'](sortDir === -1 ? 'VAT,date' : 'VAT');
              if (sortKey === 1) {
                query.addDescending('date');
              }
              break;
          }
        }
        switch (status) {
          case 'closed':
            query.equalTo('balanceDue', 0.0);
            break;

          case 'open':
            query.greaterThan('balanceDue', 0.0);
            break;

          case 'overdue':
            query.greaterThan('balanceDue', 0.0);
            query.lessThan('dueDate', moment().startOf('day').toDate());
            break;
        }
        if(customer){
          query.equalTo('customer',
            Parse.Object.extend(`People_${company.id}`).createWithoutData(customer));
        }
        if(!from && !to){
          last365Days && query.greaterThanOrEqualTo('date', moment().subtract(365, 'days').startOf('day').toDate())
        }else{
          to && query.lessThanOrEqualTo('date', new Date(to));
          from && query.greaterThanOrEqualTo('date', new Date(from));
        }
        return query;
      }

      return Promise.all([
        new Promise((resolve) => {
          let count = 0;

          let invoicesSumOfTotals = 0.0;
          let invoicesSumOfBalances = 0.0;

          let salesSumOfTotals = 0.0;

          let paymentsSumOfTotals = 0.0;
          let paymentsSumOfCredits = 0.0;

          getQuery(false).each(
            function(obj){
              count += 1;

              switch (obj.get('kind')){
                case 'Invoice':
                  invoicesSumOfTotals += obj.get('total');
                  invoicesSumOfBalances += obj.get('balanceDue');


                  break;
                case 'Sale':

                  salesSumOfTotals += obj.get('total');

                  break;
                case 'PaymentOfInvoices':

                  paymentsSumOfTotals += obj.get('amountReceived');
                  paymentsSumOfCredits += obj.get('amountToCredit');

                  break;
              }


            }, {
              success: function(){
                resolve({ count, invoicesSumOfTotals, invoicesSumOfBalances, salesSumOfTotals, salesSumOfBalances : 0.0, paymentsSumOfTotals, paymentsSumOfCredits, });
              },

              error: function(error){
                reject(error);
              }
            }
          );

        }),
        function(){
          const q = getQuery();
          q.skip(offset);
          q.limit(limit);
          return q.find();
        }()
      ]).then(([ { count, ...props, }, results ]) => ({ count, ...props, results, }));

    }();
  }

  if(type === 'recent'){ // Invoices + Sales
    return function(){

      const Type = Sale({ id: company.id, }); // Parse.Object.extend('Sale_' + company.id);

      function getQuery(doSort = true) {
      //   const query = function(){
      //     const q0 = new Parse.Query(Type);
      //     q0.equalTo('kind', 'Invoice');
      //
      //     const q1 = new Parse.Query(Type);
      //     q1.equalTo('kind', 'Sale');
      //
      //     return Parse.Query.or(
      //       q0,
      //       q1);
      //   }();

        const query = new Parse.Query(Type);
        query.containedIn('kind', [ 'Invoice', 'Sale', ]);

        if (doSort) {
          switch (sortKey) {
            case 'date':
              query[sortDir === -1 ? 'descending' : 'ascending']('date');
              break;
            case 'dueDate':
              query[sortDir === -1 ? 'descending' : 'ascending'](sortDir === -1 ? 'dueDate,date' : 'dueDate');
              if (sortKey === 1) {
                query.addDescending('date');
              }
              break;
            case 'balanceDue':
              query[sortDir === -1 ? 'descending' : 'ascending'](sortDir === -1 ? 'balanceDue,date' : 'balanceDue');
              if (sortKey === 1) {
                query.addDescending('date');
              }
              break;
            case 'total':
              query[sortDir === -1 ? 'descending' : 'ascending'](sortDir === -1 ? 'total,date' : 'total');
              if (sortKey === 1) {
                query.addDescending('date');
              }
              break;
            case 'totalHT':
              query[sortDir === -1 ? 'descending' : 'ascending'](sortDir === -1 ? 'totalHT,date' : 'totalHT');
              if (sortKey === 1) {
                query.addDescending('date');
              }
              break;
            case 'VAT':
              query[sortDir === -1 ? 'descending' : 'ascending'](sortDir === -1 ? 'VAT,date' : 'VAT');
              if (sortKey === 1) {
                query.addDescending('date');
              }
              break;
          }
        }
        switch (status) {
          case 'closed':
            query.equalTo('balanceDue', 0.0);
            break;

          case 'open':
            query.greaterThan('balanceDue', 0.0);
            break;

          case 'overdue':
            query.greaterThan('balanceDue', 0.0);
            query.lessThan('dueDate', moment().startOf('day').toDate());
            break;
        }
        if(customer){
          query.equalTo('customer',
            Parse.Object.extend(`People_${company.id}`).createWithoutData(customer));
        }
        if(!from && !to){
          last365Days && query.greaterThanOrEqualTo('date', moment().subtract(365, 'days').startOf('day').toDate())
        }else{
          to && query.lessThanOrEqualTo('date', new Date(to));
          from && query.greaterThanOrEqualTo('date', new Date(from));
        }
        return query;
      }

      return Promise.all([
        new Promise((resolve) => {
          let count = 0;

          let invoicesSumOfTotals = 0.0;
          let invoicesSumOfBalances = 0.0;

          let salesSumOfTotals = 0.0;

          getQuery(false).each(
            function(obj){
              count += 1;

              switch (obj.get('kind')){
                case 'Invoice':
                  invoicesSumOfTotals += obj.get('total');
                  invoicesSumOfBalances += obj.get('balanceDue');


                  break;
                case 'Sale':

                  salesSumOfTotals += obj.get('total');

                  break;

              }

            }, {
              success: function(){
                resolve({ count, invoicesSumOfTotals, invoicesSumOfBalances, salesSumOfTotals, salesSumOfBalances : 0.0, paymentsSumOfTotals : 0.0, paymentsSumOfCredits : 0.0, });
              },

              error: function(error){
                reject(error);
              }
            }
          );

        }),
        function(){
          const q = getQuery();

          q.skip(offset);
          q.limit(limit);
          return q.find();
        }()
      ]).then(([ { count, ...props, }, results ]) => ({ count, ...props, results, }));

    }();
  }

  if(type === 'money'){ // Sales + PaymentsOfInvoices
    return function(){

      const Type = Sale({ id: company.id, }); // Parse.Object.extend('Sale_' + company.id);

      function getQuery(doSort = true) {
        // const query = function(){
        //   const q0 = new Parse.Query(Type);
        //   q0.equalTo('kind', 'PaymentOfInvoices');
        //
        //   const q1 = new Parse.Query(Type);
        //   q1.equalTo('kind', 'Sale');
        //
        //   return Parse.Query.or(
        //     q0,
        //     q1);
        // }();

        const query = new Parse.Query(Type);
        query.containedIn('kind', [ 'PaymentOfInvoices', 'Sale', ]);

        if (doSort) {
          switch (sortKey) {
            case 'date':
              query[sortDir === -1 ? 'descending' : 'ascending']('date');
              break;
            case 'dueDate':
              query[sortDir === -1 ? 'descending' : 'ascending'](sortDir === -1 ? 'dueDate,date' : 'dueDate');
              if (sortKey === 1) {
                query.addDescending('date');
              }
              break;
            case 'balanceDue':
              query[sortDir === -1 ? 'descending' : 'ascending'](sortDir === -1 ? 'balanceDue,date' : 'balanceDue');
              if (sortKey === 1) {
                query.addDescending('date');
              }
              break;
            case 'total':
              query[sortDir === -1 ? 'descending' : 'ascending'](sortDir === -1 ? 'total,date' : 'total');
              if (sortKey === 1) {
                query.addDescending('date');
              }
              break;
            case 'totalHT':
              query[sortDir === -1 ? 'descending' : 'ascending'](sortDir === -1 ? 'totalHT,date' : 'totalHT');
              if (sortKey === 1) {
                query.addDescending('date');
              }
              break;
            case 'VAT':
              query[sortDir === -1 ? 'descending' : 'ascending'](sortDir === -1 ? 'VAT,date' : 'VAT');
              if (sortKey === 1) {
                query.addDescending('date');
              }
              break;
          }
        }
        switch (status) {
          case 'closed':
            query.equalTo('balanceDue', 0.0);
            break;

          case 'open':
            query.greaterThan('balanceDue', 0.0);
            break;

          case 'overdue':
            query.greaterThan('balanceDue', 0.0);
            query.lessThan('dueDate', moment().startOf('day').toDate());
            break;
        }
        if(customer){
          query.equalTo('customer',
            Parse.Object.extend(`People_${company.id}`).createWithoutData(customer));
        }
        if(!from && !to){
          last365Days && query.greaterThanOrEqualTo('date', moment().subtract(365, 'days').startOf('day').toDate())
        }else{
          to && query.lessThanOrEqualTo('date', new Date(to));
          from && query.greaterThanOrEqualTo('date', new Date(from));
        }
        return query;
      }

      return Promise.all([
        new Promise((resolve) => {
          let count = 0;

          let salesSumOfTotals = 0.0;

          let paymentsSumOfTotals = 0.0;
          let paymentsSumOfCredits = 0.0;

          getQuery(false).each(
            function(obj){
              count += 1;

              switch (obj.get('kind')){
                case 'Sale':

                  salesSumOfTotals += obj.get('total');

                  break;
                case 'PaymentOfInvoices':

                  paymentsSumOfTotals += obj.get('amountReceived');
                  paymentsSumOfCredits += obj.get('amountToCredit');

                  break;
              }

            }, {
              success: function(){
                resolve({ count, invoicesSumOfTotals : 0.0, invoicesSumOfBalances : 0.0, salesSumOfTotals, salesSumOfBalances : 0.0, paymentsSumOfTotals, paymentsSumOfCredits, });
              },

              error: function(error){
                reject(error);
              }
            }
          );

        }),
        function(){
          const q = getQuery();

          q.skip(offset);
          q.limit(limit);
          return q.find();
        }()
      ]).then(([ { count, ...props, }, results ]) => ({ count, ...props, results, }));

    }();
  }
};

module.exports.ops__customersQuerySales = function ops__customersQuerySales(company, { offset, limit, type, status, from, to, sortKey = 'date', sortDir = -1, }, last365Days = false){

  if(type === 'invoices' || type === 'open' || type === 'overdue'){
    return customersQueryInvoices(...arguments);
  }

  if(type === 'sales'){
    return customersQuerySales(...arguments);
  }

  if(type === 'payments'){
    return customersQueryPaymentsOfInvoices(...arguments);
  }

  if(type === 'ALL'){
    return function(){

      const Type = Sale({ id: company.id, }); // Parse.Object.extend('Sale_' + company.id);

      function aggregateResult(results){
        let count = 0;
        const xs = map(

          group(results, obj => obj.get('customer').id),

          objs => {
            count++;
            return objs[0].get('customer');
          }
        );
        return {
          results: Parse.Object.fetchAllIfNeeded(xs),
          count,
        };
      }

      function getQuery() {
        const query = new Parse.Query(Type);

        query.include([ 'customer' ]);

        switch (status) {
          case 'closed':
            query.equalTo('balanceDue', 0.0);
            break;

          case 'open':
            query.greaterThan('balanceDue', 0.0);
            break;

          case 'overdue':
            query.greaterThan('balanceDue', 0.0);
            query.lessThan('dueDate', moment().startOf('day').toDate());
            break;
        }

        if(!from && !to){
          last365Days && query.greaterThanOrEqualTo('date', moment().subtract(365, 'days').startOf('day').toDate())
        }else{
          to && query.lessThanOrEqualTo('date', new Date(to));
          from && query.greaterThanOrEqualTo('date', new Date(from));
        }
        return query;
      }

      return Promise.all([

        function(){
          const q = getQuery();
          q.limit(100000);
          return q.find();
        }()
      ]).then(([ results ]) => ({ ...aggregateResult(results), }));

    }();
  }

  if(type === 'recent'){ // Invoices + Sales
    return function(){

      const Type = Sale({ id: company.id, }); // Parse.Object.extend('Sale_' + company.id);

      function aggregateResult(results){
        let count = 0;
        const xs = map(

          group(results, obj => obj.get('customer').id),

          objs => {
            count++;
            return objs[0].get('customer');
          }
        );
        return {
          results: Parse.Object.fetchAllIfNeeded(xs),
          count,
        };
      }

      function getQuery() {
        // const query = function(){
        //   const q0 = new Parse.Query(Type);
        //   q0.equalTo('kind', 'Invoice');
        //
        //   const q1 = new Parse.Query(Type);
        //   q1.equalTo('kind', 'Sale');
        //
        //   return Parse.Query.or(
        //     q0,
        //     q1);
        // }();

        const query = new Parse.Query(Type);
        query.containedIn('kind', [ 'Invoice', 'Sale', ]);

        query.include([ 'customer' ]);

        switch (status) {
          case 'closed':
            query.equalTo('balanceDue', 0.0);
            break;

          case 'open':
            query.greaterThan('balanceDue', 0.0);
            break;

          case 'overdue':
            query.greaterThan('balanceDue', 0.0);
            query.lessThan('dueDate', moment().startOf('day').toDate());
            break;
        }

        if(!from && !to){
          last365Days && query.greaterThanOrEqualTo('date', moment().subtract(365, 'days').startOf('day').toDate())
        }else{
          to && query.lessThanOrEqualTo('date', new Date(to));
          from && query.greaterThanOrEqualTo('date', new Date(from));
        }
        return query;
      }

      return Promise.all([

        function(){
          const q = getQuery();
          q.limit(100000);
          return q.find();
        }()
      ]).then(([ results ]) => ({ ...aggregateResult(results), }));

    }();
  }

  if(type === 'money'){ // Sales + PaymentsOfInvoices
    return function(){

      const Type = Sale({ id: company.id, }); // Parse.Object.extend('Sale_' + company.id);

      function aggregateResult(results){
        let count = 0;
        const xs = map(

          group(results, obj => obj.get('customer').id),

          objs => {
            count++;
            return objs[0].get('customer');
          }
        );
        return {
          results: Parse.Object.fetchAllIfNeeded(xs),
          count,
        };
      }

      function getQuery() {
        // const query = function(){
        //   const q0 = new Parse.Query(Type);
        //   q0.equalTo('kind', 'PaymentOfInvoices');
        //
        //   const q1 = new Parse.Query(Type);
        //   q1.equalTo('kind', 'Sale');
        //
        //   return Parse.Query.or(
        //     q0,
        //     q1);
        // }();

        const query = new Parse.Query(Type);
        query.containedIn('kind', [ 'PaymentOfInvoices', 'Sale', ]);

        query.include([ 'customer' ]);

        switch (status) {
          case 'closed':
            query.equalTo('balanceDue', 0.0);
            break;

          case 'open':
            query.greaterThan('balanceDue', 0.0);
            break;

          case 'overdue':
            query.greaterThan('balanceDue', 0.0);
            query.lessThan('dueDate', moment().startOf('day').toDate());
            break;
        }

        if(!from && !to){
          last365Days && query.greaterThanOrEqualTo('date', moment().subtract(365, 'days').startOf('day').toDate())
        }else{
          to && query.lessThanOrEqualTo('date', new Date(to));
          from && query.greaterThanOrEqualTo('date', new Date(from));
        }
        return query;
      }

      return Promise.all([

        function(){
          const q = getQuery();
          q.limit(100000);
          return q.find();
        }()
      ]).then(([ results ]) => ({ ...aggregateResult(results), }));

    }();
  }
};

module.exports.ops__queryExpenses = function ops__queryExpenses(company, { offset, limit, type, status, from, to, sortKey = 'date', sortDir = -1, customer, payee, }, last365Days = true){

  if(type === 'bills' || type === 'open' || type === 'overdue'){
    return queryBills(...arguments);
  }

  if(type === 'expenses'){
    return queryExpenses(...arguments);
  }

  if(type === 'payments'){
    return queryPaymentsOfBills(...arguments);
  }

  if(type === 'ALL'){
    return function(){

      const Type = Expense({ id: company.id, }); // Parse.Object.extend('Expense_' + company.id);

      function getQuery(doSort = true) {
        const query = new Parse.Query(Type);

        if (doSort) {
          switch (sortKey) {
            case 'date':
              query[sortDir === -1 ? 'descending' : 'ascending']('date');
              break;
            case 'dueDate':
              query[sortDir === -1 ? 'descending' : 'ascending'](sortDir === -1 ? 'dueDate,date' : 'dueDate');
              if (sortKey === 1) {
                query.addDescending('date');
              }
              break;
            case 'balanceDue':
              query[sortDir === -1 ? 'descending' : 'ascending'](sortDir === -1 ? 'balanceDue,date' : 'balanceDue');
              if (sortKey === 1) {
                query.addDescending('date');
              }
              break;
            case 'total':
              query[sortDir === -1 ? 'descending' : 'ascending'](sortDir === -1 ? 'total,date' : 'total');
              if (sortKey === 1) {
                query.addDescending('date');
              }
              break;
            case 'totalHT':
              query[sortDir === -1 ? 'descending' : 'ascending'](sortDir === -1 ? 'totalHT,date' : 'totalHT');
              if (sortKey === 1) {
                query.addDescending('date');
              }
              break;
            case 'VAT':
              query[sortDir === -1 ? 'descending' : 'ascending'](sortDir === -1 ? 'VAT,date' : 'VAT');
              if (sortKey === 1) {
                query.addDescending('date');
              }
              break;
          }
        }
        switch (status) {
          case 'closed':
            query.equalTo('balanceDue', 0.0);
            break;

          case 'open':
            query.greaterThan('balanceDue', 0.0);
            break;

          case 'overdue':
            query.greaterThan('balanceDue', 0.0);
            query.lessThan('dueDate', moment().startOf('day').toDate());
            break;
        }
        if(payee){
          query.equalTo('payee',
            Parse.Object.extend(`People_${company.id}`).createWithoutData(payee));
        }
        if(!from && !to){
          last365Days && query.greaterThanOrEqualTo('date', moment().subtract(365, 'days').startOf('day').toDate())
        }else{
          to && query.lessThanOrEqualTo('date', new Date(to));
          from && query.greaterThanOrEqualTo('date', new Date(from));
        }
        return query;
      }

      return Promise.all([
        new Promise((resolve) => {
          let count = 0;


          let billsSumOfTotals = 0.0;
          let billsSumOfBalances = 0.0;

          let expensesSumOfTotals = 0.0;

          let paymentsSumOfTotals = 0.0;
          let paymentsSumOfCredits = 0.0;

          getQuery(false).each(
            function(obj){
              count += 1;

              switch (obj.get('kind')){
                case 'Bill':
                  billsSumOfTotals += obj.get('total');
                  billsSumOfBalances += obj.get('balanceDue');


                  break;
                case 'Expense':

                  expensesSumOfTotals += obj.get('total');

                  break;
                case 'PaymentOfBills':

                  paymentsSumOfTotals += obj.get('amountReceived');
                  paymentsSumOfCredits += obj.get('amountToCredit');

                  break;
              }

            }, {
              success: function(){
                resolve({ count, billsSumOfTotals, billsSumOfBalances, expensesSumOfTotals, expensesSumOfBalances : 0.0, paymentsSumOfTotals, paymentsSumOfCredits, });
              },

              error: function(error){
                reject(error);
              }
            }
          );

        }),
        function(){
          const q = getQuery();
          q.skip(offset);
          q.limit(limit);
          return q.find();
        }()
      ]).then(([ { count, ...props, }, results ]) => ({ count, ...props, results, }));

    }();
  }

  if(type === 'recent'){ // Bills + Expenses
    return function(){

      const Type = Expense({ id: company.id, }); // Parse.Object.extend('Expense_' + company.id);

      function getQuery(doSort = true) {
        // const query = function(){
        //   const q0 = new Parse.Query(Type);
        //   q0.equalTo('kind', 'Bill');
        //
        //   const q1 = new Parse.Query(Type);
        //   q1.equalTo('kind', 'Expense');
        //
        //   return Parse.Query.or(
        //     q0,
        //     q1);
        // }();

        const query = new Parse.Query(Type);
        query.containedIn('kind', [ 'Bill', 'Expense', ]);

        if (doSort) {
          switch (sortKey) {
            case 'date':
              query[sortDir === -1 ? 'descending' : 'ascending']('date');
              break;
            case 'dueDate':
              query[sortDir === -1 ? 'descending' : 'ascending'](sortDir === -1 ? 'dueDate,date' : 'dueDate');
              if (sortKey === 1) {
                query.addDescending('date');
              }
              break;
            case 'balanceDue':
              query[sortDir === -1 ? 'descending' : 'ascending'](sortDir === -1 ? 'balanceDue,date' : 'balanceDue');
              if (sortKey === 1) {
                query.addDescending('date');
              }
              break;
            case 'total':
              query[sortDir === -1 ? 'descending' : 'ascending'](sortDir === -1 ? 'total,date' : 'total');
              if (sortKey === 1) {
                query.addDescending('date');
              }
              break;
            case 'totalHT':
              query[sortDir === -1 ? 'descending' : 'ascending'](sortDir === -1 ? 'totalHT,date' : 'totalHT');
              if (sortKey === 1) {
                query.addDescending('date');
              }
              break;
            case 'VAT':
              query[sortDir === -1 ? 'descending' : 'ascending'](sortDir === -1 ? 'VAT,date' : 'VAT');
              if (sortKey === 1) {
                query.addDescending('date');
              }
              break;
          }
        }
        switch (status) {
          case 'closed':
            query.equalTo('balanceDue', 0.0);
            break;

          case 'open':
            query.greaterThan('balanceDue', 0.0);
            break;

          case 'overdue':
            query.greaterThan('balanceDue', 0.0);
            query.lessThan('dueDate', moment().startOf('day').toDate());
            break;
        }
        if(payee){
          query.equalTo('payee',
            Parse.Object.extend(`People_${company.id}`).createWithoutData(payee));
        }
        if(!from && !to){
          last365Days && query.greaterThanOrEqualTo('date', moment().subtract(365, 'days').startOf('day').toDate())
        }else{
          to && query.lessThanOrEqualTo('date', new Date(to));
          from && query.greaterThanOrEqualTo('date', new Date(from));
        }
        return query;
      }

      return Promise.all([
        new Promise((resolve) => {
          let count = 0;


          let billsSumOfTotals = 0.0;
          let billsSumOfBalances = 0.0;

          let expensesSumOfTotals = 0.0;

          getQuery(false).each(
            function(obj){
              count += 1;

              switch (obj.get('kind')){
                case 'Bill':
                  billsSumOfTotals += obj.get('total');
                  billsSumOfBalances += obj.get('balanceDue');


                  break;
                case 'Expense':

                  expensesSumOfTotals += obj.get('total');

                  break;

              }

            }, {
              success: function(){
                resolve({ count, billsSumOfTotals, billsSumOfBalances, expensesSumOfTotals, expensesSumOfBalances : 0.0, paymentsSumOfTotals : 0.0, paymentsSumOfCredits : 0.0, });
              },

              error: function(error){
                reject(error);
              }
            }
          );

        }),
        function(){
          const q = getQuery();
          q.skip(offset);
          q.limit(limit);
          return q.find();
        }()
      ]).then(([ { count, ...props, }, results ]) => ({ count, ...props, results, }));

    }();
  }

  if(type === 'money'){ // Expenses + PaymentsOfBills
    return function(){

      const Type = Expense({ id: company.id, }); // Parse.Object.extend('Expense_' + company.id);

      function getQuery(doSort = true) {
        // const query = function(){
        //   const q0 = new Parse.Query(Type);
        //   q0.equalTo('kind', 'Expense');
        //
        //   const q1 = new Parse.Query(Type);
        //   q1.equalTo('kind', 'PaymentsOfBills');
        //
        //   return Parse.Query.or(
        //     q0,
        //     q1);
        // }();

        const query = new Parse.Query(Type);
        query.containedIn('kind', [ 'PaymentsOfBills', 'Expense', ]);

        if (doSort) {
          switch (sortKey) {
            case 'date':
              query[sortDir === -1 ? 'descending' : 'ascending']('date');
              break;
            case 'dueDate':
              query[sortDir === -1 ? 'descending' : 'ascending'](sortDir === -1 ? 'dueDate,date' : 'dueDate');
              if (sortKey === 1) {
                query.addDescending('date');
              }
              break;
            case 'balanceDue':
              query[sortDir === -1 ? 'descending' : 'ascending'](sortDir === -1 ? 'balanceDue,date' : 'balanceDue');
              if (sortKey === 1) {
                query.addDescending('date');
              }
              break;
            case 'total':
              query[sortDir === -1 ? 'descending' : 'ascending'](sortDir === -1 ? 'total,date' : 'total');
              if (sortKey === 1) {
                query.addDescending('date');
              }
              break;
            case 'totalHT':
              query[sortDir === -1 ? 'descending' : 'ascending'](sortDir === -1 ? 'totalHT,date' : 'totalHT');
              if (sortKey === 1) {
                query.addDescending('date');
              }
              break;
            case 'VAT':
              query[sortDir === -1 ? 'descending' : 'ascending'](sortDir === -1 ? 'VAT,date' : 'VAT');
              if (sortKey === 1) {
                query.addDescending('date');
              }
              break;
          }
        }
        switch (status) {
          case 'closed':
            query.equalTo('balanceDue', 0.0);
            break;

          case 'open':
            query.greaterThan('balanceDue', 0.0);
            break;

          case 'overdue':
            query.greaterThan('balanceDue', 0.0);
            query.lessThan('dueDate', moment().startOf('day').toDate());
            break;
        }
        if(payee){
          query.equalTo('payee',
            Parse.Object.extend(`People_${company.id}`).createWithoutData(payee));
        }
        if(!from && !to){
          last365Days && query.greaterThanOrEqualTo('date', moment().subtract(365, 'days').startOf('day').toDate())
        }else{
          to && query.lessThanOrEqualTo('date', new Date(to));
          from && query.greaterThanOrEqualTo('date', new Date(from));
        }
        return query;
      }

      return Promise.all([
        new Promise((resolve) => {
          let count = 0;

          let expensesSumOfTotals = 0.0;

          let paymentsSumOfTotals = 0.0;
          let paymentsSumOfCredits = 0.0;

          getQuery(false).each(
            function(obj){
              count += 1;

              switch (obj.get('kind')){

                case 'Expense':

                  expensesSumOfTotals += obj.get('total');

                  break;
                case 'PaymentOfBills':

                  paymentsSumOfTotals += obj.get('amountReceived');
                  paymentsSumOfCredits += obj.get('amountToCredit');

                  break;
              }

            }, {
              success: function(){
                resolve({ count, billsSumOfTotals : 0.0, billsSumOfBalances : 0.0, expensesSumOfTotals, expensesSumOfBalances : 0.0, paymentsSumOfTotals, paymentsSumOfCredits, });
              },

              error: function(error){
                reject(error);
              }
            }
          );

        }),
        function(){
          const q = getQuery();
          q.skip(offset);
          q.limit(limit);
          return q.find();
        }()
      ]).then(([ { count, ...props, }, results ]) => ({ count, ...props, results, }));

    }();
  }
};


module.exports.ops__vendorsQueryExpenses = function ops__vendorsQueryExpenses(company, { offset, limit, type, status, from, to, sortKey = 'date', sortDir = -1, }, last365Days = false){

  if(type === 'bills' || type === 'open' || type === 'overdue'){
    return vendorsQueryBills(...arguments);
  }

  if(type === 'expenses'){
    return vendorsQueryExpenses(...arguments);
  }

  if(type === 'payments'){
    return vendorsQueryPaymentsOfBills(...arguments);
  }

  function getPayee(obj){
    if(!obj){
      return undefined;
    }

    if(obj.has('payee')){
      return obj.get('payee');
    }

    if(obj.has('vendor')){
      return obj.get('vendor');
    }

    return undefined;
  }

  if(type === 'ALL'){
    return function(){

      const Type = Expense({ id: company.id, }); // Parse.Object.extend('Expense_' + company.id);

      function aggregateResult(results){
        let count = 0;
        const xs = map(

          group(results, obj => getPayee(obj).id),

          objs => {
            count++;
            return getPayee(objs[0]);
          }
        );
        return {
          results: Parse.Object.fetchAllIfNeeded(compact(xs)),
          count,
        };
      }

      function getQuery() {
        const query = new Parse.Query(Type);

        query.include([ 'vendor', 'payee' ]);

        switch (status) {
          case 'closed':
            query.equalTo('balanceDue', 0.0);
            break;

          case 'open':
            query.greaterThan('balanceDue', 0.0);
            break;

          case 'overdue':
            query.greaterThan('balanceDue', 0.0);
            query.lessThan('dueDate', moment().startOf('day').toDate());
            break;
        }
        if(!from && !to){
          last365Days && query.greaterThanOrEqualTo('date', moment().subtract(365, 'days').startOf('day').toDate())
        }else{
          to && query.lessThanOrEqualTo('date', new Date(to));
          from && query.greaterThanOrEqualTo('date', new Date(from));
        }
        return query;
      }

      return Promise.all([
        function(){
          const q = getQuery();
          q.limit(100000);
          return q.find();
        }()
      ]).then(([ results ]) => ({ ...aggregateResult(results), }));

    }();
  }

  if(type === 'recent'){ // Bills + Expenses
    return function(){

      const Type = Expense({ id: company.id, }); // Parse.Object.extend('Expense_' + company.id);

      function aggregateResult(results){
        let count = 0;
        const xs = map(

          group(results, obj => getPayee(obj).id),

          objs => {
            count++;
            return getPayee(objs[0]);
          }
        );
        return {
          results: Parse.Object.fetchAllIfNeeded(compact(xs)),
          count,
        };
      }

      function getQuery() {
        // const query = function(){
        //   const q0 = new Parse.Query(Type);
        //   q0.equalTo('kind', 'Bill');
        //
        //   const q1 = new Parse.Query(Type);
        //   q1.equalTo('kind', 'Expense');
        //
        //   return Parse.Query.or(
        //     q0,
        //     q1);
        // }();

        const query = new Parse.Query(Type);
        query.containedIn('kind', [ 'Bill', 'Expense', ]);

        query.include([ 'vendor', 'payee' ]);

        switch (status) {
          case 'closed':
            query.equalTo('balanceDue', 0.0);
            break;

          case 'open':
            query.greaterThan('balanceDue', 0.0);
            break;

          case 'overdue':
            query.greaterThan('balanceDue', 0.0);
            query.lessThan('dueDate', moment().startOf('day').toDate());
            break;
        }
        if(!from && !to){
          last365Days && query.greaterThanOrEqualTo('date', moment().subtract(365, 'days').startOf('day').toDate())
        }else{
          to && query.lessThanOrEqualTo('date', new Date(to));
          from && query.greaterThanOrEqualTo('date', new Date(from));
        }
        return query;
      }

      return Promise.all([
        function(){
          const q = getQuery();
          q.limit(100000);
          return q.find();
        }()
      ]).then(([ results ]) => ({ ...aggregateResult(results), }));

    }();
  }

  if(type === 'money'){ // Expenses + PaymentsOfBills
    return function(){

      const Type = Expense({ id: company.id, }); // Parse.Object.extend('Expense_' + company.id);

      function aggregateResult(results){
        let count = 0;
        const xs = map(

          group(results, obj => getPayee(obj).id),

          objs => {
            count++;
            return getPayee(objs[0]);
          }
        );
        return {
          results: Parse.Object.fetchAllIfNeeded(compact(xs)),
          count,
        };
      }

      function getQuery() {
        // const query = function(){
        //   const q0 = new Parse.Query(Type);
        //   q0.equalTo('kind', 'PaymentsOfBills');
        //
        //   const q1 = new Parse.Query(Type);
        //   q1.equalTo('kind', 'Expense');
        //
        //   return Parse.Query.or(
        //     q0,
        //     q1);
        // }();

        const query = new Parse.Query(Type);
        query.containedIn('kind', [ 'PaymentsOfBills', 'Expense', ]);

        query.include([ 'vendor', 'payee' ]);

        switch (status) {
          case 'closed':
            query.equalTo('balanceDue', 0.0);
            break;

          case 'open':
            query.greaterThan('balanceDue', 0.0);
            break;

          case 'overdue':
            query.greaterThan('balanceDue', 0.0);
            query.lessThan('dueDate', moment().startOf('day').toDate());
            break;
        }
        if(!from && !to){
          last365Days && query.greaterThanOrEqualTo('date', moment().subtract(365, 'days').startOf('day').toDate())
        }else{
          to && query.lessThanOrEqualTo('date', new Date(to));
          from && query.greaterThanOrEqualTo('date', new Date(from));
        }
        return query;
      }

      return Promise.all([
        function(){
          const q = getQuery();
          q.limit(100000);
          return q.find();
        }()
      ]).then(([ results ]) => ({ ...aggregateResult(results), }));

    }();
  }
};

module.exports.queryInvoices = queryInvoices;
module.exports.querySales = querySales;
module.exports.queryPaymentsOfInvoices = queryPaymentsOfInvoices;
module.exports.customersQueryInvoices = customersQueryInvoices;
module.exports.customersQuerySales = customersQuerySales;
module.exports.customersQueryPaymentsOfInvoices = customersQueryPaymentsOfInvoices;
module.exports.queryOpenBills = queryOpenBills;
module.exports.queryVendorOpenBills = queryVendorOpenBills;
module.exports.queryExpenses = queryExpenses;
module.exports.queryBills = queryBills;
module.exports.queryPaymentsOfBills = queryPaymentsOfBills;
module.exports.vendorsQueryExpenses = vendorsQueryExpenses;
module.exports.vendorsQueryBills = vendorsQueryBills;
module.exports.vendorsQueryPaymentsOfBills = vendorsQueryPaymentsOfBills;
module.exports.User = User;
