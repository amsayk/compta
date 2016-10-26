import React, {Component, PropTypes} from 'react';

import styles from './Alert.scss';

import stopEvent from '../../utils/stopEvent';

import classnames from 'classnames';

import CSSModules from 'react-css-modules';

@CSSModules(styles, {allowMultiple: true})
export default class extends React.Component{
  static displayName = 'Alert';
  static propTypes = {
    type: PropTypes.oneOf([ 'error', 'info', 'warning' ]).isRequired,
    title: PropTypes.string.isRequired,
    onClose: PropTypes.func,
    children: PropTypes.node.isRequired,
  };
  static contextTypes = {

  }
  _close = (e) => {
    stopEvent(e);
    this.props.onClose && this.props.onClose();
  };
  render(){
    const { type, onClose, title, children, } = this.props;
    return (
      <div styleName={classnames('alert-view', {
        'alert-error': type === 'error',
        'alert-warn': type === 'warning',
        'alert-info': type === 'info',
      })}>
        <div styleName='alert-header'>
          <i styleName='secondary-color-sprite icon'></i><span styleName='title'>{title}:</span>{typeof onClose !== 'undefined' ? <i onClick={this._close} styleName={'close-sprite icon-close'}></i> : null}
        </div>
        <div styleName='alert-content'>{children}</div>
      </div>
    );
  }
}
