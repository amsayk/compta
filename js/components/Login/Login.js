import React, {Component, PropTypes} from 'react';

import auth from '../../utils/auth';

import CSSModules from 'react-css-modules';

import styles from './Login.scss';

import Title from '../Title/Title';

import isEmpty from 'lodash.isempty';

import {
  defineMessages,
  intlShape,
} from 'react-intl';

const messages = defineMessages({

  Login: {
    id: 'login-page.title.login',
    defaultMessage: 'Connexion à Compta',
  },

  defaultLogin: {
    id: 'login-page.default-login',
    defaultMessage: 'amadou.cisse@epsilon.ma',
  },

  title: {
    id: 'login-form.title',
    defaultMessage: 'Se connecter',
  },

  email: {
    id: 'login-page.label.email',
    defaultMessage: 'E-mail',
  },

  password: {
    id: 'login-page.label.password',
    defaultMessage: 'Mot de passe',
  },

  error: {
    id: 'login-page.error.login',
    defaultMessage: 'Vous devez entrer une adresse email et mot de passe valide.'
  },

  forgot: {
    id: 'login-page.forgot-something',
    defaultMessage: 'J\'ai oublié mon mot de passe ou mon nom d\'utilisateur'
  },

  logIn: {
    id: 'login-page.action.login',
    defaultMessage: 'Se connecter'
  },

});

class Login extends React.Component {

  static contextTypes = {
    router: PropTypes.object.isRequired,
    intl: intlShape.isRequired,
  };

  state = {
    error: false,
    busy: false,
  };

  handleSubmit = (e) => {
    e.preventDefault();
    e.stopPropagation();

    const email = this.refs.email.value;
    const password = this.refs.password.value;

    if (Boolean(email)) {

      this.setState({
        busy: true,
      }, () => {

        auth.login(email, /*password = */isEmpty(password) ? process.env.NODE_ENV !== 'production' && 'default' : password, (error, user) => {
          if (error) {
            this.refs.password.value = '';
            return this.setState({ error: true, busy: false, });
          }

          localStorage.setItem('app.login', email);

          const {location} = this.props;

          if (location.state && location.state.nextPathname) {
            this.context.router.replace(location.state.nextPathname);
          } else {
            this.context.router.replace('/');
          }
        });

      });

      return;
    }


    this.setState({ error: true, });
  };

  _onForgot = (e) => {
    e.preventDefault();
    e.stopPropagation();

    this.context.router.push('/reset');
  };

  _renderForm = () => {
    const { busy, } = this.state;
    const { formatMessage, } = this.context.intl;
    return (
      <div styleName='login' style={{ height: 'auto', }}>

        <i className='material-icons md-dark md-inactive' style={{fontSize: 80}}>account_balance_wallet</i>

        <form styleName='form' onSubmit={this.handleSubmit}>


          <div styleName='header'>{formatMessage(messages.title)}</div>

          <label styleName='row'>

            <div styleName='label'>{formatMessage(messages.email)}</div>

            <div styleName='input' className={'ha-text-field'}>
              <input type='text' ref='email' defaultValue={localStorage.getItem('app.login') || formatMessage(messages.defaultLogin)} autoFocus/>
            </div>

          </label>

          <label styleName='row' className={'ha-text-field'}>

            <div styleName='label'>{formatMessage(messages.password)}</div>

            <div styleName='input'>
              <input type='password' ref='password'/>
            </div>

          </label>

          {this.state.error && <div styleName='error'>
            {formatMessage(messages.error)}
          </div>}

          <div styleName='footer'>
            {/*<div styleName='verticalCenter' style={{ width:'100%' }}>
              <a onClick={this._onForgot}>{formatMessage(messages.forgot)}</a>
            </div>*/}
          </div>

          {/*<input type='submit' styleName='submit' value={formatMessage(messages.logIn)}/>*/}
          <button type='submit' styleName='submit'>
            <span>{busy ? <i styleName={'busy'} className={`material-icons`}>loop</i> : null}{' '}{formatMessage(messages['logIn'])}</span>
          </button>

        </form>

      </div>
    );
  };

  render() {
    const { formatMessage, } = this.context.intl;
    return (
      <div className='index' style={{background: '#06283d', height:'100vh', minHeight: '600px', position: 'relative'}}>
        <Title title={formatMessage(messages.Login)}/>
        {this._renderForm()}
      </div>
    );
  }
}

module.exports = CSSModules(Login, styles, {
  allowMultiple: true
});
