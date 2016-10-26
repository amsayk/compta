import {createStore as _createStore, applyMiddleware, compose,} from 'redux';

import createMiddleware from './middleware/clientMiddleware';
import array from './middleware/array';
import rootReducer from './modules/reducer';

import {enableBatching,} from 'redux-batched-actions';

import logger from './logger';

// import { applyWorker } from 'redux-worker';

// const MyWorker = require('worker!./worker.js');

// const worker = new MyWorker();

export default function createStore() {

  const middleware = [
    createMiddleware(),
    array,
    logger,
  ];

  const enhancerWithWorker = compose(
  	// Middleware you want to use in development:
  	applyMiddleware(...middleware),
  	// applyWorker(worker),
  );

  const store = _createStore(enableBatching(rootReducer), {}, enhancerWithWorker);

  if(process.env.NODE_ENV !== 'production'){
    window.store = store;
  }

  // const finalCreateStore = applyMiddleware(...middleware)(_createStore);

  // const store = finalCreateStore(
  //   enableBatching(rootReducer)
  // );

  if (process.env.NODE_ENV !== 'production' && module.hot) {
    module.hot.accept('./modules/reducer', () => {
      const rootReducer = require('./modules/reducer');
      store.replaceReducer(enableBatching(rootReducer));
    });
  }

  return store;
}
