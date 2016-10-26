import React, {Component, PropTypes} from 'react';
import {bindActionCreators} from 'redux';
import {reduxForm} from 'redux-form';
import validation, {} from './validation';
import * as accountActions from '../../redux/modules/account';

import classnames from 'classnames';

import Modal from 'react-bootstrap/lib/Modal';

import styles from './PasswordForm.scss';

import CSSModules from 'react-css-modules';

import Parse from 'parse';

import {Text,} from '../form/form';

const Progress = ({}) => (
  <div className='mdl-progress mdl-js-progress mdl-progress__indeterminate is-upgraded'>
    <div className='progressbar bar bar1' style={{width: '0%'}}></div>
    <div className='bufferbar bar bar2' style={{width: '100%'}}></div>
    <div className='auxbar bar bar3' style={{width: '0%'}}></div>
  </div>
);

import {
  intlShape,
} from 'react-intl';

import messages from './messages';

@reduxForm({
    form: 'account',
    fields: [
      'id',
      'type',
      'currentPassword',
      'newPassword',
      'newPasswordConfirmation',
    ],
    validate: validation,
  }, (state, {viewer, formKey, ...ownProps}) => ({
    saveError: state.account.saveError,
    initialValues: {
      id: viewer.objectId,
      type: ownProps.type || 'set',
    },
  }),
  dispatch => bindActionCreators(accountActions, dispatch)
)
@CSSModules(styles, {})
export default class AccountForm extends React.Component {
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

  componentDidMount(){
    ga('send', 'pageview', '/modal/password-form');
  }

  render() {
    const {formatMessage,} = this.context.intl;

    const {
      asyncValidating,
      dirty,
      formKey,
      editStop,
      fields: {
        id,
        currentPassword,
        newPassword,
        newPasswordConfirmation,
      },
      handleSubmit,
      valid,
      invalid,
      pristine,

      changePassword,
      setPassword,

      submitting,
      saveError: {[formKey]: saveError},
      values,

      viewer,

      type = 'set',

      onCancel,
    } = this.props;

    const handleClose = () => {
      editStop(formKey);
      onCancel();
    };

    return (

      <Modal styleName={'modal'}
             className={classnames({'valid': !pristine && valid, 'submitting': submitting, form: true, 'app-modal': true,})} show={true}
             keyboard={false} backdropStyle={{opacity: 0.5,}} backdrop={'static'} onHide={() => handleClose()} autoFocus enforceFocus>
        <Modal.Header>

          <div styleName='title' style={{top: '27px'}}>{formatMessage(messages['formTitle'])}
          </div>

          <div styleName='icon'>
            <i className='material-icons md-light' style={{width: 30, height: 30, fontSize: 30,}}>security</i>
          </div>

        </Modal.Header>
        <Modal.Body>

          {type === 'change' && <Text
            type='password'
            name={'Mot de passe courant'}
            autoFocus
            props={{...currentPassword,}}
          />}

          <Text
            type='password'
            autoFocus={type === 'set'}
            name={'Nouveau mot de passe'}
            description={''}
            props={{...newPassword, error: newPassword.error ? typeof newPassword.error === 'object' ? formatMessage(newPassword.error) : newPassword.error : undefined}}
          />

          <Text
            type='password'
            name={'Confirmer le nouveau mot de passe'}
            description={''}
            props={{...newPasswordConfirmation, error: newPasswordConfirmation.error ? typeof newPasswordConfirmation.error === 'object' ? formatMessage(newPasswordConfirmation.error) : newPasswordConfirmation.error : undefined}}
          />

          {saveError && <div styleName='error'>{formatMessage({ ...saveError, id: saveError._id, })}</div>}
          {submitting && <Progress/>}

        </Modal.Body>
        <Modal.Footer>

          <button
            styleName='button'
            onClick={() => handleClose()}
            disabled={submitting}
            className='btn btn-primary-outline unselectable'>{formatMessage(messages['cancel'])}
          </button>

          <button
            styleName='button'
            onClick={handleSubmit((data) => {
              const fn = type === 'change' ? changePassword : setPassword;
              return fn({...data, viewer, })
                    .then(result => {
                      if (result && typeof result.error === 'object') {
                        return Promise.reject(); // { defaultMessage: messages['error'].defaultMessage, _id: messages['error'].id, }
                      }

                      handleClose();
                    });
            })}
            disabled={pristine || invalid || submitting}
            className={'btn btn-primary unselectable' + (!pristine && valid ? ' green' : '')}>
            {' '}{formatMessage(submitting ? messages['saving'] : messages['save'])}
          </button>

        </Modal.Footer>
      </Modal>
    );
  }
}
