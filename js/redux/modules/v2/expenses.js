/** @flow */

import Relay from 'react-relay';

import uid from '../../../utils/uid';

import update from 'react-addons-update';

import isEqual from 'lodash.isequal';
import some from 'lodash.some';
// import pick from 'lodash.pick';

import moment from 'moment';

import pick from 'lodash.pick';

import deepEqual from 'deep-equal';
import deepCopy from 'deep-copy';

const DEFAULT_MIN_ROWS_SIZE = 2;

import { actionTypes, } from 'redux-form';

import AddExpenseMutation from '../../../mutations/v2/AddExpenseMutation';
import RemoveExpenseMutation from '../../../mutations/v2/RemoveExpenseMutation';

import {
  fromGlobalId,
} from 'graphql-relay';

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

const SET_VAT_PART = 'compta/expenses/SET_VAT_PART';

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
    case SET_VAT_PART:
      return function () {
        const {editing: {[action.id]: store}} = state;
        return {
          ...state,
          editing: {
            ...state.editing,
            [action.id]: store.setVATPart(action.rowIndex, action.VATPart),
          }
        };
      }();
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
              defaultMessage: 'Erreur inconnu. Veuillez essayer de nouveau.',
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
  expense, id, payee, _vendor, paymentMethod, paymentRef, creditToAccountCode, inputType, items, date, memo, files, company, viewer, }) {
  return {
    types: [SAVE, SAVE_SUCCESS, SAVE_FAIL],
    id: id || 'NEW',
    promise: () => new Promise((resolve, reject) => {

      Relay.Store.commitUpdate(new AddExpenseMutation({
        expense, id,
        payee, _vendor, paymentMethod, paymentRef, creditToAccountCode, inputType, items, date: moment(date).toDate(), memo, files,
        company,
        viewer,
      }), {
        onSuccess: function ({addExpense: {expenseEdge: {node: {...props,}}}}) {
          resolve({ ...props, itemsConnection : props.expenseItemsConnection, });
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

export function setVATPart(id, rowIndex, VATPart) {
  return {type: SET_VAT_PART, id, rowIndex, VATPart,};
}

export function refresh() {
  return {type: REFRESH,};
}

type ItemShape = {
  id?: string,
  index: number,
  description: ?string,
  amount: number,
  accountCode: string,
  VATPart: {
    inputType: number,
    value: number,
  },
};

const VAT_ID_TO_VALUE = {
  Value_20: 0.20,
  Value_14: 0.14,
  Value_10: 0.1,
  Value_Exempt: 0.0,
  Value_7: 0.07,

  1: 0.20,
  2: 0.14,
  3: 0.1,
  4: 0.0,
  5: 0.07,
};

const VAT_NAME_TO_ID = {
  Value_20: 1,
  Value_14: 2,
  Value_10: 3,
  Value_Exempt: 4,
  Value_7: 5,
};

function itemGeVATPart__Amount(taxableAmount /* ALWAYS HT */, itemVATPart) {

  if(itemVATPart){
    const { inputType, value = 'Value_Exempt', } = itemVATPart;

    // taxableAmount is HT: VAT = %VAT * taxableAmountHT
    return function () {
      const VAT_percentage = value ? VAT_ID_TO_VALUE[value] : 0.0;

      const taxableAmountHT = taxableAmount;

      const VAT_amount = VAT_percentage * taxableAmountHT;

      return VAT_amount;
    }();

  }

  return 0;
}

function itemGetAmount__TTC(entryValue, itemVATPart) {
  if(itemVATPart){
    const { inputType, value = 'Value_Exempt', } = itemVATPart;

    switch (inputType){
      case 1:
      case 'HT':

        // entryValue is HT: TTC = (1 + %VAT) * entryValueHT;
        return (1 + VAT_ID_TO_VALUE[value]) * entryValue;

      case 2:
      case 'TTC':

        // entryValue is TTC: TTC = entryValueTTC;
        return entryValue;

      case 3:
      case 'NO_VAT':

        return entryValue;

      default:

        throw new Error(`itemGetAmount__TTC: Invalid inputType`, inputType);
    }
  }

  return entryValue;
}

function itemGetAmount__HT(entryValue, itemVATPart) {
  if(itemVATPart){
    const { inputType, value = 'Value_Exempt', } = itemVATPart;

    switch (inputType){
      case 1:
      case 'HT':

        // entryValue is HT: HT = entryValueHT;
        return entryValue;

      case 2:
      case 'TTC':

        // entryValue is TTC: HT =  entryValueTTC / (1 + %VAT);
        return entryValue / (1 + VAT_ID_TO_VALUE[value]);

      case 3:
      case 'NO_VAT':

        return entryValue;

      default:

        throw new Error(`itemGetAmount__HT: Invalid inputType`, inputType);
    }
  }

  return entryValue;
}

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
      rowsById: _meta.id === 'NEW' ? {} : this._cache.slice().reduce((rows, row) => {rows[row.index] = deepCopy(row); return rows;}, {}),
      size: this.size,
    };
  }

  reInit(expenses, _meta){
    this.size = expenses.length;
    this._cache = expenses;

    this._meta = _meta;

    this.getAll();

    this.__origins = {
      rows: this._cache.slice().filter(({dirty}) => typeof dirty !== 'undefined' ? dirty : false),
      rowsById: _meta.id === 'NEW' ? {} : this._cache.slice().reduce((rows, row) => {rows[row.index] = deepCopy(row); return rows;}, {}),
      size: this.size,
    };
  }

  getCompletedLines(){
    const completedLines = this.getAll()
      .filter(isCompletedExpenseLine(this._meta));

    return completedLines;
  }

  getCompletedLinesWithValidVATPart(){
    const isComplete = isCompletedExpenseLine(this._meta);

    const hasValidVATPart = item => item.VATPart && item.VATPart.value ? item.VATPart.value !== 'Value_Exempt' : false;

    const completedValidVATLines = this.getAll()
      .filter(i => isComplete(i) && hasValidVATPart(i));

    return completedValidVATLines;
  }

  getTotal(){
    const completedLines = this.getAll()
      .filter(isCompletedExpenseLine(this._meta));

    const subtotalHT = completedLines
      .reduce((sum, { amount, VATPart : itemVATPart, }) => sum + itemGetAmount__HT(amount, itemVATPart), 0.0);

    const totalHT = subtotalHT;

    const totalTaxAmount = completedLines
      .reduce((sum, { amount, VATPart : itemVATPart, }) => {

        const entryValue = amount;

        const amountHT = itemGetAmount__HT(entryValue, itemVATPart);

        const taxableAmount = amountHT;

        return sum + itemGeVATPart__Amount(taxableAmount, itemVATPart);
      }, 0.0);

    return totalHT + totalTaxAmount;
  }

  reconcileInputType(inputType){
    const isGood = isCompletedExpenseLine(this._meta);

    for (let i = 0; i < this.size; i++) {
      const el = this.getObjectAt(i);

      if(isGood(el)){

        el.VATPart = el.VATPart && el.VATPart.inputType !== 4 ? {
          ...(el.VATPart && el.VATPart.value ? { value: el.VATPart.value, } : {}),
          inputType,
        } : undefined;

      }
    }
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

    const PROPS = [
      'index', 'id', 'objectId', 'date', 'accountCode', 'VATPart', 'description', 'amount'
    ];

    return this.size !== this.__origins.size || some(this._cache, el => {
        return ! deepEqual(
          pick(this.__origins.rowsById[el.index], PROPS),
          pick(el, PROPS),
        );
      });
  }

  get subtotal(){
    return this.getAll()
      .filter(isCompletedExpenseLine(this._meta))
      .reduce((sum, {amount}) => sum + amount, 0.0);
  }

  static createRowObjectData():ItemShape {
    return {
      _id: uid.type('Expense--O'),
      accountCode: undefined,
      description: undefined,
      amount: 0.0,

      VATPart: undefined,

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

  setVATPart(index, VATPart){
    this.setShowErrors(false);

    const expense = this.getObjectAt(index);
    expense['VATPart'] = VATPart;

    expense['pristine'] = false;
    return this;
  }

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

function isExpenseDirty(self, { index, id, objectId, date, accountCode, VATPart, description, amount}){

  if(id){
    const old = self.__origins.rowsById[index];
    return ! isEqual(
      {accountCode: old.accountCode, description: old.description, amount: old.amount, VATPart: old.VATPart, },
      {accountCode: accountCode, description, amount, VATPart, }
    )
  }

  return accountCode !== undefined || description !== undefined || amount !== 0.0 || VATPart !== undefined;
}

export const StoreProto = ExpenseItemDataListStore.prototype;
