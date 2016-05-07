import React, {Component, PropTypes} from 'react';

import classnames from 'classnames';

import moment from 'moment';

import stopEvent from '../../../utils/stopEvent';

import styles from './InvoiceForm.scss';

import FromPaymentItemPaymentForm from '../FromPaymentItemPaymentForm';

import CSSModules from 'react-css-modules';

import getFieldValue from '../../utils/getFieldValue';

import OverlayTrigger from 'react-bootstrap/lib/OverlayTrigger';
import Popover from 'react-bootstrap/lib/Popover';

import {
  intlShape,
} from 'react-intl';

import messages from './messages';

import requiredPropType from 'react-prop-types/lib/all';

@CSSModules(styles, {allowMultiple: true})
export default class extends Component {
  static displayName = 'InvoiceBalanceDue';
  static contextTypes = {
    intl: intlShape.isRequired,
  };
  static propTypes = {
    invoice: requiredPropType(
      PropTypes.object,
      function(props, propName, componentName) {
        if (props.formKey !== 'NEW' && !props.invoice) {
          return new Error('InvoiceBalanceDue: invoice required!');
        }
      }
    ),

    onReceivePayment: requiredPropType(
      PropTypes.func,
      function(props, propName, componentName) {
        if (props.formKey !== 'NEW' && !props.onReceivePayment) {
          return new Error('InvoiceBalanceDue: onReceivePayment required!');
        }
      }
    ),
  }
  state = {
    modalOpen: false,
  };
  _onClickPayment = (e, payment) => {
    stopEvent(e);

    // const Component = (
    //   <FromPaymentItemPaymentForm
    //     payment={payment}
    //     company={this.props.company}
    //     onClose={this._closePaymentModal}
    //   />
    // );

    requestAnimationFrame(() => {
      this.setState({
        modalOpen: true,
        payment,
        // Component,
      });
    });
  };
  _renderPaymentModal = () => {
    if(this.state.modalOpen){
      // return this.state.Component;
      return (
        <FromPaymentItemPaymentForm
          payment={this.state.payment}
          company={this.props.company}
          onClose={this._closePaymentModal}
        />
      );
    }
  };
  _closePaymentModal = () => {
    this.setState({
      modalOpen: false,
      payment: undefined,
      // Component: undefined,
    })
  };
  _calcStatus(totalAmount, amountPaid){
    return calcInvoiceStatus(
      totalAmount, amountPaid, this.props.invoice);
  }
  render() {
    const self = this;
    const { intl, } = this.context;

    const {
      formKey,
      invoice,
      store,
      fields: {
        dirty,
        date,
        dueDate,
        discountType,
        discountValue,
      },
    } = this.props;

    const hasInvoice = formKey !== 'NEW';

    const _dirty = dirty || store.isDirty;

    const totalAmount = hasInvoice && ! _dirty
      ? invoice.totalAmount : store.getTotal({
        discountType: getFieldValue(discountType),
        discountValue: discountValue.invalid ? 0.0 : getFieldValue(discountValue),
      });

    const amountPaid = hasInvoice
      ? invoice.totalAmountReceived
      : 0.0;

    const balanceDue = hasInvoice && ! _dirty
      ? invoice.balanceDue
      : (hasInvoice ? totalAmount - amountPaid : totalAmount);

    const status = hasInvoice && ! _dirty
    ? invoice.status
    : (hasInvoice ? this._calcStatus(totalAmount, amountPaid, { date: getFieldValue(date), dueDate: getFieldValue(dueDate), }) : 'Open');

    const hasSomePayments = hasInvoice ? invoice.paymentsConnection.totalCount > 0 : false;


    return (
      <div styleName='balance-due-wrapper'>

        <div styleName='balance-due'>

          <div styleName='table floatRight'>

            <div styleName='tableRow nameStatusSection'>

            {function(){

              switch (status) {
                case 'Open':
                  return (
                    <div styleName='tableCell'>

                      <div styleName='leftPadding10 inlineBlock'>

                          <div style={{}}>
                              <div styleName='stageAmountLabel upperCase'>{intl.formatMessage(messages['balance_due_label'])}</div>
                              <div styleName='amount'>{intl.formatNumber(balanceDue, {format: 'MAD'})}</div>
                          </div>

                      </div>

                      {hasInvoice && <div styleName='paddingTop10'>
                          <div styleName='stateActionButton inlineBlock'>
                            <a onClick={e => { stopEvent(e); self.props.onReceivePayment(invoice); }} styleName='bbutton secondary'>{intl.formatMessage(messages['receive_payment_label'])}</a>
                          </div>
                      </div>}

                      {hasSomePayments && <div>
                          {renderPayments(self, invoice)}
                      </div>}

                    </div>
                  );

                // case 'Partial':
                //   return (
                //     <div styleName='tableCell'>
                //
                //       <div styleName='leftPadding10 inlineBlock'>
                //
                //           <div style={{}}>
                //               <div styleName='stageAmountLabel upperCase'>{intl.formatMessage(messages['balance_due_label'])}</div>
                //               <div styleName='amount'>{intl.formatNumber(balanceDue, {format: 'MAD'})}</div>
                //           </div>
                //
                //       </div>
                //
                //       <div styleName='paddingTop10'>
                //           <div styleName='stateActionButton inlineBlock'>
                //             <a styleName='bbutton secondary'>{intl.formatMessage(messages['receive_payment_label'])}</a>
                //           </div>
                //       </div>
                //
                //     </div>
                //   );

                case 'Overdue':
                  return (
                    <div styleName='tableCell'>

                      <div styleName='leftPadding10 inlineBlock'>

                          <div style={{}}>
                              <div styleName='stageAmountLabel upperCase'>{intl.formatMessage(messages['payment_status_label'])}</div>
                              <div styleName='stagePaymentStatus upperCase' style={{ color: '#e33d43', }}>{intl.formatMessage(messages['STATUS_OverdueLabel'])}</div>
                          </div>

                          <div style={{}}>
                              <div styleName='stageAmountLabel upperCase'>{intl.formatMessage(messages['balance_due_label'])}</div>
                              <div styleName='amount'>{intl.formatNumber(balanceDue, {format: 'MAD'})}</div>
                          </div>

                      </div>

                      {hasInvoice && <div styleName='paddingTop10'>
                          <div styleName='stateActionButton inlineBlock'>
                            <a onClick={e => { stopEvent(e); self.props.onReceivePayment(invoice); }} styleName='bbutton secondary'>{intl.formatMessage(messages['receive_payment_label'])}</a>
                          </div>
                      </div>}

                      {hasSomePayments && <div>
                          {renderPayments(self, invoice)}
                      </div>}

                    </div>
                  );

                case 'Closed':
                  return (
                    <div styleName='tableCell'>

                      <div styleName='leftPadding10 inlineBlock'>

                          <div style={{}}>
                              <div styleName='stageAmountLabel upperCase'>{intl.formatMessage(messages['payment_status_label'])}</div>
                              <div styleName='stagePaymentStatus upperCase' style={{ color: '#56b349', }}>{intl.formatMessage(messages['STATUS_PaidLabel'])}</div>
                          </div>

                          <div style={{}}>
                              <div styleName='stageAmountLabel upperCase'>{intl.formatMessage(messages['amount_label'])}</div>
                              <div styleName='amount'>{intl.formatNumber(totalAmount, {format: 'MAD'})}</div>
                          </div>

                      </div>

                      {hasSomePayments && <div>
                          {renderPayments(self, invoice)}
                      </div>}

                    </div>
                  );

                default:
                  throw `BalanceDueForm: invalid status: ${status}`;
              }

            }()}

            </div>

          </div>

        </div>

        {this._renderPaymentModal()}

      </div>
    );
  }
}

function renderPayments(self, invoice){
  const { modalOpen, } = self.state;
  const { styles, } = self.props;
  const { intl, } = self.context;

  function renderPopover(){
    return (
      <div className={styles['dijitTooltipContainer']} role='presentation'>

        <div className={`${styles['dijitTooltipFocusNode']}`}>

          <div>

            <div className={`${styles['stagingTable']} ${styles['table']}`}>

              <div className={`${styles['tableRow']} ${styles['header']}`}>
                <div className={styles['tableCell']}>{intl.formatMessage(messages['Popover_Date'])}</div>
                <div className={styles['tableCell']}>{intl.formatMessage(messages['Popover_Amount_Applied'])}</div>
                <div className={styles['tableCell']}>{intl.formatMessage(messages['Popover_Date_Payment_RefNo'])}</div>
                <div className={styles['tableCell']}></div>
              </div>

              {invoice.paymentsConnection.edges.map(({ node: payment, }) => (
                <div className={styles['tableRow']}>
                  <div className={styles['tableCell']}><a onClick={(e) => { self._onClickPayment(e, payment); }} className={styles['outlineNone']}>{moment(payment.date).format('ll')}</a></div>
                  <div className={styles['tableCell']}>{intl.formatNumber(payment.amount, { format: 'MAD', })}</div>
                  <div className={styles['tableCell']}>{payment.paymentRef}</div>
                  <div className={styles['tableCell']}></div>
                </div>
              ))}

            </div>

          </div>

        </div>

      </div>

    );
  }

  if(invoice.paymentsConnection.totalCount > 1){
    return (
      <div className={styles['divContentStatus']}>

      <OverlayTrigger rootClose trigger={[ 'click', 'focus' ]} placement={'left'} overlay={<Popover className={styles['payments--overlay']}>{renderPopover()}</Popover>}>
        <div className={styles['stageTooltipAnchor']} style={{ display: 'inline-block', }}>{intl.formatMessage(messages['x_payments'], { x: invoice.paymentsConnection.totalCount, })}{' '}{modalOpen ? <i style={{ fontSize: 16, }} className={`${styles['submitting']} material-icons`}>loop</i> : null}</div>
      </OverlayTrigger>

        <div style={{ display: 'inline-block', marginLeft: 3, }}>{' '}{intl.formatMessage(messages['x_payments_made_since'], { lastPaymentDate: moment(invoice.paymentsConnection.edges[0].date).format('ll'), })}</div>

      </div>
    );
  }

  return (
    <div className={styles['divContentStatus']}>

      <OverlayTrigger rootClose trigger={[ 'click', 'focus' ]} placement={'left'} overlay={<Popover className={styles['payments--overlay']}>{renderPopover()}</Popover>}>
        <div className={styles['stageTooltipAnchor']} style={{ display: 'inline-block', }}>{intl.formatMessage(messages['x_payments'], { x: invoice.paymentsConnection.totalCount, })}{' '}{modalOpen ? <i style={{ fontSize: 16, }} className={`${styles['submitting']} material-icons`}>loop</i> : null}</div>
      </OverlayTrigger>

      <div style={{ display: 'inline-block', marginLeft: 3, }}>{intl.formatMessage(messages['x_payments_made_on'], { lastPaymentDate: moment(invoice.paymentsConnection.edges[0].date).format('ll'), })}</div>

    </div>
  );
}

function calcInvoiceStatus(totalAmount, amountPaid, invoice) {
  const _dueDate = moment(invoice.dueDate);
  const now = moment();

  const balanceDue = totalAmount - amountPaid;

  const isPaidInFull = balanceDue === 0.0;
  if(isPaidInFull){
    return 'Closed';
  }

  if(_dueDate.isBefore(now)){
    return 'Overdue';
  }

  // const hasPayment = amountPaid !== 0;
  //
  // if(hasPayment){
  //   return 'Partial';
  // }

  return 'Open';
}
