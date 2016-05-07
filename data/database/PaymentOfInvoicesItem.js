import Parse from 'parse';

export default company => {

  const name = `PaymentOfInvoicesItem_${company.id}`;

  class PaymentOfInvoicesItem extends Parse.Object {
    __type = 'PaymentOfInvoicesItem';

    constructor() {
      super(name);
    }
  }

  Parse.Object.registerSubclass(name, PaymentOfInvoicesItem);

  return PaymentOfInvoicesItem;
}
