import React, {Component,PropTypes} from 'react';
import Relay from 'react-relay';

import Sidebar from '../Sidebar/AppSidebar';
import Loading from '../Loading/Loading';

import CSSModules from 'react-css-modules';

import styles from './Reports.scss';

import ReportsRoute from '../../routes/ReportsRoute';

import {
  defineMessages,
  intlShape,
} from 'react-intl';

const Title = (company) => company.displayName;

const messages = defineMessages({

  Subtitle: {
    id: 'reports-page.title',
    defaultMessage: 'Reports',
  },

});

@CSSModules(styles, {allowMultiple: true})
class Reports extends Component {
  static contextTypes = {
    intl: intlShape.isRequired,
  };

  render() {
    const { route, viewer, company, companies, } = this.props;
    const {formatMessage,} = this.context.intl;
    return (
      <div className=''>

        <Sidebar
          route={route}
          viewer={viewer}
          company={company}
          companies={companies.edges.map(({ node: company, }) => company)}
          viewer={viewer}
          page='/reports'
        />

          <div className='content'>

            <div styleName='page'>

              <div styleName='toolbar'>

                <div styleName='title'>
                  <div styleName='section'>{Title(company)}</div>

                  <div>
                    <span styleName='subsection'>{formatMessage(messages.Subtitle)}</span>
                    <span styleName='details'></span>
                  </div>

                </div>

                <div styleName='actions'></div>

              </div>

              <div>

                Reports

              </div>

            </div>

          </div>

      </div>
    );
  }
}

function wrapWithC(Component, props) {
  class CWrapper extends React.Component {
    render() {
      return React.createElement(
        Component, {
          ...props,
          companies: this.props.viewer.companies,
          company: this.props.viewer.company,
          viewer: this.props.viewer,
        },
        this.props.children
      );
    }
  }

  return Relay.createContainer(CWrapper, {
    initialVariables: {companyId: props.params.app, period: 'M1/2016', first: 1000},

    fragments: {
      viewer: () => Relay.QL`
        fragment on User {
          id,
          objectId,
          displayName,
          username,
          email,
          createdAt,
          updatedAt,
          sessionToken,

          company(id: $companyId){
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

module.exports = (props) => {
  const route = new ReportsRoute({companyId: props.params.app, period: 'M1/2016'});
  return (
    <Relay.RootContainer
      forceFetch={true}
      Component={wrapWithC(Reports, { ...props, route, })}
      route={route}
      renderLoading={function() {
        return (
          <div className='loading'>

            <Sidebar
              route={route}
              viewer={props.viewer}
              company={props.company}
              companies={props.companies || { edges: [], }}
              page='/reports'
            />

            <div className='content'>

                <Loading/>

            </div>

          </div>
        );
      }}
    />
  );
};
