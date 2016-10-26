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
import EmployeesTable from './EmployeesTable';

import {getBodyHeight,} from '../../../utils/dimensions';

import RelayRoute from '../../../routes/EmployeesRoute';

import AddEmployeeMutation from '../../../mutations/AddEmployeeMutation';

const DEFAULT_LIMIT    = 7;
const DEFAULT_SORT_KEY = 'displayName';
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
    selection: state.selection.editing['employees'],
}), dispatch => bindActionCreators({ toggle, toggleAll, toggleNone, }, dispatch))
@CSSModules(styles, {allowMultiple: true})
class Items extends React.Component {

  static propTypes = {
    loading: PropTypes.bool.isRequired,
  };

  static contextTypes = {
    store: PropTypes.object.isRequired,
    router: PropTypes.object.isRequired,
  };

  state = {

  };

  _onSortChange = (columnKey, dir) => {
    const {
      sortKey = DEFAULT_SORT_KEY,
    } = this.props.relay.variables;
    this.props.relay.setVariables({
      sortKey: columnKey,
      sortDir: columnKey !== sortKey ? -1 : dir,
      rev: Revision.incrementAndGet(),
    });
  };

  _onSearchQueryChange = (query, onDone) => {
    this.setState({
      searchQuery: query,
    }, onDone);
  };

  _onPage = (offset) => {
    this.props.relay.setVariables({
      offset, rev: Revision.incrementAndGet(),
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
      offset = 0,
      limit = DEFAULT_LIMIT,
      sortKey = DEFAULT_SORT_KEY,
      sortDir = DEFAULT_SORT_DIR,
    } = this.props.relay.variables;

    const bodyWidth = getBodyWidth();

    const totalCount = loading || stale ? 0 : getTotalCount({ employees: company.employees, });

    // const minHeight = getBodyHeight() - 236;

    const { matchingCount, data, } = loading || stale ? { matchingCount: 0, data: [], } : loadData({
      totalCount,
      offset,
      limit,
      sortKey,
      sortDir,
      employees: company.employees,
      searchQuery: this.state.searchQuery,
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
          page='/employees'
        />

        <div className='content'>

          <div styleName='page'>

            <Header
              bodyWidth={bodyWidth}
              company={this.props.company}
              viewer={this.props.viewer}
              topLoading={loading}
              onFilter={this._onFilter}
              filterArgs={{
                offset,
                limit,
                sortKey,
                sortDir,
              }}
            />

            <div styleName='index' style={{
              /*minHeight: 794Math.max(minHeight, 794, minHeight),*/
              background: '#fff',
              position: 'absolute',
              top: 97,
              paddingBottom: 50,
            }}>

              <div styleName='table-toolbar'>

                <Toolbar
                  company={this.props.company}
                  viewer={this.props.viewer}
                  topLoading={loading}
                  filterArgs={{
                  }}
                  onSearchQueryChange={this._onSearchQueryChange}
                />

              </div>

              <div styleName='employees-table' style={{marginTop: 3,}}>

                <EmployeesTable
                  selection={selection}
                  toggle={toggle}
                  toggleAll={toggleAll}
                  toggleNone={toggleNone}
                  bodyWidth={bodyWidth}
                  relay={this.props.relay}
                  company={this.props.company}
                  viewer={this.props.viewer}
                  topLoading={loading || stale}
                  styles={this.props.styles}
                  totalCount={totalCount}
                  onSortChange={this._onSortChange}
                  employees={data}
                  count={count}
                  filterArgs={{
                    offset,
                    limit,
                    sortKey,
                    sortDir,
                  }}
                  page={offset / limit}
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
                    sortKey,
                    sortDir,
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
      companyId: props.params.app,
      limit: DEFAULT_LIMIT,
      offset: 0,

      sortKey: null,
      sortDir: null,

      rev: 0,
    },

    fragments: {
      viewer: () => Relay.QL`
          fragment on User {

            objectId,
            id,
            displayName,
            username,
            email,
            createdAt,
            updatedAt,
            sessionToken,

            company(id: $companyId) {

              VATSettings{
                enabled,
                agency,
                startDate,
                IF,
                frequency,
                regime,
                percentages{ value, },
              },

              ${AddEmployeeMutation.getFragment('company')},

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

              employees(first: 100000){
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

function loadData({ totalCount, offset, limit, sortKey, sortDir, employees, searchQuery, }){
  sortKey = sortKey ? sortKey : 'displayName';
  sortDir = sortDir ? sortDir : -1;

  const data = getNodes(employees.edges, searchQuery);
  const array = orderBy(
    data,

    sortKey === 'displayName'
      ? [ obj => obj.displayName ]
      : [ sortKey === 'salesPrice' ? obj => typeof obj.salesPrice == 'undefined' || obj.salesPrice === null ? 0.0 : obj.salesPrice : sortKey, 'displayName' ],

    sortKey === 'displayName'
      ? [ sortDir === -1 ? 'desc' : 'asc' ]
      : [ sortDir === -1 ? 'desc' : 'asc', 'desc' ]
  );

  return totalCount <= limit ? { matchingCount: data.length, data: array, } : { matchingCount: data.length, data: take(

    drop(
      array, offset
    ),

    limit
  )};
}

function getNodes(edges, searchQuery){
  if(typeof searchQuery !== 'undefined' && searchQuery !== null && searchQuery.length > 0){
    const results = [];
    edges.forEach(({node: {...props}}) => {
      if(props.displayName.toLowerCase().indexOf(searchQuery) !== -1){
        results.push(
          decorateEmployee(props)
        );
      }
    });

    return results;
  }

  return edges.map(({node: {...props}}) => decorateEmployee(props));
}

function getTotalCount({ employees }){
  return employees.edges.length;
}

function decorateEmployee({
  ...props, }) {
  return {
    ...props,
  };
}
