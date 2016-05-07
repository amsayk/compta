import Parse from 'parse';

export default company => {

  const name = `BillItem_${company.id}`;

  class BillItem extends Parse.Object {
    __type = 'BillItem';

    constructor() {
      super(name);
    }
  }

  Parse.Object.registerSubclass(name, BillItem);

  return BillItem;
}
