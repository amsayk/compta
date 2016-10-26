import alt from '../../alt';
import Actions from './actions';

class Store {
  constructor() {
    this.loading = false;
    this.bindListeners({
      onShow: [Actions.show],
      onHide: [Actions.hide],
    });
  }
  onShow() {
    this.loading = true;
  }
  onHide() {
    this.loading = false;
  }
}

export default alt.createStore(Store, 'LoadingStore');
