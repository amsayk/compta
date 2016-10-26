import React, {Component, PropTypes} from 'react';
import ReactDOM from 'react-dom';
import Relay from 'react-relay';

import { batchActions, } from 'redux-batched-actions';
import {changeWithKey as change,} from 'redux-form';

import styles from './InvoiceForm.scss';

import CSSModules from 'react-css-modules';

import Modal from 'react-bootstrap/lib/Modal';

import filter from 'lodash.filter';

import CustomerMiniForm from '../../Customers/CustomerForm/MiniForm';
import CustomerForm from '../../Customers/CustomerForm/CustomerForm';

import CustomerListItem from './CustomerListItem';

import Combobox from 'react-widgets/lib/Combobox';

import getFieldValue from '../../utils/getFieldValue';

import formatAddress from '../../../utils/formatAddress';

import {
  intlShape,
} from 'react-intl';

import messages from './messages';

@CSSModules(styles, {allowMultiple: true})
export default class extends React.Component {
  static displayName = 'CustomerDetails';

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
  };

  componentDidMount() {
    setTimeout(() => {
      this.setState({
        showCustomers: true,
      })
    }, 200);
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
              displayNameValue={this.state.displayNameValue || ''}
              company={this.props.company}
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
              displayNameValue={this.state.displayNameValue || ''}
              company={this.props.company}
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
      change('invoice', formKey, 'customer', {
        className: `People_${company.objectId}`,
        objectId: customer.id,
        id: customer.id,
      }),

      change('invoice', formKey, 'billingAddress', getBillingAddress(customer)),
    ]));
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
              data={this.state.showCustomers
                ? [NEW_ITEM].concat(
                    filter(
                    company.customers.edges.map(({node}) => node), item => item.active || (customerValue ? item.objectId === customerValue.objectId : false)))
                : []}
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
                    change('invoice', formKey, 'customer', {
                      className: `People_${company.objectId}`,
                      objectId: item['objectId'],
                      id: item['objectId'],
                    }),
                  ];

                  const billingAddress = getBillingAddress(item);
                  if(!!billingAddress){
                    actions.push(
                      change('invoice', formKey, 'billingAddress', billingAddress),
                    );
                  }

                  this.context.store.dispatch(batchActions(actions));
                }
              }}
              busy={!this.state.showCustomers}
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

function getBillingAddress({
  displayName,
  billing_streetAddress,
  billing_cityTown,
  billing_stateProvince,
  billing_postalCode,
  billing_country,
}){
  const addr = formatAddress({
    address: billing_streetAddress,
    city: billing_cityTown,
    // subdivision: billing_stateProvince,
    postalCode: billing_postalCode,
    // country: billing_country,
  });

  return addr.length === 0 ? undefined : [displayName, ...addr].join('\n');
}

const NEW_ITEM = {
  id: 'NEW',
};
