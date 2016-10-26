import React, {Component, PropTypes} from 'react';

import classnames from 'classnames';

import styles from './ExpenseForm.scss';

import CSSModules from 'react-css-modules';

import getFieldValue from '../../utils/getFieldValue';

import parseNumber from '../../../utils/number/parse';

import {
  intlShape,
} from 'react-intl';

import messages from './messages';

import stopEvent from '../../../utils/stopEvent';

const MAX = 100;

@CSSModules(styles, {allowMultiple: true})
export default class extends React.Component{
  static contextTypes = {
    intl: intlShape.isRequired,
    store: PropTypes.object.isRequired,
  };
  constructor(props, context){
    super(props, context);

    const { fields: {taxPercent,}, } = this.props;

    const value = getFieldValue(taxPercent);

    const {intl,} = this.context;

    this.state = {
      value: typeof value !== 'number' || !isFinite(value) ? undefined : intl.formatNumber(value / 100, {format: 'PERCENT', }),
    };
  }
  componentWillReceiveProps(nextProps){
    const { fields: {taxPercent,}, } = nextProps;

    const value = getFieldValue(taxPercent);

    const {intl,} = this.context;

    const fValue = typeof value !== 'number' || !isFinite(value) ? undefined : intl.formatNumber(value / 100, {format: 'PERCENT', });

    if(this.state.value !== fValue){
      this.setState({
        value: fValue,
      });
    }
  }

  // shouldComponentUpdate(nextProps, nextState){
  //   const { fields: {taxPercent,}, } = nextProps;
  //
  //   const value = getFieldValue(taxPercent);
  //
  //   const {intl,} = this.context;
  //
  //   const fValue = typeof value !== 'number' || !isFinite(value) ? undefined : intl.formatNumber(value / 100, {format: 'PERCENT', });
  //
  //   return nextState.value !== this.state.value || nextState.value !== fValue;
  // }
  render() {
    const {intl,} = this.context;
    const {store, fields: {discountType, discountValue, taxPercent, submitting, pristine, },} = this.props;
    const {value} = this.state;
    const taxableSubtotal = function(){
      if(discountValue.invalid){
        return store.subtotal;
      }

      const type = getFieldValue(discountType);
      const value = getFieldValue(discountValue);

      return store.getTaxableSubtotal({type, value});
    }();
    return (
      <div styleName='tax-form-wrapper'>

        <div styleName='tax-form'>

          <div styleName='floatRight'>

            <div styleName={'width_x'} className='row'>

              <div className='col-sm-8' style={{textAlign: 'right', }}>

                <div style={{}}>
                  <div className='col-sm-12' style={{textAlign: 'right', paddingRight: 0, paddingLeft: 0,}}>
                    <span styleName='subsection12TitleText'>{intl.formatMessage(messages['TaxableSubtotal'])}</span>{' '}({intl.formatNumber(taxableSubtotal, {format: 'MAD'})})
                  </div>
                </div>

                <div style={{paddingLeft: 68,}}>
                  <input
                    type='text'
                    style={{width: 200, textAlign: 'right',}}
                    className={classnames('form-control', {'has-error': !pristine && taxPercent.invalid,})}
                    placeholder={intl.formatMessage(messages['taxRate'])}
                    value={value ? value : ''}
                    onChange={e => {
                      this.setState({
                        value: e.target.value,
                      });
                    }}
                    onBlur={(e) => {
                      stopEvent(e);
                      const value = parseNumber(String(this.state.value || '').replace(/%/, ''));
                      this.setState({
                        value: typeof value !== 'number' || !isFinite(value) ? undefined : intl.formatNumber(value / 100, {format: 'PERCENT', }),
                      }, () => {
                        this._onTaxChange(typeof value !== 'number' || !isFinite(value) ? undefined : value);
                      });
                    }}
                  />
                </div>

                <small className='text-muted' style={{ marginTop: 3, display: 'block', height: 15, }}>
                  {!pristine && taxPercent.error ? <div className='text-danger'>{intl.formatMessage(taxPercent.error)}</div> : ''}
                </small>

              </div>

              <div style={{ display: 'inline-block', marginTop: 30, textAlign: 'right', }} className='col-sm-4 last-col'>
                <div styleName='amount'>{intl.formatNumber(getTaxAmount(store, {discountType, discountValue, taxPercent}), {format: 'MAD'})}</div>
              </div>

            </div>

          </div>

        </div>

      </div>
    );
  }

  _onTaxChange = (value) => {
    this.props.fields.taxPercent.onChange(value);
  };
}

function getTaxAmount(store, {discountType, discountValue, taxPercent}){
  const _discountType = getFieldValue(discountType);
  const _discountValue = getFieldValue(discountValue);
  const _taxPercent = getFieldValue(taxPercent);

  if(taxPercent.invalid){
    return 0;
  }

  if(discountValue.invalid){
    return store.subtotal * ((_taxPercent || 0.0) / 100);
  }

  return store.getTaxableSubtotal(
    {type: _discountType, value: _discountValue}) * ((_taxPercent || 0.0) / 100);
}
