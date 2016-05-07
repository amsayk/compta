import React, {Component, PropTypes} from 'react';
import ReactDOM from 'react-dom';
import Relay from 'react-relay';

import { batchActions, } from 'redux-batched-actions';
import {changeWithKey as change,} from 'redux-form';

import styles from './ExpenseForm.scss';

import CSSModules from 'react-css-modules';

import VendorMiniForm from '../../Vendors/VendorForm/MiniForm';
import VendorForm from '../../Vendors/VendorForm/VendorForm';
import CustomerForm from '../../Customers/CustomerForm/CustomerForm';
import EmployeeForm from '../../Employees/EmployeeForm/EmployeeForm';

import PayeeListItem from './PayeeListItem';

import Combobox from 'react-widgets/lib/Combobox';

import getFieldValue from '../../utils/getFieldValue';

import formatAddress from '../../../utils/formatAddress';

import {
  intlShape,
} from 'react-intl';

import messages from './messages';

@CSSModules(styles, {allowMultiple: true})
export default class extends Component {
  static displayName = 'PayeeDetails';

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
    showPayees: false,
    modalOpen: false,
  };

  componentDidMount() {
    setTimeout(() => {
      this.setState({
        showPayees: true,
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
      const ref = self.refs.payeeCombo && self.refs.payeeCombo.refs.inner && self.refs.payeeCombo.refs.inner.refs.input
        ? ReactDOM.findDOMNode(self.refs.payeeCombo.refs.inner.refs.input)
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
  _showVendorForm = (displayNameValue, type) => {
    this.setState({
      open: false,
      modalOpen: true,
      modalType: 'full-' + type,
      displayNameValue,
    })
  };
  _renderVendorForm(){
    if(this.state.modalOpen){
      switch (this.state.modalType) {
        case 'mini':
          return (
            <VendorMiniForm
              viewer={this.props.viewer}
              displayNameValue={this.state.displayNameValue || ''}
              company={this.props.company}
              formKey={'NEW'}
              onShowMoreDetails={this._showVendorForm}
              onCancel={this._close}
              container={this}
              onDone={this._onDone}
            />
          );

        case 'full-Vendor':
          return (
            <VendorForm
              viewer={this.props.viewer}
              displayNameValue={this.state.displayNameValue || ''}
              company={this.props.company}
              formKey={'NEW'}
              onCancel={this._close}
              onDone={this._onDone}
            />
          );

        case 'full-Customer':
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

        case 'full-Employee':
          return (
            <EmployeeForm
              viewer={this.props.viewer}
              displayNameValue={this.state.displayNameValue || ''}
              company={this.props.company}
              formKey={'NEW'}
              onCancel={this._close}
              onDone={this._onDone}
            />
          );
        default: throw 'PayeeDetails.WrongModal';
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
  _onDone = ({ type, vendor, }) =>{
    const {
      company,
      formKey,
    } = this.props;

    this.context.store.dispatch(batchActions([
      change('expense', formKey, 'payee', {
        type,
        className: function(){
          // type === 'Vendor' || type === 2 ? `Vendor_${company.objectId}` : `Customer_${company.objectId}`
          switch(type){
            case 'Customer':
            case 1: return `Customer_${company.objectId}`;

            case 'Vendor':
            case 2: return `Vendor_${company.objectId}`;

            case 'Employee':
            case 3: return `Employee_${company.objectId}`;

            default: throw 'Invalid payee type';
          }
        }(),
        objectId: vendor.id,
        id: vendor.id,
      }),

      change('expense', formKey, 'mailingAddress', getMailingAddress(vendor) || getEmployeeAddress(vendor)),
    ]));
  };
  focus = () => {
    this.refs.payeeCombo && this.refs.payeeCombo.refs.inner
      ? this.refs.payeeCombo.refs.inner.focus()
      : undefined;
  };
  render() {
    const {
      styles,
      company,
      formKey,
      fields: {payee, dirty, valid, invalid, pristine, submitting, values,},
    } = this.props;
    const {intl,} = this.context;
    const self = this;
    const payeeValue = !this.state.showPayees ? null : getFieldValue(payee);

    const data = this.state.showPayees
      ? [NEW_ITEM].concat(company.people.edges.map(({node}) => node))
      : [];

    return (
      <div styleName='payee-details-wrapper'>

        <div styleName='payee-details'>

          <div>

            <Combobox
              ref={'payeeCombo'}
              caseSensitive={false}
              filter={(a, b) => {
                if(a.id === NEW_ITEM.id){
                  return true;
                }
                return a.displayName.indexOf(b) !== -1;
              }}
              open={this.state.open}
              onToggle={this._onToggle}
              className={styles['choose-payee-combo']}
              data={data}
              value={payeeValue && payeeValue.objectId}
              textField={'displayName'}
              valueField='objectId'
              onSelect={item => {
                if(item.id === NEW_ITEM.id){
                  return false;
                }
              }}
              onChange={(item) => {
                if(!item || typeof item === 'string'){
                  payee.onChange(undefined);
                  return;
                }

                if(item.id === NEW_ITEM.id){
                  return;
                }

                if(typeof item !== 'string'){

                  const actions = [

                    change('expense', formKey, 'payee', {
                      type: item['type'],
                      className: `${TYPE_TO_STRING(item['type'])}_${company.objectId}`,
                      objectId: item['objectId'],
                      id: item['objectId'],
                    }),

                  ];

                  const mailingAddress = getMailingAddress(item);
                  if(!!mailingAddress){
                    actions.push(
                      change('expense', formKey, 'mailingAddress', mailingAddress),
                    );
                  }

                  this.context.store.dispatch(batchActions(actions));

                  switch (item['type']) {
                    case 2:
                    case 'Vendor':

                      setImmediate(() => {
                        this.props.onPaymentVendorSelected({ id: item['objectId'], });
                      });

                    default:

                  }

                }
              }}
              busy={!this.state.showPayees}
              placeholder={intl.formatMessage(messages.payeePlaceholder)}
              // disabled
              // groupBy={ person => person.name.length }
              // groupComponent={GroupByLength}
              itemComponent={(props) => <PayeeListItem {...props} onAddNew={this._onAddNew}/>}
            />

          </div>

        </div>

        {this._renderVendorForm()}

      </div>
    );
  }
}

function getMailingAddress({
  displayName,
  mailing_streetAddress,
  mailing_cityTown,
  mailing_stateProvince,
  mailing_postalCode,
  mailing_country,
}){
  const addr = formatAddress({
    address: mailing_streetAddress,
    city: mailing_cityTown,
    // subdivision: mailing_stateProvince,
    postalCode: mailing_postalCode,
    // country: mailing_country,
  });

  return addr.length === 0 ? undefined : [displayName, ...addr].join('\n');
}

function getEmployeeAddress({
  displayName,
  address_streetAddress,
  address_cityTown,
  address_stateProvince,
  address_postalCode,
  address_country,
}){
  const addr = formatAddress({
    address: address_streetAddress,
    city: address_cityTown,
    // subdivision: address_stateProvince,
    postalCode: address_postalCode,
    // country: address_country,
  });

  return addr.length === 0 ? undefined : [displayName, ...addr].join('\n');
}

function TYPE_TO_STRING(type){
  switch(type){
    case 'Customer':
    case 1: return `Customer`;

    case 'Vendor':
    case 2: return `Vendor`;

    case 'Employee':
    case 3: return `Employee`;

    default: throw 'TYPE_TO_STRING: Invalid payee type';
  }
}

const NEW_ITEM = {
  id: 'NEW',
};
