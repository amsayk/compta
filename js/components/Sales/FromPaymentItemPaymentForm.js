import React, {Component, PropTypes} from 'react';
import Relay from 'react-relay';

import { SALES_ACCOUNTS_CATEGORIES, DEPOSIT_ACCOUNTS_CATEGORIES, } from '../../../data/constants';

import LazyCache from 'react-lazy-cache';

// import Loading from '../Loading/Loading';

import moment from 'moment';

import RelayRoute from '../../routes/PaymentOfInvoicesFormPaymentOfInvoicesItemRoute';

// import PaymentForm  from './PaymentForm/PaymentForm';
// import InvoiceForm  from './InvoiceForm/InvoiceForm';

import LoadingActions from '../Loading/actions';

let InvoiceForm = null;
let PaymentForm = null;

function loadComponent(type, cb) {
  LoadingActions.show();

  switch (type){
    case 'Invoice':

      require.ensure([], function (require) {
        LoadingActions.hide();
        InvoiceForm = require('./InvoiceForm/InvoiceForm').default;
        cb();
      }, 'InvoiceForm');

      break;

    case 'Payment':

      require.ensure([], function (require) {
        LoadingActions.hide();
        PaymentForm = require('./PaymentForm/PaymentForm').default;
        cb();
      }, 'PaymentOfInvoicesForm');

      break;
  }
}

import Revision from '../../utils/revision';

import stopEvent from '../../utils/stopEvent';

import { editStart as editStartPayment, } from '../../redux/modules/v2/paymentsOfInvoices';
import { editStart as editStartInvoice, } from '../../redux/modules/v2/invoices';

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
  _fetchingCustomerInvoices = false;
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
        this._onPaymentCustomerSelected(obj.customer, ({ aborted, done, error, }) => {
          if(done){
            this._fetchingCustomerInvoices = false;
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
          this._onPaymentCustomerSelected(obj.customer, ({ aborted, done, error, }) => {
            if(done){
              this._fetchingCustomerInvoices = false;
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
  _onPaymentCustomerSelected = (customer, onReadyStateChange) => {
    if(this._fetchingCustomerInvoices){
      return;
    }

    this._fetchingCustomerInvoices = true;
    this.props.relay.setVariables({
      paymentCustomerId: customer.objectId,
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
  _onInvoice = (obj) => {
    requestAnimationFrame(() => {

      this.setState({
        modalOpen: false,
        obj: undefined,
      }, () => {
        obj = decorateInvoice(obj);

        this.context.store.dispatch(
          editStartInvoice(
            obj.id,
            obj.itemsConnection.edges.map(({node}) => node),
            {id: obj.id, company: this.props.company,})
        );

        setTimeout(() => {

          loadComponent('Invoice', () => {

            this.setState({
              modalOpen: true,
              obj,
            });

          });

        }, 150);
      });
    });
  };
  _onReceivePayment = (invoice) => {
    const { customer, } = invoice;

    setImmediate(() => {
      this._onPaymentCustomerSelected(customer, ({ aborted, done, }) => {
        if(done){
          this._fetchingCustomerInvoices = false;
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
                invoice,
              });

            });


          });

        }

      });
    });
  };
  render(){
    const { obj, invoice, modalOpen, } = this.state;

    if(modalOpen){

      switch (obj ? obj.type : 'Payment') {
        case 'Payment':

          return (
            <PaymentForm
              invoice={invoice}
              payment={obj}
              company={this.props.company}
              viewer={this.props.viewer}
              formKey={obj ? obj.id : 'NEW'}
              customerOpenInvoices={this.props.customerOpenInvoices}
              salesAccounts={this.props.salesAccounts}
              depositsAccounts={this.props.depositsAccounts}
              onCancel={this._close}
              onPaymentCustomerSelected={this._onPaymentCustomerSelected}
              onInvoice={this._onInvoice}
            />
          );

        case 'Invoice':

          return (
            <InvoiceForm
              invoice={obj}
              company={this.props.company}
              viewer={this.props.viewer}
              salesAccounts={this.props.salesAccounts}
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
          customerOpenInvoices: viewer.customerOpenInvoices,
          salesAccounts: viewer.salesAccounts,
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

      salesAccountsCategories: SALES_ACCOUNTS_CATEGORIES,
      depositAccountsAccountsCategories: DEPOSIT_ACCOUNTS_CATEGORIES,

      rev: 0,
      paymentCustomerId: null,
    },

    fragments: {
      viewer: () => Relay.QL`

        fragment on User{

          customerOpenInvoices(first: 100000, companyId: $companyId, id: $paymentCustomerId){
            edges{
              node{
                objectId,
                id,
                customer{
                  type: __typename,
                  objectId,
                  id,
                  displayName,
                },
                billingAddress,
                date,
                dueDate,
                terms,
                memo,
                files,
                refNo,

                totalHT,
                VAT,

                inputType,

                itemsConnection : invoiceItemsConnection{
                  totalCount,
                  totalAmount,
                  edges{
                    node{
                      objectId,
                      id,
                      index,
                      date,
                      item{
                        objectId,
                        id,
                        displayName,
                        createdAt,
                      },
                      description,
                      qty,
                      rate,
                      discountPart{
                        type,
                        value,
                      },

                      VATPart{
                        inputType,
                        value,
                      },

                    }
                  }
                },
                paymentsConnection : invoicePaymentsConnection{
                  totalAmountReceived,
                },
                discountType,
                discountValue,
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

          salesAccounts: accountsByCategories(categories: $salesAccountsCategories){
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

            customers(first: 1000){
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
                  billing_streetAddress,
                  billing_cityTown,
                  billing_stateProvince,
                  billing_postalCode,
                  billing_country,
                  notes,
                  updatedAt,
                  createdAt,
                }
              }
            },

            companyProducts(first: 1000){
              edges{
                node{
                  active,
                    className,
                    objectId,
                    id,
                    type,
                    displayName,
                    image,
                    image{
                      objectId,
                      url,
                    },
                    sku,
                    salesEnabled,
                    salesDesc,
                    salesPrice,
                    salesVATPart{
                      inputType,
                      value,
                    },
                    incomeAccountCode,
                    purchaseEnabled,
                    purchaseDesc,
                    cost,
                    purchaseVATPart{
                      inputType,
                      value,
                    },
                    purchaseAccountCode,
                    updatedAt,
                    createdAt,
                }
              }
            },

          },

          payment: paymentOfInvoicesFromPaymentOfInvoicesItem(companyId: $companyId, id: $id){

            __opType: __typename,
            createdAt,
            objectId,
            id,
            customer{
              type: __typename,
              objectId,
              id,
              displayName,
              createdAt,
            },
            date,
            paymentMethod,
            paymentRef,
            amountReceived,
            depositToAccountCode,
            memo,
            files,
            itemsConnection : paymentItemsConnection{
              totalCount,
              totalAmountReceived,
              edges{
                cursor,
                node{
                  objectId,
                  id,
                  date,
                  amount,
                  invoice{
                    createdAt,
                    objectId,
                    id,
                    customer{
                      type: __typename,
                      objectId,
                      id,
                      displayName,
                    },
                    billingAddress,
                    date,
                    dueDate,
                    refNo,

                    inputType,

                    itemsConnection : invoiceItemsConnection{
                      totalCount,
                      totalAmount,
                      edges{
                        node{
                          objectId,
                          id,
                          index,
                          date,
                          item{
                            objectId,
                            id,
                            displayName,
                            createdAt,
                          },
                          description,
                          qty,
                          rate,
                          discountPart{
                            type,
                            value,
                          },

                          VATPart{
                            inputType,
                            value,
                          },

                        }
                      }
                    },
                    paymentsConnection : invoicePaymentsConnection{
                      totalAmountReceived,
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
                    discountType,
                    discountValue,
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

function decorateInvoice({ objectId, __dataID__, totalHT, VAT, id, refNo, customer, billingAddress, inputType, terms, date, dueDate, discountType, discountValue, itemsConnection, paymentsConnection, memo, files, }) {
  const balanceDue = itemsConnection.totalAmount - paymentsConnection.totalAmountReceived;

  function calcInvoiceStatus() {
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

    // const hasPayment = paymentsConnection.totalAmountReceived !== 0;
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
    billingAddress,
    type: 'Invoice',
    refNo: parseInt(refNo),
    customer,
    dueDate,
    discountType, discountValue,
    totalAmount: itemsConnection.totalAmount,
    balanceDue,
    total: itemsConnection.totalAmount,
    totalAmountReceived: paymentsConnection.totalAmountReceived,
    status: calcInvoiceStatus(),
    memo, files,
    totalHT, VAT, 
    inputType,
    itemsConnection,
    paymentsConnection,
    objectId,
  };
}

function decoratePayment({ objectId, __dataID__, id, customer, paymentRef, amountReceived, depositToAccountCode, paymentMethod, date, itemsConnection, memo, files, }) {
  const balanceDue = amountReceived - itemsConnection.totalAmountReceived;
  return {
    __dataID__,
    id,
    customer,
    date,
    customer,
    paymentMethod,
    paymentRef,
    depositToAccountCode,
    type: 'Payment',
    refNo: '',
    amountReceived,
    balanceDue,
    total: amountReceived,
    totalAmountReceived: itemsConnection.totalAmountReceived,
    status: balanceDue === 0.0
      ? 'Closed'
      : (balanceDue > 0.0 ? 'Partial' : 'Open'),
    memo, files,
    itemsConnection,
    objectId,
    dueDate: date,
  };
}

function decoratePaymentItem({ id, amount, invoice: { id: invoiceId, objectId, date, dueDate, memo, refNo, itemsConnection, paymentsConnection, }, }){
  const balanceDue = itemsConnection.totalAmount - paymentsConnection.totalAmountReceived;
  const obj = {
    __selected: true,
    __existed: true,
    __originalAmount: amount,
    id,
    amount: amount,
    invoice: {
      id,
      objectId,
      refNo,
      total: itemsConnection.totalAmount,
      balanceDue,
      amountReceived: paymentsConnection.totalAmountReceived,
      date,
      dueDate,
      memo,
    },
  }

  return obj;
}
