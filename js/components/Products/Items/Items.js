import React, {Component, PropTypes} from 'react';
import Relay from 'react-relay';

import Sidebar from '../../Sidebar/AppSidebar';

import LazyCache from 'react-lazy-cache';

import moment from 'moment';

import CSSModules from 'react-css-modules';

import styles from './Items.scss';

import classnames from 'classnames';

import events from 'dom-helpers/events';

import concat from 'lodash.concat';
import orderBy from 'lodash.orderby';
import take from 'lodash.take';
import drop from 'lodash.drop';
import uniq from 'lodash.uniqby';

import { getBodyWidth, } from '../../../utils/dimensions';

import throttle from 'lodash.throttle';

import Modal from 'react-bootstrap/lib/Modal';

import Dialog, { Body, Footer, } from '../../utils/Dialog';

import Revision from '../../../utils/revision';

import Toolbar from './Toolbar';
import Pagination from './Pagination';

import Header from './Header';
import ProductsTable from './ProductsTable';

import {getBodyHeight,} from '../../../utils/dimensions';

import RelayRoute from '../../../routes/ProductsRoute';

import AddProductMutation from '../../../mutations/AddProductMutation';

const DEFAULT_LIMIT    = 7;
const DEFAULT_SORT_KEY = 'displayName';
const DEFAULT_SORT_DIR = -1;

function clamp(value, min, max){
  return Math.min(Math.max(value, min), max);
}

import {
  intlShape,
} from 'react-intl';

import messages from './messages';

@CSSModules(styles, {allowMultiple: true})
class Items extends Component {

  static propTypes = {
    loading: PropTypes.bool.isRequired,
  };

  state = {};

  static contextTypes = {
    store: PropTypes.object.isRequired,
    intl: intlShape.isRequired,
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
    const { intl, } = this.context;
    const { styles, stale, loading, company, } = this.props;
    const { products, } = company;

    const {
      offset = 0,
      limit = DEFAULT_LIMIT,
      sortKey = DEFAULT_SORT_KEY,
      sortDir = DEFAULT_SORT_DIR,
      date,
      from,
      to,
    } = this.props.relay.variables;

    const bodyWidth = getBodyWidth();

    const totalCount = loading || stale ? 0 : getTotalCount({ products, });

    // const minHeight = getBodyHeight() - 236;

    const { matchingCount, data, } = loading || stale ? { matchingCount: 0, data: [], } : loadData({
      totalCount,
      offset,
      limit,
      sortKey,
      sortDir,
      products,
      searchQuery: this.state.searchQuery,
    });

    const count = data.length;

    const handleClose = () => {
      this.props.onCancel();
    };

    return (
      <Modal dialogClassName={styles['modal']}
             dialogComponentClass={Dialog}
             className={classnames({'products-form form modal-fullscreen': true, [styles['products-form'] || '']: true, })}
             show={true} keyboard={false} backdrop={false} onHide={() => handleClose()} autoFocus enforceFocus>

        <Body>

          <div className={''} styleName={''}>

            <div className=''>

              <div styleName='page'>

                <Header
                  bodyWidth={bodyWidth}
                  company={this.props.company}
                  viewer={this.props.viewer}
                  topLoading={loading}
                  filterArgs={{
                    offset,
                    limit,
                    sortKey,
                    sortDir,
                    from,
                    to,
                  }}
                />

                <div styleName='index' style={{/*minHeight: 794Math.max(minHeight, 794, minHeight), */background: '#fff', position: 'absolute', top: 96, paddingBottom: 50,}}>

                  <div styleName='table-toolbar'>

                    <Toolbar
                      company={this.props.company}
                      viewer={this.props.viewer}
                      topLoading={loading}
                      onFilter={this._onFilter}
                      onSearchQueryChange={this._onSearchQueryChange}
                    />

                  </div>

                  <div styleName='products-table' style={{marginTop: 3,}}>

                    <ProductsTable
                      bodyWidth={bodyWidth}
                      relay={this.props.relay}
                      company={this.props.company}
                      viewer={this.props.viewer}
                      topLoading={loading || stale}
                      styles={this.props.styles}
                      totalCount={totalCount}
                      onSortChange={this._onSortChange}
                      products={data}
                      count={count}
                      filterArgs={{
                        offset,
                        limit,
                        sortKey,
                        sortDir,
                        from,
                        to,
                      }}
                      page={offset / limit}
                    />

                  </div>

                  {loading || stale ? null : ((typeof this.state.searchQuery !== 'undefined' && this.state.searchQuery !== null && this.state.searchQuery.length > 0 ? matchingCount : totalCount) > limit ? <div styleName='pagination'>

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

        </Body>

        <Footer>

          <div styleName='' style={{}}>
            <button
              style={{minWidth: 70}}
              styleName='btn primary floatRight'
              onClick={e => handleClose()} className='unselectable'>{intl.formatMessage(messages['Done'])}</button>
          </div>

        </Footer>

      </Modal>
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
          products: root.products,
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
      companyId: props.company.id,
      limit: DEFAULT_LIMIT,
      offset: 0,
      date: 1,
      from: null,
      to: null,
      sortKey: null,
      sortDir: null,
      rev: 0,
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

            objectId,
            id,
            displayName,
            username,
            email,
            createdAt,
            updatedAt,
            sessionToken,

            company(id: $companyId) {

              ${AddProductMutation.getFragment('company')},

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

              products: companyProducts(first: 100000){
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

            },

          }
      `,
    },
  });
}

function createContainer({ viewer, params, company, companies, ...props, }){
  const MyComponent = wrapWithC(Items, { ...props, params, company, });
  const Route = new RelayRoute({ companyId: company.id,  });

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

function loadData({ totalCount, offset, limit, sortKey, sortDir, products, searchQuery, }){
  sortKey = sortKey ? sortKey : 'displayName';
  sortDir = sortDir ? sortDir : -1;

  const data = getNodes(products.edges, searchQuery);
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
      if(props.displayName.toLowerCase().indexOf(searchQuery) !== -1
      || (typeof props.salesDesc !== 'undefined' && props.salesDesc !== null && props.salesDesc.length > 0 && props.salesDesc.toLowerCase().indexOf(searchQuery) !== -1)){
        results.push(
          decorateProduct(props)
        );
      }
    });

    return results;
  }

  return edges.map(({node: {...props}}) => decorateProduct(props));
}

function getTotalCount({ products }){
  return products.edges.length;
}

function decorateProduct({
  ...props, }) {
  return {
    ...props,
  };
}
