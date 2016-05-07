import Relay from 'react-relay';

import AddCompanyMutation from '../../mutations/AddCompanyMutation';
import UpdateCompanyMutation from '../../mutations/UpdateCompanyMutation';
import UpdateCompanySettingsMutation from '../../mutations/UpdateCompanySettingsMutation';
import UpdateCompanySalesSettingsMutation from '../../mutations/UpdateCompanySalesSettingsMutation';
import UpdateCompanyExpensesSettingsMutation from '../../mutations/UpdateCompanyExpensesSettingsMutation';
import UpdateCompanyPaymentsSettingsMutation from '../../mutations/UpdateCompanyPaymentsSettingsMutation';

const EDIT_START = 'compta/company/EDIT_START';
const EDIT_STOP = 'compta/company/EDIT_STOP';

const SAVE = 'compta/company/SAVE';
const SAVE_SUCCESS = 'compta/company/SAVE_SUCCESS';
const SAVE_FAIL = 'compta/company/SAVE_FAIL';

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
          case 'company':
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
            defaultMessage: 'There was an unknown error. Please try again.',
          }
        }
      };
    default:
      return state;
  }
}

export function save({id, displayName, periodType, viewer,}) {
  return {
    types: [SAVE, SAVE_SUCCESS, SAVE_FAIL],
    id: id || 'NEW',
    promise: () => new Promise((resolve, reject) => {

      Relay.Store.commitUpdate(new AddCompanyMutation({
        displayName,
        periodType,
        viewer,
      }), {
        onSuccess: function ({addCompany: {companyEdge: {node: {id}}}}) {
          resolve({id});
        },
        onFailure: function (transaction) {
          const error = transaction.getError();
          reject({error});
        },
      });


    }),
  };
}

export function update({id, fieldInfos, viewer, company,}) {
  return {
    types: [SAVE, SAVE_SUCCESS, SAVE_FAIL],
    id: id,
    promise: () => new Promise((resolve, reject) => {

      Relay.Store.commitUpdate(new UpdateCompanyMutation({
        id,
        fieldInfos,
        sessionToken: viewer.sessionToken,
        company,
      }), {
        onSuccess: function ({updateCompany: {company: {id}}}) {
          resolve({id});
        },
        onFailure: function (transaction) {
          const error = transaction.getError();
          reject({error});
        },
      });


    }),
  };
}

export function updateSettings({id, fieldInfos, viewer, company,}) {
  return {
    types: [SAVE, SAVE_SUCCESS, SAVE_FAIL],
    id: id,
    promise: () => new Promise((resolve, reject) => {

      Relay.Store.commitUpdate(new UpdateCompanySettingsMutation({
        id,
        settings: fieldInfos.reduce((settings, {fieldName, value}) => { settings[fieldName] = value; return settings; }, {}),
        sessionToken: viewer.sessionToken,
        company,
      }), {
        onSuccess: function ({updateCompanySettings: {company: {id}}}) {
          resolve({id});
        },
        onFailure: function (transaction) {
          const error = transaction.getError();
          reject({error});
        },
      });


    }),
  };
}

export function updateSalesSettings({id, fieldInfos, viewer, company,}) {
  return {
    types: [SAVE, SAVE_SUCCESS, SAVE_FAIL],
    id: id,
    promise: () => new Promise((resolve, reject) => {

      Relay.Store.commitUpdate(new UpdateCompanySalesSettingsMutation({
        id,
        settings: fieldInfos.reduce((settings, {fieldName, value}) => { settings[fieldName] = value; return settings; }, {}),
        sessionToken: viewer.sessionToken,
        company,
      }), {
        onSuccess: function ({updateCompanySalesSettings: {company: {id}}}) {
          resolve({id});
        },
        onFailure: function (transaction) {
          const error = transaction.getError();
          reject({error});
        },
      });


    }),
  };
}

export function updateExpensesSettings({id, fieldInfos, viewer, company,}) {
  return {
    types: [SAVE, SAVE_SUCCESS, SAVE_FAIL],
    id: id,
    promise: () => new Promise((resolve, reject) => {

      Relay.Store.commitUpdate(new UpdateCompanyExpensesSettingsMutation({
        id,
        settings: fieldInfos.reduce((settings, {fieldName, value}) => { settings[fieldName] = value; return settings; }, {}),
        sessionToken: viewer.sessionToken,
        company,
      }), {
        onSuccess: function ({updateCompanyExpensesSettings: {company: {id}}}) {
          resolve({id});
        },
        onFailure: function (transaction) {
          const error = transaction.getError();
          reject({error});
        },
      });


    }),
  };
}

export function updatePaymentsSettings({id, fieldInfos, viewer, company,}) {
  return {
    types: [SAVE, SAVE_SUCCESS, SAVE_FAIL],
    id: id,
    promise: () => new Promise((resolve, reject) => {

      Relay.Store.commitUpdate(new UpdateCompanyPaymentsSettingsMutation({
        id,
        settings: fieldInfos.reduce((settings, {fieldName, value}) => { settings[fieldName] = value; return settings; }, {}),
        sessionToken: viewer.sessionToken,
        company,
      }), {
        onSuccess: function ({updateCompanyPaymentsSettings: {company: {id}}}) {
          resolve({id});
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
