import React  from 'react';
import ReactDOM  from 'react-dom';

module.exports = {

  findDOMNode(component){
    return ReactDOM.findDOMNode(component);
  },

  batchedUpdates(cb) {
    ReactDOM.unstable_batchedUpdates(cb);
  },

};
