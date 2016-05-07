'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.User = undefined;

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; /**
                                                                                                                                                                                                                                                                   *  Copyright (c) 2015, Epsilon, SARL.
                                                                                                                                                                                                                                                                   *  All rights reserved.
                                                                                                                                                                                                                                                                   *
                                                                                                                                                                                                                                                                   */

exports.getViewer = getViewer;
exports.getUser = getUser;
exports.getProduct = getProduct;
exports.getBank = getBank;
exports.getEmployee = getEmployee;
exports.getCustomer = getCustomer;
exports.getVendor = getVendor;
exports.getExpense = getExpense;
exports.getSale = getSale;
exports.getInvoice = getInvoice;
exports.getBill = getBill;
exports.getPaymentOfInvoices = getPaymentOfInvoices;
exports.getPaymentOfBills = getPaymentOfBills;
exports.getInvoiceItem = getInvoiceItem;
exports.getPaymentOfInvoicesItem = getPaymentOfInvoicesItem;
exports.getPaymentOfBillsItem = getPaymentOfBillsItem;
exports.getExpenseItem = getExpenseItem;
exports.getBillItem = getBillItem;
exports.getSaleItem = getSaleItem;
exports.getTransaction = getTransaction;
exports.getCompany = getCompany;
exports.getCompanies = getCompanies;
exports.getCompanyProducts = getCompanyProducts;
exports.getBankAccounts = getBankAccounts;
exports.getOperation = getOperation;
exports.getOperationsByCategories = getOperationsByCategories;
exports.getAccount = getAccount;
exports.getCompanyAccounts = getCompanyAccounts;
exports.getTransactions = getTransactions;
exports.getTransactionOperations = getTransactionOperations;
exports.getTransactionByType = getTransactionByType;
exports.getCompanyExpenses = getCompanyExpenses;
exports.getCompanySales = getCompanySales;
exports.getCompanyInvoices = getCompanyInvoices;
exports.getCompanyInvoicesTotalCount = getCompanyInvoicesTotalCount;
exports.getCompanyBills = getCompanyBills;
exports.getCompanyBillsTotalCount = getCompanyBillsTotalCount;
exports.getCompanyPaymentsOfInvoices = getCompanyPaymentsOfInvoices;
exports.getCompanyPaymentsOfBills = getCompanyPaymentsOfBills;
exports.getInvoiceItems = getInvoiceItems;
exports.getBillItems = getBillItems;
exports.getAccountsByCategories = getAccountsByCategories;
exports.getInvoicePayments = getInvoicePayments;
exports.getPaymentOfInvoicesItems = getPaymentOfInvoicesItems;
exports.getBillPayments = getBillPayments;
exports.getPaymentOfBillsItems = getPaymentOfBillsItems;
exports.getCompanyPeople = getCompanyPeople;
exports.getCompanyVendors = getCompanyVendors;
exports.getCompanyCustomers = getCompanyCustomers;
exports.getCompanyEmployees = getCompanyEmployees;
exports.getSaleItems = getSaleItems;
exports.getExpenseItems = getExpenseItems;
exports.getChartAccountList = getChartAccountList;
exports.queryOpenInvoices = queryOpenInvoices;
exports.queryCustomerOpenInvoices = queryCustomerOpenInvoices;
exports.querySalesRecentlyPaid = querySalesRecentlyPaid;
exports.queryOverdueInvoices = queryOverdueInvoices;
exports.queryCustomerOverdueInvoices = queryCustomerOverdueInvoices;
exports.queryInvoices = queryInvoices;
exports.querySales = querySales;
exports.queryPaymentsOfInvoices = queryPaymentsOfInvoices;
exports.customersQueryInvoices = customersQueryInvoices;
exports.customersQuerySales = customersQuerySales;
exports.customersQueryPaymentsOfInvoices = customersQueryPaymentsOfInvoices;
exports.queryOpenBills = queryOpenBills;
exports.queryVendorOpenBills = queryVendorOpenBills;
exports.queryExpensesRecentlyPaid = queryExpensesRecentlyPaid;
exports.queryOverdueBills = queryOverdueBills;
exports.queryVendorOverdueBills = queryVendorOverdueBills;
exports.queryExpenses = queryExpenses;
exports.queryBills = queryBills;
exports.queryPaymentsOfBills = queryPaymentsOfBills;
exports.getVendorOpenBills = getVendorOpenBills;
exports.getPaymentOfBillsFromPaymentOfBillsItem = getPaymentOfBillsFromPaymentOfBillsItem;
exports.getCustomerOpenInvoices = getCustomerOpenInvoices;
exports.getPaymentOfInvoicesFromPaymentOfInvoicesItem = getPaymentOfInvoicesFromPaymentOfInvoicesItem;
exports.vendorsQueryExpenses = vendorsQueryExpenses;
exports.cusomersQueryExpenses = cusomersQueryExpenses;
exports.vendorsQueryBills = vendorsQueryBills;
exports.vendorsQueryPaymentsOfBills = vendorsQueryPaymentsOfBills;
exports.getObjectByType = getObjectByType;
exports.getObjectsByType = getObjectsByType;

var _parse = require('parse');

var _parse2 = _interopRequireDefault(_parse);

var _Account = require('./Account');

var _Account2 = _interopRequireDefault(_Account);

var _Company = require('./Company');

var _Company2 = _interopRequireDefault(_Company);

var _Transaction = require('./Transaction');

var _Transaction2 = _interopRequireDefault(_Transaction);

var _Operation = require('./Operation');

var _Operation2 = _interopRequireDefault(_Operation);

var _Bank = require('./Bank');

var _Bank2 = _interopRequireDefault(_Bank);

var _Customer = require('./Customer');

var _Customer2 = _interopRequireDefault(_Customer);

var _Employee = require('./Employee');

var _Employee2 = _interopRequireDefault(_Employee);

var _Vendor = require('./Vendor');

var _Vendor2 = _interopRequireDefault(_Vendor);

var _Product = require('./Product');

var _Product2 = _interopRequireDefault(_Product);

var _Expense = require('./Expense');

var _Expense2 = _interopRequireDefault(_Expense);

var _Sale = require('./Sale');

var _Sale2 = _interopRequireDefault(_Sale);

var _Invoice = require('./Invoice');

var _Invoice2 = _interopRequireDefault(_Invoice);

var _Bill = require('./Bill');

var _Bill2 = _interopRequireDefault(_Bill);

var _PaymentOfInvoices = require('./PaymentOfInvoices');

var _PaymentOfInvoices2 = _interopRequireDefault(_PaymentOfInvoices);

var _PaymentOfBills = require('./PaymentOfBills');

var _PaymentOfBills2 = _interopRequireDefault(_PaymentOfBills);

var _InvoiceItem = require('./InvoiceItem');

var _InvoiceItem2 = _interopRequireDefault(_InvoiceItem);

var _PaymentOfInvoicesItem = require('./PaymentOfInvoicesItem');

var _PaymentOfInvoicesItem2 = _interopRequireDefault(_PaymentOfInvoicesItem);

var _PaymentOfBillsItem = require('./PaymentOfBillsItem');

var _PaymentOfBillsItem2 = _interopRequireDefault(_PaymentOfBillsItem);

var _ExpenseItem = require('./ExpenseItem');

var _ExpenseItem2 = _interopRequireDefault(_ExpenseItem);

var _BillItem = require('./BillItem');

var _BillItem2 = _interopRequireDefault(_BillItem);

var _SaleItem = require('./SaleItem');

var _SaleItem2 = _interopRequireDefault(_SaleItem);

var _lodash = require('lodash.concat');

var _lodash2 = _interopRequireDefault(_lodash);

var _lodash3 = require('lodash.map');

var _lodash4 = _interopRequireDefault(_lodash3);

var _lodash5 = require('lodash.compact');

var _lodash6 = _interopRequireDefault(_lodash5);

var _lodash7 = require('lodash.groupby');

var _lodash8 = _interopRequireDefault(_lodash7);

var _accounts = require('./accounts.json');

var _accounts2 = _interopRequireDefault(_accounts);

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

var _constants = require('../constants');

var _loaders = require('./loaders');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function getViewer() {
  return _parse2.default.User.current();
}

function getUser(id) {
  return _loaders.parseIDLoader.load([_parse2.default.User, id]);
}

function getProduct(info) {
  return getTypeById(_Product2.default, info);
}

function getBank(info) {
  return getTypeById(_Bank2.default, info);
}
function getEmployee(info) {
  return getTypeById(_Employee2.default, info);
}
function getCustomer(info) {
  return getTypeById(_Customer2.default, info);
}
function getVendor(info) {
  return getTypeById(_Vendor2.default, info);
}
function getExpense(info) {
  return getTypeById(_Expense2.default, info);
}
function getSale(info) {
  return getTypeById(_Sale2.default, info);
}
function getInvoice(info) {
  return getTypeById(_Invoice2.default, info);
}
function getBill(info) {
  return getTypeById(_Bill2.default, info);
}
function getPaymentOfInvoices(info) {
  return getTypeById(PaymentPaymentOfInvoices, info);
}
function getPaymentOfBills(info) {
  return getTypeById(PaymentPaymentOfBills, info);
}

function getInvoiceItem(info) {
  return getTypeById(_InvoiceItem2.default, info);
}
function getPaymentOfInvoicesItem(info) {
  return getTypeById(_PaymentOfInvoicesItem2.default, info);
}
function getPaymentOfBillsItem(info) {
  return getTypeById(_PaymentOfBillsItem2.default, info);
}

function getExpenseItem(info) {
  return getTypeById(_ExpenseItem2.default, info);
}
function getBillItem(info) {
  return getTypeById(_BillItem2.default, info);
}
function getSaleItem(info) {
  return getTypeById(_SaleItem2.default, info);
}

function getTransaction(info) {
  return getTypeById(_Transaction2.default, info);
}

function getCompany(id) {
  return _loaders.parseIDLoader.load([_Company2.default, id]);
}

function getCompanies() {
  return _loaders.parseTableLoader.load(_Company2.default);
}

function getCompanyProducts(company) {
  return _loaders.parseTableLoader.load((0, _Product2.default)({ id: company.id }));
}

function getBankAccounts() {

  return [_extends({}, _accounts2.default['5.1.6.1.1'], { icon: 'attach_money', __type: 'Bank' }), _extends({}, _accounts2.default['5.1.4.1'], { icon: 'account_balance', __type: 'Bank' })];
}

function getOperation(info) {
  return getTypeById(_Operation2.default, info);
}

function getOperationsByCategories(_ref) {
  var companyId = _ref.companyId;
  var from = _ref.from;
  var to = _ref.to;
  var type = _ref.type;
  var categories = _ref.categories;

  var qry = new _parse2.default.Query((0, _Operation2.default)({ id: companyId }));

  if (process.env.NODE_ENV !== 'production') {
    console.assert(Array.isArray(categories, 'categories should be an array'));
  }

  qry.containedIn('categoryCode', categories);
  if (type) {
    qry.equalTo('type', type);
  }
  if (from) {
    qry.greaterThanOrEqualTo('date', new Date(from));
  }
  if (to) {
    qry.lessThanOrEqualTo('date', new Date(to));
  }
  qry.ascending('date');
  qry.limit(100000);
  return qry.find();
}

function getAccount(info) {
  return getTypeById(_Account2.default, info);
}

function getCompanyAccounts(company) {
  return _loaders.parseTableLoader.load((0, _Account2.default)({ id: company.id }));
}

function getTransactions(company) {
  return _loaders.parseTableLoader.load((0, _Transaction2.default)({ id: company.id }));
}

function getTransactionOperations(_ref2) {
  var companyId = _ref2.companyId;
  var id = _ref2.id;

  var qry = new _parse2.default.Query((0, _Operation2.default)({ id: companyId }));
  qry.equalTo('transaction', (0, _Transaction2.default)({ id: companyId }).createWithoutData(id));
  qry.limit(100000);
  return qry.find();
}

function getTransactionByType(_ref3) {
  var type = _ref3.type;
  var companyId = _ref3.companyId;
  var id = _ref3.id;

  var qry = new _parse2.default.Query((0, _Transaction2.default)({ id: companyId }));
  qry.equalTo('transactionType', type);

  switch (type) {
    case 'Invoice':
      qry.equalTo('invoice', (0, _Invoice2.default)({ id: companyId }).createWithoutData(id));break;
    case 'Sale':
      qry.equalTo('sale', (0, _Sale2.default)({ id: companyId }).createWithoutData(id));break;
    case 'PaymentOfInvoices':
      qry.equalTo('paymentOfInvoices', (0, _PaymentOfInvoices2.default)({ id: companyId }).createWithoutData(id));break;

    case 'Bill':
      qry.equalTo('bill', (0, _Bill2.default)({ id: companyId }).createWithoutData(id));break;
    case 'Expense':
      qry.equalTo('expense', (0, _Expense2.default)({ id: companyId }).createWithoutData(id));break;
    case 'PaymentOfBills':
      qry.equalTo('paymentOfBills', (0, _PaymentOfBills2.default)({ id: companyId }).createWithoutData(id));break;
  }

  return qry.first();
}

function getCompanyExpenses(company) {
  return _loaders.parseTableLoader.load((0, _Expense2.default)({ id: company.id }));
}
function getCompanySales(company) {
  return _loaders.parseTableLoader.load((0, _Sale2.default)({ id: company.id }));
}
function getCompanyInvoices(company) {
  return _loaders.parseTableLoader.load((0, _Invoice2.default)({ id: company.id }));
}
function getCompanyInvoicesTotalCount(company) {
  return countByType((0, _Invoice2.default)({ id: company.id }));
}
function getCompanyBills(company) {
  return _loaders.parseTableLoader.load((0, _Bill2.default)({ id: company.id }));
}
function getCompanyBillsTotalCount(company) {
  return countByType((0, _Bill2.default)({ id: company.id }));
}
function getCompanyPaymentsOfInvoices(company) {
  return _loaders.parseTableLoader.load((0, _PaymentOfInvoices2.default)({ id: company.id }));
}
function getCompanyPaymentsOfBills(company) {
  return _loaders.parseTableLoader.load((0, _PaymentOfBills2.default)({ id: company.id }));
}

function getInvoiceItems(invoice) {
  var qry = new _parse2.default.Query((0, _InvoiceItem2.default)({ id: invoice.get('company').id }));
  qry.equalTo('invoice', _parse2.default.Object.extend('Invoice_' + invoice.get('company').id).createWithoutData(invoice.id));
  qry.include(['invoice', 'item']);
  qry.ascending('index');
  return qry.find();

  // return invoice.relation('items').query().find().then(objs => objs.map(obj => { obj.__type = 'InvoiceItem'; return obj; }));
}
function getBillItems(bill) {
  var qry = new _parse2.default.Query((0, _BillItem2.default)({ id: bill.get('company').id }));
  qry.equalTo('bill', _parse2.default.Object.extend('Bill_' + bill.get('company').id).createWithoutData(bill.id));
  qry.include(['bill']);
  qry.ascending('index');
  return qry.find();

  // return bill.relation('items').query().find().then(objs => objs.map(obj => { obj.__type = 'BillItem'; return obj; }));
}

function getAccountsByCategories(categories) {
  return Object.keys(_accounts2.default).reduce(function (accounts, code) {
    var account = _accounts2.default[code];
    categories.indexOf(account._categoryCode) !== -1 && accounts.push(account);
    return accounts;
  }, []);
}

function getInvoicePayments(invoice) {
  var qry = new _parse2.default.Query((0, _PaymentOfInvoicesItem2.default)({ id: invoice.get('company').id }));
  // qry.equalTo('invoice', {className: 'Invoice_' + invoice.get('company').id, id: invoice.id});
  qry.equalTo('invoice', _parse2.default.Object.extend('Invoice_' + invoice.get('company').id).createWithoutData(invoice.id));
  // qry.select([ 'id', 'date', 'payment', 'amount', 'invoice' ]);
  // qry.select(['amount']);
  qry.include(['payment', 'invoice']);
  qry.descending('date');
  return qry.find();
}
function getPaymentOfInvoicesItems(payment) {
  var qry = new _parse2.default.Query((0, _PaymentOfInvoicesItem2.default)({ id: payment.get('company').id }));
  // qry.equalTo('payment', {className: 'Payment_' + payment.get('company').id, id: payment.id});
  qry.equalTo('payment', _parse2.default.Object.extend('PaymentOfInvoices_' + payment.get('company').id).createWithoutData(payment.id));
  // qry.select([ 'id', 'date', 'payment', 'amount', 'invoice' ]);
  // qry.select(['amount']);
  qry.include(['payment', 'invoice']);
  return qry.find();
}
function getBillPayments(bill) {
  console.assert(bill.get('company').id);
  var qry = new _parse2.default.Query((0, _PaymentOfBillsItem2.default)({ id: bill.get('company').id }));
  // qry.equalTo('bill', {className: 'Bill_' + bill.get('company').id, id: bill.id});
  qry.equalTo('bill', _parse2.default.Object.extend('Bill_' + bill.get('company').id).createWithoutData(bill.id));
  // qry.select([ 'id', 'date', 'payment', 'amount', 'bill' ]);
  // qry.select(['amount']);
  qry.include(['payment', 'bill']);
  qry.descending('date');
  return qry.find();
}
function getPaymentOfBillsItems(payment) {
  var qry = new _parse2.default.Query((0, _PaymentOfBillsItem2.default)({ id: payment.get('company').id }));
  // qry.equalTo('payment', {className: 'Payment_' + payment.get('company').id, id: payment.id});
  qry.equalTo('payment', _parse2.default.Object.extend('PaymentOfBills_' + payment.get('company').id).createWithoutData(payment.id));
  // qry.select([ 'id', 'date', 'payment', 'amount', 'bill' ]);
  // qry.select(['amount']);
  qry.include(['payment', 'bill']);
  return qry.find();
}

function getCompanyPeople(company) {
  return _parse2.default.Promise.when([getCompanyVendors(company), getCompanyCustomers(company), getCompanyEmployees(company)]).then(function (_ref4) {
    var _ref5 = _slicedToArray(_ref4, 3);

    var vendors = _ref5[0];
    var customers = _ref5[1];
    var employees = _ref5[2];
    return (0, _lodash2.default)(vendors, customers, employees);
  });
}

function getCompanyVendors(company) {
  return _loaders.parseTableLoader.load((0, _Vendor2.default)({ id: company.id }));
}

function getCompanyCustomers(company) {
  return _loaders.parseTableLoader.load((0, _Customer2.default)({ id: company.id }));
}

function getCompanyEmployees(company) {
  return _loaders.parseTableLoader.load((0, _Employee2.default)({ id: company.id }));
}

function getSaleItems(sale) {
  var qry = new _parse2.default.Query((0, _SaleItem2.default)({ id: sale.get('company').id }));
  qry.equalTo('sale', _parse2.default.Object.extend('Sale_' + sale.get('company').id).createWithoutData(sale.id));
  qry.include(['sale', 'item']);
  qry.ascending('index');
  return qry.find();

  // return sale.relation('items').query().find().then(objs => objs.map(obj => { obj.__type = 'SaleItem'; return obj; }));
}
function getExpenseItems(expense) {
  var qry = new _parse2.default.Query((0, _ExpenseItem2.default)({ id: expense.get('company').id }));
  qry.equalTo('expense', _parse2.default.Object.extend('Expense_' + expense.get('company').id).createWithoutData(expense.id));
  qry.include(['expense']);
  qry.ascending('index');
  return qry.find();

  // return expense.relation('items').query().find().then(objs => objs.map(obj => { obj.__type = 'ExpenseItem'; return obj; }));
}

function getChartAccountList() {
  return Object.keys(_accounts2.default).reduce(function (accounts, code) {
    accounts.push(_accounts2.default[code]);
    return accounts;
  }, []);
}

function queryOpenInvoices(company, _ref6) {
  var from = _ref6.from;

  var Type = (0, _Invoice2.default)({ id: company.id });

  function getQuery() {
    var query = new _parse2.default.Query(Type);

    query.greaterThanOrEqualTo('date', from ? new Date(from) : (0, _moment2.default)().subtract(365, 'days').toDate());
    query.greaterThan('balanceDue', 0.0);
    return query;
  }

  return getQuery().find();
}

function queryCustomerOpenInvoices(company, _ref7) {
  var from = _ref7.from;
  var id = _ref7.id;

  var Type = (0, _Invoice2.default)({ id: company.id });

  function getQuery() {
    var query = new _parse2.default.Query(Type);

    query.equalTo('customer', _parse2.default.Object.extend('Customer_' + company.id).createWithoutData(id));

    if (from) {
      query.greaterThanOrEqualTo('date', new Date(from));
    }

    query.greaterThan('balanceDue', 0.0);
    return query;
  }

  return getQuery().find();
}

function querySalesRecentlyPaid(company, _ref8) {
  var from = _ref8.from;


  function getSalesQuery() {
    var Type = (0, _Sale2.default)({ id: company.id });
    var query = new _parse2.default.Query(Type);
    query.greaterThanOrEqualTo('date', from ? new Date(from) : (0, _moment2.default)().subtract(_constants.DEFAULT_RECENT_DAYS, 'days').toDate());
    return query;
  }

  function getPaymentsOfInvoicesQuery() {
    var Type = (0, _PaymentOfInvoices2.default)({ id: company.id });
    var query = new _parse2.default.Query(Type);
    query.greaterThanOrEqualTo('date', from ? new Date(from) : (0, _moment2.default)().subtract(_constants.DEFAULT_RECENT_DAYS, 'days').toDate());
    return query;
  }

  return _parse2.default.Promise.when([getSalesQuery().find(), getPaymentsOfInvoicesQuery().find()]).then(function (_ref9) {
    var _ref10 = _slicedToArray(_ref9, 2);

    var sales = _ref10[0];
    var payments = _ref10[1];
    return { sales: sales, payments: payments };
  });
}

function queryOverdueInvoices(company, _ref11) {
  var from = _ref11.from;

  var Type = (0, _Invoice2.default)({ id: company.id });

  function getQuery() {
    var query = new _parse2.default.Query(Type);

    query.greaterThanOrEqualTo('date', from ? new Date(from) : (0, _moment2.default)().subtract(365, 'days').toDate());
    query.greaterThan('balanceDue', 0.0);
    query.lessThan('dueDate', (0, _moment2.default)().toDate());
    return query;
  }

  return getQuery().find();
}
function queryCustomerOverdueInvoices(company, _ref12) {
  var from = _ref12.from;
  var id = _ref12.id;

  var Type = (0, _Invoice2.default)({ id: company.id });

  function getQuery() {
    var query = new _parse2.default.Query(Type);

    query.equalTo('customer', _parse2.default.Object.extend('Customer_' + company.id).createWithoutData(id));

    if (from) {
      query.greaterThanOrEqualTo('date', new Date(from));
    }

    query.greaterThan('balanceDue', 0.0);
    query.lessThan('dueDate', (0, _moment2.default)().toDate());
    return query;
  }

  return getQuery().find();
}

function queryInvoices(company, _ref13) {
  var offset = _ref13.offset;
  var limit = _ref13.limit;
  var type = _ref13.type;
  var status = _ref13.status;
  var from = _ref13.from;
  var to = _ref13.to;
  var _ref13$sortKey = _ref13.sortKey;
  var sortKey = _ref13$sortKey === undefined ? 'date' : _ref13$sortKey;
  var _ref13$sortDir = _ref13.sortDir;
  var sortDir = _ref13$sortDir === undefined ? -1 : _ref13$sortDir;
  var customer = _ref13.customer;
  var last365Days = arguments.length <= 2 || arguments[2] === undefined ? true : arguments[2];

  var Type = (0, _Invoice2.default)({ id: company.id });

  if (type !== 'invoices' && type !== 'open' && type !== 'overdue' && type !== 'recent' && type !== 'ALL') {
    return Promise.resolve({ count: 0, results: [] });
  }

  function getQuery() {
    var doSort = arguments.length <= 0 || arguments[0] === undefined ? true : arguments[0];

    var query = new _parse2.default.Query(Type);
    // query[ sortDir === -1 ? 'descending' : 'ascending' ](
    //   sortDir === -1 && sortKey !== 'date' ? `${sortKey},date` : sortKey);
    // if(sortDir !== -1 && sortKey !== 'date'){
    //   query.addDescending('date');
    // }
    switch (sortKey && doSort) {
      case 'date':
        query[sortDir === -1 ? 'descending' : 'ascending']( /*sortDir === -1 ? 'date,balanceDue,total' : */'date');
        // if(sortKey === 1){
        //   query.addDescending('balanceDue');
        //   query.addDescending('total');
        // }
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
          // query.addDescending('total');
          query.addDescending('date');
        }
        break;
      case 'total':
        query[sortDir === -1 ? 'descending' : 'ascending'](sortDir === -1 ? 'total,date' : 'total');
        if (sortKey === 1) {
          // query.addDescending('balanceDue');
          query.addDescending('date');
        }
        break;
    }
    switch (status) {
      case 'closed':
        query.equalTo('balanceDue', 0.0);
        break;

      case 'open':
        query.greaterThan('balanceDue', 0.0);
        // query.greaterThan('dueDate', new Date());
        break;

      case 'overdue':
        query.greaterThan('balanceDue', 0.0);
        query.lessThan('dueDate', (0, _moment2.default)().toDate());
        break;
    }
    if (customer) {
      query.equalTo('customer', _parse2.default.Object.extend('Customer_' + company.id).createWithoutData(customer));
    }
    if (!from && !to) {
      last365Days && query.greaterThanOrEqualTo('date', (0, _moment2.default)().subtract(365, 'days').startOf('day').toDate());
    } else {
      to && query.lessThanOrEqualTo('date', new Date(to));
      from && query.greaterThanOrEqualTo('date', new Date(from));
    }
    return query;
  }

  return Promise.all([new Promise(function (resolve) {
    var count = 0;
    var sumOfTotals = 0.0;
    var sumOfBalances = 0.0;

    getQuery(false).each(function (obj) {
      count += 1;
      sumOfTotals += obj.get('total');
      sumOfBalances += obj.get('balanceDue');
    }, {
      success: function success() {
        resolve({ count: count, sumOfTotals: sumOfTotals, sumOfBalances: sumOfBalances });
      },

      error: function error(_error) {
        reject(_error);
      }
    });
  }), function () {
    var q = getQuery();
    // q.skip(offset);
    q.limit(offset + limit);
    return q.find();
  }()]).then(function (_ref14) {
    var _ref15 = _slicedToArray(_ref14, 2);

    var _ref15$ = _ref15[0];
    var count = _ref15$.count;
    var sumOfTotals = _ref15$.sumOfTotals;
    var sumOfBalances = _ref15$.sumOfBalances;
    var results = _ref15[1];
    return { count: count, sumOfTotals: sumOfTotals, sumOfBalances: sumOfBalances, results: results };
  });
}
function querySales(company, _ref16) {
  var offset = _ref16.offset;
  var limit = _ref16.limit;
  var type = _ref16.type;
  var from = _ref16.from;
  var to = _ref16.to;
  var _ref16$sortKey = _ref16.sortKey;
  var sortKey = _ref16$sortKey === undefined ? 'date' : _ref16$sortKey;
  var _ref16$sortDir = _ref16.sortDir;
  var sortDir = _ref16$sortDir === undefined ? -1 : _ref16$sortDir;
  var customer = _ref16.customer;
  var last365Days = arguments.length <= 2 || arguments[2] === undefined ? true : arguments[2];

  var Type = (0, _Sale2.default)({ id: company.id });

  if (type !== 'sales' && type !== 'recent' && type !== 'money' && type !== 'ALL') {
    return Promise.resolve({ count: 0, results: [] });
  }

  function getQuery() {
    var doSort = arguments.length <= 0 || arguments[0] === undefined ? true : arguments[0];

    var query = new _parse2.default.Query(Type);
    // query[ sortDir === -1 ? 'descending' : 'ascending' ](
    //   sortDir === -1 && sortKey !== 'date' ? `${sortKey},date` : sortKey);
    // if(sortDir !== -1 && sortKey !== 'date'){
    //   query.addDescending('date');
    // }
    switch (sortKey && doSort) {
      case 'date':
        query[sortDir === -1 ? 'descending' : 'ascending']( /*sortDir === -1 ? 'date,balanceDue,total' : */'date');
        // if(sortKey === 1){
        //   query.addDescending('balanceDue');
        //   query.addDescending('total');
        // }
        break;
      case 'balanceDue':
        query[sortDir === -1 ? 'descending' : 'ascending'](sortDir === -1 ? 'balanceDue,date' : 'balanceDue');
        if (sortKey === 1) {
          // query.addDescending('total');
          query.addDescending('date');
        }
        break;
      case 'total':
        query[sortDir === -1 ? 'descending' : 'ascending'](sortDir === -1 ? 'total,date' : 'total');
        if (sortKey === 1) {
          // query.addDescending('balanceDue');
          query.addDescending('date');
        }
        break;
    }
    if (customer) {
      query.equalTo('customer', _parse2.default.Object.extend('Customer_' + company.id).createWithoutData(customer));
    }
    if (!from && !to) {
      last365Days && query.greaterThanOrEqualTo('date', (0, _moment2.default)().subtract(365, 'days').startOf('day').toDate());
    } else {
      to && query.lessThanOrEqualTo('date', new Date(to));
      from && query.greaterThanOrEqualTo('date', new Date(from));
    }
    return query;
  }

  return Promise.all([new Promise(function (resolve) {
    var count = 0;
    var sumOfTotals = 0.0;

    getQuery(false).each(function (obj) {
      count += 1;
      sumOfTotals += obj.get('total');
    }, {
      success: function success() {
        resolve({ count: count, sumOfTotals: sumOfTotals });
      },

      error: function error(_error2) {
        reject(_error2);
      }
    });
  }), function () {
    var q = getQuery();
    // q.skip(offset);
    q.limit(offset + limit);
    return q.find();
  }()]).then(function (_ref17) {
    var _ref18 = _slicedToArray(_ref17, 2);

    var _ref18$ = _ref18[0];
    var count = _ref18$.count;
    var sumOfTotals = _ref18$.sumOfTotals;
    var results = _ref18[1];
    return { count: count, sumOfTotals: sumOfTotals, results: results };
  });
}
function queryPaymentsOfInvoices(company, _ref19) {
  var offset = _ref19.offset;
  var limit = _ref19.limit;
  var type = _ref19.type;
  var from = _ref19.from;
  var to = _ref19.to;
  var _ref19$sortKey = _ref19.sortKey;
  var sortKey = _ref19$sortKey === undefined ? 'date' : _ref19$sortKey;
  var _ref19$sortDir = _ref19.sortDir;
  var sortDir = _ref19$sortDir === undefined ? -1 : _ref19$sortDir;
  var customer = _ref19.customer;
  var last365Days = arguments.length <= 2 || arguments[2] === undefined ? true : arguments[2];

  var Type = (0, _PaymentOfInvoices2.default)({ id: company.id });

  if (type !== 'payments' && type !== 'money' && type !== 'ALL') {
    return Promise.resolve({ count: 0, results: [] });
  }

  function getQuery() {
    var doSort = arguments.length <= 0 || arguments[0] === undefined ? true : arguments[0];

    var query = new _parse2.default.Query(Type);
    // query[ sortDir === -1 ? 'descending' : 'ascending' ](
    //   sortDir === -1 && sortKey !== 'date' ? `${sortKey},date` : sortKey);
    // if(sortDir !== -1 && sortKey !== 'date'){
    //   query.addDescending('date');
    // }
    switch (sortKey && doSort) {
      case 'date':
        query[sortDir === -1 ? 'descending' : 'ascending']( /*sortDir === -1 ? 'date,balanceDue,total' : */'date');
        // if(sortKey === 1){
        //   query.addDescending('balanceDue');
        //   query.addDescending('total');
        // }
        break;
      case 'balanceDue':
        query[sortDir === -1 ? 'descending' : 'ascending'](sortDir === -1 ? 'balanceDue,date' : 'balanceDue');
        if (sortKey === 1) {
          // query.addDescending('total');
          query.addDescending('date');
        }
        break;
      case 'total':
        query[sortDir === -1 ? 'descending' : 'ascending'](sortDir === -1 ? 'total,date' : 'total');
        if (sortKey === 1) {
          // query.addDescending('balanceDue');
          query.addDescending('date');
        }
        break;
    }
    // TODO: query customers on items using matchesKeyInQuery
    if (customer) {
      query.equalTo('customer', _parse2.default.Object.extend('Customer_' + company.id).createWithoutData(customer));
    }
    // if(customer){
    //
    //   function getItemsMatchingCustomerQuery(id) {
    //
    //     const query = new Parse.Query(`PaymentItem_${company.id}`);
    //     query.matchesQuery(
    //       'invoice', getCustomerInvoicesQuery()
    //     );
    //     query.limit(100000);
    //     return query;
    //
    //     function getCustomerInvoicesQuery() {
    //       const query = new Parse.Query(`Invoice_${company.id}`);
    //       query.equalTo('customer',
    //         Parse.Object.extend(`Customer_${company.id}`).createWithoutData(id));
    //       query.limit(100000);
    //       return query;
    //     }
    //   }
    //
    //   query.matchesQuery(
    //     'items', getItemsMatchingCustomerQuery(customer)
    //   );
    // }
    if (!from && !to) {
      last365Days && query.greaterThanOrEqualTo('date', (0, _moment2.default)().subtract(365, 'days').startOf('day').toDate());
    } else {
      to && query.lessThanOrEqualTo('date', new Date(to));
      from && query.greaterThanOrEqualTo('date', new Date(from));
    }
    return query;
  }

  return Promise.all([new Promise(function (resolve) {
    var count = 0;
    var sumOfTotals = 0.0;
    var sumOfCredits = 0.0;

    getQuery(false).each(function (obj) {
      count += 1;
      sumOfTotals += obj.get('amountReceived');
      sumOfCredits += obj.get('amountToCredit');
    }, {
      success: function success() {
        resolve({ count: count, sumOfTotals: sumOfTotals, sumOfCredits: sumOfCredits });
      },

      error: function error(_error3) {
        reject(_error3);
      }
    });
  }), function () {
    var q = getQuery();
    // q.skip(offset);
    q.limit(offset + limit);
    return q.find();
  }()]).then(function (_ref20) {
    var _ref21 = _slicedToArray(_ref20, 2);

    var _ref21$ = _ref21[0];
    var count = _ref21$.count;
    var sumOfTotals = _ref21$.sumOfTotals;
    var sumOfCredits = _ref21$.sumOfCredits;
    var results = _ref21[1];
    return { count: count, sumOfTotals: sumOfTotals, sumOfCredits: sumOfCredits, results: results };
  });
}

function customersQueryInvoices(company, _ref22) {
  var offset = _ref22.offset;
  var limit = _ref22.limit;
  var type = _ref22.type;
  var status = _ref22.status;
  var from = _ref22.from;
  var to = _ref22.to;
  var _ref22$sortKey = _ref22.sortKey;
  var sortKey = _ref22$sortKey === undefined ? 'date' : _ref22$sortKey;
  var _ref22$sortDir = _ref22.sortDir;
  var sortDir = _ref22$sortDir === undefined ? -1 : _ref22$sortDir;
  var last365Days = arguments.length <= 2 || arguments[2] === undefined ? false : arguments[2];

  var Type = (0, _Invoice2.default)({ id: company.id });

  if (type !== 'invoices' && type !== 'recent' && type !== 'ALL') {
    return Promise.resolve({ count: 0, results: [] });
  }

  function aggregateResult(results) {
    var count = 0;
    var xs = (0, _lodash4.default)((0, _lodash8.default)(results, function (obj) {
      return obj.get('customer').id;
    }), function (objs) {
      count++;
      return objs[0].get('customer') /*.fetch().then(obj => {
                                     obj.__type = 'Customer';
                                     return obj;
                                     })*/;
    });
    return {
      results: _parse2.default.Object.fetchAllIfNeeded(xs),
      count: count
    };
  }

  function getQuery() {
    var query = new _parse2.default.Query(Type);
    switch (status) {
      case 'closed':
        query.equalTo('balanceDue', 0.0);
        break;

      case 'open':
        query.greaterThan('balanceDue', 0.0);
        break;

      case 'overdue':
        query.greaterThan('balanceDue', 0.0);
        query.lessThan('dueDate', (0, _moment2.default)().toDate());
        break;
    }

    if (!from && !to) {
      last365Days && query.greaterThanOrEqualTo('date', (0, _moment2.default)().subtract(365, 'days').startOf('day').toDate());
    } else {
      to && query.lessThanOrEqualTo('date', new Date(to));
      from && query.greaterThanOrEqualTo('date', new Date(from));
    }
    return query;
  }

  return Promise.all([function () {
    var q = getQuery();
    // q.limit(offset + limit);
    q.limit(100000);
    return q.find();
  }()]).then(function (_ref23) {
    var _ref24 = _slicedToArray(_ref23, 1);

    var results = _ref24[0];
    return _extends({}, aggregateResult(results));
  });
}
function customersQuerySales(company, _ref25) {
  var offset = _ref25.offset;
  var limit = _ref25.limit;
  var type = _ref25.type;
  var from = _ref25.from;
  var to = _ref25.to;
  var _ref25$sortKey = _ref25.sortKey;
  var sortKey = _ref25$sortKey === undefined ? 'date' : _ref25$sortKey;
  var _ref25$sortDir = _ref25.sortDir;
  var sortDir = _ref25$sortDir === undefined ? -1 : _ref25$sortDir;
  var last365Days = arguments.length <= 2 || arguments[2] === undefined ? false : arguments[2];

  var Type = (0, _Sale2.default)({ id: company.id });

  if (type !== 'sales' && type !== 'recent' && type !== 'money' && type !== 'ALL') {
    return Promise.resolve({ count: 0, results: [] });
  }

  function aggregateResult(results) {
    var count = 0;
    var xs = (0, _lodash4.default)((0, _lodash8.default)(results, function (obj) {
      return obj.get('customer').id;
    }), function (objs) {
      count++;
      return objs[0].get('customer') /*.fetch().then(obj => {
                                     obj.__type = 'Customer';
                                     return obj;
                                     })*/;
    });
    return {
      results: _parse2.default.Object.fetchAllIfNeeded(xs),
      count: count
    };
  }

  function getQuery() {
    var query = new _parse2.default.Query(Type);

    if (!from && !to) {
      last365Days && query.greaterThanOrEqualTo('date', (0, _moment2.default)().subtract(365, 'days').startOf('day').toDate());
    } else {
      to && query.lessThanOrEqualTo('date', new Date(to));
      from && query.greaterThanOrEqualTo('date', new Date(from));
    }
    return query;
  }

  return Promise.all([function () {
    var q = getQuery();
    // q.limit(offset + limit);
    q.limit(100000);
    return q.find();
  }()]).then(function (_ref26) {
    var _ref27 = _slicedToArray(_ref26, 1);

    var results = _ref27[0];
    return _extends({}, aggregateResult(results));
  });
}
function customersQueryPaymentsOfInvoices(company, _ref28) {
  var offset = _ref28.offset;
  var limit = _ref28.limit;
  var type = _ref28.type;
  var from = _ref28.from;
  var to = _ref28.to;
  var _ref28$sortKey = _ref28.sortKey;
  var sortKey = _ref28$sortKey === undefined ? 'date' : _ref28$sortKey;
  var _ref28$sortDir = _ref28.sortDir;
  var sortDir = _ref28$sortDir === undefined ? -1 : _ref28$sortDir;
  var last365Days = arguments.length <= 2 || arguments[2] === undefined ? false : arguments[2];

  var Type = (0, _PaymentOfInvoices2.default)({ id: company.id });

  if (type !== 'payments' && type !== 'money' && type !== 'ALL') {
    return Promise.resolve({ count: 0, results: [] });
  }

  function aggregateResult(results) {
    var count = 0;
    var xs = (0, _lodash4.default)((0, _lodash8.default)(results, function (obj) {
      return obj.get('customer').id;
    }), function (objs) {
      count++;
      return objs[0].get('customer') /*.fetch().then(obj => {
                                     obj.__type = 'Customer';
                                     return obj;
                                     })*/;
    });
    return {
      results: _parse2.default.Object.fetchAllIfNeeded(xs),
      count: count
    };
  }

  function getQuery() {
    var query = new _parse2.default.Query(Type);

    if (!from && !to) {
      last365Days && query.greaterThanOrEqualTo('date', (0, _moment2.default)().subtract(365, 'days').startOf('day').toDate());
    } else {
      to && query.lessThanOrEqualTo('date', new Date(to));
      from && query.greaterThanOrEqualTo('date', new Date(from));
    }
    return query;
  }

  return Promise.all([function () {
    var q = getQuery();
    // q.limit(offset + limit);
    q.limit(100000);
    return q.find();
  }()]).then(function (_ref29) {
    var _ref30 = _slicedToArray(_ref29, 1);

    var results = _ref30[0];
    return _extends({}, aggregateResult(results));
  });
}

function queryOpenBills(company, _ref31) {
  var from = _ref31.from;

  var Type = (0, _Bill2.default)({ id: company.id });

  function getQuery() {
    var query = new _parse2.default.Query(Type);

    query.greaterThanOrEqualTo('date', from ? new Date(from) : (0, _moment2.default)().subtract(365, 'days').toDate());
    query.greaterThan('balanceDue', 0.0);
    return query;
  }

  return getQuery().find();
}
function queryVendorOpenBills(company, _ref32) {
  var from = _ref32.from;
  var id = _ref32.id;

  var Type = (0, _Bill2.default)({ id: company.id });

  function getQuery() {
    var query = new _parse2.default.Query(Type);

    query.equalTo('payee', _parse2.default.Object.extend('Vendor_' + company.id).createWithoutData(id));

    if (from) {
      query.greaterThanOrEqualTo('date', new Date(from));
    }

    query.greaterThan('balanceDue', 0.0);
    return query;
  }

  return getQuery().find();
}

function queryExpensesRecentlyPaid(company, _ref33) {
  var from = _ref33.from;


  function getExpensesQuery() {
    var Type = (0, _Expense2.default)({ id: company.id });
    var query = new _parse2.default.Query(Type);
    query.greaterThanOrEqualTo('date', from ? new Date(from) : (0, _moment2.default)().subtract(_constants.DEFAULT_RECENT_DAYS, 'days').toDate());
    return query;
  }

  function getPaymentsOfBillsQuery() {
    var Type = (0, _PaymentOfBills2.default)({ id: company.id });
    var query = new _parse2.default.Query(Type);
    query.greaterThanOrEqualTo('date', from ? new Date(from) : (0, _moment2.default)().subtract(_constants.DEFAULT_RECENT_DAYS, 'days').toDate());
    return query;
  }

  return _parse2.default.Promise.when([getExpensesQuery().find(), getPaymentsOfBillsQuery().find()]).then(function (_ref34) {
    var _ref35 = _slicedToArray(_ref34, 2);

    var expenses = _ref35[0];
    var payments = _ref35[1];
    return { expenses: expenses, payments: payments };
  });
}

function queryOverdueBills(company, _ref36) {
  var from = _ref36.from;

  var Type = (0, _Bill2.default)({ id: company.id });

  function getQuery() {
    var query = new _parse2.default.Query(Type);

    query.greaterThanOrEqualTo('date', from ? new Date(from) : (0, _moment2.default)().subtract(365, 'days').toDate());
    query.greaterThan('balanceDue', 0.0);
    query.lessThan('dueDate', (0, _moment2.default)().toDate());
    return query;
  }

  return getQuery().find();
}
function queryVendorOverdueBills(company, _ref37) {
  var from = _ref37.from;
  var id = _ref37.id;

  var Type = (0, _Bill2.default)({ id: company.id });

  function getQuery() {
    var query = new _parse2.default.Query(Type);

    query.equalTo('payee', _parse2.default.Object.extend('Vendor_' + company.id).createWithoutData(id));

    if (from) {
      query.greaterThanOrEqualTo('date', new Date(from));
    }

    query.greaterThan('balanceDue', 0.0);
    query.lessThan('dueDate', (0, _moment2.default)().toDate());
    return query;
  }

  return getQuery().find();
}

function queryExpenses(company, _ref38) {
  var offset = _ref38.offset;
  var limit = _ref38.limit;
  var type = _ref38.type;
  var from = _ref38.from;
  var to = _ref38.to;
  var _ref38$sortKey = _ref38.sortKey;
  var sortKey = _ref38$sortKey === undefined ? 'date' : _ref38$sortKey;
  var _ref38$sortDir = _ref38.sortDir;
  var sortDir = _ref38$sortDir === undefined ? -1 : _ref38$sortDir;
  var payee = _ref38.payee;
  var customer = _ref38.customer;
  var last365Days = arguments.length <= 2 || arguments[2] === undefined ? true : arguments[2];

  var Type = (0, _Expense2.default)({ id: company.id });

  if (type !== 'expenses' && type !== 'recent' && type !== 'money' && type !== 'ALL') {
    return Promise.resolve({ count: 0, results: [] });
  }

  function getQuery() {
    var doSort = arguments.length <= 0 || arguments[0] === undefined ? true : arguments[0];

    var query = new _parse2.default.Query(Type);
    // query[ sortDir === -1 ? 'descending' : 'ascending' ](
    //   sortDir === -1 && sortKey !== 'date' ? `${sortKey},date` : sortKey);
    // if(sortDir !== -1 && sortKey !== 'date'){
    //   query.addDescending('date');
    // }
    switch (sortKey && doSort) {
      case 'date':
        query[sortDir === -1 ? 'descending' : 'ascending']( /*sortDir === -1 ? 'date,balanceDue,total' : */'date');
        // if(sortKey === 1){
        //   query.addDescending('balanceDue');
        //   query.addDescending('total');
        // }
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
          // query.addDescending('total');
          query.addDescending('date');
        }
        break;
      case 'total':
        query[sortDir === -1 ? 'descending' : 'ascending'](sortDir === -1 ? 'total,date' : 'total');
        if (sortKey === 1) {
          // query.addDescending('balanceDue');
          query.addDescending('date');
        }
        break;
    }
    if (payee) {
      query.equalTo('vendor', _parse2.default.Object.extend('Vendor_' + company.id).createWithoutData(payee));
    }
    if (customer) {
      query.equalTo('customer', _parse2.default.Object.extend('Customer_' + company.id).createWithoutData(customer));
    }
    if (!from && !to) {
      last365Days && query.greaterThanOrEqualTo('date', (0, _moment2.default)().subtract(365, 'days').startOf('day').toDate());
    } else {
      to && query.lessThanOrEqualTo('date', new Date(to));
      from && query.greaterThanOrEqualTo('date', new Date(from));
    }
    return query;
  }

  return Promise.all([new Promise(function (resolve) {
    var count = 0;
    var sumOfTotals = 0.0;

    getQuery(false).each(function (obj) {
      count += 1;
      sumOfTotals += obj.get('total');
    }, {
      success: function success() {
        resolve({ count: count, sumOfTotals: sumOfTotals });
      },

      error: function error(_error4) {
        reject(_error4);
      }
    });
  }), function () {
    var q = getQuery();
    // q.skip(offset);
    q.limit(offset + limit);
    return q.find();
  }()]).then(function (_ref39) {
    var _ref40 = _slicedToArray(_ref39, 2);

    var _ref40$ = _ref40[0];
    var count = _ref40$.count;
    var sumOfTotals = _ref40$.sumOfTotals;
    var results = _ref40[1];
    return { count: count, sumOfTotals: sumOfTotals, results: results };
  });
}

function queryBills(company, _ref41) {
  var offset = _ref41.offset;
  var limit = _ref41.limit;
  var type = _ref41.type;
  var status = _ref41.status;
  var from = _ref41.from;
  var to = _ref41.to;
  var _ref41$sortKey = _ref41.sortKey;
  var sortKey = _ref41$sortKey === undefined ? 'date' : _ref41$sortKey;
  var _ref41$sortDir = _ref41.sortDir;
  var sortDir = _ref41$sortDir === undefined ? -1 : _ref41$sortDir;
  var payee = _ref41.payee;
  var customer = _ref41.customer;
  var last365Days = arguments.length <= 2 || arguments[2] === undefined ? true : arguments[2];

  var Type = (0, _Bill2.default)({ id: company.id });

  if (customer) {
    return Promise.resolve({ count: 0, results: [] });
  }

  if (type !== 'bills' && type !== 'open' && type !== 'overdue' && type !== 'recent' && type !== 'ALL') {
    return Promise.resolve({ count: 0, results: [] });
  }

  function getQuery() {
    var doSort = arguments.length <= 0 || arguments[0] === undefined ? true : arguments[0];

    var query = new _parse2.default.Query(Type);
    // query[ sortDir === -1 ? 'descending' : 'ascending' ](
    //   sortDir === -1 && sortKey !== 'date' ? `${sortKey},date` : sortKey);
    // if(sortDir !== -1 && sortKey !== 'date'){
    //   query.addDescending('date');
    // }
    switch (sortKey && doSort) {
      case 'date':
        query[sortDir === -1 ? 'descending' : 'ascending']( /*sortDir === -1 ? 'date,balanceDue,total' : */'date');
        // if(sortKey === 1){
        //   query.addDescending('balanceDue');
        //   query.addDescending('total');
        // }
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
          // query.addDescending('total');
          query.addDescending('date');
        }
        break;
      case 'total':
        query[sortDir === -1 ? 'descending' : 'ascending'](sortDir === -1 ? 'total,date' : 'total');
        if (sortKey === 1) {
          // query.addDescending('balanceDue');
          query.addDescending('date');
        }
        break;
    }
    switch (status) {
      case 'closed':
        query.equalTo('balanceDue', 0.0);
        break;

      case 'open':
        query.greaterThan('balanceDue', 0.0);
        // query.greaterThan('dueDate', new Date());
        break;

      case 'overdue':
        query.greaterThan('balanceDue', 0.0);
        query.lessThan('dueDate', (0, _moment2.default)().toDate());
        break;
    }
    if (payee) {
      query.equalTo('payee', _parse2.default.Object.extend('Vendor_' + company.id).createWithoutData(payee));
    }
    if (!from && !to) {
      last365Days && query.greaterThanOrEqualTo('date', (0, _moment2.default)().subtract(365, 'days').startOf('day').toDate());
    } else {
      to && query.lessThanOrEqualTo('date', new Date(to));
      from && query.greaterThanOrEqualTo('date', new Date(from));
    }
    return query;
  }

  return Promise.all([new Promise(function (resolve) {
    var count = 0;
    var sumOfTotals = 0.0;
    var sumOfBalances = 0.0;

    getQuery(false).each(function (obj) {
      count += 1;
      sumOfTotals += obj.get('total');
      sumOfBalances += obj.get('balanceDue');
    }, {
      success: function success() {
        resolve({ count: count, sumOfTotals: sumOfTotals, sumOfBalances: sumOfBalances });
      },

      error: function error(_error5) {
        reject(_error5);
      }
    });
  }), function () {
    var q = getQuery();
    // q.skip(offset);
    q.limit(offset + limit);
    return q.find();
  }()]).then(function (_ref42) {
    var _ref43 = _slicedToArray(_ref42, 2);

    var _ref43$ = _ref43[0];
    var count = _ref43$.count;
    var sumOfTotals = _ref43$.sumOfTotals;
    var sumOfBalances = _ref43$.sumOfBalances;
    var results = _ref43[1];
    return { count: count, sumOfTotals: sumOfTotals, sumOfBalances: sumOfBalances, results: results };
  });
}

function queryPaymentsOfBills(company, _ref44) {
  var offset = _ref44.offset;
  var limit = _ref44.limit;
  var type = _ref44.type;
  var from = _ref44.from;
  var to = _ref44.to;
  var _ref44$sortKey = _ref44.sortKey;
  var sortKey = _ref44$sortKey === undefined ? 'date' : _ref44$sortKey;
  var _ref44$sortDir = _ref44.sortDir;
  var sortDir = _ref44$sortDir === undefined ? -1 : _ref44$sortDir;
  var payee = _ref44.payee;
  var customer = _ref44.customer;
  var last365Days = arguments.length <= 2 || arguments[2] === undefined ? true : arguments[2];

  var Type = (0, _PaymentOfBills2.default)({ id: company.id });

  if (customer) {
    return Promise.resolve({ count: 0, results: [] });
  }

  if (type !== 'payments' && type !== 'money' && type !== 'ALL') {
    return Promise.resolve({ count: 0, results: [] });
  }

  function getQuery() {
    var doSort = arguments.length <= 0 || arguments[0] === undefined ? true : arguments[0];

    var query = new _parse2.default.Query(Type);
    // query[ sortDir === -1 ? 'descending' : 'ascending' ](
    //   sortDir === -1 && sortKey !== 'date' ? `${sortKey},date` : sortKey);
    // if(sortDir !== -1 && sortKey !== 'date'){
    //   query.addDescending('date');
    // }
    switch (sortKey && doSort) {
      case 'date':
        query[sortDir === -1 ? 'descending' : 'ascending']( /*sortDir === -1 ? 'date,balanceDue,total' : */'date');
        // if(sortKey === 1){
        //   query.addDescending('balanceDue');
        //   query.addDescending('total');
        // }
        break;
      case 'balanceDue':
        query[sortDir === -1 ? 'descending' : 'ascending'](sortDir === -1 ? 'balanceDue,date' : 'balanceDue');
        if (sortKey === 1) {
          // query.addDescending('total');
          query.addDescending('date');
        }
        break;
      case 'total':
        query[sortDir === -1 ? 'descending' : 'ascending'](sortDir === -1 ? 'total,date' : 'total');
        if (sortKey === 1) {
          // query.addDescending('balanceDue');
          query.addDescending('date');
        }
        break;
    }
    // TODO: query customers on items using matchesKeyInQuery
    if (payee) {
      query.equalTo('payee', _parse2.default.Object.extend('Vendor_' + company.id).createWithoutData(payee));
    }
    // if(payee){
    //
    //   function getItemsMatchingVendorQuery(id) {
    //
    //     const query = new Parse.Query(`PaymentItem_${company.id}`);
    //     query.matchesQuery(
    //       'invoice', getVendorBillsQuery()
    //     );
    //     query.limit(100000);
    //     return query;
    //
    //     function getVendorBillsQuery() {
    //       const query = new Parse.Query(`Bill_${company.id}`);
    //       query.equalTo('payee',
    //         Parse.Object.extend(`Vendor_${company.id}`).createWithoutData(id));
    //       query.limit(100000);
    //       return query;
    //     }
    //   }
    //
    //   query.matchesQuery(
    //     'items', getItemsMatchingVendorQuery(payee)
    //   );
    // }
    if (!from && !to) {
      last365Days && query.greaterThanOrEqualTo('date', (0, _moment2.default)().subtract(365, 'days').startOf('day').toDate());
    } else {
      to && query.lessThanOrEqualTo('date', new Date(to));
      from && query.greaterThanOrEqualTo('date', new Date(from));
    }
    return query;
  }

  return Promise.all([new Promise(function (resolve) {
    var count = 0;
    var sumOfTotals = 0.0;
    var sumOfCredits = 0.0;

    getQuery(false).each(function (obj) {
      count += 1;
      sumOfTotals += obj.get('amountReceived');
      sumOfCredits += obj.get('amountToCredit');
    }, {
      success: function success() {
        resolve({ count: count, sumOfTotals: sumOfTotals, sumOfCredits: sumOfCredits });
      },

      error: function error(_error6) {
        reject(_error6);
      }
    });
  }), function () {
    var q = getQuery();
    // q.skip(offset);
    q.limit(offset + limit);
    return q.find();
  }()]).then(function (_ref45) {
    var _ref46 = _slicedToArray(_ref45, 2);

    var _ref46$ = _ref46[0];
    var count = _ref46$.count;
    var sumOfTotals = _ref46$.sumOfTotals;
    var sumOfCredits = _ref46$.sumOfCredits;
    var results = _ref46[1];
    return { count: count, sumOfTotals: sumOfTotals, sumOfCredits: sumOfCredits, results: results };
  });
}

function getVendorOpenBills(company, _ref47) {
  var id = _ref47.id;

  var Type = (0, _Bill2.default)({ id: company.id });
  var query = new _parse2.default.Query(Type);
  query.equalTo('payee', _parse2.default.Object.extend('Vendor_' + company.id).createWithoutData(id));
  query.greaterThan('balanceDue', 0.0);
  query.limit(100000);
  return query.find();
}

function getPaymentOfBillsFromPaymentOfBillsItem(company, id) {
  var Type = (0, _PaymentOfBillsItem2.default)({ id: company.id });
  var query = new _parse2.default.Query(Type);
  query.include(['payment']);
  return query.get(id).then(function (obj) {
    var p = obj.get('payment');
    p.__type = 'PaymentOfBills';
    return p;
  });
}

function getCustomerOpenInvoices(company, _ref48) {
  var id = _ref48.id;

  var Type = (0, _Invoice2.default)({ id: company.id });
  var query = new _parse2.default.Query(Type);
  query.equalTo('customer', _parse2.default.Object.extend('Customer_' + company.id).createWithoutData(id));
  query.greaterThan('balanceDue', 0.0);
  query.limit(100000);
  return query.find();
}

function getPaymentOfInvoicesFromPaymentOfInvoicesItem(company, id) {
  var Type = (0, _PaymentOfInvoicesItem2.default)({ id: company.id });
  var query = new _parse2.default.Query(Type);
  query.include(['payment']);
  return query.get(id).then(function (obj) {
    var p = obj.get('payment');
    p.__type = 'PaymentOfInvoices';
    return p;
  });
}

function vendorsQueryExpenses(company, _ref49) {
  var offset = _ref49.offset;
  var limit = _ref49.limit;
  var type = _ref49.type;
  var from = _ref49.from;
  var to = _ref49.to;
  var _ref49$sortKey = _ref49.sortKey;
  var sortKey = _ref49$sortKey === undefined ? 'date' : _ref49$sortKey;
  var _ref49$sortDir = _ref49.sortDir;
  var sortDir = _ref49$sortDir === undefined ? -1 : _ref49$sortDir;
  var last365Days = arguments.length <= 2 || arguments[2] === undefined ? false : arguments[2];

  var Type = (0, _Expense2.default)({ id: company.id });

  if (type !== 'expenses' && type !== 'recent' && type !== 'money' && type !== 'ALL') {
    return Promise.resolve({ count: 0, results: [] });
  }

  function getPayee(obj) {
    if (obj.has('vendor')) {
      return obj.get('vendor');
    }

    if (obj.has('customer')) {
      return obj.get('customer');
    }

    return undefined;
  }

  function aggregateResult(results) {
    var count = 0;
    var xs = (0, _lodash4.default)((0, _lodash8.default)(results, function (obj) {
      return getPayee(obj).id;
    }), function (objs) {
      var expense = objs[0];
      var payee = getPayee(expense);
      if (expense.get('payeeType') === 'Vendor' || expense.get('payeeType') === 2) {
        count++;
        return payee /*.fetch().then(obj => {
                     obj.__type = 'Vendor';
                     return obj;
                     })*/;
      }

      return null;
    });
    return {
      results: _parse2.default.Object.fetchAllIfNeeded((0, _lodash6.default)(xs)),
      count: count
    };
  }

  function getQuery() {
    var query = new _parse2.default.Query(Type);

    query.include(['vendor', 'customer']);

    if (!from && !to) {
      last365Days && query.greaterThanOrEqualTo('date', (0, _moment2.default)().subtract(365, 'days').startOf('day').toDate());
    } else {
      to && query.lessThanOrEqualTo('date', new Date(to));
      from && query.greaterThanOrEqualTo('date', new Date(from));
    }
    return query;
  }

  return Promise.all([function () {
    var q = getQuery();
    // q.limit(offset + limit);
    q.limit(100000);
    return q.find();
  }()]).then(function (_ref50) {
    var _ref51 = _slicedToArray(_ref50, 1);

    var results = _ref51[0];
    return _extends({}, aggregateResult(results));
  });
}

function cusomersQueryExpenses(company, _ref52) {
  var offset = _ref52.offset;
  var limit = _ref52.limit;
  var type = _ref52.type;
  var from = _ref52.from;
  var to = _ref52.to;
  var _ref52$sortKey = _ref52.sortKey;
  var sortKey = _ref52$sortKey === undefined ? 'date' : _ref52$sortKey;
  var _ref52$sortDir = _ref52.sortDir;
  var sortDir = _ref52$sortDir === undefined ? -1 : _ref52$sortDir;
  var last365Days = arguments.length <= 2 || arguments[2] === undefined ? false : arguments[2];

  var Type = (0, _Expense2.default)({ id: company.id });

  if (type !== 'expenses' && type !== 'recent' && type !== 'money' && type !== 'ALL') {
    return Promise.resolve({ count: 0, results: [] });
  }

  function aggregateResult(results) {
    var count = 0;
    var xs = (0, _lodash4.default)((0, _lodash8.default)(results, function (obj) {
      return obj.get('payee').id;
    }), function (objs) {
      var expense = objs[0];
      var payee = expense.get('payee');
      if (expense.get('payeeType') === 'Customer' || expense.get('payeeType') === 1) {
        count++;
        return payee /*.fetch().then(obj => {
                     obj.__type = 'Customer';
                     return obj;
                     })*/;
      }

      return null;
    });
    return {
      results: _parse2.default.Object.fetchAllIfNeeded((0, _lodash6.default)(xs)),
      count: count
    };
  }

  function getQuery() {
    var query = new _parse2.default.Query(Type);

    query.include(['payee']);

    if (!from && !to) {
      last365Days && query.greaterThanOrEqualTo('date', (0, _moment2.default)().subtract(365, 'days').startOf('day').toDate());
    } else {
      to && query.lessThanOrEqualTo('date', new Date(to));
      from && query.greaterThanOrEqualTo('date', new Date(from));
    }
    return query;
  }

  return Promise.all([function () {
    var q = getQuery();
    // q.limit(offset + limit);
    q.limit(100000);
    return q.find();
  }()]).then(function (_ref53) {
    var _ref54 = _slicedToArray(_ref53, 1);

    var results = _ref54[0];
    return _extends({}, aggregateResult(results));
  });
}

function vendorsQueryBills(company, _ref55) {
  var offset = _ref55.offset;
  var limit = _ref55.limit;
  var type = _ref55.type;
  var status = _ref55.status;
  var from = _ref55.from;
  var to = _ref55.to;
  var _ref55$sortKey = _ref55.sortKey;
  var sortKey = _ref55$sortKey === undefined ? 'date' : _ref55$sortKey;
  var _ref55$sortDir = _ref55.sortDir;
  var sortDir = _ref55$sortDir === undefined ? -1 : _ref55$sortDir;
  var last365Days = arguments.length <= 2 || arguments[2] === undefined ? false : arguments[2];

  var Type = (0, _Bill2.default)({ id: company.id });

  if (type !== 'bills' && type !== 'recent' && type !== 'ALL') {
    return Promise.resolve({ count: 0, results: [] });
  }

  function aggregateResult(results) {
    var count = 0;
    var xs = (0, _lodash4.default)((0, _lodash8.default)(results, function (obj) {
      return obj.get('payee').id;
    }), function (objs) {
      count++;
      return objs[0].get('payee') /*.fetch().then(obj => {
                                  obj.__type = 'Vendor';
                                  return obj;
                                  })*/;
    });
    return {
      results: _parse2.default.Object.fetchAllIfNeeded(xs),
      count: count
    };
  }

  function getQuery() {
    var query = new _parse2.default.Query(Type);

    switch (status) {
      case 'closed':
        query.equalTo('balanceDue', 0.0);
        break;

      case 'open':
        query.greaterThan('balanceDue', 0.0);
        break;

      case 'overdue':
        query.greaterThan('balanceDue', 0.0);
        query.lessThan('dueDate', (0, _moment2.default)().toDate());
        break;
    }
    if (!from && !to) {
      last365Days && query.greaterThanOrEqualTo('date', (0, _moment2.default)().subtract(365, 'days').startOf('day').toDate());
    } else {
      to && query.lessThanOrEqualTo('date', new Date(to));
      from && query.greaterThanOrEqualTo('date', new Date(from));
    }
    return query;
  }

  return Promise.all([function () {
    var q = getQuery();
    // q.limit(offset + limit);
    q.limit(100000);
    return q.find();
  }()]).then(function (_ref56) {
    var _ref57 = _slicedToArray(_ref56, 1);

    var results = _ref57[0];
    return _extends({}, aggregateResult(results));
  });
}

function vendorsQueryPaymentsOfBills(company, _ref58) {
  var offset = _ref58.offset;
  var limit = _ref58.limit;
  var type = _ref58.type;
  var from = _ref58.from;
  var to = _ref58.to;
  var _ref58$sortKey = _ref58.sortKey;
  var sortKey = _ref58$sortKey === undefined ? 'date' : _ref58$sortKey;
  var _ref58$sortDir = _ref58.sortDir;
  var sortDir = _ref58$sortDir === undefined ? -1 : _ref58$sortDir;
  var last365Days = arguments.length <= 2 || arguments[2] === undefined ? false : arguments[2];

  var Type = (0, _PaymentOfBills2.default)({ id: company.id });

  if (type !== 'payments' && type !== 'money' && type !== 'ALL') {
    return Promise.resolve({ count: 0, results: [] });
  }

  function aggregateResult(results) {
    var count = 0;
    var xs = (0, _lodash4.default)((0, _lodash8.default)(results, function (obj) {
      return obj.get('payee').id;
    }), function (objs) {
      var payee = objs[0].get('payee');
      count++;
      return objs[0].get('payee') /*.fetch().then(obj => {
                                  obj.__type = 'Vendor';
                                  return obj;
                                  })*/;
    });
    return {
      results: _parse2.default.Object.fetchAllIfNeeded(xs),
      count: count
    };
  }

  function getQuery() {
    var query = new _parse2.default.Query(Type);

    if (!from && !to) {
      last365Days && query.greaterThanOrEqualTo('date', (0, _moment2.default)().subtract(365, 'days').startOf('day').toDate());
    } else {
      to && query.lessThanOrEqualTo('date', new Date(to));
      from && query.greaterThanOrEqualTo('date', new Date(from));
    }
    return query;
  }

  return Promise.all([function () {
    var q = getQuery();
    // q.limit(offset + limit);
    q.limit(100000);
    return q.find();
  }()]).then(function (_ref59) {
    var _ref60 = _slicedToArray(_ref59, 1);

    var results = _ref60[0];
    return _extends({}, aggregateResult(results));
  });
}

var User = exports.User = _parse2.default.User;

function getObjectByType(Type, _ref61) {
  var companyId = _ref61.companyId;
  var id = _ref61.id;

  return _loaders.parseIDLoader.load([Type({ id: companyId }), id]);
}

function getObjectsByType(Type, _ref62) {
  var companyId = _ref62.companyId;

  return _loaders.parseTableLoader.load(Type({ id: companyId }));
}

function getTypeById(Type, info) {
  var delimiterPos = info.indexOf(':');
  var id = info.substring(0, delimiterPos);
  var companyId = info.substring(delimiterPos + 1);
  return _loaders.parseIDLoader.load([Type({ id: companyId }), id]);
}

function countByType(Type) {
  return _loaders.parseTableCountLoader.load(Type);
}