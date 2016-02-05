import React, {} from 'react';
import {Route, IndexRedirect, IndexRoute,} from 'react-router';

import auth from '../utils/auth';

import Login from '../components/Login/Login';
import Forgot from '../components/Forgot/Forgot';

import NotFound from '../components/NotFound/NotFound';

import config from '../config';
import DocumentMeta from 'react-document-meta';

import {
  defineMessages,
  intlShape,
} from 'react-intl';

function requireLogin(nextState, replace) {
  if (!auth.isLoggedIn()) {
    replace({
      pathname: '/login',
      state: {nextPathname: nextState.location.pathname}
    });
  }
}

function Landing({children, ...props}, {intl: {formatMessage}}) {
  return (
    <div>
      <DocumentMeta title={formatMessage(config.app.title)}/>
      {React.cloneElement(children, {...props,})}
    </div>
  );
}

Landing.contextTypes = {
  intl: intlShape.isRequired
};

export default (
  <Route path='/' component={Landing}>

    <IndexRedirect to={'/apps'}/>

    <Route onEnter={requireLogin} getComponent={(location, cb) => {
      require.ensure([], (require) => {
        cb(null, require('../components/Home/Home'))
      });
    }}>

      <Route path='apps' getComponent={(location, cb) => {
        require.ensure([], (require) => {
          cb(null, require('../components/Apps/Apps'))
        });
      }}/>

      <Route path='account' getComponent={(location, cb) => {
        require.ensure([], (require) => {
          cb(null, require('../components/AccountSettings/AccountSettings'))
        });
      }}/>

      <Route path='/apps/:app/'>

        <IndexRoute getComponent={(location, cb) => {
          require.ensure([], (require) => {
            cb(null, require('../components/Dashboard/Dashboard'))
          });
        }}/>

        <Route path='transactions' getComponent={(location, cb) => {
          require.ensure([], (require) => {
            cb(null, require('../components/Transactions/Transactions'))
          });
        }}/>

        <Route path='accounts' getComponent={(location, cb) => {
          require.ensure([], (require) => {
            cb(null, require('../components/Accounts/Accounts'))
          });
        }}/>

        <Route path='reports' getComponent={(location, cb) => {
          require.ensure([], (require) => {
            cb(null, require('../components/Reports/Reports'))
          });
        }}/>

        <Route path='settings' getComponent={(location, cb) => {
          require.ensure([], (require) => {
            cb(null, require('../components/AppSettings/AppSettings'))
          });
        }}/>

      </Route>

    </Route>

    <Route path='login' component={Login} onEnter={(nextState, replace) => {
      if(auth.isLoggedIn()) {
        replace({pathname: '/account', state: {}});
      }
    }}/>

    <Route path='reset' component={Forgot}/>

    <Route path='*' component={NotFound} status={404}/>

  </Route>
);

//export default (
//  <Route path='/' component={Landing}>
//
//    <IndexRedirect to={'/apps'}/>
//
//    <Route onEnter={requireLogin} component={require('../components/Home/Home')}>
//
//      <Route path='apps' component={require('../components/Apps/Apps')}/>
//
//      <Route path='account' component={require('../components/AccountSettings/AccountSettings')}/>
//
//      <Route path='/apps/:app/'>
//
//        <IndexRoute component={require('../components/Dashboard/Dashboard')}/>
//
//        <Route path='transactions' component={require('../components/Transactions/Transactions')}/>
//
//        <Route path='accounts' component={require('../components/Accounts/Accounts')}/>
//
//        <Route path='reports' component={require('../components/Reports/Reports')}/>
//
//        <Route path='settings' component={require('../components/AppSettings/AppSettings')}/>
//
//      </Route>
//
//    </Route>
//
//    <Route path='login' component={Login} onEnter={(nextState, replace) => {
//      if(auth.isLoggedIn()) {
//        replace({pathname: '/account', state: {}});
//      }
//    }}/>
//
//    <Route path='reset' component={Forgot}/>
//
//    <Route path='*' component={NotFound} status={404}/>
//
//  </Route>
//);
