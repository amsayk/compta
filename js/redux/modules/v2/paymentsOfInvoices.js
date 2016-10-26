/** @flow */

import Relay from 'react-relay';

import moment from 'moment';

// import isEqual from 'lodash.isequal';
import findIndex from 'lodash.findindex';
import sort from 'lodash.sortby';

// import pick from 'lodash.pick';

// import deepEqual from 'deep-equal';
// import deepCopy from 'deep-copy';

import {
  toGlobalId,
} from 'graphql-relay';

import { actionTypes, } from 'redux-form';

import ReceivePaymentOfInvoicesMutation from '../../../mutations/v2/ReceivePaymentOfInvoicesMutation';
import RemovePaymentOfInvoicesMutation from '../../../mutations/v2/RemovePaymentOfInvoicesMutation';

import {
  fromGlobalId,
} from 'graphql-relay';

export const Modes = {
  All: 1,
  None: 2,
  Some: 3,
};

const EDIT_START = 'compta/paymentsOfInvoices/EDIT_START';
const EDIT_STOP = 'compta/paymentsOfInvoices/EDIT_STOP';

const REFRESH = 'compta/paymentsOfInvoices/REFRESH';

const SAVE = 'compta/paymentsOfInvoices/SAVE';
const SAVE_SUCCESS = 'compta/paymentsOfInvoices/SAVE_SUCCESS';
const SAVE_FAIL = 'compta/paymentsOfInvoices/SAVE_FAIL';

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
          case 'paymentsOfInvoices':
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
    case REFRESH:
      return state; // 'saving' flag handled by redux-form
    case EDIT_START:
      return {
        ...state,
        editing: {
          ...state.editing,
          [action.id]: new InvoiceItemDataListStore(action.items, action.meta),
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
            defaultMessage: 'Erreur inconnu. Veuillez essayer de nouveau.',
          }
        }
      };
    default:
      return state;
  }
}

export function save({
  payment, id, customer, _customer, date, paymentMethod, paymentRef, depositToAccountCode, amountReceived, items, memo, files, company, viewer, }) {
  return {
    types: [SAVE, SAVE_SUCCESS, SAVE_FAIL],
    id: id || 'NEW',
    promise: () => new Promise((resolve, reject) => {

      Relay.Store.commitUpdate(new ReceivePaymentOfInvoicesMutation({
        payment, id,
        customer, _customer, date: moment(date).toDate(), paymentMethod, paymentRef, depositToAccountCode, amountReceived, items, memo, files,
        changedInvoicesIds: items.map(({invoiceId}) => toGlobalId(`Invoice_${company.objectId}`, `${company.objectId}:${invoiceId}`)),
        company,
        viewer,
      }), {
        onSuccess: function ({receivePaymentOfInvoices: {paymentEdge: {node: {...props,}}}}) {
          resolve({ ...props, itemsConnection : props.paymentItemsConnection, });
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
  payment, company, viewer, }) {
  return {
    types: [SAVE, SAVE_SUCCESS, SAVE_FAIL],
    id: payment.objectId,
    promise: () => new Promise((resolve, reject) => {

      Relay.Store.commitUpdate(new RemovePaymentOfInvoicesMutation({
        payment,
        company,
        viewer,
      }), {
        onSuccess: function ({removePaymentOfInvoices: {deletedPaymentId}}) {
          resolve({id: deletedPaymentId,});
        },
        onFailure: function (transaction) {
          const error = transaction.getError();
          reject({error});
        },
      });

    })
  };
}

export function editStart(id, items, meta) {
  return {type: EDIT_START, id, items, meta};
}

export function editStop(id) {
  return {type: EDIT_STOP, id,};
}

export function refresh() {
  return {type: REFRESH,};
}

type InvoiceShape = {
  id: string,
  amount?: ?number,
  invoice: {
    id: string,
    refNo: number,
    total: number,
    balanceDue: number,
    amountReceived: number,
    date: Date,
    dueDate: Date,
  },
};

class InvoiceItemDataListStore {
  constructor(invoices: Array<InvoiceShape>, _meta: {id: string, company: object}) {
    this.size = invoices.length;
    this._cache = invoices;
    // this._mode = Modes.None;

    this._cache.forEach(({__existed,}, index) => {
      this.setSelected(index, __existed, false/*reconcile*/);
    });
    this._reconcileSelection();

    // this._meta = _meta;
    //
    // this.__origins = {
    //   rows: this._cache.slice().filter(({dirty}) => typeof dirty !== 'undefined' ? dirty : false),
    //   rowsById: this._cache.slice().reduce((rows, row) => {rows[row.id] = row; return rows;}, {}),
    //   size: this.size,
    // };
  }

  reInit(invoices){
    this.size = invoices.length;
    this._cache = invoices;
    // this._mode = Modes.None;

    this._cache.forEach(({__existed,}, index) => {
      this.setSelected(index, __existed, false/*reconcile*/);
    });
    this._reconcileSelection();
  }

  get max() {
    return this._cache.reduce((sum , { invoice, }) => sum + invoice.balanceDue, 0.0);
  }

  setShowErrors(showErrors){
    this._showErrors = showErrors;
  }

  get showErrors(){
    return !!this._showErrors;
  }

  get mode(){
    return this._mode;
  }

  get isDirty(){
    return this._cache.some(({ amount, __existed, __originalAmount, }) => __existed ? amount !== __originalAmount : typeof amount === 'number' && isFinite(amount));
    // return ! isEqual(
    //   this.__origins.rows,
    //   this._cache.filter(({dirty}) => typeof dirty !== 'undefined' ? dirty : false)
    // );
    // return ! isEqual(
    //   pick(this.__origins, ['rows', 'size']),
    //   {rows: this._cache.slice(), size: this.size}
    // );
  }

  reset() {
    this.size = this.__origins.size;
    this._cache = this.__origins.rows.slice();
    return this;
  }

  setActiveRow(index){
    this._activeRow = index;
  }

  get activeRow(){
    return this._activeRow;
  }

  get total(){
    return this.getAll().reduce(
      (sum, { amount = 0.0, }) => sum + amount, 0.0);
  }

  setAmount(index, amount, select = true){
    this.setShowErrors(false);

    const isValidNumber = typeof amount === 'number' && isFinite(amount);
    if(select){
      this.setSelected(index, isValidNumber);
    }

    const item = this.getObjectAt(index);
    item['amount'] = isValidNumber && amount <= item.invoice.balanceDue ? amount : undefined;

    item['pristine'] = false;
    return this;
  }

  getAmount(id){
    const self = this;
    const index = findIndex(this._cache, c => c.id === id);
    return index !== -1 ? function(){
      const item = self.getObjectAt(index);
      return typeof item.amount === 'number' && isFinite(item.amount) ? item.amount : undefined;
    }() : undefined;
  }

  isKeyValid(rowIndex, key){
    const item = this.getObjectAt(rowIndex);

    switch (key) {
      case 'amount':
        if(this.isSelected(rowIndex)){
          return typeof item.amount === 'number' && isFinite(item.amount) && item.amount >= 0 && item.amount <= item.balanceDue;
        }else{
          return true;
        }

      default:
        return true;
    }
  }

  isValid(item){ // item is dirty && selected
    // console.assert(item.dirty, 'Call this method only on dirty lines');

    if(typeof item.amount === 'number' && isFinite(item.amount)
      && item.amount > 0
      && (item.__existed ? true : item.amount <= item.invoice.balanceDue)){
    }else{
      return {field: 'amount', valid: false};
    }

    return {valid: true};
  }

  // static createRowObjectData():InvoiceShape {
  //   return {
  //     id: uid.type('Invoice--O'),
  //   };
  // }

  hasKey(id){
    return this._cache.some(c => c.id === id);
  }

  isKeySelected(id){
    const index = findIndex(this._cache, c => c.id === id);
    return index !== -1 ? this.isSelected(index) : false;
  }

  getObjectAt(index:number):?InvoiceShape {
    if (index < 0 || index > this.size) {
      return undefined;
    }
    // if (this._cache[index] === undefined) {
    //   this._cache[index] = InvoiceItemDataListStore.createRowObjectData();
    // }

    const obj = this._cache[index];

    // obj.dirty = isItemDirty(this, this._cache[index]);

    return obj;
  }

  /**
   * Populates the entire cache with data.
   * Use with Caution! Behaves slowly for large sizes
   * ex. 100,000 rows
   */
  getAll() {
    // if (this._cache.length < this.size) {
    //   for (var i = 0; i < this.size; i++) {
    //     this.getObjectAt(i);
    //   }
    // }
    return this._cache.slice();
  }

  getSize() {
    return this.size;
  }

  // find(id) {
  //   const invoice = this._cache.filter(c => c.id === id || c._id === id)[0];
  //
  //   return {
  //     invoice,
  //     index: this._cache.indexOf(invoice)
  //   };
  // };

  onAmountReceivedChanged(amountReceived){
    let bal = amountReceived;
    let items = [];

    for(let i = 0; i < this.size; i++){
      const item = {...this._cache[i], rowIndex: i};
      items.push(item);
    }

    items = sort(items, ({invoice}) => invoice.balanceDue);

    for(let i = 0, len = items.length; i < len; i++){
      const item = items[i];
      // if(typeof item.amount === 'undefined' || item.amount === 0.0 || !isFinite(item.amount)){
        if(bal >= item.invoice.balanceDue){
          bal = bal - item.invoice.balanceDue;
          this.setAmount(item.rowIndex, item.invoice.balanceDue);
        }else{
          this.setAmount(item.rowIndex, bal);
          break;
        }
      // }
    }
  }

  isSelected(index){
    if(this._mode === Modes.All){
      return true;
    }

    if(this._mode === Modes.None){
      return false;
    }

    const invoice = this.getObjectAt(index);
    return typeof invoice['__selected'] !== 'undefined' ? invoice['__selected'] : false;
  }

  setSelected(index, state, reconcile = true) {
    const invoice = this.getObjectAt(index);
    invoice['__selected'] = state;
    if(reconcile){
      this._reconcileSelection();
    }
    return this;
  }

  toggle(index) {
    const item = this.getObjectAt(index);
    const val = typeof item['__selected'] !== 'undefined' ? !item['__selected'] : true;
    this.setSelected(index,  val);
    if(val){
      this.setAmount(index, item.invoice.balanceDue, false);
    }else{
      this.setAmount(index, undefined, false);
    }
    return this;
  }

  toggleAll() {
    this._mode = Modes.All;
    this._cache.forEach((item, index) => {
      this.setAmount(index, item.invoice.balanceDue);
      // delete item['__selected'];
    });
    return this;
  }

  toggleNone() {
    this._mode = Modes.None;
    this._cache.forEach((item, index) => {
      this.setAmount(index, undefined);
      // delete item['__selected'];
    });
    return this;
  }

  changeInvoices(invoices, _meta) {
    this.size = invoices.length;
    this._cache = invoices;
    // this._meta = _meta;
    // this.__origins = {
    //   rows: this._cache.slice().filter(({dirty}) => typeof dirty !== 'undefined' ? dirty : false),
    //   rowsById: this._cache.slice().reduce((rows, row) => {rows[row.id] = row; return rows;}, {}),
    //   size: this.size,
    // };
    // this._cache.forEach(({__existed, __selected}, index) => {
    //   if(__existed && typeof __selected === 'undefined'){
    //     this.setSelected(index, true, false/*reconcile*/);
    //   }
    // });
    this._reconcileSelection();
    return this;
  }

  get isEmpty(){
    return this.size === 0;
  }

  _reconcileSelection(){
    let selected = 0,
        notSelected = 0;

    for(let i = 0; i < this.size; i++){
      const {__selected} = this._cache[i];
      if(typeof __selected !== 'undefined'){
        __selected
          ? selected++
          : notSelected++;
      }else{
        notSelected++;
      }
    }

    if(selected === this.size){
      this._mode = Modes.All;
    }
    else if(notSelected === this.size){
      this._mode = Modes.None;
    }else{
      this._mode = Modes.Some;
    }
  }
}

// function isItemDirty(self, { id, amount, invoice: { id: invoiceId, date, total, amountReceived, balanceDue, }, }){
//   const old = self.__origins.rowsById[id];
//   return ! isEqual(
//     { id: old.id, amount: old.amount, invoice: { id: old.invoice.id, date: old.invoice.date, total: old.invoice.total, amountReceived: old.invoice.amountReceived, balanceDue: old.invoice.balanceDue, }, },
//     { id, amount, invoice: { id: invoiceId, date, total, amountReceived, balanceDue, }, }
//   );
// }

export const StoreProto = InvoiceItemDataListStore.prototype;
