import React, {Component, PropTypes} from 'react';

import CSSModules from 'react-css-modules';

import styles from './Sidebar.scss';

import Header from './SidebarHeader';

import Loading from '../Loading/Loading';

import CompanyForm from '../CompanyForm/CompanyForm';
import TransactionForm from '../TransactionForm/TransactionForm';

import {editStart as newAppEditStart,} from '../../redux/modules/companies';
import {editStart as transactionEditStart,} from '../../redux/modules/transactions';

import events from 'dom-helpers/events';

import {sortMostRecent,} from '../../utils/sort';

import {
  FormattedMessage,
  defineMessages,
  intlShape,
} from 'react-intl';

const messages = defineMessages({
  ALL_APPS: {
    id: 'sidebar.all-apps',
    defaultMessage: 'All Companies',
  },

  NewApp: {
    id: 'sidebar.new-app',
    defaultMessage: 'Create a new app',
  },

  '/dashboard': {
    id: 'app-dashboard-menu-item-title',
    defaultMessage: 'Dashboard',
  },

  '/transactions': {
    id: 'transactions-menu-item-title',
    defaultMessage: 'Transactions',
  },

  '/accounts': {
    id: 'accounts-menu-item-title',
    defaultMessage: 'Chart of Accounts',
  },

  '/reports': {
    id: 'reports-menu-item-title',
    defaultMessage: 'Reports',
  },

  '/settings': {
    id: 'app-settings-menu-item-title',
    defaultMessage: 'Settings',
  },

});

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
            {this.props.children}
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

const PATHS = {
  '/dashboard': (id) => `/apps/${id}/`,
  '/transactions': (id) => `/apps/${id}/transactions`,
  '/accounts': (id) => `/apps/${id}/accounts`,
  '/reports': (id) => `/apps/${id}/reports`,
  '/settings': (id) => `/apps/${id}/settings`,

  '/apps': () => '/apps',
  '/account': () => '/account',
};

@CSSModules(styles, {
  allowMultiple: true
})
export default class extends Component {

  static contextTypes = {
    intl: intlShape.isRequired,
    router: PropTypes.object,
    store: PropTypes.object.isRequired,
  };

  state = {
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

    if(document.body.classList.contains('modal-open')){
      return;
    }

    if(this.refs.menu && !this.state.open && !this.refs.menu.contains(e.target)){
      this.setState({
        open: true
      });
    }
  };

  componentDidMount(){
    events.on(document, 'click', this._hide, true);
  }

  componentWillUnmount(){
    events.off(document, 'click', this._hide, true);
  }

  _onAddClicked = (e) => {
    e.preventDefault();
    this.context.store.dispatch(newAppEditStart('NEW'));
    this.setState({
      newAppModalOpen: true
    })
  };

  _onAddTransactionClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    this.setState({
      newTransactionModalOpen: true
    })
  };

  _close = () => {
    this.setState({newAppModalOpen: false, newTransactionModalOpen: false});
  };

  _renderNewAppForm = () => {
    const form = this.state.newAppModalOpen ? (
      <CompanyForm
        initialValues={{ periodType: 'MONTHLY', }}
        onCancel={this._close}
        formKey={'NEW'}
        root={this.props.root}
        viewer={this.props.viewer}
      />
    ) : null;

    return form;
  };

  _renderNewTransactionForm = () => {
    this.context.store.dispatch(transactionEditStart('NEW', []));
    const form = this.state.newTransactionModalOpen ? (
      <TransactionForm
        onCancel={this._close}
        formKey={'NEW'}
        company={this.props.company}
      />
    ) : null;

    return form;
  };

  _onToggle = (e) => {
    e.stopPropagation();

    this.setState({
      open: !this.state.open
    });
  };

  _onClick = (path, e) => {
    e.preventDefault();

    this.context.router.push(PATHS[path](this.props.company.id));
  };

  _onClickCompany = (id, e) => {
    e.preventDefault();

    this.context.router.push(`/apps/${id}/`);
  };

  _renderMenu = () => {

    if(this.props.company){

      const {formatMessage,} = this.context.intl;

      const closed = !this.state.open;

      const companies = closed ? this.props.companies.filter(({id}) => id !== this.props.company.id).slice() : [];
      companies.sort(sortMostRecent(obj => Date.parse(obj.createdAt)));

      return [
        <div ref="menu" key={closed ? 'appsMenu' : 'apps'} styleName={closed ? 'appsMenu unselectable' : 'apps'}>

          <div styleName="currentApp" onClick={this._onToggle}>{this.props.company.displayName}</div>

          {closed && <div styleName="menuSection">{formatMessage(messages.ALL_APPS)}</div>}

          <div style={{ overflowY: 'auto', marginBottom: '15px', }}>

            {closed && companies.map(company => {
              return (
                <a styleName="menuRow" key={company.id} onClick={this._onClickCompany.bind(this, company.id)}>
                  <span>{company.displayName}</span>
                  {/*<span styleName="badge">DEV</span>*/}
                </a>
              );
            })}

          </div>

          {closed && <a onClick={this._onAddClicked} role="button" styleName="createApp">{formatMessage(messages.NewApp)}</a>}

        </div>
      ];
    }

    return (
      <Loading/>
    );
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

          {this._renderMenu()}

          {this.props.company && this.state.open && <div styleName="sections">

            <Link
              page={'/dashboard'}
              icon={'grid_on'}
              selected={this.props.page === '/dashboard'}
              onClick={this._onClick}
            />

            <Link
              page={'/transactions'}
              icon={'assessment'}
              selected={this.props.page === '/transactions'}
              onClick={this._onClick}>

              <span styleName="action" onClick={this._onAddTransactionClick}>
                <i className="material-icons md-light" style={{ marginTop: '25%', fontWeight: 700, }}>add</i>
              </span>

            </Link>

            <Link
              page={'/accounts'}
              icon={'credit_card'}
              selected={this.props.page === '/accounts'}
              onClick={this._onClick}
            />

            <Link
              page={'/reports'}
              icon={'group_work'}
              selected={this.props.page === '/reports'}
              onClick={this._onClick}
            />

            <Link
              page={'/settings'}
              icon={'settings'}
              selected={this.props.page === '/settings'}
              onClick={this._onClick}
            />

          </div>}

        </div>

        {this._renderNewAppForm()}
        {this._renderNewTransactionForm()}

      </div>
    );
  }
}

