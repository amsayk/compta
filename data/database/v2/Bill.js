import Parse from 'parse';

export default company => {

  const name = `Expense_${company.id}`;

  class Bill extends Parse.Object {
    __type = 'Bill';

    constructor() {
      super(name);
    }
  }

  Parse.Object.registerSubclass(name, Bill);

  return Bill;
}
