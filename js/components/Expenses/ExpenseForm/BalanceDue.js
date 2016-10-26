import React, {Component, PropTypes} from 'react';

import classnames from 'classnames';

import styles from './ExpenseForm.scss';

import CSSModules from 'react-css-modules';
import {
  intlShape,
} from 'react-intl';

import messages from './messages';

import requiredPropType from 'react-prop-types/lib/all';

import getFieldValue from '../../utils/getFieldValue';

@CSSModules(styles, {allowMultiple: true})
export default class extends React.Component {
  static displayName = 'ExpenseAmountDue';
  static contextTypes = {
    intl: intlShape.isRequired,
  };
  static propTypes = {
    expense: requiredPropType(
      React.PropTypes.object,
      function(props, propName, componentName) {
        if (props.formKey !== 'NEW' && !props.expense) {
          return new Error('ExpenseBalanceDue: expense required!');
        }
      }
    ),
  }
  render() {
    const { intl, } = this.context;
    const {
      formKey,
      expense,
      store,
      fields: { dirty,},
    } = this.props;
    const hasExpense = formKey !== 'NEW';

    const _dirty = dirty || store.isDirty;

    const total = hasExpense && ! _dirty
      ? expense.totalAmountPaid : store.getTotal();
    return (
      <div styleName='balance-due-wrapper'>

        <div styleName='balance-due'>

          <div styleName='table floatRight'>

            <div styleName='tableRow nameStatusSection'>

              <div styleName='tableCell'>

                <div styleName='leftPadding10 inlineBlock'>

                  <div style={{}}>
                      <div styleName='stageAmountLabel upperCase' style={{ textAlign: 'right', }}>{intl.formatMessage(messages['amount_label'])}</div>
                      <div styleName='amount'>{intl.formatNumber(total, {format: 'MAD'})}</div>
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
