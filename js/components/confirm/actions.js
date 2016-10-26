import alt from '../../alt';

class Actions {
  show(message) {
    return (dispatch) => new Promise((resolve, reject) => {
      dispatch({message: message, resolve: resolve, reject: reject});
    });
  };
  cancel() {
    return (dispatch) => dispatch();
  }
  sure() {
    return (dispatch) => dispatch();
  }
}

export default alt.createActions(Actions);
