import Relay from 'react-relay';

import AddCompanyMutation from '../../mutations/AddCompanyMutation';

const EDIT_START = 'compta/app-settings/EDIT_START';
const EDIT_STOP = 'compta/app-settings/EDIT_STOP';

const SAVE = 'compta/app-settings/SAVE';
const SAVE_SUCCESS = 'compta/app-settings/SAVE_SUCCESS';
const SAVE_FAIL = 'compta/app-settings/SAVE_FAIL';

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
            id: 'error.unknown',
            description: '',
            defaultMessage: 'There was an unknown error. Please try again.',
          }
        }
      };
    default:
      return state;
  }
}

export function save({id, root,}) {
  return {
    types: [SAVE, SAVE_SUCCESS, SAVE_FAIL],
    id: id,
    promise: () => new Promise((resolve, reject) => {

      // TODO: save settings here!
      reject('NotImplemented');

    })
  };
}

export function editStart(id) {
  return {type: EDIT_START, id};
}

export function editStop(id) {
  return {type: EDIT_STOP, id};
}
