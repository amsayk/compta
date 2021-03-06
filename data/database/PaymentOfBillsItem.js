const Parse = require('parse');

module.exports = company => {

  const name = `PaymentOfBillsItem_${company.id}`;

  class PaymentOfBillsItem extends Parse.Object {
    __type = 'PaymentOfBillsItem';

    constructor() {
      super(name);
    }
  }

  Parse.Object.registerSubclass(name, PaymentOfBillsItem);

  return PaymentOfBillsItem;
}
