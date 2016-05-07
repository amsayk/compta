import React, {Component, PropTypes} from 'react';
import Relay from 'react-relay';

import {bindActionCreators} from 'redux';
import {reduxForm} from 'redux-form';

import Title from '../../Title/Title';

import stopEvent from '../../../utils/stopEvent';

import saleValidation, {} from './saleValidation';
import * as saleActions from '../../../redux/modules/sales';

import JournalEntries from '../../JournalEntries/JournalEntries';

import { setBeforeUnloadMessage, unsetBeforeUnloadMessage, } from '../../../utils/unbeforeunload';

import Actions from '../../confirm/actions';
import NotifyActions from '../../notification/NotifyActions';

import ButtonToolbar from 'react-bootstrap/lib/ButtonToolbar';
import SplitButton from 'react-bootstrap/lib/SplitButton';
import DropdownButton from 'react-bootstrap/lib/DropdownButton';
import MenuItem from 'react-bootstrap/lib/MenuItem';

import Alert from '../../Alert/Alert';

import requiredPropType from 'react-prop-types/lib/all';

import classnames from 'classnames';

import styles from './SaleForm.scss';

import CSSModules from 'react-css-modules';

import Modal from 'react-bootstrap/lib/Modal';

import Dialog, {Header, Body, Footer} from '../../utils/Dialog';

import throttle from 'lodash.throttle';

import moment from 'moment';

function normalizeMoment(d){
  return moment(d)
    .seconds(0)
    .minutes(0)
    .hour(0);
}

import events from 'dom-helpers/events';

import CustomerDetails from './CustomerDetails';
import AmountDue from './AmountDue';
import PaymentDetails from './PaymentDetails';
import BillingDetails from './BillingDetails';
import ProductItems from './ProductItems';
import TotalLine from './TotalLine';
import DiscountForm from './DiscountForm';
// import TaxForm from './TaxForm';
import Memo from './Memo';
import Files from './Files';

import { getBodyWidth, getBodyHeight, } from '../../../utils/dimensions';

function getMinHeight() {
  return getBodyHeight() - 45 /* HEADER */ - 50 /* FOOTER */;
}

const discountTypesById = { 'Value': 1, 'Percent': 2, };

import {
  intlShape,
} from 'react-intl';

import messages from './messages';

import formatAddress from '../../../utils/formatAddress';

function getBillingAddress({
  displayName,
  billing_streetAddress,
  billing_cityTown,
  billing_stateProvince,
  billing_postalCode,
  billing_country,
}){
  const addr = formatAddress({
    address: billing_streetAddress,
    city: billing_cityTown,
    // subdivision: billing_stateProvince,
    postalCode: billing_postalCode,
    // country: billing_country,
  });

  return addr.length === 0 ? undefined : [displayName, ...addr].join('\n');
}

@reduxForm({
  form: 'sale',
  fields: [
    'id',
    'customer',
    'billingAddress',
    'date',
    'paymentMethod',
    'paymentRef',
    'memo',
    'discountType',
    'discountValue',
    'depositToAccountCode',
    'files',
  ],
  validate: saleValidation,
}, (state, ownProps) => ({
  company: ownProps.company,
  editing: state.sales.editing,
  saveError: state.sales.saveError,
  initialValues: ownProps.sale ? {
    ...ownProps.sale,
    date: normalizeMoment(moment(ownProps.sale.date)).format(),
    discountType: discountTypesById[ownProps.sale.discountType],
  } : function(){
    const customer = ownProps.customer ? {
      className: `Customer_${ownProps.company.objectId}`,
      id: ownProps.customer.objectId,
      objectId: ownProps.customer.objectId,
    } : undefined;
    return {
      paymentMethod: ownProps.company.paymentsSettings.preferredPaymentMethod,
      date: normalizeMoment(moment()).format(),
      discountType: 2,
      depositToAccountCode: ownProps.company.salesSettings.defaultDepositToAccountCode,
      customer,
      billingAddress: (customer ? getBillingAddress(customer) : undefined),
    };
  }(),
}), dispatch => bindActionCreators(saleActions, dispatch))
@CSSModules(styles, {allowMultiple: true})
export default class extends Component {

  static displayName = 'SaleForm';

  static contextTypes = {
    intl: intlShape.isRequired,
  };

  static propTypes = {
    sale: requiredPropType(
      React.PropTypes.object,
      function(props, propName, componentName) {
        if (props.formKey !== 'NEW' && !props.sale) {
          return new Error('SaleForm: sale required!');
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
  };

  componentDidMount() {
    events.on(window, 'resize', this._handleWindowResize);
    // this._showHelp();

    this.refs.client && this.refs.client.focus();
  }

  _showHelp(){
    if(process.env.NODE_ENV === 'production' && localStorage.getItem('sale-form.help.done', false)){
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

          <a onClick={e => {localStorage.setItem('sale-form.help.done', true); remove();}} className='btn btn-primary' style={{textTransform: 'uppercase'}}>{intl.formatMessage(messages['got_it'])}</a>
        </div>
      )
    };

    setTimeout(() => {

      NotifyActions.add({
        type: 'custom',
        data: Component,
        duration: 3 * 60000,
        slug: styles['sale-form--error-message'],
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
          slug: styles['sale-form--error-message'],
          data: () => (
                <span>
                  {intl.formatMessage(messages['at_least_one_entry_required'])}
                </span>
          ),
        });

        return Promise.reject();
      }

      return new Promise((resolve, reject) => {
        this.props.save({ ...decorateData(data), id: this.props.sale && this.props.sale.objectId, sale: this.props.sale, items, _customer: this.props.customer, company: this.props.company, viewer: this.props.viewer, })
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
          slug: styles['sale-form--error-message'],
          data: () => (
                <span>
                  {intl.formatMessage(messages['at_least_one_entry_required'])}
                </span>
          ),
        });

        return Promise.reject();
      }

      return new Promise((resolve, reject) => {
        this.props.save({ ...decorateData(data), id: this.props.sale && this.props.sale.objectId, sale: this.props.sale, _customer: this.props.customer, items, company: this.props.company, viewer: this.props.viewer, })
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
    });
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
        billingAddress,
        date,
        paymentMethod,
        paymentRef,
        depositToAccountCode,
        discountType,
        discountValue,
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

      onCancel,

      styles,

      setActiveRow,
      addMoreRows,
      clearAllRows,
      clearRow,
      moveOp,
      resetLines,

      refresh,

      sale,

    } = this.props;

    const {intl,} = this.context;

    // console.log('=====================================');
    //
    // console.log('Valid', valid);
    // console.log('Invalid', invalid);
    // console.log('initialValues', [customer, billingAddress, terms, date, dueDate, discountType, discountValue, memo, files].map(({initialValue}) => initialValue));
    // console.log('Values', values);
    // console.log('Values 2', [customer, billingAddress, terms, date, dueDate, discountType, discountValue, memo, files].map(({value}) => value));
    // console.log('Invalids', [customer, billingAddress, terms, date, dueDate, discountType, discountValue, memo, files].filter(({invalid}) => invalid));
    //
    // console.log('=====================================');

    const bodyWidth = getBodyWidth();

    const minHeight = getMinHeight();

    return (
      <Modal dialogClassName={`${this.props.styles['modal']} sale-form`}
             dialogComponentClass={Dialog}
             className={classnames({'sale-form form modal-fullscreen': true, [styles['sale-form'] || '']: true, })}
             show={true} keyboard={true} backdrop={false} onHide={() => this._handleCancel()} autoFocus enforceFocus>

        <Header style={{ backgroundColor:'#486c8f', height: 45, padding: '7px 16px', }}>

          <div styleName='tableCell'>

            <div styleName='f-title'
                 style={{display: 'inline-block', }}>{intl.formatMessage(messages['Title'])}{sale ? ` nº${sale.refNo}` : ''}
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

                  <div styleName='saleTop' style={getTopStyle(this.props.sale)}>

                    <div styleName='innerRow' style={{position: 'relative',}}>

                      <div styleName='customerDetailsBox'>

                        <CustomerDetails
                          ref={'client'}
                          company={this.props.company}
                          viewer={this.props.viewer}
                          formKey={formKey}
                          sale={sale}
                          fields={{customer, dirty, valid, invalid, pristine, save, submitting, values,}}
                        />

                      </div>

                      <div styleName='balanceDueBox'>

                        <AmountDue
                          store={store}
                          company={this.props.company}
                          sale={this.props.sale}
                          formKey={formKey}
                          fields={{
                            dirty,
                            date,
                            discountType,
                            discountValue,
                            dirty,
                            valid,
                            invalid,
                            pristine,
                            submitting,
                            values,
                          }}
                        />

                      </div>

                    </div>

                  </div>

                  {saveError && <Alert title={intl.formatMessage(messages['ErrorTitle'])} type={'error'}>{intl.formatMessage({ ...saveError, id: saveError._id, })}</Alert>}

                  <div styleName='billingDetailsRow'>

                    <div styleName='innerRow'>

                      <BillingDetails
                        company={this.props.company}
                        sale={sale}
                        formKey={formKey}
                        fields={{billingAddress, date, dirty, valid, invalid, pristine, save, submitting, values,}}
                      />

                    </div>

                  </div>

                  <div styleName='paymentDetailsRow'>

                    <div styleName='innerRow'>

                      <PaymentDetails
                        company={this.props.company}
                        sale={sale}
                        formKey={formKey}
                        depositsAccounts={this.props.depositsAccounts}
                        fields={{paymentMethod, paymentRef, depositToAccountCode, dirty, valid, invalid, pristine, save, submitting, values,}}
                      />

                    </div>

                  </div>

                  <div styleName='itemsContainerRow'>

                    <div styleName='innerRow'>


                      <div styleName='items'>

                        <ProductItems
                          salesAccounts={this.props.salesAccounts}
                          refresh={refresh}
                          company={this.props.company}
                          sale={sale}
                          viewer={this.props.viewer}
                          formKey={formKey}
                          store={store}
                          fields={{dirty, valid, invalid, setActiveRow, resetLines, addMoreRows, clearAllRows, clearRow, moveOp, pristine, submitting, values,}}
                          height={minHeight}
                          bodyWidth={bodyWidth}
                        />

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
                                sale={sale}
                                formKey={formKey}
                                fields={{memo, dirty, valid, invalid, pristine, save, submitting, values,}}
                              />

                            </div>

                          </div>

                        </div>

                        <div className='col-sm-6 last-col'>

                          {this.props.company.salesSettings.discountEnabled && <div styleName='discountFormRow'>

                            <div styleName='innerRow'>

                              <DiscountForm
                                formKey={formKey}
                                store={store}
                                sale={sale}
                                fields={{dirty, discountType, discountValue, valid, invalid, pristine, submitting, values,}}
                              />

                            </div>

                          </div>}

                          {/*<div styleName='taxFormRow'>

                            <div styleName='innerRow'>

                              <TaxForm
                                formKey={formKey}
                                store={store}
                                sale={sale}
                                fields={{ discountType, discountValue, taxPercent, dirty, valid, invalid, pristine, save, submitting, values,}}
                              />

                            </div>

                          </div>*/}

                          <div styleName='totalRow'>

                            <div styleName='innerRow'>

                              <TotalLine
                                formKey={formKey}
                                store={store}
                                sale={sale}
                                fields={{
                                  discountType,
                                  discountValue,
                                  // taxPercent,
                                  dirty,
                                  valid,
                                  invalid,
                                  pristine,
                                  save,
                                  submitting,
                                  values,
                                }}
                              />

                            </div>

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

                              <hr styleName='sectionDivider'/>

                              <div styleName='innerRow' style={{width: '40%', minWidth: 492,}}>

                                <Files
                                  sale={sale}
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
              styleName='btn dark'
              onClick={() => this._handleCancel()}
              disabled={submitting}
              className='unselectable'>{intl.formatMessage(messages['cancel'])}
            </button>

          </div>

          <div styleName='tableCell' style={{textAlign: 'center'}}>

            <div>
              {sale && <SaleActions onDelete={this._del()} onShowJournalEntries={this._showJournal} className={'unselectable'} styles={styles}/>}
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
            this.props.del({ sale: this.props.sale, company: this.props.company, viewer: this.props.viewer, })
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
          type={'Sale'}
          company={this.props.company}
          viewer={this.props.viewer}
          person={this.props.sale.customer}
          id={this.props.sale.objectId}
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

function decorateData({
  billingAddress, customer, depositToAccountCode, paymentRef, discountType, discountValue, date, memo, files, paymentMethod}){
  return {
    billingAddress,
    customer: {
      className: customer.className,
      id: customer.objectId,
    },
    depositToAccountCode,
    discountType: discountTypeValueByIndex[discountType],
    discountValue,
    date: unNormalizeMoment(moment(date)).format(),
    memo,
    files,
    paymentMethod,
    paymentRef,
  };
}

function getDiscountType(type){
  return type;
  // switch (type) {
  //   case 'Percent': return 2;
  //   case 'Value':   return 1;
  // }
}

function decorateItem(index, { date, description, item, qty, rate, discountPart, }){
  return {
    index,
    date: date ? unNormalizeMoment(moment(date)).format() : undefined,
    description,
    item: {
      className: item.className,
      id: item.objectId,
    },
    qty,
    rate,
    discountPart: {
      type: getDiscountType(discountPart.type),
      value: discountPart.value,
    },
  };
}

function getTopStyle(sale){
  return {
    height: 100,
    minHeight: 100,
  };
}

class MySplitButton extends Component{
  static contextTypes = {
    intl: intlShape.isRequired,
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

          <SplitButton className={className} disabled={disabled} onClick={onSaveClose()} title={title} dropup pullRight id={'sale-form'}>

            <MenuItem onClick={onSaveClose(false)} eventKey={'1'}>
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

class SaleActions extends Component{
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
