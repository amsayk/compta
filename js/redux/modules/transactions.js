/** @flow */

import Relay from 'react-relay';

import uid from '../../utils/uid';

import moment from 'moment';

import { actionTypes, } from 'redux-form';

import update from 'react-addons-update';

const SET_ACTIVE_ROW = 'compta/transactions/SET_ACTIVE_ROW';

const ADD_SOME_ROWS = 'compta/transactions/ADD_SOME_ROWS';

const EDIT_START = 'compta/transactions/EDIT_START';
const EDIT_STOP = 'compta/transactions/EDIT_STOP';

const CLEAR_ROW = 'compta/transactions/CLEAR_ROW';
const CLEAR_ALL_ROWS = 'compta/transactions/CLEAR_ALL_ROWS';

const MOVE = 'compta/transactions/MOVE';

const SET_NAME = 'compta/transactions/SET_NAME';
const SET_DESCRIPTION = 'compta/transactions/SET_DESCRIPTION';
const SET_ACCOUNT = 'compta/transactions/SET_ACCOUNT';
const SET_AMOUNT = 'compta/transactions/SET_AMOUNT';

const SAVE = 'compta/transactions/SAVE';
const SAVE_SUCCESS = 'compta/transactions/SAVE_SUCCESS';
const SAVE_FAIL = 'compta/transactions/SAVE_FAIL';

const initialState = {
  editing: {},
  saveError: {}
};

export default function reducer(state = initialState, action = {}) {

  switch (action.type) {
    case actionTypes.CHANGE:
    case actionTypes.FOCUS:
    case actionTypes.BLUR:
    case actionTypes.RESET:
    case actionTypes.START_SUBMIT:
    case actionTypes.DESTROY:
    case actionTypes.INITIALIZE:
      return function(){
        switch(action.form){
          case 'transaction':
            return {
              ...state,
              saveError: {
                ...state.saveError,
                [action.key]: null,
              },
            };
          default: return state;
        }
      }();
    case SET_ACTIVE_ROW:
      return function () {
        const {editing: {[action.id]: store}} = state;
        return {
          ...state,
          editing: {
            ...state.editing,
            [action.id]: store.setActiveRow(action.rowIndex),
          }
        }
      }();
    case ADD_SOME_ROWS:
      return function () {
        const {editing: {[action.id]: store}} = state;
        return {
          ...state,
          editing: {
            ...state.editing,
            [action.id]: store.addMoreRows(),
          }
        };
      }();
    case CLEAR_ALL_ROWS:
      return {
        ...state,
        editing: {
          ...state.editing,
          [action.id]: new OperationDataListStore([], 3),
        }
      };
    case CLEAR_ROW:
      return function () {
        const {editing: {[action.id]: store}} = state;
        return {
          ...state,
          editing: {
            ...state.editing,
            [action.id]: store.clearRow(action.index),
          }
        };
      }();
    case MOVE:
      return function () {
        const {editing: {[action.id]: store}} = state;
        return {
          ...state,
          editing: {
            ...state.editing,
            [action.id]: store.move(action.rowIndex, action.atIndex),
          }
        };
      }();
    case SET_NAME:
      return function () {
        const {editing: {[action.id]: store}} = state;
        return {
          ...state,
          editing: {
            ...state.editing,
            [action.id]: store.setName(action.rowIndex, action.name),
          }
        };
      }();
    case SET_DESCRIPTION:
      return function () {
        const {editing: {[action.id]: store}} = state;
        return {
          ...state,
          editing: {
            ...state.editing,
            [action.id]: store.setDescription(action.rowIndex, action.description),
          }
        };
      }();
    case SET_ACCOUNT:
      return function () {
        const {editing: {[action.id]: store}} = state;
        return {
          ...state,
          editing: {
            ...state.editing,
            [action.id]: store.setAccount(action.rowIndex, action.account),
          }
        };
      }();
    case SET_AMOUNT:
      return function () {
        const {editing: {[action.id]: store}} = state;
        return {
          ...state,
          editing: {
            ...state.editing,
            [action.id]: store.setAmount(action.rowIndex, action._type, action.amount),
          }
        };
      }();
    case EDIT_START:
      return {
        ...state,
        editing: {
          ...state.editing,
          [action.id]: new OperationDataListStore(action.operations, Math.max(3, action.operations.length)/*, 0*/),
        }
      };
    case EDIT_STOP:
      return {
        ...state,
        editing: {
          ...state.editing,
          [action.id]: null,
        },
        saveError: {
          ...state.saveError,
          [action.id]: null,
        },
      };
    case SAVE:
      return state; // 'saving' flag handled by redux-form
    case SAVE_SUCCESS:
      return {
        ...state,
        saveError: {
          [action.id]: null
        },
      };
    case SAVE_FAIL:
      return {
        ...state,
        saveError: {
          [action.id]: {
            _id: 'error.unknown',
            defaultMessage: 'There was an unknown error. Please try again.',
          }
        }
      };
    default:
      return state;
  }
}

export function save({id,}) {
  return {
    types: [SAVE, SAVE_SUCCESS, SAVE_FAIL],
    id: id || 'NEW',
    promise: () => new Promise((resolve, reject) => {

      // TODO: save transaction here!
      reject('NotImplemented');
    })
  };
}

export function setActiveRow(id, rowIndex) {
  return {type: SET_ACTIVE_ROW, id, rowIndex};
}

export function addMoreRows(id) {
  return {type: ADD_SOME_ROWS, id,};
}

export function clearAllRows(id) {
  return {type: CLEAR_ALL_ROWS, id,};
}

export function clearRow(id, index) {
  return {type: CLEAR_ROW, id, index,};
}

export function moveOp(id, rowIndex, atIndex) {
  return {type: MOVE, id, rowIndex, atIndex,};
}

export function editStart(id, operations) {
  return {type: EDIT_START, id, operations};
}

export function editStop(id) {
  return {type: EDIT_STOP, id,};
}

export function setAmount(id, rowIndex, type, amount) {
  return {type: SET_AMOUNT, id, rowIndex, _type:type, amount,};
}
export function setName(id, rowIndex, name) {
  return {type: SET_NAME, id, rowIndex, name,};
}
export function setDescription(id, rowIndex, description) {
  return {type: SET_DESCRIPTION, id, rowIndex, description,};
}
export function setAccount(id, rowIndex, account) {
  return {type: SET_ACCOUNT, id, rowIndex, account,};
}

type OperationShape = {
  id?: string,
  index: number,
  account: ?string,
  type?: 'DEBIT' | 'CREDIT',
  amount?: number,
  name: ?string,
  description: ?string,
};

class OperationDataListStore {
  constructor(operations:Array<OperationShape>, size:number, activeRow?:number) {
    this.size = size;
    this._cache = operations;
    this._activeRow = activeRow;
  }

  static createRowObjectData():OperationShape {
    return {
      _id: uid.type('T--O'),
      // account: null,
      // type: undefined,
      // amount: undefined,
      // name: null,
      // description: null,
    };
  }

  getObjectAt(index:number):?OperationShape {
    if (index < 0 || index > this.size) {
      return undefined;
    }
    if (this._cache[index] === undefined) {
      this._cache[index] = OperationDataListStore.createRowObjectData();
    }
    return this._cache[index];
  }

  /**
   * Populates the entire cache with data.
   * Use with Caution! Behaves slowly for large sizes
   * ex. 100,000 rows
   */
  getAll() {
    if (this._cache.length < this.size) {
      for (var i = 0; i < this.size; i++) {
        this.getObjectAt(i);
      }
    }
    return this._cache.slice();
  }

  getSize() {
    return this.size;
  }

  getActiveRow() {
    return this._activeRow;
  }

  find(id) {
    const operation = this._cache.filter(c => c.id === id || c._id === id)[0];

    return {
      operation,
      index: this._cache.indexOf(operation)
    };
  };

  addMoreRows() {
    // return new OperationDataListStore(this._cache.slice(), this.size + 2);

    this.size = this.size + 1;
    return this;
  }

  clearRow(index) {
    const {operations} = update({operations: this._cache.slice()}, {
      operations: {
        $splice: [
          [index, 1],
        ]
      }
    });

    //return new OperationDataListStore(
    //  operations,
    //  Math.max(operations.length, 3));

    this._cache = operations;
    this.size = Math.max(operations.length, 3);
    return this;
  }

  setActiveRow(rowIndex) {
    // TODO: validate
    // return new OperationDataListStore(this._cache.slice(), rowIndex == this.size - 1 ? this.size + 1 : this.size, rowIndex);

    this.size = rowIndex == this.size - 1 ? this.size + 1 : this.size;
    this._activeRow = rowIndex;
    return this;
  }

  hasActiveRow(){
    return this._activeRow >= 0;
  }

  move(index, atIndex) {
    const operation = this._cache[index];

    const {operations} = update({operations: this._cache.slice()}, {
      operations: {
        $splice: [
          [index, 1],
          [atIndex, 0, operation],
        ]
      }
    });

    // return new OperationDataListStore(operations, this.size);

    this._cache = operations;
    return this;
  }

  setAmount(index, type, amount){
    const operation = this.getObjectAt(index);
    operation['type'] = type;
    operation['amount'] = amount;
    return this;
  }

  setName(index, name){
    const operation = this.getObjectAt(index);
    operation['name'] = name;
    return this;
  }

  setDescription(index, description){
    const operation = this.getObjectAt(index);
    operation['description'] = description;
    return this;
  }

  setAccount(index, account){
    const operation = this.getObjectAt(index);
    operation['account'] = account;
    return this;
  }

  isValid(){
    const ops = this.getAll();
    const validOps = [];

    let valid = true;

    ops.forEach((op) => {
      const {account, type, amount,} = op;

      if(valid === false){
        return;
      }

      if(!account && !type && !amount){
        return;
      }

      if(!Number.isFinite(parseFloat(amount)) || !account || !type || !amount){
        valid = false;
        return;
      }

      validOps.push(op);
    });

    if(valid){
      const { DEBIT: sumOfDebits, CREDIT: sumOfCredits} = validOps.reduce(function({DEBIT, CREDIT}, {type, amount}){
        return {
          CREDIT: type === 'CREDIT' ? CREDIT + (amount || 0.0) : CREDIT,
          DEBIT: type === 'DEBIT' ? DEBIT + (amount || 0.0) : DEBIT,
        };
      }, {DEBIT: 0.0, CREDIT: 0.0});

      if(sumOfCredits !== sumOfDebits){
        valid = false;
      }
    }

    return {valid, isEmpty: validOps.length === 0};
  }
}
