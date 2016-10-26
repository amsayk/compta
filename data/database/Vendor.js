const Parse = require('parse');

module.exports = company => {

  const name = `Vendor_${company.id}`;

  class Vendor extends Parse.Object {
    __type = 'Vendor';

    constructor() {
      super(name);
    }
  }

  Parse.Object.registerSubclass(name, Vendor);

  return Vendor;
}
