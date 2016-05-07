import Parse from 'parse';

export default company => {

  const name = `Sale_${company.id}`;

  class Invoice extends Parse.Object {
    __type = 'Invoice';

    constructor() {
      super(name);
    }
  }

  Parse.Object.registerSubclass(name, Invoice);

  return Invoice;
}
