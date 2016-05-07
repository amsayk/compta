import Parse from 'parse';

export const Company = Parse.Object.extend('Company');

export const Bank = id => Parse.Object.extend('Bank_' + id);
