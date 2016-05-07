/** @flow */

import Relay from 'react-relay';

import uid from '../../utils/uid';

import update from 'react-addons-update';

import isEqual from 'lodash.isequal';
import some from 'lodash.some';
// import pick from 'lodash.pick';

import moment from 'moment';

import { actionTypes, } from 'redux-form';

const DEFAULT_MIN_ROWS_SIZE = 2;

import AddInvoiceMutation from '../../mutations/AddInvoiceMutation';
import RemoveInvoiceMutation from '../../mutations/RemoveInvoiceMutation';

const SET_ACTIVE_ROW = 'compta/invoices/SET_ACTIVE_ROW';

const ADD_SOME_ROWS = 'compta/invoices/ADD_SOME_ROWS';

const EDIT_START = 'compta/invoices/EDIT_START';
const EDIT_STOP = 'compta/invoices/EDIT_STOP';

const CLEAR_ROW = 'compta/invoices/CLEAR_ROW';
const CLEAR_ALL_ROWS = 'compta/invoices/CLEAR_ALL_ROWS';
const RESET_LINES = 'compta/invoices/RESET_LINES';

const MOVE = 'compta/invoices/MOVE';

const SET_DATE = 'compta/invoices/SET_DATE';
const SET_ITEM = 'compta/invoices/SET_ITEM';
const SET_DESCRIPTION = 'compta/invoices/SET_DESCRIPTION';
const SET_QTY = 'compta/invoices/SET_QTY';
const SET_RATE = 'compta/invoices/SET_RATE';
// const SET_TAXABLE = 'compta/invoices/SET_TAXABLE';

const SAVE = 'compta/invoices/SAVE';
const SAVE_SUCCESS = 'compta/invoices/SAVE_SUCCESS';
const SAVE_FAIL = 'compta/invoices/SAVE_FAIL';

const REFRESH = 'compta/invoices/REFRESH';

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
          case 'invoice':
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
    case SET_DATE:
      return function () {
        const {editing: {[action.id]: store}} = state;
        return {
          ...state,
          editing: {
            ...state.editing,
            [action.id]: store.setDate(action.rowIndex, action.date),
          }
        };
      }();
    case SET_ITEM:
      return function () {
        const {editing: {[action.id]: store}} = state;
        return {
          ...state,
          editing: {
            ...state.editing,
            [action.id]: store.setItem(action.rowIndex, action.item),
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
    case SET_QTY:
      return function () {
        const {editing: {[action.id]: store}} = state;
        return {
          ...state,
          editing: {
            ...state.editing,
            [action.id]: store.setQty(action.rowIndex, action.qty),
          }
        };
      }();
    case SET_RATE:
      return function () {
        const {editing: {[action.id]: store}} = state;
        return {
          ...state,
          editing: {
            ...state.editing,
            [action.id]: store.setRate(action.rowIndex, action.rate),
          }
        };
      }();
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
          [action.id]: new InvoiceItemDataListStore(action.invoices, action.id === 'NEW' ? Math.max(DEFAULT_MIN_ROWS_SIZE, action.invoices.length) : action.invoices.length, undefined, action._meta),
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
  invoice, id, billingAddress, customer, _customer, items, discountType, discountValue, date, dueDate, memo, files, terms, company, viewer, }) {
  return {
    types: [SAVE, SAVE_SUCCESS, SAVE_FAIL],
    id: id || 'NEW',
    promise: () => new Promise((resolve, reject) => {

      Relay.Store.commitUpdate(new AddInvoiceMutation({
        invoice,
        id,
        billingAddress, customer, _customer, items, discountType, discountValue, date: moment(date).toDate(), dueDate: moment(dueDate).toDate(), memo, files, terms,
        company,
        viewer,
      }), {
        onSuccess: function ({addInvoice: {invoiceEdge: {node: {objectId, ...props,}}}}) {
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
  invoice, company, viewer, }) {
  return {
    types: [SAVE, SAVE_SUCCESS, SAVE_FAIL],
    id: invoice.objectId,
    promise: () => new Promise((resolve, reject) => {

      Relay.Store.commitUpdate(new RemoveInvoiceMutation({
        invoice,
        company,
        viewer,
      }), {
        onSuccess: function ({removeInvoice: {deletedInvoiceId}}) {
          resolve({id: deletedInvoiceId,});
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

export function editStart(id, invoices, _meta) {
  return {type: EDIT_START, id, invoices, _meta};
}

export function editStop(id) {
  return {type: EDIT_STOP, id,};
}

export function setDate(id, rowIndex, date) {
  return {type: SET_DATE, id, rowIndex, date,};
}
export function setItem(id, rowIndex, item) {
  return {type: SET_ITEM, id, rowIndex, item,};
}
export function setDescription(id, rowIndex, description) {
  return {type: SET_DESCRIPTION, id, rowIndex, description,};
}
export function setQty(id, rowIndex, qty) {
  return {type: SET_QTY, id, rowIndex, qty,};
}
export function setRate(id, rowIndex, rate) {
  return {type: SET_RATE, id, rowIndex, rate,};
}
// export function setTaxable(id, rowIndex, taxable) {
//   return {type: SET_TAXABLE, id, rowIndex, taxable,};
// }

export function refresh() {
  return {type: REFRESH,};
}

type ItemShape = {
  id?: string,
  index: number,
  date: ?Date,
  item: ?{id: string},
  qty: number,
  description: ?string,
  qty: number,
  rate: number,
  discountPart: {
    type: string,
    value: number,
  },
};

function itemGetDiscount(amount, spec/*{type, value}*/){
  switch (spec.type) {
    case 'Value':    return spec.value || 0.0;
    case 1:          return spec.value || 0.0;

    case 'Percent':  return amount * ((spec.value||0.0)/100);
    case 2:          return amount * ((spec.value||0.0)/100);
  }
}

function getTotalDiscount(subtotal, {type, value}){
  switch (type) {
    case 1:         return value || 0.0;
    case 'Value':   return value || 0.0;

    case 2:         return subtotal * ((value||0.0)/100);
    case 'Percent': return subtotal * ((value||0.0)/100);
  }
}

// function getTaxAmount(taxableSubtotal, {taxPercent}){
//   return taxableSubtotal * ((taxPercent || 0.0) / 100);
// }

class InvoiceItemDataListStore {
  constructor(
    invoices:Array<ItemShape>,
    size:number,
    activeRow?:?{rowIndex: number, cell?: ?string},
    _meta: {id: string, company: object}) {

    this.size = size;
    this._cache = invoices;
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
    // return ! isEqual(
    //   this.__origins.rows,
    //   this._cache.filter(({dirty}) => typeof dirty !== 'undefined' ? dirty : false)
    // );

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
      .filter(isCompletedInvoiceLine(this._meta))
      .reduce((sum, {qty, rate}) => sum + (qty * rate), 0.0);
  }

  getTaxableSubtotal({type, value}){
    const completedLines = this.getAll()
      .filter(isCompletedInvoiceLine(this._meta));

    const subtotal = completedLines
      .reduce((sum, {qty, rate}) => sum + (qty * rate), 0.0);
    const totalDiscount = getTotalDiscount(subtotal, {type, value});

    return completedLines
      .reduce((sum, { qty, rate, discountPart : itemDiscountPart, }) => {
        const amount = qty * rate;
        const itemDiscount = itemGetDiscount(amount, itemDiscountPart);
        const amountPercentage = (amount * 100 / subtotal);
        const discountPart = amountPercentage / 100 * totalDiscount;
        return sum + (amount - discountPart) - itemDiscount;
      }, 0.0);
  }

  getTotal({discountType, discountValue, }){
    const completedLines = this.getAll()
      .filter(isCompletedInvoiceLine(this._meta));

    const subtotal = completedLines
      .reduce((sum, {qty, rate}) => sum + (qty * rate), 0.0);
    const itemsTotalDiscount = completedLines
      .reduce((sum, { qty, rate, discountPart : itemDiscountPart, }) => {
        const amount = qty * rate;
        const itemDiscount = itemGetDiscount(amount, itemDiscountPart);
        return sum + itemDiscount;
      }, 0.0);

    const totalDiscount = getTotalDiscount(subtotal - itemsTotalDiscount, { type: discountType, value: discountValue, });

    const taxableSubtotal = completedLines
      .reduce((sum, { qty, rate, discountPart : itemDiscountPart, }) => {
        const amount = qty * rate;
        const itemDiscount = itemGetDiscount(amount, itemDiscountPart);
        const amountPercentage = (amount * 100 / subtotal);
        const discountPart = amountPercentage / 100 * totalDiscount;
        return sum + (amount - discountPart) - itemDiscount;
      }, 0.0);

    const total = subtotal - totalDiscount - itemsTotalDiscount;

    const taxAmount = 0; // getTaxAmount(taxableSubtotal, {});
    return total + taxAmount;
  }

  getTotalDiscount({ discountType, discountValue, }){
    const completedLines = this.getAll()
      .filter(isCompletedInvoiceLine(this._meta));

    const subtotal = completedLines
      .reduce((sum, {qty, rate}) => sum + (qty * rate), 0.0);

    const itemsTotalDiscount = completedLines
      .reduce((sum, { qty, rate, discountPart : itemDiscountPart, }) => {
        const amount = qty * rate;
        const itemDiscount = itemGetDiscount(amount, itemDiscountPart);
        return sum + itemDiscount;
      }, 0.0);

    const totalDiscount = getTotalDiscount(subtotal - itemsTotalDiscount, { type: discountType, value: discountValue, });

    const total = totalDiscount + itemsTotalDiscount;

    return total;
  }

  get itemsTotalDiscount() {
    const completedLines = this.getAll()
      .filter(isCompletedInvoiceLine(this._meta));

    const itemsTotalDiscount = completedLines
      .reduce((sum, { qty, rate, discountPart : itemDiscountPart, }) => {
        const amount = qty * rate;
        const itemDiscount = itemGetDiscount(amount, itemDiscountPart);
        return sum + itemDiscount;
      }, 0.0);

    return itemsTotalDiscount;
  }

  static createRowObjectData():ItemShape {
    return {
      _id: uid.type('Invoice--O'),
      date: undefined,
      item: undefined,
      description: undefined,
      qty: 1,
      rate: 0.0,
      discountPart: { type: 'Value', value: 0.0, },

      pristine: true,
    };
  }

  getObjectAt(index:number):?ItemShape {
    if (index < 0 || index > this.size) {
      return undefined;
    }
    if(index === this.size){
      const el = InvoiceItemDataListStore.createRowObjectData();
      el.dirty = false;
      return el;
    }
    if (this._cache[index] === undefined) {
      this._cache[index] = InvoiceItemDataListStore.createRowObjectData();
    }
    const obj = this._cache[index];

    obj.dirty = isInvoiceDirty(this, this._cache[index]);

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
    const invoice = this._cache.filter(c => c.id === id || c._id === id)[0];

    return {
      invoice,
      index: this._cache.indexOf(invoice)
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
    const {invoices} = update({invoices: this._cache.slice()}, {
      invoices: {
        $splice: [
          [index, 1],
        ]
      }
    });

    this._cache = invoices;
    this.size = this._meta.id === 'NEW' ? Math.max(invoices.length, DEFAULT_MIN_ROWS_SIZE) : invoices.length;
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
    const invoice = this._cache[index];

    const {invoices} = update({invoices: this._cache.slice()}, {
      invoices: {
        $splice: [
          [index, 1],
          [atIndex, 0, invoice],
        ]
      }
    });

    this._cache = invoices;
    return this;
  }

  setDate(index, date){
    this.setShowErrors(false);

    const invoice = this.getObjectAt(index);
    invoice['date'] = date;

    invoice['pristine'] = false;
    return this;
  }

  setItem(index, item){
    this.setShowErrors(false);

    const invoice = this.getObjectAt(index);
    invoice['item'] = item;

    invoice['pristine'] = false;
    return this;
  }

  setDescription(index, description){
    this.setShowErrors(false);

    const invoice = this.getObjectAt(index);
    invoice['description'] = description;

    invoice['pristine'] = false;
    return this;
  }

  setQty(index, qty){
    this.setShowErrors(false);

    const invoice = this.getObjectAt(index);
    invoice['qty'] = qty;

    invoice['pristine'] = false;
    return this;
  }

  setRate(index, rate){
    this.setShowErrors(false);

    const invoice = this.getObjectAt(index);
    invoice['rate'] = rate;

    invoice['pristine'] = false;
    return this;
  }

  // setTaxable(index, taxable){
  //   this.setShowErrors(false);
  //
  //   const invoice = this.getObjectAt(index);
  //   invoice['taxable'] = taxable;
  //
  //   invoice['pristine'] = false;
  //   return this;
  // }

  setDiscountPart(index, { type, value, }){
    this.setShowErrors(false);

    const sale = this.getObjectAt(index);
    sale['discountPart'] = { type, value, };

    sale['pristine'] = false;
    return this;
  }

  isKeyValid(rowIndex, key){
    const invoice = this.getObjectAt(rowIndex);

    switch (key) {
      case 'item':
        return invoice.rate > 0 ? !!invoice.description || !!invoice.item : true;

      case 'description':
        return invoice.rate > 0 ? !!invoice.item || !!invoice.description : true;

      case 'rate':
        return !!invoice.item || !!invoice.description ? invoice.rate > 0 : true;

      default:
        return true;
    }
  }

  isValid(invoice){ // invoice is dirty
    console.assert(invoice.dirty, 'Call this method only on dirty lines');

    const {showProducts, showRates,} = this._meta.company.salesSettings;

    if(showProducts ? !!invoice.description || !!invoice.item : !!invoice.description){
    }else{
      return {field: showProducts ? (typeof invoice.item === 'undefined' ? 'item' : 'description') : 'description', valid: false};
    }

    if(invoice.rate > 0){
    }else{
      return {field: showRates ? 'rate' : 'amount', valid: false};
    }

    if(invoice.qty > 0){
    }else{
      return {field: 'qty', valid: false};
    }

    return {valid: true};
  }
}

function isCompletedInvoiceLine({ company: {salesSettings: {id, showProducts}} }){

  if(id === 'NEW'){
    return ({item, description, qty, rate, dirty}) => dirty ? (showProducts ? !!item || !!description : !!description) && rate > 0 && qty > 0 : false;
  }

  return ({ id, __dataID__, objectId, item, description, qty, rate, dirty}) => {
    if(objectId || id || __dataID__){
      return dirty ? (showProducts ? !!item || !!description : !!description) && rate > 0 && qty > 0 : true;
    }
    return dirty ? (showProducts ? !!item || !!description : !!description) && rate > 0 && qty > 0 : false;
  };
}

function isInvoiceDirty(self, {id, date, item, description, qty, rate}){

  if(id){
    const old = self.__origins.rowsById[id];
    return ! isEqual(
      {date: old.date, item: old.item ? {id: old.item.id} : {}, description: old.description, qty: old.qty, rate: old.rate,},
      {date, item: item ? {id: item.id} : {}, description, qty, rate,}
    )
  }

  return date !== undefined || item !== undefined || description !== undefined || qty !== 1 || rate !== 0.0;
}
