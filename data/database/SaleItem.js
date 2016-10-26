const Parse = require('parse');

module.exports = company => {

  const name = `SaleItem_${company.id}`;

  class SaleItem extends Parse.Object {
    __type = 'SaleItem';

    constructor() {
      super(name);
    }
  }

  Parse.Object.registerSubclass(name, SaleItem);

  return SaleItem;
}
