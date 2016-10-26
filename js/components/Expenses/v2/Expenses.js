import React, {Component, PropTypes} from 'react';
import Relay from 'react-relay';

import LoadingActions from '../../Loading/actions';

import Sidebar from '../../Sidebar/AppSidebar';

import CSSModules from 'react-css-modules';

import { connect, } from 'react-redux';
import {bindActionCreators} from 'redux';
import { toggle, toggleAll, toggleNone, } from '../../../redux/modules/selection';

import styles from '../Expenses.scss';

// import concat from 'lodash.concat';
// import orderBy from 'lodash.orderby';
// import take from 'lodash.take';
// import drop from 'lodash.drop';

import moment from 'moment';

import LazyCache from 'react-lazy-cache';

import {
  EXPENSES_ACCOUNTS_CATEGORIES,
  CREDIT_ACCOUNTS_CATEGORIES,
} from '../../../../data/constants';

import RelayRoute from '../../../routes/ExpensesRoute';

import Revision from '../../../utils/revision';

import throttle from 'lodash.throttle';

import events from 'dom-helpers/events';

import Toolbar from '../Toolbar';
import Pagination from '../Pagination';
import Totals from '../Totals';

import Header from '../Header';
import ExpensesTable from '../ExpensesTable';

import { getBodyHeight, getBodyWidth, } from '../../../utils/dimensions';

const DEFAULT_TYPE     = 'ALL';
const DEFAULT_STATUS   = 'ALL';
const DEFAULT_LIMIT    = 7;
const DEFAULT_SORT_KEY = 'date';
const DEFAULT_SORT_DIR = -1;

import AddCustomerMutation from '../../../mutations/AddCustomerMutation';
import AddVendorMutation from '../../../mutations/AddVendorMutation';
import AddProductMutation from '../../../mutations/AddProductMutation';

import AddBillMutation from '../../../mutations/v2/AddBillMutation';
import AddExpenseMutation from '../../../mutations/v2/AddExpenseMutation';
import MakePaymentOfBillsMutation from '../../../mutations/v2/MakePaymentOfBillsMutation';

import LogOutMutation from '../../../mutations/LogOutMutation';
import RemoveCompanyMutation from '../../../mutations/RemoveCompanyMutation';
import AddCompanyMutation from '../../../mutations/AddCompanyMutation';

import RemoveExpenseMutation from '../../../mutations/v2/RemoveExpenseMutation';
import RemoveBillMutation from '../../../mutations/v2/RemoveBillMutation';
import RemovePaymentOfBillsMutation from '../../../mutations/v2/RemovePaymentOfBillsMutation';

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
  (state) => ({
    selection: state.selection.editing['expenses'],
}), dispatch => bindActionCreators({ toggle, toggleAll, toggleNone, }, dispatch))
@CSSModules(styles, {allowMultiple: true})
class Expenses extends React.Component {

  static propTypes = {
    loading: PropTypes.bool.isRequired,
  };

  static contextTypes = {
    store: PropTypes.object.isRequired,
  };

  _onSortChange = (columnKey, dir) => {
    const {
      sortKey = DEFAULT_SORT_KEY,
    } = this.props.relay.variables;
    this.props.relay.setVariables({
      sortKey: columnKey,
      sortDir: columnKey !== sortKey ? -1 : dir,
      rev: Revision.incrementAndGet(),
    }, function({done}){

      if(done){
        columnKey && localStorage.setItem('expenses.sortKey', columnKey);
        localStorage.setItem('expenses.sortDir', columnKey !== sortKey ? -1 : dir);
      }
    });
  };

  _onFilter = ({
    type, status, date, from, to, payee, customer,
  }) => {
    this.props.relay.setVariables({
      offset: 0, limit: DEFAULT_LIMIT, type, date, status, from, to, payee, customer, rev: Revision.incrementAndGet(),
    }, function({done}){

      if(done){
        localStorage.setItem('expenses.type', type);
        localStorage.setItem('expenses.status', status);
        localStorage.setItem('expenses.date', date);
        payee
          ? localStorage.setItem('expenses.payee', payee)
          : localStorage.removeItem('expenses.payee');

        customer
          ? localStorage.setItem('expenses.customer', customer)
          : localStorage.removeItem('expenses.customer');
      }
    });
  };

  _onPage = (offset) => {
    this.props.relay.setVariables({
      offset, rev: Revision.incrementAndGet(),
    });
  };

  _onPaymentVendorSelected = ({ id, }, onReadyStateChange) => {
    this.props.relay.forceFetch({
      paymentVendorId: id,
      rev: Revision.incrementAndGet(),
    }, function ({done,}) {
      if(done){
        LoadingActions.hide();
        onReadyStateChange && onReadyStateChange({done});
      }else{
        LoadingActions.show();
      }
    });
  };

  _onReceivePayment = ({ objectId, }) => {
    this._onPaymentVendorSelected({
      id: objectId,
    });
  };

  componentWillUnmount() {
    events.off(window, 'resize', this._handleWindowResize);
  }

  _handleWindowResize = throttle(() => {
    this.forceUpdate();
  }, 150);

  componentDidMount(){
    events.on(window, 'resize', this._handleWindowResize);
  }

  render() {
    const { route, stale, loading, company, selection, toggle, toggleAll, toggleNone, } = this.props;

    const {
      type = DEFAULT_TYPE,
      offset = 0,
      status = DEFAULT_STATUS,
      limit = DEFAULT_LIMIT,
      sortKey = DEFAULT_SORT_KEY,
      sortDir = DEFAULT_SORT_DIR,
      customer,
      payee,
      date,
      from,
      to,
    } = this.props.variables;

    const bodyWidth = getBodyWidth();

    const totalCount = loading ? 0 : getTotalCount(company);

    // const minHeight = getBodyHeight() - 236;

    const data = loading || stale ? [] : loadData({ totalCount, offset, limit, sortKey, sortDir, company: { expenses: company.expenses, },});
    const count = data.length;

    return (
      <div className=''>

        <Sidebar
          route={route}
          stale={stale}
          bodyWidth={bodyWidth}
          viewer={this.props.viewer}
          company={this.props.company}
          companies={this.props.companies.edges.map(({ node: company, }) => company)}
          root={this.props.root}
          page='/expenses'
        />

        <div className='content'>

          <div styleName='page'>

            <Header
              onReceivePayment={this._onReceivePayment}
              onPaymentVendorSelected={this._onPaymentVendorSelected}
              vendorOpenBills={this.props.vendorOpenBills}
              expensesAccounts={this.props.expensesAccounts}
              depositsAccounts={this.props.depositsAccounts}
              bodyWidth={bodyWidth}
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
                customer,
                payee,
                from,
                to,
              }}
            />

            <div styleName='index' style={{
            // minHeight: document.body.scrollHeight - 96 - 50,
            minHeight: screen.height - 96 - 50 - 25 - 3,
            background: '#fff',
            position: 'absolute',
            top: 96,
            paddingBottom: 50,
             overflowX: 'hidden',
            }}>

              <div styleName='table-toolbar'>

                <Toolbar
                  company={this.props.company}
                  viewer={this.props.viewer}
                  topLoading={loading}
                  filterArgs={{
                    type,
                    status,
                    payee,
                    customer,
                    date,
                    from,
                    to,
                  }}
                  onFilter={this._onFilter}
                />

              </div>

              <div styleName='expenses-table' style={{marginTop: 3}}>

                <ExpensesTable
                  onReceivePayment={this._onReceivePayment}
                  onPaymentVendorSelected={this._onPaymentVendorSelected}
                  selection={selection}
                  toggle={toggle}
                  toggleAll={toggleAll}
                  toggleNone={toggleNone}
                  vendorOpenBills={this.props.vendorOpenBills}
                  expensesAccounts={this.props.expensesAccounts}
                  depositsAccounts={this.props.depositsAccounts}
                  bodyWidth={bodyWidth}
                  relay={this.props.relay}
                  company={this.props.company}
                  viewer={this.props.viewer}
                  topLoading={loading || stale}
                  styles={this.props.styles}
                  totalCount={totalCount}
                  onSortChange={this._onSortChange}
                  expenses={data}
                  count={count}
                  filterArgs={{
                    offset,
                    limit,
                    type,
                    status,
                    sortKey,
                    sortDir,
                    customer,
                    payee,
                    from,
                    to,
                  }}
                  page={offset / limit}
                />

              </div>

              {loading || stale ? null : (totalCount > 0 && <div styleName='totals'>

                <Totals
                  page={offset / limit}
                  selection={selection}
                  company={this.props.company}
                  bodyWidth={bodyWidth}
                  count={count}
                  totalCount={totalCount}
                  styles={this.props.styles}
                  filterArgs={{
                    offset,
                    limit,
                    type,
                    status,
                    sortKey,
                    sortDir,
                    customer,
                    payee,
                    from,
                    to,
                  }}
                />

              </div>)}

              {loading || stale ? null : (totalCount > limit ? <div styleName='pagination'>

                <Pagination
                  offset={offset}
                  limit={limit}
                  count={count}
                  totalCount={totalCount}
                  onPage={this._onPage}
                />

              </div> : null)}

            </div>

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
      expensesAccountsCategories: EXPENSES_ACCOUNTS_CATEGORIES,
      creditAccountsAccountsCategories: CREDIT_ACCOUNTS_CATEGORIES,
      limit: DEFAULT_LIMIT,
      offset: 0,
      // type: 'ALL',
      // status: 'ALL',
      // date: 1,
      // from: null,
      // to: null,
      // sortKey: null,
      // sortDir: null,
      // customer: null,
      // payee: null,
      rev: 0,
      paymentVendorId: null,
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

          vendorOpenBills(first: 100000, companyId: $companyId, id: $paymentVendorId){
            edges{
              node{
                objectId,
                id,
                payee{
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
                terms,

                totalHT,
                VAT,

                inputType,

                memo,
                files,
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

          depositsAccounts: accountsByCategories(categories: $creditAccountsAccountsCategories){
            code,
            name,
            _groupCode,
            _categoryCode,
            _classCode,
          },

          company(id: $companyId){

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

            ${AddVendorMutation.getFragment('company')},
            ${AddCustomerMutation.getFragment('company')},
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
              payee: $payee,
              customer: $customer,
              _rev: $rev
            ){

              totalCount,

              billsSumOfTotals,
              billsSumOfBalances,

              expensesSumOfTotals,
              expensesSumOfBalances,

              paymentsSumOfTotals,
              paymentsSumOfCredits,

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

            vendors(first: 1000){
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
  const MyComponent = wrapWithC(Expenses, { params, route: Route, });

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

module.exports = S;

// module.exports = (props) => {
//   const Component = wrapWithC(Expenses, props);
//   return (
//     <Relay.RootContainer
//       forceFetch={true}
//       Component={Component}
//       route={new RelayRoute({companyId: props.params.app})}
//       renderLoading={function() {
//       return (
//         <Component
//           viewer={props.viewer}
//           {...{root: {
//             id: 'ROOT',
//             company: props.company,
//             companies: props.companies || [],
//           }}}
//           loading={true}
//         />
//       );
//     }}
//     />
//   )
// };

function loadData({ totalCount, offset, limit, sortKey, sortDir, company: { expenses, }, }){
  // sortKey = sortKey ? sortKey : 'date';
  // sortDir = sortDir ? sortDir : -1;
  // const array = orderBy(
  //   concat(
  //     getNodes(expenses.edges),
  //     getNodes(bills.edges),
  //     getNodes(payments.edges)),
  //
  //   sortKey === 'date'
  //     ? [ 'date' ]
  //     : [ sortKey, 'date' ],
  //
  //   sortKey === 'date'
  //     ? [ sortDir === -1 ? 'desc' : 'asc' ]
  //     : [ sortDir === -1 ? 'desc' : 'asc', 'desc' ]
  // );
  //
  // // return drop(
  // //   take(array, limit), offset
  // // );
  //
  // return totalCount <= limit ? array : take(
  //
  //   drop(
  //     array, offset
  //   ),
  //
  //   limit
  // );

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

function decorateBill({ objectId, __dataID__, totalHT, VAT, inputType, id, payee, paymentRef, mailingAddress, terms, date, dueDate, billItemsConnection : itemsConnection, billPaymentsConnection : paymentsConnection, memo, files, }) {
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
    paymentRef,
    mailingAddress,
    type: 'Bill',
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

function decoratePayment({ objectId, __dataID__, id, mailingAddress, payee, paymentRef, amountReceived, creditToAccountCode, paymentMethod, date, paymentItemsConnection : itemsConnection, memo, files, }) {
  const balanceDue = amountReceived - itemsConnection.totalAmountPaid;
  return {
    __dataID__,
    id,
    payee,
    date,
    paymentMethod,
    paymentRef,
    creditToAccountCode,
    type: 'Payment',
    refNo: paymentRef,
    mailingAddress,
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

  const date = localStorage.getItem('expenses.date');
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
    state.date = 1;
    state.from = null;
    state.to = null;
  }

  const sortKey = localStorage.getItem('expenses.sortKey');
  if(sortKey){
    state.sortKey = sortKey;
  }else{
    state.sortKey = null;
  }

  const sortDir = localStorage.getItem('expenses.sortDir');
  if(sortDir){
    state.sortDir = parseInt(sortDir);
  }else{
    state.sortDir = null;
  }

  const type = localStorage.getItem('expenses.type');
  if(type){
    state.type = type;
  }else{
    state.type = 'ALL';
  }
  const status = localStorage.getItem('expenses.status');
  if(status){
    state.status = status;
  }else{
    state.status = 'ALL';
  }

  const payee = localStorage.getItem('expenses.payee');
  if(payee){
    state.payee = payee;
  }else{
    state.payee = null;
  }
  const customer = localStorage.getItem('expenses.customer');
  if(customer){
    state.customer = customer;
  }else{
    state.customer = null;
  }

  return state;
}
