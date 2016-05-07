import React, {Component, PropTypes} from 'react';
import Relay from 'react-relay';

import styles from './PaymentForm.scss';

import classnames from 'classnames';

import stopEvent from '../../../utils/stopEvent';

import CSSModules from 'react-css-modules';

import Combobox from 'react-widgets/lib/Combobox';

import AccountListItem from './AccountListItem';

const CODES = [
  '5.1.4.1', // Banque
  '5.1.6.1.1', // Caisse centrale
  '5.1.4.3', // Trésorerie Générale
];

import filter from 'lodash.filter';

import parseNumber from '../../../utils/number/parse';

const MONEY_VALUE_REGEX = /^\d+((,|\.)\d{3})*((\.|,)\d*)?$/;

const PAYMENT_METHODS = intl => [
  { id: 1, name: intl.formatMessage(messages['PaymentMethod_Cash'])},
  { id: 2, name: intl.formatMessage(messages['PaymentMethod_Check'])},
  { id: 3, name: intl.formatMessage(messages['PaymentMethod_Creditcard']) },
];

const paymentMethodValueByIndex = {
  1  : 'Cash',
  2  : 'Check',
  3  : 'Creditcard',
};

const paymentMethodIndexByValue = {
  'Cash':       1,
  'Check':      2,
  'Creditcard': 3,
};

import getFieldValue from '../../utils/getFieldValue';

import {
  intlShape,
} from 'react-intl';

import messages from './messages';

@CSSModules(styles, {allowMultiple: true})
export default class extends Component {
  static displayName = 'PaymentDetails';

  static contextTypes = {
    intl: intlShape.isRequired,
  };

  static propTypes = {
    depositsAccounts: PropTypes.arrayOf(
      PropTypes.shape({
        code: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        _categoryCode: PropTypes.string.isRequired,
        _classCode: PropTypes.string.isRequired,
        _groupCode: PropTypes.string.isRequired,
      }).isRequired
    ).isRequired,
  };

  state = {
  };

  constructor(props, context){
    super(props, context);

    const { fields: {amountReceived,}, } = this.props;

    const value = getFieldValue(amountReceived);

    const {intl,} = this.context;

    this.state = {
      value: typeof value !== 'number' || !isFinite(value) || value === 0.0 ? undefined : intl.formatNumber(value, {format: 'MONEY', }),
    };
  }
  componentWillReceiveProps(nextProps){
    const { fields: {amountReceived,}, } = nextProps;

    const value = getFieldValue(amountReceived);

    const {intl,} = this.context;

    const fValue = typeof value !== 'number' || !isFinite(value) || value === 0.0 ? undefined : intl.formatNumber(value, {format: 'MONEY', });

    if(this.state.value !== fValue){
      this.setState({
        value: fValue,
      });
    }
  }

  componentDidMount() {
  }

  render() {
    const {
      styles,
      store,
      formKey,
      fields: {
        paymentMethod,
        paymentRef,
        depositToAccountCode,
        amountReceived,
        pristine,
      },
    } = this.props;
    const {intl,} = this.context;
    const paymentMethodValue = getFieldValue(paymentMethod);
    const depositToAccountCodeValue = getFieldValue(depositToAccountCode);
    const { value = intl.formatNumber(0.0, {format: 'MONEY', }), } = this.state;
    const self = this;
    return (
      <div styleName='payment-details-wrapper'>

        <div styleName='payment-details'>

          <form>

            <div className='row'>

              <div className='col-sm-2 first-col'>

                <fieldset className='form-group'>

                  <label style={{display: 'block'}} styleName='subsection12TitleText' htmlFor='paymentMethod'>Mode de paiement</label>

                  <div className='inline-block' id='paymentMethod'>

                    <Combobox
                      data={PAYMENT_METHODS(intl)}
                      value={paymentMethodIndexByValue[paymentMethodValue]}
                      onChange={value => {
                        if(!value || typeof value === 'string'){
                          paymentMethod.onChange(paymentMethod.initialValue);
                          return;
                        }

                        paymentMethod.onChange(
                          paymentMethodValueByIndex[value.id]
                        );
                      }}
                      textField='name'
                      valueField='id'
                      className={'no-new'}
                      // disabled
                      // groupBy={ person => person.name.length }
                      // groupComponent={GroupByLength}
                      // itemComponent={GroupByLength}
                    />

                  </div>

                </fieldset>

              </div>

              <div className='col-sm-2'>

                <fieldset className='form-group'>

                  <label style={{display: 'block'}} styleName='subsection12TitleText' htmlFor='paymentRef'>Nº de référence</label>

                  <input
                    value={getFieldValue(paymentRef, '')}
                    onChange={paymentRef.onChange}
                    style={{}}
                    className='form-control'
                    id='paymentRef'
                  />

                </fieldset>

              </div>

              <div className='col-sm-3'>

                <fieldset className='form-group'>

                  <label style={{display: 'block'}} styleName='subsection12TitleText' htmlFor='date'>Déposer sur</label>

                  <div className=''>

                    <Combobox
                      caseSensitive={false}
                      filter={(a, b) => {
                        //  if(a.id === NEW_ITEM.id){
                        //    return true;
                        //  }
                        return a.name.toLowerCase().indexOf((b||'').toLowerCase()) !== -1 || a.code.replace('.', '').indexOf(b) !== -1;
                      }}
                      // filter={'contains'}
                      onChange={value => {
                        if(!value || typeof value === 'string'){
                          depositToAccountCode.onChange(undefined);
                          return;
                        }
                        // if(item.id === NEW_ITEM.id){
                        //   return;
                        // }
                        depositToAccountCode.onChange(value.code);
                      }}
                      data={filter(this.props.depositsAccounts, ({code}) => CODES.indexOf(code) !== -1)}
                      placeholder={intl.formatMessage(messages['accountPlaceholder'])}
                      value={depositToAccountCodeValue}
                      textField='name'
                      valueField='code'
                      className={classnames('no-new', styles['depositToAccountCodeBox'], {
                        'has-error': !pristine && depositToAccountCode.invalid,
                      })}
                      // disabled
                      // groupBy={ person => person.name.length }
                      // groupComponent={GroupByLength}
                      itemComponent={props => <AccountListItem {...props} onAddNew={this._onAddNew}/>}
                    />

                  </div>

                </fieldset>

              </div>

              <div className='col-sm-3'></div>

              <div className='col-sm-2 last-col' style={{textAlign: 'right'}}>

                <fieldset className={classnames('form-group', {'has-danger': !pristine && amountReceived.invalid,})} style={{ float: 'right', }}>

                  <label style={{display: 'block'}} styleName='subsection12TitleText' htmlFor='amountReceived'>Montant reçu</label>

                  <input
                    style={{
                      // borderTopLeftRadius: 0,
                      // borderBottomLeftRadius: 0,
                      height: 37,
                      textAlign: 'right',
                      // marginLeft: -1,
                      // marginLeft: 5,
                      width: 150,
                    }}
                    value={value ? value : ''}
                    pattern={MONEY_VALUE_REGEX}
                    className={classnames('form-control', {'has-error': !pristine && amountReceived.invalid})}
                    onChange={e => {
                      this.setState({
                        value: e.target.value,
                      });
                    }}
                    onBlur={(e) => {
                      stopEvent(e);
                      const value = parseNumber(String(this.state.value || ''));
                      this.setState({
                        value: typeof value !== 'number' || !isFinite(value) || value === 0.0 ? undefined : intl.formatNumber(value, {format: 'MONEY', }),
                      }, () => {
                        const res = typeof value !== 'number' || !isFinite(value) || value === 0.0 ? undefined : value;
                        store.onAmountReceivedChanged(res ? res : 0.0);
                        amountReceived.onChange(res);
                      });

                    }}
                    // style={{ textAlign: 'right', width: 150, float: 'right', }}
                    // className='form-control'
                    id='amountReceived'
                  />

                  {/*<small className='text-muted' style={{ marginTop: 3, display: 'block', height: 15, }}>
                    {!pristine && amountReceived.error ? <div className='text-danger'>{intl.formatMessage(amountReceived.error, {value: 0.0})}</div> : ''}
                  </small>*/}

                </fieldset>

              </div>

            </div>

          </form>

        </div>

      </div>
    );
  }
}
