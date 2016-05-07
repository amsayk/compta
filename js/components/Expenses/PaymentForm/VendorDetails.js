import React, {Component, PropTypes} from 'react';
import ReactDOM from 'react-dom';
import Relay from 'react-relay';

import { batchActions, } from 'redux-batched-actions';
import {changeWithKey as change,} from 'redux-form';

import styles from './PaymentForm.scss';

import Revision from '../../../utils/revision';

import CSSModules from 'react-css-modules';

import VendorMiniForm from '../../Vendors/VendorForm/MiniForm';
import VendorForm from '../../Vendors/VendorForm/VendorForm';

import VendorListItem from './VendorListItem';

import Combobox from 'react-widgets/lib/Combobox';

import getFieldValue from '../../utils/getFieldValue';

import {
  intlShape,
} from 'react-intl';

import formatAddress from '../../../utils/formatAddress';

import messages from './messages';

@CSSModules(styles, {allowMultiple: true})
export default class extends Component {
  static displayName = 'PaymentVendorDetails';

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
    showVendors: false,
    modalOpen: false,
    busy: false,
  };

  componentDidMount() {
    setTimeout(() => {
      this.setState({
        showVendors: true,
      })
    }, 200);
  }

  loadBillsOnReadyStateChange = (readyState) => {
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
  _showVendorForm = (displayNameValue) => {
    this.setState({
      open: false,
      modalOpen: true,
      modalType: 'full',
      displayNameValue,
    })
  };
  _renderVendorForm(){
    if(this.state.modalOpen){
      switch (this.state.modalType) {
        case 'mini':
          return (
            <VendorMiniForm
              _type={'Vendor'}
              viewer={this.props.viewer}
              company={this.props.company}
              displayNameValue={this.state.displayNameValue}
              formKey={'NEW'}
              onShowMoreDetails={this._showVendorForm}
              onCancel={this._close}
              container={this}
              onDone={this._onDone}
            />
          );
        case 'full':
          return (
            <VendorForm
              viewer={this.props.viewer}
              company={this.props.company}
              displayNameValue={this.state.displayNameValue}
              formKey={'NEW'}
              onCancel={this._close}
              onDone={this._onDone}
            />
          );
        default: throw 'VendorDetails.WrongModal';
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
  _onDone = ({payee}) =>{
    const {
      company,
      formKey,
    } = this.props;

    this.context.store.dispatch(batchActions([
      change('paymentOfBills', formKey, 'payee', {
        className: `Vendor_${company.objectId}`,
        objectId: payee.id,
        id: payee.id,
      }),

    ]));

    this.props.onPaymentVendorSelected(
      {id: payee.id}, this.loadBillsOnReadyStateChange,
    );
  };

  focus = () => {
    // this.refs.customerCombo && this.refs.customerCombo.refs.inner
    //   ? this.refs.customerCombo.refs.inner.focus()
    //   : undefined;
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
    const payeeValue = !this.state.showVendors ? null : getFieldValue(payee);

    const data = this.state.showVendors
      ? [NEW_ITEM].concat(company.vendors.edges.map(({node}) => node))
      : [];

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
                    change('paymentOfBills', formKey, 'payee', {
                      className: `Vendor_${company.objectId}`,
                      objectId: item['objectId'],
                      id: item['objectId'],
                    }),
                  ];

                  const mailingAddress = getMailingAddress(item);
                  if(!!mailingAddress){
                    actions.push(
                      change('paymentOfBills', formKey, 'mailingAddress', mailingAddress),
                    );
                  }

                  this.context.store.dispatch(batchActions(actions));

                  setImmediate(() => {
                    this.props.onPaymentVendorSelected(
                      {id: item.objectId}, this.loadBillsOnReadyStateChange,
                    );
                  });
                }
              }}
              busy={!this.state.showVendors || this.state.busy}
              placeholder={intl.formatMessage(messages.customerPlaceholder)}
              // disabled
              // groupBy={ person => person.name.length }
              // groupComponent={GroupByLength}
              itemComponent={(props) => <VendorListItem {...props} onAddNew={this._onAddNew}/>}
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

const NEW_ITEM = {
  id: 'NEW',
};
