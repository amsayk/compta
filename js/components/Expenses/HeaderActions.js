import React, {Component, PropTypes} from 'react';
import Relay from 'react-relay';

import messages from './messages';

import stopEvent from '../../utils/stopEvent';

import { editStart as editStartExpense, } from '../../redux/modules/v2/expenses';
import { editStart as editStartBill, } from '../../redux/modules/v2/bills';
import { editStart as editStartPayment, } from '../../redux/modules/v2/paymentsOfBills';

import ButtonToolbar from 'react-bootstrap/lib/ButtonToolbar';
import MenuItem from 'react-bootstrap/lib/MenuItem';
import DropdownButton from 'react-bootstrap/lib/DropdownButton';

// import ExpenseForm from './ExpenseForm/ExpenseForm';
// import BillForm from './BillForm/BillForm';
// import PaymentForm from './PaymentForm/PaymentForm';

import LoadingActions from '../Loading/actions';

let ExpenseForm = null;
let BillForm = null;
let PaymentForm = null;

function loadComponent(type, cb) {
  LoadingActions.show();

  switch (type){

    case 'expense':

      require.ensure([], function (require) {
        LoadingActions.hide();
        ExpenseForm = require('./ExpenseForm/ExpenseForm').default;
        cb();
      }, 'ExpenseForm');

      break;

    case 'payment':

      require.ensure([], function (require) {
        LoadingActions.hide();
        PaymentForm = require('./PaymentForm/PaymentForm').default;
        cb();
      }, 'PaymentOfBillsForm');

      break;

    case 'bill':

      require.ensure([], function (require) {
        LoadingActions.hide();
        BillForm = require('./BillForm/BillForm').default;
        cb();
      }, 'BillForm');

      break;
  }
}

const BUTTONS = [
  'bill',
  'expense',
];

const BUTTON_TITLES = {
  bill: (intl) => intl.formatMessage(messages['BillTitle']),
  expense: (intl) => intl.formatMessage(messages['ExpenseTitle']),
};

import {
  intlShape,
} from 'react-intl';

import CSSModules from 'react-css-modules';

import styles from './Expenses.scss';

@CSSModules(styles, {allowMultiple: true})
export default class extends React.Component{
  static displayName = 'ExpensesHeaderActions';

  static propTypes = {
    topLoading: PropTypes.bool.isRequired,
  };

  static contextTypes = {
    intl: intlShape.isRequired,
    store: PropTypes.object.isRequired,
  };

  constructor(props, context){
    super(props, context);

    this.state = {
      topLoading: props.topLoading,
    };
  }

  _onSelect = (btn, eventKey, e) => {
    stopEvent(e || eventKey);

    switch (btn){
      case 'bill':

        this.context.store.dispatch(
          editStartBill(
            'NEW', [], {id: 'NEW', company: this.props.company, }));
        break;

      case 'expense':

        this.context.store.dispatch(
          editStartExpense(
            'NEW', [], {id: 'NEW', company: this.props.company, }));
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
        case 'Bill':
          return (
            <BillForm
              bill={this.state.obj}
              company={this.props.company}
              viewer={this.props.viewer}
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
                bill={self.state.bill}
                payment={self.state.obj}
                company={self.props.company}
                viewer={self.props.viewer}
                formKey={formKey}
                vendorOpenBills={self.props.vendorOpenBills}
                expensesAccounts={self.props.expensesAccounts}
                depositsAccounts={self.props.depositsAccounts}
                onCancel={self._close}
                onPaymentVendorSelected={self.props.onPaymentVendorSelected}
                onBill={self._onBill}
              />
            );
          }(this);
      }
    }

    return (
      null
    );


  };

  _onBill = (obj) => {
    this.setState({
      modalOpen: false,
      obj: undefined,
      modalType: 'Payment',
      bill: undefined,
    }, () => {
      obj = decorateBill(obj);

      this.context.store.dispatch(
        editStartBill(
          obj.id,
          obj.itemsConnection.edges.map(({node}) => node),
          {id: obj.id, company: this.props.company,})
      );

      setTimeout(() => {

        loadComponent('bill', () => {

          this.setState({
            modalOpen: true,
            modalType: 'Payment',
            obj,
            bill: undefined,
          });
        });

      }, 150);
    });
  };

  _onReceivePayment = (bill) => {
    this.context.store.dispatch(
      editStartPayment(
        'NEW',
        [],
        {id: 'NEW', company: this.props.company,})
    );

    setImmediate(() => {
      this.props.onReceivePayment(bill.payee);
    });

    loadComponent('payment', () => {

      this.setState({
        modalOpen: true,
        modalType: 'Payment',
        obj: undefined,
        bill,
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
      case 'bill':

        return (
          <BillForm
            filterArgs={this.props.filterArgs}
            onNew={this._onSelect.bind(this, 'bill')}
            depositsAccounts={this.props.depositsAccounts}
            expensesAccounts={this.props.expensesAccounts}
            company={this.props.company}
            viewer={this.props.viewer}
            formKey={'NEW'} onCancel={this._close}
            onReceivePayment={this._onReceivePayment}
          />
        );

      case 'expense':

        return (
          <ExpenseForm
            filterArgs={this.props.filterArgs}
            depositsAccounts={this.props.depositsAccounts}
            expensesAccounts={this.props.expensesAccounts}
            onNew={this._onSelect.bind(this, 'expense')}
            company={this.props.company}
            viewer={this.props.viewer}
            vendorOpenBills={this.props.vendorOpenBills}
            onPaymentVendorSelected={this.props.onPaymentVendorSelected}
            formKey={'NEW'}
            onBill={this._onBill}
            onCancel={this._close}
            onReceivePayments={this._onReceivePayments}
          />
        );

      case 'payment':

      return (
        <PaymentForm
          company={this.props.company}
          viewer={this.props.viewer}
          formKey={'NEW'}
          onNew={this._onSelect.bind(this, 'payment')}
          vendorOpenBills={this.props.vendorOpenBills}
          expensesAccounts={this.props.expensesAccounts}
          depositsAccounts={this.props.depositsAccounts}
          onCancel={this._close}
          onPaymentVendorSelected={this.props.onPaymentVendorSelected}
          onBill={this._onBill}
          amountReceived={this.state.amountReceived || 0.0}
          selectedBills={this.state.selectedBills || []}
        />
      );
    }
  };

  _onReceivePayments = (bills) => {
    let amountReceived = 0.0;

    function decorateBillItem({ id, objectId, date, dueDate, memo, paymentRef, itemsConnection, paymentsConnection, }){
      const balanceDue = itemsConnection.totalAmount - paymentsConnection.totalAmountPaid;
      amountReceived += balanceDue;
      const obj = {
        __selected: true,
        __existed: true,
        __originalAmount: balanceDue,
        id,
        amount: balanceDue,
        bill: {
          id,
          objectId,
          paymentRef,
          refNo: paymentRef,
          total: itemsConnection.totalAmount,
          balanceDue,
          amountPaid: paymentsConnection.totalAmountPaid,
          date,
          dueDate,
          memo,
        },
      }

      return obj;
    }

    const items = bills.map(decorateBillItem);

    this.context.store.dispatch(
      editStartPayment(
        'NEW', items, {id: 'NEW', company: this.props.company, }));

    loadComponent('payment', () => {

      this.setState({
        modalOpen: true,
        modalType: 'payment',
        amountReceived,
        selectedBills: bills,
      });
    });
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

function decorateBill({ objectId, __dataID__, totalHT, VAT, inputType, id, payee, paymentRef, mailingAddress, terms, date, dueDate, itemsConnection, paymentsConnection, memo, files, }) {
  const balanceDue = itemsConnection.totalAmount - paymentsConnection.totalAmountPaid;

  function calcBillStatus() {
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

    const hasPayment = paymentsConnection.totalAmountPaid !== 0;

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
    mailingAddress,
    type: 'Bill',
    paymentRef,
    refNo: paymentRef,
    payee,
    dueDate,
    totalAmount: itemsConnection.totalAmount,
    balanceDue,
    total: itemsConnection.totalAmount,
    totalAmountPaid: paymentsConnection.totalAmountPaid,
    status: calcBillStatus(),
    memo, files,
    totalHT, VAT, inputType,
    itemsConnection,
    paymentsConnection,
    objectId,
  };
}
