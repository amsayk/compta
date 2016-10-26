const Parse = require('parse');

module.exports = company => {

  const name = `InvoiceItem_${company.id}`;

  class InvoiceItem extends Parse.Object {
    __type = 'InvoiceItem';

    constructor() {
      super(name);
    }
  }

  Parse.Object.registerSubclass(name, InvoiceItem);

  return InvoiceItem;
}
