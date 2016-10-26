import React, {Component, PropTypes} from 'react';

import classnames from 'classnames';

import styles from './ExpenseForm.scss';

import CSSModules from 'react-css-modules';

import getFieldValue from '../../utils/getFieldValue';

import {
  intlShape,
} from 'react-intl';

import VAT from './VAT';

import messages from './messages';

@CSSModules(styles, {allowMultiple: true})
export default class extends React.Component{
  static contextTypes = {
    intl: intlShape.isRequired
  };
  render(){
    const {intl,} = this.context;
    const { formKey, store, expense, fields: { dirty, ...otherFields, },} = this.props;
    // const total = store.subtotal;
    const hasExpense = formKey !== 'NEW';

    const _dirty = dirty || store.isDirty;

    const total = hasExpense && ! _dirty
      ? expense.totalAmountPaid : store.getTotal();

    const VATEnabled = this.props.company.VATSettings.enabled;
    return (
      <div styleName='total-wrapper'>

        <div styleName='total'>

          <div styleName=''>

            {VATEnabled && <div styleName={'width_x'} className='row'>

              <div styleName='subsection12TitleText' className='col-sm-8' style={{paddingRight: 3, textAlign: 'right'}}>
                {intl.formatMessage(messages['Subtotal'])}
              </div>

              <div className='col-sm-4 last-col' style={{textAlign: 'right',display: 'inline-block'}}>
                <div styleName='amount'>{intl.formatNumber(store.subtotal, {format: 'MAD'})}</div>
              </div>

            </div>}

            {VATEnabled && <VAT
                formKey={formKey}
                store={store}
                fields={{ dirty, ...otherFields,}}
              />}

            <div styleName={'width_x'} className='row' style={{ paddingTop: 0, paddingBottom: 15, }}>

              <div styleName='subsection12TitleText' className='col-sm-8' style={{paddingRight: 3, textAlign: 'right'}}>
                {intl.formatMessage(messages['Total'])}
              </div>

              <div style={{display: 'inline-block'}} className='col-sm-4 last-col' style={{textAlign: 'right'}}>
                <div styleName='amount'>{intl.formatNumber(total, {format: 'MAD'})}</div>
              </div>

            </div>

          </div>

        </div>

      </div>
    );
  }
}
