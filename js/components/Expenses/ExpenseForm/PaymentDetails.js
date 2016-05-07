import React, {Component, PropTypes} from 'react';
import Relay from 'react-relay';

import styles from './ExpenseForm.scss';

import classnames from 'classnames';

import CSSModules from 'react-css-modules';

import Combobox from 'react-widgets/lib/Combobox';
import DateTimePicker from 'react-widgets/lib/DateTimePicker';
import moment from 'moment';

import AccountListItem from './AccountListItem';

const PAYMENT_METHODS = intl => [
  { id: 1, name: intl.formatMessage(messages['PaymentMethod_Cash'])},
  { id: 2, name: intl.formatMessage(messages['PaymentMethod_Check'])},
  { id: 3, name: intl.formatMessage(messages['PaymentMethod_Creditcard']) },
];

const paymentMethodValueByIndex = {
  1  : 'Cash',
  2  : 'Check',
  3  : 'Creditcard',
};

const paymentMethodIndexByValue = {
  'Cash':       1,
  'Check':      2,
  'Creditcard': 3,
};

import getFieldValue from '../../utils/getFieldValue';

import {
  intlShape,
} from 'react-intl';

import messages from './messages';

@CSSModules(styles, {allowMultiple: true})
export default class extends Component {

  static contextTypes = {
    intl: intlShape.isRequired,
  };

  static propTypes = {
  };

  state = {
  };

  componentDidMount() {
  }

  render() {
    const {styles, formKey, fields: { date, paymentMethod, paymentRef, pristine, }} = this.props;
    const {intl,} = this.context;
    const paymentMethodValue = getFieldValue(paymentMethod);
    const self = this;
    return (
      <div styleName='payment-details-wrapper'>

        <div styleName='payment-details'>

          <form>

            <div className='row'>

            <div className='col-sm-2 first-col' style={{ width: 165, }}>

              <fieldset className='form-group'>

                <label styleName='subsection12TitleText' htmlFor='date'>Date du paiement</label>

                <div className='inline-block'>

                  <DateTimePicker
                    // defaultOpen={'calendar'}
                    onChange={value => {
                      date.onChange(normalizeMoment(moment(value)).format());
                    }}
                    value={moment(getFieldValue(date)).toDate()}
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

              <div className='col-sm-2' style={{ width: 165, }}>

                <fieldset className='form-group'>

                  <label style={{display: 'block'}} styleName='subsection12TitleText' htmlFor='paymentMethod'>Mode de paiement</label>

                  <div className='inline-block' id='paymentMethod'>

                    <Combobox
                      data={PAYMENT_METHODS(intl)}
                      value={paymentMethodIndexByValue[paymentMethodValue]}
                      onChange={value => {
                        if(!value || typeof value === 'string'){
                          paymentMethod.onChange(paymentMethod.initialValue);
                          return;
                        }

                        paymentMethod.onChange(
                          paymentMethodValueByIndex[value.id]
                        );
                      }}
                      textField='name'
                      valueField='id'
                      className={'no-new'}
                      // disabled
                      // groupBy={ person => person.name.length }
                      // groupComponent={GroupByLength}
                      // itemComponent={GroupByLength}
                    />

                  </div>

                </fieldset>

              </div>

              <div className='col-sm-6'></div>

              <div className='col-sm-2 last-col' style={{ width: 165, float: 'right', }}>

                <fieldset className='form-group' style={{ float: 'right', }}>

                  <label style={{display: 'block'}} styleName='subsection12TitleText' htmlFor='paymentRef'>Nº de référence</label>

                  <input value={getFieldValue(paymentRef)} onChange={paymentRef.onChange} style={{}} className='form-control' id='paymentRef'/>

                </fieldset>

              </div>

            </div>

          </form>

        </div>

      </div>
    );
  }
}
