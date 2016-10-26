import Relay from 'react-relay';

import AddProductMutation from '../../mutations/AddProductMutation';
import RemoveProductMutation from '../../mutations/RemoveProductMutation';

const EDIT_START = 'compta/product/EDIT_START';
const EDIT_STOP = 'compta/product/EDIT_STOP';

const SAVE = 'compta/product/SAVE';
const SAVE_SUCCESS = 'compta/product/SAVE_SUCCESS';
const SAVE_FAIL = 'compta/product/SAVE_FAIL';

import { actionTypes, } from 'redux-form';

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
          case 'product':
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
    case EDIT_START:
      return {
        ...state,
        editing: {
          ...state.editing,
          [action.id]: true
        }
      };
    case EDIT_STOP:
      return {
        ...state,
        editing: {
          ...state.editing,
          [action.id]: false,
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
        editing: {
          ...state.editing,
          [action.id]: false
        },
        saveError: {
          ...state.saveError,
          [action.id]: null
        }
      };
    case SAVE_FAIL:
      return {
        ...state,
        saveError: {
          ...state.saveError,
          [action.id]: {
            _id: 'error.unknown',
            description: '',
            defaultMessage: 'Erreur inconnu. Veuillez essayer de nouveau.',
          }
        }
      };
    default:
      return state;
  }
}

export function save({id, fieldInfos, image, viewer, company,}) {
  return {
    types: [SAVE, SAVE_SUCCESS, SAVE_FAIL],
    id: id || 'NEW',
    promise: () => new Promise((resolve, reject) => {
      Relay.Store.commitUpdate(new AddProductMutation({
        id,
        image,
        fieldInfos,
        company,
        viewer,
      }), {
        onSuccess: function ({addProduct: {productEdge: {node: {objectId, ...props,}}}}) {
          resolve({...props, id: objectId,});
        },
        onFailure: function (transaction) {
          const error = transaction.getError();
          reject({error});
        },
      });

    }),
  };
}

export function del({
  product, company, viewer, }) {
  return {
    types: [SAVE, SAVE_SUCCESS, SAVE_FAIL],
    id: product.objectId,
    promise: () => new Promise((resolve, reject) => {

      Relay.Store.commitUpdate(new RemoveProductMutation({
        product,
        company,
        viewer,
      }), {
        onSuccess: function ({removeProduct: {deletedProductId}}) {
          resolve({id: deletedProductId,});
        },
        onFailure: function (transaction) {
          const error = transaction.getError();
          reject({error});
        },
      });

    })
  };
}

export function editStart(id) {
  return {type: EDIT_START, id};
}

export function editStop(id) {
  return {type: EDIT_STOP, id};
}
