import React, {Component} from 'react';
import Relay from 'react-relay';

import Login from './Login';

import auth from '../utils/auth';

import RootComponent from './RootComponent';

module.exports = class App extends Component {

  state = {
    loggedIn: auth.isLoggedIn()
  };

  updateAuth = (loggedIn) => {
    Relay.injectNetworkLayer(new Relay.DefaultNetworkLayer('/graphql', {
      headers: loggedIn ? {
        Authorization: `Bearer ${auth.getToken()}`
      } : {}
    }));

    this.setState({
      loggedIn
    })
  };

  componentWillMount() {
    auth.onChange = this.updateAuth;
  }

  render() {
    return (
      this.state.loggedIn
        ? <RootComponent>{this.props.children}</RootComponent>
        : <Login {...this.props}/>
    );
  }
};
