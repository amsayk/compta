import React, {Component, PropTypes} from 'react';
import Relay from 'react-relay';

import LoadingActions from '../../Loading/actions';

import shallowCompare from 'react-addons-shallow-compare';

import {bindActionCreators} from 'redux';
import {reduxForm} from 'redux-form';

import Title from '../../Title/Title';

import stopEvent from '../../../utils/stopEvent';

import expenseValidation, {} from './expenseValidation';
import * as expenseActions from '../../../redux/modules/v2/expenses';

import JournalEntries from '../../JournalEntries/JournalEntries';

import DrawerPullTab from '../DrawerPullTab';

import { setBeforeUnloadMessage, unsetBeforeUnloadMessage, } from '../../../utils/unbeforeunload';

import Actions from '../../confirm/actions';
import NotifyActions from '../../notification/NotifyActions';

import ButtonToolbar from 'react-bootstrap/lib/ButtonToolbar';
import SplitButton from 'react-bootstrap/lib/SplitButton';
import DropdownButton from 'react-bootstrap/lib/DropdownButton';
import MenuItem from 'react-bootstrap/lib/MenuItem';

import classnames from 'classnames';

import Alert from '../../Alert/Alert';

import styles from './ExpenseForm.scss';

import CSSModules from 'react-css-modules';

import Modal from 'react-bootstrap/lib/Modal';

import Dialog, {Header, Body, Footer} from '../../utils/Dialog';

import throttle from 'lodash.throttle';

import getFieldValue from '../../utils/getFieldValue';

import moment from 'moment';

import events from 'dom-helpers/events';

import {getBodyHeight, getBodyWidth} from '../../../utils/dimensions'

import {
  intlShape,
} from 'react-intl';

import messages from './messages';

import requiredPropType from 'react-prop-types/lib/all';

// import LazyCache from 'react-lazy-cache';

// import createDialog from '../createDialog';

import PayeeDetails from './PayeeDetails';
import BalanceDue from './BalanceDue';
import CreditToAccountDetails from './CreditToAccountDetails';
import PendingBills from '../PendingBills';
// import BillingDetails from './BillingDetails';
import PaymentDetails from './PaymentDetails';
import AccountItems from './AccountItems';
import TotalLine from './TotalLine';
// import TaxForm from './TaxForm';
// import DiscountForm from './DiscountForm';
import Memo from './Memo';
import Files from './Files';

import VATInputType from './VATInputType';

import NoVATWarning from '../../TVA/utils/NoVATWarning';
import VATPeriodWarning from '../../TVA/utils/VATPeriodWarning';

function dateIsCurrentDeclaration(company, date) {
  if(company.VATSettings.enabled){
    const { periodStart, periodEnd, } = company.VATDeclaration;
    return unNormalizeMoment(date).isBetween(
      periodStart, periodEnd, null, '[]');
  }

  return true;
}

function getMinHeight() {
  return getBodyHeight() - 45 /* HEADER */ - 50 /* FOOTER */;
}

function getTermsNumberOfDays(terms){
  switch (terms) {
    case 'OnReception':  return 0;
    case 'Net_15':       return 15;
    case 'Net_30':       return 30;
    case 'Net_60':       return 60;
    case 'Custom':       throw 'getTermsNumberOfDays#InvalidTerms';
  }
}

function normalizeMoment(d){
  return moment(d)
    .seconds(0)
    .minutes(0)
    .hour(0);
}

const DrawerState = {
  Opened: 1,
  Closed: 2,
  Indeterminate: 3,
};

const VAT_NAME_TO_ID = {
  Value_20: 1,
  Value_14: 2,
  Value_10: 3,
  Value_Exempt: 4,
  Value_7: 5,
};

@reduxForm({
  form: 'expense',
  fields: [
    'id',
    'payee',
    'creditToAccountCode',
    'date',
    'paymentMethod',
    'paymentRef',

    'inputType',

    'memo',
    'files',
  ],
  validate: expenseValidation,
  asyncBlurFields: [],
}, (state, ownProps) => ({
  filterArgs: ownProps.filterArgs,
  editing: state.expenses.editing,
  saveError: state.expenses.saveError,
  initialValues: ownProps.expense ? {
    ...ownProps.expense,
    date: normalizeMoment(moment(ownProps.expense.date)).format(),
    inputType: VATInputType_ID_BY_NAME[ownProps.expense.inputType],
  } : function(){
    const payee = ownProps.payee ? {
      type: ownProps.payee.type,
      className: `People_${ownProps.company.objectId}`,
      id: ownProps.payee.objectId,
      objectId: ownProps.payee.objectId,
    } : undefined;
    return {
      paymentMethod: ownProps.company.paymentsSettings.preferredPaymentMethod,
      creditToAccountCode: ownProps.company.salesSettings.defaultDepositToAccountCode,
      date: normalizeMoment(moment()).format(),
      payee,
      inputType: ownProps.company.VATSettings.enabled ? 1 /* HT */ : 3 /* NO_VAT */,
    };
  }(),
}), dispatch => bindActionCreators(expenseActions, dispatch))
@CSSModules(styles, {allowMultiple: true})
export default class extends React.Component {

  static displayName = 'ExpenseForm';

  static contextTypes = {
    intl: intlShape.isRequired,
  };

  static propTypes = {
    expense: requiredPropType(
      React.PropTypes.object,
      function(props, propName, componentName) {
        if (props.formKey !== 'NEW' && !props.expense) {
          return new Error('ExpenseForm: expense required!');
        }
      }
    ),

    fields: PropTypes.object.isRequired,
    dirty: PropTypes.bool.isRequired,
    editStart: PropTypes.func.isRequired,
    editStop: PropTypes.func.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    valid: PropTypes.bool.isRequired,
    invalid: PropTypes.bool.isRequired,
    pristine: PropTypes.bool.isRequired,
    save: PropTypes.func.isRequired,
    del: PropTypes.func.isRequired,
    setActiveRow: PropTypes.func.isRequired,
    addMoreRows: PropTypes.func.isRequired,
    clearAllRows: PropTypes.func.isRequired,
    clearRow: PropTypes.func.isRequired,
    resetLines: PropTypes.func.isRequired,
    moveOp: PropTypes.func.isRequired,
    refresh: PropTypes.func.isRequired,
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


    if(this.state._openBills !== DrawerState.Closed){
      this._loadVendorOpenBills();
      // const self = this;
      // const {
      //   // selectedBills = [],
      //   store,
      //   vendorOpenBills = { edges: [], },
      //   expense,
      //   formKey,
      //   fields: { payee, },
      //   // styles,
      // } = this.props;
      // const payeeValue = getFieldValue(payee);
      //
      // this.state.openBills = payeeValue && vendorOpenBills.edges.length ? function(){
      //   const { type, objectId, } = payeeValue;
      //   switch (type) {
      //     case 'Vendor':
      //
      //     // if(expense && expense.payee.objectId === objectId) {
      //     //   return false;
      //     // }
      //
      //     return true;
      //
      //     default: return false;
      //   }
      // }() : false;
    }


    // this.cache = new LazyCache(this, {
    //   Dialog: {
    //     params: [
    //       // props that effect how redux-form connects to the redux store
    //       'vendorOpenBills', 'fields'
    //     ],
    //     fn: createDialog({ ...this.props, dialogClassName:`${styles['modal']} expense-form`, }),
    //   }
    // });
  }

  _loadVendorOpenBills = (props = this.props) => {
    const self = this;
    const {
      // selectedBills = [],
      store,
      vendorOpenBills = { edges: [], },
      expense,
      formKey,
      fields: { payee, },
      // styles,
    } = props;
    const payeeValue = getFieldValue(payee);

    const openBills = payeeValue && vendorOpenBills.edges.length ? function(){
      const { type, objectId, } = payeeValue;
      switch (type) {
        case 'Vendor':

        // if(expense && expense.payee.objectId === objectId) {
        //   return false;
        // }

        return true;

        default: return false;
      }
    }() : false;

    if(this.state.openBills !== openBills){
      this.setState({
        openBills,
        _openBills: openBills && this.state._openBills !== DrawerState.Closed ? DrawerState.Opened : this.state._openBills,
      });
    }
  };

  componentWillReceiveProps(nextProps){
    if(this.state._openBills !== DrawerState.Closed){
      this._loadVendorOpenBills(nextProps);
      // const self = this;
      // const {
      //   // selectedBills = [],
      //   store,
      //   vendorOpenBills = { edges: [], },
      //   expense,
      //   formKey,
      //   fields: { payee, },
      //   // styles,
      // } = nextProps;
      // const payeeValue = getFieldValue(payee);
      //
      // const openBills = payeeValue && vendorOpenBills.edges.length ? function(){
      //   const { type, objectId, } = payeeValue;
      //   switch (type) {
      //     case 'Vendor':
      //
      //     // if(expense && expense.payee.objectId === objectId) {
      //     //   return false;
      //     // }
      //
      //     return true;
      //
      //     default: return false;
      //   }
      // }() : false;
      //
      // if(this.state.openBills !== openBills){
      //   this.setState({
      //     openBills,
      //   });
      // }
    }

    // this.cache.componentWillReceiveProps({ ...nextProps, dialogClassName:`${styles['modal']} expense-form`, });
  }

  componentDidMount() {
    events.on(window, 'resize', this._handleWindowResize);
    // this._showHelp();

    this.refs.client && this.refs.client.focus();

    ga('send', 'pageview', '/modal/app/expense');
  }

  _showHelp(){
    if(process.env.NODE_ENV === 'production' && localStorage.getItem('expense-form.help.done', false)){
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

          <a onClick={e => {localStorage.setItem('expense-form.help.done', true); remove();}} className='btn btn-primary' style={{textTransform: 'uppercase'}}>{intl.formatMessage(messages['got_it'])}</a>
        </div>
      )
    };

    setTimeout(() => {

      NotifyActions.add({
        type: 'custom',
        data: Component,
        duration: 3 * 60000,
        slug: styles['expense-form--error-message'],
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
    this.props.onCancel();
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
        .then(this.props.onCancel)
        .catch(() => {});
    }else{
      this.props.onCancel();
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

        if(line.dirty){
          const {field, valid} = store.isValid(line);

          if(valid){
            items.push(decorateItem(i, line));
            continue;
          }else{
            store.setShowErrors(true);
            store.setActiveRow({rowIndex: i, cell: field});
            return Promise.reject();
          }
        }

        if(line.objectId || line.id || line.__dataID__){
          items.push(decorateItem(i, line));
        }
      }

      if(items.length === 0){
        const {intl,} = this.context;
        NotifyActions.add({
          type: 'danger',
          slug: styles['expense-form--error-message'],
          data: () => (
                <span>
                  {intl.formatMessage(messages['at_least_one_entry_required'])}
                </span>
          ),
        });

        return Promise.reject();
      }

      return new Promise((resolve, reject) => {
        LoadingActions.show();
        this.props.save({ ...decorateData(data), id: this.props.expense ? this.props.expense.objectId : getFieldValue(this.props.fields.id), expense: this.props.expense, _vendor: this.props.payee && (this.props.payee.type === 'Vendor' || this.props.payee.type === 2) ? this.props.payee : undefined, items, company: this.props.company, viewer: this.props.viewer, })
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

        if(line.dirty){
          const {field, valid} = store.isValid(line);

          if(valid){
            items.push(decorateItem(i, line));
            continue;
          }else{
            store.setShowErrors(true);
            store.setActiveRow({rowIndex: i, cell: field});
            return Promise.reject();
          }
        }

        if(line.objectId || line.id || line.__dataID__){
          items.push(decorateItem(i, line));
        }
      }

      if(items.length === 0){
        const {intl,} = this.context;
        NotifyActions.add({
          type: 'danger',
          slug: styles['expense-form--error-message'],
          data: () => (
                <span>
                  {intl.formatMessage(messages['at_least_one_entry_required'])}
                </span>
          ),
        });

        return Promise.reject();
      }

      return new Promise((resolve, reject) => {
        LoadingActions.show();
        this.props.save({ ...decorateData(data), id: this.props.expense ? this.props.expense.objectId : getFieldValue(this.props.fields.id), expense: this.props.expense, _vendor: this.props.payee && (this.props.payee.type === 'Vendor' || this.props.payee.type === 2) ? this.props.payee : undefined, items, company: this.props.company, viewer: this.props.viewer, })
              .then(result => {
                LoadingActions.hide();

                if (result && typeof result.error === 'object') {
                  return resolve(); // reject(messages['error']);
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

        if(line.dirty){
          const {field, valid} = store.isValid(line);

          if(valid){
            items.push(decorateItem(i, line));
            continue;
          }else{
            store.setShowErrors(true);
            store.setActiveRow({rowIndex: i, cell: field});
            return Promise.reject();
          }
        }

        if(line.objectId || line.id || line.__dataID__){
          items.push(decorateItem(i, line));
        }
      }

      if(items.length === 0){
        const {intl,} = this.context;
        NotifyActions.add({
          type: 'danger',
          slug: styles['expense-form--error-message'],
          data: () => (
                <span>
                  {intl.formatMessage(messages['at_least_one_entry_required'])}
                </span>
          ),
        });

        return Promise.reject();
      }

      return new Promise((resolve, reject) => {
        LoadingActions.show();
        this.props.save({ ...decorateData(data), id: this.props.expense ? this.props.expense.objectId : getFieldValue(this.props.fields.id), expense: this.props.expense, _vendor: this.props.payee && (this.props.payee.type === 'Vendor' || this.props.payee.type === 2) ? this.props.payee : undefined, items, company: this.props.company, viewer: this.props.viewer, })
              .then(result => {
                LoadingActions.hide();

                if (result && typeof result.error === 'object') {
                  return resolve(); // reject(messages['error']);
                }

                const {
                  company,
                  initializeForm,
                  fields: {
                    id,
                  }
                } = this.props;

                const expense = result.result;

                function p__decorateItem(index, { id, objectId, accountCode, description, amount, VATPart,}){
                  return {
                    id, objectId,
                    index,
                    accountCode,
                    description,
                    amount,
                    VATPart: VATPart ? {
                      inputType: VATInputType_ID_BY_NAME[VATPart.inputType],
                      ...(VATPart.value !== undefined && VATPart.value !== null ? {value: VATPart.value,} : {}),
                    } : undefined,
                  };
                }

                store.reInit(
                  expense.itemsConnection.edges.map(({node}) => p__decorateItem(node.index, {...node,})), { id: expense.objectId, company, });

                const payee = expense.payee ? {
                  type: expense.payee.type,
                  className: `People_${this.props.company.objectId}`,
                  id: expense.payee.objectId,
                  objectId: expense.payee.objectId,
                } : undefined;

                initializeForm({
                  ...expense,
                  id: expense.objectId,
                  date: normalizeMoment(moment(expense.date)).format(),
                  inputType: VATInputType_ID_BY_NAME[expense.inputType],
                  payee,
                });

               resolve();
             });
      });
    });
  }

  _onReceivePayments = (bills) => {
    this.props.onReceivePayments(bills);
  };

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

    const {
      formKey,
      dirty,
      editStart,
      editStop,
      fields: {
        id,
        date,
        payee,
        creditToAccountCode,
        paymentMethod,
        paymentRef,

        inputType,

        memo,
        files,
      },
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

      onCancel,

      styles,

      setActiveRow,
      addMoreRows,
      clearAllRows,
      clearRow,
      moveOp,
      resetLines,

      refresh,

      expense,
      company,

      vendorOpenBills,

    } = this.props;

    const { openBills = false, _openBills, } = this.state;

    // const { Dialog, } = this.cache;

    // console.log('=====================================');
    //
    // console.log('Valid', valid);
    // console.log('Invalid', invalid);
    // console.log('initialValues', [payee, date, memo, files].map(({initialValue}) => initialValue));
    // console.log('Values', values);
    // console.log('Values 2', [payee, date, memo, files].map(({value}) => value));
    // console.log('Invalids', [payee, date, memo, files].filter(({invalid}) => invalid));
    //
    // console.log('=====================================');

    const {intl,} = this.context;

    const bodyWidth = getBodyWidth();

    const minHeight = getMinHeight();

    const VATEnabled = this.props.company.VATSettings.enabled;

    const _dirty = dirty || store.isDirty;

    const isSaved = expense || typeof getFieldValue(id) !== 'undefined';

    return (
      <Modal dialogClassName={classnames(`${styles['modal']} expense-form`, { drawerOpen: openBills && _openBills !== DrawerState.Closed, })}
             dialogComponentClass={Dialog}
             className={classnames({'expense-form form modal-fullscreen': true, [styles['expense-form'] || '']: true, })}
             show={true} keyboard={true} backdrop={false} onHide={() => this._handleCancel()} autoFocus enforceFocus>

        <Header style={{ backgroundColor:'#486c8f', height: 45, padding: '7px 16px', }}>

          <div styleName='tableCell'>

            <div styleName='f-title'
                 style={{display: 'inline-block', }}>{intl.formatMessage(messages['Title'])}
            </div>

            <div styleName='icon'>
              <i style={{verticalAlign: 'middle'}} className='material-icons md-light'>settings</i>
            </div>

          </div>

        </Header>

        <Body>

          <div styleName='table stretch' style={{ overflow: 'hidden', }}>

            <div styleName='' style={{ display: 'table-cell', overflow: 'auto', }}>

              <div>

                <div className='the-container table' style={{}}>

                  <div style={{}}>

                    <div styleName='expenseTop ' style={getTopStyle(this.props.expense)}>

                      <div styleName='innerRow' style={{position: 'relative',}}>

                        <div styleName='payeeDetailsBox'>
                          <PayeeDetails
                            ref={'client'}
                            company={this.props.company}
                            onPaymentVendorSelected={this._onPaymentVendorSelected}
                            viewer={this.props.viewer}
                            formKey={formKey}
                            fields={{payee, dirty, valid, invalid, pristine, submitting, values,}}
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

                        <div styleName='balanceDueBox' style={{position: 'absolute', right: openBills && _openBills !== DrawerState.Closed ? 32 : 0, textAlign: 'right',}}>
                          <BalanceDue
                            store={store}
                            company={this.props.company}
                            expense={this.props.expense}
                            formKey={formKey}
                            fields={{ id, inputType, dirty, valid, invalid, pristine, submitting, values,}}
                          />
                        </div>

                      </div>

                    </div>

                    {saveError && <Alert title={intl.formatMessage(messages['ErrorTitle'])} type={'error'}>{intl.formatMessage({ ...saveError, id: saveError._id, })}</Alert>}

                    {function () {
                      return VATEnabled ? null : <div style={{ padding: '15px 25px 30px 30px', }}>
                        <NoVATWarning company={company}/>
                      </div>;
                    }()}

                    {isSaved ? null : function () {
                      return dateIsCurrentDeclaration(company, getFieldValue(date)) ? null : <div style={{ padding: '15px 25px 30px 30px', }}>
                        <VATPeriodWarning/>
                      </div>;
                    }()}

                    <div styleName='paymentDetailsRow'>

                      <div styleName='innerRow'>

                        <PaymentDetails
                          company={this.props.company}
                          formKey={formKey}
                          fields={{ date, paymentMethod, paymentRef, dirty, valid, invalid, pristine, submitting, values,}}
                        />

                      </div>

                    </div>

                    {function () {
                      return VATEnabled && <div style={{ padding: '15px 30px 0 30px', }}>
                          <VATInputType
                            fields={{ id, dirty, valid, invalid, inputType, pristine, submitting, values,}}
                            formKey={formKey}
                            store={store}/>
                        </div>;
                    }()}

                    <div styleName='itemsContainerRow '>

                      <div styleName='innerRow'>

                        <div styleName='items'>

                          <AccountItems
                            expensesAccounts={this.props.expensesAccounts}
                            refresh={refresh}
                            company={this.props.company}
                            expense={this.props.expense}
                            viewer={this.props.viewer}
                            formKey={formKey}
                            store={store}
                            fields={{ id, inputType, dirty, valid, invalid, setActiveRow, resetLines, addMoreRows, clearAllRows, clearRow, moveOp, pristine, submitting, values,}}
                            height={minHeight}
                            bodyWidth={openBills ? bodyWidth - 226 : bodyWidth}
                            openBills={openBills}
                          />

                        </div>

                      </div>

                    </div>

                    <div>

                      <div styleName='innerRow'>

                        <div className='row' style={{}}>

                          <div className='col-sm-6 first-col'>

                            <div styleName='memoRow'>

                              <div styleName='innerRow'>

                                <Memo
                                  formKey={formKey}
                                  fields={{memo, dirty, valid, invalid, pristine, submitting, values,}}
                                />

                              </div>

                            </div>

                          </div>


                          <div className='col-sm-6 last-col'>

                            {/*<div styleName='taxableSubtotalLineRow'>

                              <div styleName='innerRow'>

                                <TaxableSubtotalLine
                                  formKey={formKey}
                                  store={store}
                                  fields={{dirty, valid, invalid, pristine, submitting, values,}}
                                />

                              </div>

                            </div>*/}

                            {/*<div styleName='discountFormRow'>

                              <div styleName='innerRow'>

                                <DiscountForm
                                  formKey={formKey}
                                  store={store}
                                  fields={{dirty, valid, invalid, pristine, submitting, values,}}
                                />

                              </div>

                            </div>*/}

                            {/*<div styleName='taxFormRow'>

                              <div styleName='innerRow'>

                                <TaxForm
                                  formKey={formKey}
                                  store={store}
                                  fields={{dirty, valid, invalid, pristine, submitting, values,}}
                                />

                              </div>

                            </div>*/}

                            <div styleName='totalRow'>

                              <div styleName='innerRow'>

                                <TotalLine
                                  formKey={formKey}
                                  store={store}
                                  expense={this.props.expense}
                                  company={this.props.company}
                                  fields={{id, inputType, dirty, valid, invalid, pristine, submitting, values,}}
                                />

                              </div>

                            </div>

                        </div>


                      </div>


                    </div>

                    <div>

                      <div styleName='innerRow'>

                        <div className='row' style={{}}>

                          <div className='col-sm-12 first-col last-col'>

                            <div styleName='filesRow'>

                              <hr styleName="sectionDivider"/>

                              <div styleName='innerRow' style={{width: '40%', minWidth: 492,}}>

                                <Files
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

              </div>

              {_openBills !== DrawerState.Indeterminate && openBills && <DrawerPullTab onToggle={this._onToggleDrawerPullTab} opened={_openBills === DrawerState.Opened}/>}

            </div>

            {openBills && <div styleName={classnames({ closeBills: _openBills === DrawerState.Closed, openBills: _openBills !== DrawerState.Closed, })} style={{ display: 'table-cell', overflow: 'auto', }}>

              <div>

                {_openBills !== DrawerState.Closed && <PendingBills
                  bodyHeight={minHeight + 50 + 45}
                  vendorOpenBills={vendorOpenBills}
                  onAdd={(bills) => { this.props.onReceivePayments(bills) }}
                  onOpen={(bill) => { this.props.onBill(bill); }}
                />}

              </div>

            </div>}

          </div>

        </Body>

        <Footer>

          <div styleName='tableCell' style={{textAlign: 'left'}}>

            <button
              styleName='btn dark'
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
              {isSaved && <ExpenseActions onDelete={this._del} onShowJournalEntries={this._showJournal} className={'unselectable'} styles={styles}/>}
            </div>

          </div>

          <div styleName='tableCell' style={{textAlign: 'right'}}>

            {/*<button
              styleName='btn primary'
              onClick={this._onSave()}
              disabled={invalid || submitting || !_dirty}
              className={'unselectable' + (valid && _dirty ? ' green valid' : (invalid || submitting || !_dirty ? ' disabled' : ''))}>
              {' '}{intl.formatMessage(messages['save'])}
            </button>*/}

            {/*<button
              styleName='btn primary'
              style={{marginLeft: 12}}
              onClick={this._onSave()}
              disabled={invalid || submitting}
              className={'unselectable' + (valid ? ' green valid' : (invalid || submitting ? ' disabled' : ''))}>
              {' '}{intl.formatMessage(messages['saveAndNew'])}
            </button>*/}

            {function(){
              const _dirty = dirty || store.isDirty;
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

  _onToggleDrawerPullTab = (e) => {
    stopEvent(e);

    const _openBills = this.state._openBills === DrawerState.Opened || this.state._openBills === DrawerState.Indeterminate
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
          this.props.del({ expense: this.props.expense || getObj(), company: this.props.company, viewer: this.props.viewer, })
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
      const obj = this.props.expense || function () {
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
          type={'Expense'}
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

function unNormalizeMoment(d){
  const n = moment();
  return moment(d)
    .hour(n.hour())
    .minutes(n.minute())
    .seconds(n.seconds());
}

const discountTypeValueByIndex = {
  2: 'Percent',
  1: 'Value',
};

const VATInputType_NAME_BY_ID = {
  1: 'HT',
  2: 'TTC',
  3: 'NO_VAT',
};

const VATInputType_ID_BY_NAME = {
  HT: 1,
  TTC: 2,
  NO_VAT: 3,
};

function decorateData({
  date, payee, paymentMethod, paymentRef, creditToAccountCode, inputType, memo, files, }){
  return {
    paymentMethod,
    creditToAccountCode,
    paymentRef,
    payee: {
      type: payee.type,
      className: payee.className,
      id: payee.objectId,
    },
    date: unNormalizeMoment(moment(date)).format(),
    inputType: VATInputType_NAME_BY_ID[inputType],
    memo,
    files,
  };
}

function decorateItem(index, {accountCode, description, amount, VATPart,}){
  return {
    index,
    accountCode,
    description,
    amount,
    VATPart: VATPart ? {
      inputType: VATInputType_NAME_BY_ID[VATPart.inputType],
      ...(VATPart.value !== undefined && VATPart.value !== null ? {value: VATPart.value,} : {}),
    } : undefined,
  };
}

function getTopStyle(expense){
  return {
    height: 100,
    minHeight: 100,
  };
}

class MySplitButton extends React.Component{
  static contextTypes = {
    intl: intlShape.isRequired,
  };
  shouldComponentUpdate(nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState);
  }
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

          <SplitButton className={className} disabled={disabled} onClick={onSaveClose()} title={title} dropup pullRight id={'expense-form'}>

            <MenuItem onClick={onSaveClose(false)} eventKey={'1'}>
              {intl.formatMessage(messages['saveAndNew'])}
            </MenuItem>

          </SplitButton>

        </ButtonToolbar>
      </div>
    );
  }
}

class ExpenseActions extends React.Component{
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
