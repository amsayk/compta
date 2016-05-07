import alt from '../../alt';
import Actions from './actions';

class Store {
  constructor() {
    this.message = null;
    this.resolve = null;
    this.reject = null;
    this.bindListeners({
      onSure: [Actions.sure],
      onShow: [Actions.show],
      onCancel: [Actions.cancel],
    });
  }
  onSure() {
    this.message = null;
    this.resolve();
  }
  onShow({message, resolve, reject}) {
    this.message = message;
    this.resolve = resolve;
    this.reject = reject
  }
  onCancel() {
    this.message = null;
    this.reject();
  }
}

export default alt.createStore(Store, 'ConfirmationsStore');
