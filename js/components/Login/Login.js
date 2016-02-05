import React, {Component, PropTypes} from 'react';

import auth from '../../utils/auth';

import CSSModules from 'react-css-modules';

import styles from './Login.scss';

import config from '../../config';
import DocumentMeta from 'react-document-meta';

import {
  defineMessages,
  intlShape,
} from 'react-intl';

const messages = defineMessages({

  Login: {
    id: 'title.login',
    description: '',
    defaultMessage: 'Login',
  },

  defaultLogin: {
    id: 'login.default-login',
    description: '',
    defaultMessage: 'amadou.cisse',
  },

  title: {
    id: 'login-form.title',
    description: '',
    defaultMessage: 'Member Login',
  },

  email: {
    id: 'label.email',
    description: '',
    defaultMessage: 'Email',
  },

  password: {
    id: 'label.password',
    description: '',
    defaultMessage: 'Password',
  },

  error: {
    id: 'error.login',
    description: '',
    defaultMessage: 'You must enter a valid e-mail address.'
  },

  forgot: {
    id: 'login.forgot-something',
    description: '',
    defaultMessage: 'Forgot something?'
  },

  logIn: {
    id: 'action.login',
    description: '',
    defaultMessage: 'Log In'
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

        const {location} = this.props;

        if (location.state && location.state.nextPathname) {
          // document.location.pathname = location.state.nextPathname;
          this.context.router.replace(location.state.nextPathname);
        } else {
          // document.location.pathname = '/';
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

  onLogin = (provider, e) => {
    e.preventDefault();

    // TODO: social login
  };

  onSignUp = (e) => {
    e.preventDefault();

    // TODO: create account
  };

  _renderForm = () => {
    const { formatMessage, } = this.context.intl;
    return (
      <div styleName="login" style={{ marginTop: '-220px' }}>

        <i className="material-icons md-dark md-inactive" style={{fontSize: 80}}>account_balance_wallet</i>

        <form styleName="form" onSubmit={this.handleSubmit}>


          <div styleName="header">{formatMessage(messages.title)}</div>

          <label styleName="row">

            <div styleName="label">{formatMessage(messages.email)}</div>

            <div styleName="input">
              <input type="text" ref="email" defaultValue={formatMessage(messages.defaultLogin)} autoFocus/>
            </div>

          </label>

          <label styleName="row">

            <div styleName="label">{formatMessage(messages.password)}</div>

            <div styleName="input">
              <input type="password" ref="password"/>
            </div>

          </label>

          {this.state.error && <div styleName="error">
            {formatMessage(messages.error)}
          </div>}

          <div styleName="footer">
            <div styleName="verticalCenter" style={{ width:'100%' }}>
              <a onClick={this._onForgot}>{formatMessage(messages.forgot)}</a>
            </div>
          </div>

          <input type="submit" styleName="submit" value={formatMessage(messages.logIn)}/>

        </form>

        <div styleName="oauth hidden">

          <span>Or, log in with</span>

          <a styleName="facebook" onClick={this.onLogin.bind(this, 'facebook')}>
            <i className="material-icons md-18 md-light">facebook</i>
            {/*
             <svg width="18" height="18" fill="#ffffff" data-reactid=".0.2.1.0">
             <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="/bundles/sprites.svg#facebook" data-reactid=".0.2.1.0.0"></use>
             </svg>
             */}
          </a>

          <a styleName="github" onClick={this.onLogin.bind(this, 'linkedin')}>
            <i className="material-icons md-18 md-light">linkedin</i>
            {/*
             <svg width="18" height="18" fill="#ffffff" data-reactid=".0.2.2.0">
             <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="/bundles/sprites.svg#github" data-reactid=".0.2.2.0.0"></use>
             </svg>
             */}
          </a>

          <a styleName="google" onClick={this.onLogin.bind(this, 'google')}>
            <i className="material-icons md-18 md-light">google</i>
            {/*
             <svg width="18" height="18" fill="#ffffff" data-reactid=".0.2.3.0">
             <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="/bundles/sprites.svg#google" data-reactid=".0.2.3.0.0"></use>
             </svg>
             */}
          </a>

        </div>

        <a styleName="swap hidden" onClick={this.onSignUp}>
          <span style={{ verticalAlign:'top' }}>I don't have an account
          </span>
        </a>

      </div>
    );
  };

  render() {
    const { formatMessage, } = this.context.intl;
    return (
      <div className="index" style={{background: '#06283d', height:'100vh', minHeight: '600px', position: 'relative'}}>
        <DocumentMeta title={formatMessage(config.app.title) + ' | ' + formatMessage(messages.Login)}/>
        {this._renderForm()}
      </div>
    );
  }
}

module.exports = CSSModules(Login, styles, {
  allowMultiple: true
});
