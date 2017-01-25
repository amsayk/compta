import React, {Component, PropTypes} from 'react';

import CSSModules from 'react-css-modules';
import classnames from 'classnames';
import findIndex from 'lodash.findindex';

import messages from './messages';

import shallowEqual from 'fbjs/lib/shallowEqual';

import styles from './Sidebar.scss';

import Header from './SidebarHeader';

import Title from '../Title/Title';

import Loading from '../Loading/Loading';

// import {getBodyHeight,} from '../../utils/dimensions';

// import CompanyForm from '../CompanyForm/CompanyForm';

import {editStart as newAppEditStart,} from '../../redux/modules/companies';

import throttle from 'lodash.throttle';

import events from 'dom-helpers/events';

// import Fade from 'react-bootstrap/lib/Fade';

// import {sortMostRecent,} from '../../utils/sort';

// import Fab from '../Fab/Fab';
let Fab = null;

function loadFab(done) {
  if(Fab){
    done();
    return;
  }

  require.ensure([], function (require) {
    Fab = require('../Fab/Fab');
    done();
  }, 'Fab');
}

import {
  FormattedMessage,
  intlShape,
} from 'react-intl';

class Group extends React.Component {
  static displayName = 'SidebarGroup';

  static contextTypes = {
    router: PropTypes.object.isRequired,
    intl: intlShape.isRequired,
  };

  static propTypes = {
    company: PropTypes.shape({
      id: PropTypes.string.isRequired,
    }).isRequired,
    icon: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    selected: PropTypes.string.isRequired,
    menus: PropTypes.arrayOf(PropTypes.shape({
      page: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
    })).isRequired,
  };

  constructor(props) {
    super(props);

    const {menus, selected} = this.props;

    const selectedIndex = findIndex(menus, ({page}) => page === selected);

    this.state = {
      selectedIndex,
      open: selectedIndex !== -1,
    };
  }

  componentWillReceiveProps({menus, selected}) {
    const selectedIndex = findIndex(menus, ({page}) => page === selected);
    (selectedIndex !== this.state.selectedIndex) && this.setState({selectedIndex, open: selectedIndex !== -1,});
  }

  _renderMenus(company, open, menus, selectedIndex, styles) {

    if (open) {
      const { intl, } = this.context;

      const goTo = (page, selectedIndex) => {
        return e => {
          e.preventDefault();
          e.stopPropagation();

          this.setState({selectedIndex}, () => {
            this.context.router.push(`/apps/${company.id}${page}`);
          });
        };
      };

      return (
        <div className={`${styles['section_contents']} sidebar-link-group-children`}>

          <div>

            <div>

              {menus.map(({page, title: name}, index) => {

                if (index === selectedIndex) {
                  return (
                    <div key={page}>

                      <Title title={intl.formatMessage(messages[`${page}-title`] || messages[page])}/>

                      <div className={styles['subitem']}>
                        <span>{name}</span>
                      </div>

                    </div>
                  );
                }

                return (
                  <div key={page}>
                    <a className={styles['subitem']} onClick={goTo(page, index)}>{name}</a>
                  </div>
                );

              })}

              {selectedIndex !== -1 && <div style={{top: /* 322 */ 291 + (selectedIndex * 28)}} className={styles['overlay']}></div>}

            </div>

          </div>

        </div>
      );
    }

    return null;
  }

  render() {
    const {selectedIndex, open,} = this.state;
    const {company, icon, title, styles, menus} = this.props;

    return (
      <div className={classnames({
        [styles['section']]: true,
        [styles['active']]: selectedIndex !== -1,
        })}>

        <div className={styles['section_header']} onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          this.setState({open: !this.state.open})
        }} style={{
          cursor: 'pointer',
        }}>

          <i className={`sidebar-link-icon ${selectedIndex !== -1 ? 'active' : ''} material-icons md-36`}>{icon}</i>

          <span className={`sidebar-link-text ${selectedIndex !== -1 ? 'active' : ''}`}>
            {title}
          </span>

          <span style={{ right: -10, verticalAlign:'middle', position: 'relative', }}
                className={`material-icons sidebar-link-chevron ${styles['open']}`}>
            <i className={`material-icons`}>{open ? 'keyboard_arrow_up' : 'keyboard_arrow_down'}</i>
          </span>

        </div>

        {this._renderMenus(company, open, menus, selectedIndex, styles)}

      </div>
    );
  }
}

@CSSModules(styles, {
  allowMultiple: true
})
class Link extends React.Component {
  static displayName = 'SidebarLink';
  static contextTypes = {
    intl: intlShape.isRequired,
  };
  render() {
    const { intl, } = this.context;
    const {selected, page, icon, onClick} = this.props;

    if (selected) {
      return (
        <div styleName='section active'>
          <Title title={intl.formatMessage(messages[`${page}-title`] || messages[page])}/>
          <div styleName='section_header'>
            <i className='sidebar-link-icon active material-icons md-36'>{icon}</i>
            <span className='sidebar-link-text active'>
              <FormattedMessage {...messages[page]} />
            </span>
            {this.props.children}
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

const PATHS = {
  '/dashboard': (id) => `/apps/${id}/`,

  '/customers': (id) => `/apps/${id}/customers`,
  '/vendors':   (id) => `/apps/${id}/vendors`,
  '/employees': (id) => `/apps/${id}/employees`,
  '/rapports':   (id) => `/apps/${id}/rapports`,
  '/settings':  (id) => `/apps/${id}/settings`,

  '/vat':       (id) => `/apps/${id}/vat`,

  '/apps':      () => '/apps',
  '/account':   () => '/account',

  '/sales' : (id) => `/apps/${id}/sales`,
  '/expenses' : (id) => `/apps/${id}/expenses`,
  '/accounts' : (id) => `/apps/${id}/accounts`,
};

@CSSModules(styles, {
  allowMultiple: true
})
export default class extends React.Component {
  static displayName = 'AppSidebar';

  static contextTypes = {
    intl: intlShape.isRequired,
    router: PropTypes.object,
    store: PropTypes.object.isRequired,
  };

  state = {
    show: true,
    open: true,
    newAppModalOpen: false,
    newTransactionModalOpen: false,
  };

  _hide = (e) => {
    //if(!e.target.classList.contains(this.props.styles.option)){
    //  this.setState({
    //    open: false
    //  });
    //}

    if (document.body.classList.contains('modal-open')) {
      return;
    }

    if (this.refs.menu && !this.state.open && !this.refs.menu.contains(e.target)) {
      this.setState({
        open: true,
      });
    }
  };

  shouldComponentUpdate(nextProps, nextState){
    if(typeof nextProps.stale !== 'undefined'){
      return nextProps.stale !== true;
    }

    return ! shallowEqual(nextState, this.state) || ! shallowEqual(nextProps, this.props);
  }

  componentDidMount() {
    setTimeout(() => {

      loadFab(() => {
        this.forceUpdate();
      });

    }, 1500);

    events.on(window, 'resize', this._handleWindowResize);
    events.on(document, 'click', this._hide, true);
  }

  componentWillUnmount() {
    events.off(window, 'resize', this._handleWindowResize);
    events.off(document, 'click', this._hide, true);
  }

  _handleWindowResize = throttle(() => {
    this.forceUpdate();
  }, 150);

  _onAddClicked = (e) => {
    e.preventDefault();
    setImmediate(() => this.context.store.dispatch(newAppEditStart('NEW')));
    this.setState({
      newAppModalOpen: true
    })
  };

  _close = () => {
    this.setState({newAppModalOpen: false, newTransactionModalOpen: false});
  };

  // _renderNewAppForm = () => {
  //   const form = this.state.newAppModalOpen ? (
  //     <CompanyForm
  //       initialValues={{ periodType: 'MONTHLY', }}
  //       onCancel={this._close}
  //       formKey={'NEW'}
  //       root={this.props.root}
  //       viewer={this.props.viewer}
  //     />
  //   ) : null;
  //
  //   return form;
  // };

  _onToggle = (e) => {
    e.stopPropagation();

    this.setState({
      open: !this.state.open
    });
  };

  _onClick = (path, e) => {
    e.preventDefault();

    const { route, } = this.props;

    this.context.router.push(PATHS[path](route.params.companyId));
  };

  _onClickCompany = (id, e) => {
    e.preventDefault();

    this.context.router.push(`/apps/${id}/`);
    // this.context.router.push(PATHS[this.props.page](id));
  };

  _renderMenu = () => {
    const { page, company, companies = [], viewer, styles, route, } = this.props;

    const {formatMessage,} = this.context.intl;

    const closed = !this.state.open;

    const apps = closed ? companies.filter(({id}) => id !== route.params.companyId).slice() : [];
    // apps.sort(sortMostRecent(obj => Date.parse(obj.createdAt)));

    return [
      <div ref='menu' key={closed ? 'appsMenu' : 'apps'} className={'has-white-links hidden'} styleName={closed ? 'appsMenu unselectable' : 'apps'}>

        <div styleName='currentApp' onClick={this._onToggle}>{company ? company.displayName : (lastCompany && lastCompany.displayName ? lastCompany.displayName : '')}</div>

        {closed && <div styleName='menuSection'>{formatMessage(messages.ALL_APPS)}</div>}

        <div style={{ overflowY: 'auto', marginBottom: '15px', }}>

          {closed && apps.map(company => {
            return (
              <a styleName='menuRow' key={company.id} onClick={this._onClickCompany.bind(this, company.id)}>
                <span>{company.displayName}</span>
                {/*<span styleName='badge'>DEV</span>*/}
              </a>
            );
          })}

        </div>

        {closed &&
        <a onClick={this._onAddClicked} role='button' styleName='createApp'>{formatMessage(messages.NewApp)}</a>}

      </div>
    ];

  }

  render() {
    const { show, } = this.state;
    const { page, company, companies, viewer, styles, route, } = this.props;

    const {formatMessage,} = this.context.intl;

    const OPERATIONS = [/*{
      page: '/tresors',
      title: formatMessage(messages['/tresors']),
    }, */{
      page: '/sales',
      title: formatMessage(messages['/sales']),
    }, {
      page: '/expenses',
      title: formatMessage(messages['/expenses']),
    }, /*{
      page: '/accounts',
      title: formatMessage(messages['/accounts']),
    },*/];

    if(company){
      lastCompany = company;
    }

    return (
      // <Fade in={show}>

        <div className={'sidebar-wrapper'}>

          <div styleName='sidebar' className={'height100Percent sidebar'} style={{ height: document.body.scrollHeight, }}>

            <Header
              viewer={viewer}
              styles={styles}
              onClick={this._onClick}
            />

            {this._renderMenu()}

            {/*company && */this.state.open && <div styleName='sections'>

              <Link
                page={'/dashboard'}
                icon={'grid_on'}
                selected={page === '/dashboard'}
                onClick={this._onClick}
              />


              <Link
                page={'/customers'}
                icon={'local_library'}
                selected={page === '/customers'}
                onClick={this._onClick}
              />

              <Link
                page={'/vendors'}
                icon={'import_contacts'}
                selected={page === '/vendors'}
                onClick={this._onClick}
              />

              <Link
                page={'/employees'}
                icon={'work'}
                selected={page === '/employees'}
                onClick={this._onClick}
              />

              <Group
                company={company ? company : { id: route.params.companyId, }}
                icon={'assessment'}
                menus={OPERATIONS}
                styles={styles}
                selected={page}
                title={formatMessage(messages['/transactions'])}/>

              {/*<Link*/}
                {/*page={'/rapports'}*/}
                {/*icon={'group_work'}*/}
                {/*selected={page === '/rapports'}*/}
                {/*onClick={this._onClick}*/}
              {/*/>*/}

              <Link
                page={'/vat'}
                icon={'gavel'}
                selected={page === '/vat'}
                onClick={this._onClick}
              />

              <Link
                page={'/settings'}
                icon={'settings'}
                selected={page === '/settings'}
                onClick={this._onClick}
              />

            </div>}

          </div>

          {/*{this._renderNewAppForm()}*/}
          {page === '/dashboard' && Fab && <Fab company={{ id: route.params.companyId, }}/>}

        </div>

      // </Fade>
    );
  }
}

let lastCompany = null;
