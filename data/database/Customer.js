const Parse = require('parse');

module.exports = company => {

  const name = `Customer_${company.id}`;

  class Customer extends Parse.Object {
    __type = 'Customer';

    constructor() {
      super(name);
    }
  }

  Parse.Object.registerSubclass(name, Customer);

  return Customer;
}
