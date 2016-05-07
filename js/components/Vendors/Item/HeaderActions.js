import React, {Component, PropTypes} from 'react';
import Relay from 'react-relay';

import messages from './messages';

import stopEvent from '../../../utils/stopEvent';

import {editStart as editStartBill} from '../../../redux/modules/bills';
// import {editStart as editStartPayment} from '../../../redux/modules/paymentsOfBills';
import {editStart as editStartExpense} from '../../../redux/modules/expenses';

import ButtonToolbar from 'react-bootstrap/lib/ButtonToolbar';
import MenuItem from 'react-bootstrap/lib/MenuItem';
import DropdownButton from 'react-bootstrap/lib/DropdownButton';

import BillForm  from '../../Expenses//BillForm/BillForm';
import ExpenseForm  from '../../Expenses//ExpenseForm/ExpenseForm';
// import PaymentForm  from '../../Expenses//PaymentForm/PaymentForm';

import VendorForm  from '../VendorForm/VendorForm';

const BUTTONS = [
  'bill',
  // 'payment',
  'expense',
];

const BUTTON_TITLES = {
  bill: (intl) => intl.formatMessage(messages['Bill']),
  // payment: (intl) => intl.formatMessage(messages['Payment']),
  'expense': (intl) => intl.formatMessage(messages['Expense']),
};

import {
  intlShape,
} from 'react-intl';

import CSSModules from 'react-css-modules';

import styles from './Item.scss';

import requiredPropType from 'react-prop-types/lib/all';

@CSSModules(styles, {allowMultiple: true})
export default class extends Component{

  static displayName = 'VendorExpensesHeaderActions';

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
    payee: requiredPropType(
      React.PropTypes.object,
      function(props, propName, componentName) {
        if (props.topLoading === false && !props.payee) {
          return new Error('payee required!');
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

    // this.context.store.dispatch(editStartBill('NEW', [], {id: 'NEW', company: nextProps.company}));
    // this.context.store.dispatch(editStartExpense('NEW', []));
    // this.context.store.dispatch(editStartPayment('NEW', []));

    // this.state = {
    //   modalOpen: true,
    //   modalType: 'bill',
    //   topLoading: nextProps.topLoading,
    // };
  }

  _onSelect = (btn, eventKey, e) => {
    stopEvent(e || eventKey);

    switch (btn){
      case 'bill':
        this.context.store.dispatch(
          editStartBill(
            'NEW', [], {id: 'NEW', company: this.props.company,}));
        break;

      case 'expense':
        this.context.store.dispatch(
          editStartExpense(
            'NEW', [], {id: 'NEW', company: this.props.company,}));
        break;

      // case 'payment':
      //   this.context.store.dispatch(
      //     editStartPayment(
      //       'NEW', [], {id: 'NEW', company: this.props.company,}));
      //   break;

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
      case 'bill':
        return (
          <BillForm
            payee={this.props.payee}
            filterArgs={this.props.filterArgs}
            onNew={this._onSelect.bind(this, 'bill')}
            expensesAccounts={this.props.expensesAccounts}
            company={this.props.company}
            viewer={this.props.viewer}
            formKey={'NEW'} onCancel={this._close}
          />
        );
      case 'expense':
        return (
          <ExpenseForm
            payee={this.props.payee}
            filterArgs={this.props.filterArgs}
            expensesAccounts={this.props.expensesAccounts}
            depositsAccounts={this.props.depositsAccounts}
            onNew={this._onSelect.bind(this, 'expense')}
            company={this.props.company}
            viewer={this.props.viewer}
            formKey={'NEW'}
            onCancel={this._close}
          />
        );
      // case 'payment':
      //   return (
      //     <PaymentForm
      //       payee={this.props.payee}
      //       filterArgs={this.props.filterArgs}
      //       onNew={this._onSelect.bind(this, 'payment')}
      //       company={this.props.company}
      //       viewer={this.props.viewer}
      //       vendorOpenBills={this.props.vendorOpenBills}
      //       depositsAccounts={this.props.depositsAccounts}
      //       formKey={'NEW'}
      //       onPaymentVendorSelected={this.props.onPaymentVendorSelected}
      //       onCancel={this._close}
      //     />
      //   );
      case 'edit':
        return (
          <VendorForm
            vendor={this.props.payee}
            company={this.props.company}
            viewer={this.props.viewer}
            formKey={this.props.payee.id} onCancel={this._close}
          />
        );
    }
  };

  render() {
    const {intl,} = this.context;
    return (
      <div className='header'>
        <ButtonToolbar styleName={'noFloat'}>

          <button
            onClick={this._onSelect.bind(this, 'edit')}
            styleName='edit-btn'
            className='unselectable'>{intl.formatMessage(messages['Edit'])}
          </button>


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
