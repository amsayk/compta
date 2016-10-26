import React, {Component,PropTypes} from 'react';
import Relay from 'react-relay';

import Sidebar from '../Sidebar/AppSidebar';
import Loading from '../Loading/Loading';

import CSSModules from 'react-css-modules';

import styles from './Accounts.scss';

import AccountsRoute from '../../routes/AccountsRoute';

import {
  intlShape,
} from 'react-intl';

const Title = (company) => company.displayName;

import messages from './messages';

@CSSModules(styles, {allowMultiple: true})
class Accounts extends React.Component {
  static contextTypes = {
    intl: intlShape.isRequired,
  };

  state = {
    modalOpen: false
  };

  _onShowClicked = (e) => {
    e.preventDefault();
    this.setState({
      modalOpen: true
    })
  };

  _close = () => {
    this.setState({modalOpen: false});
  };

  _renderSelectedAccount = () => {
    //const modal = this.state.modalOpen ? (
    //  <AccountOperations
    //    onCancel={this._close}
    //  />
    //) : null;
    //
    //return modal;

    return null;
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
          page='/accounts'
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

              Accounts

            </div>

          </div>

        </div>

        {this._renderSelectedAccount()}

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
    initialVariables: {companyId: props.params.app, first: 1000},

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

            accounts(first: $first){
              edges{
                node {
                  id,
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

module.exports = (props) => {
  const route = new AccountsRoute({companyId: props.params.app});
  return (
    <Relay.RootContainer
      forceFetch={true}
      Component={wrapWithC(Accounts, { ...props, route, })}
      route={route}
      renderLoading={function() {
        return (
          <div className='loading'>

            <Sidebar
              route={route}
              viewer={props.viewer}
              company={props.company}
              companies={props.companies || []}
              page='/accounts'
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
