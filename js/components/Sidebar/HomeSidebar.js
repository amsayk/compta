import React, {Component, PropTypes} from 'react';

import CSSModules from 'react-css-modules';

import styles from './Sidebar.scss';

import Header from './SidebarHeader';

import throttle from 'lodash.throttle';

import events from 'dom-helpers/events';

import Title from '../Title/Title';

import find from 'lodash.findindex';

// import Fade from 'react-bootstrap/lib/Fade';

import {getBodyHeight,} from '../../utils/dimensions';

import {
  FormattedMessage,
  defineMessages,
  intlShape,
} from 'react-intl';

const messages = defineMessages({
  '/apps': {
    id: 'apps-menu-item-title',
    defaultMessage: 'Mes sociétés',
  },

  '/account': {
    id: 'account-settings-menu-item-title',
    defaultMessage: 'Compte',
  },

  '/apps-title': {
    id: 'apps-menu-item-title.meta',
    defaultMessage: 'Mes sociétés | Compta',
  },

  '/account-title': {
    id: 'account-settings-menu-item-title.meta',
    defaultMessage: 'Paramètres de compte | Compta',
  },

});

const PAGES = [{
  page: '/apps',
  icon: 'business',
}, {
  page: '/account',
  icon: 'supervisor_account',
}];

@CSSModules(styles, {
  allowMultiple: true
})
class Link extends React.Component {
  // static contextTypes = {
  //   intl: intlShape.isRequired,
  // };
  render() {
    // const { intl, } = this.context;
    const {selected, page, icon, onClick} = this.props;

    if (selected) {
      return (
        <div styleName='section active'>
          {/*<Title title={intl.formatMessage(messages[`${page}-title`])}/>*/}
          <div styleName='section_header'>
            <i className='sidebar-link-icon active material-icons md-36'>{icon}</i>
            <span className='sidebar-link-text active'>
              <FormattedMessage {...messages[page]} />
            </span>
          </div>
        </div>
      );
    }

    return (
      <div styleName='section'>
        <a styleName='section_header' onClick={onClick.bind(null, page)}>
          <i className='sidebar-link-icon material-icons md-36'>{icon}</i>
          <span className='sidebar-link-text'>
            <FormattedMessage {...messages[page]} />
          </span>
        </a>
      </div>
    );
  };
}

class HomeSidebar extends React.Component {

  static contextTypes = {
    router: PropTypes.object,
    intl: intlShape.isRequired,
  };

  state = {
    show: false,
  };

  _onClick = (path, e) => {
    e.preventDefault();

    this.context.router.push(path);
  };

  componentDidMount() {
    setTimeout(() => {
      this.setState({
        show: true,
      });
    }, 100);

    events.on(window, 'resize', this._handleWindowResize);
  }

  componentWillUnmount() {
    events.off(window, 'resize', this._handleWindowResize);
  }

  _handleWindowResize = throttle(() => {
    this.forceUpdate();
  }, 150);

  render() {
    const { intl, } = this.context;
    const { show, } = this.state;

    let selectedPage = null;

    return (
      // <Fade in={show}>

        <div className={''}>

          <div styleName='sidebar' className={'has-white-links height100Percent'} style={{ height: document.body.scrollHeight, }}>

            <Header
              viewer={this.props.viewer}
              styles={this.props.styles}
              onClick={this._onClick}
            />

            <div styleName='content'>

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

          <Title title={intl.formatMessage(messages[`${this._getSelectedPage()}-title`])}/>

        </div>

      // </Fade>
    );
  }

  _getSelectedPage(){
    const index = find(PAGES, ({page}) => page === this.props.page);
    return PAGES[index].page;
  }
}

export default CSSModules(HomeSidebar, styles, {
  allowMultiple: true
});
