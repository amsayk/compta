import React, { Component, PropTypes, } from 'react';
import ReactDOM from 'react-dom';

import Overlay from 'react-bootstrap/lib/Overlay';

import CSSModules from 'react-css-modules';

import classnames from 'classnames';

import stopEvent from '../../utils/stopEvent';

import styles from './OverlayMenu.scss';

@CSSModules(styles, {allowMultiple: true})
export default class extends Component{
  static displayName = 'OverlayMenu';
  static propTypes = {};
  state = { show: false, };
  toggle = (e) =>{
    stopEvent(e);
    this.setState({ show: !this.state.show });
  };
  render(){
    const { show, } = this.state;
    const { onMainAction, title, } = this.props;
    return (
      <div styleName={classnames('action', { 'has-menu': this.props.children, })}>

        <div className={' universal-grid-next-action secondary'} styleName='link-combo-button'>

          <button type='button' title={title || 'Créer une facture'} onClick={e => { stopEvent(e); onMainAction(); }} styleName='combo-button-main' tabIndex='0' style={{ WebkitUserSelect: 'none', outline: 0, }}>{title || 'Créer une facture'}</button>

          {this.props.children && <button
            ref={'target'}
            onClick={this.toggle}
            type='button'
            className={'dijitDownArrowButton'}
            styleName={classnames('combo-button-toggle', { dijitHasDropDownOpen: show, })} style={{ WebkitUserSelect: 'none', outline: 0, }}>
          </button>}

          {this.props.children && <Overlay
            shouldUpdatePosition
            show={show}
            onHide={() => this.setState({ show: false, })}
            placement={'bottom'}
            container={this.props.container}
            rootClose={true}
            target={ props => ReactDOM.findDOMNode(this.refs.target) }
          >
            <div>{this.props.children}
            </div>
          </Overlay>}

        </div>

      </div>
    );
  }
}
