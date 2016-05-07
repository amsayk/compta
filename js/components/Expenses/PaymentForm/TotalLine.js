import React, {Component, PropTypes} from 'react';
import classnames from 'classnames';

import styles from './PaymentForm.scss';

import CSSModules from 'react-css-modules';

import requiredPropType from 'react-prop-types/lib/all';

import {
  intlShape,
} from 'react-intl';

import messages from './messages';

import getFieldValue from '../../utils/getFieldValue';

@CSSModules(styles, {allowMultiple: true})
export default class extends Component{
  static displayName = 'PaymentTotals';
  static contextTypes = {
    intl: intlShape.isRequired,
  };
  static propTypes = {
    payment: requiredPropType(
      React.PropTypes.object,
      function(props, propName, componentName) {
        if (props.formKey !== 'NEW' && !props.payment) {
          return new Error('PaymentTotals: payment required!');
        }
      }
    ),
  }
  render(){
    const { intl, } = this.context;
    const {
      formKey,
      payment,
      store,
      fields: { amountReceived, dirty, },
    } = this.props;
    const hasPayment = formKey !== 'NEW';

    const _dirty = dirty || store.isDirty;

    const amountToApply = hasPayment && ! _dirty
      ? payment.amountReceived : getFieldValue(amountReceived);

    const amountToCredit =
      (amountToApply && isFinite(amountToApply) ? amountToApply : 0.0) - (hasPayment && ! _dirty ? payment.itemsConnection.totalAmountPaid : store.total);

    return (
      <div styleName='total-wrapper'>

        <div styleName='total'>

          <div styleName=''>

            <div className='row' style={{ paddingTop: 0, }}>

              <div styleName='subsection12TitleText' className='col-sm-6 first-col' style={{textAlign: 'right'}}>
                Montant à appliquer
              </div>

              <div style={{display: 'inline-block'}} className='col-sm-6 last-col' style={{textAlign: 'right'}}>
                <div styleName='amount'>{intl.formatNumber(amountToApply && isFinite(amountToApply) ? amountToApply : 0.0, {format: 'MAD'})}</div>
              </div>

            </div>

            <div className='row' style={{ paddingTop: 5, paddingBottom: 0, }}>

              <div styleName='subsection12TitleText' className='col-sm-6 first-col' style={{textAlign: 'right'}}>
                Montant à créditer
              </div>

              <div style={{display: 'inline-block'}} className='col-sm-6 last-col' style={{textAlign: 'right'}}>
                <div styleName='amount'>{intl.formatNumber(amountToCredit, {format: 'MAD'})}</div>
              </div>

            </div>

            <div className='row' style={{ paddingTop: 15, paddingBottom: 0, }}>

              <div styleName='subsection12TitleText' className='col-sm-6 first-col' style={{textAlign: 'right'}}>
              </div>

              <div style={{display: 'inline-block'}} className='col-sm-6 last-col' style={{textAlign: 'right'}}>
                <div styleName='paddingTop10'>
                    <div styleName='stateActionButton '>
                      <a onClick={this.props.clearPayment} styleName='bbutton secondary'>{intl.formatMessage(messages['clear_payment'])}</a>
                    </div>
                </div>
              </div>

            </div>

            {amountToCredit > 0 ? <div styleName='subsection12TitleText' className='row'>

              <div className='col-sm-12 first-col last-col' style={{
                textAlign: 'right',
                marginLeft: -200,
                width: 495,
                marginTop: 15,
                fontFamily: `"HelveticaNeue", Helvetica, Arial, sans-serif`,
              }}>
                Cette opération entraînera la création d’un crédit supplémentaire d’un montant de {intl.formatNumber(amountToCredit, {format: 'MAD'})}.
                {/* Cette opération entraînera la création d’un crédit supplémentaire d’un montant de 10 000,00€ */}
              </div>

            </div> : null}

          </div>


        </div>

      </div>
    );
  }
}
