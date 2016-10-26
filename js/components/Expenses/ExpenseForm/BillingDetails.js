import React, {Component, PropTypes} from 'react';
import Relay from 'react-relay';

import classnames from 'classnames';

import styles from './ExpenseForm.scss';

import CSSModules from 'react-css-modules';

import DateTimePicker from 'react-widgets/lib/DateTimePicker';
import moment from 'moment';

import {
  intlShape,
} from 'react-intl';

import messages from './messages';

import getFieldValue from '../../utils/getFieldValue';

function normalizeMoment(d){
  return moment(d).seconds(0).minutes(0).hour(0);
}

@CSSModules(styles, {allowMultiple: true})
export default class extends React.Component {

  static displayName = 'ExpenseBillingDetails';

  static contextTypes = {
    intl: intlShape.isRequired,
    store: PropTypes.object.isRequired,
  };

  render() {
    const self = this;

    const {styles, formKey, fields: { mailingAddress, date, paymentRef: refNo, pristine, }} = this.props;

    const {intl,} = this.context;

    const dateValue = getFieldValue(date);
    const refNoValue = getFieldValue(refNo, '');

    return (
      <div styleName='billing-details-wrapper'>

        <div styleName='billing-details'>

          <div>

            <div className='row'>

              <div className='col-sm-2 first-col'>

                <fieldset className={'form-group'}>
                  <label styleName='subsection12TitleText' htmlFor='mailingAddress'>{intl.formatMessage(messages['MailingAddress'])}</label>
                  <textarea
                    onChange={mailingAddress.onChange}
                    value={getFieldValue(mailingAddress, '')}
                    className={classnames('form-control mailingAddress', {'has-error': !pristine && mailingAddress.invalid,})}
                    id='mailingAddress'
                    style={{resize: 'none',}}
                  />
                </fieldset>

              </div>

              <div className='col-sm-2'>

                <fieldset className='form-group'>

                  <label styleName='subsection12TitleText' htmlFor='date'>Date du paiement</label>

                  <div className='inline-block'>

                    <DateTimePicker
                      // defaultOpen={'calendar'}
                      onChange={value => {
                        date.onChange(normalizeMoment(moment(value)).format());
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

              <div className='col-sm-6'></div>

              <div className='col-sm-2 last-col' style={{ float: 'right', }}>

                <fieldset className={'form-group'} style={{ float: 'right', }}>

                  <label style={{display: 'block'}} styleName='subsection12TitleText' htmlFor='refNo'>Nº de réf</label>

                  <input
                    style={{
                      // borderTopLeftRadius: 0,
                      // borderBottomLeftRadius: 0,
                      height: 37,
                      // marginLeft: -1,
                      // marginLeft: 5,
                      width: 150,
                    }}
                    value={refNoValue}
                    onChange={refNo.onChange}
                    className='form-control'
                    id='refNo'
                  />

                </fieldset>

              </div>

            </div>

          </div>

        </div>

      </div>
    );
  }
}
