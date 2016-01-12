import Parse from 'parse/node';

import CLASSES from './classes';
import CATEGORIES from './categories';
import GROUPS from './groups';
import ACCOUNTS from './accounts';

export const getAccount = function(code) {
  return ACCOUNTS[code];
};

export class Account extends Parse.Object {
  constructor() {
    super('Account');
  }

  get class(){
    return CLASSES[this.get('_classCode')];
  }

  get category(){
    return CATEGORIES[this.get('_categoryCode')];
  }

  get group(){
    return GROUPS[this.get('_groupCode')];
  }

  hasParent(){
    return this.has('_parentCode');
  }

  get parentCode(){
    return this.get('_parentCode');
  }

  get code(){
    return this.get('code');
  }
}

export class Transaction extends Parse.Object{
  constructor() {
    super('Transaction');
  }

  get operations(){
    return this.get('operations');
  }

  get nr(){
    return this.get('_nr');
  }
}

export class Operation extends Parse.Object{
  constructor() {
    super('Operation');
  }

  get accountCode(){
    return this.get('accountCode');
  }

  get type(){
    return this.get('type');
  }

  get amount(){
    return this.get('amount');
  }


}

Parse.Object.registerSubclass('Account', Account);
Parse.Object.registerSubclass('Operation', Operation);
Parse.Object.registerSubclass('Transaction', Transaction);
