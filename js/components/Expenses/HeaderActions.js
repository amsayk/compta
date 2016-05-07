import React, {Component, PropTypes} from 'react';
import Relay from 'react-relay';

import messages from './messages';

import stopEvent from '../../utils/stopEvent';

import { editStart as editStartExpense, } from '../../redux/modules/expenses';
import { editStart as editStartBill, } from '../../redux/modules/bills';
import { editStart as editStartPayment, } from '../../redux/modules/paymentsOfBills';

import ButtonToolbar from 'react-bootstrap/lib/ButtonToolbar';
import MenuItem from 'react-bootstrap/lib/MenuItem';
import DropdownButton from 'react-bootstrap/lib/DropdownButton';

import ExpenseForm from './ExpenseForm/ExpenseForm';
import BillForm from './BillForm/BillForm';
import PaymentForm from './PaymentForm/PaymentForm';

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
export default class extends Component{
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

    this.setState({
      modalOpen: true,
      modalType: btn,
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
    if(!this.state.modalOpen){
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

  _onBill = () => {
    debugger;
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

    this.setState({
      modalOpen: true,
      modalType: 'payment',
      amountReceived,
      selectedBills: bills,
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
      </div>
    );
  }
}
