import React, {Component, PropTypes} from 'react';
import Relay from 'react-relay';

import messages from './messages';

import stopEvent from '../../utils/stopEvent';

import moment from 'moment';

import {editStart as editStartInvoice} from '../../redux/modules/v2/invoices';
import {editStart as editStartPayment} from '../../redux/modules/v2/paymentsOfInvoices';
import {editStart as editStartSale} from '../../redux/modules/v2/sales';

import ButtonToolbar from 'react-bootstrap/lib/ButtonToolbar';
import MenuItem from 'react-bootstrap/lib/MenuItem';
import DropdownButton from 'react-bootstrap/lib/DropdownButton';

// import InvoiceForm  from './InvoiceForm/InvoiceForm';
// import SaleForm  from './SaleForm/SaleForm';
// import PaymentForm  from './PaymentForm/PaymentForm';

import LoadingActions from '../Loading/actions';

let InvoiceForm = null;
let SaleForm = null;
let PaymentForm = null;

function loadComponent(type, cb) {
  LoadingActions.show();

  switch (type){
    case 'invoice':

      require.ensure([], function (require) {
        LoadingActions.hide();
        InvoiceForm = require('./InvoiceForm/InvoiceForm').default;
        cb();
      });

      break;

    case 'payment':

      require.ensure([], function (require) {
        LoadingActions.hide();
        PaymentForm = require('./PaymentForm/PaymentForm').default;
        cb();
      }, 'PaymentOfInvoicesForm');

      break;

    case 'sale':

      require.ensure([], function (require) {
        LoadingActions.hide();
        SaleForm = require('./SaleForm/SaleForm').default;
        cb();
      }, 'SaleForm');

      break;
  }
}

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
export default class extends React.Component{

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

    loadComponent(btn, () => {
      this.setState({
        modalOpen: true,
        modalType: btn,
      });
    });

  };

  _renderPaymentModal = () => {
    if(this.state.modalOpen && this.state.modalType === 'Payment'){
      switch (this.state.obj ? this.state.obj.type : 'Payment'){
        case 'Invoice':
          return (
            <InvoiceForm
              invoice={this.state.obj}
              company={this.props.company}
              viewer={this.props.viewer}
              salesAccounts={this.props.salesAccounts}
              expensesAccounts={this.props.expensesAccounts}
              formKey={this.state.obj.id}
              onCancel={this._close}
              onReceivePayment={this._onReceivePayment}
            />
          );
        case 'Payment':
          return function(self){
            const formKey = self.state.obj ? self.state.obj.id : 'NEW';
            return (
              <PaymentForm
                invoice={self.state.invoice}
                payment={self.state.obj}
                company={self.props.company}
                viewer={self.props.viewer}
                formKey={formKey}
                // customerOpenInvoices={formKey === 'NEW' ? self.props.customerOpenInvoices : {edges: []}}
                customerOpenInvoices={self.props.customerOpenInvoices}
                salesAccounts={self.props.salesAccounts}
                expensesAccounts={self.props.expensesAccounts}
                depositsAccounts={self.props.depositsAccounts}
                onCancel={self._close}
                onPaymentCustomerSelected={self.props.onPaymentCustomerSelected}
                onInvoice={self._onInvoice}
              />
            );
          }(this);
      }
    }

    return (
      null
    );


  };

  _onInvoice = (obj) => {
    this.setState({
      modalOpen: false,
      obj: undefined,
      modalType: 'Payment',
      invoice: undefined,
    }, () => {
      obj = decorateInvoice(obj);

      this.context.store.dispatch(
        editStartInvoice(
          obj.id,
          obj.itemsConnection.edges.map(({node}) => node),
          {id: obj.id, company: this.props.company,})
      );

      setTimeout(() => {

        loadComponent('invoice', () => {

          this.setState({
            modalOpen: true,
            modalType: 'Payment',
            obj,
            invoice: undefined,
          });
        });

      }, 150);
    });
  };

  _onReceivePayment = (invoice) => {
    this.context.store.dispatch(
      editStartPayment(
        'NEW',
        [],
        {id: 'NEW', company: this.props.company,})
    );

    setImmediate(() => {
      this.props.onReceivePayment(invoice.customer);
    });

    loadComponent('payment', () => {

      this.setState({
        modalOpen: true,
        modalType: 'Payment',
        obj: undefined,
        invoice,
      });

    });
  };

  _close = (btn, e) => {
    stopEvent(e);

    this.setState({
      modalOpen: false,
      modalType: undefined,
    })
  };

  _renderModal = () => {
    if(this.state.modalOpen === false || this.state.modalType === 'Payment'){
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
            expensesAccounts={this.props.expensesAccounts}
            company={this.props.company}
            onReceivePayment={this._onReceivePayment}
            viewer={this.props.viewer}
            formKey={'NEW'} onCancel={this._close}
          />
        );
      case 'sale':
        return (
          <SaleForm
            filterArgs={this.props.filterArgs}
            salesAccounts={this.props.salesAccounts}
            expensesAccounts={this.props.expensesAccounts}
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
        {this._renderPaymentModal()}
      </div>
    );
  }
}

function decorateInvoice({ objectId, __dataID__, totalHT, VAT, id, refNo, customer, inputType, billingAddress, terms, date, dueDate, discountType, discountValue, itemsConnection, paymentsConnection, memo, files, }) {
  const balanceDue = itemsConnection.totalAmount - paymentsConnection.totalAmountReceived;

  function calcInvoiceStatus() {
    // const _date = moment(date);
    const _dueDate = moment(dueDate);
    const now = moment();

    const isPaidInFull = balanceDue === 0.0;

    if(isPaidInFull){
      return 'Closed';
    }

    if(_dueDate.isBefore(now)){
      return 'Overdue';
    }

    const hasPayment = paymentsConnection.totalAmountReceived !== 0;

    if(hasPayment){
      return 'Partial';
    }

    return 'Open';
  }

  return {
    __dataID__,
    id,
    terms,
    date,
    billingAddress,
    type: 'Invoice',
    refNo: parseInt(refNo),
    customer,
    dueDate,
    discountType, discountValue,
    totalAmount: itemsConnection.totalAmount,
    balanceDue,
    total: itemsConnection.totalAmount,
    totalAmountReceived: paymentsConnection.totalAmountReceived,
    status: calcInvoiceStatus(),
    memo, files,
    totalHT, VAT,
    inputType,
    itemsConnection,
    paymentsConnection,
    objectId,
  };
}
