import React, {Component, PropTypes,} from 'react';

import classnames from 'classnames';

import CSSModules from 'react-css-modules';

import styles from '../AppSettings.scss';

@CSSModules(styles, {allowMultiple: true})
export default class extends Component{
  static displayName = 'BooleanOption';
  static propTypes = {
    id: PropTypes.string.isRequired,
    labelText: PropTypes.string.isRequired,
    disabled: PropTypes.bool.isRequired,
    value: PropTypes.bool.isRequired,
    onChange: PropTypes.func.isRequired,
  }

  _onClick = e => {
    const { value, onChange, disabled, } = this.props;

    if(disabled) return;

    e.stopPropagation();
    e.preventDefault();
    onChange(!value);
  };

  render(){
    const { id, labelText, value, onChange, disabled, } = this.props;
    const isChecked = value;
    return (

      <label className={classnames({
        'mdl-checkbox is-upgraded': true,
        'is-checked': isChecked,
        'is-disabled': disabled,
      })} onClick={this._onClick} htmlFor={id}>

        <input
          type='checkbox'
          id={id}
          value={isChecked}
          onChange={onChange}
          className='mdl-checkbox__input'
          checked={isChecked}
          />

        <span className='mdl-checkbox__label'>{labelText}</span>

        <span className='mdl-checkbox__focus-helper'></span>

        <span className='mdl-checkbox__box-outline'>
          <span className='mdl-checkbox__tick-outline'></span>
        </span>

      </label>
    );
  }
}
