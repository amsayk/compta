import React, {Component, PropTypes} from 'react';
import Relay from 'react-relay';

import messages from './messages';

import stopEvent from '../../../utils/stopEvent';

import {editStart as editStartCustomer} from '../../../redux/modules/customers';

import ButtonToolbar from 'react-bootstrap/lib/ButtonToolbar';
// import MenuItem from 'react-bootstrap/lib/MenuItem';
// import DropdownButton from 'react-bootstrap/lib/DropdownButton';
import Button from 'react-bootstrap/lib/Button';

import CustomerForm  from '../CustomerForm/CustomerForm';

const BUTTONS = [
  'customer',
];

const BUTTON_TITLES = {
  customer: (intl) => intl.formatMessage(messages['Customer']),
};

import {
  intlShape,
} from 'react-intl';

import CSSModules from 'react-css-modules';

import styles from './Items.scss';

import requiredPropType from 'react-prop-types/lib/all';

@CSSModules(styles, {allowMultiple: true})
export default class extends Component{

  static displayName = 'CustomersSalesHeaderActions';

  static propTypes = {
    topLoading: PropTypes.bool.isRequired,
    viewer: PropTypes.object.isRequired,
    company: requiredPropType(
      React.PropTypes.object,
      function(props, propName, componentName) {
        if (props.topLoading === false && !props.company) {
          return new Error('company required!');
        }
      }
    ),
  };

  static contextTypes = {
    intl: intlShape.isRequired,
    store: PropTypes.object.isRequired,
  };

  constructor(props, context){
    super(props, context);

    this.state = {
      modalOpen: false,
      topLoading: props.topLoading,
    };
  }

  componentWillReceiveProps(nextProps){
    // if(nextProps.topLoading){
    //   return;
    // }

    // this.context.store.dispatch(editStartInvoice('NEW', [], {id: 'NEW', company: nextProps.company}));
    // this.context.store.dispatch(editStartSale('NEW', []));
    // this.context.store.dispatch(editStartPayment('NEW', []));

    // this.state = {
    //   modalOpen: true,
    //   modalType: 'invoice',
    //   topLoading: nextProps.topLoading,
    // };
  }

  _onSelect = (btn, eventKey, e) => {
    stopEvent(e || eventKey);

    switch (btn){
      case 'customer':

        this.context.store.dispatch(
          editStartCustomer(
            'NEW'));

        break;

    }

    this.setState({
      modalOpen: true,
      modalType: btn,
    })
  };

  _close = (btn, e) => {
    stopEvent(e);

    this.setState({
      modalOpen: false,
      modalType: undefined,
    })
  };

  _renderModal = () => {
    if(!this.state.modalOpen){
      return (
        null
      );
    }

    switch (this.state.modalType){
      case 'customer':
        return (
          <CustomerForm
            company={this.props.company}
            viewer={this.props.viewer}
            formKey={'NEW'} onCancel={this._close}
          />
        );
    }
  };

  render() {
    const {intl,} = this.context;
    return (
      <div className='header'>
        <ButtonToolbar>
          <Button styleName='s-btn' onClick={this._onSelect.bind(this, 'customer')} bsStyle={'primary'} id={'new-customer'}>
            {intl.formatMessage(messages['NewCustomer'])}
          </Button>
        </ButtonToolbar>
        {this._renderModal()}
      </div>
    );
  }
}
