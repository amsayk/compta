import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import Modal from 'react-bootstrap/lib/Modal';
import Button from 'react-bootstrap/lib/Button';
import ButtonToolbar from 'react-bootstrap/lib/ButtonToolbar';
import connectToStores from 'alt-utils/lib/connectToStores';

import Store from './store';
import Actions from './actions';

import CSSModules from 'react-css-modules';

import styles from './component.scss';

@connectToStores
@CSSModules(styles, {allowMultiple: true})
export default class extends React.Component {
  static displayName = 'Confirm';
  static propTypes = {
    title: PropTypes.string,
    sure: PropTypes.string,
    cancel: PropTypes.string,
  };
  static getStores() {
    return [Store];
  }
  static getPropsFromStores() {
    return Store.getState();
  }
  state = {};
  componentDidUpdate(){
    this._btn&&ReactDOM.findDOMNode(this._btn).focus();
  }
  render () {
    const { title, sure, cancel, message, } = this.props;
    return (
      <Modal styleName={'modal-wrapper'} backdropStyle={{}} aria-labelledby='contained-modal-title' bsSize='small' backdrop={'static'} onHide={Actions.cancel} show={!!message} keyboard={false}>
        {/*<Modal.Header closeButton>
          <Modal.Title>
            {title}
          </Modal.Title>
        </Modal.Header>*/}
        <Modal.Body>
          {message}
        </Modal.Body> 
        <Modal.Footer>
          <ButtonToolbar>

            <Button styleName={'left'} ref={ref => this._btn = ref} bsStyle='success' onClick={Actions.cancel}>
              {cancel}
            </Button>

            <Button styleName={'right'} bsStyle='danger' onClick={Actions.sure}>
              {sure}
            </Button>

          </ButtonToolbar>
        </Modal.Footer>
      </Modal>
    )
  }
}
