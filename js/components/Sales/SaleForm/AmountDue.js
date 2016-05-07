import React, {Component, PropTypes} from 'react';

import classnames from 'classnames';

import styles from './SaleForm.scss';

import CSSModules from 'react-css-modules';
import {
  intlShape,
} from 'react-intl';

import messages from './messages';

import requiredPropType from 'react-prop-types/lib/all';

import getFieldValue from '../../utils/getFieldValue';

@CSSModules(styles, {allowMultiple: true})
export default class extends Component {
  static displayName = 'SaleAmountDue';
  static contextTypes = {
    intl: intlShape.isRequired,
  };
  static propTypes = {
    sale: requiredPropType(
      React.PropTypes.object,
      function(props, propName, componentName) {
        if (props.formKey !== 'NEW' && !props.sale) {
          return new Error('SaleBalanceDue: sale required!');
        }
      }
    ),
  }
  render() {
    const { intl, } = this.context;
    const {
      formKey,
      sale,
      store,
      fields: {
        dirty,
        discountType,
        discountValue,
      },
    } = this.props;
    const hasSale = formKey !== 'NEW';

    const _dirty = dirty || store.isDirty;

    const total = hasSale && ! _dirty
      ? sale.totalAmountReceived : store.getTotal({
        discountType: getFieldValue(discountType),
        discountValue: discountValue.invalid ? 0.0 : getFieldValue(discountValue),
      });
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
