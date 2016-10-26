import React, {Component, PropTypes} from 'react';
import classnames from 'classnames';

import styles from './ExpenseForm.scss';

import CSSModules from 'react-css-modules';

import stopEvent from '../../../utils/stopEvent';

const MONEY_VALUE_REGEX = /^\d+((,|\.)\d{3})*((\.|,)\d*)?$/;

import parseNumber from '../../../utils/number/parse';

import {
  intlShape,
} from 'react-intl';

import messages from './messages';

import getFieldValue from '../../utils/getFieldValue';

import Combobox from 'react-widgets/lib/Combobox';

const discountTypes = [ 1, 2, ];
const discountTypesByIndex = { 1: 'Value', 2: 'Percent', };
const discountTypesById = { 'Value': 1, 'Percent': 2, };

@CSSModules(styles, {allowMultiple: true})
export default class extends React.Component{
  static contextTypes = {
    intl: intlShape.isRequired,
  };
  constructor(props, context){
    super(props, context);

    const { fields: {discountType, discountValue,}, } = this.props;

    const type = getFieldValue(discountType);
    const value = getFieldValue(discountValue);

    const {intl,} = this.context;

    this.state = {
      type,
      value: typeof value !== 'number' || !isFinite(value) ? undefined : intl.formatNumber(type === discountTypesById['Percent'] ? value / 100 : value, {format: type === discountTypesById['Percent'] ? 'PERCENT' : 'MONEY', }),
    };
  }
  componentWillReceiveProps(nextProps){
    const { fields: {discountType, discountValue,}, } = nextProps;

    const type = getFieldValue(discountType);
    const value = getFieldValue(discountValue);

    const {intl,} = this.context;

    const fValue = typeof value !== 'number' || !isFinite(value) ? undefined : intl.formatNumber(type === discountTypesById['Percent'] ? value / 100 : value, {format: type === discountTypesById['Percent'] ? 'PERCENT' : 'MONEY', });

    if(this.state.value !== fValue || this.state.type !== type){
      this.setState({
        type,
        value: fValue,
      });
    }
  }

  // shouldComponentUpdate(nextProps, nextState){
  //   const { fields: {discountType, discountValue,}, } = nextProps;
  //
  //   const type = getFieldValue(discountType);
  //   const value = getFieldValue(discountValue);
  //
  //   const {intl,} = this.context;
  //
  //   const fValue = typeof value !== 'number' || !isFinite(value) ? undefined : intl.formatNumber(type === discountTypesById['Percent'] ? value / 100 : value, {format: type === discountTypesById['Percent'] ? 'PERCENT' : 'MONEY', });
  //
  //   return nextState.value !== this.state.value || nextState.type !== this.state.type ||
  //         type !== this.state.type || nextState.value !== fValue;
  // }
  render() {
    const {intl,} = this.context;
    const {store, fields: { discountType, discountValue, submitting, pristine,},} = this.props;

    const { value, type, } = this.state;

    return (
      <div styleName='discount-form-wrapper'>

        <div styleName='discount-form'>

          <div styleName='floatRight'>

            <div styleName={'width_x'} className='row'>

              <div className='col-sm-8' style={{textAlign: 'right'}}>

                <div className="input-group">

                  <span className="input-group-addon">

                    <Combobox
                      data={discountTypes.map((f, index) => ({
                        id: f,
                        name: intl.formatMessage(messages[`discountType_${f}`]),
                      }))}
                      value={type}
                      onChange={value => {
                        if(!value || typeof value === 'string'){
                          this._onDiscountTypeChange(discountType.initialValue);
                          return;
                        }
                        this._onDiscountTypeChange(value.id);
                      }}
                      textField='name'
                      valueField='id'
                      // disabled={submitting}
                      className={classnames('no-new')}
                      // groupBy={ person => person.name.length }
                      // groupComponent={GroupByLength}
                      // itemComponent={GroupByLength}
                    />

                  </span>

                  <input
                    style={{
                      // borderTopLeftRadius: 0,
                      // borderBottomLeftRadius: 0,
                      height: 37,
                      textAlign: 'right',
                      // marginLeft: -1,
                      marginLeft: 5,
                      width: 75,
                    }}
                    pattern={MONEY_VALUE_REGEX}
                    // disabled={submitting}
                    type='text'
                    className={classnames('form-control', {'has-error': !pristine && discountValue.invalid})}
                    // placeholder={intl.formatMessage(messages['discountRate'])}
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
                        value: typeof value !== 'number' || !isFinite(value) ? undefined : intl.formatNumber(type === discountTypesById['Percent'] ? value / 100 : value, {format: type === discountTypesById['Percent'] ? 'PERCENT' : 'MONEY', }),
                      }, () => {
                        this._onDiscountChange(typeof value !== 'number' || !isFinite(value) ? undefined : value);
                      });

                    }}
                  />

                </div>

                <small className="text-muted" style={{ marginTop: 3, display: 'block', height: 15, }}>
                  {!pristine && discountValue.error ? <div className='text-danger'>{intl.formatMessage(discountValue.error)}</div> : ''}
                </small>

              </div>

              <div style={{display: 'inline-block', marginTop: 10, textAlign: 'right',}} className='col-sm-4 last-col'>
                <div styleName='amount'>({intl.formatNumber(getTotalDiscount(store, {discountType, discountValue}, type, parseNumber(String(value || '').replace(/%/, ''))), {format: 'MAD'})})</div>
              </div>

            </div>

          </div>

        </div>

      </div>
    );
  }

  _onDiscountTypeChange = (value) => {
    this.props.fields.discountType.onChange(value);
  };

  _onDiscountChange = (value) => {
    this.props.fields.discountValue.onChange(value);
  };
}

function getTotalDiscount(store, {discountType, discountValue}, type, value){
  if(discountValue.invalid){
    return 0;
  }

  switch (type) {
    case 1: return value || 0.0;
    case 2: return store.subtotal * ((value||0.0)/100);
  }
}
