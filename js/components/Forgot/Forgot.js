import React, {Component, PropTypes} from 'react';

import auth from '../../utils/auth';

import CSSModules from 'react-css-modules';

import styles from './Forgot.scss';

import Title from '../Title/Title';

import {
  defineMessages,
  intlShape,
} from 'react-intl';

const messages = defineMessages({

  abort: {
    id: 'forgot-page.abort-message',
    defaultMessage: 'Retour à la page de connexion'
  },

  help: {
    id: 'forgot.help-message',
    defaultMessage:
      `<span>C'est bon. Entrez votre email et nous vous enverrons</span>
            <br/><span>un moyen de réinitialiser votre mot de passe.
            </span>`
  },

  Forgot: {
    id: 'forgot-page.title.forgot',
    description: '',
    defaultMessage: 'Réinitialiser votre mot de passe',
  },

  defaultForgotEmail: {
    id: 'forgot.default-forgot',
    description: '',
    defaultMessage: 'amadou.cisse@epsilon.ma',
  },

  title: {
    id: 'forgot-form.title',
    description: '',
    defaultMessage: 'Réinitialiser votre mot de passe',
  },

  email: {
    id: 'forgot-page.label.email',
    description: '',
    defaultMessage: 'E-mail',
  },

  error: {
    id: 'forgot-page.error.login',
    description: '',
    defaultMessage: 'Vous devez entrer une adresse email valide.'
  },

  reset: {
    id: 'forgot-page.action-reset',
    description: '',
    defaultMessage: 'Continuer'
  },

});

class Forgot extends Component {

  static contextTypes = {
    router: PropTypes.object.isRequired,
    intl: intlShape.isRequired,
  };

  state = {
    error: false
  };

  handleSubmit = (event) => {
    event.preventDefault();
    event.stopPropagation();

    const email = this.refs.email.value;

    if (Boolean(email)) {

      auth.sendEmail(email, (error, user) => {
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

  _onAbort = (e) => {
    e.preventDefault();
    e.stopPropagation();

    const {location} = this.props;

    if (location.state && location.state.nextPathname) {
      // document.location.pathname = location.state.nextPathname;
      this.context.router.replace(location.state.nextPathname);
    } else {
      // document.location.pathname = '/';
      this.context.router.replace('/');
    }
  };

  _renderForm = () => {
    const { formatMessage, formatHTMLMessage, } = this.context.intl;
    return (
      <div styleName='forgot' style={{ marginTop: '-220px' }}>

        <i className='material-icons md-dark md-inactive' style={{fontSize: 80}}>account_balance_wallet</i>

        <form styleName='form' onSubmit={this.handleSubmit}>


          <div styleName='header'>{formatMessage(messages.title)}</div>

          <label styleName='row'>

            <div styleName='label'>{formatMessage(messages.email)}</div>

            <div styleName='input'>
              <input type='text' ref='email' defaultValue={formatMessage(messages.defaultForgotEmail)} autoFocus/>
            </div>

          </label>

          <div styleName='message'>

            <span
              dangerouslySetInnerHTML={{
                    __html: formatHTMLMessage(messages.help),
                }}
            />

          </div>

          {this.state.error && <div styleName='error'>
            {formatMessage(messages.error)}
          </div>}

          <div styleName='footer'>

            <div styleName='verticalCenter' style={{width:'100%'}}>
              <a href='javascript:;' onClick={this._onAbort}>{formatMessage(messages.abort)}</a>
            </div>

          </div>

          <input type='submit' styleName='submit' value={formatMessage(messages.reset)}/>

        </form>

      </div>
    );
  };

  render() {
    const { formatMessage, } = this.context.intl;
    return (
      <div className='index' style={{background: '#06283d', height:'100vh', minHeight: '600px', position: 'relative'}}>
        <Title title={'Compta'}/>
        {this._renderForm()}
      </div>
    );
  }
}

module.exports = CSSModules(Forgot, styles, {
  allowMultiple: true
});
