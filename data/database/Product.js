import Parse from 'parse';

export default company => {

  const name = `Product_${company.id}`;

  class Product extends Parse.Object {
    __type = 'Product';

    constructor() {
      super(name);
    }
  }

  Parse.Object.registerSubclass(name, Product);

  return Product;
}
