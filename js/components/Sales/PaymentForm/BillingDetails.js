import React, {Component, PropTypes} from 'react';
import Relay from 'react-relay';

import classnames from 'classnames';

import styles from './PaymentForm.scss';

import CSSModules from 'react-css-modules';

import DateTimePicker from 'react-widgets/lib/DateTimePicker';
import moment from 'moment';

import {
  intlShape,
} from 'react-intl';

import messages from './messages';

import getFieldValue from '../../utils/getFieldValue';

function normalizeMoment(d){
  return moment(d)
    .seconds(0)
    .minutes(0)
    .hour(0);
}

@CSSModules(styles, {allowMultiple: true})
export default class extends Component {

  static displayName = 'PaymentBillingDetails';

  static contextTypes = {
    intl: intlShape.isRequired,
    store: PropTypes.object.isRequired,
  };

  render() {
    const self = this;

    const {styles, formKey, fields: { date, pristine, }} = this.props;

    const {intl,} = this.context;

    return (
      <div styleName='billing-details-wrapper'>

        <div styleName='billing-details'>

          <form>

            <div className='row'>

              <div className='col-sm-2 first-col'>

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

              <div className='col-sm-10'></div>

            </div>

          </form>

        </div>

      </div>
    );
  }
}
