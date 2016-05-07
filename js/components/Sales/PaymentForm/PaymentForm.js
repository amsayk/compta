import React, {Component, PropTypes} from 'react';
import Relay from 'react-relay';

import {bindActionCreators} from 'redux';
import {reduxForm} from 'redux-form';

// import uid from '../../../utils/uid';

import Title from '../../Title/Title';

import uniq from 'lodash.uniqby';
import concat from 'lodash.concat';
import orderBy from 'lodash.orderby';

import stopEvent from '../../../utils/stopEvent';

import getFieldValue from '../../utils/getFieldValue';

import ButtonToolbar from 'react-bootstrap/lib/ButtonToolbar';
import SplitButton from 'react-bootstrap/lib/SplitButton';
import Button from 'react-bootstrap/lib/Button';
import DropdownButton from 'react-bootstrap/lib/DropdownButton';
import MenuItem from 'react-bootstrap/lib/MenuItem';

import paymentValidation, {} from './paymentValidation';
import * as paymentActions from '../../../redux/modules/paymentsOfInvoices';

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

import CustomerDetails from './CustomerDetails';
import BillingDetails from './BillingDetails';
import PaymentDetails from './PaymentDetails';
import AmountReceived from './AmountReceived';
import InvoiceItems from './InvoiceItems';
import TotalLine from './TotalLine';
import Memo from './Memo';
import Files from './Files';

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

@reduxForm({
  form: 'paymentOfInvoices',
  fields: [
    'id',
    'customer',
    'date',
    'paymentMethod',
    'paymentRef',
    'amountReceived',
    'depositToAccountCode',
    'memo',
    'files',
  ],
  validate: paymentValidation,
}, (state, ownProps) => ({
  customer: ownProps.customer,
  company: ownProps.company,
  editing: state.paymentsOfInvoices.editing,
  saveError: state.paymentsOfInvoices.saveError,
  initialValues: ownProps.payment ? {
    ...ownProps.payment,
    date: normalizeMoment(moment(ownProps.payment.date)).format(),
  } : {
    paymentMethod: ownProps.company.paymentsSettings.preferredPaymentMethod,
    date: normalizeMoment(moment()).format(),
    depositToAccountCode: ownProps.company.paymentsSettings.defaultDepositToAccountCode,
    customer: ownProps.invoice ? {
      className: `Customer_${ownProps.company.objectId}`,
      id: ownProps.invoice.customer.objectId,
      objectId: ownProps.invoice.customer.objectId,
    } : (ownProps.customer ? {
      className: `Customer_${ownProps.company.objectId}`,
      id: ownProps.customer.objectId,
      objectId: ownProps.customer.objectId,
    } : undefined),
    amountReceived: ownProps.invoice ? ownProps.invoice.balanceDue : undefined,
  },
}), dispatch => bindActionCreators(paymentActions, dispatch))
@CSSModules(styles, {allowMultiple: true})
export default class extends Component {

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
  };

  constructor(props, context){
    super(props, context);

    const {
      formKey,
      editing: {
        [formKey]: store,
      },
      customerOpenInvoices,
    } = this.props;

    switch (formKey) {
      case 'NEW':

          const {
            invoice,
          } = this.props;
          store.changeInvoices(
            customerOpenInvoices.edges.map(
              ({node}) => decorateInvoiceItem(store, node, invoice)),
            {id: formKey, company: this.props.company}
          );

        break;

      default:

        const {
          payment,
        } = this.props;
        store.changeInvoices(
          orderBy(

            uniq(
              concat(
                customerOpenInvoices.edges.map(
                  ({node}) => decorateInvoiceItem(store, node, invoice)),

                payment.itemsConnection.edges.map(
                  ({node}) => decoratePaymentItem(store, node))
              ),

              obj => obj.invoice.id
            ),

            [ ({invoice}) => invoice.balanceDue, ({invoice}) => Date.parse(invoice.date) ],

            [ 'asc', 'desc' ]
          ),
          {id: formKey, company: this.props.company}
        );
    }

  }

  componentWillReceiveProps(nextProps){
    // const {
    //   formKey,
    //   editing: {
    //     [formKey]: store,
    //   }, customerOpenInvoices,
    // } = nextProps;
    // store.changeInvoices(
    //   customerOpenInvoices.edges.map(
    //     ({node}) => decorateInvoiceItem(store, node)),
    //   {id: formKey, company: nextProps.company}
    // );

    const {
      formKey,
      editing: {
        [formKey]: store,
      },
      customerOpenInvoices,
    } = nextProps;

    switch (formKey) {
      case 'NEW':

          const {
            invoice,
          } = nextProps;
          store.changeInvoices(
            customerOpenInvoices.edges.map(
              ({node}) => decorateInvoiceItem(store, node, invoice)),
            {id: formKey, company: nextProps.company}
          );

        break;

      default:

        const {
          payment,
        } = nextProps;
        store.changeInvoices(
          orderBy(

            uniq(
              concat(
                customerOpenInvoices.edges.map(
                  ({node}) => decorateInvoiceItem(store, node, invoice)),

                payment.itemsConnection.edges.map(
                  ({node}) => decoratePaymentItem(store, node))
              ),

              obj => obj.invoice.id
            ),

            [ ({invoice}) => invoice.balanceDue, ({invoice}) => Date.parse(invoice.date) ],

            [ 'asc', 'desc' ],
          ),
          {id: formKey, company: nextProps.company}
        );
    }
  }

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
  //   const { formKey, changeInvoices, } = this.props;
  //
  //   changeInvoices(formKey, [{
  //     id: uid.type('Invoice-O'),
  //     item: 'Invoice 1',
  //     date: moment(),
  //     dueDate: moment().add(12, 'days'),
  //   }, {
  //     id: uid.type('Invoice-O'),
  //     item: 'Invoice 2',
  //     date: moment().add(-10, 'days'),
  //     dueDate: moment().add(2, 'days'),
  //   }, {
  //     id: uid.type('Invoice-O'),
  //     item: 'Invoice 3',
  //     date: moment().add(-30, 'days'),
  //     dueDate: moment().add(-5, 'days'),
  //   },]);
  // }

  componentDidMount() {
    events.on(window, 'resize', this._handleWindowResize);
    // this._showHelp();

    this.refs.client && this.refs.client.focus();
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

      setImmediate(() => {
        this.props.onPaymentCustomerSelected(
          {id: undefined}, ({ done, }) => {
            if(done){
              this.props.onCancel();
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
          .catch(() => {});
      }else{
        this._handleClose();
      }
    };

    _onSave(){
      return this.__onSubmit || (this.__onSubmit = this.props.handleSubmit((data) => {

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

          if(typeof line.amount !== 'undefined' && line.amount !== null){
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
          this.props.save({ ...decorateData(data), id: this.props.payment && this.props.payment.objectId, payment: this.props.payment, _customer: this.props.customer, items, company: this.props.company, viewer: this.props.viewer, })
                .then(result => {
                  if (result && typeof result.error === 'object') {
                    return reject(); // messages['error']
                  }

                  // if(close){
                  //   this._handleClose();
                  // }else{
                  //   this._handleSaveAndNew();
                  // }
                 resolve();
               })/*.catch((error) => {
                  if(process.env.NODE_ENV !== 'production') { console.error(error); }
                  reject(messages['error']);
                })*/;
        });
      }));
    }
    _onSaveClose(close = true){
      return this.__onSubmitClose || (this.__onSubmitClose = this.props.handleSubmit((data) => {

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

          if(typeof line.amount !== 'undefined' && line.amount !== null){
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
          this.props.save({ ...decorateData(data), id: this.props.payment && this.props.payment.objectId, payment: this.props.payment, _customer: this.props.customer, items, company: this.props.company, viewer: this.props.viewer, })
                .then(result => {
                  if (result && typeof result.error === 'object') {
                    return reject(); // messages['error']
                  }

                  if(close){
                    this._handleClose();
                  }else{
                    this._handleSaveAndNew();
                  }
                 resolve();
               })/*.catch((error) => {
                  if(process.env.NODE_ENV !== 'production') { console.error(error); }
                  reject(messages['error']);
                })*/;
        });
      }));
    }

  render() {
    const self = this;

    const {
      formKey,
      dirty,
      editStop,
      fields: {
        id,
        customer,
        date,
        paymentMethod,
        paymentRef,
        depositToAccountCode,
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

    } = this.props;

    const {intl,} = this.context;

    const bodyWidth = getBodyWidth();

    const minHeight = getMinHeight();

    const amountReceivedValue = getFieldValue(amountReceived);

    // console.log('=====================================');
    //
    // console.log('Valid', valid);
    // console.log('Invalid', invalid);
    // console.log('initialValues', [customer, date, paymentMethod, paymentRef, depositToAccountCode, amountReceived, memo, files].map(({initialValue}) => initialValue));
    // console.log('Values', values);
    // console.log('Values 2', [customer, date, paymentMethod, paymentRef, depositToAccountCode, amountReceived, memo, files].map(({value}) => value));
    // console.log('Invalids', [customer, date, paymentMethod, paymentRef, depositToAccountCode, amountReceived, memo, files].filter(({invalid}) => invalid));
    // console.log('dirty', [customer, date, paymentMethod, paymentRef, depositToAccountCode, amountReceived, memo, files].filter(({dirty}) => dirty));
    //
    // console.log('=====================================');

    return (
      <Modal dialogClassName={`${this.props.styles['modal']} payment-form`}
             dialogComponentClass={Dialog}
             className={classnames({'payment-form form modal-fullscreen': true, [styles['payment-form'] || '']: true, })}
             show={true} keyboard={true} backdrop={false} onHide={() => this._handleCancel()} autoFocus enforceFocus>

        <Header>

          <div styleName='tableCell'>

            <div styleName='f-title'
              style={{display: 'inline-block', }}>{intl.formatMessage(messages['Title'])}
            </div>

            <div styleName='icon'>
              <i style={{verticalAlign: 'middle'}} className='material-icons md-light' style={{}}>settings</i>
            </div>

          </div>

        </Header>

        <Body>

        <div styleName='table stretch'>

          <div styleName='tableCell'>

            <div>

              <div className='the-container table' style={{}}>

                <div style={{}}>

                  <div styleName='paymentTop'>

                    <div styleName='innerRow'>

                      <div styleName='customerDetailsBox'>

                        <CustomerDetails
                          ref={'client'}
                          onPaymentCustomerSelected={this.props.onPaymentCustomerSelected}
                          formKey={formKey}
                          company={this.props.company}
                          viewer={this.props.viewer}
                          payment={this.props.payment}
                          fields={{customer, dirty, valid, invalid, pristine, save, submitting, values,}}
                        />

                      </div>

                      <div styleName='balanceDueBox'>

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
                        fields={{date, dirty, valid, invalid, pristine, save, submitting, values,}}
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
                        depositsAccounts={this.props.depositsAccounts}
                        fields={{paymentMethod, paymentRef, depositToAccountCode, amountReceived, dirty, valid, invalid, pristine, save, submitting, values,}}
                      />

                    </div>

                  </div>

                  <div styleName='itemsContainerRow'>

                    <div styleName='innerRow'>


                      <div styleName='items'>

                        {store.isEmpty ? null : <InvoiceItems
                          // refresh={refresh}
                          company={this.props.company}
                          payment={payment}
                          viewer={this.props.viewer}
                          formKey={formKey}
                          store={store}
                          fields={{ refresh, amountReceived, dirty, valid, invalid, pristine, submitting, values,}}
                          height={minHeight}
                          bodyWidth={bodyWidth}
                          onInvoice={this.props.onInvoice}
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


          </div>

        </div>

        </Body>

        <Footer>

          <div styleName='tableCell' style={{textAlign: 'left'}}>

            <button
              styleName='btn  dark'
              onClick={() => this._handleCancel()}
              disabled={submitting}
              className='unselectable'>{intl.formatMessage(messages['cancel'])}
            </button>

          </div>

          <div styleName='tableCell' style={{textAlign: 'center'}}>

            <div>
              {payment && <PaymentActions onDelete={this._del()} onShowJournalEntries={this._showJournal} className={'unselectable'} styles={styles}/>}
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
              const _dirty = dirty || store.isDirty;
              return (
                <MySplitButton
                  className={'unselectable' + (valid && _dirty ? ' green valid' : (invalid || submitting || !_dirty ? ' disabled' : ''))}
                  styleName={'btn primary'}
                  styles={styles}
                  valid={valid}
                  onSave={self._onSave.bind(self)}
                  onSaveClose={self._onSaveClose.bind(self)}
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

  _del = () => {
    const {intl,} = this.context;
    return this.props.handleSubmit(() => {
      return Actions.show(intl.formatMessage(messages['ConfirmDelete']))
        .then(() => {
          return new Promise((resolve, reject) => {
            this.props.del({ payment: this.props.payment, company: this.props.company, viewer: this.props.viewer, })
                  .then(result => {
                    if (result && typeof result.error === 'object') {
                      return reject(); // messages['error']
                    }

                    this._handleClose();
                   resolve();
                 })/*.catch((error) => {
                    if(process.env.NODE_ENV !== 'production') { console.error(error); }
                    reject(messages['error']);
                  })*/;
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
      return (
        <JournalEntries
          type={'PaymentOfInvoices'}
          company={this.props.company}
          viewer={this.props.viewer}
          person={this.props.payment.customer}
          id={this.props.payment.objectId}
          onCancel={this._close}
        />
      );
    }
  }

}

class MySplitButton extends Component{
  static contextTypes = {
    intl: intlShape.isRequired,
  };
  _onClick = (close, e) => {
    stopEvent(e);
    const {onSaveClose, } = this.props;
    const fn = onSaveClose(close);
    fn(e);
  };
  render(){
    const {intl} = this.context;
    const {onSave, onSaveClose, className, disabled, submitting, valid, styles, } = this.props;
    const title = (
      <span>{submitting ? <i className={`${styles['submitting']} material-icons`}>loop</i> : null}{' '}{intl.formatMessage(messages['saveAndClose'])}</span>
    );
    return (
      <div className={styles['dropdown']}>
        <ButtonToolbar>

          <SplitButton className={className} disabled={disabled} onClick={this._onClick.bind(this, true)} title={title} dropup pullRight id={'payment-form'}>

            <MenuItem onClick={this._onClick.bind(this, false)} eventKey={'1'}>
              {intl.formatMessage(messages['saveAndNew'])}
            </MenuItem>

          </SplitButton>

          <button
            // styleName='btn primary'
            onClick={onSave()}
            style={{marginLeft: 12,}}
            disabled={disabled}
            className={`hidden ${disabled ? 'disabled' : ''} ${styles['btn']} ${styles['dark']}`}>
            {' '}{intl.formatMessage(messages['save'])}
          </button>

        </ButtonToolbar>
      </div>
    );
  }
}

class PaymentActions extends Component{
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

function decoratePaymentItemForServer(rowIndex, { amount, invoice, }){
  return {
    index: rowIndex,
    amount: amount,
    invoiceId: invoice.objectId,
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
  customer, date, paymentMethod, paymentRef, depositToAccountCode, amountReceived, memo, files, }){
  return {
    customer: {
      className: customer.className,
      id: customer.objectId,
    },
    date: unNormalizeMoment(moment(date)).format(),
    paymentMethod,
    paymentRef,
    depositToAccountCode,
    amountReceived,
    memo,
    files,
  };
}

function decorateInvoiceItem(store, __original, { objectId : selectedInvoiceId, balanceDue: selectedInvoiceIdBalanceDue, } = {}){
 const { id, objectId, date, dueDate, memo, refNo, itemsConnection, paymentsConnection, } = __original;
  const balanceDue = itemsConnection.totalAmount - paymentsConnection.totalAmountReceived;
  const obj = {
    __existed: false,
    __originalAmount: undefined,
    id,
    invoice: {
      id,
      objectId,
      refNo,
      total: itemsConnection.totalAmount,
      balanceDue,
      amountReceived: paymentsConnection.totalAmountReceived,
      date,
      dueDate,
      memo,
      __original,
    },
  }

  if(store.hasKey(id)){
    obj.__selected = store.isKeySelected(id);
    obj.amount = store.getAmount(id);
  }else if(typeof selectedInvoiceId !== 'undefined'){
    obj.__selected = selectedInvoiceId === objectId;
    if(obj.__selected){
      obj.amount = selectedInvoiceIdBalanceDue;
    }else{
      obj.amount = undefined;
    }
  }

  return obj;
}

function decoratePaymentItem(store, { id, amount, invoice : __original, }){
  const { id: invoiceId, objectId, date, dueDate, memo, refNo, itemsConnection, paymentsConnection, } = __original;
  const balanceDue = itemsConnection.totalAmount - paymentsConnection.totalAmountReceived;
  const hasKey = store.hasKey(id);
  const obj = {
    __existed: true,
    __originalAmount: amount,
    id,
    amount: hasKey ? store.getAmount(id) : amount,
    invoice: {
      id: invoiceId,
      objectId,
      refNo,
      total: itemsConnection.totalAmount,
      balanceDue,
      amountReceived: paymentsConnection.totalAmountReceived,
      date,
      dueDate,
      memo,
      __original,
    },
  }

  if(hasKey){
    obj.__selected = store.isKeySelected(id);
  }

  return obj;
}
