import Parse from 'parse';

export default company => {

  const name = `Expense_${company.id}`;

  class Expense extends Parse.Object {
    __type = 'Expense';

    constructor() {
      super(name);
    }
  }

  Parse.Object.registerSubclass(name, Expense);

  return Expense;
}
