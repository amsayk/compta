import React, {Component, PropTypes} from 'react';
import {bindActionCreators} from 'redux';
import {reduxForm} from 'redux-form';
import accountValidation, {} from './accountValidation';
import * as accountActions from '../../redux/modules/account';

import classnames from 'classnames';

import Modal from 'react-bootstrap/lib/Modal';

import styles from './AccountForm.scss';

import CSSModules from 'react-css-modules';

import Parse from 'parse';

import {Text,} from '../form/form';

const Progress = ({}) => (
  <div className="mdl-progress mdl-js-progress mdl-progress__indeterminate is-upgraded">
    <div className="progressbar bar bar1" style={{width: '0%'}}></div>
    <div className="bufferbar bar bar2" style={{width: '100%'}}></div>
    <div className="auxbar bar bar3" style={{width: '0%'}}></div>
  </div>
);

import {
  defineMessages,
  intlShape,
} from 'react-intl';

const messages = defineMessages({

  error: {
    id: 'account-form.error.unknown',
    description: '',
    defaultMessage: 'There was an unknown error. Please try again.',
  },

  emailError: {
    id: 'account-form.error.displayName',
    description: '',
    defaultMessage: 'This Company Name was already used',
  },

  formTitle: {
    id: 'account-form.message.add-account-title',
    description: '',
    defaultMessage: 'Change your login information',
  },

  displayNameLabel: {
    id: 'account-form.label.displayName',
    description: '',
    defaultMessage: 'What’s your name?'
  },

  emailLabel: {
    id: 'account-form.label.email',
    description: '',
    defaultMessage: 'What’s your email address?'
  },

  emailDesc: {
    id: 'account-form.description.email',
    description: '',
    defaultMessage: `This is where we send your password reset instructions.`
  },

  cancel: {
    id: 'account-form.cancel',
    description: '',
    defaultMessage: 'Cancel'
  },

  save: {
    id: 'account-form.action.save-account',
    description: '',
    defaultMessage: 'Change'
  },

  saving: {
    id: 'account-form.action.saving-account',
    description: '',
    defaultMessage: 'Saving…'
  },

});

function asyncValidate({email}) {
  // TODO: figure out a way to move this to the server. need an instance of ApiClient
  if (!email) {
    return Promise.resolve({});
  }
  return new Promise((resolve, reject) => {
    const query = new Parse.Query(Parse.User);
    query.equalTo('email', email);

    query.first().then(
      function (object) {
        if (object) {
          reject({
            email: messages.emailError
          });
          return;
        }

        resolve();
      },

      function () {
        reject({
          email: messages.error
        });
      }
    );
  });
}

@reduxForm({
    form: 'account',
    fields: ['id', 'displayName', 'email',],
    validate: accountValidation,
    asyncValidate,
    asyncBlurFields: ['email'],
  }, (state, {viewer}) => ({
    saveError: state.account.saveError,
    initialValues: {displayName: viewer.displayName, email: viewer.email},
  }),
  dispatch => bindActionCreators(accountActions, dispatch)
)
@CSSModules(styles, {})
export default class AccountForm extends Component {
  static contextTypes = {
    intl: intlShape.isRequired
  };

  static propTypes = {
    fields: PropTypes.object.isRequired,
    asyncValidating: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]).isRequired,
    dirty: PropTypes.bool.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    valid: PropTypes.bool.isRequired,
    invalid: PropTypes.bool.isRequired,
    pristine: PropTypes.bool.isRequired,
    save: PropTypes.func.isRequired,
    submitting: PropTypes.bool.isRequired,
    saveError: PropTypes.object,
    formKey: PropTypes.string.isRequired,
    values: PropTypes.object.isRequired,
  };

  render() {
    const {formatMessage,} = this.context.intl;

    const {
      asyncValidating,
      dirty,
      formKey,
      editStop,
      fields: {id, displayName, email,},
      handleSubmit,
      valid,
      invalid,
      pristine,
      save,
      submitting,
      saveError: {[formKey]: saveError},
      values,

      onCancel,
    } = this.props;

    const handleClose = () => {
      editStop(formKey);
      onCancel();
    };

    return (

      <Modal styleName={'modal'}
             className={classnames({'valid': !pristine && valid, 'submitting': submitting, form: true})} show={true}
             keyboard={false} backdrop={'static'} onHide={() => handleClose()} autoFocus enforceFocus>
        <Modal.Header>

          <div styleName="title" style={{top: '27px'}}>{formatMessage(messages['formTitle'])}
          </div>

          <div styleName="icon">
            <i className="material-icons md-light" style={{width: 30, height: 30, fontSize: 30,}}>supervisor_account</i>
          </div>

        </Modal.Header>
        <Modal.Body>

          <Text
            name={formatMessage(messages['displayNameLabel'])}
            autoFocus
            props={{...displayName, error: displayName.error && formatMessage(displayName.error)}}
          />

          <Text
            name={formatMessage(messages['emailLabel'])}
            description={formatMessage(messages['emailDesc'])}
            props={{...email, error: email.error && formatMessage(email.error)}}
          />

          {saveError && <div styleName="error">{formatMessage(saveError)}</div>}
          {submitting && <Progress/>}

        </Modal.Body>
        <Modal.Footer>

          <button
            styleName="button"
            onClick={() => handleClose()}
            disabled={submitting}
            className="btn btn-primary-outline unselectable">{formatMessage(messages['cancel'])}
          </button>

          <button
            styleName="button"
            onClick={handleSubmit((data) => {
              return save({...data})
                    .then(result => {
                      if (result && typeof result.error === 'object') {
                        return Promise.reject(messages['error']);
                      }

                      handleClose();
                    });
            })}
            disabled={pristine || invalid || submitting}
            className={"btn btn-primary unselectable" + (!pristine && valid ? ' green' : '')}>
            {' '}{formatMessage(submitting ? messages['saving'] : messages['save'])}
          </button>

        </Modal.Footer>
      </Modal>
    );
  }
}
