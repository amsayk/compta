import React, {Component, PropTypes} from 'react';
import Relay from 'react-relay';

import Sidebar from '../Sidebar/AppSidebar';
import Loading from '../Loading/Loading';

import moment from 'moment';

import CSSModules from 'react-css-modules';

import styles from './Transactions.scss';

import TransactionsRoute from '../../routes/TransactionsRoute';

import TransactionForm from '../TransactionForm/TransactionForm';

import {editStart as accountEditStart,} from '../../redux/modules/account';
import {editStart as transactionEditStart,} from '../../redux/modules/transactions';

import {
  defineMessages,
  intlShape,
} from 'react-intl';

const Title = (company) => ({
  id: 'journal-page.displayName',
  defaultMessage: company.displayName,
});

const messages = defineMessages({

  Subtitle: {
    id: 'journal-page.subtitle',
    defaultMessage: 'Journal',
  },

});

@CSSModules(styles, {allowMultiple: true})
class Transactions extends Component {
  static contextTypes = {
    intl: intlShape.isRequired,
    store: PropTypes.object.isRequired,
  };

  state = {
    modalOpen: false
  };

  _onAddClicked = (e) => {
    e.preventDefault();
    this.context.store.dispatch(accountEditStart('NEW'));
    this.setState({
      modalOpen: true
    })
  };

  _close = () => {
    this.setState({modalOpen: false});
  };

  _renderForm = () => {
    this.context.store.dispatch(transactionEditStart('NEW', []));

    const form = this.state.modalOpen ? (
      <TransactionForm
        onCancel={this._close}
        formKey={'NEW'}
        company={this.props.company}
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
          page="/transactions"
        />

        <div className="content">

          <div styleName="journal-page">

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

              Transactions

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
    Component={wrapWithC(Transactions, props)}
    route={new TransactionsRoute({companyId: props.params.app, period: 'M1/2016'})}
    renderLoading={function() {
      return (
        <div className="loading">

          <Sidebar
            viewer={props.viewer}
            company={props.company}
            companies={props.companies || []}
            page="/transactions"
          />

          <div className="content">

              <Loading/>

          </div>

        </div>
      );
    }}
  />
);
