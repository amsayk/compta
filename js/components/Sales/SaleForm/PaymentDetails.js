import React, {Component, PropTypes} from 'react';
import Relay from 'react-relay';

import styles from './SaleForm.scss';

import classnames from 'classnames';

import CSSModules from 'react-css-modules';

const CODES = [
  '5.1.4.1', // Banque
  '5.1.6.1.1', // Caisse centrale
  '5.1.4.3', // Trésorerie Générale
];

import filter from 'lodash.filter';

import Combobox from 'react-widgets/lib/Combobox';

import AccountListItem from './AccountListItem';

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
export default class extends React.Component {

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

  componentDidMount() {
  }

  render() {
    const {styles, formKey, fields: { paymentMethod, paymentRef, depositToAccountCode, pristine, }} = this.props;
    const {intl,} = this.context;
    const paymentMethodValue = getFieldValue(paymentMethod);
    const depositToAccountCodeValue = getFieldValue(depositToAccountCode);
    const self = this;
    return (
      <div styleName='payment-details-wrapper'>

        <div styleName='payment-details'>

          <div>

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

                  <input value={getFieldValue(paymentRef, '')} onChange={paymentRef.onChange} style={{}} className='form-control' id='paymentRef'/>

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
                      //filter={'contains'}
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

              <div className='col-sm-5'></div>

            </div>

          </div>

        </div>

      </div>
    );
  }
}
