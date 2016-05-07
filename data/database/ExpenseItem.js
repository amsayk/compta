import Parse from 'parse';

export default company => {

  const name = `ExpenseItem_${company.id}`;

  class ExpenseItem extends Parse.Object {
    __type = 'ExpenseItem';

    constructor() {
      super(name);
    }
  }

  Parse.Object.registerSubclass(name, ExpenseItem);

  return ExpenseItem;
}
