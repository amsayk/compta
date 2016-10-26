import React, {Component, PropTypes,} from 'react';
import Relay from 'react-relay';

import Sidebar from '../Sidebar/HomeSidebar';
import Spinner from '../Loading/Loading';

import CSSModules from 'react-css-modules';

import styles from './Apps.scss';

import {
  getBodyHeight,
} from '../../utils/dimensions';

import Income from './cards/Income';
import Result from './cards/Result';

import LazyCache from 'react-lazy-cache';

import stopEvent from '../../utils/stopEvent';

import AppsHomeRoute from '../../routes/AppsHomeRoute';

import CompanyForm from '../CompanyForm/v2/CompanyForm';

import {editStart,} from '../../redux/modules/companies';

// import {sortMostRecent,} from '../../utils/sort';

import AddCompanyMutation from '../../mutations/AddCompanyMutation';
import RemoveCompanyMutation from '../../mutations/RemoveCompanyMutation';

import {TransitionMotion, spring, presets,} from 'react-motion';

import {
  FormattedMessage,
  FormattedRelative,
  intlShape,
} from 'react-intl';

import messages from './messages';

const Empty = ({styles, message,}) => (
  <div className={styles.empty} style={{ top: '88px', color: '#fdfafb' }}>

    <div className={styles.center}>

      <div className={styles.icon}>
        <i style={{ color: '#343445', width:'80', height:'80', fontSize: '80px', }} className='material-icons md-light'>
          perm_media
        </i>
      </div>

      <div className={styles.title}>{message}</div>

      {/*

       <div className={styles.description}>Add a row to store an object in this class</div>

       <a href='javascript:;' onClick={onNew} role='button' className={`${styles.button} unselectable primary`}>
       <span>Add a row</span>
       </a>

       */}

    </div>

  </div>
);

class Header extends React.Component {
  static contextTypes = {
    intl: intlShape.isRequired
  };

  render() {
    const {formatMessage,} = this.context.intl;
    return (
      <div className='header'>
        <i className='material-icons' style={{color: '#788c97', transform: 'rotate(90deg)', }}>search</i>
        <input
          onChange={this.props.onFilterChange}
          className='search'
          placeholder={formatMessage(messages['filter'])}
          value={this.props.filterQuery ? this.props.filterQuery : ''}
        />
        <a onClick={this.props.onAddClicked} role='button' className='create'>
          <FormattedMessage {...messages['newApp']} />
        </a>
      </div>
    );
  }
}

@CSSModules(styles, {})
class Apps extends React.Component {

  static contextTypes = {
    store: PropTypes.object.isRequired,
    intl: intlShape.isRequired,
    router: PropTypes.object.isRequired,
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

  _onDoneCreateCompany = (id, isSuccess) => {
    isSuccess && this.context.router.push({
      pathname: `/apps/${id}/`,
      state: {},
    });

    this._close();
  };

  _renderForm = () => {
    const form = this.state.modalOpen ? (
      <CompanyForm
        canCancel={this.props.companies ? this.props.companies.length === 0 : false}
        onRequestHide={this._close}
        onDoneCreateCompany={this._onDoneCreateCompany}
        formKey={'NEW'}
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

  willEnter() {
    // triggered when c's gone. Keeping c until its width/height reach 0.
    return {height: 0, opacity: 1,};
  }

  willLeave() {
    // triggered when c's gone. Keeping c until its width/height reach 0.
    return {height: spring(0), opacity: spring(0),};
  }

  render() {

    const {formatMessage,} = this.context.intl;

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

    const _onClick = (id, e) => {
      e.preventDefault();
      e.stopPropagation();
      this.context.router.push({
        pathname: `/apps/${id}/`,
        state: {},
      })
    };

    const ls = this.props.companies.filter(company => matchesFilter(company)).slice();

    // ls.sort(sortMostRecent(obj => Date.parse(obj.createdAt)));

    const { styles, readyState, } = this.props;

    const privateModeOn = localStorage.getItem('dashboard.privateModeOn') === null
      ? false
      : JSON.parse(localStorage.getItem('dashboard.privateModeOn'));

    if(readyState.done && !readyState.stale){
      // localStorage.setItem('apps.lastCount', ls.length);
    }

    return (
      <div className='' styleName={'apps'}>

        <Sidebar viewer={this.props.viewer} page='/apps'/>

        <div className='content' style={{
          height: getBodyHeight(),
          background: '#1e3b4d', }}>

          <div className='index'>

            <Header
              filterQuery={this.state.filterQuery}
              onAddClicked={this._onAddClicked}
              onFilterChange={this._onFilterChange}
            />

            {ls.length === 0 ?
              <Empty message={formatMessage(messages.noData)} styles={this.props.styles}/> :

              <TransitionMotion
                // willEnter={this.willEnter}
                // willLeave={this.willLeave}
                defaultStyles={ls.map(item => ({
                    key: item.id,
                    style: {
                      height: 0,
                      opacity: 1,
                    },
                    }))}
                styles={ls.map(item => ({
                    key: item.id,
                    style: {
                      height: spring(80, presets.gentle),
                      opacity: spring(1, presets.gentle),
                    },
                    data: item,
                  }))}>
                {interpolatedStyles =>
                  // first render: a, b, c. Second: still a, b, c! Only last one's a, b.
                  <ul className='apps'>
                    {interpolatedStyles.map(config => {
                      return (
                        <li key={config.key} onClick={e => _onClick(config.data.id, e)} style={{ height: config.style.height, }}>

                          <div className=''>

                            <a className='icon'>
                              {/*<i className='material-icons md-48 md-dark md-inactive'>inbox</i>*/}
                              <i className='material-icons md-48 md-dark md-inactive'>business</i>
                            </a>

                            <Income
                              privateModeOn={privateModeOn}
                              viewer={this.props.viewer}
                              company={config.data}
                            />

                            {privateModeOn ? null : <Result
                              viewer={this.props.viewer}
                              company={config.data}
                            />}

                            <div className={'details'}>
                              <a className={'appname'}>{config.data.displayName}</a>
                              <div>
                                <span>
                                  <FormattedMessage {...messages['created']} />
                                </span>
                                {' '}
                                <span className={'ago'}>
                                  <FormattedRelative value={config.data.createdAt}/>
                                </span>
                              </div>
                            </div>

                          </div>

                        </li>
                      );
                    })}
                  </ul>
                }
              </TransitionMotion>
            }

          </div>

        </div>

        {this._renderForm()}

      </div>
    );
  }
}

function wrapWithC(Component, props) {
  class CWrapper extends React.Component {
    static contextTypes = {
      router: PropTypes.object.isRequired,
    };
    static defaultProps = { readyState: { done: false, stale: true, }, };
    // constructor(props, context){
    //   super(props, context);
    //
    //   const { readyState, viewer, } = this.props;
    //   if(readyState.done && viewer && viewer.companies.edges.length === 1){
    //
    //   }
    // }
    render() {
      const { readyState, viewer, } = this.props;
      // if(readyState.done && viewer && viewer.companies.edges.length === 1){
      //   setImmediate(() => {
      //     const id = viewer.companies.edges[0].node.id;
      //     this.context.router.replace({
      //       pathname: `/apps/${id}/`,
      //       state: {},
      //     });
      //   });
      // }
      return React.createElement(
        Component,
        {
          ...props,
          companies: viewer.companies.edges.map(({ node: company, }) => company),
          viewer: viewer,
          readyState: readyState,
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

        ${AddCompanyMutation.getFragment('viewer')}

        companies(first: 100000){

          edges{
            node{
              objectId,
              id,
              displayName,
              periodType,
              lastTransactionIndex, lastPaymentsTransactionIndex,
              createdAt,
              updatedAt,
              ${RemoveCompanyMutation.getFragment('company')}
            }
          }
        },

      }

    `,
    },
  });
}

// module.exports = (props) => (
//   <Relay.RootContainer
//     forceFetch={true}
//     Component={wrapWithC(Apps, props)}
//     route={new AppsHomeRoute()}
//     renderLoading={function() {
//       return (
//         <div className='loading'>
//
//           <Sidebar
//             viewer={props.viewer}
//             page='/apps'
//           />
//
//           <div className='content'>
//
//               <Loading/>
//
//           </div>
//
//         </div>
//       );
//     }}
//   />
// );

function createContainer({ ...props, }){
  const Route = new AppsHomeRoute();
  const MyComponent = wrapWithC(Apps, props);

  class Container extends React.Component{
    shouldComponentUpdate(){
      return false;
    }
    render(){
      return (
        <Relay.RootContainer
          Component={MyComponent}
          forceFetch={true}
          route={Route}
          renderFetched={function(data, readyState){
            return (
              <MyComponent
                {...data}
                stale={readyState.stale}
                readyState={readyState}
              />
            );
          }}
          renderLoading={function() {
            return (
              <div className='loading'>

                <Sidebar
                  viewer={props.viewer}
                  page='/apps'
                />

                <div className='content' style={{
                  height: getBodyHeight(),
                  background: '#1e3b4d', }}>

                    <Loading/>

                </div>

              </div>
            );
          }}
        />
      );

    }
  }

  return () => Container;
}

class S extends React.Component{
  constructor(props) {
    super(props);
    this.cache = new LazyCache(this, {
      Component: {
        params: [
          // props that effect how redux-form connects to the redux store
        ],
        fn: createContainer(props),
      }
    });
  }
  shouldComponentUpdate(){
    return false;
  }
  componentWillReceiveProps(nextProps) {
    this.cache.componentWillReceiveProps(nextProps);
  }
  render() {
    const {Component} = this.cache;
    return <Component {...this.props}/>;
  }
}

module.exports = S;

@CSSModules(styles, {})
class Loading extends React.Component{
  render(){
    // const appsCount = localStorage.getItem('apps.lastCount') === null
    //   ? 0
    //   : JSON.parse(localStorage.getItem('apps.lastCount'));

    return (
      <Spinner/>
    );
  }
}
