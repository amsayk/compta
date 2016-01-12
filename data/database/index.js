/**
 *  Copyright (c) 2015, Epsilon, SARL.
 *  All rights reserved.
 *
 */


import Parse from 'parse/node';

import {
  Transaction,
  Operation,
} from './account';

export const getUser = function(id) {
  const query = new Parse.Query(Parse.User);
  return query.get(id);
};

export const getTransaction = function(id) {
  const query = new Parse.Query(Transaction);
  return query.get(id);
};

export const getOperation = function(id) {
  const query = new Parse.Query(Operation);
  return query.get(id);
};

export const User = Parse.User;

export * from './account';
