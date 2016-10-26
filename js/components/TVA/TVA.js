import React, {Component, PropTypes} from 'react';
import Relay from 'react-relay';

import Sidebar from '../Sidebar/AppSidebar';

import LazyCache from 'react-lazy-cache';

import moment from 'moment';

import CSSModules from 'react-css-modules';

import styles from './TVA.scss';

import RelayRoute from '../../routes/TVARoute';

import { getBodyWidth, } from '../../utils/dimensions';

import Revision from '../../utils/revision';

import Header from './Header';

import NoVAT from './NoVAT';
import VATSummary from './VATSummary';

@CSSModules(styles, {allowMultiple: true})
class TVA extends React.Component {

  static propTypes = {
    loading: PropTypes.bool.isRequired,
  };

  static contextTypes = {
  };

  state = {

  };

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

              {loading || stale ? null : (company.VATSettings.enabled ? <VATSummary viewer={viewer} company={company}/> : <NoVAT viewer={viewer} company={company}/>)}

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

                report{
                  sales { totalVAT, },
                  expenses { totalVAT, },
                },

              },

              VATDeclarationHistory(first: 100000){
                edges{
                  node{
                    id,
                    objectId,
                    periodStart,
                    periodEnd,
                  }
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
  const MyComponent = wrapWithC(TVA, { params, route: Route, });

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
