import React, {Component, PropTypes} from 'react';

import CSSModules from 'react-css-modules';

import styles from './Sidebar.scss';

import Header from './SidebarHeader';

import {
  FormattedMessage,
  defineMessages,
} from 'react-intl';

const messages = defineMessages({
  '/apps': {
    id: 'apps-menu-item-title',
    description: 'The title of Your Companies menu.',
    defaultMessage: 'Your Companies',
  },

  '/account': {
    id: 'account-settings-menu-item-title',
    description: 'The title of your Account Settings menu.',
    defaultMessage: 'Account AccountSettings',
  },

});

const PAGES = [{
  page: '/apps',
  icon: 'inbox',
}, {
  page: '/account',
  icon: 'supervisor_account',
}];

@CSSModules(styles, {
  allowMultiple: true
})
class Link extends Component {
  render() {

    const {selected, page, icon, onClick} = this.props;

    if (selected) {
      return (
        <div styleName="section active">
          <div styleName="section_header">
            <i className="material-icons md-36">{icon}</i>
            <span>
              <FormattedMessage {...messages[page]} />
            </span>
          </div>
        </div>
      );
    }

    return (
      <div styleName="section">
        <a styleName="section_header" onClick={onClick.bind(null, page)}>
          <i className="material-icons md-36">{icon}</i>
          <span>
            <FormattedMessage {...messages[page]} />
          </span>
        </a>
      </div>
    );
  };
}

class HomeSidebar extends Component {

  static contextTypes = {
    router: PropTypes.object
  };

  _onClick = (path, e) => {
    e.preventDefault();

    this.context.router.push(path);
  };

  render() {
    return (
      <div>

        <div styleName="sidebar">

          <Header
            viewer={this.props.viewer}
            styles={this.props.styles}
            onClick={this._onClick}
          />

          <div styleName="content">

            {PAGES.map(({page, icon, title,}) => {
              return (
                <Link
                  key={page}
                  page={page}
                  icon={icon}
                  title={title}
                  selected={this.props.page === page}
                  onClick={this._onClick}
                />
              )
            })}

          </div>

        </div>

      </div>
    );
  }
}

export default CSSModules(HomeSidebar, styles, {
  allowMultiple: true
});
