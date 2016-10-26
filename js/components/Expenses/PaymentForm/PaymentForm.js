import React, {Component, PropTypes} from 'react';
import Relay from 'react-relay';

import LoadingActions from '../../Loading/actions';

import shallowCompare from 'react-addons-shallow-compare';

import {bindActionCreators} from 'redux';
import {reduxForm} from 'redux-form';

import Title from '../../Title/Title';

// import uid from '../../../utils/uid';

// import LazyCache from 'react-lazy-cache';

// import createPaymentDialog, {Header, Body, Footer} from './createPaymentDialog';

import concat from 'lodash.concat';
import orderBy from 'lodash.orderby';
import uniq from 'lodash.uniqby';

import stopEvent from '../../../utils/stopEvent';

import getFieldValue from '../../utils/getFieldValue';

import ButtonToolbar from 'react-bootstrap/lib/ButtonToolbar';
import SplitButton from 'react-bootstrap/lib/SplitButton';
import Button from 'react-bootstrap/lib/Button';
import DropdownButton from 'react-bootstrap/lib/DropdownButton';
import MenuItem from 'react-bootstrap/lib/MenuItem';

import paymentValidation, {} from './paymentValidation';
import * as paymentActions from '../../../redux/modules/v2/paymentsOfBills';

import JournalEntries from '../../JournalEntries/JournalEntries';

import { setBeforeUnloadMessage, unsetBeforeUnloadMessage, } from '../../../utils/unbeforeunload';

import Actions from '../../confirm/actions';
import NotifyActions from '../../notification/NotifyActions';

import classnames from 'classnames';

import styles from './PaymentForm.scss';

import CSSModules from 'react-css-modules';

import Modal from 'react-bootstrap/lib/Modal';

import Dialog, {Header, Body, Footer} from '../../utils/Dialog';

import throttle from 'lodash.throttle';

import moment from 'moment';

import events from 'dom-helpers/events';

import CreditToAccountDetails from './CreditToAccountDetails';
import VendorDetails from './VendorDetails';
import BillingDetails from './BillingDetails';
import PaymentDetails from './PaymentDetails';
import AmountReceived from './AmountReceived';
import Bills from './Bills';
import TotalLine from './TotalLine';
import Memo from './Memo';
import Files from './Files';

import PendingBills from '../PendingBills';
import DrawerPullTab from '../DrawerPullTab';

import Alert from '../../Alert/Alert';

import requiredPropType from 'react-prop-types/lib/all';

function normalizeMoment(d){
  return moment(d)
    .seconds(0)
    .minutes(0)
    .hour(0);
}

import {getBodyWidth, getBodyHeight,} from '../../../utils/dimensions';
function getMinHeight() {
  return getBodyHeight() - 45 /* HEADER */ - 50 /* FOOTER */;
}

import {
  intlShape,
} from 'react-intl';

import messages from './messages';

const DrawerState = {
  Opened: 1,
  Closed: 2,
  Indeterminate: 3,
};

import formatAddress from '../../../utils/formatAddress';

function getMailingAddress({
  displayName,
  mailing_streetAddress,
  mailing_cityTown,
  mailing_stateProvince,
  mailing_postalCode,
  mailing_country,
}){
  const addr = formatAddress({
    address: mailing_streetAddress,
    city: mailing_cityTown,
    // subdivision: mailing_stateProvince,
    postalCode: mailing_postalCode,
    // country: mailing_country,
  });

  return addr.length === 0 ? undefined : [displayName, ...addr].join('\n');
}

@reduxForm({
  form: 'paymentOfBills',
  fields: [
    'id',
    'payee',
    'date',
    'mailingAddress',
    // 'paymentMethod',
    'paymentRef',
    'amountReceived',
    'creditToAccountCode',
    'memo',
    'files',
  ],
  validate: paymentValidation,
  destroyOnUnmount: true,
}, (state, ownProps) => ({
  company: ownProps.company,
  editing: state.paymentsOfBills.editing,
  saveError: state.paymentsOfBills.saveError,
  initialValues: ownProps.payment ? {
    ...ownProps.payment,
    date: normalizeMoment(moment(ownProps.payment.date)).format(),
  } : function(){
    const payee = ownProps.bill ? {
      type: 'Vendor',
      className: `People_${ownProps.company.objectId}`,
      id: ownProps.bill.payee.objectId,
      objectId: ownProps.bill.payee.objectId,
    } : (ownProps.selectedBills && ownProps.selectedBills.length > 0 ? {
      type: 'Vendor',
      className: `People_${ownProps.company.objectId}`,
      objectId: ownProps.selectedBills[0].payee.objectId,
      id: ownProps.selectedBills[0].payee.objectId,
    } : (ownProps.payee ? {
      type: 'Vendor',
      className: `People_${ownProps.company.objectId}`,
      id: ownProps.payee.objectId,
      objectId: ownProps.payee.objectId,
    } : undefined));
    return {
      paymentRef: ownProps.payment ? ownProps.payment.paymentRef : ownProps.company.lastPaymentsTransactionIndex + 1,
      date: normalizeMoment(moment()).format(),
      creditToAccountCode: ownProps.company.paymentsSettings.defaultDepositToAccountCode,
      payee,
      amountReceived: ownProps.bill
        ? ownProps.bill.balanceDue
        : ownProps.amountReceived,
      mailingAddress: ownProps.bill
        ? ownProps.bill.mailingAddress
        : (payee ? getMailingAddress(payee) : undefined),
    }
  }(),
}), dispatch => bindActionCreators(paymentActions, dispatch))
@CSSModules(styles, {allowMultiple: true})
export default class extends React.Component {

  static displayName = 'PaymentForm';

  static contextTypes = {
    intl: intlShape.isRequired,
  };

  static propTypes = {
    payment: requiredPropType(
      React.PropTypes.object,
      function(props, propName, componentName) {
        if (props.formKey !== 'NEW' && !props.payment) {
          return new Error('PaymentForm: payment required!');
        }
      }
    ),

    refresh: PropTypes.func.isRequired,

    fields: PropTypes.object.isRequired,
    dirty: PropTypes.bool.isRequired,
    editStart: PropTypes.func.isRequired,
    editStop: PropTypes.func.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    valid: PropTypes.bool.isRequired,
    invalid: PropTypes.bool.isRequired,
    pristine: PropTypes.bool.isRequired,
    save: PropTypes.func.isRequired,
    submitting: PropTypes.bool.isRequired,
    saveError: PropTypes.object,
    formKey: PropTypes.string.isRequired,
    values: PropTypes.object.isRequired,

    company: PropTypes.object.isRequired,
    viewer: PropTypes.object.isRequired,
  };

  state = {
    modalOpen: false,
    _openBills: DrawerState.Indeterminate,
  };

  constructor(props, context){
    super(props, context);

    const {
      selectedBills = [],
      formKey,
      editing: {
        [formKey]: store,
      },
      vendorOpenBills,
    } = this.props;

    switch (formKey) {
      case 'NEW':

          const {
            bill,
          } = this.props;
          store.changeBills(

            orderBy(

              uniq(
                concat(
                  vendorOpenBills.edges.map(
                    ({node}) => decorateBillItem(store, node, bill)),

                  selectedBills.map(
                    (node) => decorateBillItem(store, node))
                ),

                obj => obj.bill.id
              ),

              [ ({bill}) => bill.balanceDue, ({bill}) => Date.parse(bill.date) ],

              [ 'asc', 'desc' ],
            ),

            {id: formKey, company: this.props.company}
          );

        break;

      default:

        const {
          payment,
        } = this.props;
        store.changeBills(
          orderBy(

            uniq(
              concat(
                vendorOpenBills.edges.map(
                  ({node}) => decorateBillItem(store, node, bill)),

                payment.itemsConnection.edges.map(
                  ({node}) => decoratePaymentItem(store, node))
              ),

              obj => obj.bill.id
            ),

            [ ({bill}) => bill.balanceDue, ({bill}) => Date.parse(bill.date) ],

            [ 'asc', 'desc' ]
          ),
          {id: formKey, company: this.props.company}
        );
    }

    if(this.state._openBills !== DrawerState.Closed){
      this._loadVendorOpenBills();
    }

    // this.cache = new LazyCache(this, {
    //   Dialog: {
    //     params: [
    //       // props that effect how redux-form connects to the redux store
    //     ],
    //     fn: createPaymentDialog(this.props),
    //   }
    // });

  }

  _loadVendorOpenBills = (props = this.props) => {
    const self = this;
    const {
      vendorOpenBills = { edges: [], },
      payment,
      formKey,
      fields: { payee, },
      editing: {
        [formKey]: store,
      }
    } = props;
    const payeeValue = getFieldValue(payee);

    function countValid(){
      return vendorOpenBills.edges
        .filter(({node: { id, }}) => ! store.isKeySelected(id)).length;
    }

    const openBills = payeeValue && countValid() > 0;

    if(this.state.openBills !== openBills){
      this.setState({
        openBills,
        _openBills: openBills && this.state._openBills !== DrawerState.Closed ? DrawerState.Opened : this.state._openBills,
      });
    }
  };

  componentWillReceiveProps(nextProps){
    const {
      selectedBills = [],
      formKey,
      payment,
      editing: {
        [formKey]: store,
      },
      vendorOpenBills,
      fields: { id, },
    } = nextProps;

    const idValue = getFieldValue(id);
    const isSaved = payment || typeof idValue !== 'undefined';

    switch (isSaved ? null : formKey) {
      case 'NEW':

          const {
            bill,
          } = nextProps;
          store.changeBills(

            orderBy(

              uniq(
                concat(
                  vendorOpenBills.edges.map(
                    ({node}) => decorateBillItem(store, node, bill)),

                  selectedBills.map(
                    (node) => decorateBillItem(store, node))
                ),

                obj => obj.bill.id
              ),

              [ ({bill}) => bill.balanceDue, ({bill}) => Date.parse(bill.date) ],

              [ 'asc', 'desc' ],
            ),
            {id: formKey, company: nextProps.company}
          );

        break;

      default:

        const {
          payment,
        } = nextProps;
        store.changeBills(
          orderBy(

            uniq(
              concat(
                vendorOpenBills.edges.map(
                  ({node}) => decorateBillItem(store, node, bill)),

                (payment || this._payment).itemsConnection.edges.map(
                  ({node}) => decoratePaymentItem(store, node))
              ),

              obj => obj.bill.id
            ),

            [ ({bill}) => bill.balanceDue, ({bill}) => Date.parse(bill.date) ],

            [ 'asc', 'desc' ],
          ),
          {id: idValue, company: nextProps.company}
        );
    }

    if(this.state._openBills !== DrawerState.Closed){
      this._loadVendorOpenBills(nextProps);
    }

    // this.cache.componentWillReceiveProps(nextProps);
  }

  _onReceivePayments = (bills) => {
    const {
      formKey,
      editing: {
        [formKey]: store,
      },
      fields: { amountReceived, },
    } = this.props;

    bills.forEach(({ id, billItemsConnection, itemsConnection, billPaymentsConnection, paymentsConnection, }) => {
      const balanceDue = (itemsConnection || billItemsConnection).totalAmount - (paymentsConnection || billPaymentsConnection).totalAmountPaid;
      store.setAmountById(id, balanceDue);
    });

    amountReceived.onChange(
      store.total
    );
  };

  _clearPayment = () => {
    const {
      formKey,
      editing: {
        [formKey]: store,
      },
      fields: {
        amountReceived,
      },
    } = this.props;

    store.toggleNone();
    amountReceived.onChange(undefined);
  };

  // constructor(props, context) {
  //   super(props, context);
  //
  //   const { formKey, changeBills, } = this.props;
  //
  //   changeBills(formKey, [{
  //     id: uid.type('Bill-O'),
  //     item: 'Bill 1',
  //     date: moment(),
  //     dueDate: moment().add(12, 'days'),
  //   }, {
  //     id: uid.type('Bill-O'),
  //     item: 'Bill 2',
  //     date: moment().add(-10, 'days'),
  //     dueDate: moment().add(2, 'days'),
  //   }, {
  //     id: uid.type('Bill-O'),
  //     item: 'Bill 3',
  //     date: moment().add(-30, 'days'),
  //     dueDate: moment().add(-5, 'days'),
  //   },]);
  // }

  componentDidMount() {
    events.on(window, 'resize', this._handleWindowResize);
    // this._showHelp();

    this.refs.client && this.refs.client.focus();

    ga('send', 'pageview', '/modal/app/makepayment');
  }

  _showHelp(){
    if(process.env.NODE_ENV === 'production' && localStorage.getItem('payment-form.help.done', false)){
      return;
    }

    const {styles} = this.props;

    const {intl,} = this.context;

    const Component = ({remove}) => {
      this._removeHelp = remove;
      return (
        <div className='card card-block card-inverse card-info' style={{}}>
          <h3 className='card-title'>{intl.formatMessage(messages['welcome'])}</h3>

          <p className='card-text'>
            {intl.formatMessage(messages['welcome_intro'])}:
          </p>

          <p className='card-text'>
            {this.props.company.salesSettings.showProducts
              ? <cite style={{display: 'block'}}>1. {intl.formatMessage(messages['rule_1_1'])}</cite>
              : <cite style={{display: 'block'}}>1. {intl.formatMessage(messages['rule_2_1'])}</cite>
            }

            {this.props.company.salesSettings.showRates
              ? <cite style={{display: 'block'}}>2. {intl.formatMessage(messages['rule_1_2'])}</cite>
              : <cite style={{display: 'block'}}>1. {intl.formatMessage(messages['rule_2_2'])}</cite>
            }
          </p>

          <a onClick={e => {localStorage.setItem('payment-form.help.done', true); remove();}} className='btn btn-primary' style={{textTransform: 'uppercase'}}>{intl.formatMessage(messages['got_it'])}</a>
        </div>
      )
    };

    setTimeout(() => {

      NotifyActions.add({
        type: 'custom',
        data: Component,
        duration: 3 * 60000,
        slug: styles['payment-form--error-message'],
        onRemove: () => { this._removeHelp = undefined; },
      });

    }, 1000);
  }

  componentWillUnmount() {
    this._removeHelp && this._removeHelp();
    unsetBeforeUnloadMessage();
    events.off(window, 'resize', this._handleWindowResize);
  }

  componentDidUpdate(){
    const { intl, } = this.context;

    const {
      dirty,
      formKey,
      editing: {
        [formKey]: store,
      },
    } = this.props;

    if(dirty || store.isDirty){
      setBeforeUnloadMessage(
        intl.formatMessage(messages['Confirm'])
      );
    }
  }

  _handleWindowResize = throttle(() => {
    this.forceUpdate();
  }, 150);

  _handleClose = () => {
    const self = this;
      setImmediate(() => {
        self.props.onPaymentVendorSelected(
          {id: undefined},
          ({ done, }) => {
            if(done){
              self.props.onCancel();
            }
          }
        );
      });

    };

    _handleSaveAndNew = () => {
      this._handleClose();

      setTimeout(() => {
        this.props.onNew();
      }, 200);
    };

    _handleCancel = () => {
      const {intl,} = this.context;
      const {
        dirty,
        formKey,
        editing: {
          [formKey]: store,
        },
      } = this.props;

      if(dirty || store.isDirty){
        Actions.show(intl.formatMessage(messages['Confirm']))
          .then(this._handleClose)
          // .then(() => {
          //   this._handleClose();
          // })
          .catch(() => {});
      }else{
        this._handleClose();
      }
    };

    _onSave(){
      return this.props.handleSubmit((data) => {

        const {
          styles,
          formKey,
          editing: {
            [formKey]: store,
          },
        } = this.props;

        const items = [];

        for(let i = 0, _len = store.getSize(); i < _len; i++){
          const line = store.getObjectAt(i);

          if(typeof line.amount !== 'undefined'){
            const {valid} = store.isValid(line);

            if(valid){
              items.push(decoratePaymentItemForServer(i, line));
            }else{
              store.setShowErrors(true);
              store.setActiveRow(i);
              return Promise.reject();
            }
          }
        }

        // if(items.length === 0){
        //   const {intl,} = this.context;
        //   NotifyActions.add({
        //     type: 'danger',
        //     slug: styles['payment-form--error-message'],
        //     data: () => (
        //           <span>
        //             {intl.formatMessage(messages['at_least_one_entry_required'])}
        //           </span>
        //     ),
        //   });
        //
        //   return Promise.reject();
        // }

        return new Promise((resolve, reject) => {
          LoadingActions.show();
          this.props.save({ ...decorateData(data), id: this.props.payment ? this.props.payment.objectId : getFieldValue(this.props.fields.id), payment: this.props.payment, _vendor: this.props.payee, items, company: this.props.company, viewer: this.props.viewer, })
                .then(result => {
                  LoadingActions.hide();

                  if (result && typeof result.error === 'object') {
                    return reject(); // messages['error']
                  }

                  // if(close){
                  //   this._handleClose();
                  // }else{
                  //   this._handleSaveAndNew();
                  // }
                 resolve();
               });
        });
      });
    }
    _onSaveClose(close = true){
      return this.props.handleSubmit((data) => {

        const {
          styles,
          formKey,
          editing: {
            [formKey]: store,
          },
        } = this.props;

        const items = [];

        for(let i = 0, _len = store.getSize(); i < _len; i++){
          const line = store.getObjectAt(i);

          if(typeof line.amount !== 'undefined'){
            const {valid} = store.isValid(line);

            if(valid){
              items.push(decoratePaymentItemForServer(i, line));
            }else{
              store.setShowErrors(true);
              store.setActiveRow(i);
              return Promise.reject();
            }
          }
        }

        // if(items.length === 0){
        //   const {intl,} = this.context;
        //   NotifyActions.add({
        //     type: 'danger',
        //     slug: styles['payment-form--error-message'],
        //     data: () => (
        //           <span>
        //             {intl.formatMessage(messages['at_least_one_entry_required'])}
        //           </span>
        //     ),
        //   });
        //
        //   return Promise.reject();
        // }

        return new Promise((resolve, reject) => {
          LoadingActions.show();
          this.props.save({ ...decorateData(data), id: this.props.payment ? this.props.payment.objectId : getFieldValue(this.props.fields.id), payment: this.props.payment, _vendor: this.props.payee, items, company: this.props.company, viewer: this.props.viewer, })
                .then(result => {
                  LoadingActions.hide();

                  if (result && typeof result.error === 'object') {
                    return reject(); // messages['error']
                  }

                  if(close){
                    this._handleClose();
                  }else{
                    this._handleSaveAndNew();
                  }
                 resolve();
               });
        });
      });
    }
  _onSaveOnly(){
      return this.props.handleSubmit((data) => {

        const {
          styles,
          formKey,
          editing: {
            [formKey]: store,
          },
        } = this.props;

        const items = [];

        for(let i = 0, _len = store.getSize(); i < _len; i++){
          const line = store.getObjectAt(i);

          if(typeof line.amount !== 'undefined'){
            const {valid} = store.isValid(line);

            if(valid){
              items.push(decoratePaymentItemForServer(i, line));
            }else{
              store.setShowErrors(true);
              store.setActiveRow(i);
              return Promise.reject();
            }
          }
        }

        // if(items.length === 0){
        //   const {intl,} = this.context;
        //   NotifyActions.add({
        //     type: 'danger',
        //     slug: styles['payment-form--error-message'],
        //     data: () => (
        //           <span>
        //             {intl.formatMessage(messages['at_least_one_entry_required'])}
        //           </span>
        //     ),
        //   });
        //
        //   return Promise.reject();
        // }

        return new Promise((resolve, reject) => {
          LoadingActions.show();
          this.props.save({ ...decorateData(data), id: this.props.payment ? this.props.payment.objectId : getFieldValue(this.props.fields.id), payment: this.props.payment, _vendor: this.props.payee, items, company: this.props.company, viewer: this.props.viewer, })
                .then(result => {
                  LoadingActions.hide();

                  if (result && typeof result.error === 'object') {
                    return reject(); // messages['error']
                  }

                  const {
                    company,
                    initializeForm,
                    fields: {
                      id,
                    }
                  } = this.props;

                  function decoratePayment({ objectId, __dataID__, id, mailingAddress, payee, paymentRef, amountReceived, creditToAccountCode, paymentMethod, date, paymentItemsConnection : itemsConnection, memo, files, }) {
                    const balanceDue = amountReceived - itemsConnection.totalAmountPaid;
                    return {
                      __dataID__,
                      id,
                      payee: payee ? {
                        ...payee,
                        className: `People_${company.objectId}`,
                      } : undefined,
                      date,
                      paymentMethod,
                      paymentRef,
                      creditToAccountCode,
                      type: 'Payment',
                      refNo: paymentRef,
                      mailingAddress,
                      amountReceived,
                      balanceDue,
                      total: amountReceived,
                      totalAmountPaid: itemsConnection.totalAmountPaid,
                      status: balanceDue === 0.0
                        ? 'Closed'
                        : (balanceDue > 0.0 ? 'Partial' : 'Open'),
                      memo, files,
                      itemsConnection,
                      objectId,
                      dueDate: date,
                    };
                  }

                  const payment = decoratePayment(result.result);

                  this._payment = payment;

                  function decoratePaymentItem({ id, amount, bill: { id: billId, objectId, date, dueDate, memo, paymentRef, billItemsConnection : itemsConnection, billPaymentsConnection : paymentsConnection, }, }){
                    const balanceDue = itemsConnection.totalAmount - paymentsConnection.totalAmountPaid;
                    const obj = {
                      __selected: true,
                      __existed: true,
                      __originalAmount: amount,
                      id,
                      amount: amount,
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
                    };

                    return obj;
                  }

                  store.reInit(
                    payment.itemsConnection.edges.map(({node}) => decoratePaymentItem(node)), { id: payment.objectId, company, });

                  const payee = payment.payee ? {
                    type: 'Vendor',
                    className: `People_${this.props.company.objectId}`,
                    id: payment.payee.objectId,
                    objectId: payment.payee.objectId,
                  } : undefined;

                  initializeForm({
                    ...payment,
                    id: payment.objectId,
                    date: normalizeMoment(moment(payment.date)).format(),
                    payee,
                  });

                  resolve();
               });
        });
      });
    }

    _onPaymentVendorSelected = (...args) => {
      if(this.state._openBills !== DrawerState.Closed){
        this.setState({
          _openBills: DrawerState.Opened,
        }, () => {
          this.props.onPaymentVendorSelected(...args);
        });
      }
    }

  render() {
    const self = this;

    // const { Dialog, } = this.cache;

    const {
      formKey,
      dirty,
      editStop,
      fields: {
        id,
        payee,
        date,
        mailingAddress,
        paymentRef,
        creditToAccountCode,
        amountReceived,
        memo,
        files,
      },
      handleSubmit,
      valid,
      invalid,
      pristine,
      save,
      submitting,
      saveError: {
        [formKey]: saveError,
      },
      editing: {
        [formKey]: store,
      },
      values,

      styles,

      refresh,

      payment,
      vendorOpenBills,

    } = this.props;

    const {intl,} = this.context;

    const bodyWidth = getBodyWidth();

    const minHeight = getMinHeight();

    const amountReceivedValue = getFieldValue(amountReceived);

    const { openBills = false, _openBills, } = this.state;

    // console.log('=====================================');
    //
    // console.log('Valid', valid);
    // console.log('Invalid', invalid);
    // console.log('initialValues', [payee, mailingAddress, date, paymentRef, creditToAccountCode, amountReceived, memo, files].map(({initialValue}) => initialValue));
    // console.log('Values', values);
    // console.log('Values 2', [payee, mailingAddress, date, paymentRef, creditToAccountCode, amountReceived, memo, files].map(({value}) => value));
    // console.log('Invalids', [payee, mailingAddress, date, paymentRef, creditToAccountCode, amountReceived, memo, files].filter(({invalid}) => invalid));
    // console.log('dirty', [payee, mailingAddress, date, paymentRef, creditToAccountCode, amountReceived, memo, files].filter(({dirty}) => dirty));
    // console.log('Store', 'isEmpty', store.isEmpty);
    //
    // console.log('=====================================');

    const isSaved = payment || typeof getFieldValue(id) !== 'undefined';

    const _dirty = dirty || store.isDirty;

    return (
      <Modal dialogClassName={classnames(`${styles['modal']} payment-form`, { drawerOpen: openBills && _openBills !== DrawerState.Closed, })}
             dialogComponentClass={Dialog}
             className={classnames({'payment-form form modal-fullscreen': true, [styles['payment-form'] || '']: true, })}
             show={true} keyboard={true} backdrop={false} onHide={() => this._handleCancel()} autoFocus enforceFocus>

        <Header>

          <div styleName='tableCell'>

            <div styleName='f-title'
              style={{display: 'inline-block', }}>{intl.formatMessage(messages['Title'])} nº{getFieldValue(paymentRef)}
            </div>

            <div styleName='icon'>
              <i style={{verticalAlign: 'middle'}} className='material-icons md-light'>settings</i>
            </div>

          </div>

        </Header>

        <Body>

        <div styleName='table stretch' style={{ overflow: 'hidden', }}>

          <div styleName='tableCell'>

            <div>

              <div className='the-container table' style={{}}>

                <div style={{}}>

                  <div styleName='paymentTop'>

                    <div styleName='innerRow'>

                      <div styleName='customerDetailsBox'>

                        <VendorDetails
                          ref={'client'}
                          onPaymentVendorSelected={this._onPaymentVendorSelected}
                          formKey={formKey}
                          company={this.props.company}
                          viewer={this.props.viewer}
                          payment={this.props.payment}
                          fields={{payee, dirty, valid, invalid, pristine, save, submitting, values,}}
                        />

                      </div>

                      <div styleName='creditToAccountCodeDetailsBox'>
                        <CreditToAccountDetails
                          depositsAccounts={this.props.depositsAccounts}
                          company={this.props.company}
                          viewer={this.props.viewer}
                          formKey={formKey}
                          fields={{creditToAccountCode, dirty, valid, invalid, pristine, submitting, values,}}
                        />
                      </div>

                      <div styleName='balanceDueBox' style={{ right: openBills && _openBills !== DrawerState.Closed ? 226 + 32 : 0, position: 'absolute', }}>

                        <AmountReceived
                          formKey={formKey}
                          store={store}
                          company={this.props.company}
                          viewer={this.props.viewer}
                          payment={this.props.payment}
                          fields={{ dirty, amountReceived, valid, invalid, pristine, save, submitting, values, }}
                        />

                      </div>

                    </div>

                  </div>

                  {saveError && <Alert title={intl.formatMessage(messages['ErrorTitle'])} type={'error'}>{intl.formatMessage({ ...saveError, id: saveError._id, })}</Alert>}

                  <div styleName='billingDetailsRow'>

                    <div styleName='innerRow'>

                      <BillingDetails
                        company={this.props.company}
                        payment={payment}
                        formKey={formKey}
                        fields={{ mailingAddress, date, paymentRef, dirty, valid, invalid, pristine, save, submitting, values,}}
                      />

                    </div>

                  </div>

                  <div styleName='paymentDetailsRow'>

                    <div styleName='innerRow'>

                      <PaymentDetails
                        company={this.props.company}
                        store={store}
                        payment={payment}
                        formKey={formKey}
                        // depositsAccounts={this.props.depositsAccounts}
                        fields={{ amountReceived, dirty, valid, invalid, pristine, save, submitting, values,}}
                      />

                    </div>

                  </div>

                  <div styleName='itemsContainerRow'>

                    <div styleName='innerRow'>


                      <div styleName='items'>

                        {store.isEmpty ? null : <Bills
                          // refresh={refresh}
                          company={this.props.company}
                          payment={payment}
                          viewer={this.props.viewer}
                          formKey={formKey}
                          store={store}
                          fields={{ refresh, amountReceived, dirty, valid, invalid, pristine, submitting, values,}}
                          height={minHeight}
                          bodyWidth={openBills ? bodyWidth - 226 : bodyWidth}
                          onBill={this.props.onBill}
                        />}

                      </div>

                    </div>

                  </div>

                  <div>

                    <div styleName='innerRow'>

                      <div className='row'>

                        <div className='col-sm-6 first-col'>

                          <div styleName='memoRow'>

                            <div styleName='innerRow'>

                              <Memo
                                formKey={formKey}
                                payment={payment}
                                fields={{memo, dirty, valid, invalid, pristine, save, submitting, values,}}
                              />

                            </div>

                          </div>


                        </div>

                        {(typeof amountReceivedValue === 'number' && isFinite(amountReceivedValue)) || !store.isEmpty ? <div className='col-sm-6 last-col'>

                          <div styleName='totalRow'>

                            <div styleName='innerRow'>

                              <TotalLine
                                formKey={formKey}
                                store={store}
                                payment={payment}
                                clearPayment={this._clearPayment}
                                fields={{ amountReceived, dirty, valid, invalid, pristine, save, submitting, values,}}
                              />

                            </div>

                          </div>

                        </div> : null}

                      </div>

                    </div>

                  </div>

                  <div>

                      <div styleName='innerRow'>

                        <div className='row' style={{}}>

                          <div className='col-sm-12 first-col last-col'>

                            <div styleName='filesRow'>

                              <hr styleName='sectionDivider'/>

                              <div styleName='innerRow' style={{width: '40%', minWidth: 492,}}>

                                <Files
                                  payment={payment}
                                  formKey={formKey}
                                  fields={{files, dirty, valid, invalid, pristine, submitting, values,}}
                                />

                              </div>

                            </div>

                          </div>

                        </div>

                      </div>

                    </div>

                </div>

              </div>

          </div>

            {_openBills !== DrawerState.Indeterminate && openBills && <DrawerPullTab onToggle={this._onToggleDrawerPullTab} opened={_openBills !== DrawerState.Closed}/>}

          </div>

          {openBills && <div styleName={classnames({ closeBills: _openBills === DrawerState.Closed, openBills: _openBills !== DrawerState.Closed, })} style={{ display: 'table-cell', overflow: 'auto', }}>

            <div>

              {_openBills !== DrawerState.Closed && <PendingBills
                bodyHeight={minHeight + 50 + 45}
                vendorOpenBills={vendorOpenBills}
                addOnlyIf={this._addOnlyIf}
                onAdd={(bills) => { this._onReceivePayments(bills) }}
                onOpen={(bill) => { this.props.onBill(bill); }}
              />}

            </div>

          </div>}

        </div>

        </Body>

        <Footer>

          <div styleName='tableCell' style={{textAlign: 'left'}}>

            <button
              styleName='btn  dark'
              onClick={() => this._handleCancel()}
              disabled={submitting}
              className='unselectable'>{function () {
              // const _dirty = dirty || store.isDirty;
              return intl.formatMessage(messages[isSaved && !_dirty ? 'close' : 'cancel']);
            }()}
            </button>

          </div>

          <div styleName='tableCell' style={{textAlign: 'center'}}>

            <div>
              {isSaved && <PaymentActions onDelete={this._del()} onShowJournalEntries={this._showJournal} className={'unselectable'} styles={styles}/>}
            </div>

          </div>

          <div styleName='tableCell ' style={{textAlign: 'right'}}>

            {/*<button
              styleName='btn primary'
              onClick={handleSubmit((data) => {
              return save({...data})
                    .then(result => {
                      if (result && typeof result.error === 'object') {
                        return Promise.reject(); // { defaultMessage: messages['error'].defaultMessage, _id: messages['error'].id, }
                      }

                      handleClose();
                    });
            })}
              disabled={invalid || submitting}
              className={'unselectable' + (valid ? ' green' : '')}>
              {' '}{intl.formatMessage(messages['save'])}
            </button>

            <button
              styleName='btn primary'
              style={{marginLeft: 12}}
              onClick={handleSubmit((data) => {
              return save({...data})
                    .then(result => {
                      if (result && typeof result.error === 'object') {
                        return Promise.reject(); // { defaultMessage: messages['error'].defaultMessage, _id: messages['error'].id, }
                      }

                      handleClose();
                    });
            })}
              disabled={invalid || submitting}
              className={'unselectable' + (valid ? ' green' : '')}>
              {' '}{intl.formatMessage(messages['saveAndNew'])}
            </button>*/}

            {function(){
              // const _dirty = dirty || store.isDirty;
              return (
                <MySplitButton
                  className={'unselectable' + (valid && _dirty ? ' green valid' : (invalid || submitting || !_dirty ? ' disabled' : ''))}
                  styleName={'btn primary'}
                  styles={styles}
                  valid={valid}
                  onSave={self._onSave.bind(self)}
                  onSaveClose={self._onSaveClose.bind(self)}
                  onSaveOnly={self._onSaveOnly.bind(self)}
                  disabled={invalid || submitting || !_dirty}
                  submitting={submitting}
                />
              );
            }()}

          </div>

        </Footer>

        {this.journalEntriesModal()}

        <Title title={intl.formatMessage(messages['Title'])}/>

      </Modal>
    );
  }

  _addOnlyIf = ({ node: { id, }, }) => {
    const {
      formKey,
      editing: {
        [formKey]: store,
      },
    } = this.props;
    return !store.isKeySelected(id);
  };

  _onToggleDrawerPullTab = (e) => {
    stopEvent(e);

    const _openBills = this.state._openBills !== DrawerState.Closed
      ? DrawerState.Closed
      : DrawerState.Opened;

    if(_openBills !== DrawerState.Closed){
      this.state._openBills = _openBills;
      this._loadVendorOpenBills();
    }else{
      this.setState({
        _openBills,
        openBills: false,
      })
    }
  };

  _del = () => {
    const {intl,} = this.context;
    return this.props.handleSubmit(() => {
      return Actions.show(intl.formatMessage(messages['ConfirmDelete']))
        .then(() => {
          return new Promise((resolve, reject) => {
            const getObj = () => {
              const id = getFieldValue(this.props.fields.id);
              return {
                __dataID__: id,
                id,
                objectId: id,
              };
            };
            this.props.del({ payment: this.props.payment || getObj(), company: this.props.company, viewer: this.props.viewer, })
                  .then(result => {
                    if (result && typeof result.error === 'object') {
                      return reject(); // messages['error']
                    }

                    this._handleClose();
                   resolve();
                 });
          });
        })
        .catch(() => {});
    });
  };

  _showJournal = (e) => {
    stopEvent(e);
    this.setState({
      modalOpen: true,
    })
  };

  _close = (e) => {
    stopEvent(e);
    this.setState({
      modalOpen: false,
    })
  };

  journalEntriesModal = () => {
    if(this.state.modalOpen){
      const self = this;
      const obj = this.props.payment || function () {
          const id = getFieldValue(self.props.fields.id);
          const payee = getFieldValue(self.props.fields.payee);
          return {
            __dataID__: id,
            id,
            objectId: id,
            payee,
          };
        }();
      return (
        <JournalEntries
          type={'PaymentOfBills'}
          company={this.props.company}
          viewer={this.props.viewer}
          person={obj.payee}
          id={obj.objectId}
          onCancel={this._close}
        />
      );
    }
  }

}

class MySplitButton extends React.Component{
  static contextTypes = {
    intl: intlShape.isRequired,
  };
  shouldComponentUpdate(nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState);
  }
  _onClick = (close, e) => {
    stopEvent(e);
    const {onSaveClose, } = this.props;
    const fn = onSaveClose(close);
    fn(e);
  };
  render(){
    const {intl} = this.context;
    const {onSave, onSaveOnly, onSaveClose, className, disabled, submitting, valid, styles, } = this.props;
    // const title = (
    //   <span>{submitting ? <i className={`${styles['submitting']} material-icons`}>loop</i> : null}{' '}{intl.formatMessage(messages['saveAndClose'])}</span>
    // );
    const title = intl.formatMessage(messages['saveAndClose']);
    return (
      <div className={styles['dropdown']}>
        <ButtonToolbar>

          <button
            // styleName='btn primary'
            onClick={onSaveOnly()}
            style={{marginLeft: 12,}}
            disabled={disabled}
            className={`${disabled ? 'disabled' : ''} ${className} btn btn-default ${styles['btn']} ${styles['dark']}`}>
            {' '}{intl.formatMessage(messages['save'])}
          </button>

          <SplitButton className={className} disabled={disabled} onClick={this._onClick.bind(this, true)} title={title} dropup pullRight id={'payment-form'}>

            <MenuItem onClick={this._onClick.bind(this, false)} eventKey={'1'}>
              {intl.formatMessage(messages['saveAndNew'])}
            </MenuItem>

          </SplitButton>

        </ButtonToolbar>
      </div>
    );
  }
}

class PaymentActions extends React.Component{
  static contextTypes = {
    intl: intlShape.isRequired,
  };
  _onDelete = (e) => {
    stopEvent(e);
    this.props.onDelete();
  };
  _onShowJournalEntries = (e) =>{
    stopEvent(e);
    this.props.onShowJournalEntries();
  };
  render(){
    const {intl} = this.context;
    const { className, styles, onDelete, onShowJournalEntries, } = this.props;
    return (
      <div className={styles['actions-dropdown']}>
        <ButtonToolbar>

          <DropdownButton bsStyle={'link'} noCaret title={intl.formatMessage(messages['Actions'])} className={className} dropup>

            <MenuItem onClick={this._onDelete} eventKey={'delete'}>
              {intl.formatMessage(messages['Delete'])}
            </MenuItem>

            <MenuItem onClick={this._onShowJournalEntries} eventKey={'journalEntries'}>
              {intl.formatMessage(messages['JournalEntries'])}
            </MenuItem>

          </DropdownButton>

        </ButtonToolbar>
      </div>
    );
  }
}

function decoratePaymentItemForServer(rowIndex, { amount, bill, }){
  return {
    index: rowIndex,
    amount: amount,
    billId: bill.objectId,
  };
}

function unNormalizeMoment(d){
  const n = moment();
  return moment(d)
    .hour(n.hour())
    .minutes(n.minute())
    .seconds(n.seconds());
}

function decorateData({
  payee, date, mailingAddress, paymentRef, creditToAccountCode, amountReceived, memo, files, }){
  return {
    payee: {
      className: payee.className,
      id: payee.objectId,
    },
    date: unNormalizeMoment(moment(date)).format(),
    mailingAddress,
    paymentRef,
    creditToAccountCode,
    amountReceived,
    memo,
    files,
  };
}

function decorateBillItem(store, __original, { objectId : selectedBillId, balanceDue: selectedBillIdBalanceDue, } = {}){
 const { id, objectId, date, dueDate, memo, paymentRef, billItemsConnection, itemsConnection, billPaymentsConnection, paymentsConnection, } = __original;
  const balanceDue = (itemsConnection || billItemsConnection).totalAmount - (paymentsConnection || billPaymentsConnection).totalAmountPaid;
  const obj = {
    __existed: false,
    __originalAmount: undefined,
    id,
    bill: {
      id,
      objectId,
      paymentRef,
      refNo: paymentRef,
      total: (itemsConnection || billItemsConnection).totalAmount,
      balanceDue,
      amountReceived: (paymentsConnection || billPaymentsConnection).totalAmountPaid,
      date,
      dueDate,
      memo,
      __original,
    },
  }

  if(store.hasKey(id)){
    obj.__selected = store.isKeySelected(id);
    obj.amount = store.getAmount(id);
  }else if(typeof selectedBillId !== 'undefined'){
    obj.__selected = selectedBillId === objectId;
    if(obj.__selected){
      obj.amount = selectedBillIdBalanceDue;
    }else{
      obj.amount = undefined;
    }
  }

  return obj;
}

function decoratePaymentItem(store, { id, amount, bill : __original, }){
  const { id: billId, objectId, date, dueDate, memo, paymentRef, billItemsConnection, itemsConnection, billPaymentsConnection, paymentsConnection, } = __original;
  const balanceDue = (itemsConnection || billItemsConnection).totalAmount - (paymentsConnection || billPaymentsConnection).totalAmountPaid;
  const hasKey = store.hasKey(id);
  const obj = {
    __existed: true,
    __originalAmount: amount,
    id,
    amount: hasKey ? store.getAmount(id) : amount,
    bill: {
      id: billId,
      objectId,
      paymentRef,
      refNo: paymentRef,
      total: (itemsConnection || billItemsConnection).totalAmount,
      balanceDue,
      amountReceived: (paymentsConnection || billPaymentsConnection).totalAmountPaid,
      date,
      dueDate,
      memo,
      __original,
    },
  };

  if(hasKey){
    obj.__selected = store.isKeySelected(id);
  }

  return obj;
}
