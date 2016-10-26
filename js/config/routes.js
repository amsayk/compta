import React, {} from 'react';
import {
  Route,
  IndexRedirect,
  IndexRoute,
  Redirect,
} from 'react-router';

import auth from '../utils/auth';

import LoadingActions from '../components/Loading/actions';

function requireLogin(nextState, replace) {
  if (!auth.isLoggedIn) {
    replace({
      pathname: '/login',
      state: {nextPathname: nextState.location.pathname}
    });
  }
}

export default (
  <Route path='/'>

    <IndexRedirect to={'/apps'}/>

    <Route onEnter={requireLogin} getComponent={(location, cb) => {
      LoadingActions.show();
      require.ensure([], (require) => {
        LoadingActions.hide();
        cb(null, require('../components/Home/Home'));
      }, 'Home');
    }}>

      <Route path='apps' onEnter={requireLogin} getComponent={(location, cb) => {
        LoadingActions.show();
        require.ensure([], (require) => {
          LoadingActions.hide();
          cb(null, require('../components/Apps/Apps'));
        }, 'Apps');
      }}/>

      <Route path='account' onEnter={requireLogin} getComponent={(location, cb) => {
        LoadingActions.show();
        require.ensure([], (require) => {
          LoadingActions.hide();
          cb(null, require('../components/AccountSettings/AccountSettings'));
        }, 'AccountSettings');
      }}/>

      <Route path='/apps/:app/' onEnter={requireLogin}>

        <IndexRoute getComponent={(location, cb) => {
          LoadingActions.show();
          require.ensure([], (require) => {
            LoadingActions.hide();
            cb(null, require('../components/Dashboard/Dashboard'));
          }, 'Dashboard');
        }}/>

        <Route path='employees' getComponent={(location, cb) => {
          LoadingActions.show();
          require.ensure([], (require) => {
            LoadingActions.hide();
            cb(null, require('../components/Employees/Items/Items'));
          }, 'Employees');
        }}/>

        <Route path='customers' getComponent={(location, cb) => {
          LoadingActions.show();
          require.ensure([], (require) => {
            LoadingActions.hide();
            cb(null, require('../components/Customers/Items/v2/Items'));
          }, 'Customers');
        }}/>

        <Route path='customer/:id' getComponent={(location, cb) => {
          LoadingActions.show();
          require.ensure([], (require) => {
            LoadingActions.hide();
            cb(null, require('../components/Customers/Item/v2/Item'));
          }, 'Customer');
        }}/>

        <Route path='vendors' getComponent={(location, cb) => {
          LoadingActions.show();
          require.ensure([], (require) => {
            LoadingActions.hide();
            cb(null, require('../components/Vendors/Items/v2/Items'));
          }, 'Vendors');
        }}/>

        <Route path='vendor/:id' getComponent={(location, cb) => {
          LoadingActions.show();
          require.ensure([], (require) => {
            LoadingActions.hide();
            cb(null, require('../components/Vendors/Item/v2/Item'));
          }, 'Vendor');
        }}/>

        <Route>

          {/*<Route path='tresors' getComponent={(location, cb) => {
           require.ensure([], (require) => {
           cb(null, require('../components/Banking/Banking'));
           });
           }}/>*/}

          <Route path='sales' getComponent={(location, cb) => {
            LoadingActions.show();
            require.ensure([], (require) => {
              LoadingActions.hide();
              cb(null, require('../components/Sales/v2/Sales'));
            }, 'Sales');
          }}/>

          <Route path='expenses' getComponent={(location, cb) => {
            LoadingActions.show();
            require.ensure([], (require) => {
              LoadingActions.hide();
              cb(null, require('../components/Expenses/v2/Expenses'));
            }, 'Expenses');
          }}/>

          <Route path='accounts' getComponent={(location, cb) => {
            LoadingActions.show();
            require.ensure([], (require) => {
              LoadingActions.hide();
              cb(null, require('../components/Accounts/Accounts'));
            }, 'Accounts');
          }}/>

        </Route>

        <Route path='rapports' getComponent={(location, cb) => {
          LoadingActions.show();
          require.ensure([], (require) => {
            LoadingActions.hide();
            cb(null, require('../components/Rapports/Rapports'));
          }, 'Reports');
        }}/>

        <Route path='vat' getComponent={(location, cb) => {
          LoadingActions.show();
          require.ensure([], (require) => {
            LoadingActions.hide();
            cb(null, require('../components/TVA/TVA'));
          }, 'TVA');
        }}/>

        <Route path='vat/history' getComponent={(location, cb) => {
          LoadingActions.show();
          require.ensure([], (require) => {
            LoadingActions.hide();
            cb(null, require('../components/TVA/History/History'));
          }, 'VATHistory');
        }}/>

        <Route path='vat/declaration/:declarationId' getComponent={(location, cb) => {
          LoadingActions.show();
          require.ensure([], (require) => {
            LoadingActions.hide();
            cb(null, require('../components/TVA/Declaration/Declaration'));
          }, 'VATDeclaration');
        }}/>

        <Route path='settings' getComponent={(location, cb) => {
          LoadingActions.show();
          require.ensure([], (require) => {
            LoadingActions.hide();
            cb(null, require('../components/AppSettings/AppSettings'));
          }, 'AppSettings');
        }}/>

      </Route>

    </Route>

    <Route path='login' getComponent={(location, cb) => {
          LoadingActions.show();
          require.ensure([], (require) => {
            LoadingActions.hide();
            cb(null, require('../components/Login/Login'));
          }, 'Login');
        }} onEnter={(nextState, replace) => {
      if(auth.isLoggedIn) {
        replace({pathname: '/account', state: {}});
      }
    }}/>

    <Route getComponent={(location, cb) => {
          LoadingActions.show();
          require.ensure([], (require) => {
            LoadingActions.hide();
            cb(null, require('../components/Forgot/Forgot'));
          }, 'Forgot');
        }} path='reset'/>

    <Redirect from='assets' to={'apps'}/>

    <Route path='*' getComponent={(location, cb) => {
          LoadingActions.show();
          require.ensure([], (require) => {
            LoadingActions.hide();
            cb(null, require('../components/NotFound/NotFound'));
          }, 'NotFound');
        }} status={404}/>

  </Route>
);
