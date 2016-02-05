import Relay from 'react-relay';

import AddCompanyMutation from '../../mutations/AddCompanyMutation';

const EDIT_START = 'compta/company/EDIT_START';
const EDIT_STOP = 'compta/company/EDIT_STOP';

const SAVE = 'compta/company/SAVE';
const SAVE_SUCCESS = 'compta/company/SAVE_SUCCESS';
const SAVE_FAIL = 'compta/company/SAVE_FAIL';

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

export function save({id, displayName, periodType, viewer, root,}) {
  return {
    types: [SAVE, SAVE_SUCCESS, SAVE_FAIL],
    id: id || 'NEW',
    promise: () => new Promise((resolve, reject) => {

      Relay.Store.commitUpdate(new AddCompanyMutation({
        displayName,
        periodType,
        viewer,
        root,
      }), {
        onSuccess: function ({addCompany: { companyEdge: { node: {id}}}}) {
          resolve({id});
        },
        onFailure: function (transaction) {
          reject({error: transaction.getError()});
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
