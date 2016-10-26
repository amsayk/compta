import Relay from 'react-relay';

import { actionTypes, } from 'redux-form';

import AddEmployeeMutation from '../../mutations/AddEmployeeMutation';
import RemoveEmployeeMutation from '../../mutations/RemoveEmployeeMutation';

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

export function save({id, type, fieldInfos, viewer, company,}) {
  return {
    types: [SAVE, SAVE_SUCCESS, SAVE_FAIL],
    id: id || 'NEW',
    promise: () => new Promise((resolve, reject) => {

      Relay.Store.commitUpdate(new AddEmployeeMutation({
        id,
        fieldInfos,
        company,
        viewer,
      }), {
        onSuccess: function ({addEmployee: {employeeEdge: {node: {objectId, ...props,}}}}) {
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
  employee, company, viewer, }) {
  return {
    types: [SAVE, SAVE_SUCCESS, SAVE_FAIL],
    id: employee.objectId,
    promise: () => new Promise((resolve, reject) => {

      Relay.Store.commitUpdate(new RemoveEmployeeMutation({
        employee,
        company,
        viewer,
      }), {
        onSuccess: function ({removeEmployee: {deletedEmployeeId}}) {
          resolve({id: deletedEmployeeId,});
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
