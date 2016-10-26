import React, { Component, PropTypes, } from 'react';

import CSSModules from 'react-css-modules';

import styles from './SearchBox.scss';

import stopEvent from '../../../utils/stopEvent';

import classnames from 'classnames';

import throttle from 'lodash.throttle';

import DropdownMenu from 'react-bootstrap/lib/DropdownMenu';
import MenuItem from 'react-bootstrap/lib/MenuItem';

import {
  intlShape,
} from 'react-intl';

@CSSModules(styles, {allowMultiple: true})
export default class extends React.Component{
  static displayName = 'SearchBox';
  static contextTypes = {
    intl: intlShape.isRequired,
  };
  state = {
    open: true,
  };
  static propTypes = {
  };
  _onInput = throttle(e => {
    stopEvent(e);

    if(this.props.topLoading){
      return;
    }

    const doWork = (resolve) => {
      this.props.onFilter(
        (this.refs.textInput.value || '').trim().toLowerCase(),
        resolve
      );
    };

    if(this._promise){
      this._promise.then(doWork);
    }else{
      this._promise = new Promise(doWork);
    }
  }, 150);
  render(){
    const { open, } = this.state;
    return(
      <div className={'quickfill qfComboBox dijitValidationTextBox'} styleName='dijitInline searchBox dijitTextBox dijitComboBox' role='combobox'>

        <input
          ref={'textInput'}
          className={'dijitInputInner'}
          styleName='dijitReset button'
          type='text'
          autoComplete='off'
          role='textbox'
          tabIndex='0'
          placeholder='Rechercher un produit ou service'
          onChange={this._onInput}
          onFocus={(e) => { stopEvent(e); }}
        />

        <div className={'dijitDownArrowButton'} styleName='dijitReset dijitButtonNode dijitArrowButton '>
          <div styleName='dropDownImage'></div>
        </div>

      </div>
    );
  }
}
