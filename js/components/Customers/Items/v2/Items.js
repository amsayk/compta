import React, {Component, PropTypes} from 'react';
import Relay from 'react-relay';

import { connect, } from 'react-redux';
import {bindActionCreators} from 'redux';

import { toggle, toggleAll, toggleNone, editStart as editStartSelection, } from '../../../../redux/modules/selection';

import Sidebar from '../../../Sidebar/AppSidebar';

import LazyCache from 'react-lazy-cache';

import moment from 'moment';

import CSSModules from 'react-css-modules';

import styles from '../Items.scss';

import events from 'dom-helpers/events';

import Actions from '../../../confirm/actions';
import NotifyActions from '../../../notification/NotifyActions';

// import concat from 'lodash.concat';
// import orderBy from 'lodash.orderby';
import take from 'lodash.take';
import drop from 'lodash.drop';
// import uniq from 'lodash.uniqby';

const EMPTY_CUSTOMERS_CONNECTION = {
  sales: {
    totalCount: 0,
    edges: [],
  },
};

import {
  SALES_ACCOUNTS_CATEGORIES,
  DEPOSIT_ACCOUNTS_CATEGORIES,
} from '../../../../../data/constants';

import { getBodyWidth, } from '../../../../utils/dimensions';

import Revision from '../../../../utils/revision';

import throttle from 'lodash.throttle';

import Toolbar from '../Toolbar';
import Pagination from '../Pagination';

import Header from '../Header';
import CustomersTable from '../CustomersTable';

import {getBodyHeight,} from '../../../../utils/dimensions';

import RelayRoute from '../../../../routes/SalesRoute';

import AddCustomerMutation from '../../../../mutations/AddCustomerMutation';
import AddVendorMutation from '../../../../mutations/AddVendorMutation';
import AddProductMutation from '../../../../mutations/AddProductMutation';

import AddInvoiceMutation from '../../../../mutations/v2/AddInvoiceMutation';
import AddSaleMutation from '../../../../mutations/v2/AddSaleMutation';
import ReceivePaymentOfInvoicesMutation from '../../../../mutations/v2/ReceivePaymentOfInvoicesMutation';

import LogOutMutation from '../../../../mutations/LogOutMutation';
import RemoveCompanyMutation from '../../../../mutations/RemoveCompanyMutation';
import AddCompanyMutation from '../../../../mutations/AddCompanyMutation';

import RemoveInvoiceMutation from '../../../../mutations/v2/RemoveInvoiceMutation';
import RemoveSaleMutation from '../../../../mutations/v2/RemoveSaleMutation';
import RemovePaymentOfInvoicesMutation from '../../../../mutations/v2/RemovePaymentOfInvoicesMutation';

import messages from '../messages';

import {
  intlShape,
} from 'react-intl';

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
    selection: state.selection.editing['customers'],
}), dispatch => bindActionCreators({ toggle, toggleAll, toggleNone, }, dispatch))
@CSSModules(styles, {allowMultiple: true})
class Items extends React.Component {

  static propTypes = {
    loading: PropTypes.bool.isRequired,
  };

  static contextTypes = {
    intl: intlShape.isRequired,
    store: PropTypes.object.isRequired,
    router: PropTypes.object.isRequired,
  };

  _deactivateCustomer = (customer) => {
    const { intl, } = this.context;

    const { objectId, displayName, } = customer;

    Actions.show(intl.formatMessage(messages['ConfirmDeactivate'], { displayName, }))
      .then(() => {

        Relay.Store.commitUpdate(new AddCustomerMutation({
          id: objectId,
          fieldInfos: [ { fieldName: 'active', value: false, }],
          company: this.props.company,
          viewer: this.props.viewer,
          customer,
        }), {
          onSuccess: function ({addCustomer: {customerEdge: {node: {objectId, ...props,}}}}) {
          },
          onFailure: function (transaction) {
            const error = transaction.getError();
          },
        });
      })
      .catch(() => {});

  };

  _activateCustomer = (customer) => {
    const { intl, } = this.context;

    const { objectId, displayName, } = customer;

    Actions.show(intl.formatMessage(messages['ConfirmActivate'], { displayName, }))
      .then(() => {

        Relay.Store.commitUpdate(new AddCustomerMutation({
          id: objectId,
          fieldInfos: [ { fieldName: 'active', value: true, }],
          company: this.props.company,
          viewer: this.props.viewer,
          customer,
        }), {
          onSuccess: function ({addCustomer: {customerEdge: {node: {objectId, ...props,}}}}) {
          },
          onFailure: function (transaction) {
            const error = transaction.getError();
          },
        })
    })
    .catch(() => {});
  };

  _onTealChanged = ({paid, unpaid, overdue}, onReadyStateChange) => {
    let status = 'ALL';
    let from = moment().subtract(365, 'days').format();
    let date = 1;
    let type = 'invoices';

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
        localStorage.setItem('customers.type', type);
        localStorage.setItem('customers.status', status);
        localStorage.setItem('customers.date', date);
      }
      onReadyStateChange && onReadyStateChange({done});;
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
        columnKey && localStorage.setItem('customers.sortKey', columnKey);
        localStorage.setItem('customers.sortDir', columnKey !== sortKey ? -1 : dir);
      }
    });
  };

  _onFilter = ({
    type, status, date, from, to, customer,
  }) => {
    this.props.relay.setVariables({
      offset: 0, limit: DEFAULT_LIMIT, type, date, status, from, to, customer, rev: Revision.incrementAndGet(),
    }, function({done}){

      if(done){
        localStorage.setItem('customers.type', type);
        localStorage.setItem('customers.status', status);
        localStorage.setItem('customers.date', date);
      }
    });
  };

  _goToCustomer = (obj) => {
    setTimeout(() => {

      this.context.router.push({
        pathname: `/apps/${this.props.company.id}/customer/${obj.objectId}`,
        state: {},
      });

    }, 0);
  };

  _onPage = (offset) => {
    this.props.relay.setVariables({
      offset, rev: Revision.incrementAndGet(),
    });
  };

  _onPaymentCustomerSelected = ({id}, onReadyStateChange) => {
    this.props.relay.setVariables({
      paymentCustomerId: id,
      rev: Revision.incrementAndGet(),
    }, onReadyStateChange);
  };

  _onReceivePayment = (customer) => {
    this._onPaymentCustomerSelected({ id: customer.objectId, });
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
    const { route, customers, stale, loading, company, selection, toggle, toggleAll, toggleNone, } = this.props;

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

    const totalCount = loading || stale ? 0 : getTotalCount(type, { ...(customers || EMPTY_CUSTOMERS_CONNECTION), customers: this.props.company.customers, });

    // const minHeight = getBodyHeight() - 236;

    const data = loading || stale ? [] : loadData({
      totalCount,
      type,
      offset,
      limit,
      sortKey,
      sortDir,
      data: customers || EMPTY_CUSTOMERS_CONNECTION,
      customers: this.props.company.customers,
    });

    const count = data.length;

    return (
      <div className={'height100Percent'} styleName={''}>

        <Sidebar
          route={route}
          bodyWidth={bodyWidth}
          viewer={this.props.viewer}
          company={this.props.company}
          companies={this.props.companies.edges.map(({ node: company, }) => company)}
          root={this.props.root}
          page='/customers'
        />

        <div className='content'>

          <div styleName='page'>

            <Header
              salesStatus={loading ? undefined : this.props.company.salesStatus}
              onPaymentCustomerSelected={this._onPaymentCustomerSelected}
              customerOpenInvoices={this.props.customerOpenInvoices}
              salesAccounts={this.props.salesAccounts}
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

            <div styleName='index' style={{
              /*minHeight: 794Math.max(minHeight, 794, minHeight),*/
              background: '#fff',
              position: 'absolute',
              top: 236,
              /*paddingBottom: 50,*/
            }}>

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

              <div styleName='customers-table' style={{marginTop: 3,}}>

                <CustomersTable
                  onActivate={this._activateCustomer}
                  onDeactivate={this._deactivateCustomer}
                  onReceivePayment={this._onReceivePayment}
                  onPaymentCustomerSelected={this._onPaymentCustomerSelected}
                  selection={selection}
                  toggle={toggle}
                  toggleAll={toggleAll}
                  toggleNone={toggleNone}
                  customerOpenInvoices={this.props.customerOpenInvoices}
                  salesAccounts={this.props.salesAccounts}
                  depositsAccounts={this.props.depositsAccounts}
                  bodyWidth={bodyWidth}
                  relay={this.props.relay}
                  company={this.props.company}
                  viewer={this.props.viewer}
                  topLoading={loading || stale}
                  styles={this.props.styles}
                  totalCount={totalCount}
                  onSortChange={this._onSortChange}
                  customers={data}
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
                  goToCustomer={this._goToCustomer}
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
          customers: root.customers,
          customerOpenInvoices: root.customerOpenInvoices,
          salesAccounts: root.salesAccounts,
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
      salesAccountsCategories: SALES_ACCOUNTS_CATEGORIES,
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
      paymentCustomerId: null,
      skipCustomersQuery: false,
    },

    prepareVariables({ to, from, ...vars, }){
      return {
        ...vars,
        skipCustomersQuery: vars.type === 'ALL',
        to: to ? moment(to).toDate() : null,
        from: from ? moment(from).toDate() : null,
      };
    },

    // prepareVariables(variables){
    //   return {
    //     ...variables,
    //     skipCustomersQuery: variables.type === 'ALL',
    //   }
    // },

    fragments: {
      viewer: () => Relay.QL`
          fragment on User {

            customerOpenInvoices(first: 100000, companyId: $companyId, id: $paymentCustomerId){
              edges{
                node{
                  objectId,
                  id,
                  customer{
                    active,
                    ${AddCustomerMutation.getFragment('customer')},
                    className,
                    type: __typename,
                    objectId,
                    id,
                    displayName,
                  },
                  billingAddress,
                  date,
                  dueDate,
                  terms,

                  totalHT,
                  VAT,

                  inputType,
                  
                  memo,
                  files,
                  refNo,
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
                          className,
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

            ${LogOutMutation.getFragment('viewer')},
            ${RemoveCompanyMutation.getFragment('viewer')},
            ${AddCompanyMutation.getFragment('viewer')},

            ${AddInvoiceMutation.getFragment('viewer')},
            ${AddSaleMutation.getFragment('viewer')},
            ${ReceivePaymentOfInvoicesMutation.getFragment('viewer')},

            ${RemoveInvoiceMutation.getFragment('viewer')},
            ${RemoveSaleMutation.getFragment('viewer')},
            ${RemovePaymentOfInvoicesMutation.getFragment('viewer')},

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

            customers: getCustomers(companyId: $companyId) @skip(if: $skipCustomersQuery){

              sales(
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
                    active,
                    className,

                    salesStatus{

                      open{
                        totalCount,
                        amount,
                      },

                      overdue{
                        totalCount,
                        amount,
                      },

                    },

                    ${AddCustomerMutation.getFragment('customer')}

                    objectId,
                    id,
                    displayName,
                    image,
                    title,
                    givenName,
                    middleName,
                    familyName,
                    affiliation,
                    if,
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

              salesStatus{

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

              vendors(first: 100000){
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
                    ${AddCustomerMutation.getFragment('customer')}
                    salesStatus{

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
                    if,
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

function loadData({ totalCount, type, offset, limit, sortKey, sortDir, data: { invoices, sales, payments, }, customers, }){
  sortKey = sortKey ? sortKey : 'date';
  sortDir = sortDir ? sortDir : -1;

  const array = type === 'ALL'
      ? getNodes(customers.edges)
      : getNodes(sales.edges);

  return totalCount <= limit ? array : take(

    drop(
      array, offset
    ),

    limit
  );
}

function getNodes(edges){
  return edges.map(({node: {...props}}) => decorateCustomer(props));
}

function getTotalCount(type, { customers, sales, }){
  return (type === 'ALL' ? customers.edges.length : sales.totalCount);
}

function decorateCustomer({
  ...props, }) {
  return {
    ...props,
    openBalance: props.salesStatus ? props.salesStatus.open.amount : 0.0,
  };
}

function getState(){
  const state = {};

  const date = localStorage.getItem('customers.date');
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

  const sortKey = localStorage.getItem('customers.sortKey');
  if(sortKey){
    state.sortKey = sortKey;
  }else{
    state.sortKey = null;
  }

  const sortDir = localStorage.getItem('customers.sortDir');
  if(sortDir){
    state.sortDir = parseInt(sortDir);
  }else{
    state.sortDir = null;
  }

  const type = localStorage.getItem('customers.type');
  if(type){
    state.type = type;
  }else{
    state.type = 'ALL';
  }
  const status = localStorage.getItem('customers.status');
  if(status){
    state.status = status;
  }else{
    state.status = 'ALL';
  }

  return state;
}
