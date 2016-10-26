import reducer from './modules/reducer';
import { createWorker } from 'redux-worker';

const worker = createWorker();
worker.registerReducer(reducer);
