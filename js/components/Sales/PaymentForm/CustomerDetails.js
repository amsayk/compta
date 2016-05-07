import React, {Component, PropTypes} from 'react';
import ReactDOM from 'react-dom';
import Relay from 'react-relay';

import { batchActions, } from 'redux-batched-actions';
import {changeWithKey as change,} from 'redux-form';

import styles from './PaymentForm.scss';

import Revision from '../../../utils/revision';

import CSSModules from 'react-css-modules';

import CustomerMiniForm from '../../Customers/CustomerForm/MiniForm';
import CustomerForm from '../../Customers/CustomerForm/CustomerForm';

import CustomerListItem from './CustomerListItem';

import Combobox from 'react-widgets/lib/Combobox';

import getFieldValue from '../../utils/getFieldValue';

import {
  intlShape,
} from 'react-intl';

import messages from './messages';

@CSSModules(styles, {allowMultiple: true})
export default class extends Component {
  static displayName = 'PaymentCustomerDetails';

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
    showCustomers: false,
    modalOpen: false,
    busy: false,
  };

  componentDidMount() {
    setTimeout(() => {
      this.setState({
        showCustomers: true,
      })
    }, 200);
  }

  loadInvoicesOnReadyStateChange = (readyState) => {
    if(readyState){
      const { done, } = readyState;
      this.setState({
        busy: !done,
      });
    }else{
      this.setState({
        busy: false,
      });
    }
  }

  constructor(props) {
    super(props);

    const {} = this.props;

    this.state.value = undefined;
  }
  _onToggle = e => {
    this.setState({
      open: !this.state.open,

      modalOpen: false,
      modalType: undefined,
      displayNameValue: undefined,
    });
  };
  _onAddNew = () => {
    const displayNameValue = (function getDisplayName(self){
      const ref = self.refs.customerCombo && self.refs.customerCombo.refs.inner && self.refs.customerCombo.refs.inner.refs.input
        ? ReactDOM.findDOMNode(self.refs.customerCombo.refs.inner.refs.input)
        : undefined;
      return ref ? ref.value : '';
    })(this);

    this.setState({
      open: false,
    }, () => {
      this.setState({
        modalOpen: true,
        modalType: 'mini',
        displayNameValue,
      });
    })
  };
  _showCustomerForm = (displayNameValue) => {
    this.setState({
      open: false,
      modalOpen: true,
      modalType: 'full',
      displayNameValue,
    })
  };
  _renderCustomerForm(){
    if(this.state.modalOpen){
      switch (this.state.modalType) {
        case 'mini':
          return (
            <CustomerMiniForm
              viewer={this.props.viewer}
              company={this.props.company}
              displayNameValue={this.state.displayNameValue}
              formKey={'NEW'}
              onShowMoreDetails={this._showCustomerForm}
              onCancel={this._close}
              container={this}
              onDone={this._onDone}
            />
          );
        case 'full':
          return (
            <CustomerForm
              viewer={this.props.viewer}
              company={this.props.company}
              displayNameValue={this.state.displayNameValue}
              formKey={'NEW'}
              onCancel={this._close}
              onDone={this._onDone}
            />
          );
        default: throw 'CustomerDetails.WrongModal';
      }
    }
  }
  _close = () => {
    this.setState({
      open: false,
      modalOpen: false,
      modalType: undefined,
      displayNameValue: undefined,
    })
  };
  _onDone = ({customer}) =>{
    const {
      company,
      formKey,
    } = this.props;

    this.context.store.dispatch(batchActions([
      change('paymentOfInvoices', formKey, 'customer', {
        className: `Customer_${company.objectId}`,
        objectId: customer.id,
        id: customer.id,
      }),

    ]));

    this.props.onPaymentCustomerSelected(
      {id: customer.id}, this.loadInvoicesOnReadyStateChange,
    );
  };

  focus = () => {
    this.refs.customerCombo && this.refs.customerCombo.refs.inner
      ? this.refs.customerCombo.refs.inner.focus()
      : undefined;
  };

  render() {
    const {
      styles,
      company,
      formKey,
      fields: {customer, dirty, valid, invalid, pristine, submitting, values,},
    } = this.props;
    const {intl,} = this.context;
    const self = this;
    const customerValue = getFieldValue(customer);

    return (
      <div styleName='customer-details-wrapper'>

        <div styleName='customer-details'>

          <div>

            <Combobox
              ref={'customerCombo'}
              caseSensitive={false}
              filter={(a, b) => {
                if(a.id === NEW_ITEM.id){
                  return true;
                }
                return a.displayName.indexOf(b) !== -1;
              }}
              open={this.state.open}
              onToggle={this._onToggle}
              className={styles['choose-customer-combo']}
              data={this.state.showCustomers ? [NEW_ITEM].concat(company.customers.edges.map(({node}) => node)) : []}
              value={customerValue && customerValue.objectId}
              textField={'displayName'}
              valueField='objectId'
              onSelect={item => {
                if(item.id === NEW_ITEM.id){
                  return false;
                }
              }}
              onChange={(item) => {
                if(!item || typeof item === 'string'){
                  customer.onChange(undefined);
                  return;
                }

                if(item.id === NEW_ITEM.id){
                  return;
                }

                if(typeof item !== 'string'){

                  const actions = [
                    change('paymentOfInvoices', formKey, 'customer', {
                      className: `Customer_${company.objectId}`,
                      objectId: item['objectId'],
                      id: item['objectId'],
                    }),
                  ];

                  this.context.store.dispatch(batchActions(actions));

                  setImmediate(() => {
                    this.props.onPaymentCustomerSelected(
                      {id: item.objectId}, this.loadInvoicesOnReadyStateChange,
                    );
                  })
                }
              }}
              busy={!this.state.showCustomers || this.state.busy}
              placeholder={intl.formatMessage(messages.customerPlaceholder)}
              // disabled
              // groupBy={ person => person.name.length }
              // groupComponent={GroupByLength}
              itemComponent={(props) => <CustomerListItem {...props} onAddNew={this._onAddNew}/>}
            />

          </div>

        </div>

        {this._renderCustomerForm()}

      </div>
    );
  }
}

const NEW_ITEM = {
  id: 'NEW',
};
