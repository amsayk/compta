import React from 'react';
import ReactDOM from 'react-dom';

import Parse from 'parse';

import {
  // applyRouterMiddleware,
  Router,
} from 'react-router';

import doSetupVisibilityChangeObserver from './utils/visibilityChangeObserver';

// import useScroll from 'react-router-scroll';

import history from './history';

import getPage from './utils/getPage';

import routes from './config/routes';

import Loading from './components/Loading/component';

import Confirm from './components/confirm/component';
import NotificationDrawer from './components/notification/Drawer';

import Modal from 'react-bootstrap/lib/Modal';

import classnames from 'classnames';

import {Provider} from 'react-redux';
import createStore from './redux/createStore';

import Clickoutside from './components/utils/Clickoutside';

import moment from 'moment';
import momentLocalizer from 'react-widgets/lib/localizers/moment';
// import {setAnimate} from 'react-widgets/lib/configure';

require('react-widgets/lib/less/react-widgets.less');

import {IntlProvider, intlShape, defineMessages,} from 'react-intl';

import intlLoader from './utils/intl-loader';

(async function () {

  Parse.initialize(
    process.env.APPLICATION_ID,
    process.env.JAVASCRIPT_KEY,
    process.env.MASTER_KEY
  );

  Parse.CoreManager.set(
    'REQUEST_ATTEMPT_LIMIT', 0
  );

  Parse.serverURL = process.env.SERVER_URL;

  const gaTrackingID = process.env.GA_TRACKING_CODE;

  const currentUserId = function () {
    const user = Parse.User.current();
    return user ? user.id : undefined;
  }();

  ga('create', gaTrackingID, 'auto', {
    userId: currentUserId,
  });

  ga('set', 'dimension1', currentUserId);

  function logPageView() {
    ga('send', 'pageview', getPage(window.location.pathname));
  }

  const locale = window.__locale;

  // setAnimate((element, props, duration, ease, callback) => {});

  const {messages,} = await intlLoader(locale);

  const formats = {
    date: {
      medium: {
        style: 'medium',
      },
    },
    number: {
      MAD: {
        style: 'currency',
        currency: 'MAD',
        minimumFractionDigits: 2,

        // currencyDisplay: oneOf(['symbol', 'code', 'name']),
        // minimumIntegerDigits    : number,
        // minimumFractionDigits   : number,
        // maximumFractionDigits   : number,
        // minimumSignificantDigits: number,
        // maximumSignificantDigits: number,

        // useGrouping    : bool,
      },
      MONEY: {
        style: 'decimal',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      },
      PERCENT: {
        style: 'percent',
        minimumFractionDigits: 2,
      },

    },
  };

  const store = createStore();

  moment.locale(locale);
  momentLocalizer(moment);

  class Application extends React.Component {
    render() {
      return (
        <IntlProvider defaultLocale={'fr'} locale={locale} messages={messages} formats={formats}>

          <Provider store={store}>

            <Router
              history={history}
              routes={routes}
              onUpdate={logPageView}
              // render={applyRouterMiddleware(useScroll())}
            />

          </Provider>

        </IntlProvider>
      );
    }
  }

  ReactDOM.render(
    <Application/>,

    document.getElementById('app')
  );

  const Confirmation = function () {

    const messages = defineMessages({
      Title: {
        id: 'confirmation.title',
        defaultMessage: 'Confirmation',
      },
      Yes: {
        id: 'confirmation.yes',
        defaultMessage: 'Oui',
      },
      Cancel: {
        id: 'confirmation.cancel',
        defaultMessage: 'Non',
      },
    });

    return class extends React.Component {
      static contextTypes = {
        intl: intlShape.isRequired,
      };

      render() {
        const {intl,} = this.context;
        return (
          <Confirm
            title={intl.formatMessage(messages['Title'])}
            sure={intl.formatMessage(messages['Yes'])} cancel={intl.formatMessage(messages['Cancel'])}
          />
        );
      }
    };
  }();

  ReactDOM.render(
    <IntlProvider defaultLocale={'fr'} locale={locale}
                  messages={{'confirmation.title': messages['confirmation.title'], 'confirmation.yes': messages['confirmation.yes'], 'confirmation.cancel': messages['confirmation.cancel'], }}>
      <Confirmation/>
    </IntlProvider>,

    document.getElementById('confirmation')
  );

  ReactDOM.render(
    <Loading/>,
    document.getElementById('loading')
  );

  ReactDOM.render(
    <NotificationDrawer className={'notification-drawer'} render={(props, index) => {
      const classNames = classnames('alert', 'drawer__item', {
        'alert-success': props.type == 'success',
        'alert-danger': props.type == 'danger',
        'alert-error': props.type == 'danger',
        'alert-info': props.type == 'info',
        'alert-warning': props.type == 'warning',
        'alert-custom': props.type == 'custom',
      });
      const Component = props.data;
      return (
        <Clickoutside onClickOutside={e => { props.remove && props.remove() }}>
          <Modal key={index} className={classnames('drawer-modal', {[props.slug || '']: true})} bsSize='small' animation={false} backdrop={false} onHide={() => { }} show={true} keyboard={false}>
            <div className={classNames}>
              <button type='button' className='close' onClick={() => { props.remove && props.remove() }}>
                <span aria-hidden="true">
                  &times;
                </span>
              </button>
              <div><Component remove={props.remove}/> </div>
            </div>
          </Modal>
        </Clickoutside>
      );
    }}/>,

    document.getElementById('notification')
  );

})();

if (process.env.NODE_ENV !== 'production') {
  window.Parse = require('parse');

  window[`ga-disable-${process.env.GA_TRACKING_CODE}`] = true;
} else {

  doSetupVisibilityChangeObserver();

  require('offline-plugin/runtime').install({
    onInstalled: function () {
      console.log('[SW]: App is ready for offline usage');
    },
    onUpdating: function () {

    },
    onUpdateReady: function () {
      require('offline-plugin/runtime').applyUpdate();
    },
    onUpdateFailed: function () {

    },
    onUpdated: function () {

    },

  });
}
