import Parse from 'parse';

export default class Company extends Parse.Object {
  __type = 'Company';

  constructor() {
    super('Company');
  }
};

Parse.Object.registerSubclass('Company', Company);
