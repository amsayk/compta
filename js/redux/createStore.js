import { createStore as _createStore, applyMiddleware, } from 'redux';

import createMiddleware from './middleware/clientMiddleware';
import reducer from './modules/reducer';

export default function createStore(){

  const middleware = [ createMiddleware(), ];

  const finalCreateStore = applyMiddleware(...middleware)(_createStore);

  const store = finalCreateStore(reducer);

  if (process.env.NODE_ENV !== 'production' && module.hot) {
    module.hot.accept('./modules/reducer', () => {
      store.replaceReducer(require('./modules/reducer'));
    });
  }

  return store;
}
