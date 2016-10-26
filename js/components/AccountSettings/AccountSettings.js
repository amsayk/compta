import React, {Component,PropTypes} from 'react';
import Relay from 'react-relay';

import Sidebar from '../Sidebar/HomeSidebar';
import Loading from '../Loading/Loading';

import CSSModules from 'react-css-modules';

import styles from './AccountSettings.scss';

import SettingsHomeRoute from '../../routes/AccountSettingsRoute';

import auth from '../../utils/auth';

import {getBodyHeight, getBodyWidth, } from '../../utils/dimensions';

import AccountForm from '../AccountForm/AccountForm';
import PasswordForm from '../PasswordForm/PasswordForm';

import {editStart, editStop,} from '../../redux/modules/account';

import {
  intlShape,
} from 'react-intl';

import messages from './messages';

@CSSModules(styles, {allowMultiple: true})
class AccountSettings extends React.Component {
  static contextTypes = {
    intl: intlShape.isRequired,
    store: PropTypes.object.isRequired,
    router: PropTypes.object.isRequired,
  };

  state = {
    modalOpen: false
  };

  _onAddClicked = (e) => {
    e.preventDefault();
    this.context.store.dispatch(editStart(this.props.viewer.objectId));
    this.setState({
      modalOpen: true,
      modalType: 'account',
    });
  };

  _onLogOut = (e) => {
    e.preventDefault();

    auth.logOut(this.props.viewer);
  };

  _onDelClicked = (e) => {
    e.preventDefault();
  };

  _close = () => {
    this.context.store.dispatch(editStop(this.props.viewer.objectId));
    this.setState({modalOpen: false, modalType: undefined,});
  };

  _renderForm = () => {
    if(this.state.modalType === 'account'){
      const form = this.state.modalOpen ? (
        <AccountForm
          onCancel={this._close}
          formKey={this.props.viewer.id}
          viewer={this.props.viewer}
        />
      ) : null;

      return form;
    }

    if(this.state.modalType === 'password'){
      const form = this.state.modalOpen ? (
        <PasswordForm
          onCancel={this._close}
          formKey={this.props.viewer.id}
          viewer={this.props.viewer}
        />
      ) : null;

      return form;
    }

    return null;
  };

  _onChangePasswordClicked = (e) => {
    e.preventDefault();
    this.context.store.dispatch(editStart(this.props.viewer.objectId));
    this.setState({
      modalOpen: true,
      modalType: 'password',
    });
  };

  render() {
    const {formatMessage,} = this.context.intl;
    return (
      <div className=''>
        <Sidebar viewer={this.props.viewer} page='/account'/>

        <div className='content'>

          <div styleName='settings-page'>

            <div styleName='toolbar'>

              <div styleName='title'>
                <div styleName='section'>{formatMessage(messages.Title)}</div>

                <div>
                  <span styleName='subsection'>{formatMessage(messages.Subtitle)}</span>
                  <span styleName='details'></span>
                </div>

              </div>

              <div styleName='actions'></div>

            </div>

            <div styleName='settings-page-body' className='scrollable-shadow scrollable' style={{zIndex: 0, top: 96, position: 'absolute', height: getBodyHeight() - 96, width: getBodyWidth() - 165, }}>

              <div styleName='fieldset'>

                <div styleName='legend'>{formatMessage(messages.Legend)}</div>

                <div styleName='description-1'>{formatMessage(messages.Desc1)}</div>

                <div styleName='fields'>

                  <div styleName='field'>

                    <div styleName='left' style={{width:'56%'}}>
                      <div styleName='label centered' style={{padding:'0 20px'}}>
                        <div styleName='text'>{formatMessage(messages.LeftLabel)}</div>
                        <div styleName='description-2'>{formatMessage(messages.LeftDesc)}</div>
                      </div>
                    </div>

                    <div styleName='right' style={{marginLeft:'56%'}}>

                      <div styleName='input'>

                        <a href='javascript:;' onClick={this._onAddClicked} role='button' style={{width:'80%',minWidth:'80%'}}
                           styleName='button unselectable primary'>
                          <span>{formatMessage(messages.Action)}</span>
                        </a>

                      </div>

                    </div>

                  </div>

                  <div styleName='field'>

                    <div styleName='left' style={{width:'56%'}}>
                      <div styleName='label centered' style={{padding:'0 20px'}}>
                        <div styleName='text'>{'Modifier votre mot de passe'}</div>
                        <div styleName='description-2'>{'Voici où vous pouvez modifier votre mot de passe.'}</div>
                      </div>
                    </div>

                    <div styleName='right' style={{marginLeft:'56%'}}>

                      <div styleName='input'>

                        <a href='javascript:;' onClick={this._onChangePasswordClicked} role='button' style={{width:'80%',minWidth:'80%'}}
                           styleName='button unselectable primary'>
                          <span>{'Modifier'}</span>
                        </a>

                      </div>

                    </div>

                  </div>

                </div>

              </div>

              <br/>

              <div styleName='fieldset'>

                {/*<div styleName='legend'>{formatMessage(messages.AppManagementLegend)}</div>*/}

                {/*<div styleName='description-1'>{formatMessage(messages.AppManagementLegendDesc)}</div>*/}

                <div styleName='fields'>

                  <div styleName='field'>

                    <div styleName='left' style={{width:'56%'}}>
                      <div styleName='label centered' style={{padding:'0 20px'}}>
                        <div styleName='text'>{formatMessage(messages.LogoutLabel)}</div>
                        <div styleName='description-2'>{formatMessage(messages.LogoutDesc)}</div>
                      </div>
                    </div>

                    <div styleName='right' style={{marginLeft:'56%'}}>

                      <div styleName='input'>

                        <a href='javascript:;' onClick={this._onLogOut} role='button' style={{width:'80%',minWidth:'80%'}}
                           styleName='button unselectable primary btn-danger'>
                          <span>{formatMessage(messages.LogoutAction)}</span>
                        </a>

                      </div>

                    </div>

                  </div>

                  {/*<div styleName='field'>

                    <div styleName='left' style={{width:'56%'}}>
                      <div styleName='label centered' style={{padding:'0 20px'}}>
                        <div styleName='text'>{formatMessage(messages.AppManagementLegendLeftLabel)}</div>
                        <div styleName='description-2'>{formatMessage(messages.AppManagementLegendLeftDesc)}</div>
                      </div>
                    </div>

                    <div styleName='right' style={{marginLeft:'56%'}}>

                      <div styleName='input'>

                        <a href='javascript:;' onClick={this._onDelClicked} role='button' style={{width:'80%',minWidth:'80%'}}
                           styleName='button unselectable primary btn-danger'>
                          <span>{formatMessage(messages.AppManagementLegendDelAction)}</span>
                        </a>

                      </div>

                    </div>

                  </div>*/}

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
          viewer: this.props.viewer,
        },
        this.props.children
      );
    }
  }

  return Relay.createContainer(CWrapper, {
    initialVariables: {},

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

        }
      `,
    },
  });
}

module.exports = (props) => (
  <Relay.RootContainer
    forceFetch={true}
    Component={wrapWithC(AccountSettings, props)}
    route={new SettingsHomeRoute()}
    renderLoading={function() {
      return (
        <div className='loading'>

          <Sidebar
            viewer={props.viewer}
            page='/account'
          />

          <div className='content'>

              <Loading/>

          </div>

        </div>
      );
    }}
  />
);
