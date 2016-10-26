const Parse = require('parse');

module.exports = company => {

  const name = `Sale_${company.id}`;

  class Sale extends Parse.Object {
    constructor() {
      super(name);
    }
  }

  Parse.Object.registerSubclass(name, Sale);

  return Sale;
}
