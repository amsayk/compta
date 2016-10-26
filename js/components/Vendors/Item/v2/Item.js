import React, {Component, PropTypes} from 'react';
import Relay from 'react-relay';

import { connect, } from 'react-redux';
import {bindActionCreators} from 'redux';

import { toggle, toggleAll, toggleNone, editStart as editStartSelection, editStop as editStopSelection, } from '../../../../redux/modules/selection';

import stopEvent from '../../../../utils/stopEvent';

import Sidebar from '../../../Sidebar/AppSidebar';

import LazyCache from 'react-lazy-cache';

import moment from 'moment';

import CSSModules from 'react-css-modules';

import styles from '../Item.scss';

import events from 'dom-helpers/events';

// import concat from 'lodash.concat';
// import orderBy from 'lodash.orderby';
// import take from 'lodash.take';
// import drop from 'lodash.drop';

import {
  EXPENSES_ACCOUNTS_CATEGORIES,
  DEPOSIT_ACCOUNTS_CATEGORIES,
} from '../../../../../data/constants';

import classnames from 'classnames';

import { getBodyWidth, } from '../../../../utils/dimensions';

import Revision from '../../../../utils/revision';

import throttle from 'lodash.throttle';

import Toolbar from '../Toolbar';
import Pagination from '../Pagination';
import PayeeInfo from '../PayeeInfo';

import Header from '../Header';
import ExpensesTable from '../ExpensesTable';

import {getBodyHeight,} from '../../../../utils/dimensions';

import RelayRoute from '../../../../routes/ExpensesRoute';

import UpdateVendorNotesMutation from '../../../../mutations/UpdateVendorNotesMutation';

import AddVendorMutation from '../../../../mutations/AddVendorMutation';
import AddCustomerMutation from '../../../../mutations/AddCustomerMutation';
import AddProductMutation from '../../../../mutations/AddProductMutation';

import AddBillMutation from '../../../../mutations/v2/AddBillMutation';
import AddExpenseMutation from '../../../../mutations/v2/AddExpenseMutation';
import MakePaymentOfBillsMutation from '../../../../mutations/v2/MakePaymentOfBillsMutation';

import LogOutMutation from '../../../../mutations/LogOutMutation';
import RemoveCompanyMutation from '../../../../mutations/RemoveCompanyMutation';
import AddCompanyMutation from '../../../../mutations/AddCompanyMutation';

import RemoveBillMutation from '../../../../mutations/v2/RemoveBillMutation';
import RemoveExpenseMutation from '../../../../mutations/v2/RemoveExpenseMutation';
import RemovePaymentOfBillsMutation from '../../../../mutations/v2/RemovePaymentOfBillsMutation';

import List from '../List';

const DEFAULT_TYPE     = 'ALL';
const DEFAULT_STATUS   = 'ALL';
const DEFAULT_LIMIT    = 15;
const DEFAULT_SORT_KEY = 'date';
const DEFAULT_SORT_DIR = -1;

function clamp(value, min, max){
  return Math.min(Math.max(value, min), max);
}

const StatusTypes = {
  ALL: 'ALL',
  Closed: 'closed',
  Open: 'open',
  Overdue: 'overdue',
};

@connect(
  (state, ownProps) => ({
    selection: state.selection.editing[ownProps.params.id],
}), dispatch => bindActionCreators({ toggle, toggleAll, toggleNone, }, dispatch))
@CSSModules(styles, {allowMultiple: true})
class Item extends React.Component {

  static propTypes = {
    loading: PropTypes.bool.isRequired,
  };

  static contextTypes = {
    store: PropTypes.object.isRequired,
  };

  state = { selectedKey: 1, drawerOpen: localStorage.getItem('vendor.drawerOpen') === null ? false : function(){ try { return JSON.parse(localStorage.getItem('vendor.drawerOpen')); }catch(e){ return false; } }(), };

  _toggleDrawer = () => {
    this.setState({
      drawerOpen: !this.state.drawerOpen,
    }, () => {
      localStorage.setItem('vendor.drawerOpen', this.state.drawerOpen);
    });
  };

  _onSortChange = (columnKey, dir) => {
    const {
      sortKey = DEFAULT_SORT_KEY,
    } = this.props.variables;
    this.props.relay.setVariables({
      sortKey: columnKey,
      sortDir: columnKey !== sortKey ? -1 : dir,
      rev: Revision.incrementAndGet(),
    }, function({done}){

      if(done){
        columnKey && localStorage.setItem('vendor.sortKey', columnKey);
        localStorage.setItem('vendor.sortDir', columnKey !== sortKey ? -1 : dir);
      }
    });
  };

  _onFilter = ({
    type, status, date, from, to,
  }) => {
    this.props.relay.setVariables({
      offset: 0, limit: DEFAULT_LIMIT, type, date, status, from, to, rev: Revision.incrementAndGet(),
    }, function({done}){

      if(done){
        localStorage.setItem('vendor.type', type);
        localStorage.setItem('vendor.status', status);
        localStorage.setItem('vendor.date', date);
      }
    });
  };

  _onPage = (offset) => {
    this.props.relay.setVariables({
      offset, rev: Revision.incrementAndGet(),
    });
  };

  _onPaymentVendorSelected = ({id}, onReadyStateChange) => {
    this.props.relay.setVariables({
      paymentVendorId: typeof id === 'undefined' ? this.props.payee.objectId : id,
      rev: Revision.incrementAndGet(),
    }, onReadyStateChange);
  };

  _onReceivePayment = (vendor) => {
    this._onPaymentVendorSelected({ id: vendor.objectId, });
  };

  componentWillUnmount() {
    editStopSelection(this.props.payee.objectId);
    events.off(window, 'resize', this._handleWindowResize);
  }

  _handleWindowResize = throttle(() => {
    this.forceUpdate();
  }, 150);

  componentDidMount(){
    events.on(window, 'resize', this._handleWindowResize);
  }

  _onTab = (selectedKey, e) => {
    stopEvent(e);

    this.setState({
      selectedKey,
    });
  };

  render() {
    const { drawerOpen, } = this.state;
    const { route, payee, stale, loading, company, selection, toggle, toggleAll, toggleNone, } = this.props;

    const {
      type = DEFAULT_TYPE,
      offset = 0,
      status = DEFAULT_STATUS,
      limit = DEFAULT_LIMIT,
      sortKey = DEFAULT_SORT_KEY,
      sortDir = DEFAULT_SORT_DIR,
      date,
      from,
      to,
    } = this.props.variables;

    const bodyWidth = getBodyWidth();

    const totalCount = loading ? 0 : getTotalCount({ expenses: payee.expenses, });

    // const minHeight = getBodyHeight() - 236;

    const data = loading || stale ? [] : loadData({ totalCount, offset, limit, sortKey, sortDir, data : { bills: payee.bills, expenses: payee.expenses, payments: payee.payments, }, });
    const count = data.length;

    const DRAWER_WIDTH = 245;

    return (
      <div className={''} styleName={''}>

        <Sidebar
          route={route}
          bodyWidth={bodyWidth}
          viewer={this.props.viewer}
          company={this.props.company}
          companies={this.props.companies.edges.map(({ node: company, }) => company)}
          root={this.props.root}
          page='/vendors'
        />

        <div className='content' styleName={'split-view flex-columns'} style={{ width: bodyWidth - 165, height: getBodyHeight() * 0.9, }}>

          <div styleName='directory-pane flex-fixed' style={drawerOpen ? { width: DRAWER_WIDTH, } : {}}>

            <List
              open={drawerOpen}
              onToggle={this._toggleDrawer}
              vendor={this.props.payee}
              company={this.props.company}
              viewer={this.props.viewer}
              loading={loading}
            />

          </div>

          <div styleName='page detail flex-flexible' style={drawerOpen ? { width: bodyWidth - 165 - DRAWER_WIDTH, overflow: 'hidden', } : { overflow: 'hidden', }}>

            <Header
              payee={payee}
              expensesStatus={loading ? undefined : this.props.payee.expensesStatus}
              onPaymentVendorSelected={this._onPaymentVendorSelected.bind(this)}
              onReceivePayment={this._onReceivePayment}
              vendorOpenBills={this.props.vendorOpenBills}
              expensesAccounts={this.props.expensesAccounts}
              depositsAccounts={this.props.depositsAccounts}
              bodyWidth={'auto'}
              onTealChanged={this._onTealChanged}
              company={this.props.company}
              viewer={this.props.viewer}
              topLoading={loading}
              filterArgs={{
                offset,
                limit,
                type,
                status,
                sortKey,
                sortDir,
                from,
                to,
              }}
            />

            {function(self){

              switch (self.state.selectedKey) {
                case 1:

                  return (
                    <div styleName='index' style={{
                      /*minHeight: 794Math.max(minHeight, 794, minHeight),*/
                      background: '#fff',
                      // position: 'absolute',
                      // top: 216,
                      // paddingBottom: 50,
                    }}>

                      <div className='tabs'>

                        <ul styleName={'tab-content'}>

                          <li onClick={self._onTab.bind(self, 1)} styleName={classnames('tab-pane', { selected: self.state.selectedKey === 1})}>Liste d’opérations</li>

                          <li onClick={self._onTab.bind(self, 2)} styleName={classnames('tab-pane', { selected: self.state.selectedKey === 2})}>Infos sur le client</li>

                        </ul>

                      </div>

                      <div styleName='table-toolbar' style={{ marginTop: 30, }}>

                        <Toolbar
                          drawerOpen={drawerOpen}
                          payee={payee}
                          company={self.props.company}
                          viewer={self.props.viewer}
                          topLoading={loading}
                          filterArgs={{
                            type,
                            status,
                            date,
                            from,
                            to,
                          }}
                          onFilter={self._onFilter}
                        />

                      </div>

                      <div styleName={classnames('vendors-table', {drawerOpen,})} style={{ marginTop: 3, }}>

                        <ExpensesTable
                          payee={payee}
                          onReceivePayment={self._onReceivePayment}
                          onPaymentVendorSelected={self._onPaymentVendorSelected}
                          selection={selection}
                          toggle={toggle}
                          toggleAll={toggleAll}
                          toggleNone={toggleNone}
                          vendorOpenBills={self.props.vendorOpenBills}
                          expensesAccounts={self.props.expensesAccounts}
                          depositsAccounts={self.props.depositsAccounts}
                          bodyWidth={bodyWidth - (drawerOpen ? DRAWER_WIDTH : 30)}
                          relay={self.props.relay}
                          company={self.props.company}
                          viewer={self.props.viewer}
                          topLoading={loading || stale}
                          styles={self.props.styles}
                          totalCount={totalCount}
                          onSortChange={self._onSortChange}
                          expenses={data}
                          count={count}
                          filterArgs={{
                            offset,
                            limit,
                            type,
                            status,
                            sortKey,
                            sortDir,
                            from,
                            to,
                          }}
                          page={offset / limit}
                        />

                      </div>

                      {/*{loading || stale ? null : (totalCount > 0 && <div styleName='totals'>

                        <Totals
                          payee={payee}
                          page={offset / limit}
                          selection={selection}
                          company={self.props.company}
                          bodyWidth={bodyWidth}
                          totalCount={totalCount}
                          styles={self.props.styles}
                          filterArgs={{
                            offset,
                            limit,
                            type,
                            status,
                            sortKey,
                            sortDir,
                            from,
                            to,
                          }}
                        />

                      </div>)}*/}

                      {loading || stale ? null : (totalCount > limit ? <div styleName='pagination'>

                        <Pagination
                          offset={offset}
                          limit={limit}
                          count={count}
                          totalCount={totalCount}
                          onPage={self._onPage}
                        />

                      </div> : null)}

                    </div>
                  );

                case 2:

                  return (
                    <div styleName='index' style={{
                      height: 794/*Math.max(minHeight, 794, minHeight)*/,
                      background: '#fff',
                      // position: 'absolute',
                      // top: 216,
                      // paddingBottom: 50,
                    }}>

                      <div className='tabs'>

                        <ul styleName={'tab-content'}>

                          <li onClick={self._onTab.bind(self, 1)} styleName={classnames('tab-pane', { selected: self.state.selectedKey === 1})}>Liste d’opérations</li>

                          <li onClick={self._onTab.bind(self, 2)} styleName={classnames('tab-pane', { selected: self.state.selectedKey === 2})}>Infos sur le client</li>

                        </ul>

                      </div>

                      <div style={{ paddingTop: 50, }}>

                        <PayeeInfo
                          viewer={self.props.viewer} company={self.props.company}
                          payee={payee}
                        />

                      </div>

                    </div>
                  );
              }

            }(this)}

          </div>

        </div>

      </div>
    );
  }

}

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
      const { stale, loading, viewer : root, relay, children, } = this.props;
      return React.createElement(
        MyComponent, {
          ...props,
          stale: stale,
          loading: loading,
          payee: root.vendor,
          vendorOpenBills: root.vendorOpenBills,
          expensesAccounts: root.expensesAccounts,
          depositsAccounts: root.depositsAccounts,
          companies: root.companies,
          company: root.company,
          root: root,
          viewer: root,
          relay: relay,
          variables: relay.variables,
        },
        children
      );
    }
  }

  return Relay.createContainer(CWrapper, {
    initialVariables: {
      ...getState(),

      companyId: props.params.app,
      id: props.params.id,
      expensesAccountsCategories: EXPENSES_ACCOUNTS_CATEGORIES,
      depositAccountsAccountsCategories: DEPOSIT_ACCOUNTS_CATEGORIES,

      limit: DEFAULT_LIMIT,
      offset: 0,
      // type: 'ALL',
      // status: 'ALL',
      // date: 13,
      // from: null,
      // to: null,
      // sortKey: null,
      // sortDir: null,

      rev: 0,
      paymentVendorId: props.params.id,
    },

    prepareVariables({ to, from, ...vars, }){
      return {
        ...vars,
        to: to ? moment(to).toDate() : null,
        from: from ? moment(from).toDate() : null,
      };
    },

    fragments: {
      viewer: () => Relay.QL`
          fragment on User {

            vendorOpenBills(first: 100000, companyId: $companyId, id: $id){
              edges{
                node{
                  objectId,
                  id,
                  payee{
                    ${UpdateVendorNotesMutation.getFragment('vendor')},
                    className,
                    type: __typename,
                    objectId,
                    id,
                    displayName,
                  },
                  mailingAddress,
                  date,
                  dueDate,
                  terms,

                  totalHT,
                  VAT,

                  inputType,

                  memo,
                  files,
                  paymentRef,
                  itemsConnection : billItemsConnection{
                    totalCount,
                    totalAmount,
                    edges{
                      node{
                        className,
                        objectId,
                        id,
                        index,
                        accountCode,
                        description,
                        amount
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

            ${LogOutMutation.getFragment('viewer')},
            ${RemoveCompanyMutation.getFragment('viewer')},
            ${AddCompanyMutation.getFragment('viewer')},

            ${AddBillMutation.getFragment('viewer')},
            ${AddExpenseMutation.getFragment('viewer')},
            ${MakePaymentOfBillsMutation.getFragment('viewer')},

            ${RemoveBillMutation.getFragment('viewer')},
            ${RemoveExpenseMutation.getFragment('viewer')},
            ${RemovePaymentOfBillsMutation.getFragment('viewer')},

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

            vendor: getVendor(companyId: $companyId, id: $id){

              ${AddBillMutation.getFragment('_vendor')},
              ${AddExpenseMutation.getFragment('_vendor')},
              ${MakePaymentOfBillsMutation.getFragment('_vendor')},

              ${UpdateVendorNotesMutation.getFragment('vendor')},

              active,
              className,
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
              if,
              mailing_streetAddress,
              mailing_cityTown,
              mailing_stateProvince,
              mailing_postalCode,
              mailing_country,
              notes,
              updatedAt,
              createdAt,

              expensesStatus{

                open{
                  totalCount,
                  amount,
                  edges{
                    node{
                      objectId,
                      id,
                    }
                  }
                },

                overdue{
                  totalCount,
                  amount,
                  edges{
                    node{
                      objectId,
                      id,
                    }
                  }
                },

              },

              expenses(
                first: 100000,
                offset: $offset,
                limit: $limit,
                type: $type,
                status: $status,
                sortKey: $sortKey,
                sortDir: $sortDir,
                from: $from,
                to: $to,
                _rev: $rev
              ){

                totalCount,
                edges{
                  node {

                    ... on Node{

                      ... on Bill {

                        ${RemoveBillMutation.getFragment('bill')},
                        __opType: __typename,
                        createdAt,
                        objectId,
                        id,
                        payee{
                          ${UpdateVendorNotesMutation.getFragment('vendor')},
                          className,
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
                        mailingAddress,
                        terms,
                        paymentRef,
                        date,
                        dueDate,
                        memo,
                        files,

                        totalHT,
                        VAT,

                        inputType,

                        billItemsConnection{
                          totalCount,
                          totalAmount,
                          edges{
                            node{
                              className,
                              objectId,
                              id,
                              index,
                              accountCode,
                              description,
                              amount,

                              VATPart{
                                inputType,
                                value,
                              },

                            }
                          }
                        },
                        billPaymentsConnection{
                          totalCount,
                          totalAmountPaid,
                          latestPayment{
                            objectId,
                            id,
                            date,
                            amount,
                          },
                          edges{
                            node{
                              className,
                              objectId,
                              id,
                              date,
                              amount,
                            }
                          }
                        },

                      },

                      ... on PaymentOfBills {

                        ${RemovePaymentOfBillsMutation.getFragment('payment')},
                        __opType: __typename,
                        createdAt,
                        objectId,
                        id,
                        payee{
                          ${UpdateVendorNotesMutation.getFragment('vendor')},
                          className,
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
                        paymentItemsConnection{
                          totalCount,
                          totalAmountPaid,
                          edges{
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
                                  ${UpdateVendorNotesMutation.getFragment('vendor')},
                                  className,
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
                                      className,
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
                                  totalCount,
                                  totalAmountPaid,
                                  edges{
                                    node{
                                      className,
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
                        }

                      },

                      ... on Expense {

                        ${RemoveExpenseMutation.getFragment('expense')},
                        __opType: __typename,
                        createdAt,
                        id,
                        objectId,
                        payee{

                          ... on Node{

                            ... on Customer{
                              className,
                              type: __typename,
                              objectId,
                              id,
                              displayName,
                            },

                            ... on Vendor{
                              ${UpdateVendorNotesMutation.getFragment('vendor')},
                              className,
                              type: __typename,
                              objectId,
                              id,
                              displayName,
                            },
                            
                            ... on Employee{
                              className,
                              type: __typename,
                              objectId,
                              id,
                              displayName,
                            },

                          },

                        },
                        creditToAccountCode,
                        date,
                        paymentRef,
                        paymentMethod,
                        memo,
                        files,

                        totalHT,
                        VAT,

                        inputType,

                        expenseItemsConnection{
                          totalCount,
                          amountPaid,
                          edges{
                            node{
                              className,
                              objectId,
                              id,
                              index,
                              accountCode,
                              description,
                              amount,

                              VATPart{
                                inputType,
                                value,
                              },

                            },
                          }
                        },

                      }

                    },

                  }
                }
              },

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

              ${AddCustomerMutation.getFragment('company')},
              ${AddVendorMutation.getFragment('company')},
              ${AddProductMutation.getFragment('company')},

              ${AddBillMutation.getFragment('company')},
              ${AddExpenseMutation.getFragment('company')},
              ${MakePaymentOfBillsMutation.getFragment('company')},

              ${RemoveBillMutation.getFragment('company')},
              ${RemoveExpenseMutation.getFragment('company')},
              ${RemovePaymentOfBillsMutation.getFragment('company')},

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

              vendors(first: 100000){
                edges{
                  node{
                    active,
                    className,
                    type: __typename,
                    expensesStatus{

                      open{
                        totalCount,
                        amount,
                      },

                      overdue{
                        totalCount,
                        amount,
                      },

                    },
                    ${UpdateVendorNotesMutation.getFragment('vendor')},
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
                    if,
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

              customers(first: 100000){
                edges{
                  node{
                    active,
                    className,
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
                    if,
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

              people(first: 100000){
                edges{
                  node{

                    ... on Node{

                      ... on Vendor{
                        active,
                        className,
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
                        if,
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
                        active,
                        className,
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
                        if,
                        billing_streetAddress,
                        billing_cityTown,
                        billing_stateProvince,
                        billing_postalCode,
                        billing_country,
                        notes,
                        updatedAt,
                        createdAt,
                      },

                    },

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

            companies(first: 100000){
              edges{
                node{
                  objectId,
                  id,
                  displayName,
                  periodType,
                  lastTransactionIndex, lastPaymentsTransactionIndex,
                  createdAt,
                  updatedAt,
                }
              }
            },

          }
      `,
    },
  });
}

function createContainer({ viewer, params, company, companies, }){
  const Route = new RelayRoute({companyId: params.app});
  const MyComponent = wrapWithC(Item, { params, route: Route, });

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
                  companies: companies || { edges: [], },
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

class S extends React.Component{
  static contextTypes = {
    store: PropTypes.object.isRequired,
  };
  constructor(props, context) {
    super(props, context);
    this.context.store.dispatch(
      editStartSelection(this.props.params.id)
    );
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

module.exports = S;

function loadData({ totalCount, offset, limit, sortKey, sortDir, data: { expenses, }, }){
  return getNodes(expenses.edges);
}

function getNodes(edges){
  return edges.map(({node: {__opType, ...props}}) => {
    switch (__opType) {
      case 'Bill':           return decorateBill(props);
      case 'Expense':        return decorateExpense(props);
      case 'PaymentOfBills': return decoratePayment(props);
    }
  });
}

function getTotalCount({ expenses, }){
  return expenses.totalCount;
}

function decorateExpense({ objectId, __dataID__, totalHT, VAT, inputType, id, payee, paymentRef, creditToAccountCode, paymentMethod, mailingAddress, date, expenseItemsConnection : itemsConnection, memo, files, }) {
  return {
    __dataID__,
    id,
    date,
    mailingAddress,
    paymentMethod,
    paymentRef,
    creditToAccountCode,
    type: 'Expense',
    refNo: paymentRef,
    payee,
    balanceDue: 0.0,
    total: itemsConnection.amountPaid,
    totalAmountPaid: itemsConnection.amountPaid,
    status: 'Closed',
    memo,
    files,
    totalHT, VAT, inputType,
    itemsConnection,
    objectId,
    dueDate: date,
  };
}

function decorateBill({ objectId, __dataID__, totalHT, VAT, inputType, id, paymentRef, payee, mailingAddress, terms, date, dueDate, billItemsConnection : itemsConnection, billPaymentsConnection : paymentsConnection, memo, files, }) {
  const balanceDue = itemsConnection.totalAmount - paymentsConnection.totalAmountPaid;

  function calcBillStatus() {
    const _dueDate = moment(dueDate);
    const now = moment();

    const isPaidInFull = balanceDue === 0.0;

    if(isPaidInFull){
      return 'Closed';
    }

    if(_dueDate.isBefore(now)){
      return 'Overdue';
    }

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

function decoratePayment({ objectId, __dataID__, id, payee, paymentRef, amountReceived, creditToAccountCode, paymentMethod, date, paymentItemsConnection : itemsConnection, memo, files, }) {
  const balanceDue = amountReceived - itemsConnection.totalAmountPaid;
  return {
    __dataID__,
    id,
    payee,
    date,
    payee,
    paymentMethod,
    paymentRef,
    creditToAccountCode,
    type: 'Payment',
    refNo: '',
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

function getState(){
  const state = {};

  const date = localStorage.getItem('vendor.date');
  if(date){
    state.date = parseInt(date);
    let from = null, to = null;
    switch(date){
      case 1: // last 365 days
        from = moment().subtract(365, 'days').toDate();
        break;
      case 2: // today
        from = moment().toDate();
        to = moment().toDate();
        break;
      case 3: // yesterday
        from = moment().subtract(1, 'day').toDate();
        to = moment().subtract(1, 'day').toDate();
        break;
      case 4: // this week
        from = moment().startOf('isoWeek').toDate();
        to = moment().endOf('isoWeek').toDate();
        break;
      case 5: // this month
        from = moment().startOf('month').toDate();
        to = moment().endOf('month').toDate();
        break;
      case 6: // this quarter
        from = moment().startOf('quarter').toDate();
        to = moment().endOf('quarter').toDate();
        break;
      case 7: // this year
        from = moment().startOf('year').toDate();
        to = moment().endOf('year').toDate();
        break;
      case 8: // last week
        from = moment().subtract(1, 'week').startOf('isoWeek').toDate();
        to = moment().subtract(1, 'week').endOf('isoWeek').toDate();
        break;
      case 9: // last month
        from = moment().subtract(1, 'month').startOf('month').toDate();
        to = moment().subtract(1, 'month').endOf('month').toDate();
        break;
      case 10: // last quarter
        from = moment().subtract(1, 'quarter').startOf('quarter').toDate();
        to = moment().subtract(1, 'quarter').endOf('quarter').toDate();
        break;
      case 11: // last year
        from = moment().subtract(1, 'year').startOf('year').toDate();
        to = moment().subtract(1, 'year').endOf('year').toDate();
        break;
      case 12: // custom
        break;
      case 13: // all dates
        break;
    }
    state.from = from;
    state.to = to;
  }else{
    state.date = 13;
    state.from = null;
    state.to = null;
  }

  const sortKey = localStorage.getItem('vendor.sortKey');
  if(sortKey){
    state.sortKey = sortKey;
  }else{
    state.sortKey = null;
  }

  const sortDir = localStorage.getItem('vendor.sortDir');
  if(sortDir){
    state.sortDir = parseInt(sortDir);
  }else{
    state.sortDir = null;
  }

  const type = localStorage.getItem('vendor.type');
  if(type){
    state.type = type;
  }else{
    state.type = 'ALL';
  }
  const status = localStorage.getItem('vendor.status');
  if(status){
    state.status = status;
  }else{
    state.status = 'ALL';
  }

  return state;
}
