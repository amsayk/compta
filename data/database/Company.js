const Parse = require('parse');

class Company extends Parse.Object {
  __type = 'Company';

  constructor() {
    super('Company');
  }
};

module.exports = Company;

Parse.Object.registerSubclass('Company', Company);
