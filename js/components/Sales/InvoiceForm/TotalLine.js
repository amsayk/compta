import React, {Component, PropTypes} from 'react';

import classnames from 'classnames';

import { StoreProto, } from '../../../redux/modules/v2/invoices';

import VAT from './VAT';

import styles from './InvoiceForm.scss';

import CSSModules from 'react-css-modules';

import getFieldValue from '../../utils/getFieldValue';

import {
  intlShape,
} from 'react-intl';

import messages from './messages';

@CSSModules(styles, {allowMultiple: true})
export default class extends React.Component{
  static contextTypes = {
    intl: intlShape.isRequired
  };
  render(){
    const {intl,} = this.context;
    const {
      formKey,
      store,
      invoice,
      fields: {
        id,
        discountType,
        discountValue,
        ...otherFields,
      },} = this.props;

    // const totalDiscount = store.getTotalDiscount({
    //   discountType: getFieldValue(discountType),
    //   discountValue: discountValue.invalid ? 0.0 : getFieldValue(discountValue),
    // });

    const totalDiscount = StoreProto.getTotalDiscount.call(store, {
      discountType: getFieldValue(discountType),
      discountValue: discountValue.invalid ? 0.0 : getFieldValue(discountValue),
    });

    // const total = store.getTotal({
    //   discountType: getFieldValue(discountType),
    //   discountValue: discountValue.invalid ? 0.0 : getFieldValue(discountValue),
    // });
    const total = StoreProto.getTotal.call(store, {
      discountType: getFieldValue(discountType),
      discountValue: discountValue.invalid ? 0.0 : getFieldValue(discountValue),
    });
    const balanceDue = total - (invoice ? invoice.paymentsConnection.totalAmountReceived : 0.0);

    const VATEnabled = this.props.company.VATSettings.enabled;

    const isSaved = invoice || typeof getFieldValue(id) !== 'undefined';

    return (
      <div styleName='total-wrapper'>

        <div styleName='total'>

          <div styleName=''>

            <div styleName={'width_x'} className='row' style={{ paddingTop: 0, paddingBottom: 15, }}>

              <div styleName='subsection12TitleText' className='col-sm-8' style={{paddingRight: 3, textAlign: 'right'}}>
                {intl.formatMessage(messages['TotalDiscount'])}
              </div>

              <div className='col-sm-4 last-col' style={{textAlign: 'right', display: 'inline-block'}}>
                <div styleName='amount'>{intl.formatNumber(totalDiscount, {format: 'MAD'})}</div>
              </div>

            </div>

            {VATEnabled && <VAT
              formKey={formKey}
              store={store}
              fields={{discountType, discountValue, ...otherFields,}}
            />}

            <div styleName={'width_x'} className='row' style={{ paddingTop: 0, paddingBottom: 15, }}>

              <div styleName='subsection12TitleText' className='col-sm-8' style={{paddingRight: 3, textAlign: 'right'}}>
                {intl.formatMessage(messages['Total'])}
              </div>

              <div className='col-sm-4 last-col' style={{textAlign: 'right', display: 'inline-block'}}>
                <div styleName='amount'>{intl.formatNumber(total, {format: 'MAD'})}</div>
              </div>

            </div>

            {isSaved && <div styleName={'width_x'} className='row' style={{ paddingTop: 0, paddingBottom: 15, }}>

              <div styleName='subsection12TitleText' className='col-sm-8' style={{paddingRight: 3, textAlign: 'right'}}>
                {intl.formatMessage(messages['AmountReceived'])}
              </div>

              <div className='col-sm-4 last-col' style={{textAlign: 'right', display: 'inline-block'}}>
                <div styleName='amount'>{intl.formatNumber(invoice ? invoice.paymentsConnection.totalAmountReceived : 0.0, {format: 'MAD'})}</div>
              </div>

            </div>}

            <div styleName='subsection12TitleText' styleName={'width_x'} className='row'>

              <div className='col-sm-8' style={{paddingRight: 3, textAlign: 'right'}}>
                {intl.formatMessage(messages['BalanceDue'])}
              </div>

              <div className='col-sm-4 last-col' style={{textAlign: 'right', display: 'inline-block'}}>
                <div styleName='amount'>{intl.formatNumber(balanceDue, {format: 'MAD'})}</div>
              </div>

            </div>

          </div>

        </div>

      </div>
    );
  }
}
