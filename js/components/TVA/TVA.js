import React, {Component, PropTypes} from 'react';
import Relay from 'react-relay';

import Sidebar from '../Sidebar/AppSidebar';
import Loading from '../Loading/Loading';

import moment from 'moment';

import CSSModules from 'react-css-modules';

import styles from './TVA.scss';

import messages from './messages';

import RelayRoute from '../../routes/TVARoute';

import {
  intlShape,
} from 'react-intl';

const Title = (company) => company.displayName;

@CSSModules(styles, {allowMultiple: true})
class TVA extends Component {
  static contextTypes = {
    intl: intlShape.isRequired,
    store: PropTypes.object.isRequired,
  };

  state = {
    modalOpen: false
  };

  _onAddClicked = (e) => {
    e.preventDefault();
    // this.context.store.dispatch(accountEditStart('NEW'));
    this.setState({
      modalOpen: true
    })
  };

  _close = () => {
    this.setState({modalOpen: false});
  };

  _renderForm = () => {
    //this.context.store.dispatch(transactionEditStart('NEW', []));
    //
    //const form = this.state.modalOpen ? (
    //  <TransactionForm
    //    onCancel={this._close}
    //    formKey={'NEW'}
    //    company={this.props.company}
    //  />
    //) : null;
    //
    //return form;
  };

  render() {
    const { route, company, viewer, companies, } = this.props;
    const {formatMessage,} = this.context.intl;
    return (
      <div className=''>

        <Sidebar
          route={route}
          viewer={viewer}
          company={company}
          companies={companies.edges.map(({ node: company, }) => company)}
          viewer={viewer}
          page='/tax'
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

              TVA

            </div>

          </div>

        </div>

        {this._renderForm()}

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
    initialVariables: {companyId: props.params.app},

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
  const route = new RelayRoute({companyId: props.params.app});
  return (
    <Relay.RootContainer
      forceFetch={true}
      Component={wrapWithC(TVA, { ...props, route, })}
      route={route}
      renderLoading={function() {
        return (
          <div className='loading'>

            <Sidebar
              route={route}
              viewer={props.viewer}
              company={props.company}
              companies={props.companies || { edges: [], }}
              page='/tax'
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
