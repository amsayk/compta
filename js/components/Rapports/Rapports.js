import React, {Component, PropTypes} from 'react';
import Relay from 'react-relay';

import Sidebar from '../Sidebar/AppSidebar';
import Loading from '../Loading/Loading';

import CSSModules from 'react-css-modules';

import styles from './Rapports.scss';

import LazyCache from 'react-lazy-cache';

import moment from 'moment';

import ReportsRoute from '../../routes/ReportsRoute';

import {getBodyWidth,} from '../../utils/dimensions';

import Revision from '../../utils/revision';

import Header from './Header';

import {
  intlShape,
} from 'react-intl';

import messages from './messages';

@CSSModules(styles, {allowMultiple: true})
class Reports extends React.Component {
  static contextTypes = {
    intl: intlShape.isRequired,
  };

  render() {
    const {route, stale, loading, company, selection, toggle, toggleAll, toggleNone,} = this.props;

    const bodyWidth = getBodyWidth();

    return (
      <div className={'height100Percent'} styleName={''}>

        <Sidebar
          route={route}
          bodyWidth={bodyWidth}
          viewer={this.props.viewer}
          company={this.props.company}
          companies={this.props.companies.edges.map(({ node: company, }) => company)}
          root={this.props.root}
          page='/rapports'
        />

        <div className='content'>

          <div styleName='page'>

            <Header
              bodyWidth={bodyWidth}
              company={this.props.company}
              viewer={this.props.viewer}
              topLoading={loading}
              stale={stale}
              filterArgs={{
              }}
            />

            <div styleName='index' style={{
              width: bodyWidth - 165,
              minHeight: 794, // Math.max(minHeight, 794, minHeight),
              background: '#fff',
              position: 'absolute',
              top: 297,
              paddingBottom: 50,
            }}>

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
      const {stale, loading, viewer : root, relay, children,} = this.props;
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

      // expenses, bills, sales and invoices
      resultCategories: [
        '6.1',
        '7.1'
      ],

      profitLossFrom: moment().subtract(30, 'days').toDate(),
      profitLossTo: null,

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

              dashboard__Result: operationsByCategories(first: 100000, categories: $resultCategories, from: $profitLossFrom, to: $profitLossTo, _rev: $rev){
                edges{
                  node{
                    date,
                    accountCode,
                    categoryCode: _categoryCode,
                    type,
                    amount,
                  }
                }
              },

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

// module.exports = (props) => {
//   const route = new ReportsRoute({companyId: props.params.app, period: 'M1/2016'});
//   return (
//     <Relay.RootContainer
//       forceFetch={true}
//       Component={wrapWithC(Rapports, { ...props, route, })}
//       route={route}
//       renderLoading={function() {
//         return (
//           <div className='loading'>
//
//             <Sidebar
//               route={route}
//               viewer={props.viewer}
//               company={props.company}
//               companies={props.companies || { edges: [], }}
//               page='/reports'
//             />
//
//             <div className='content'>
//
//                 <Loading/>
//
//             </div>
//
//           </div>
//         );
//       }}
//     />
//   );
// };

function createContainer({viewer, params, company, companies,}) {
  const Route = new ReportsRoute({companyId: params.app});
  const MyComponent = wrapWithC(Reports, { params, route: Route,});

  class Container extends React.Component {
    shouldComponentUpdate() {
      return false;
    }

    render() {
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

class S extends React.Component {
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

  shouldComponentUpdate() {
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
