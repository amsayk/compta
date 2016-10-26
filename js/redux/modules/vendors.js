import Relay from 'react-relay';

import { actionTypes, } from 'redux-form';

import AddEmployeeMutation from '../../mutations/AddEmployeeMutation';
import AddVendorMutation from '../../mutations/AddVendorMutation';
import RemoveVendorMutation from '../../mutations/RemoveVendorMutation';
import AddCustomerMutation from '../../mutations/AddCustomerMutation';

const EDIT_START = 'compta/vendor/EDIT_START';
const EDIT_STOP = 'compta/vendor/EDIT_STOP';

const SAVE = 'compta/vendor/SAVE';
const SAVE_SUCCESS = 'compta/vendor/SAVE_SUCCESS';
const SAVE_FAIL = 'compta/vendor/SAVE_FAIL';

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
          case 'vendor':
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

export function del({
  vendor, company, viewer, }) {
  return {
    types: [SAVE, SAVE_SUCCESS, SAVE_FAIL],
    id: vendor.objectId,
    promise: () => new Promise((resolve, reject) => {

      Relay.Store.commitUpdate(new RemoveVendorMutation({
        vendor,
        company,
        viewer,
      }), {
        onSuccess: function ({removeVendor: {deletedVendorId}}) {
          resolve({id: deletedVendorId,});
        },
        onFailure: function (transaction) {
          const error = transaction.getError();
          reject({error});
        },
      });

    })
  };
}

export function save({id, type, fieldInfos, viewer, company,}) {
  return {
    types: [SAVE, SAVE_SUCCESS, SAVE_FAIL],
    id: id || 'NEW',
    promise: () => new Promise((resolve, reject) => {
      let Mutation = null;
      let fn = null;
      let edge = null;

       if(type === 'Vendor' || type === 2) {
         Mutation = AddVendorMutation;
         fn = 'addVendor';
         edge = 'vendorEdge';
       }
       else if(type === 'Customer' || type === 1) {
         Mutation = AddCustomerMutation;
         fn = 'addCustomer';
         edge = 'customerEdge';
       }
       else if(type === 'Employee' || type === 3) {
         Mutation = AddEmployeeMutation;
         fn = 'addEmployee';
         edge = 'employeeEdge';
       }else{
         throw 'save: Invalid type';
       }

      Relay.Store.commitUpdate(new Mutation({
        id,
        fieldInfos,
        company,
        viewer,
      }), {
        onSuccess: function ({[fn]: {[edge]: {node: {objectId, ...props,}}}}) {
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

export function editStart(id) {
  return {type: EDIT_START, id};
}

export function editStop(id) {
  return {type: EDIT_STOP, id};
}
