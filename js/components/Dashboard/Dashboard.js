import React, {Component,PropTypes} from 'react';
import Relay from 'react-relay';

import Sidebar from '../Sidebar/AppSidebar';
import Loading from '../Loading/Loading';

import CSSModules from 'react-css-modules';

import styles from './Dashboard.scss';

import DashboardRoute from '../../routes/DashboardRoute';

import TransactionForm from '../TransactionForm/TransactionForm';

import {editStart,} from '../../redux/modules/account';

import {
  defineMessages,
  intlShape,
} from 'react-intl';

const Title = (company) => ({
  id: 'dashboard-page.displayName',
  defaultMessage: company.displayName,
});

const messages = defineMessages({

  Subtitle: {
    id: 'dashboard-page.title',
    defaultMessage: 'Home',
  },

});

@CSSModules(styles, {allowMultiple: true})
class Dashboard extends Component {
  static contextTypes = {
    intl: intlShape.isRequired,
    store: PropTypes.object.isRequired,
  };

  state = {
    modalOpen: false
  };

  _onAddClicked = (e) => {
    e.preventDefault();
    this.context.store.dispatch(editStart('NEW'));
    this.setState({
      modalOpen: true
    })
  };

  _close = () => {
    this.setState({modalOpen: false});
  };

  _renderForm = () => {
    const form = this.state.modalOpen ? (
      <TransactionForm
        onCancel={this._close}
        initialValues={{operations: []}}
        formKey={'NEW'}
      />
    ) : null;

    return form;
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
          page="/dashboard"
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

                Dashboard

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

            transactions(period: $period, first: $first){
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
    Component={wrapWithC(Dashboard, props)}
    route={new DashboardRoute({companyId: props.params.app, period: 'M1/2016'})}
    renderLoading={function() {
      return (
        <div className="loading">

          <Sidebar
            viewer={props.viewer}
            company={props.company}
            companies={props.companies || []}
            page="/dashboard"
          />

          <div className="content">

              <Loading/>

          </div>

        </div>
      );
    }}
  />
);
