import React, {Component, PropTypes,} from 'react';
import Relay from 'react-relay';

import Sidebar from '../Sidebar/HomeSidebar';
import Loading from '../Loading/Loading';

import CSSModules from 'react-css-modules';

import styles from './Apps.scss';

import AppsHomeRoute from '../../routes/AppsHomeRoute';

import CompanyForm from '../CompanyForm/CompanyForm';

import {editStart,} from '../../redux/modules/companies';

import {sortMostRecent,} from '../../utils/sort';

import {
  FormattedMessage,
  FormattedRelative,
  defineMessages,
  intlShape,
} from 'react-intl';

const messages = defineMessages({

  newApp: {
    id: 'action.create-new-app',
    description: 'Label to create new company',
    defaultMessage: 'Create a new app',
  },

  created: {
    id: 'message.created',
    description: 'The word for created at.',
    defaultMessage: 'Created',
  },

  filter: {
    id: 'message.filter-companies',
    description: 'The message to filter the list of companies.',
    defaultMessage: 'Start typing to filter…',
  },

  noData: {
    id: 'message.no-data',
    description: '',
    defaultMessage: 'No data to display.',
  },

});

const Empty = ({ styles, message, }) => (
  <div className={styles.empty} style={{ top: '88px', background: '#fdfafb' }}>

    <div className={styles.center}>

      <div className={styles.icon}>
        <i style={{ color: "#343445", width:"80", height:"80", fontSize: '80px', }} className="material-icons md-light">perm_media</i>
      </div>

      <div className={styles.title}>{message}</div>

      {/*

       <div className={styles.description}>Add a row to store an object in this class</div>

       <a href="javascript:;" onClick={onNew} role="button" className={`${styles.button} unselectable primary`}>
       <span>Add a row</span>
       </a>

      */}

    </div>

  </div>
);

class Header extends Component {
  static contextTypes = {
    intl: intlShape.isRequired
  };

  render() {
    const {formatMessage,} = this.context.intl;
    return (
      <div className="header">
        <i className="material-icons" style={{color: '#788c97', transform: 'rotate(90deg)', }}>search</i>
        <input
          onChange={this.props.onFilterChange}
          className="search"
          placeholder={formatMessage(messages['filter'])}
          value={this.props.filterQuery}
        />
        <a onClick={this.props.onAddClicked} role="button" className="create">
          <FormattedMessage {...messages['newApp']} />
        </a>
      </div>
    );
  }
}

@CSSModules(styles, {})
class Company extends Component {
  static contextTypes = {
    router: PropTypes.object.isRequired,
  };

  _onClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    this.context.router.push({
      pathname: `/apps/${this.props.company.id}/`,
      state: {},
    })
  };
  render() {
    return (
      <li onClick={this._onClick} style={{}}>

        <a className="icon">
          <i className="material-icons md-48 md-dark md-inactive">inbox</i>
        </a>

        <div styleName="plan">
          <div styleName="section">Current plan</div>
          <div styleName="count">
            <div styleName="number">30</div>
            <div styleName="label">requests/s</div>
          </div>
          <div styleName="count">
            <div styleName="number">1</div>
            <div styleName="label">background job</div>
          </div>
          <div styleName="count">
            <div styleName="number">$0</div>
            <div styleName="label">monthly</div>
          </div>
          {/* <a href="/apps/${app}/settings" styleName="edit">Edit</a> */}
        </div>

        <div styleName="glance">
          <div styleName="section">At a glance</div>
          <div styleName="count">
            <div styleName="number">0</div>
            <div styleName="label">requests</div>
          </div>
          <div styleName="count">
            <div styleName="number">0</div>
            <div styleName="label">total users</div>
          </div>
          <div styleName="count">
            <div styleName="number">0</div>
            <div styleName="label">total installations</div>
          </div>
        </div>

        <div className="details">
          <a className="appname">{this.props.company.displayName}</a>
          <div>
            <span>
              <FormattedMessage {...messages['created']} />
            </span>
            {' '}
            <span className="ago">
              <FormattedRelative value={this.props.company.createdAt}/>
            </span>
          </div>
        </div>

      </li>
    );
  }
}

@CSSModules(styles, {})
class Apps extends Component {

  static contextTypes = {
    store: PropTypes.object.isRequired,
    intl: intlShape.isRequired,
  };

  state = {
    modalOpen: false,
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
      <CompanyForm
        onCancel={this._close}
        formKey={'NEW'}
        root={this.props.root}
        viewer={this.props.viewer}
      />
    ) : null;

    return form;
  };

  _onFilterChange = (e) => {
    this.setState({
      filterQuery: e.target.value
    })
  };

  render() {

    const { formatMessage, } = this.context.intl;

    const filterQuery = (this.state.filterQuery || '').trim();

    let matchesFilter;

    if (Boolean(filterQuery)) {

      const re = new RegExp('^' + (filterQuery || '').trim(), 'i');

      matchesFilter = (company) => {
        return re.test(company.displayName);
      };

    } else {

      matchesFilter = () => {
        return true;
      };

    }

    this.props.companies.sort(sortMostRecent(obj => Date.parse(obj.createdAt)));

    return (
      <div className="">

        <Sidebar viewer={this.props.viewer} page="/apps"/>

        <div className="content">

          <div className="index">

            <Header
              filterQuery={this.state.filterQuery}
              onAddClicked={this._onAddClicked}
              onFilterChange={this._onFilterChange}
            />

            {this.props.companies.length === 0 ? <Empty message={formatMessage(messages.noData)} styles={this.props.styles}/> : <ul className="apps">
              {this.props.companies.map((company) => {
                return matchesFilter(company) && <Company key={company.id} company={company}/>;
              })}
            </ul>}

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
        Component,
        {
          ...props,
          companies: this.props.root.companies, ...props,
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
    Component={wrapWithC(Apps, props)}
    route={new AppsHomeRoute()}
    renderLoading={function() {
      return (
        <div className="loading">

          <Sidebar
            viewer={props.viewer}
            page="/apps"
          />

          <div className="content">

              <Loading/>

          </div>

        </div>
      );
    }}
  />
);
