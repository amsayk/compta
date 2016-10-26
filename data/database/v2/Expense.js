const Parse = require('parse');

module.exports = company => {

  const name = `Expense_${company.id}`;

  class Expense extends Parse.Object {
    constructor() {
      super(name);
    }
  }

  Parse.Object.registerSubclass(name, Expense);

  return Expense;
}
