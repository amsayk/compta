import React, { Component, PropTypes } from 'react';
import connectToStores from 'alt-utils/lib/connectToStores';

import Store from './store';
import Actions from './actions';

import CSSModules from 'react-css-modules';

import styles from './Loading.scss';

@connectToStores
@CSSModules(styles, {allowMultiple: true})
export default class extends React.Component {
  static displayName = 'Loading.global';
  static propTypes = {
  };
  static getStores() {
    return [Store];
  }
  static getPropsFromStores() {
    return Store.getState();
  }
  render () {
    const { loading, } = this.props;
    return loading ? (
      <div styleName='loading-spinner loading-spinner--global' className='loading-spinner'>

        <div className='mdl-spinner mdl-js-spinner is-active is-upgraded'
             data-upgraded=',MaterialSpinner'>
          <div className='mdl-spinner__layer mdl-spinner__layer-1'>
            <div className='mdl-spinner__circle-clipper mdl-spinner__left'>
              <div className='mdl-spinner__circle'></div>
            </div>
            <div className='mdl-spinner__gap-patch'>
              <div className='mdl-spinner__circle'></div>
            </div>
            <div className='mdl-spinner__circle-clipper mdl-spinner__right'>
              <div className='mdl-spinner__circle'></div>
            </div>
          </div>
          <div className='mdl-spinner__layer mdl-spinner__layer-2'>
            <div className='mdl-spinner__circle-clipper mdl-spinner__left'>
              <div className='mdl-spinner__circle'></div>
            </div>
            <div className='mdl-spinner__gap-patch'>
              <div className='mdl-spinner__circle'></div>
            </div>
            <div className='mdl-spinner__circle-clipper mdl-spinner__right'>
              <div className='mdl-spinner__circle'></div>
            </div>
          </div>
          <div className='mdl-spinner__layer mdl-spinner__layer-3'>
            <div className='mdl-spinner__circle-clipper mdl-spinner__left'>
              <div className='mdl-spinner__circle'></div>
            </div>
            <div className='mdl-spinner__gap-patch'>
              <div className='mdl-spinner__circle'></div>
            </div>
            <div className='mdl-spinner__circle-clipper mdl-spinner__right'>
              <div className='mdl-spinner__circle'></div>
            </div>
          </div>
          <div className='mdl-spinner__layer mdl-spinner__layer-4'>
            <div className='mdl-spinner__circle-clipper mdl-spinner__left'>
              <div className='mdl-spinner__circle'></div>
            </div>
            <div className='mdl-spinner__gap-patch'>
              <div className='mdl-spinner__circle'></div>
            </div>
            <div className='mdl-spinner__circle-clipper mdl-spinner__right'>
              <div className='mdl-spinner__circle'></div>
            </div>
          </div>
        </div>
      </div>
    ) : null;
  }
}
