'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.User = undefined;
exports.getViewer = getViewer;
exports.getUser = getUser;
exports.getTransaction = getTransaction;
exports.getCompany = getCompany;
exports.getCompanies = getCompanies;
exports.getOperation = getOperation;
exports.getAccount = getAccount;
exports.getCompanyAccounts = getCompanyAccounts;
exports.getTransactions = getTransactions;
exports.generatePeriod = generatePeriod;
exports.getChartAccountList = getChartAccountList;

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

var _accounts = require('./accounts.json');

var _accounts2 = _interopRequireDefault(_accounts);

var _loaders = require('./loaders');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function getViewer() {
  return _parse2.default.User.current();
} /**
   *  Copyright (c) 2015, Epsilon, SARL.
   *  All rights reserved.
   *
   */

function getUser(id) {
  return _loaders.parseIDLoader.load([_parse2.default.User, id]);
}

function getTransaction(info) {
  var delimiterPos = info.indexOf(':');
  var id = info.substring(0, delimiterPos);
  var companyId = info.substring(delimiterPos + 1);

  return _loaders.parseIDLoader.load([(0, _Transaction2.default)({ id: companyId }), id]);
}

function getCompany(id) {
  return _loaders.parseIDLoader.load([_Company2.default, id]);
}

function getCompanies() {
  return _loaders.parseTableLoader.load(_Company2.default);
}

function getOperation(info) {
  var delimiterPos = info.indexOf(':');
  var id = info.substring(0, delimiterPos);
  var companyId = info.substring(delimiterPos + 1);

  return _loaders.parseIDLoader.load([(0, _Operation2.default)({ id: companyId }), id]);
}

function getAccount(info) {
  var delimiterPos0 = info.indexOf(':');
  var id = info.substring(0, delimiterPos0);

  var rest = info.substring(delimiterPos0 + 1);

  var delimiterPos1 = rest.indexOf(':');

  var companyId = rest.substring(0, delimiterPos1);
  var period = rest.substring(delimiterPos1 + 1);

  return _loaders.parseIDLoader.load([(0, _Account2.default)({ id: companyId }, period), id]);
}

function getCompanyAccounts(company, period) {
  return _loaders.parsePeriodLoader.load([(0, _Account2.default)({ id: company.id }, period), period]);
}

function getTransactions(company, period) {
  return _loaders.parsePeriodLoader.load([(0, _Transaction2.default)({ id: company.id }), period]);
}

function generatePeriod(type, date) {
  switch (type) {
    case 'MONTHLY':

      return 'M' + (date.getMonth() + 1) + '/' + date.getFullYear();

    case 'TRIMESTERLY':

      return 'Q' + Math.ceil((date.getMonth() + 1) / 4) + '/' + date.getFullYear();

    default:

      throw new Error('generatePeriod: invalid periodType ' + type);
  }
}

function getChartAccountList() {
  return Object.keys(_accounts2.default).reduce(function (accounts, code) {
    accounts.push(_accounts2.default[code]);
    return accounts;
  }, []);
}

var User = exports.User = _parse2.default.User;