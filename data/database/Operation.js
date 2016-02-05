import Parse from 'parse';

export default company => {

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
