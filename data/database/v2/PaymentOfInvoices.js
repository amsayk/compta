import Parse from 'parse';

export default company => {

  const name = `Sale_${company.id}`;

  class PaymentOfInvoices extends Parse.Object {
    __type = 'PaymentOfInvoices';

    constructor() {
      super(name);
    }
  }

  Parse.Object.registerSubclass(name, PaymentOfInvoices);

  return PaymentOfInvoices;
}
