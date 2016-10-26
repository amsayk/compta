const Parse = require('parse');

const {
  parseTableCountLoader,
  parseTableLoader,
  parseIDLoader,
  parseSeqLoader,
} = require('../../../database/loaders');

const Product = require('../../../database/Product');

const People = require('../../../database/v2/People');

const Company = require('../../../database/Company');

module.exports.onAccount = function onAccount() {
  const account = Parse.User.current();
  if(account){
    return account.fetch();
  }

  return Promise.resolve();
};

module.exports.onExpense = function onExpense(company, id) {
  const Type = Parse.Object.extend('Expense_' + company.id);

  parseTableLoader.clear(Type);
  parseIDLoader.clear([Type, id]);

  parseSeqLoader.clearAll();
};

module.exports.onSale = function onSale(company, id) {
  const Type = Parse.Object.extend('Sale_' + company.id);

  parseTableLoader.clear(Type);
  parseIDLoader.clear([Type, id]);

  parseSeqLoader.clearAll();
};

module.exports.onCompany = function onCompany(company) {
  parseTableLoader.clear(Company);
  parseIDLoader.clear([Company, company.id]);

  parseSeqLoader.clearAll();
};

module.exports.onItem = function onItem(company, id) {
  parseTableLoader.clear(Product({id: company.id}));
  parseIDLoader.clear([Product({id: company.id}), id]);
};

module.exports.onPerson = function onPerson(company, id) {
  const Type = Parse.Object.extend('People_' + company.id);

  parseTableLoader.clear(Type);
  parseIDLoader.clear([Type, id]);
};
