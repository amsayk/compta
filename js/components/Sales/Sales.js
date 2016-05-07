import React, {Component, PropTypes} from 'react';
import Relay from 'react-relay';

import { connect, } from 'react-redux';
import {bindActionCreators} from 'redux';

import { toggle, toggleAll, toggleNone, } from '../../redux/modules/selection';

import Sidebar from '../Sidebar/AppSidebar';

import LazyCache from 'react-lazy-cache';

import moment from 'moment';

import CSSModules from 'react-css-modules';

import styles from './Sales.scss';

import events from 'dom-helpers/events';

import concat from 'lodash.concat';
import orderBy from 'lodash.orderby';
import take from 'lodash.take';
import drop from 'lodash.drop';

import { SALES_ACCOUNTS_CATEGORIES, DEPOSIT_ACCOUNTS_CATEGORIES, } from '../../../data/constants';

import { getBodyWidth, } from '../../utils/dimensions';

import Revision from '../../utils/revision';

import throttle from 'lodash.throttle';

import Toolbar from './Toolbar';
import Pagination from './Pagination';
import Totals from './Totals';

import Header from './Header';
import SalesTable from './SalesTable';

import {getBodyHeight,} from '../../utils/dimensions';

import RelayRoute from '../../routes/SalesRoute';

import AddCustomerMutation from '../../mutations/AddCustomerMutation';
import AddVendorMutation from '../../mutations/AddVendorMutation';
import AddProductMutation from '../../mutations/AddProductMutation';

import AddInvoiceMutation from '../../mutations/AddInvoiceMutation';
import AddSaleMutation from '../../mutations/AddSaleMutation';
import ReceivePaymentOfInvoicesMutation from '../../mutations/ReceivePaymentOfInvoicesMutation';

import LogOutMutation from '../../mutations/LogOutMutation';
import RemoveCompanyMutation from '../../mutations/RemoveCompanyMutation';
import AddCompanyMutation from '../../mutations/AddCompanyMutation';

import RemoveInvoiceMutation from '../../mutations/RemoveInvoiceMutation';
import RemoveSaleMutation from '../../mutations/RemoveSaleMutation';
import RemovePaymentOfInvoicesMutation from '../../mutations/RemovePaymentOfInvoicesMutation';

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
  (state) => ({
    selection: state.selection.editing['sales'],
}), dispatch => bindActionCreators({ toggle, toggleAll, toggleNone, }, dispatch))
@CSSModules(styles, {allowMultiple: true})
class Sales extends Component {

  static propTypes = {
    loading: PropTypes.bool.isRequired,
  };

  static contextTypes = {
    store: PropTypes.object.isRequired,
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
        localStorage.setItem('sales.type', type);
        localStorage.setItem('sales.status', status);
        localStorage.setItem('sales.date', date);
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
        columnKey && localStorage.setItem('sales.sortKey', columnKey);
        localStorage.setItem('sales.sortDir', columnKey !== sortKey ? -1 : dir);
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
        localStorage.setItem('sales.type', type);
        localStorage.setItem('sales.status', status);
        localStorage.setItem('sales.date', date);
        customer
          ? localStorage.setItem('sales.customer', customer)
          : localStorage.removeItem('sales.customer');
      }
    });
  };

  _onPage = (offset) => {
    this.props.relay.setVariables({
      offset, rev: Revision.incrementAndGet(),
    });
  };

  _onPaymentCustomerSelected = ({id}, onReadyStateChange) => {
    this.props.relay.forceFetch({
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
    const { route, stale, loading, company, selection, toggle, toggleAll, toggleNone, } = this.props;

    const {
      type = DEFAULT_TYPE,
      offset = 0,
      status = DEFAULT_STATUS,
      limit = DEFAULT_LIMIT,
      sortKey = DEFAULT_SORT_KEY,
      sortDir = DEFAULT_SORT_DIR,
      customer,
      date,
      from,
      to,
    } = this.props.relay.variables;

    const bodyWidth = getBodyWidth();

    const totalCount = loading ? 0 : getTotalCount(company);

    // const minHeight = getBodyHeight() - 236;

    const data = loading || stale ? [] : loadData({ totalCount, offset, limit, sortKey, sortDir, company: { invoices: company.invoices, sales: company.sales, payments: company.payments, },});
    const count = data.length;

    return (
      <div className={''} styleName={''}>

        <Sidebar
          route={route}
          stale={stale}
          bodyWidth={bodyWidth}
          viewer={this.props.viewer}
          company={this.props.company}
          companies={this.props.companies.edges.map(({ node: company, }) => company)}
          root={this.props.root}
          page='/sales'
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
              filterArgs={{
                offset,
                limit,
                type,
                status,
                sortKey,
                sortDir,
                customer,
                from,
                to,
              }}
            />

            <div styleName='index' style={{/*height: 794Math.max(minHeight, 794, minHeight),*/ background: '#fff', position: 'absolute', top: 236, paddingBottom: 50,}}>

              <div styleName='table-toolbar'>

                <Toolbar
                  company={this.props.company}
                  viewer={this.props.viewer}
                  topLoading={loading}
                  filterArgs={{
                    type,
                    status,
                    customer,
                    date,
                    from,
                    to,
                  }}
                  onFilter={this._onFilter}
                />

              </div>

              <div styleName='sales-table' style={{marginTop: 3,}}>

                <SalesTable
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
                  sales={data}
                  count={count}
                  filterArgs={{
                    offset,
                    limit,
                    type,
                    status,
                    sortKey,
                    sortDir,
                    customer,
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

  class CWrapper extends Component {

    static propTypes = {
      loading: PropTypes.bool.isRequired,
    };

    _createProducts = () => {
      // if(this._p_promise || this._p_done) return;
      //
      // const faker = require('faker');
      // const Parse = require('parse');
      // const fromGlobalId = require('graphql-relay').fromGlobalId;
      //
      // const user = props.viewer;
      // const company = this.props.root.company;
      //
      // var ps = Array.from(Array(12).keys()).map(function() { return faker.commerce.productName(); });
      //
      // var promise = this._p_promise = Promise.resolve();
      //
      // const {id: localId} = fromGlobalId(company.id);
      //
      // ps.forEach(function(p){
      //   promise.then(() => {
      //     return Parse.Cloud.run('addProduct', {companyId: localId, fieldInfos: [{fieldName: 'displayName', value: p}]}, {sessionToken: user.sessionToken})
      //   });
      // });
      //
      // promise.then(() => {
      // this._p_done = true;
      //     const qury = new Parse.Query(`Product_${localId}`);
      //     qury.find({sessionToken: user.sessionToken}).then(results => {
      //       console.log('Products', results);
      //           this._p_promise = undefined;
      //     }) ;
      // });
    };
    _createCustomers = () => {
      // if(this._c_promise || this._c_done) return;
      //
      // const faker = require('faker');
      // const Parse = require('parse');
      // const fromGlobalId = require('graphql-relay').fromGlobalId;
      //
      // const user = props.viewer;
      // const company = this.props.root.company;
      //
      // const {id: localId} = fromGlobalId(company.id);
      //
      // var ps = Array.from(Array(12).keys()).map(function() { return faker.name.findName(); });
      //
      // var promise = this._c_promise = Promise.resolve();
      //
      // ps.forEach(function(p){
      //   promise.then(() => {
      //     return Parse.Cloud.run('addCustomer', {companyId: localId, displayName: p}, {sessionToken: user.sessionToken})
      //   });
      // });
      //
      // promise.then(() => {
      //   this._c_done = true;
      //
      //     const qury = new Parse.Query(`Customer_${localId}`);
      //     qury.find({sessionToken: user.sessionToken}).then(results => {
      //       console.log('Customers', results);
      //
      //           this._c_promise = undefined;
      //     }) ;
      // });
    };
    _createVendors = () => {
      // if(this._v_promise || this._v_done) return;
      //
      // const faker = require('faker');
      // const Parse = require('parse');
      // const fromGlobalId = require('graphql-relay').fromGlobalId;
      //
      // const user = props.viewer;
      // const company = this.props.root.company;
      //
      // const {id: localId} = fromGlobalId(company.id);
      //
      // var ps = Array.from(Array(12).keys()).map(function() { return faker.commerce.productName(); });
      //
      // var promise = this._v_promise = Promise.resolve();
      //
      // ps.forEach(function(p){
      //   promise.then(() => {
      //     return Parse.Cloud.run('addVendor', {companyId: localId, displayName: p}, {sessionToken: user.sessionToken})
      //   });
      // });
      //
      // promise.then(() => {
      //   this._v_done = true;
      //     const qury = new Parse.Query(`Vendor_${localId}`);
      //     qury.find({sessionToken: user.sessionToken}).then(results => {
      //       console.log('Vendors', results);
      //           this._v_promise = undefined;
      //     }) ;
      // });
    };

    static defaultProps = {
      loading: false,
      stale: false,
    };

    componentDidUpdate(){

      if(!this.props.loading){
        this._createProducts();
        this._createCustomers();
        this._createVendors();
      }

    }

    render() {
      const { stale, loading, viewer : root, relay, children, } = this.props;
      return React.createElement(
        MyComponent, {
          ...props,
          stale: stale,
          loading: loading,
          customerOpenInvoices: root.customerOpenInvoices,
          salesAccounts: root.salesAccounts,
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
      // customer: null,
      rev: 0,
      paymentCustomerId: null,
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

            customerOpenInvoices(first: 100000, companyId: $companyId, id: $paymentCustomerId){
              edges{
                node{
                  objectId,
                  id,
                  customer{
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
                  paymentsConnection{
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

            company(id: $companyId) {

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

              invoices(first: 100000, offset: $offset, limit: $limit, type: $type, status: $status, sortKey: $sortKey, sortDir: $sortDir, from: $from, to: $to, customer: $customer, _rev: $rev,){
                totalCount,
                sumOfTotals,
                sumOfBalances,
                edges{
                  node {
                    ${RemoveInvoiceMutation.getFragment('invoice')},
                    __opType: __typename,
                    createdAt,
                    objectId,
                    id,
                    customer{
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
                    billingAddress,
                    terms,
                    date,
                    dueDate,
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
                    paymentsConnection{
                      totalCount,
                      totalAmountReceived,
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
                    discountType,
                    discountValue,
                  },
                },
              },

              sales(first: 100000, offset: $offset, limit: $limit, type: $type, status: $status, sortKey: $sortKey, sortDir: $sortDir, from: $from, to: $to, customer: $customer, _rev: $rev,){
                totalCount,
                sumOfTotals,
                edges{
                  node {
                    ${RemoveSaleMutation.getFragment('sale')},
                    __opType: __typename,
                    createdAt,
                    objectId,
                    id,
                    customer{
                      className,
                      type: __typename,
                      objectId,
                      id,
                      displayName,
                      createdAt,
                    },
                    billingAddress,
                    date,
                    paymentMethod,
                    depositToAccountCode,
                    discountType,
                    discountValue,
                    memo,
                    files,
                    refNo,
                    itemsConnection{
                      totalCount,
                      amountReceived,
                      edges{
                        cursor,
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
                    }
                  }
                }
              },

              payments: paymentsOfInvoices(first: 100000, offset: $offset, limit: $limit, type: $type, status: $status, sortKey: $sortKey, sortDir: $sortDir, from: $from, to: $to, customer: $customer, _rev: $rev,){
                totalCount,
                sumOfTotals,
                sumOfCredits,
                edges{
                  node {
                    ${RemovePaymentOfInvoicesMutation.getFragment('payment')},
                    __opType: __typename,
                    createdAt,
                    objectId,
                    id,
                    customer{
                      className,
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
                    itemsConnection{
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
                              className,
                              type: __typename,
                              objectId,
                              id,
                              displayName,
                            },
                            billingAddress,
                            date,
                            dueDate,
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
                            paymentsConnection{
                              totalAmountReceived,
                            },
                            discountType,
                            discountValue,
                          },
                        }
                      }
                    }
                  }
                }
              },

              vendors(first: 1000){
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

              customers(first: 1000){
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
  const MyComponent = wrapWithC(Sales, { params, route: Route, });

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

// module.exports = function({ viewer, params, company, companies, }){
//   const Component = wrapWithC(Sales, { params, });
//   return (
//     <Relay.RootContainer
//       Component={Component}
//       forceFetch={true}
//       route={new RelayRoute({companyId: params.app})}
//       renderFetched={function(data, readyState){
//         return (
//           <Component
//             {...data}
//             stale={readyState.stale}
//           />
//         );
//       }}
//       renderLoading={function() {
//         return (
//           <Component
//             {...{viewer: {
//               ...viewer,
//               company: company,
//               companies: companies || [],
//             }}}
//             loading={true}
//           />
//         );
//       }}
//     />
//   );
// }

function loadData({ totalCount, offset, limit, sortKey, sortDir, company: {invoices, sales, payments,}, }){
  sortKey = sortKey ? sortKey : 'date';
  sortDir = sortDir ? sortDir : -1;
  const array = orderBy(
    concat(
      getNodes(invoices.edges),
      getNodes(sales.edges),
      getNodes(payments.edges)),

    sortKey === 'date'
      ? [ 'date' ]
      : [ sortKey, 'date' ],

    sortKey === 'date'
      ? [ sortDir === -1 ? 'desc' : 'asc' ]
      : [ sortDir === -1 ? 'desc' : 'asc', 'desc' ]
  );

  // return take(array, limit);
  return totalCount <= limit ? array : take(

    drop(
      array, offset
    ),

    limit
  );
}

function getNodes(edges){
  return edges.map(({node: {__opType, ...props}}) => {
    switch (__opType) {
      case 'Invoice':           return decorateInvoice(props);
      case 'Sale':              return decorateSale(props);
      case 'PaymentOfInvoices': return decoratePayment(props);
    }
  });
}

function getTotalCount({ sales, invoices, payments, }){
  return sales.totalCount + invoices.totalCount + payments.totalCount;
}

function decorateSale({
  objectId, __dataID__, id, refNo, customer, paymentRef, depositToAccountCode, paymentMethod, billingAddress, date, discountType, discountValue, itemsConnection, memo, files, }) {
  return {
    __dataID__,
    id,
    date,
    billingAddress,
    paymentMethod,
    paymentRef,
    depositToAccountCode,
    type: 'Sale',
    refNo: parseInt(refNo),
    customer,
    discountType, discountValue,
    balanceDue: 0.0,
    total: itemsConnection.amountReceived,
    totalAmountReceived: itemsConnection.amountReceived,
    status: 'Closed',
    memo,
    files,
    itemsConnection,
    objectId,
    dueDate: date,
  };
}

function decorateInvoice({ objectId, __dataID__, id, refNo, customer, billingAddress, terms, date, dueDate, discountType, discountValue, itemsConnection, paymentsConnection, memo, files, }) {
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

function getState(){
  const state = {};

  const date = localStorage.getItem('sales.date');
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

  const sortKey = localStorage.getItem('sales.sortKey');
  if(sortKey){
    state.sortKey = sortKey;
  }else{
    state.sortKey = null;
  }

  const sortDir = localStorage.getItem('sales.sortDir');
  if(sortDir){
    state.sortDir = parseInt(sortDir);
  }else{
    state.sortDir = null;
  }

  const type = localStorage.getItem('sales.type');
  if(type){
    state.type = type;
  }else{
    state.type = 'ALL';
  }
  const status = localStorage.getItem('sales.status');
  if(status){
    state.status = status;
  }else{
    state.status = 'ALL';
  }

  const customer = localStorage.getItem('sales.customer');
  if(customer){
    state.customer = customer;
  }else{
    state.customer = null;
  }

  return state;
}

function getSortKey(columnKey){
  switch (columnKey) {
    case 'age':           return 'dueDate';
    case 'latestPayment': return 'latestPaymentDate';
    default:              return columnKey;
  }
}
