import React, {Component, PropTypes} from 'react';
import ReactDOM from 'react-dom';

import {reduxForm} from 'redux-form';

import stopEvent from '../../utils/stopEvent';

import validation, {} from './filterFormValidation';

import events from 'dom-helpers/events';
import contains from 'dom-helpers/query/contains';

import { batchActions, } from 'redux-batched-actions';
import { changeWithKey as change, } from 'redux-form';

import classnames from 'classnames';

import PayeeListItem from './ExpenseForm/PayeeListItem';

import styles from './FilterForm.scss';

import CSSModules from 'react-css-modules';

import Modal from 'react-bootstrap/lib/Modal';

import Dialog, {Body, Footer} from '../utils/Dialog';

import DateTimePicker from 'react-widgets/lib/DateTimePicker';
import Combobox from 'react-widgets/lib/Combobox';
import moment from 'moment';

import getFieldValue from '../utils/getFieldValue';

import { getScrollTop, getScrollLeft, } from '../../utils/dimensions';

import { Types, Statuses, Dates, } from './utils'

import {
  intlShape,
} from 'react-intl';

import messages from './messages';

function normalizeMoment(m){
  return m.hour(0)
    .minutes(0)
    .seconds(0);
}

@reduxForm({
  form: 'expensesFilterForm',
  fields: [
    'type',
    'status',

    'date',
    'from',
    'to',

    'customer',
    'payee',
  ],
  validate: validation,
  destroyOnUnmount: true,
}, (state, ownProps) => ({
  initialValues: {
    ...ownProps.filterArgs,
    from: ownProps.filterArgs.from
      ? normalizeMoment(moment(ownProps.filterArgs.from)).format()
      : undefined,
    to: ownProps.filterArgs.to
      ? normalizeMoment(moment(ownProps.filterArgs.to)).format()
      : undefined,
  },
}))
@CSSModules(styles, {allowMultiple: true})
export default class extends React.Component {

  static displayName = 'ExpensesFilterForm';

  static contextTypes = {
    intl: intlShape.isRequired,
    store: PropTypes.object.isRequired,
  };

  static propTypes = {
    fields: PropTypes.object.isRequired,
    dirty: PropTypes.bool.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    valid: PropTypes.bool.isRequired,
    invalid: PropTypes.bool.isRequired,
    pristine: PropTypes.bool.isRequired,
    submitting: PropTypes.bool.isRequired,
    formKey: PropTypes.string.isRequired,
    values: PropTypes.object.isRequired,
  };

  state = {};

  _handleClose = (e) => {
    if(e){
      stopEvent(e);
    }

    setImmediate(() => {
      this.props.onCancel();
    });
  };

  componentDidMount() {
    events.on(document, 'click', this._handleClickoutside, true);
  }

  componentWillUnmount() {
    events.off(document, 'click', this._handleClickoutside, true);
  }

  _handleClickoutside = e => {
    if(!this._dialog || !this._dialog._modal){
      return;
    }

    const container = ReactDOM.findDOMNode(this._dialog._modal);
    if(container && !contains(container, e.target)){
      this._handleClose(e);
    }
  };

  render() {
    const self = this;

    const {
      formKey,
      dirty,
      handleSubmit,
      fields: {
        type,
        status,

        date,
        from,
        to,

        customer,
        payee,
      },
      valid,
      invalid,
      pristine,
      save,
      values,

      styles,

      company,

    } = this.props;

    const {intl,} = this.context;

    const customerValue = function(){
      const val = getFieldValue(customer);
      return val ? val.objectId : undefined;
    }();
    const payeeValue = function(){
      const val = getFieldValue(payee);
      return val ? val.objectId : undefined;
    }();

    const doSave = handleSubmit((data) => {
      setImmediate(() => {
        this.props.onDone({
          type: data['type'],
          status: data['status'],
          date: data['date'],
          from: data['from'] ? moment(data['from']).startOf('day').format() : null,
          to: data['to'] ? moment(data['to']).endOf('day').format() : null,
          customer: data['customer'] ? data['customer'].objectId : null,
          payee: data['payee'] ? data['payee'].objectId : null,
        });
      });
      return Promise.resolve().then(() => {
        this.props.onCancel();
      });
    });

    const fromValue = getFieldValue(from);
    const toValue = getFieldValue(to);
    const typeValue = getFieldValue(type);

    return (
      <Modal dialogClassName={`${styles['modal']} ${styles[`sales-${typeValue}`]} ${styles['mini']} sales-filter-form`}
             dialogComponentClass={Dialog}
             ref={ref => {
               this._dialog = ref;
               if(ref && ref._modal){
                 const style = ReactDOM.findDOMNode(ref._modal).style;
                 const left = getScrollLeft();
                 const top = getScrollTop();
                 style.top = `${303.875 - 140 - top}px`;
                 style.left = `${197 - left}px`;
               }
             }}
             className={classnames({'sales-filter-form': true, [styles['sales-filter-form'] || '']: true, })}
             show={true} keyboard={true} backdrop={false} onHide={() => this._handleClose()} autoFocus enforceFocus>

        <Modal.Body>

          <div styleName='table stretch'>

            <div styleName=''>

              <div>

                <div className='the-container table' style={{}}>

                  <div style={{}}>

                    <div onSubmit={doSave}>

                      <div className='row'>

                        <div  className='col-sm-6 first-col'>

                          <fieldset className='form-group'>

                            <label styleName='subsection12TitleText' htmlFor='type'>{intl.formatMessage(messages['label_Type'])}</label>

                            <div className={''} id='type'>

                              <Combobox
                                caseSensitive={false}
                                filter={(a, b) => {
                                  return a.name.indexOf(b) !== -1;
                                }}
                                data={Types(intl)}
                                value={typeValue}
                                onChange={value => {
                                  if(!value || typeof value === 'string'){
                                    type.onChange(undefined);
                                    return;
                                  }

                                  if(typeof item !== 'string'){

                                    switch (value.id) {
                                      case 'recent':
                                        this.context.store.dispatch(
                                          batchActions([
                                            change('expensesFilterForm', formKey, 'type', value.id),
                                            change('expensesFilterForm', formKey, 'date', 12),
                                            change('expensesFilterForm', formKey, 'from', moment().startOf('day').subtract(30, 'days').format()),
                                            change('expensesFilterForm', formKey, 'to', undefined),
                                            change('expensesFilterForm', formKey, 'status', 'closed'),
                                          ])
                                        );
                                        break;

                                      default:
                                        type.onChange(value.id);
                                    }
                                  }

                                }}
                                textField='name'
                                valueField='id'
                                className={'no-new'}
                                // disabled
                                // groupBy={ person => person.name.length }
                                // groupComponent={GroupByLength}
                                // valueComponent={ListItem}
                                // itemComponent={ListItem}
                              />

                            </div>

                          </fieldset>

                        </div>

                      </div>

                      {typeValue === 'recent' || typeValue === 'money' ? null : <div className='row'>

                        <div className='col-sm-6 first-col'>

                          <fieldset className='form-group'>

                            <label styleName='subsection12TitleText' htmlFor='status'>{intl.formatMessage(messages['label_Status'])}</label>

                            <div className={''} id='status'>

                              <Combobox
                                data={Statuses(intl)[typeValue]}
                                value={getFieldValue(status)}
                                onChange={value => {
                                  if(!value || typeof value === 'string'){
                                    status.onChange(status.initialValue);
                                    return;
                                  }
                                  // status.onChange(value.id);
                                  this.context.store.dispatch(
                                    batchActions([
                                      change('expensesFilterForm', formKey, 'status', value.id),
                                      change('expensesFilterForm', formKey, 'type', 'bills'),
                                    ])
                                  );
                                }}
                                textField='name'
                                valueField='id'
                                className={'no-new'}
                                // disabled
                                // groupBy={ person => person.name.length }
                                // groupComponent={GroupByLength}
                                // valueComponent={ListItem}
                                // itemComponent={ListItem}
                              />

                            </div>

                          </fieldset>

                        </div>

                      </div>}

                      {typeValue === 'recent' ? null : <div className='row'>

                        <div className='col-sm-6 first-col'>

                          <fieldset className='form-group'>

                            <label styleName='subsection12TitleText' htmlFor='date'>{intl.formatMessage(messages['label_Date'])}</label>

                            <div className={''} id='date'>

                              <Combobox
                                data={Dates(intl)}
                                value={getFieldValue(date)}
                                onChange={item => {
                                  if(!item || typeof item === 'string'){
                                    date.onChange(date.initialValue);
                                    return;
                                  }

                                  this.context.store.dispatch(
                                    batchActions([
                                      change('expensesFilterForm', formKey, 'date', item.id),
                                      ...item.getValue(formKey),
                                    ])
                                  );
                                }}
                                textField='name'
                                valueField='id'
                                className={'no-new'}
                                // disabled
                                // groupBy={ person => person.name.length }
                                // groupComponent={GroupByLength}
                                // valueComponent={ListItem}
                                // itemComponent={ListItem}
                              />

                            </div>

                          </fieldset>

                        </div>

                        {typeValue === 'recent' ? null : <div className='col-sm-3 first-col'>

                          <fieldset className='form-group'>

                            <label styleName='subsection12TitleText' htmlFor='from'>{intl.formatMessage(messages['label_From'])}</label>

                            <div className='inline-block' id='from'>

                              <DateTimePicker
                                onChange={value => {
                                  this.context.store.dispatch(
                                    batchActions([
                                      change('expensesFilterForm', formKey, 'from', value),
                                      change('expensesFilterForm', formKey, 'date', 12),
                                    ])
                                  );
                                }}
                                value={fromValue && moment(fromValue).toDate()}
                                // editFormat={'d'}
                                // max={new Date()}
                                // min={new Date()}
                                className={styles.datepicker}
                                tabIndex={-1}
                                culture={intl.locale}
                                messages={{
                                  clearButton: intl.formatMessage(messages.clearButton),
                                }}
                                time={false}/>

                            </div>

                          </fieldset>

                        </div>}

                        <div className='col-sm-3 first-col'>

                          <fieldset className='form-group'>

                            <label styleName='subsection12TitleText' htmlFor='to'>{intl.formatMessage(messages['label_To'])}</label>

                            <div className='inline-block' id='to'>

                              <DateTimePicker
                                onChange={value => {
                                  this.context.store.dispatch(
                                    batchActions([
                                      change('expensesFilterForm', formKey, 'to', value),
                                      change('expensesFilterForm', formKey, 'date', 12),
                                    ])
                                  );
                                }}
                                value={toValue && moment(toValue).toDate()}
                                // editFormat={'d'}
                                // max={new Date()}
                                min={fromValue ? moment(fromValue).toDate() : undefined}
                                className={styles.datepicker}
                                tabIndex={-1}
                                culture={intl.locale}
                                messages={{
                                  clearButton: intl.formatMessage(messages.clearButton),
                                }}
                                time={false}/>

                            </div>

                          </fieldset>

                        </div>

                      </div>}

                      <div className='row'>

                        <div className='col-sm-7 first-col last-col'>

                          <fieldset className='form-group'>

                            <label styleName='subsection12TitleText' htmlFor='customer'>{intl.formatMessage(messages['label_Payee'])}</label>

                            <div className={''} id='customer'>

                              <Combobox
                                data={[ALL_ITEM(intl)].concat(company.people.edges.map(({node: { objectId, type, displayName, }}) => ({ objectId, type, displayName, })))}
                                value={customerValue || payeeValue || 'ALL'}
                                textField={'displayName'}
                                valueField='objectId'
                                onChange={item => {
                                  if(!item || typeof item === 'string'){
                                    this.context.store.dispatch(
                                      batchActions([
                                        change('expensesFilterForm', formKey, 'customer', undefined),
                                        change('expensesFilterForm', formKey, 'payee', undefined),
                                      ])
                                    );
                                    return;
                                  }

                                  if(item.objectId === 'ALL'){
                                    this.context.store.dispatch(
                                      batchActions([
                                        change('expensesFilterForm', formKey, 'customer', undefined),
                                        change('expensesFilterForm', formKey, 'payee', undefined),
                                      ])
                                    );
                                    return;
                                  }

                                  switch (item.type) {
                                    case 'Customer':
                                    case 1:
                                      this.context.store.dispatch(
                                        batchActions([
                                          change('expensesFilterForm', formKey, 'customer', { type: 'Customer', id: item.objectId, objectId: item.objectId, }),
                                          change('expensesFilterForm', formKey, 'payee', undefined),
                                        ])
                                      );
                                      break;

                                    case 'Vendor':
                                    case 2:
                                      this.context.store.dispatch(
                                        batchActions([
                                          change('expensesFilterForm', formKey, 'customer', undefined),
                                          change('expensesFilterForm', formKey, 'payee', { type: 'Vendor', id: item.objectId, objectId: item.objectId, }),
                                        ])
                                      );
                                      break;
                                  }

                                }}
                                className={'no-new'}
                                // disabled
                                // groupBy={ person => person.name.length }
                                // groupComponent={GroupByLength}
                                // valueComponent={ListItem}
                                itemComponent={PayeeListItem}
                              />

                            </div>

                          </fieldset>

                        </div>

                      </div>

                    </div>

                  </div>

                </div>

              </div>


            </div>

          </div>

        </Modal.Body>

        <Modal.Footer styleName={'modal-footer'}>

          <br/>

          <button
            styleName='save-btn floatLeft'
            onClick={() => this._handleCancel()}
            className='unselectable'>{intl.formatMessage(messages['Reset'])}
          </button>


          <button
            styleName='btn primary floatRight'
            onClick={doSave}
            className={'unselectable'}>
            {' '}{intl.formatMessage(messages['save'])}
          </button>

        </Modal.Footer>

      </Modal>
    );

  }

  _handleCancel(){
    setImmediate(() => {
      this.props.onDone({
        type: 'ALL',
        status: 'ALL',
        date: 1,
        from: null,
        to: null,
        customer: null,
        payee: null,
      });
    });
    this.props.onCancel();
  }

}

const ALL_ITEM = (intl) => ({objectId: 'ALL', displayName: intl.formatMessage(messages['Payees_All'])});

// function getOffset( el ) {
//   var _x = 0;
//   var _y = 0;
//   while( el && !isNaN( el.offsetLeft ) && !isNaN( el.offsetTop ) ) {
//     _x += el.offsetLeft - el.scrollLeft;
//     _y += el.offsetTop - el.scrollTop;
//     el = el.offsetParent;
//   }
//   return { top: _y, left: _x };
// }
