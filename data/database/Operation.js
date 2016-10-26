const Parse = require('parse');

module.exports = company => {

  const name = `Operation_${company.id}`;

  class Operation extends Parse.Object {
    __type = 'Operation';

    constructor() {
      super(name);
    }
  }

  Parse.Object.registerSubclass(name, Operation);

  return Operation;
}
