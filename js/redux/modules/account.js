import Relay from 'react-relay';

import AddCompanyMutation from '../../mutations/AddCompanyMutation';

const EDIT_START = 'compta/account/EDIT_START';
const EDIT_STOP = 'compta/account/EDIT_STOP';

const SAVE = 'compta/account/SAVE';
const SAVE_SUCCESS = 'compta/account/SAVE_SUCCESS';
const SAVE_FAIL = 'compta/account/SAVE_FAIL';

const initialState = {
  editing: {},
  saveError: {}
};

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
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
          [action.id]: false
        }
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
            defaultMessage: 'There was an unknown error. Please try again.',
          }
        }
      };
    default:
      return state;
  }
}

export function save({id, displayName, email,}) {
  return {
    types: [SAVE, SAVE_SUCCESS, SAVE_FAIL],
    id: id || 'NEW',
    promise: () => new Promise((resolve, reject) => {

      // TODO: update account info
      resolve({id, displayName, email,});

    })
  };
}

export function editStart(id) {
  return {type: EDIT_START, id};
}

export function editStop(id) {
  return {type: EDIT_STOP, id};
}
