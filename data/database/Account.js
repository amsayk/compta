const Parse = require('parse');

module.exports = (company) => {

  const name = `Account_${company.id}`;

  class Account extends Parse.Object {
    __type = 'Account';

    constructor() {
      super(name);
    }

  }

  Parse.Object.registerSubclass(name, Account);

  return Account;
};
