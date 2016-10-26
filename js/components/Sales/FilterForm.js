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
  form: 'salesFilterForm',
  fields: [
    'type',
    'status',

    'date',
    'from',
    'to',

    'customer',
  ],
  validate: validation,
  destroyOnUnmount: true,
}, (state, ownProps) => ({
  initialValues: {
    ...ownProps.filterArgs,
    // date: ownProps.filterArgs.from && ownProps.filterArgs.to
    //   ? getDates(
    //     moment(ownProps.filterArgs.from).diff(moment(ownProps.filterArgs.to), 'days'))
    //   : 1,
    from: ownProps.filterArgs.from
      ? normalizeMoment(moment(ownProps.filterArgs.from)).format()
      : undefined,
    to: ownProps.filterArgs.to
      ? normalizeMoment(moment(ownProps.filterArgs.to)).format()
      : undefined,
    // customer: ownProps.filterArgs.customer || 'ALL',
  },
}))
@CSSModules(styles, {allowMultiple: true})
export default class extends React.Component {

  static displayName = 'SalesFilterForm';

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

    const customerValue = getFieldValue(customer);

    const doSave = handleSubmit((data) => {
      setImmediate(() => {
        this.props.onDone({
          type: data['type'],
          status: data['status'],
          date: data['date'],
          from: data['from'] ? moment(data['from']).startOf('day').format() : null,
          to: data['to'] ? moment(data['to']).endOf('day').format() : null,
          customer: typeof data['customer'] !== 'undefined' && data['customer'] !== 'ALL' ? data['customer'] : null,
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
                 const top = getScrollTop();
                 const left = getScrollLeft();
                 style.top = `${303.875 - top}px`;
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
                                          change('salesFilterForm', formKey, 'type', value.id),
                                          change('salesFilterForm', formKey, 'date', 12),
                                          change('salesFilterForm', formKey, 'from', moment().startOf('day').subtract(30, 'days').format()),
                                          change('salesFilterForm', formKey, 'to', undefined),
                                          change('salesFilterForm', formKey, 'status', 'closed'),
                                          change('salesFilterForm', formKey, 'customer', undefined),
                                        ])
                                      );
                                      break;
                                      default:

                                        this.context.store.dispatch(
                                          batchActions([
                                            change('salesFilterForm', formKey, 'type', value.id),
                                            change('salesFilterForm', formKey, 'date', 1),
                                            change('salesFilterForm', formKey, 'from', undefined),
                                            change('salesFilterForm', formKey, 'to', undefined),
                                            change('salesFilterForm', formKey, 'status', 'ALL'),
                                            change('salesFilterForm', formKey, 'customer', undefined),
                                          ])
                                        );
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
                                      change('salesFilterForm', formKey, 'status', value.id),
                                      change('salesFilterForm', formKey, 'type', 'invoices'),
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
                                      change('salesFilterForm', formKey, 'date', item.id),
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
                                      change('salesFilterForm', formKey, 'from', value),
                                      change('salesFilterForm', formKey, 'date', 12),
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
                                      change('salesFilterForm', formKey, 'to', value),
                                      change('salesFilterForm', formKey, 'date', 12),
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

                            <label styleName='subsection12TitleText' htmlFor='customer'>{intl.formatMessage(messages['label_Customer'])}</label>

                            <div className={''} id='customer'>

                              <Combobox
                                data={[ALL_ITEM(intl)].concat(company.customers.edges.map(({node: {objectId, displayName}}) => ({objectId, displayName})))}
                                value={customerValue || 'ALL'}
                                textField={'displayName'}
                                valueField='objectId'
                                onChange={item => {
                                  if(!item || typeof item === 'string'){
                                    customer.onChange(customer.initialValue);
                                    return;
                                  }

                                  customer.onChange(item.objectId);
                                }}
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
      });
    });
    this.props.onCancel();
  }

}

const ALL_ITEM = (intl) => ({objectId: 'ALL', displayName: intl.formatMessage(messages['Customers_All'])});

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
