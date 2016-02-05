/**
 *  Copyright (c) 2015, Epsilon, SARL.
 *  All rights reserved.
 *
 */


import Parse from 'parse';

import Account from './Account';
import Company from './Company';
import Transaction from './Transaction';
import Operation from './Operation';


import chartOfAccounts from './accounts.json';

import {parseIDLoader, parsePeriodLoader, parseTableLoader,} from './loaders';

export function getViewer() {
  return Parse.User.current();
}

export function getUser(id) {
  return parseIDLoader.load([Parse.User, id]);
}

export function getTransaction(info) {
  const delimiterPos = info.indexOf(':');
  const id = info.substring(0, delimiterPos);
  const companyId = info.substring(delimiterPos + 1);

  return parseIDLoader.load([Transaction({id: companyId}), id]);
}

export function getCompany(id) {
  return parseIDLoader.load([Company, id]);
}

export function getCompanies() {
  return parseTableLoader.load(Company);
}

export function getOperation(info) {
  const delimiterPos = info.indexOf(':');
  const id = info.substring(0, delimiterPos);
  const companyId = info.substring(delimiterPos + 1);

  return parseIDLoader.load([Operation({id: companyId}), id]);
}

export function getAccount(info) {
  const delimiterPos0 = info.indexOf(':');
  const id = info.substring(0, delimiterPos0);

  const rest = info.substring(delimiterPos0 + 1);

  const delimiterPos1 = rest.indexOf(':');

  const companyId = rest.substring(0, delimiterPos1);
  const period = rest.substring(delimiterPos1 + 1);

  return parseIDLoader.load([Account({id: companyId}, period), id]);
}

export function getCompanyAccounts(company, period) {
  return parsePeriodLoader.load([Account({id: company.id}, period), period]);
}

export function getTransactions(company, period) {
  return parsePeriodLoader.load([Transaction({id: company.id}), period]);
}

export function generatePeriod(type, date) {
  switch (type) {
    case 'MONTHLY':

      return 'M' + (date.getMonth() + 1) + '/' + date.getFullYear();

    case 'TRIMESTERLY':

      return 'Q' + Math.ceil((date.getMonth() + 1) / 4) + '/' + date.getFullYear();

    default:

      throw new Error('generatePeriod: invalid periodType ' + type);
  }
}

export function getChartAccountList() {
  return Object.keys(chartOfAccounts).reduce(function (accounts, code) {
    accounts.push(chartOfAccounts[code]);
    return accounts;
  }, []);
}

export const User = Parse.User;
