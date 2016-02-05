import React, {Component,PropTypes} from 'react';
import Relay from 'react-relay';

import Sidebar from '../Sidebar/HomeSidebar';
import Loading from '../Loading/Loading';

import CSSModules from 'react-css-modules';

import styles from './AccountSettings.scss';

import SettingsHomeRoute from '../../routes/AccountSettingsRoute';

import AccountForm from '../AccountForm/AccountForm';

import {editStart,} from '../../redux/modules/account';

import {
  defineMessages,
  intlShape,
} from 'react-intl';

const messages = defineMessages({

  Title: {
    id: 'account-page.title',
    defaultMessage: 'Account',
  },

  Subtitle: {
    id: 'account-page.subtitle',
    defaultMessage: 'Settings',
  },

  Legend: {
    id: 'account-page.login-info-legend',
    defaultMessage: 'Account Info',
  },

  Desc1: {
    id: 'account-page.login-info-message',
    defaultMessage: 'Update the personal information linked to this account.',
  },

  LeftLabel: {
    id: 'account-page.login-info-label',
    defaultMessage: 'Change your login information',
  },

  LeftDesc: {
    id: 'account-page.login-info-description',
    defaultMessage: 'This is where you can change your email address or password.',
  },


  Action: {
    id: 'account-page.action-change-login-info',
    defaultMessage: 'Change my login information',
  },

});

@CSSModules(styles, {allowMultiple: true})
class AccountSettings extends Component {
  static contextTypes = {
    intl: intlShape.isRequired,
    store: PropTypes.object.isRequired,
  };

  state = {
    modalOpen: false
  };

  _onAddClicked = (e) => {
    e.preventDefault();
    this.context.store.dispatch(editStart(this.props.viewer.id));
    this.setState({
      modalOpen: true
    })
  };

  _close = () => {
    this.setState({modalOpen: false});
  };

  _renderForm = () => {
    const form = this.state.modalOpen ? (
      <AccountForm
        onCancel={this._close}
        formKey={this.props.viewer.id}
        viewer={this.props.viewer}
      />
    ) : null;

    return form;
  };

  render() {
    const {formatMessage,} = this.context.intl;
    return (
      <div className="">
        <Sidebar viewer={this.props.viewer} page="/account"/>

        <div className="content">

          <div styleName="settings-page">

            <div styleName="toolbar">

              <div styleName="title">
                <div styleName="section">{formatMessage(messages.Title)}</div>

                <div>
                  <span styleName="subsection">{formatMessage(messages.Subtitle)}</span>
                  <span styleName="details"></span>
                </div>

              </div>

              <div styleName="actions"></div>

            </div>

            <div styleName="fieldset">

              <div styleName="legend">{formatMessage(messages.Legend)}</div>

              <div styleName="description-1">{formatMessage(messages.Desc1)}</div>

              <div styleName="fields">

                <div styleName="field">

                  <div styleName="left" style={{width:'56%'}}>
                    <div styleName="label centered" style={{padding:'0 20px'}}>
                      <div styleName="text">{formatMessage(messages.LeftLabel)}</div>
                      <div styleName="description-2">{formatMessage(messages.LeftDesc)}</div>
                    </div>
                  </div>

                  <div styleName="right" style={{marginLeft:'56%'}}>

                    <div styleName="input">

                      <a href="javascript:;" onClick={this._onAddClicked} role="button" style={{width:'80%',minWidth:'80%'}}
                         styleName="button unselectable primary">
                        <span>{formatMessage(messages.Action)}</span>
                      </a>

                    </div>

                  </div>

                </div>

              </div>

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
          root: this.props.root,
        },
        this.props.children
      );
    }
  }

  return Relay.createContainer(CWrapper, {
    initialVariables: {},

    fragments: {
      root: () => Relay.QL`
        fragment on Query {

          id,

        }
      `,
    },
  });
}

module.exports = (props) => (
  <Relay.RootContainer
    Component={wrapWithC(AccountSettings, props)}
    route={new SettingsHomeRoute()}
    renderLoading={function() {
      return (
        <div className="loading">

          <Sidebar
            viewer={props.viewer}
            page="/account"
          />

          <div className="content">

              <Loading/>

          </div>

        </div>
      );
    }}
  />
);
