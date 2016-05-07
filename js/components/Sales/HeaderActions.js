import React, {Component, PropTypes} from 'react';
import Relay from 'react-relay';

import messages from './messages';

import stopEvent from '../../utils/stopEvent';

import {editStart as editStartInvoice} from '../../redux/modules/invoices';
import {editStart as editStartPayment} from '../../redux/modules/paymentsOfInvoices';
import {editStart as editStartSale} from '../../redux/modules/sales';

import ButtonToolbar from 'react-bootstrap/lib/ButtonToolbar';
import MenuItem from 'react-bootstrap/lib/MenuItem';
import DropdownButton from 'react-bootstrap/lib/DropdownButton';

import InvoiceForm  from './InvoiceForm/InvoiceForm';
import SaleForm  from './SaleForm/SaleForm';
import PaymentForm  from './PaymentForm/PaymentForm';

const BUTTONS = [
  'invoice',
  'payment',
  'sale',
];

const BUTTON_TITLES = {
  invoice: (intl) => intl.formatMessage(messages['Invoice']),
  payment: (intl) => intl.formatMessage(messages['Payment']),
  'sale': (intl) => intl.formatMessage(messages['Sale']),
};

import {
  intlShape,
} from 'react-intl';

import CSSModules from 'react-css-modules';

import styles from './Sales.scss';

import requiredPropType from 'react-prop-types/lib/all';

@CSSModules(styles, {allowMultiple: true})
export default class extends Component{

  static displayName = 'SalesHeaderActions';

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
      case 'invoice':
        this.context.store.dispatch(
          editStartInvoice(
            'NEW', [], {id: 'NEW', company: this.props.company,}));
        break;

      case 'sale':
        this.context.store.dispatch(
          editStartSale(
            'NEW', [], {id: 'NEW', company: this.props.company,}));
        break;

      case 'payment':
        this.context.store.dispatch(
          editStartPayment(
            'NEW', [], {id: 'NEW', company: this.props.company,}));
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
      case 'invoice':
        return (
          <InvoiceForm
            filterArgs={this.props.filterArgs}
            onNew={this._onSelect.bind(this, 'invoice')}
            salesAccounts={this.props.salesAccounts}
            company={this.props.company}
            viewer={this.props.viewer}
            formKey={'NEW'} onCancel={this._close}
          />
        );
      case 'sale':
        return (
          <SaleForm
            filterArgs={this.props.filterArgs}
            salesAccounts={this.props.salesAccounts}
            depositsAccounts={this.props.depositsAccounts}
            onNew={this._onSelect.bind(this, 'sale')}
            company={this.props.company}
            viewer={this.props.viewer}
            formKey={'NEW'}
            onCancel={this._close}
          />
        );
      case 'payment':
        return (
          <PaymentForm
            filterArgs={this.props.filterArgs}
            onNew={this._onSelect.bind(this, 'payment')}
            company={this.props.company}
            viewer={this.props.viewer}
            customerOpenInvoices={this.props.customerOpenInvoices}
            depositsAccounts={this.props.depositsAccounts}
            formKey={'NEW'}
            onPaymentCustomerSelected={this.props.onPaymentCustomerSelected}
            onCancel={this._close}
          />
        );
    }
  };

  render() {
    const {intl,} = this.context;
    return (
      <div className='header'>
        <ButtonToolbar>
          <DropdownButton styleName='s-btn' bsStyle={'primary'} title={intl.formatMessage(messages['NewTransaction'])} id={'new-transaction'}>
            {BUTTONS.map((btn, index) => <MenuItem key={index}
                                                   onSelect={this._onSelect.bind(this, btn)}
                                                   eventKey={index}>{BUTTON_TITLES[btn](intl)}</MenuItem>)}
          </DropdownButton>
        </ButtonToolbar>
        {this._renderModal()}
      </div>
    );
  }
}
