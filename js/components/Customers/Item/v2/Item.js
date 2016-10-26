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
  SALES_ACCOUNTS_CATEGORIES,
  DEPOSIT_ACCOUNTS_CATEGORIES,
} from '../../../../../data/constants';

import classnames from 'classnames';

import { getBodyWidth, } from '../../../../utils/dimensions';

import Revision from '../../../../utils/revision';

import throttle from 'lodash.throttle';

import Toolbar from '../Toolbar';
import Pagination from '../Pagination';
import CustomerInfo from '../CustomerInfo';

import Header from '../Header';
import SalesTable from '../SalesTable';

import {getBodyHeight,} from '../../../../utils/dimensions';

import RelayRoute from '../../../../routes/SalesRoute';

import UpdateCustomerNotesMutation from '../../../../mutations/UpdateCustomerNotesMutation';

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

const DEFAULT_TYPE     = 'ALL';
const DEFAULT_STATUS   = 'ALL';
const DEFAULT_LIMIT    = 15;
const DEFAULT_SORT_KEY = 'date';
const DEFAULT_SORT_DIR = -1;

function clamp(value, min, max){
  return Math.min(Math.max(value, min), max);
}

import List from '../List';

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

  state = { selectedKey: 1, drawerOpen: localStorage.getItem('customer.drawerOpen') === null ? false : function(){ try{ return JSON.parse(localStorage.getItem('customer.drawerOpen')); } catch(e) { return false; }}(), };

  _toggleDrawer = () => {
    this.setState({
      drawerOpen: !this.state.drawerOpen,
    }, () => {
      localStorage.setItem('customer.drawerOpen', this.state.drawerOpen);
    });
  };

  _onSortChange = (columnKey, dir, onReadyStateChange) => {
    const {
      sortKey = DEFAULT_SORT_KEY,
    } = this.props.variables;
    this.props.relay.setVariables({
      sortKey: columnKey,
      sortDir: columnKey !== sortKey ? -1 : dir,
      rev: Revision.incrementAndGet(),
    }, function({done}){

      if(done){
        columnKey && localStorage.setItem('customer.sortKey', columnKey);
        localStorage.setItem('customer.sortDir', columnKey !== sortKey ? -1 : dir);
      }
      onReadyStateChange && onReadyStateChange({done});;
    });
  };

  _onFilter = ({
    type, status, date, from, to,
  }) => {
    this.props.relay.setVariables({
      offset: 0, limit: DEFAULT_LIMIT, type, date, status, from, to, rev: Revision.incrementAndGet(),
    }, function({done}){

      if(done){
        localStorage.setItem('customer.type', type);
        localStorage.setItem('customer.status', status);
        localStorage.setItem('customer.date', date);
      }
    });
  };

  _onPage = (offset) => {
    this.props.relay.setVariables({
      offset, rev: Revision.incrementAndGet(),
    });
  };

  _onPaymentCustomerSelected = ({id}, onReadyStateChange) => {
    this.props.relay.setVariables({
      paymentCustomerId: typeof id === 'undefined' ? this.props.customer.objectId : id,
      rev: Revision.incrementAndGet(),
    }, onReadyStateChange);
  };

  _onReceivePayment = (customer) => {
    this._onPaymentCustomerSelected({ id: customer.objectId, });
  };

  componentWillUnmount() {
    editStopSelection(this.props.customer.objectId);
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
    const { route, customer, stale, loading, company, selection, toggle, toggleAll, toggleNone, } = this.props;

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

    const bodyWidth = getBodyWidth() - 2;

    const totalCount = loading ? 0 : getTotalCount({ sales: customer.sales, });

    // const minHeight = getBodyHeight() - 236;

    const data = loading || stale ? [] : loadData({ totalCount, offset, limit, sortKey, sortDir, data : { sales: customer.sales, }, });
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
          page='/customers'
        />

        <div className='content' styleName={'split-view flex-columns'} style={{ width: bodyWidth - 165 + 2, height: getBodyHeight() * 0.9, }}>

          <div styleName='directory-pane flex-fixed' style={drawerOpen ? { width: DRAWER_WIDTH, } : {}}>

            <List
              open={drawerOpen}
              onToggle={this._toggleDrawer}
              customer={this.props.customer}
              company={this.props.company}
              viewer={this.props.viewer}
              loading={loading}
            />

          </div>

          <div styleName='page detail flex-flexible' style={drawerOpen ? { width: bodyWidth - 165 - DRAWER_WIDTH, overflow: 'hidden', } : { overflow: 'hidden', }}>

            <Header
              customer={customer}
              salesStatus={loading ? undefined : this.props.customer.salesStatus}
              onPaymentCustomerSelected={this._onPaymentCustomerSelected}
              onReceivePayment={this._onReceivePayment}
              customerOpenInvoices={this.props.customerOpenInvoices}
              salesAccounts={this.props.salesAccounts}
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
                          customer={customer}
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

                      <div styleName={classnames('customers-table', { drawerOpen, })} style={{ marginTop: 3, }}>

                        <SalesTable
                          customer={customer}
                          onReceivePayment={self._onReceivePayment}
                          onPaymentCustomerSelected={self._onPaymentCustomerSelected}
                          selection={selection}
                          toggle={toggle}
                          toggleAll={toggleAll}
                          toggleNone={toggleNone}
                          customerOpenInvoices={self.props.customerOpenInvoices}
                          salesAccounts={self.props.salesAccounts}
                          depositsAccounts={self.props.depositsAccounts}
                          bodyWidth={bodyWidth - (drawerOpen ? DRAWER_WIDTH : 30)}
                          drawerOpen={drawerOpen}
                          relay={self.props.relay}
                          company={self.props.company}
                          viewer={self.props.viewer}
                          topLoading={loading || stale}
                          styles={self.props.styles}
                          totalCount={totalCount}
                          onSortChange={self._onSortChange}
                          sales={data}
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
                          customer={customer}
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
                      // height: 794/*Math.max(minHeight, 794, minHeight)*/,
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

                        <CustomerInfo
                          viewer={self.props.viewer} company={self.props.company}
                          customer={customer}
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
          customer: root.customer,
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
      id: props.params.id,
      salesAccountsCategories: SALES_ACCOUNTS_CATEGORIES,
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
      paymentCustomerId: props.params.id,
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

            customerOpenInvoices(first: 100000, companyId: $companyId, id: $id){
              edges{
                node{
                  objectId,
                  id,
                  customer{
                    ${UpdateCustomerNotesMutation.getFragment('customer')},
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

            customer: getCustomer(companyId: $companyId, id: $id){

              ${AddInvoiceMutation.getFragment('_customer')},
              ${AddSaleMutation.getFragment('_customer')},
              ${ReceivePaymentOfInvoicesMutation.getFragment('_customer')},

              ${UpdateCustomerNotesMutation.getFragment('customer')},

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

              },

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

                    ... on Node {

                      ... on Invoice{

                        ${RemoveInvoiceMutation.getFragment('invoice')},
                        __opType: __typename,
                        createdAt,
                        objectId,
                        id,
                        customer{
                          ${UpdateCustomerNotesMutation.getFragment('customer')},
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

                        totalHT,
                        VAT,

                        inputType,

                        invoiceItemsConnection{
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

                              VATPart{
                                inputType,
                                value,
                              },

                            }
                          }
                        },
                        invoicePaymentsConnection{
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

                      ... on Sale{

                        ${RemoveSaleMutation.getFragment('sale')},
                        __opType: __typename,
                        createdAt,
                        objectId,
                        id,
                        customer{
                          ${UpdateCustomerNotesMutation.getFragment('customer')},
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

                        totalHT,
                        VAT,

                        inputType,

                        saleItemsConnection{
                          totalCount,
                          amountReceived,
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

                              VATPart{
                                inputType,
                                value,
                              },

                            }

                          }
                        }

                      },

                      ... on PaymentOfInvoices{

                        ${RemovePaymentOfInvoicesMutation.getFragment('payment')},
                        __opType: __typename,
                        createdAt,
                        objectId,
                        id,
                        customer{
                          ${UpdateCustomerNotesMutation.getFragment('customer')},
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
                        paymentItemsConnection{
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
                                  totalCount,
                                  totalAmountReceived,
                                  edges{
                                    node{
                                      className,
                                      objectId,
                                      id,
                                      date,
                                      amount,
                                    }
                                  },
                                },
                                discountType,
                                discountValue,
                              },

                            }
                          }
                        }

                      },

                    }

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

              customers(first: 1000){
                edges{
                  node{
                    active,
                    ${UpdateCustomerNotesMutation.getFragment('customer')},
                    className,
                    type: __typename,
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

function loadData({ totalCount, offset, limit, sortKey, sortDir, data: { sales, }, }){
  return getNodes(sales.edges);
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

function getTotalCount({ sales, }){
  return sales.totalCount;
}

function decorateSale({
  objectId, __dataID__, totalHT, VAT, id, refNo, customer, paymentRef, depositToAccountCode, paymentMethod, inputType, billingAddress, date, discountType, discountValue, saleItemsConnection : itemsConnection, memo, files, }) {
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
    totalHT, VAT,
    inputType,
    itemsConnection,
    objectId,
    dueDate: date,
  };
}

function decorateInvoice({ objectId, __dataID__, totalHT, VAT, id, refNo, customer, billingAddress, terms, inputType, date, dueDate, discountType, discountValue, invoiceItemsConnection : itemsConnection, invoicePaymentsConnection : paymentsConnection, memo, files, }) {
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

function decoratePayment({ objectId, __dataID__, id, customer, paymentRef, amountReceived, depositToAccountCode, paymentMethod, date, paymentItemsConnection : itemsConnection, memo, files, }) {
  const balanceDue = amountReceived - itemsConnection.totalAmountReceived;
  return {
    __dataID__,
    id,
    customer,
    date,
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

  const date = localStorage.getItem('customer.date');
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

  const sortKey = localStorage.getItem('customer.sortKey');
  if(sortKey){
    state.sortKey = sortKey;
  }else{
    state.sortKey = null;
  }

  const sortDir = localStorage.getItem('customer.sortDir');
  if(sortDir){
    state.sortDir = parseInt(sortDir);
  }else{
    state.sortDir = null;
  }

  const type = localStorage.getItem('customer.type');
  if(type){
    state.type = type;
  }else{
    state.type = 'ALL';
  }
  const status = localStorage.getItem('customer.status');
  if(status){
    state.status = status;
  }else{
    state.status = 'ALL';
  }

  return state;
}
