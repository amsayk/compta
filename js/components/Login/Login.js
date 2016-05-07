import React, {Component, PropTypes} from 'react';

import auth from '../../utils/auth';

import CSSModules from 'react-css-modules';

import styles from './Login.scss';

import Title from '../Title/Title';

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
    defaultMessage: 'amadou.cisse',
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
    defaultMessage: 'Vous devez entrer une adresse email valide.'
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

class Login extends Component {

  static contextTypes = {
    router: PropTypes.object.isRequired,
    intl: intlShape.isRequired,
  };

  state = {
    error: false
  };

  handleSubmit = (e) => {
    e.preventDefault();
    e.stopPropagation();

    const email = this.refs.email.value;
    const password = this.refs.email.password;

    if (Boolean(email)) {

      auth.login(email, password, (error, user) => {
        if (error) {
          return this.setState({error: true});
        }

        localStorage.setItem('app.login', email);

        const {location} = this.props;

        if (location.state && location.state.nextPathname) {
          this.context.router.replace(location.state.nextPathname);
        } else {
          this.context.router.replace('/');
        }
      });

      return;
    }


    this.setState({error: true});
  };

  _onForgot = (e) => {
    e.preventDefault();
    e.stopPropagation();

    this.context.router.push('/reset');
  };

  _renderForm = () => {
    const { formatMessage, } = this.context.intl;
    return (
      <div styleName='login' style={{ marginTop: '-220px' }}>

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
            <div styleName='verticalCenter' style={{ width:'100%' }}>
              <a onClick={this._onForgot}>{formatMessage(messages.forgot)}</a>
            </div>
          </div>

          <input type='submit' styleName='submit' value={formatMessage(messages.logIn)}/>

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
