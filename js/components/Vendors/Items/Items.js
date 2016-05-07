import React, {Component, PropTypes} from 'react';
import Relay from 'react-relay';

import { connect, } from 'react-redux';
import {bindActionCreators} from 'redux';

import { toggle, toggleAll, toggleNone, editStart as editStartSelection, } from '../../../redux/modules/selection';

import Sidebar from '../../Sidebar/AppSidebar';

import LazyCache from 'react-lazy-cache';

import moment from 'moment';

import CSSModules from 'react-css-modules';

import styles from './Items.scss';

import events from 'dom-helpers/events';

import concat from 'lodash.concat';
import orderBy from 'lodash.orderby';
import take from 'lodash.take';
import drop from 'lodash.drop';
import uniq from 'lodash.uniqby';

const EMPTY_VENDORS_CONNECTION = {
  bills: {
    totalCount: 0,
    edges: [],
  },
  expenses: {
    totalCount: 0,
    edges: [],
  },
  payments: {
    totalCount: 0,
    edges: [],
  },
};

import {
  SALES_ACCOUNTS_CATEGORIES,
  DEPOSIT_ACCOUNTS_CATEGORIES,
} from '../../../../data/constants';

import { getBodyWidth, } from '../../../utils/dimensions';

import Revision from '../../../utils/revision';

import throttle from 'lodash.throttle';

import Toolbar from './Toolbar';
import Pagination from './Pagination';

import Header from './Header';
import VendorsTable from './VendorsTable';

import {getBodyHeight,} from '../../../utils/dimensions';

import RelayRoute from '../../../routes/ExpensesRoute';

import AddVendorMutation from '../../../mutations/AddVendorMutation';
import AddCustomerMutation from '../../../mutations/AddCustomerMutation';
import AddProductMutation from '../../../mutations/AddProductMutation';

import AddBillMutation from '../../../mutations/AddBillMutation';
import AddExpenseMutation from '../../../mutations/AddExpenseMutation';
import ReceivePaymentOfBillsMutation from '../../../mutations/ReceivePaymentOfBillsMutation';

import LogOutMutation from '../../../mutations/LogOutMutation';
import RemoveCompanyMutation from '../../../mutations/RemoveCompanyMutation';
import AddCompanyMutation from '../../../mutations/AddCompanyMutation';

import RemoveBillMutation from '../../../mutations/RemoveBillMutation';
import RemoveExpenseMutation from '../../../mutations/RemoveExpenseMutation';
import RemovePaymentOfBillsMutation from '../../../mutations/RemovePaymentOfBillsMutation';

const DEFAULT_TYPE     = 'ALL';
const DEFAULT_STATUS   = 'ALL';
const DEFAULT_LIMIT    = 7;
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
  (state) => ({
    selection: state.selection.editing['vendors'],
}), dispatch => bindActionCreators({ toggle, toggleAll, toggleNone, }, dispatch))
@CSSModules(styles, {allowMultiple: true})
class Items extends Component {

  static propTypes = {
    loading: PropTypes.bool.isRequired,
  };

  static contextTypes = {
    store: PropTypes.object.isRequired,
    router: PropTypes.object.isRequired,
  };

  _onTealChanged = ({paid, unpaid, overdue}, onReadyStateChange) => {
    let status = 'ALL';
    let from = moment().subtract(365, 'days').format();
    let date = 1;
    let type = 'bills';

    if(paid){
      status = 'closed';
      from = moment().subtract(30, 'days').format();
      date = 12;
      type = 'recent';
    }
    else if(unpaid){
      status = 'open';
    }
    else if(overdue){
      status = 'overdue';
    }else{
      type = 'ALL';
      status = 'ALL';
      date = 1;
      from = undefined;
    }

    this.props.relay.setVariables({
      offset: 0, limit: DEFAULT_LIMIT,
      type,
      status,
      date,
      from, to: undefined,
      rev: Revision.incrementAndGet(),
    }, function({done}){

      if(done){
        localStorage.setItem('vendors.type', type);
        localStorage.setItem('vendors.status', status);
        localStorage.setItem('vendors.date', date);
      }
      onReadyStateChange && onReadyStateChange({done});;
    });
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
        columnKey && localStorage.setItem('vendors.sortKey', columnKey);
        localStorage.setItem('vendors.sortDir', columnKey !== sortKey ? -1 : dir);
      }
    });
  };

  _onFilter = ({
    type, status, date, from, to, vendor,
  }) => {
    this.props.relay.setVariables({
      offset: 0, limit: DEFAULT_LIMIT, type, date, status, from, to, vendor, rev: Revision.incrementAndGet(),
    }, function({done}){

      if(done){
        localStorage.setItem('vendors.type', type);
        localStorage.setItem('vendors.status', status);
        localStorage.setItem('vendors.date', date);
      }
    });
  };

  _onPage = (offset) => {
    this.props.relay.setVariables({
      offset, rev: Revision.incrementAndGet(),
    });
  };

  _goToVendor = (obj) => {
    setTimeout(() => {

      this.context.router.push({
        pathname: `/apps/${this.props.company.id}/vendor/${obj.objectId}`,
        state: {},
      });

    }, 0);
  };

  _onPaymentVendorSelected = ({id}, onReadyStateChange) => {
    this.props.relay.setVariables({
      paymentVendorId: id,
      rev: Revision.incrementAndGet(),
    }, onReadyStateChange);
  };

  _onReceivePayment = (vendor) => {
    this._onPaymentVendorSelected({ id: vendor.objectId, });
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
    const { route, vendors, stale, loading, company, selection, toggle, toggleAll, toggleNone, } = this.props;

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
    } = this.props.relay.variables;

    const bodyWidth = getBodyWidth();

    const totalCount = loading || stale ? 0 : getTotalCount(type, { ...(vendors || EMPTY_VENDORS_CONNECTION), vendors: this.props.company.vendors, });

    // const minHeight = getBodyHeight() - 236;

    const data = loading || stale ? [] : loadData({
      totalCount,
      type,
      offset,
      limit,
      sortKey,
      sortDir,
      data: vendors || EMPTY_VENDORS_CONNECTION,
      vendors: this.props.company.vendors,
    });

    const count = data.length;

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

        <div className='content'>

          <div styleName='page'>

            <Header
              expensesStatus={loading ? undefined : this.props.company.expensesStatus}
              onPaymentVendorSelected={this._onPaymentVendorSelected}
              vendorOpenBills={this.props.vendorOpenBills}
              expensesAccounts={this.props.expensesAccounts}
              depositsAccounts={this.props.depositsAccounts}
              bodyWidth={bodyWidth}
              onTealChanged={this._onTealChanged}
              company={this.props.company}
              viewer={this.props.viewer}
              topLoading={loading}
              onFilter={this._onFilter}
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

            <div styleName='index' style={{/*minHeight: 794Math.max(minHeight, 794, minHeight),*/ background: '#fff', position: 'absolute', top: 236, /*paddingBottom: 50,*/}}>

              <div styleName='table-toolbar'>

                <Toolbar
                  company={this.props.company}
                  viewer={this.props.viewer}
                  topLoading={loading}
                  filterArgs={{
                    type,
                    status,
                    date,
                    from,
                    to,
                  }}
                  onFilter={this._onFilter}
                />

              </div>

              <div styleName='vendors-table' style={{marginTop: 3,}}>

                <VendorsTable
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
                  vendors={data}
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
                  goToVendor={this._goToVendor}
                />

              </div>

              {/*{loading || stale ? null : (totalCount > 0 && <div styleName='totals'>

                <Totals
                  page={offset / limit}
                  selection={selection}
                  company={this.props.company}
                  bodyWidth={bodyWidth}
                  totalCount={totalCount}
                  styles={this.props.styles}
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
          vendors: root.vendors,
          vendorOpenBills: root.vendorOpenBills,
          expensesAccounts: root.expensesAccounts,
          depositsAccounts: root.depositsAccounts,
          companies: root.companies,
          company: root.company,
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
      ...getState(),

      companyId: props.params.app,
      expensesAccountsCategories: SALES_ACCOUNTS_CATEGORIES,
      depositAccountsAccountsCategories: DEPOSIT_ACCOUNTS_CATEGORIES,
      limit: DEFAULT_LIMIT,
      offset: 0,
      // type: 'ALL',
      // status: 'ALL',
      // date: 1,
      // from: null,
      // to: null,
      // sortKey: null,
      // sortDir: null,
      rev: 0,
      paymentVendorId: null,
      skipVendorsQuery: false,
    },

    prepareVariables({ to, from, ...vars, }){
      return {
        ...vars,
        skipVendorsQuery: vars.type === 'ALL',
        to: to ? moment(to).toDate() : null,
        from: from ? moment(from).toDate() : null,
      };
    },

    // prepareVariables(variables){
    //   return {
    //     ...variables,
    //     skipVendorsQuery: variables.type === 'ALL',
    //   }
    // },

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
                  terms,
                  memo,
                  files,
                  paymentRef,
                  itemsConnection{
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

            ${LogOutMutation.getFragment('viewer')},
            ${RemoveCompanyMutation.getFragment('viewer')},
            ${AddCompanyMutation.getFragment('viewer')},

            ${AddBillMutation.getFragment('viewer')},
            ${AddExpenseMutation.getFragment('viewer')},
            ${ReceivePaymentOfBillsMutation.getFragment('viewer')},

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

            vendors: getVendors(companyId: $companyId) @skip(if: $skipVendorsQuery){

              bills(first: 100000, offset: $offset, limit: $limit, type: $type, status: $status, sortKey: $sortKey, sortDir: $sortDir, from: $from, to: $to, _rev: $rev,){
                totalCount,
                edges{
                  node {
                    className,

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
                },
              },

              expenses(first: 100000, offset: $offset, limit: $limit, type: $type, status: $status, sortKey: $sortKey, sortDir: $sortDir, from: $from, to: $to, _rev: $rev,){
                totalCount,
                edges{
                  node {
                    className,

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

              payments(first: 100000, offset: $offset, limit: $limit, type: $type, status: $status, sortKey: $sortKey, sortDir: $sortDir, from: $from, to: $to, _rev: $rev,){
                totalCount,
                edges{
                  node {
                    className,

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

            }

            company(id: $companyId) {

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

                closed{
                  totalCount,
                  amount,
                  edges{
                    node{
                      value {
                        objectId,
                        id,
                      }
                    }
                  }
                },

              },

              ${AddCustomerMutation.getFragment('company')},
              ${AddVendorMutation.getFragment('company')},
              ${AddProductMutation.getFragment('company')},

              ${AddBillMutation.getFragment('company')},
              ${AddExpenseMutation.getFragment('company')},
              ${ReceivePaymentOfBillsMutation.getFragment('company')},

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

              customers(first: 100000){
                edges{
                  node{
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
                  }
                }
              },

              vendors(first: 100000){
                edges{
                  node{
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

                    },

                  }
                }
              },

              companyProducts(first: 1000){
                edges{
                  node{
                    className,
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
  const MyComponent = wrapWithC(Items, { params, route: Route, });

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

function loadData({ totalCount, type, offset, limit, sortKey, sortDir, data: { bills, expenses, payments, }, vendors, }){
  sortKey = sortKey ? sortKey : 'date';
  sortDir = sortDir ? sortDir : -1;
  const array = orderBy(
    type === 'ALL'
      ? getNodes(vendors.edges)
      : uniq(
          concat(
            getNodes(bills.edges),
            getNodes(expenses.edges),
            getNodes(payments.edges),
          ),

          'objectId',
        ),

    sortKey === 'date'
      ? [ obj => obj.date ]
      : [ sortKey, 'date' ],

    sortKey === 'date'
      ? [ sortDir === -1 ? 'desc' : 'asc' ]
      : [ sortDir === -1 ? 'desc' : 'asc', 'desc' ]
  );

  return totalCount <= limit ? array : take(

    drop(
      array, offset
    ),

    limit
  );
}

function getNodes(edges){
  return edges.map(({node: {...props}}) => decorateVendor(props));
}

function getTotalCount(type, { vendors, bills, expenses, payments, }){
  return (type === 'ALL' ? vendors.edges.length : bills.totalCount + expenses.totalCount + payments.totalCount);
}

function decorateVendor({
  ...props, }) {
  return {
    ...props,
    openBalance: props.expensesStatus.open.amount,
  };
}

function getState(){
  const state = {};

  const date = localStorage.getItem('vendors.date');
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

  const sortKey = localStorage.getItem('vendors.sortKey');
  if(sortKey){
    state.sortKey = sortKey;
  }else{
    state.sortKey = null;
  }

  const sortDir = localStorage.getItem('vendors.sortDir');
  if(sortDir){
    state.sortDir = parseInt(sortDir);
  }else{
    state.sortDir = null;
  }

  const type = localStorage.getItem('vendors.type');
  if(type){
    state.type = type;
  }else{
    state.type = 'ALL';
  }
  const status = localStorage.getItem('vendors.status');
  if(status){
    state.status = status;
  }else{
    state.status = 'ALL';
  }

  return state;
}
