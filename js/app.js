import React from 'react';
import ReactDOM from 'react-dom';

import {Router,} from 'react-router';

import history from './history';

import routes from './config/routes';

import {Provider} from 'react-redux';
import createStore from './redux/createStore';

import moment from 'moment';
import momentLocalizer from 'react-widgets/lib/localizers/moment';

require('react-widgets/lib/less/react-widgets.less');
require('react-select/dist/react-select.css');

import { IntlProvider, } from 'react-intl';

import intlLoader from './utils/intl-loader';

(async function () {

  const locale = window.__locale;

  const {messages,} = await intlLoader(locale);

  const store = createStore();

  moment.locale(locale);
  momentLocalizer(moment);

  class Application extends React.Component {
    render() {
      return (
        <IntlProvider locale={locale} messages={messages}>
          <Provider store={store}>
            <Router history={history} routes={routes}/>
          </Provider>
        </IntlProvider>
      );
    }
  }

  ReactDOM.render(
    <Application/>,

    document.getElementById('root')
  );

})();

if (process.env.NODE_ENV !== 'production') {
  window.Parse = require('parse');
}


