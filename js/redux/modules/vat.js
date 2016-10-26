import Relay from 'react-relay';

import SetupVATMutation from '../../mutations/SetupVATMutation';

const EDIT_START = 'compta/VAT/EDIT_START';
const EDIT_STOP = 'compta/VAT/EDIT_STOP';

const SAVE = 'compta/VAT/SAVE';
const SAVE_SUCCESS = 'compta/VAT/SAVE_SUCCESS';
const SAVE_FAIL = 'compta/VAT/SAVE_FAIL';

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
          case 'VAT':
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
        },
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

export function setupVAT({ agency, frequency, startDate, regime, IF, company, viewer,}) {
  return {
    types: [SAVE, SAVE_SUCCESS, SAVE_FAIL],
    promise: () => new Promise((resolve, reject) => {

      Relay.Store.commitUpdate(new SetupVATMutation({
        agency, frequency, startDate, regime, IF,
        company,
        viewer,
      }), {
        onSuccess: function ({setupVAT: { company: { ...props, }}}) {
          resolve({...props});
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
