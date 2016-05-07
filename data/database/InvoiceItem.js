import Parse from 'parse';

export default invoice => {

  const name = `InvoiceItem_${invoice.id}`;

  class InvoiceItem extends Parse.Object {
    __type = 'InvoiceItem';

    constructor() {
      super(name);
    }
  }

  Parse.Object.registerSubclass(name, InvoiceItem);

  return InvoiceItem;
}
