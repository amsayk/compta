/** @flow */

import Relay from 'react-relay';

import uid from '../../utils/uid';

import update from 'react-addons-update';

import isEqual from 'lodash.isequal';
import some from 'lodash.some';
// import pick from 'lodash.pick';

import moment from 'moment';

const DEFAULT_MIN_ROWS_SIZE = 2;

import { actionTypes, } from 'redux-form';

import AddExpenseMutation from '../../mutations/AddExpenseMutation';
import RemoveExpenseMutation from '../../mutations/RemoveExpenseMutation';

const SET_ACTIVE_ROW = 'compta/expenses/SET_ACTIVE_ROW';

const ADD_SOME_ROWS = 'compta/expenses/ADD_SOME_ROWS';

const EDIT_START = 'compta/expenses/EDIT_START';
const EDIT_STOP = 'compta/expenses/EDIT_STOP';

const CLEAR_ROW = 'compta/expenses/CLEAR_ROW';
const CLEAR_ALL_ROWS = 'compta/expenses/CLEAR_ALL_ROWS';
const RESET_LINES = 'compta/expenses/RESET_LINES';

const MOVE = 'compta/expenses/MOVE';

const SET_ACCOUNT_CODE = 'compta/expenses/SET_ACCOUNT_CODE';
const SET_DESCRIPTION = 'compta/expenses/SET_DESCRIPTION';
const SET_AMOUNT = 'compta/expenses/SET_AMOUNT';

// const SET_DATE = 'compta/expenses/SET_DATE';
// const SET_ITEM = 'compta/expenses/SET_ITEM';
// const SET_DESCRIPTION = 'compta/expenses/SET_DESCRIPTION';
// const SET_QTY = 'compta/expenses/SET_QTY';
// const SET_RATE = 'compta/expenses/SET_RATE';
// const SET_TAXABLE = 'compta/expenses/SET_TAXABLE';

const SAVE = 'compta/expenses/SAVE';
const SAVE_SUCCESS = 'compta/expenses/SAVE_SUCCESS';
const SAVE_FAIL = 'compta/expenses/SAVE_FAIL';

const REFRESH = 'compta/expenses/REFRESH';

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
          case 'expense':
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
      return function () {
        const {editing: {[action.id]: store}} = state;
        return {
          ...state,
          editing: {
            ...state.editing,
            [action.id]: store.clearAllRows(),
          }
        };
      }();
    case RESET_LINES:
      return function () {
        const {editing: {[action.id]: store}} = state;
        return {
          ...state,
          editing: {
            ...state.editing,
            [action.id]: store.resetLines(),
          }
        };
      }();
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
    case SET_ACCOUNT_CODE:
      return function () {
        const {editing: {[action.id]: store}} = state;
        return {
          ...state,
          editing: {
            ...state.editing,
            [action.id]: store.setAccountCode(action.rowIndex, action.accountCode),
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
    case SET_AMOUNT:
      return function () {
        const {editing: {[action.id]: store}} = state;
        return {
          ...state,
          editing: {
            ...state.editing,
            [action.id]: store.setAmount(action.rowIndex, action.amount),
          }
        };
      }();
    // case SET_DATE:
    //   return function () {
    //     const {editing: {[action.id]: store}} = state;
    //     return {
    //       ...state,
    //       editing: {
    //         ...state.editing,
    //         [action.id]: store.setDate(action.rowIndex, action.date),
    //       }
    //     };
    //   }();
    // case SET_ITEM:
    //   return function () {
    //     const {editing: {[action.id]: store}} = state;
    //     return {
    //       ...state,
    //       editing: {
    //         ...state.editing,
    //         [action.id]: store.setItem(action.rowIndex, action.item),
    //       }
    //     };
    //   }();
    // case SET_DESCRIPTION:
    //   return function () {
    //     const {editing: {[action.id]: store}} = state;
    //     return {
    //       ...state,
    //       editing: {
    //         ...state.editing,
    //         [action.id]: store.setDescription(action.rowIndex, action.description),
    //       }
    //     };
    //   }();
    // case SET_QTY:
    //   return function () {
    //     const {editing: {[action.id]: store}} = state;
    //     return {
    //       ...state,
    //       editing: {
    //         ...state.editing,
    //         [action.id]: store.setQty(action.rowIndex, action.qty),
    //       }
    //     };
    //   }();
    // case SET_RATE:
    //   return function () {
    //     const {editing: {[action.id]: store}} = state;
    //     return {
    //       ...state,
    //       editing: {
    //         ...state.editing,
    //         [action.id]: store.setRate(action.rowIndex, action.rate),
    //       }
    //     };
    //   }();
    // case SET_TAXABLE:
    //   return function () {
    //     const {editing: {[action.id]: store}} = state;
    //     return {
    //       ...state,
    //       editing: {
    //         ...state.editing,
    //         [action.id]: store.setTaxable(action.rowIndex, action.taxable),
    //       }
    //     };
    //   }();
    case EDIT_START:
      return {
        ...state,
        editing: {
          ...state.editing,
          [action.id]: new ExpenseItemDataListStore(action.expenses, action.id === 'NEW' ? Math.max(DEFAULT_MIN_ROWS_SIZE, action.expenses.length) : action.expenses.length, undefined, action._meta),
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
      return function(){
        console.error(action.error);
        return {
          ...state,
          saveError: {
            [action.id]: {
              _id: 'error.unknown',
              defaultMessage: 'There was an unknown error. Please try again.',
            }
          }
        };
      }();
    case REFRESH:
      return state; // 'saving' flag handled by redux-form
    default:
      return state;
  }
}

export function save({
  expense, id, payee, _vendor, paymentMethod, paymentRef, creditToAccountCode, items, date, memo, files, company, viewer, }) {
  return {
    types: [SAVE, SAVE_SUCCESS, SAVE_FAIL],
    id: id || 'NEW',
    promise: () => new Promise((resolve, reject) => {

      Relay.Store.commitUpdate(new AddExpenseMutation({
        expense, id,
        payee, _vendor, paymentMethod, paymentRef, creditToAccountCode, items, date: moment(date).toDate(), memo, files,
        company,
        viewer,
      }), {
        onSuccess: function ({addExpense: {expenseEdge: {node: {objectId, ...props,}}}}) {
          resolve({...props, id: objectId,});
        },
        onFailure: function (transaction) {
          const error = transaction.getError();
          reject({error});
        },
      });

    })
  };
}

export function del({
  expense, company, viewer, }) {
  return {
    types: [SAVE, SAVE_SUCCESS, SAVE_FAIL],
    id: expense.objectId,
    promise: () => new Promise((resolve, reject) => {

      Relay.Store.commitUpdate(new RemoveExpenseMutation({
        expense,
        company,
        viewer,
      }), {
        onSuccess: function ({removeExpense: {deletedExpenseId}}) {
          resolve({id: deletedExpenseId,});
        },
        onFailure: function (transaction) {
          const error = transaction.getError();
          reject({error});
        },
      });

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

export function resetLines(id) {
  return {type: RESET_LINES, id,};
}

export function clearRow(id, index) {
  return {type: CLEAR_ROW, id, index,};
}

export function moveOp(id, rowIndex, atIndex) {
  return {type: MOVE, id, rowIndex, atIndex,};
}

export function editStart(id, expenses, _meta) {
  return {type: EDIT_START, id, expenses, _meta};
}

export function editStop(id) {
  return {type: EDIT_STOP, id,};
}

export function setAccountCode(id, rowIndex, accountCode) {
  return {type: SET_ACCOUNT_CODE, id, rowIndex, accountCode,};
}
export function setDescription(id, rowIndex, description) {
  return {type: SET_DESCRIPTION, id, rowIndex, description,};
}
export function setAmount(id, rowIndex, amount) {
  return {type: SET_AMOUNT, id, rowIndex, amount,};
}

// export function setDate(id, rowIndex, date) {
//   return {type: SET_DATE, id, rowIndex, date,};
// }
// export function setItem(id, rowIndex, item) {
//   return {type: SET_ITEM, id, rowIndex, item,};
// }
// export function setDescription(id, rowIndex, description) {
//   return {type: SET_DESCRIPTION, id, rowIndex, description,};
// }
// export function setQty(id, rowIndex, qty) {
//   return {type: SET_QTY, id, rowIndex, qty,};
// }
// export function setRate(id, rowIndex, rate) {
//   return {type: SET_RATE, id, rowIndex, rate,};
// }
// export function setTaxable(id, rowIndex, taxable) {
//   return {type: SET_TAXABLE, id, rowIndex, taxable,};
// }

export function refresh() {
  return {type: REFRESH,};
}

type ItemShape = {
  id?: string,
  index: number,
  description: ?string,
  amount: number,
  accountCode: string,
};

class ExpenseItemDataListStore {
  constructor(
    expenses:Array<ItemShape>,
    size:number,
    activeRow?:?{rowIndex: number, cell?: ?string},
    _meta: {id: string, company: object}) {

    this.size = size;
    this._cache = expenses;
    this._activeRow = activeRow;

    this._meta = _meta;

    this.getAll();

    this.__origins = {
      rows: this._cache.slice().filter(({dirty}) => typeof dirty !== 'undefined' ? dirty : false),
      rowsById: _meta.id === 'NEW' ? {} : this._cache.slice().reduce((rows, row) => {rows[row.id] = row; return rows;}, {}),
      size: this.size,
    };
  }

  setShowErrors(showErrors){
    this._showErrors = showErrors;
  }

  get showErrors(){
    return this._showErrors;
  }

  get isDirty(){

    if(this._meta.id === 'NEW'){
      return ! isEqual(
        this.__origins.rows,
        this._cache.filter(({dirty}) => typeof dirty !== 'undefined' ? dirty : false)
      );
    }

    return this.size !== this.__origins.size || some(this._cache, el => {
      return ! isEqual(
        this.__origins.rowsById[el.id],
        el
      );
    });

    // return ! isEqual(
    //   pick(this.__origins, ['rows', 'size']),
    //   {rows: this._cache.slice(), size: this.size}
    // );
  }

  get subtotal(){
    return this.getAll()
      .filter(isCompletedExpenseLine(this._meta))
      .reduce((sum, {amount}) => sum + amount, 0.0);
  }


  // getTotal({discountType, discountValue, taxPercent}){
  //   const completedLines = this.getAll()
  //     .filter(isCompletedExpenseLine(this._meta));
  //
  //   const subtotal = completedLines
  //     .reduce((sum, {amount}) => sum + (qty * rate), 0.0);
  //   const totalDiscount = getTotalDiscount(subtotal, { type: discountType, value: discountValue, });
  //   const taxableSubtotal = completedLines
  //     .reduce((sum, {amount, taxable,}) => {
  //       if(taxable){
  //         const amount = qty * rate;
  //         const amountPercentage = (amount * 100 / subtotal);
  //         const discountPart = amountPercentage / 100 * totalDiscount;
  //         return sum + (amount - discountPart);
  //       }
  //       return sum;
  //     }, 0.0);
  //
  //   const total = subtotal - totalDiscount;
  //
  //   const taxAmount = getTaxAmount(taxableSubtotal, {taxPercent});
  //   return total + taxAmount;
  // }

  static createRowObjectData():ItemShape {
    return {
      _id: uid.type('Expense--O'),
      accountCode: undefined,
      description: undefined,
      amount: 0.0,

      pristine: true,
    };
  }

  getObjectAt(index:number):?ItemShape {
    if (index < 0 || index > this.size) {
      return undefined;
    }
    if(index === this.size){
      const el = ExpenseItemDataListStore.createRowObjectData();
      el.dirty = false;
      return el;
    }
    if (this._cache[index] === undefined) {
      this._cache[index] = ExpenseItemDataListStore.createRowObjectData();
    }
    const obj = this._cache[index];

    obj.dirty = isExpenseDirty(this, this._cache[index]);

    return obj;
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
    const expense = this._cache.filter(c => c.id === id || c._id === id)[0];

    return {
      expense,
      index: this._cache.indexOf(expense)
    };
  };

  addMoreRows() {
    this.size = this.size + 1;
    return this;
  }
  clearAllRows() {
    this.size = DEFAULT_MIN_ROWS_SIZE;
    this._cache = [];
    return this;
  }
  resetLines() {
    this.size = this.__origins.size;
    this._cache = this.__origins.rows.slice();
    return this;
  }

  clearRow(index) {
    const {expenses} = update({expenses: this._cache.slice()}, {
      expenses: {
        $splice: [
          [index, 1],
        ]
      }
    });

    this._cache = expenses;
    this.size = this._meta.id === 'NEW' ? Math.max(expenses.length, DEFAULT_MIN_ROWS_SIZE) : expenses.length;
    return this;
  }

  setActiveRow(config) {
    // TODO: validate

    const {rowIndex, } = config || {};

    this.size = rowIndex && rowIndex === this.size/* - 1*/ ? this.size + 1 : this.size;
    this._activeRow = config;
    return this;
  }

  hasActiveRow(){
    return this._activeRow && this._activeRow.rowIndex >= 0;
  }

  move(index, atIndex) {
    const expense = this._cache[index];

    const {expenses} = update({expenses: this._cache.slice()}, {
      expenses: {
        $splice: [
          [index, 1],
          [atIndex, 0, expense],
        ]
      }
    });

    this._cache = expenses;
    return this;
  }

  setAccountCode(index, accountCode){
    this.setShowErrors(false);

    const expense = this.getObjectAt(index);
    expense['accountCode'] = accountCode;

    expense['pristine'] = false;
    return this;
  }

  setDescription(index, description){
    this.setShowErrors(false);

    const expense = this.getObjectAt(index);
    expense['description'] = description;

    expense['pristine'] = false;
    return this;
  }

  setAmount(index, amount){
    this.setShowErrors(false);

    const expense = this.getObjectAt(index);
    expense['amount'] = amount;

    expense['pristine'] = false;
    return this;
  }

  // setDate(index, date){
  //   this.setShowErrors(false);
  //
  //   const expense = this.getObjectAt(index);
  //   expense['date'] = date;
  //
  //   expense['pristine'] = false;
  //   return this;
  // }
  //
  // setItem(index, item){
  //   this.setShowErrors(false);
  //
  //   const expense = this.getObjectAt(index);
  //   expense['item'] = item;
  //
  //   expense['pristine'] = false;
  //   return this;
  // }
  //
  // setDescription(index, description){
  //   this.setShowErrors(false);
  //
  //   const expense = this.getObjectAt(index);
  //   expense['description'] = description;
  //
  //   expense['pristine'] = false;
  //   return this;
  // }
  //
  // setQty(index, qty){
  //   this.setShowErrors(false);
  //
  //   const expense = this.getObjectAt(index);
  //   expense['qty'] = qty;
  //
  //   expense['pristine'] = false;
  //   return this;
  // }
  //
  // setRate(index, rate){
  //   this.setShowErrors(false);
  //
  //   const expense = this.getObjectAt(index);
  //   expense['rate'] = rate;
  //
  //   expense['pristine'] = false;
  //   return this;
  // }
  //
  // setTaxable(index, taxable){
  //   this.setShowErrors(false);
  //
  //   const expense = this.getObjectAt(index);
  //   expense['taxable'] = taxable;
  //
  //   expense['pristine'] = false;
  //   return this;
  // }

  isKeyValid(rowIndex, key){
    const expense = this.getObjectAt(rowIndex);

    switch (key) {
      case 'accountCode':
        return expense.amount > 0 ? !!expense.accountCode : true;

      case 'amount':
        return !!expense.accountCode ? expense.amount > 0 : true;

      default:
        return true;
    }
  }

  isValid(expense){ // expense is dirty
    console.assert(expense.dirty, 'Call this method only on dirty lines');

    if(!!expense.accountCode){
    }else{
      return {field: 'accountCode', valid: false};
    }

    if(expense.amount > 0){
    }else{
      return {field: 'amount', valid: false};
    }

    return {valid: true};
  }
}

function isCompletedExpenseLine({id}){

  if(id === 'NEW'){
    return ({accountCode, description, amount, dirty}) => dirty ? !!accountCode && amount > 0 : false;
  }

  return ({ id, __dataID__, objectId, accountCode, description, amount, dirty}) => {
    if(objectId || id || __dataID__){
      return dirty ? !!accountCode && amount > 0 : true;
    }
    return dirty ? !!accountCode && amount > 0 : false;
  };
}

function isExpenseDirty(self, {id, date, accountCode, description, amount}){

  if(id){
    const old = self.__origins.rowsById[id];
    return ! isEqual(
      {accountCode: old.accountCode, description: old.description, amount: old.amount},
      {accountCode: accountCode, description, amount}
    )
  }

  return accountCode !== undefined || description !== undefined || amount !== 0.0;
}
