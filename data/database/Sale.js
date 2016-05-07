import Parse from 'parse';

export default company => {

  const name = `Sale_${company.id}`;

  class Sale extends Parse.Object {
    __type = 'Sale';

    constructor() {
      super(name);
    }
  }

  Parse.Object.registerSubclass(name, Sale);

  return Sale;
}
