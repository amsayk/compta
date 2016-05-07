import React, {Component, PropTypes} from 'react';
import ReactDOM from 'react-dom';
import Relay from 'react-relay';

import { batchActions, } from 'redux-batched-actions';
import {changeWithKey as change,} from 'redux-form';

const CODES = [
  '5.1.4.1', // Banque
  '5.1.6.1.1', // Caisse centrale
  '5.1.4.3', // Trésorerie Générale
];

import filter from 'lodash.filter';

import styles from './PaymentForm.scss';

import CSSModules from 'react-css-modules';

import AccountListItem from './AccountListItem';

import Combobox from 'react-widgets/lib/Combobox';

import getFieldValue from '../../utils/getFieldValue';

import {
  intlShape,
} from 'react-intl';

import messages from './messages';

@CSSModules(styles, {allowMultiple: true})
export default class extends Component {
  static displayName = 'CreditToAccountDetails';

  static contextTypes = {
    intl: intlShape.isRequired,
    store: PropTypes.object.isRequired,
  };

  static propTypes = {
    company: PropTypes.object.isRequired,
    viewer: PropTypes.object.isRequired,
  };

  state = {
    open: false,
    showAccounts: false,
  };

  _onToggle = e => {
    this.setState({
      open: !this.state.open,
    });
  };

  componentDidMount() {
    setTimeout(() => {
      this.setState({
        showAccounts: true,
      })
    }, 200);
  }

  constructor(props) {
    super(props);

    const {} = this.props;

    this.state.value = undefined;
  }
  _onAddNew = () => {

  };

  render() {
    const {
      styles,
      company,
      formKey,
      depositsAccounts,
      fields: {creditToAccountCode, dirty, valid, invalid, pristine, submitting, values,},
    } = this.props;
    const {intl,} = this.context;
    const self = this;
    const creditToAccountCodeValue = getFieldValue(creditToAccountCode);

    return (
      <div styleName='customer-details-wrapper'>

        <div styleName='customer-details'>

          <div>

            <Combobox
              ref={'payeeCombo'}
              caseSensitive={false}
              filter={(a, b) => {
                // if(a.id === NEW_ITEM.id){
                //   return true;
                // }
                return a.name.indexOf(b) !== -1;
              }}
              open={this.state.open}
              onToggle={this._onToggle}
              className={`no-new ${styles['choose-customer-combo']}`}
              data={this.state.showAccounts ? filter(depositsAccounts, ({code}) => CODES.indexOf(code) !== -1) : []}
              value={creditToAccountCodeValue}
              textField={'name'}
              valueField='code'
              onSelect={item => {
                // if(item.id === NEW_ITEM.id){
                //   return false;
                // }
              }}
              onChange={(item) => {
                if(!item || typeof item === 'string'){
                  creditToAccountCode.onChange(undefined);
                  return;
                }

                // if(item.id === NEW_ITEM.id){
                //   return;
                // }

                if(typeof item !== 'string'){

                  const actions = [
                    change('paymentOfBills', formKey, 'creditToAccountCode', item['code']),
                  ];

                  this.context.store.dispatch(batchActions(actions));
                }
              }}
              busy={!this.state.showAccounts}
              placeholder={intl.formatMessage(messages.accountPlaceholder)}
              // disabled
              // groupBy={ person => person.name.length }
              // groupComponent={GroupByLength}
              itemComponent={(props) => <AccountListItem {...props} onAddNew={this._onAddNew}/>}
            />

          </div>

        </div>

      </div>
    );
  }
}


// const NEW_ITEM = {
//   id: 'NEW',
// };
