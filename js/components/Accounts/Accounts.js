import React, {Component,PropTypes} from 'react';
import Relay from 'react-relay';

import Sidebar from '../Sidebar/AppSidebar';
import Loading from '../Loading/Loading';

import CSSModules from 'react-css-modules';

import styles from './Accounts.scss';

import AccountsRoute from '../../routes/AccountsRoute';

import {
  defineMessages,
  intlShape,
} from 'react-intl';

const Title = (company) => ({
  id: 'accounts-page.title',
  defaultMessage: company.displayName,
});

const messages = defineMessages({

  Subtitle: {
    id: 'accounts-page.title',
    defaultMessage: 'Chart of Accounts',
  },

});

@CSSModules(styles, {allowMultiple: true})
class Accounts extends Component {
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
    const {formatMessage,} = this.context.intl;
    return (
      <div className="">

        <Sidebar
          viewer={this.props.viewer}
          company={this.props.company}
          companies={this.props.companies}
          root={this.props.root}
          page="/accounts"
        />

        <div className="content">

          <div styleName="page">

            <div styleName="toolbar">

              <div styleName="title">
                <div styleName="section">{formatMessage(Title(this.props.company))}</div>

                <div>
                  <span styleName="subsection">{formatMessage(messages.Subtitle)}</span>
                  <span styleName="details"></span>
                </div>

              </div>

              <div styleName="actions"></div>

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
          companies: this.props.root.companies,
          company: this.props.root.company,
          root: this.props.root,
        },
        this.props.children
      );
    }
  }

  return Relay.createContainer(CWrapper, {
    initialVariables: {companyId: props.params.app, period: 'M1/2016', first: 1000},

    fragments: {
      root: () => Relay.QL`
        fragment on Query {
          id,

          company(id: $companyId){

            id,
            displayName,
            periodType,
            lastSeqNr,

            accounts(period: $period, first: $first){
              edges{
                node {
                  id,
                }
              }
            },

          },

          companies{
            id,
            displayName,
            periodType,
            lastSeqNr,
            createdAt,
            updatedAt,
          },

        }
      `,
    },
  });
}

module.exports = (props) => (
  <Relay.RootContainer
    Component={wrapWithC(Accounts, props)}
    route={new AccountsRoute({companyId: props.params.app, period: 'M1/2016'})}
    renderLoading={function() {
      return (
        <div className="loading">

          <Sidebar
            viewer={props.viewer}
            company={props.company}
            companies={props.companies || []}
            page="/accounts"
          />

          <div className="content">

              <Loading/>

          </div>

        </div>
      );
    }}
  />
);
