import React, {Component, PropTypes} from 'react';
import Relay from 'react-relay';

import { EXPENSES_ACCOUNTS_CATEGORIES, DEPOSIT_ACCOUNTS_CATEGORIES, } from '../../../data/constants';

import LazyCache from 'react-lazy-cache';

// import Loading from '../Loading/Loading';

import moment from 'moment';

import RelayRoute from '../../routes/PaymentOfBillsFormPaymentOfBillsItemRoute';

// import PaymentForm  from './PaymentForm/PaymentForm';
// import BillForm  from './BillForm/BillForm';

import LoadingActions from '../Loading/actions';

let BillForm = null;
let PaymentForm = null;

function loadComponent(type, cb) {
  LoadingActions.show();

  switch (type){

    case 'Payment':

      require.ensure([], function (require) {
        LoadingActions.hide();
        PaymentForm = require('./PaymentForm/PaymentForm').default;
        cb();
      }, 'PaymentOfBillsForm');

      break;

    case 'Bill':

      require.ensure([], function (require) {
        LoadingActions.hide();
        BillForm = require('./BillForm/BillForm').default;
        cb();
      }, 'BillForm');

      break;
  }
}

import Revision from '../../utils/revision';

import stopEvent from '../../utils/stopEvent';

import { editStart as editStartPayment, } from '../../redux/modules/v2/paymentsOfBills';
import { editStart as editStartBill, } from '../../redux/modules/v2/bills';

import requiredPropType from 'react-prop-types/lib/all';

class FromPaymentItemPaymentForm extends React.Component {
  static contextTypes = {
    store: PropTypes.object.isRequired,
  };
  static propTypes = {
    viewer: PropTypes.object.isRequired,
    company: requiredPropType(
      React.PropTypes.object,
      function(props, propName, componentName) {
        if (props.topLoading === false && !props.company) {
          return new Error('company required!');
        }
      }
    ),
    payment: requiredPropType(
      React.PropTypes.object,
      function(props, propName, componentName) {
        if (props.topLoading === false && !props.payment) {
          return new Error('payment required!');
        }
      }
    ),
    topLoading: PropTypes.bool.isRequired,
  };
  state = {
    obj: undefined,
    modalOpen: false,
  };
  _fetchingVendorBills = false;
  // shouldComponentUpdate(){
  //   const { stale, } = this.props;
  //   return !stale;
  // }
  constructor(props, context){
    super(props, context);

    const obj = this.props.payment
      ? decoratePayment(this.props.payment)
      : undefined;

    if(!this.props.topLoading){

      setImmediate(() => {
        this._onPaymentVendorSelected(obj.payee, ({ aborted, done, error, }) => {
          if(done){
            this._fetchingVendorBills = false;
          }

          if((done && !aborted) || error){

            this.context.store.dispatch(
              editStartPayment(
                obj.id,
                obj.itemsConnection.edges.map(({node}) => decoratePaymentItem(node)),
                {id: obj.id, company: this.props.company,})
            );

            requestAnimationFrame(() => {
              loadComponent('Payment', () => {
                this.setState({
                  modalOpen: true,
                  obj,
                });
              });
            });

          }

        });
      });

    }

    this.state.topLoading = this.props.topLoading;
  }
  componentWillReceiveProps(nextProps){
    if(this.state.topLoading !== nextProps.topLoading){
      this.state.topLoading = nextProps.topLoading;
      this.state.obj = undefined;
      this.state.modalOpen = false;

      const obj = nextProps.payment
        ? decoratePayment(nextProps.payment)
        : undefined;

      if(!nextProps.topLoading){

        setImmediate(() => {

          if(this._fetchingVendorBills){
            return;
          }

          this._onPaymentVendorSelected(obj.payee, ({ aborted, done, error, }) => {
            if(done){
              this._fetchingVendorBills = false;
            }

            if((done && !aborted) || error){

              this.context.store.dispatch(
                editStartPayment(
                  obj.id,
                  obj.itemsConnection.edges.map(({node}) => decoratePaymentItem(node)),
                  {id: obj.id, company: nextProps.company,})
              );

              requestAnimationFrame(() => {
                loadComponent('Payment', () => {
                  this.setState({
                    modalOpen: true,
                    obj,
                    topLoading: nextProps.topLoading,
                  });
                });
              });

            }

          });
        });

      }//else{
      //   this.setState({
      //     modalOpen: false,
      //     obj: undefined,
      //     topLoading: nextProps.topLoading,
      //   });
      // }
    }

  }
  _onPaymentVendorSelected = (payee, onReadyStateChange) => {
    if(this._fetchingVendorBills){
      return;
    }

    this._fetchingVendorBills = true;
    this.props.relay.setVariables({
      paymentVendorId: payee.objectId,
      rev: Revision.incrementAndGet(),
    }, onReadyStateChange);
  };
  _close = (btn, e) => {
    stopEvent(e);

    this.setState({
      modalOpen: false,
      obj: undefined,
    }, () => this.props.onClose());
  };
  _onBill = (obj) => {
    requestAnimationFrame(() => {

      this.setState({
        modalOpen: false,
        obj: undefined,
      }, () => {
        obj = decorateBill(obj);

        this.context.store.dispatch(
          editStartBill(
            obj.id,
            obj.itemsConnection.edges.map(({node}) => node),
            {id: obj.id, company: this.props.company,})
        );

        setTimeout(() => {
          loadComponent('Bill', () => {
            this.setState({
              modalOpen: true,
              obj,
            });
          });
        }, 150);
      });
    });
  };
  _onReceivePayment = (bill) => {
    const { payee, } = bill;

    setImmediate(() => {
      this._onPaymentVendorSelected(payee, ({ aborted, done, }) => {
        if(done){
          this._fetchingVendorBills = false;
        }

        if((done && !aborted) || error){

          this.context.store.dispatch(
            editStartPayment(
              'NEW',
              [],
              {id: 'NEW', company: this.props.company,})
          );

          requestAnimationFrame(() => {
            loadComponent('Payment', () => {
              this.setState({
                modalOpen: true,
                obj: undefined,
                bill,
              });
            })
          });

        }

      });
    });
  };
  render(){
    const { obj, bill, modalOpen, } = this.state;

    if(modalOpen){

      switch (obj ? obj.type : 'Payment') {
        case 'Payment':

          return (
            <PaymentForm
              bill={bill}
              payment={obj}
              company={this.props.company}
              viewer={this.props.viewer}
              formKey={obj ? obj.id : 'NEW'}
              vendorOpenBills={this.props.vendorOpenBills}
              expensesAccounts={this.props.expensesAccounts}
              depositsAccounts={this.props.depositsAccounts}
              onCancel={this._close}
              onPaymentVendorSelected={this._onPaymentVendorSelected}
              onBill={this._onBill}
            />
          );

        case 'Bill':

          return (
            <BillForm
              bill={obj}
              company={this.props.company}
              viewer={this.props.viewer}
              expensesAccounts={this.props.expensesAccounts}
              formKey={obj.id}
              onCancel={this._close}
              onReceivePayment={this._onReceivePayment}
            />
          );
      }
    }

    // return (
    //   <div style={{}}>
    //     <Loading/>
    //   </div>
    // );
    return null;
  }
};

function wrapWithC(MyComponent, props) {

  class CWrapper extends React.Component {

    static propTypes = {
      loading: PropTypes.bool.isRequired,
    };

    static defaultProps = {
      loading: false,
      stale: false,
    };

    render() {
      const { stale, loading, viewer, relay, children, } = this.props;
      return React.createElement(
        MyComponent, {
          ...props,
          stale: stale,
          topLoading: loading,
          company: viewer.company,
          payment: viewer.payment,
          vendorOpenBills: viewer.vendorOpenBills,
          expensesAccounts: viewer.expensesAccounts,
          depositsAccounts: viewer.depositsAccounts,
          viewer,
          relay: relay,
        },
        children
      );
    }
  }

  return Relay.createContainer(CWrapper, {

    initialVariables: {
      companyId: props.company.id,
      id: props.payment.objectId,

      expensesAccountsCategories: EXPENSES_ACCOUNTS_CATEGORIES,
      depositAccountsAccountsCategories: DEPOSIT_ACCOUNTS_CATEGORIES,

      rev: 0,
      paymentVendorId: null,
    },

    fragments: {
      viewer: () => Relay.QL`

        fragment on User{

          vendorOpenBills(first: 100000, companyId: $companyId, id: $paymentVendorId){
            edges{
              node{
                objectId,
                id,
                payee{
                  type: __typename,
                  objectId,
                  id,
                  displayName,
                },
                mailingAddress,
                date,
                dueDate,
                terms,
                memo,
                files,
                paymentRef,

                totalHT,
                VAT,

                inputType,

                itemsConnection : billItemsConnection{
                  totalCount,
                  totalAmount,
                  edges{
                    node{
                      objectId,
                      id,
                      index,
                      accountCode,
                      description,
                      amount,
                    }
                  }
                },
                paymentsConnection : billPaymentsConnection{
                  totalAmountPaid,
                },
              }
            }
          },

          objectId,
          id,
          displayName,
          username,
          email,
          createdAt,
          updatedAt,
          sessionToken,

          expensesAccounts: accountsByCategories(categories: $expensesAccountsCategories){
            code,
            name,
            _groupCode,
            _categoryCode,
            _classCode,
          },

          depositsAccounts: accountsByCategories(categories: $depositAccountsAccountsCategories){
            code,
            name,
            _groupCode,
            _categoryCode,
            _classCode,
          },

          company(id: $companyId) {

            VATDeclaration{
              id,
              objectId,
              periodStart,
              periodEnd,
            },

            VATSettings{
              enabled,
              agency,
              startDate,
              IF,
              frequency,
              regime,
              percentages{ value, },
            },

            objectId,

            id,
            displayName,
            periodType,
            lastTransactionIndex, lastPaymentsTransactionIndex,

            createdAt,
            updatedAt,

            settings {
              periodType,
              closureEnabled,
              closureDate,
            },
            salesSettings {
              defaultDepositToAccountCode,
              preferredInvoiceTerms,
              enableCustomTransactionNumbers,
              enableServiceDate,
              discountEnabled,

            showProducts,
            showRates,
            trackInventory,
            defaultIncomeAccountCode,
            },
            expensesSettings {
              defaultExpenseAccountCode,
              preferredPaymentMethod,
            },
            paymentsSettings {
              defaultDepositToAccountCode,
              preferredPaymentMethod,
            },

            vendors(first: 1000){
              edges{
                node{
                  active,
                  type: __typename,
                  objectId,
                  id,
                  displayName,
                  image,
                  title,
                  givenName,
                  middleName,
                  familyName,
                  affiliation,
                  emails,
                  phone,
                  mobile,
                  fax,
                  mailing_streetAddress,
                  mailing_cityTown,
                  mailing_stateProvince,
                  mailing_postalCode,
                  mailing_country,
                  notes,
                  updatedAt,
                  createdAt,
                }
              }
            },


          },

          payment: paymentOfBillsFromPaymentOfBillsItem(companyId: $companyId, id: $id){

            __opType: __typename,
            createdAt,
            objectId,
            id,
            payee{
              type: __typename,
              objectId,
              id,
              displayName,
              createdAt,
            },
            date,
            mailingAddress,
            paymentRef,
            amountReceived,
            creditToAccountCode,
            memo,
            files,
            itemsConnection : paymentItemsConnection{
              totalCount,
              totalAmountPaid,
              edges{
                cursor,
                node{
                  objectId,
                  id,
                  date,
                  amount,
                  bill{
                    createdAt,
                    objectId,
                    id,
                    payee{
                      type: __typename,
                      objectId,
                      id,
                      displayName,
                    },
                    mailingAddress,
                    date,
                    dueDate,
                    paymentRef,
                    itemsConnection : billItemsConnection{
                      totalCount,
                      totalAmount,
                      edges{
                        node{
                          objectId,
                          id,
                          index,
                          description,
                          accountCode,
                          amount,
                        }
                      }
                    },
                    paymentsConnection : billPaymentsConnection{
                      totalAmountPaid,
                      totalCount,
                      edges{
                        node{
                          objectId,
                          id,
                          date,
                          amount,
                        }
                      }
                    },
                  },
                }
              }
            },

          }

        }

      `
    },

  });

}

function createContainer({ viewer, company, payment, onClose, }){
  const MyComponent = wrapWithC(FromPaymentItemPaymentForm, {
    company,
    payment,
    onClose,
  });
  const Route = new RelayRoute({ companyId: company.id, id: payment.objectId, });

  class Container extends React.Component{
    shouldComponentUpdate(){
      return false;
    }
    render(){
      return (
        <Relay.RootContainer
          Component={MyComponent}
          forceFetch={true}
          route={Route}
          renderFetched={function(data, readyState){
            return (
              <MyComponent
                {...data}
                stale={readyState.stale}
              />
            );
          }}
          renderLoading={function() {
            return (
              <MyComponent
                {...{viewer: {
                  ...viewer,
                  company: company,
                }}}
                loading={true}
              />
            );
          }}
        />
      );
    }
  }

  return () => Container;
}

export default class extends React.Component{
  static displayName = 'FromPaymentItemPaymentForm';
  constructor(props) {
    super(props);
    this.cache = new LazyCache(this, {
      Component: {
        params: [
          // props that effect how redux-form connects to the redux store
        ],
        fn: createContainer(props),
      }
    });
  }
  shouldComponentUpdate(){
    return false;
  }
  componentWillReceiveProps(nextProps) {
    this.cache.componentWillReceiveProps(nextProps);
  }
  render() {
    const {Component} = this.cache;
    return <Component {...this.props}/>;
  }
}

function decorateBill({ objectId, __dataID__, totalHT, VAT, inputType, id, paymentRef, payee, mailingAddress, terms, date, dueDate, itemsConnection, paymentsConnection, memo, files, }) {
  const balanceDue = itemsConnection.totalAmount - paymentsConnection.totalAmountPaid;

  function calcBillStatus() {
    // const _date = moment(date);
    const _dueDate = moment(dueDate);
    const now = moment();

    const isPaidInFull = balanceDue === 0.0;

    if(isPaidInFull){
      return 'Closed';
    }

    if(_dueDate.isBefore(now)){
      return 'Overdue';
    }

    // const hasPayment = paymentsConnection.totalAmountPaid !== 0;
    //
    // if(hasPayment){
    //   return 'Partial';
    // }

    return 'Open';
  }

  return {
    __dataID__,
    id,
    terms,
    date,
    mailingAddress,
    type: 'Bill',
    paymentRef,
    refNo: paymentRef,
    payee,
    dueDate,
    totalAmount: itemsConnection.totalAmount,
    balanceDue,
    total: itemsConnection.totalAmount,
    totalAmountPaid: paymentsConnection.totalAmountPaid,
    status: calcBillStatus(),
    memo, files,
    totalHT, VAT, inputType, 
    itemsConnection,
    paymentsConnection,
    objectId,
  };
}

function decoratePayment({ objectId, __dataID__, id, payee, paymentRef, amountReceived, creditToAccountCode, mailingAddress, date, itemsConnection, memo, files, }) {
  const balanceDue = amountReceived - itemsConnection.totalAmountPaid;
  return {
    __dataID__,
    id,
    payee,
    date,
    mailingAddress,
    paymentRef,
    creditToAccountCode,
    type: 'Payment',
    refNo: paymentRef,
    amountReceived,
    balanceDue,
    total: amountReceived,
    totalAmountPaid: itemsConnection.totalAmountPaid,
    status: balanceDue === 0.0
      ? 'Closed'
      : (balanceDue > 0.0 ? 'Partial' : 'Open'),
    memo, files,
    itemsConnection,
    objectId,
    dueDate: date,
  };
}

function decoratePaymentItem({ id, amount, bill: { id: billId, objectId, date, dueDate, memo, paymentRef, itemsConnection, paymentsConnection, }, }){
  const balanceDue = itemsConnection.totalAmount - paymentsConnection.totalAmountPaid;
  const obj = {
    __selected: true,
    __existed: true,
    __originalAmount: amount,
    id,
    amount: amount,
    bill: {
      id,
      objectId,
      paymentRef,
      refNo: paymentRef,
      total: itemsConnection.totalAmount,
      balanceDue,
      amountReceived: paymentsConnection.totalAmountPaid,
      date,
      dueDate,
      memo,
    },
  }

  return obj;
}
