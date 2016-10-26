/** @flow */

import Relay from 'react-relay';

import uid from '../../../utils/uid';

import update from 'react-addons-update';

import isEqual from 'lodash.isequal';
import some from 'lodash.some';
// import pick from 'lodash.pick';

import { actionTypes, } from 'redux-form';

import moment from 'moment';

import pick from 'lodash.pick';

import deepEqual from 'deep-equal';
import deepCopy from 'deep-copy';

const DEFAULT_MIN_ROWS_SIZE = 2;

import AddSaleMutation from '../../../mutations/v2/AddSaleMutation';
import RemoveSaleMutation from '../../../mutations/v2/RemoveSaleMutation';

import {
  fromGlobalId,
} from 'graphql-relay';

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
const SET_VAT_PART = 'compta/sales/SET_VAT_PART';

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
  sale, id, billingAddress, customer, _customer, depositToAccountCode, inputType, items, paymentMethod, paymentRef, discountType, discountValue, date, memo, files, company, viewer, }) {
  return {
    types: [SAVE, SAVE_SUCCESS, SAVE_FAIL],
    id: id || 'NEW',
    promise: () => new Promise((resolve, reject) => {

      Relay.Store.commitUpdate(new AddSaleMutation({
        sale,
        id,
        items,
        billingAddress, customer, _customer, depositToAccountCode, inputType, paymentMethod, paymentRef, discountType, discountValue, date: moment(date).toDate(), memo, files,
        company,
        viewer,
      }), {
        onSuccess: function ({addSale: {saleEdge: {node: { ...props,}}}}) {
          resolve({ ...props, itemsConnection : props.saleItemsConnection, });
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
export function setVATPart(id, rowIndex, VATPart) {
  return {type: SET_VAT_PART, id, rowIndex, VATPart,};
}

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

const INPUT_TYPE_TO_ID = {
  HT: 1,
  TTC: 2,
  NO_VAT: 3,

  1: 1,
  2: 2,
  3: 3,
};

const VAT_NAME_TO_ID = {
  Value_20: 1,
  Value_14: 2,
  Value_10: 3,
  Value_Exempt: 4,
  Value_7: 5,

  1: 1,
  2: 2,
  3: 3,
  4: 4,
  5: 5,
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
      rowsById: _meta.id === 'NEW' ? {} : this._cache.slice().reduce((rows, row) => {rows[row.index] = deepCopy(row); return rows;}, {}),
      size: this.size,
    };
  }

  reInit(sales, _meta){
    this.size = sales.length;
    this._cache = sales;

    this._meta = _meta;

    this.getAll();

    this.__origins = {
      rows: this._cache.slice().filter(({dirty}) => typeof dirty !== 'undefined' ? dirty : false),
      rowsById: _meta.id === 'NEW' ? {} : this._cache.slice().reduce((rows, row) => {rows[row.index] = deepCopy(row); return rows;}, {}),
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

    const PROPS = [
      'index', 'objectId', 'id', 'date', 'item', 'VATPart', 'description', 'qty', 'rate'
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
      .filter(isCompletedSaleLine(this._meta))
      .reduce((sum, {qty, rate}) => sum + (qty * rate), 0.0);
  }

  getCompletedLines(){
    const completedLines = this.getAll()
      .filter(isCompletedSaleLine(this._meta));

    return completedLines;
  }

  getCompletedLinesWithValidVATPart(){
    const isComplete = isCompletedSaleLine(this._meta);

    const hasValidVATPart = item => item.VATPart && item.VATPart.value ? item.VATPart.value !== 'Value_Exempt' : false;

    const completedValidVATLines = this.getAll()
      .filter(i => isComplete(i) && hasValidVATPart(i));

    return completedValidVATLines;
  }

  getTotal({ discountType, discountValue, }){
    const completedLines = this.getAll()
      .filter(isCompletedSaleLine(this._meta));

    const subtotalHT = completedLines
      .reduce((sum, { qty, rate, VATPart : itemVATPart, }) => sum + itemGetAmount__HT(qty * rate, itemVATPart), 0.0);

    const itemsTotalDiscount = completedLines
      .reduce((sum, { qty, rate, discountPart : itemDiscountPart, VATPart : itemVATPart, }) => {

        const entryValue = qty * rate;

        const amountHT__BeforeDiscount = itemGetAmount__HT(entryValue, itemVATPart);

        const itemDiscount = itemGetDiscount(amountHT__BeforeDiscount, itemDiscountPart);

        return sum + itemDiscount;
      }, 0.0);

    const totalDiscount = getTotalDiscount(subtotalHT - itemsTotalDiscount, { type: discountType, value: discountValue, });

    const totalHT = subtotalHT - totalDiscount - itemsTotalDiscount;

    const totalTaxAmount = completedLines
      .reduce((sum, { qty, rate, discountPart : itemDiscountPart, VATPart : itemVATPart, }) => {

        const entryValue = qty * rate;

        const amountHT__BeforeDiscount = itemGetAmount__HT(entryValue, itemVATPart);

        const itemTotalDiscount = itemGetTotalDiscountPart(amountHT__BeforeDiscount, itemDiscountPart);

        const amountHT = amountHT__BeforeDiscount - itemTotalDiscount;

        function itemGetTotalDiscountPart(amountHT__BeforeDiscount, itemDiscountPart) {
          const itemDiscount = itemGetDiscount(amountHT__BeforeDiscount, itemDiscountPart);

          const amountPercentage = (amountHT__BeforeDiscount * 100 / subtotalHT);

          const discountPart = amountPercentage / 100 * totalDiscount;

          return itemDiscount + discountPart;
        }

        const taxableAmount = amountHT; // - itemTotalDiscount;

        return sum + itemGeVATPart__Amount(taxableAmount, itemVATPart);
      }, 0.0);

    return totalHT + totalTaxAmount;
  }

  getTotalDiscount({ discountType, discountValue, }){
    const completedLines = this.getAll()
      .filter(isCompletedSaleLine(this._meta));

    const subtotalHT = completedLines
      .reduce((sum, { qty, rate, VATPart : itemVATPart, }) => sum + itemGetAmount__HT(qty * rate, itemVATPart), 0.0);

    const itemsTotalDiscount = completedLines
      .reduce((sum, { qty, rate, discountPart : itemDiscountPart, VATPart : itemVATPart, }) => {

        const entryValue = qty * rate;

        const amountHT__BeforeDiscount = itemGetAmount__HT(entryValue, itemVATPart);

        const itemDiscount = itemGetDiscount(amountHT__BeforeDiscount, itemDiscountPart);

        return sum + itemDiscount;
      }, 0.0);

    const totalDiscount = getTotalDiscount(subtotalHT - itemsTotalDiscount, { type: discountType, value: discountValue, });

    const total = totalDiscount + itemsTotalDiscount;

    return total;
  }

  get itemsTotalDiscount() {
    const completedLines = this.getAll()
      .filter(isCompletedSaleLine(this._meta));

    const itemsTotalDiscount = completedLines
      .reduce((sum, { qty, rate, discountPart : itemDiscountPart, VATPart : itemVATPart, }) => {

        const entryValue = qty * rate;

        const amountHT__BeforeDiscount = itemGetAmount__HT(entryValue, itemVATPart);

        const itemDiscount = itemGetDiscount(amountHT__BeforeDiscount, itemDiscountPart);

        return sum + itemDiscount;
      }, 0.0);

    return itemsTotalDiscount;
  }

  reconcileInputType(inputType){
    const isGood = isCompletedSaleLine(this._meta);

    for (let i = 0; i < this.size; i++) {
      const el = this.getObjectAt(i);

      if(isGood(el)){

        const isNum = typeof el.item.salesPrice === 'number';

        if(el.item
          && el.item.salesVATPart
          && isNum
           // && isFinite(el.item.salesPrice)
         ){
          const item = el.item;
          const salesPrice = el.item.salesPrice;

          el.VATPart = el.VATPart && el.VATPart.inputType !== 4 ? {
            ...(item.salesVATPart && item.salesVATPart.value ? { value: item.salesVATPart.value, } : {}),
            inputType,
          } : undefined;

          const itemInputType = item['salesVATPart']
            ? INPUT_TYPE_TO_ID[item['salesVATPart'].inputType]
            : 1 /* HT */;

          function getItemPrice() {
            switch (inputType){
              case 1:
              case 'HT':
              case 3:
              case 'NO_VAT':

                return function () {
                  switch (itemInputType){
                    case 1:
                    case 'HT':
                    case 3:
                    case 'NO_VAT':

                      return salesPrice;

                    case 2:
                    case 'TTC':

                      // `item.salesPrice` is TTC, convert `item.salesPrice` to HT
                      return function() {
                        const itemVATValuePercent = item.salesVATPart
                          ? VAT_ID_TO_VALUE[item['salesVATPart'].value] || 0.0
                          : 0.0;

                        return salesPrice / (1 + itemVATValuePercent);
                      }();

                    default:

                      throw new Error(`getItemPrice: Invalid item inputType`, itemInputType);
                  }

                }();

              case 2:
              case 'TTC':

                return function () {
                  switch (itemInputType){
                    case 1:
                    case 'HT':
                    case 3:
                    case 'NO_VAT':

                      // `item.salesPrice` is HT, convert `item.salesPrice` to TTC
                      return function() {
                        const itemVATValuePercent = item.salesVATPart
                          ? VAT_ID_TO_VALUE[item['salesVATPart'].value] || 0.0
                          : 0.0;

                        return salesPrice * (1 + itemVATValuePercent);
                      }();

                    case 2:
                    case 'TTC':

                      return salesPrice;

                    default:

                      throw new Error(`getItemPrice: Invalid item inputType`, itemInputType);
                  }

                }();

              default:

                throw new Error(`getItemPrice: Invalid inputType`, inputType);
            }
          }

          el.rate = getItemPrice();

          el.amount = el.qty * el.rate;

        }else{

          el.VATPart = el.VATPart && el.VATPart.inputType !== 4 ? {
            ...(el.VATPart && el.VATPart.value ? { value: el.VATPart.value, } : {}),
            inputType,
          } : undefined;

        }
      }
    }
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

      VATPart: undefined,

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

  setVATPart(index, VATPart){
    this.setShowErrors(false);

    const sale = this.getObjectAt(index);
    sale['VATPart'] = VATPart;

    sale['pristine'] = false;
    return this;
  }

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

  hasItem(id){
    for(let i = 0; i < this.size; i++){
      const obj = this._cache[i];
      if(obj && obj.item && obj.item.objectId === id){
        return true;
      }
    }

    return false;
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

function isSaleDirty(self, { index, id, date, item, VATPart, description, qty, rate, }){

  if(id){
    const old = self.__origins.rowsById[index];
    return ! isEqual(
      {date: old.date, item: old.item ? {id: old.item.id} : {}, VATPart: old.VATPart, description, qty, rate, },
      {date, item: item ? {id: item.id} : {}, VATPart, description, qty, rate, }
    )
  }

  return date !== undefined || item !== undefined || description !== undefined || qty !== 1 || rate !== 0.0 || VATPart !== undefined;
}

export const StoreProto = SaleItemDataListStore.prototype;
