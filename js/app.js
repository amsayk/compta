import React from 'react';
import ReactDOM from 'react-dom';

import Parse from 'parse';

import {
  Router,
} from 'react-router';

import history from './history';

import routes from './config/routes';

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
// require('react-select/dist/react-select.css');

import {IntlProvider, intlShape, defineMessages,} from 'react-intl';

import intlLoader from './utils/intl-loader';

(async function () {

  Parse.initialize(
    process.env.APPLICATION_ID,
    process.env.JAVASCRIPT_KEY
  );

  Parse.CoreManager.set(
    'REQUEST_ATTEMPT_LIMIT', 0
  );

  if (process.env.NODE_ENV !== 'production') {
    Parse.serverURL = 'http://localhost:1337/parse';
  } else {
    Parse.serverURL = 'https://compta-parse-server.herokuapp.com/parse';
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
        <IntlProvider locale={locale} messages={messages} formats={formats}>
          <Provider store={store}>
            <Router history={history} routes={routes}/>
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
    <IntlProvider locale={locale}
                  messages={{'confirmation.title': messages['confirmation.title'], 'confirmation.yes': messages['confirmation.yes'], 'confirmation.cancel': messages['confirmation.cancel'], }}>
      <Confirmation/>
    </IntlProvider>,

    document.getElementById('confirmation')
  );

  ReactDOM.render(
    <NotificationDrawer className={'notification-drawer'} render={(props, index) => {
      const classNames = classnames('alert', 'drawer__item', {
        'alert-success': props.type == 'success',
        'alert-danger': props.type == 'danger',
        'alert-info': props.type == 'info',
        'alert-warning': props.type == 'warning',
        'alert-custom': props.type == 'custom',
      });
      const Component = props.data;
      return (
        <Clickoutside onClickOutside={e => { props.remove() }}>
          <Modal key={index} className={classnames('drawer-modal', {[props.slug || '']: true})} bsSize='small' animation={false} backdrop={false} onHide={() => { }} show={true} keyboard={false}>
            <div className={classNames}>
              <button type='button' className='close' onClick={() => { props.remove() }}>
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
}
