import React, { Component, PropTypes, } from 'react';
import Relay from 'react-relay';

import Modal from 'react-bootstrap/lib/Modal';

import stopEvent from '../../../utils/stopEvent';

import LazyCache from 'react-lazy-cache';

import Dialog, { Header, Body, } from '../../utils/Dialog';

import classnames from 'classnames';

import throttle from 'lodash.throttle';

import Loading from '../../Loading/Loading';

import styles from './Search.scss';

import {
  getBodyWidth,
} from '../../../utils/dimensions';

import events from 'dom-helpers/events';

import CSSModules from 'react-css-modules';

@CSSModules(styles, { allowMultiple: true, })
class Search extends Component{
  static displayName = 'AppSearch';
  static propTypes = {};
  static contextTypes = {};
  state = {
    bodyWidth: getBodyWidth(),
  };

  _onClear = () => {

    this.refs.textInput.value = '';
    this.refs.textInput.focus();

    // const doWork = (resolve) => {
    //   this.refs.textInput.value = '';
    //   this.props.relay.setVariables({
    //     searchQuery: null,
    //   }, function({ done, }) {
    //     if(done){
    //       resolve && resolve();
    //     }
    //   });
    // };
    //
    // if(this._promise){
    //   this._promise.then(doWork);
    // }else{
    //   this._promise = new Promise(doWork);
    // }
  };

  _onInput = e => {
    stopEvent(e);

    if(this.props.loading){
      return;
    }

    const searchQuery = String(e.target.value);

    const doWork = (resolve) => {
      this.props.relay.setVariables({
        searchQuery,
      }, function({ done, }) {
        if(done){
          resolve && resolve();
        }
      });
    };

    if(this._promise){
      this._promise.then(doWork);
    }else{
      this._promise = new Promise(doWork);
    }
  };

  _handleClose = () => {
    this.props.onClose()
  };

  componentDidMount() {
    events.on(window, 'resize', this._handleWindowResize);
  }

  componentWillUnmount() {
    events.off(window, 'resize', this._handleWindowResize);
  }

  _handleWindowResize = throttle(() => {
    this.setState({
      bodyWidth: getBodyWidth(),
    });
  }, 150);

  render(){
    const {
      bodyWidth,
    } = this.state;
    const {
      company,
      loading,
      stale,
      styles,
    } = this.props;
    const { searchQuery, } = this.props.relay.variables;
    return (
      <Modal dialogClassName={`${styles['modal']}`}
             dialogComponentClass={Dialog}
             className={classnames({'imodal-fullscreen': true, })}
             show={true} keyboard={true} backdrop={false} onHide={() => this._handleClose()} autoFocus enforceFocus>

        <Header>

        <div style={{
          position: 'fixed',
          top: 0,
          height: 64,
          left: 0,
          width: bodyWidth,
        }} styleName={'header_search_panel sticky layer layer4'}></div>

        <div style={{
           position: 'fixed',
           top: 0,
           height: 64,
           left: 140,
           width: bodyWidth - 280,
        }} styleName={' layer5'}>

          <div style={{ height: '100%', }} styleName={' layout horizontal center'}>

            {loading || stale ? <Loading/> : <div styleName='core-icon'>
              <i className='material-icons'>search</i>
            </div>}

            <input
              ref={'textInput'}
              onChange={this._onInput}
              onFocus={this._onInput}
              autoFocus
              styleName={'flex searchBox'}
              placeholder='Rechercher'
              aria-label='Rechercher'/>

            {!!searchQuery && <div onClick={this._onClear} styleName={'clearSearch layout horizontal reverse'}>
              <i className='material-icons'>clear</i>
            </div>}

          </div>

        </div>

        </Header>

         <Body>

           <div style={{
             position: 'absolute',
             overflowY: 'auto',
             top: 25,
             marginTop: 12,
             left: 140,
             bottom: 0,
             width: bodyWidth - 280,
           }} styleName={'layer'}>

            Le résultat du recherche s'affichera ici.


           </div>

         </Body>

			</Modal>
    );
  }
}

class RelayRoute extends Relay.Route {
  static queries = {
    viewer: () => Relay.QL`
      query {
        viewer
      }
    `,
  };
  static paramDefinitions = {
    companyId: {required: true},
  };
  static routeName = 'AppSearch';
}

function wrapWithC(MyComponent, props) {
  class CWrapper extends Component {
    static propTypes = {
      loading: PropTypes.bool.isRequired,
    };

    static defaultProps = {
      loading: false,
      stale: false,
    };

    render() {
      const { stale, loading, viewer : root, relay, children, } = this.props;
      return React.createElement(
        MyComponent, {
          ...props,
          stale: stale,
          loading: loading,
          company: loading ? undefined : root.company,
          root: root,
          viewer: root,
          relay: relay,
        },
        children
      );
    }
  }

  return Relay.createContainer(CWrapper, {
    initialVariables: {
      companyId: props.companyId,
      searchQuery: null,
    },

    fragments: {

      viewer: () => Relay.QL`

        fragment on User {

          objectId,
          id,
          displayName,
          username,
          email,
          createdAt,
          updatedAt,
          sessionToken,

          company(id: $companyId){

            objectId,

            id,
            displayName,
          }

        }
      `
    },
  });

}

function createContainer({ company, onClose, }){
  const Route = new RelayRoute({ companyId: company.id, });
  const MyComponent = wrapWithC(Search, { companyId: company.id, onClose, });

  class Container extends Component{
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
              />
            );
          }}
          renderLoading={function() {
            return (
              <MyComponent
                loading={true}
              />
            );
          }}
        />
      );
    }
  }

  return () => Container;
}

class S extends Component{
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
  shouldComponentUpdate(nextProps){
    return this.props.company.id !== nextProps.company.id;
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
