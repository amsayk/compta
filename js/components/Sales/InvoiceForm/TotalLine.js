import React, {Component, PropTypes} from 'react';

import classnames from 'classnames';

import styles from './InvoiceForm.scss';

import CSSModules from 'react-css-modules';

import getFieldValue from '../../utils/getFieldValue';

import {
  intlShape,
} from 'react-intl';

import messages from './messages';

@CSSModules(styles, {allowMultiple: true})
export default class extends Component{
  static contextTypes = {
    intl: intlShape.isRequired
  };
  render(){
    const {intl,} = this.context;
    const {
      store,
      invoice,
      fields: {
        discountType,
        discountValue,
      },} = this.props;
    const totalDiscount = store.getTotalDiscount({
      discountType: getFieldValue(discountType),
      discountValue: discountValue.invalid ? 0.0 : getFieldValue(discountValue),
    });

    const total = store.getTotal({
      discountType: getFieldValue(discountType),
      discountValue: discountValue.invalid ? 0.0 : getFieldValue(discountValue),
    });
    const balanceDue = total - (invoice ? invoice.paymentsConnection.totalAmountReceived : 0.0);
    return (
      <div styleName='total-wrapper'>

        <div styleName='total'>

          <div styleName=''>

            <div styleName={'width_x'} className='row' style={{ paddingTop: 0, paddingBottom: 15, }}>

              <div styleName='subsection12TitleText' className='col-sm-8' style={{textAlign: 'right'}}>
                {intl.formatMessage(messages['TotalDiscount'])}
              </div>

              <div style={{display: 'inline-block'}} className='col-sm-4 last-col' style={{textAlign: 'right'}}>
                <div styleName='amount'>{intl.formatNumber(totalDiscount, {format: 'MAD'})}</div>
              </div>

            </div>

            <div styleName={'width_x'} className='row' style={{ paddingTop: 0, paddingBottom: 15, }}>

              <div styleName='subsection12TitleText' className='col-sm-8' style={{textAlign: 'right'}}>
                {intl.formatMessage(messages['Total'])}
              </div>

              <div style={{display: 'inline-block'}} className='col-sm-4 last-col' style={{textAlign: 'right'}}>
                <div styleName='amount'>{intl.formatNumber(total, {format: 'MAD'})}</div>
              </div>

            </div>

            {invoice && <div styleName={'width_x'} className='row' style={{ paddingTop: 0, paddingBottom: 15, }}>

              <div styleName='subsection12TitleText' className='col-sm-8' style={{textAlign: 'right'}}>
                {intl.formatMessage(messages['AmountReceived'])}
              </div>

              <div style={{display: 'inline-block'}} className='col-sm-4 last-col' style={{textAlign: 'right'}}>
                <div styleName='amount'>{intl.formatNumber(invoice.paymentsConnection.totalAmountReceived, {format: 'MAD'})}</div>
              </div>

            </div>}

            <div styleName='subsection12TitleText' styleName={'width_x'} className='row'>

              <div className='col-sm-8' style={{textAlign: 'right'}}>
                {intl.formatMessage(messages['BalanceDue'])}
              </div>

              <div style={{display: 'inline-block'}} className='col-sm-4 last-col' style={{textAlign: 'right'}}>
                <div styleName='amount'>{intl.formatNumber(balanceDue, {format: 'MAD'})}</div>
              </div>

            </div>

          </div>

        </div>

      </div>
    );
  }
}
