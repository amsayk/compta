import combineReducers from '../immutable/combineReducers';
import createReducer from '../immutable/createReducer';

import {
  createStore
} from 'redux';

const initialState = Immutable.Map();

const rootReducer = combineReducers({});

export default function createStore() {

  const store = createStore(rootReducer, initialState);
  return store;
}

