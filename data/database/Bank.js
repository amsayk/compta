import Parse from 'parse';

export default company => {

  const name = `Bank_${company.id}`;

  class Bank extends Parse.Object {
    __type = 'Bank';

    constructor() {
      super(name);
    }
  }

  Parse.Object.registerSubclass(name, Bank);

  return Bank;
}
