const Parse = require('parse');

module.exports = company => {

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
