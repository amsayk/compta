import React, {} from 'react';
import {Route, IndexRedirect, IndexRoute,} from 'react-router';

import auth from '../utils/auth';

import Login from '../components/Login/Login';
import Forgot from '../components/Forgot/Forgot';

import NotFound from '../components/NotFound/NotFound';

import {
  defineMessages,
  intlShape,
} from 'react-intl';

function requireLogin(nextState, replace) {
  if (!auth.isLoggedIn) {
    replace({
      pathname: '/login',
      state: {nextPathname: nextState.location.pathname}
    });
  }
}

// function Landing({children, ...props}, {intl: {formatMessage}}) {
//   return (
//     // <div>
//       // {
//         React.cloneElement(children, {...props,})
//       // }
//     // </div>
//   );
// }
//
// Landing.contextTypes = {
//   intl: intlShape.isRequired
// };

export default (
  <Route path='/'>

    <IndexRedirect to={'/apps'}/>

    <Route onEnter={requireLogin} getComponent={(location, cb) => {
      require.ensure([], (require) => {
        cb(null, require('../components/Home/Home'))
      });
    }}>

      <Route path='apps' onEnter={requireLogin} getComponent={(location, cb) => {
        require.ensure([], (require) => {
          cb(null, require('../components/Apps/Apps'))
        });
      }}/>

      <Route path='account' onEnter={requireLogin} getComponent={(location, cb) => {
        require.ensure([], (require) => {
          cb(null, require('../components/AccountSettings/AccountSettings'))
        });
      }}/>

      <Route path='/apps/:app/' onEnter={requireLogin}>

        <IndexRoute getComponent={(location, cb) => {
          require.ensure([], (require) => {
            cb(null, require('../components/Dashboard/Dashboard'))
          });
        }}/>

        <Route path='employees' getComponent={(location, cb) => {
          require.ensure([], (require) => {
            cb(null, require('../components/Employees/Items/Items'))
          });
        }}/>

        <Route path='customers' getComponent={(location, cb) => {
          require.ensure([], (require) => {
            cb(null, require('../components/Customers/Items/Items'))
          });
        }}/>

        <Route path='customer/:id' getComponent={(location, cb) => {
          require.ensure([], (require) => {
            cb(null, require('../components/Customers/Item/Item'))
          });
        }}/>

        <Route path='vendors' getComponent={(location, cb) => {
          require.ensure([], (require) => {
            cb(null, require('../components/Vendors/Items/Items'))
          });
        }}/>

        <Route path='vendor/:id' getComponent={(location, cb) => {
          require.ensure([], (require) => {
            cb(null, require('../components/Vendors/Item/Item'))
          });
        }}/>

        <Route>

          {/*<Route path='tresors' getComponent={(location, cb) => {
            require.ensure([], (require) => {
              cb(null, require('../components/Banking/Banking'))
            });
          }}/>*/}

          <Route path='sales' getComponent={(location, cb) => {
            require.ensure([], (require) => {
              cb(null, require('../components/Sales/Sales'))
            });
          }}/>

          <Route path='expenses' getComponent={(location, cb) => {
            require.ensure([], (require) => {
              cb(null, require('../components/Expenses/Expenses'))
            });
          }}/>

          <Route path='accounts' getComponent={(location, cb) => {
            require.ensure([], (require) => {
              cb(null, require('../components/Accounts/Accounts'))
            });
          }}/>

        </Route>

        <Route path='reports' getComponent={(location, cb) => {
          require.ensure([], (require) => {
            cb(null, require('../components/Reports/Reports'))
          });
        }}/>

        <Route path='tax' getComponent={(location, cb) => {
          require.ensure([], (require) => {
            cb(null, require('../components/TVA/TVA'))
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
      if(auth.isLoggedIn) {
        replace({pathname: '/account', state: {}});
      }
    }}/>

    <Route path='reset' component={Forgot}/>

    <Route path='*' component={NotFound} status={404}/>

  </Route>
);
