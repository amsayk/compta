import Relay from 'react-relay';

const EDIT_START = 'compta/account/EDIT_START';
const EDIT_STOP = 'compta/account/EDIT_STOP';

const SAVE = 'compta/account/SAVE';
const SAVE_SUCCESS = 'compta/account/SAVE_SUCCESS';
const SAVE_FAIL = 'compta/account/SAVE_FAIL';

import { actionTypes, } from 'redux-form';
import UpdateAccountMutation from "../../mutations/UpdateAccountMutation";
import PasswordMutation from "../../mutations/PasswordMutation";

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
          case 'account':
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
            id: 'account-form.error.unknown',
            description: '',
            defaultMessage: 'Erreur inconnu. Veuillez essayer de nouveau.',
          }
        }
      };
    default:
      return state;
  }
}

export function save({displayName, email, viewer,}) {
  const id = viewer.objectId;
  return {
    types: [SAVE, SAVE_SUCCESS, SAVE_FAIL],
    id: id,
    promise: () => new Promise((resolve, reject) => {

      Relay.Store.commitUpdate(new UpdateAccountMutation({
        id,
        displayName,
        email,
        sessionToken: viewer.sessionToken,
        viewer,
      }), {
        onSuccess: function ({updateAccount: {viewer: {...props}}}) {
          resolve({...props});
        },
        onFailure: function (transaction) {
          const error = transaction.getError();
          reject({error});
        },
      });

    })
  };
}

export function changePassword({currentPassword, newPassword, viewer,}) {
  const id = viewer.objectId;
  return {
    types: [SAVE, SAVE_SUCCESS, SAVE_FAIL],
    id: id,
    promise: () => new Promise((resolve, reject) => {

      Relay.Store.commitUpdate(new PasswordMutation({
        id,
        type: 'change',
        currentPassword,
        password: newPassword,
        sessionToken: viewer.sessionToken,
        viewer,
      }), {
        onSuccess: function ({changePassword: {viewer: {...props}}}) {
          resolve({...props});
        },
        onFailure: function (transaction) {
          const error = transaction.getError();
          reject({error});
        },
      });

    })
  };
}

export function setPassword({newPassword, viewer,}) {
  const id = viewer.objectId;
  return {
    types: [SAVE, SAVE_SUCCESS, SAVE_FAIL],
    id: id,
    promise: () => new Promise((resolve, reject) => {

      Relay.Store.commitUpdate(new PasswordMutation({
        id,
        type: 'set',
        password: newPassword,
        sessionToken: viewer.sessionToken,
        viewer,
      }), {
        onSuccess: function ({setPassword: {viewer: {...props}}}) {
          resolve({...props});
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
