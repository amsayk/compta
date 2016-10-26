import React, {Component, PropTypes} from 'react';
import Relay from 'react-relay';

import Sidebar from '../../Sidebar/AppSidebar';

import LazyCache from 'react-lazy-cache';

import moment from 'moment';

import CSSModules from 'react-css-modules';

import styles from './History.scss';

import classnames from 'classnames';

import RelayRoute from '../../../routes/TVAHistoryRoute';

import { getBodyWidth, } from '../../../utils/dimensions';

import Revision from '../../../utils/revision';

import {Table, Column, Cell,} from '../../../../fixed-data-table';

import {
  intlShape,
} from 'react-intl';

import OperationDataListStore from './OperationDataListStore';

import Header from './Header';
import stopEvent from "../../../utils/stopEvent";

function decorateVATDeclaration(el) {
  return {
    ...el,
  };
}

function getData(company) {
  const current = company.VATDeclaration;
  const history = company.VATDeclarationHistory.edges;

  const list = [];

  for(let i = 0; i < history.length; i++){
    const el = history[i].node;
    if(el.objectId !== current.objectId){
      list.push(decorateVATDeclaration(el));
    }
  }

  return list;
}

@CSSModules(styles, {allowMultiple: true})
class History extends React.Component {

  static propTypes = {
    loading: PropTypes.bool.isRequired,
  };

  static contextTypes = {
    intl: intlShape.isRequired,
    router: PropTypes.object.isRequired,
  };

  constructor(props, context){
    super(props, context);

    this.state = {
      modalOpen: false,
      loading: this.props.loading,
      store: new OperationDataListStore(
        this.props.loading ? [] : getData(this.props.company),
      ),
    };
  }

  componentWillReceiveProps(nextProps){
    this.setState({
      loading: nextProps.loading,
      store: new OperationDataListStore(
        nextProps.loading ? [] : getData(nextProps.company),
      ),
    });

  }

  componentWillUnmount() {
  }

  componentDidMount(){
  }

  render() {
    const { route, stale, loading, viewer, root, company, companies, } = this.props;

    const bodyWidth = getBodyWidth();

    return (
      <div className={'height100Percent'} styleName={''}>

        <Sidebar
          route={route}
          bodyWidth={bodyWidth}
          viewer={viewer}
          company={company}
          companies={companies.edges.map(({ node: company, }) => company)}
          root={root}
          page='/vat'
        />

        <div className='content'>

          <div styleName='page'>

            <Header
              bodyWidth={bodyWidth}
              company={company}
              viewer={viewer}
              topLoading={loading}
            />

            <div styleName='index' style={{
              /*minHeight: 794Math.max(minHeight, 794, minHeight),*/
              background: '#fff',
              position: 'absolute',
              top: 97,
              paddingBottom: 50,
            }}>

              {loading || stale ? null : <div>{this._renderVATDeclarations()}</div>}

            </div>

          </div>

        </div>

      </div>
    );
  }

  _renderVATDeclarations = () => {

    const {
      styles
     } = this.props;

    const {
      intl,
    } = this.context;

    const { loading, store, } = this.state;
    const rowsCount = loading ? 0 : store.getSize();
    const tableHeight = 36 + (rowsCount * 50) + 2;

    const bodyWidth = Math.max(getBodyWidth() - 165 - 60, 956);
    const tableWidth = bodyWidth - 1;

    const isEmpty = rowsCount === 0;

    if(isEmpty){
      return (
        <div className={classnames({[styles['table']]: true})}>

          <div style={{}}>Aucun historique encore.</div>

          </div>
      );
    }

    return (
      <div className={classnames({[styles['table']]: true})}>

        <div style={{}}>

          <Table
            renderRow={(Component, rowIndex, {style, className}) => {
              return (
               <div>
                  <Component
                    style={{...style, zIndex: 0}}
                    className={`${className} ${styles['table-row-container'] || ''}`}/>
                </div>
              );
            }}
            onHeaderClick={(e) => {}}
            onRowClick={(e, rowIndex) => this._openItem(rowIndex, e)}
            rowClassNameGetter={(rowIndex) => {
              // const obj = store.getObjectAt(rowIndex);
              return classnames(`${styles.row} table-row`, {
                [styles['first-row'] || '']: rowIndex === 0,
              });
            }}
            rowHeight={50}
            rowsCount={rowsCount}
            height={tableHeight}
            width={tableWidth}
            headerHeight={36}>

            {/* periodStart */}
            <Column
              columnKey={'periodStart'}
              align={'left'}
              header={<Cell>{'Date debut'}</Cell>}
              cell={({rowIndex, ...props}) => (
               <Cell {...props}>
                <div>
                  {function(){
               const obj = store.getObjectAt(rowIndex);
               return moment(obj.periodStart).format('ll');
             }()}
                </div>
               </Cell>
             )}
              width={50}
              flexGrow={1}
            />

            {/* periodEnd */}
            <Column
              columnKey={'periodEnd'}
              align={'left'}
              header={<Cell>{'Date fin'}</Cell>}
              cell={({rowIndex, ...props}) => (
               <Cell {...props}>
                <div>
                  {function(){
               const obj = store.getObjectAt(rowIndex);
               return moment(obj.periodEnd).format('ll');
             }()}
                </div>
               </Cell>
             )}
              width={50}
              flexGrow={1}
            />

            {/* amountDue */}
            <Column
              columnKey={'amountDue'}
              align={'left'}
              header={<Cell>{'TVA due'}</Cell>}
              cell={({rowIndex, ...props}) => (
               <Cell {...props}>
                <div>
                  {function(){
               const obj = store.getObjectAt(rowIndex);
               return intl.formatNumber(obj.report.sales.totalVAT - obj.report.expenses.totalVAT, { format: 'MAD', });
             }()}
                </div>
               </Cell>
             )}
              width={50}
              flexGrow={1}
            />

            </Table>

        </div>

      </div>
    );
  };

  _openItem = (rowIndex, e) => {
    stopEvent(e);

    const {
      router,
    } = this.context;

    const {
      company,
    } = this.props;

    const { store, } = this.state;

    const obj = store.getObjectAt(rowIndex);

    router.push({
      pathname: `/apps/${company.id}/vat/declaration/${obj.objectId}`,
      state: {},
    });
  };

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

              objectId,

              id,
              displayName,
              periodType,
              lastTransactionIndex, lastPaymentsTransactionIndex,

              createdAt,
              updatedAt,

              VATDeclaration{
                id,
                objectId,
                periodStart,
                periodEnd,
              },

              VATDeclarationHistory(first: 100000){
                edges{
                  node{
                    id,
                    objectId,
                    periodStart,
                    periodEnd,

                    report{
                      sales { totalVAT, },
                      expenses { totalVAT, },
                    },

                  },

                }
              },

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
  const MyComponent = wrapWithC(History, { params, route: Route, });

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
