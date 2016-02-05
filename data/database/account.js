import Parse from 'parse';

import {encode_period} from './utils';

export default (company, period) => {

  const name = `Account_${company.id}_${encode_period(period)}`;

  class Account extends Parse.Object {
    __type = 'Account';

    constructor() {
      super(name);
    }

  }

  Parse.Object.registerSubclass(name, Account);

  return Account;
};
