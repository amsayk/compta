// import 'babel-polyfill';

import React from 'react';
import ReactDOM from 'react-dom';
import Relay from 'react-relay';

import auth from './utils/auth';

import {Router, IndexRoute, Route} from 'react-router';

import createHistory from './createHistory';

import routes from './config/routes';

if(auth.isLoggedIn()){
  Relay.injectNetworkLayer(new Relay.DefaultNetworkLayer('/graphql', {
    headers: {
      Authorization: `Bearer ${auth.getToken()}`
    }
  }));
}

ReactDOM.render(
  <Router history={createHistory()} routes={routes}/>,

  document.getElementById('root')
);

