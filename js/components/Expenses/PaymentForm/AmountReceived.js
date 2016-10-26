import React, {Component, PropTypes} from 'react';

import classnames from 'classnames';

import styles from './PaymentForm.scss';

import CSSModules from 'react-css-modules';

import requiredPropType from 'react-prop-types/lib/all';

import getFieldValue from '../../utils/getFieldValue';

import {
  intlShape,
} from 'react-intl';

import messages from './messages';

@CSSModules(styles, {allowMultiple: true})
export default class extends React.Component {
  static displayName = 'PaymentAmountReceived';
  static contextTypes = {
    intl: intlShape.isRequired,
  };
  static propTypes = {
    payment: requiredPropType(
      React.PropTypes.object,
      function(props, propName, componentName) {
        if (props.formKey !== 'NEW' && !props.payment) {
          return new Error('PaymentAmountReceived: payment required!');
        }
      }
    ),
  }
  render() {
    const { intl, } = this.context;
    const {
      formKey,
      payment,
      store,
      fields: { amountReceived, dirty, },
    } = this.props;
    const hasPayment = formKey !== 'NEW';

    const _dirty = dirty || store.isDirty;

    const total = hasPayment && ! _dirty
      ? payment.amountReceived : getFieldValue(amountReceived);
    return (
      <div styleName='balance-due-wrapper'>

        <div styleName='balance-due'>

          <div styleName='table floatRight'>

            <div styleName='tableRow'>

            <div styleName='tableCell'>

              <div styleName='leftPadding10 inlineBlock'>

                <div style={{}}>
                    <div styleName='stageAmountLabel upperCase' style={{ textAlign: 'right', }}>{intl.formatMessage(messages['amount_received_label'])}</div>
                    <div styleName='amount'>{typeof total === 'undefined' || total === 0.0 ? null : intl.formatNumber(total, {format: 'MAD'})}</div>
                </div>

              </div>

            </div>

            </div>
          </div>

        </div>

      </div>
    );
  }
}
