import React, { Component, PropTypes, } from 'react';
import Relay from 'react-relay';

import Modal from 'react-bootstrap/lib/Modal';

import Dialog, { Body, } from '../../utils/Dialog';

import classnames from 'classnames';

import {
  // CREDIT_ACCOUNTS_CATEGORIES,
  EXPENSES_ACCOUNTS_CATEGORIES,

  SALES_ACCOUNTS_CATEGORIES,
  DEPOSIT_ACCOUNTS_CATEGORIES,
} from '../../../../data/constants';

import LazyCache from 'react-lazy-cache';

import Loading from '../../Loading/Loading';

import AddBillMutation from '../../../mutations/AddBillMutation';
import AddExpenseMutation from '../../../mutations/AddExpenseMutation';
import ReceivePaymentOfBillsMutation from '../../../mutations/ReceivePaymentOfBillsMutation';

import RemoveExpenseMutation from '../../../mutations/RemoveExpenseMutation';
import RemoveBillMutation from '../../../mutations/RemoveBillMutation';
import RemovePaymentOfBillsMutation from '../../../mutations/RemovePaymentOfBillsMutation';

import AddInvoiceMutation from '../../../mutations/AddInvoiceMutation';
import AddSaleMutation from '../../../mutations/AddSaleMutation';
import ReceivePaymentOfInvoicesMutation from '../../../mutations/ReceivePaymentOfInvoicesMutation';

import RemoveInvoiceMutation from '../../../mutations/RemoveInvoiceMutation';
import RemoveSaleMutation from '../../../mutations/RemoveSaleMutation';
import RemovePaymentOfInvoicesMutation from '../../../mutations/RemovePaymentOfInvoicesMutation';

import Revision from '../../../utils/revision';

import stopEvent from '../../../utils/stopEvent';

import {editStart as editStartInvoice} from '../../../redux/modules/invoices';
import {editStart as editStartPaymentOfInvoices} from '../../../redux/modules/paymentsOfInvoices';
import {editStart as editStartSale} from '../../../redux/modules/sales';

import InvoiceForm  from '../../Sales/InvoiceForm/InvoiceForm';
import SaleForm  from '../../Sales/SaleForm/SaleForm';
import PaymentOfInvoicesForm  from '../../Sales/PaymentForm/PaymentForm';

import {editStart as editStartExpense} from '../../../redux/modules/expenses';
import {editStart as editStartPaymentOfBills} from '../../../redux/modules/paymentsOfBills';
import {editStart as editStartBill} from '../../../redux/modules/bills';

import ExpenseForm  from '../../Expenses/ExpenseForm/ExpenseForm';
import BillForm  from '../../Expenses/BillForm/BillForm';
import PaymentOfBillsForm  from '../../Expenses/PaymentForm/PaymentForm';

import styles from './Recent.scss';

import CSSModules from 'react-css-modules';

@CSSModules(styles, { allowMultiple: true, })
class Recent extends Component{
  static displayName = 'Recent';
  static propTypes = {};
  static contextTypes = {
    store: PropTypes.object.isRequired,
  };
  state = {
    modalOpen: false,
    type: undefined,
  };

  _onPaymentCustomerSelected = ({id}, onReadyStateChange) => {
    this.props.relay.setVariables({
      paymentCustomerId: id,
      rev: Revision.incrementAndGet(),
    }, onReadyStateChange);
  };

  _onReceivePaymentOfInvoices = (customer) => {
    this._onPaymentCustomerSelected({ id: customer.objectId, });
  };

  _onPaymentVendorSelected = ({ id, }, onReadyStateChange) => {
    this.props.relay.setVariables({
      paymentVendorId: id,
      rev: Revision.incrementAndGet(),
    }, onReadyStateChange);
  };

  _onReceivePaymentOfBills = ({ objectId, }) => {
    this._onPaymentVendorSelected({
      id: objectId,
    });
  };

  _onModalOpen = (type, e) => {
    stopEvent(e);

    switch(type){
      case 'invoice':
        this.context.store.dispatch(
          editStartInvoice(
          'NEW', [], { id: 'NEW', company: this.props.company, }
        ));
        break;

      case 'sale':
        this.context.store.dispatch(
          editStartSale(
          'NEW', [], { id: 'NEW', company: this.props.company, }
        ));
        break;

      case 'paymentOfInvoices':
        this.context.store.dispatch(
          editStartPaymentOfInvoices(
          'NEW', [], { id: 'NEW', company: this.props.company, }
        ));
        break;

      case 'expense':
        this.context.store.dispatch(
          editStartExpense(
          'NEW', [], { id: 'NEW', company: this.props.company, }
        ));
        break;

      case 'bill':
        this.context.store.dispatch(
          editStartBill(
          'NEW', [], { id: 'NEW', company: this.props.company, }
        ));
        break;

      case 'paymentOfBills':
        this.context.store.dispatch(
          editStartPaymentOfBills(
          'NEW', [], { id: 'NEW', company: this.props.company, }
        ));
        break;
    }

    this.setState({
      modalOpen: true,
      type,
    });
  }
  _close = () => {
    this._handleClose();

    // this.setState({
    //   modalOpen: false,
    //   type: undefined,
    // });
  }

  _renderModal = () => {
    if(!this.state.modalOpen){
      return null;
    }

    const { company, } = this.props;

    switch(this.state.type){
      case 'invoice':
        return (
          <InvoiceForm
            filterArgs={{}}
            onNew={this._onModalOpen.bind(this, 'invoice')}
            salesAccounts={this.props.salesAccounts}
            company={this.props.company}
            viewer={this.props.viewer}
            formKey={'NEW'} onCancel={this._close}
          />
        );

      case 'sale':
        return (
          <SaleForm
            filterArgs={{}}
            salesAccounts={this.props.salesAccounts}
            depositsAccounts={this.props.depositsAccounts}
            onNew={this._onModalOpen.bind(this, 'sale')}
            company={this.props.company}
            viewer={this.props.viewer}
            formKey={'NEW'}
            onCancel={this._close}
          />
        );

      case 'paymentOfInvoices':
        return (
          <PaymentOfInvoicesForm
            filterArgs={{}}
            onNew={this._onModalOpen.bind(this, 'paymentOfInvoices')}
            company={this.props.company}
            viewer={this.props.viewer}
            customerOpenInvoices={this.props.customerOpenInvoices}
            depositsAccounts={this.props.depositsAccounts}
            formKey={'NEW'}
            onPaymentCustomerSelected={this._onPaymentCustomerSelected}
            onCancel={this._close}
          />
        );

      case 'expense':
        return (
          <ExpenseForm
            filterArgs={{}}
            depositsAccounts={this.props.depositsAccounts}
            expensesAccounts={this.props.expensesAccounts}
            onNew={this._onModalOpen.bind(this, 'expense')}
            company={this.props.company}
            viewer={this.props.viewer}
            vendorOpenBills={this.props.vendorOpenBills}
            onPaymentVendorSelected={this._onPaymentVendorSelected}
            formKey={'NEW'}
            onBill={this._onBill}
            onCancel={this._close}
            onReceivePayments={this._onReceivePaymentOfBills}
          />
        );

      case 'bill':
        return (
          <BillForm
            filterArgs={{}}
            onNew={this._onModalOpen.bind(this, 'bill')}
            depositsAccounts={this.props.depositsAccounts}
            expensesAccounts={this.props.expensesAccounts}
            company={this.props.company}
            viewer={this.props.viewer}
            formKey={'NEW'} onCancel={this._close}
          />
        );

      case 'paymentOfBills':
        return (
          <PaymentOfBillsForm
            company={this.props.company}
            viewer={this.props.viewer}
            formKey={'NEW'}
            onNew={this._onModalOpen.bind(this, 'payment')}
            vendorOpenBills={this.props.vendorOpenBills}
            expensesAccounts={this.props.expensesAccounts}
            depositsAccounts={this.props.depositsAccounts}
            onCancel={this._close}
            onPaymentVendorSelected={this._onPaymentVendorSelected}
            onBill={this._onBill}
            amountReceived={this.state.amountReceived || 0.0}
            selectedBills={this.state.selectedBills || []}
          />
        );
    }
  }

  _onReceivePaymentOfBills = (bills) => {
    let amountReceived = 0.0;

    function decorateBillItem({ id, objectId, date, dueDate, memo, paymentRef, itemsConnection, paymentsConnection, }){
      const balanceDue = itemsConnection.totalAmount - paymentsConnection.totalAmountPaid;
      amountReceived += balanceDue;
      const obj = {
        __selected: true,
        __existed: true,
        __originalAmount: balanceDue,
        id,
        amount: balanceDue,
        bill: {
          id,
          objectId,
          paymentRef,
          refNo: paymentRef,
          total: itemsConnection.totalAmount,
          balanceDue,
          amountPaid: paymentsConnection.totalAmountPaid,
          date,
          dueDate,
          memo,
        },
      }

      return obj;
    }

    const items = bills.map(decorateBillItem);

    this.context.store.dispatch(
      editStartPaymentOfBills(
        'NEW', items, {id: 'NEW', company: this.props.company, }));

    this.setState({
      modalOpen: true,
      modalType: 'paymentOfBills',
      amountReceived,
      selectedBills: bills,
    });
  };

  _handleClose = () => {
    this.props.onClose();
  };

  render(){
    const { route, stale, loading, company, styles, } = this.props;

    return (
      <Modal dialogClassName={`${styles['modal']}`}
             // dialogComponentClass={Dialog}
             className={classnames({ 'modal-fullscreen': true, })}
             styleName={'my--Modal'}
             show={true} animation={false} keyboard={true} backdropStyle={{}} backdrop={true} onHide={() => this._handleClose()} autoFocus enforceFocus>

         {/*<Modal.Body>*/}

            <div className={'menu '} styleName='flyout-view scroller' style={{
              // display: 'block',
              // left: -355.5,
              // width: 761,
              // height: 500,
              // transform: 'translate3d(0px, 500px, 0px)',
             }}>

              <h3 styleName='tableCell title subsection20TitleText'>Opérations récentes</h3>

              <div className='overflow-hidden'>

                {loading || stale ? <Loading/> : <div className={'applyWidth'} styleName='table width100Percent' style={{ paddingBottom: 20, }}>

                  <div styleName='tableRow flyout-section'>

                    <div className={'expanded'} styleName='tableCell '>

                      La liste des opérations récentes s'affichera ici.

                    </div>

                  </div>

                </div>}

              </div>

              <div styleName='flyout-header'></div>

              <div styleName='flyout-header'></div>

            </div>

         {/*</Modal.Body>*/}

         {this._renderModal()}

			</Modal>
    );
  }
}

class RelayRoute extends Relay.Route {
  static queries = {
    viewer: () => Relay.QL`
      query {
        viewer
      }
    `,
  };
  static paramDefinitions = {
    companyId: {required: true},
  };
  static routeName = 'AppSearch';
}

function wrapWithC(MyComponent, props) {
  class CWrapper extends Component {
    static propTypes = {
      loading: PropTypes.bool.isRequired,
    };

    static defaultProps = {
      loading: false,
      stale: false,
    };

    render() {
      const { stale, loading, viewer : root, relay, children, } = this.props;
      return React.createElement(
        MyComponent, {
          ...props,
          stale: stale,
          loading: loading,
          customerOpenInvoices: loading ? undefined : root.customerOpenInvoices,
          salesAccounts: loading ? undefined : root.salesAccounts,
          vendorOpenBills: loading ? undefined : root.vendorOpenBills,
          expensesAccounts: loading ? undefined : root.expensesAccounts,
          depositsAccounts: loading ? undefined : root.depositsAccounts,
          company: loading ? undefined : root.company,
          root: root,
          viewer: root,
          relay: relay,
        },
        children
      );
    }
  }

  return Relay.createContainer(CWrapper, {
    initialVariables: {

      companyId: props.companyId,

      // EXpenses
      expensesAccountsCategories: EXPENSES_ACCOUNTS_CATEGORIES,
      // creditAccountsAccountsCategories: CREDIT_ACCOUNTS_CATEGORIES,
      paymentVendorId: null,

      // Sales
      salesAccountsCategories: SALES_ACCOUNTS_CATEGORIES,
      depositAccountsAccountsCategories: DEPOSIT_ACCOUNTS_CATEGORIES,
      paymentCustomerId: null,

      rev: 0,
    },

    fragments: {

      viewer: () => Relay.QL`
        fragment on User {

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
                itemsConnection{
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
                    }
                  }
                },
                paymentsConnection{
                  totalAmountReceived,
                },
                discountType,
                discountValue,
              }
            }
          },

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
                itemsConnection{
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
                paymentsConnection{
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

          company(id: $companyId){

            ${AddBillMutation.getFragment('company')},
            ${AddExpenseMutation.getFragment('company')},
            ${ReceivePaymentOfBillsMutation.getFragment('company')},

            ${RemoveBillMutation.getFragment('company')},
            ${RemoveExpenseMutation.getFragment('company')},
            ${RemovePaymentOfBillsMutation.getFragment('company')},

            ${AddInvoiceMutation.getFragment('company')},
            ${AddSaleMutation.getFragment('company')},
            ${ReceivePaymentOfInvoicesMutation.getFragment('company')},

            ${RemoveInvoiceMutation.getFragment('company')},
            ${RemoveSaleMutation.getFragment('company')},
            ${RemovePaymentOfInvoicesMutation.getFragment('company')},

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
                  objectId,
                  id,
                  type,
                  displayName,
                  image,
                  sku,
                  salesDesc,
                  salesPrice,
                  incomeAccountCode,
                  updatedAt,
                  createdAt,
                }
              }
            },

            vendors(first: 1000){
              edges{
                node{
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

            people(first: 1000){
              edges{
                node{

                  ... on Node{

                    ... on Vendor{
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
                    },

                    ... on Customer{
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
                    },

                    ... on Employee{
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
                      address_streetAddress,
                      address_cityTown,
                      address_stateProvince,
                      address_postalCode,
                      address_country,
                      notes,
                      updatedAt,
                      createdAt,
                    },

                  },

                }
              }
            },

          },

        }
      `
    },

  });
}


function createContainer({ company, onClose, }){
  const Route = new RelayRoute({ companyId: company.id, });
  const MyComponent = wrapWithC(Recent, { companyId: company.id, onClose, });

  class Container extends Component{
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

class S extends Component{
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
  shouldComponentUpdate(nextProps){
    return this.props.company.id !== nextProps.company.id;
  }
  componentWillReceiveProps(nextProps) {
    this.cache.componentWillReceiveProps(nextProps);
  }
  render() {
    const {Component} = this.cache;
    return <Component {...this.props}/>;
  }
}

module.exports = S;
