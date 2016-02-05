import React, {Component,PropTypes} from 'react';
import Relay from 'react-relay';

import Sidebar from '../Sidebar/AppSidebar';
import Loading from '../Loading/Loading';

import CSSModules from 'react-css-modules';

import styles from './AppSettings.scss';

import AppSettingsRoute from '../../routes/AppSettingsRoute';

// import AppSettingsForm from '../AppSettingsForm/AppSettingsForm';

import {editStart,} from '../../redux/modules/settings';

import {
  defineMessages,
  intlShape,
} from 'react-intl';

const Title = (company) => ({
  id: 'app-settings-page.displayName',
  defaultMessage: company.displayName,
});

const messages = defineMessages({

  Subtitle: {
    id: 'app-settings-page.title',
    defaultMessage: 'Settings',
  },

});

@CSSModules(styles, {allowMultiple: true})
class AppSettings extends Component {
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
    //const form = this.state.modalOpen ? (
    //  <AppSettingsForm
    //    onCancel={this._close}
    //    initialValues={{operations: []}}
    //    formKey={'NEW'}
    //  />
    //) : null;
    //
    //return form;

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
          page="/settings"
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

              Settings

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
    initialVariables: {companyId: props.params.app},

    fragments: {
      root: () => Relay.QL`
        fragment on Query {
          id,

          company(id: $companyId){

            id,
            displayName,
            periodType,
            lastSeqNr,

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
    Component={wrapWithC(AppSettings, props)}
    route={new AppSettingsRoute({companyId: props.params.app})}
    renderLoading={function() {
      return (
        <div className="loading">

          <Sidebar
            viewer={props.viewer}
            company={props.company}
            companies={props.companies || []}
            page="/settings"
          />

          <div className="content">

              <Loading/>

          </div>

        </div>
      );
    }}
  />
);
