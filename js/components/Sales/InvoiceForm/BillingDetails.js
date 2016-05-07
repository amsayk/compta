import React, {Component, PropTypes} from 'react';

import { batchActions, } from 'redux-batched-actions';
import {changeWithKey as change,} from 'redux-form';

import classnames from 'classnames';

import styles from './InvoiceForm.scss';

import CSSModules from 'react-css-modules';

import DateTimePicker from 'react-widgets/lib/DateTimePicker';
import Combobox from 'react-widgets/lib/Combobox';
import moment from 'moment';

import getFieldValue from '../../utils/getFieldValue';

import {
  intlShape,
} from 'react-intl';

import messages from './messages';

const TERMS = intl => [
  { id: 1, name: intl.formatMessage(messages['Terms_OnReception'])},
  { id: 2, name: intl.formatMessage(messages['Terms_Net_15'])},
  { id: 3, name: intl.formatMessage(messages['Terms_Net_30']) },
  { id: 4, name: intl.formatMessage(messages['Terms_Net_60']) },
  // { id: 5, name: intl.formatMessage(messages['Terms_Custom']) },
];

function getTermsNumberOfDays(terms){
  switch (terms) {
    case 'OnReception':  return 0;
    case 'Net_15':       return 15;
    case 'Net_30':       return 30;
    case 'Net_60':       return 60;
    case 'Custom':       throw 'BillingDetails.getTermsNumberOfDays#InvalidTerms';
  }
}

function normalizeMoment(d){
  return moment(d).seconds(0).minutes(0).hour(0);
}

function getTermsOfDays(days){
  if(days === 0) return 'OnReception';
  if(days === 15) return 'Net_15';
  if(days === 30) return 'Net_30';
  if(days === 60) return 'Net_60';
  return 'Custom';
}

const termsValueByIndex = {
  1  : 'OnReception',
  2  : 'Net_15',
  3  : 'Net_30',
  4  : 'Net_60',
  5  : 'Custom',
};

const termsIndexByValue = {
  'OnReception': 1,
  'Net_15':      2,
  'Net_30':      3,
  'Net_60':      4,
  'Custom':      5,
};

const ListItem = React.createClass({
  render() {
    const item = this.props.item;
    return (
      <span>
    { item.name }
  </span>);
  }
});

@CSSModules(styles, {allowMultiple: true})
export default class extends Component {

  static displayName = 'BillingDetails';

  static contextTypes = {
    intl: intlShape.isRequired,
    store: PropTypes.object.isRequired,
  };

  static propTypes = {
  };

  render() {
    const self = this;

    const {styles, formKey, fields: { billingAddress, terms, date, dueDate, pristine, }} = this.props;

    const {intl,} = this.context;

    const termsValue = getFieldValue(terms);
    const dateValue = getFieldValue(date);
    const dueDateValue = getFieldValue(dueDate);

    return (
      <div styleName='billing-details-wrapper'>

        <div styleName='billing-details'>

          <form>

            <div className='row' style={{}}>

              <div className='col-sm-2 first-col'>

                <fieldset className={'form-group'}>
                  <label styleName='subsection12TitleText' htmlFor='billingAddress'>{intl.formatMessage(messages['BillingAddress'])}</label>
                  <textarea
                    onChange={billingAddress.onChange}
                    value={getFieldValue(billingAddress)}
                    className={classnames('form-control billingAddress', {'has-error': !pristine && billingAddress.invalid,})}
                    id='billingAddress'
                    style={{resize: 'none',}}
                  />
                </fieldset>

              </div>

              <div className='col-sm-2' style={{ width: 200, }}>

                <fieldset className='form-group'>

                  <label styleName='subsection12TitleText' htmlFor='terms'>{intl.formatMessage(messages['Terms'])}</label>

                  <div className={''} id='terms'>

                    <Combobox
                      data={TERMS(intl)}
                      value={termsValue === 'Custom' ? null : termsIndexByValue[termsValue]}
                      onChange={value => {
                        switch (value.id) {
                          case 5: // Custom

                            (function(){
                              const terms = termsValueByIndex[value.id];
                              self.context.store.dispatch(
                                change('invoice', formKey, 'terms', terms),
                              );

                            })();

                            break;

                          default:

                            (function(){
                              const terms = termsValueByIndex[value.id];
                              const dt = dateValue ? moment(dateValue) : moment();
                              self.context.store.dispatch(batchActions([
                                change('invoice', formKey, 'terms', terms),
                                change('invoice', formKey, 'date', normalizeMoment(dt).format()),
                                change('invoice', formKey, 'dueDate', normalizeMoment(dt).add(getTermsNumberOfDays(terms), 'days').format()),
                              ]));

                            })();

                            break;
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

              <div className='col-sm-1' style={{ width: 200, }}>

                <fieldset className='form-group'>

                  <label styleName='subsection12TitleText' htmlFor='date'>{intl.formatMessage(messages['InvoiceDate'])}</label>

                  <div className='inline-block'>

                    <DateTimePicker
                      onChange={value => {

                        switch(getFieldValue(this.props.fields.terms)){
                          case 'Custom':

                            // date.onChange(normalizeMoment(moment(value)).format());
                            (function(){
                              const date = normalizeMoment(moment(value));
                              const dueDate = normalizeMoment(moment(dueDateValue));

                              self.context.store.dispatch(batchActions([
                                change('invoice', formKey, 'date', normalizeMoment(moment(value)).format()),
                                change('invoice', formKey, 'terms', getTermsOfDays(Math.abs(date.diff(dueDate, 'days')))),
                              ]));

                            })();
                            break;

                          default:

                            (function(){
                              const dt = moment(value);
                              self.context.store.dispatch(batchActions([
                                change('invoice', formKey, 'date', normalizeMoment(dt).format()),
                                change(
                                  'invoice',
                                  formKey,
                                  'dueDate',
                                  normalizeMoment(dt).add(getTermsNumberOfDays(termsValue), 'days').format()),
                              ]));

                            })();
                            break;
                        }

                      }}
                      value={moment(dateValue).toDate()}
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

              </div>

              <div className='col-sm-1' style={{ width: 200, }}>

                <fieldset className='form-group'>

                  <label styleName='subsection12TitleText' htmlFor='dueDate'>{intl.formatMessage(messages['DueDate'])}</label>

                  <div className='inline-block'>

                    <DateTimePicker
                      onChange={value => {

                        // switch(getFieldValue(this.props.fields.terms)){
                        //   case 'Custom':
                        //
                        //     dueDate.onChange(normalizeMoment(moment(value)).format());
                        //     break;
                        //
                        //   default:

                            (function(){
                              const date = normalizeMoment(moment(dateValue));
                              const dueDate = normalizeMoment(moment(value));

                              self.context.store.dispatch(batchActions([
                                change('invoice', formKey, 'dueDate', normalizeMoment(moment(value)).format()),
                                change('invoice', formKey, 'terms', getTermsOfDays(Math.abs(date.diff(dueDate, 'days')))),
                              ]));

                            })();
                        //     break;
                        // }

                      }}
                      value={normalizeMoment(moment(dueDateValue)).toDate()}
                      // editFormat={'d'}
                      // max={new Date()}
                      min={normalizeMoment(moment(dateValue)).toDate()}
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

              <div className='col-sm-6'></div>

            </div>

          </form>

        </div>

      </div>
    );
  }
}
