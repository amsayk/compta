/** @flow */

import Relay from 'react-relay';

import uid from '../../utils/uid';

import update from 'react-addons-update';

import isEqual from 'lodash.isequal';
import some from 'lodash.some';
// import pick from 'lodash.pick';

import { actionTypes, } from 'redux-form';

import moment from 'moment';

const DEFAULT_MIN_ROWS_SIZE = 2;

import AddSaleMutation from '../../mutations/AddSaleMutation';
import RemoveSaleMutation from '../../mutations/RemoveSaleMutation';

const SET_ACTIVE_ROW = 'compta/sales/SET_ACTIVE_ROW';

const ADD_SOME_ROWS = 'compta/sales/ADD_SOME_ROWS';

const EDIT_START = 'compta/sales/EDIT_START';
const EDIT_STOP = 'compta/sales/EDIT_STOP';

const CLEAR_ROW = 'compta/sales/CLEAR_ROW';
const CLEAR_ALL_ROWS = 'compta/sales/CLEAR_ALL_ROWS';
const RESET_LINES = 'compta/sales/RESET_LINES';

const MOVE = 'compta/sales/MOVE';

const SET_DATE = 'compta/sales/SET_DATE';
const SET_ITEM = 'compta/sales/SET_ITEM';
const SET_DESCRIPTION = 'compta/sales/SET_DESCRIPTION';
const SET_QTY = 'compta/sales/SET_QTY';
const SET_RATE = 'compta/sales/SET_RATE';
// const SET_TAXABLE = 'compta/sales/SET_TAXABLE';

const SAVE = 'compta/sales/SAVE';
const SAVE_SUCCESS = 'compta/sales/SAVE_SUCCESS';
const SAVE_FAIL = 'compta/sales/SAVE_FAIL';

const REFRESH = 'compta/sales/REFRESH';

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
          case 'sale':
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
          [action.id]: new SaleItemDataListStore(action.sales, action.id === 'NEW' ? Math.max(DEFAULT_MIN_ROWS_SIZE, action.sales.length) : action.sales.length, undefined, action._meta),
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
  sale, id, billingAddress, customer, _customer, depositToAccountCode, items, paymentMethod, paymentRef, discountType, discountValue, date, memo, files, company, viewer, }) {
  return {
    types: [SAVE, SAVE_SUCCESS, SAVE_FAIL],
    id: id || 'NEW',
    promise: () => new Promise((resolve, reject) => {

      Relay.Store.commitUpdate(new AddSaleMutation({
        sale,
        id,
        items,
        billingAddress, customer, _customer, depositToAccountCode, paymentMethod, paymentRef, discountType, discountValue, date: moment(date).toDate(), memo, files,
        company,
        viewer,
      }), {
        onSuccess: function ({addSale: {saleEdge: {node: {objectId, ...props,}}}}) {
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
  sale, company, viewer, }) {
  return {
    types: [SAVE, SAVE_SUCCESS, SAVE_FAIL],
    id: sale.objectId,
    promise: () => new Promise((resolve, reject) => {

      Relay.Store.commitUpdate(new RemoveSaleMutation({
        sale,
        company,
        viewer,
      }), {
        onSuccess: function ({removeSale: {deletedSaleId}}) {
          resolve({id: deletedSaleId,});
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

export function editStart(id, sales, _meta) {
  return {type: EDIT_START, id, sales, _meta};
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

class SaleItemDataListStore {
  constructor(
    sales:Array<ItemShape>,
    size:number,
    activeRow?:?{rowIndex: number, cell?: ?string},
    _meta: {id: string, company: object}) {

    this.size = size;
    this._cache = sales;
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
      .filter(isCompletedSaleLine(this._meta))
      .reduce((sum, {qty, rate}) => sum + (qty * rate), 0.0);
  }

  get itemsTotalDiscount() {
    const completedLines = this.getAll()
      .filter(isCompletedSaleLine(this._meta));

    const itemsTotalDiscount = completedLines
      .reduce((sum, { item, qty, rate, discountPart : itemDiscountPart, }) => {
        const amount = qty * rate;
        const itemDiscount = itemGetDiscount(amount, itemDiscountPart);
        return sum + itemDiscount;
      }, 0.0);

    return itemsTotalDiscount;
  }

  getTaxableSubtotal({type, value}){
    const completedLines = this.getAll()
      .filter(isCompletedSaleLine(this._meta));

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

  getTotal({ discountType, discountValue, }){
    const completedLines = this.getAll()
      .filter(isCompletedSaleLine(this._meta));

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
      .filter(isCompletedSaleLine(this._meta));

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

  static createRowObjectData():ItemShape {
    return {
      _id: uid.type('Sale--O'),
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
      const el = SaleItemDataListStore.createRowObjectData();
      el.dirty = false;
      return el;
    }
    if (this._cache[index] === undefined) {
      this._cache[index] = SaleItemDataListStore.createRowObjectData();
    }
    const obj = this._cache[index];

    obj.dirty = isSaleDirty(this, this._cache[index]);

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
    const sale = this._cache.filter(c => c.id === id || c._id === id)[0];

    return {
      sale,
      index: this._cache.indexOf(sale)
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
    const {sales} = update({sales: this._cache.slice()}, {
      sales: {
        $splice: [
          [index, 1],
        ]
      }
    });

    this._cache = sales;
    this.size = this._meta.id === 'NEW' ? Math.max(sales.length, DEFAULT_MIN_ROWS_SIZE) : sales.length;
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
    const sale = this._cache[index];

    const {sales} = update({sales: this._cache.slice()}, {
      sales: {
        $splice: [
          [index, 1],
          [atIndex, 0, sale],
        ]
      }
    });

    this._cache = sales;
    return this;
  }

  setDate(index, date){
    this.setShowErrors(false);

    const sale = this.getObjectAt(index);
    sale['date'] = date;

    sale['pristine'] = false;
    return this;
  }


  setItem(index, item){
    this.setShowErrors(false);

    const sale = this.getObjectAt(index);
    sale['item'] = item;

    sale['pristine'] = false;
    return this;
  }

  setDescription(index, description){
    this.setShowErrors(false);

    const sale = this.getObjectAt(index);
    sale['description'] = description;

    sale['pristine'] = false;
    return this;
  }

  setQty(index, qty){
    this.setShowErrors(false);

    const sale = this.getObjectAt(index);
    sale['qty'] = qty;

    sale['pristine'] = false;
    return this;
  }

  setRate(index, rate){
    this.setShowErrors(false);

    const sale = this.getObjectAt(index);
    sale['rate'] = rate;

    sale['pristine'] = false;
    return this;
  }

  // setTaxable(index, taxable){
  //   this.setShowErrors(false);
  //
  //   const sale = this.getObjectAt(index);
  //   sale['taxable'] = taxable;
  //
  //   sale['pristine'] = false;
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
    const sale = this.getObjectAt(rowIndex);

    switch (key) {
      case 'item':
        return sale.rate > 0 ? !!sale.description || !!sale.item : true;

      case 'description':
        return sale.rate > 0 ? !!sale.item || !!sale.description : true;

      case 'rate':
        return !!sale.item || !!sale.description ? sale.rate > 0 : true;

      default:
        return true;
    }
  }

  isValid(sale){ // sale is dirty
    console.assert(sale.dirty, 'Call this method only on dirty lines');

    const {showProducts, showRates,} = this._meta.company.salesSettings;

    if(showProducts ? !!sale.description || !!sale.item : !!sale.description){
    }else{
      return {field: showProducts ? (typeof sale.item === 'undefined' ? 'item' : 'description') : 'description', valid: false};
    }

    if(sale.rate > 0){
    }else{
      return {field: showRates ? 'rate' : 'amount', valid: false};
    }

    if(sale.qty > 0){
    }else{
      return {field: 'qty', valid: false};
    }

    return {valid: true};
  }
}

function isCompletedSaleLine({ company: {salesSettings: {id, showProducts}} }){

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

function isSaleDirty(self, {id, date, item, description, qty, rate, }){

  if(id){
    const old = self.__origins.rowsById[id];
    return ! isEqual(
      {date: old.date, item: old.item ? {id: old.item.id} : {}, description, qty, rate, },
      {date, item: item ? {id: item.id} : {}, description, qty, rate, }
    )
  }

  return date !== undefined || item !== undefined || description !== undefined || qty !== 1 || rate !== 0.0;
}
