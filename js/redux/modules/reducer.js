import { combineReducers } from 'redux';

import {reducer as form} from 'redux-form';
import companies from './companies';
import account from './account';
import transactions from './transactions';
import settings from './settings';

export default combineReducers({
  form,
  companies,
  account,
  transactions,
  settings,
});
