const Parse = require('parse');

module.exports = company => {

  const name = `Transaction_${company.id}`;

  class Transaction extends Parse.Object {
    __type = 'Transaction';

    constructor() {
      super(name);
    }

  }

  Parse.Object.registerSubclass(name, Transaction);
  return Transaction;
}
