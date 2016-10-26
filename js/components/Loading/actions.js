import alt from '../../alt';

class Actions {
  show() {
    return (dispatch) => dispatch({ loading: true, });
  };
  hide() {
    return (dispatch) => dispatch({ loading: false, });
  }
}

export default alt.createActions(Actions);
