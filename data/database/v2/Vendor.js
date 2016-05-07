import Parse from 'parse';

export default company => {

  const name = `People_${company.id}`;

  class Vendor extends Parse.Object {
    __type = 'Vendor';

    constructor() {
      super(name);
    }
  }

  Parse.Object.registerSubclass(name, Vendor);

  return Vendor;
}
