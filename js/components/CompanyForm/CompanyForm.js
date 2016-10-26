import React, {Component, PropTypes} from 'react';
import {bindActionCreators} from 'redux';
import {reduxForm} from 'redux-form';
import companyValidation, {periodTypes} from './companyValidation';
import * as companyActions from '../../redux/modules/companies';

import classnames from 'classnames';

import Modal from 'react-bootstrap/lib/Modal';

import styles from './CompanyForm.scss';

import CSSModules from 'react-css-modules';

import getFieldValue from '../utils/getFieldValue';

import {
  fromGlobalId,
} from 'graphql-relay';

import Parse from 'parse';

import {
  Text,
  // Select,
} from '../form/form';

import {Company,} from '../../utils/types';

const Progress = ({}) => (
  <div className='mdl-progress mdl-js-progress mdl-progress__indeterminate is-upgraded'>
    <div className='progressbar bar bar1' style={{width: '0%'}}></div>
    <div className='bufferbar bar bar2' style={{width: '100%'}}></div>
    <div className='auxbar bar bar3' style={{width: '0%'}}></div>
  </div>
);

import {
  FormattedMessage,
  FormattedRelative,
  intlShape,
} from 'react-intl';

import makeAlias from  '../../utils/makeAlias';

import messages from './messages';

function asyncValidate({displayName, id}) {
  // TODO: figure out a way to move this to the server. need an instance of ApiClient
  if (!displayName) {
    return Promise.resolve({});
  }
  return new Promise((resolve, reject) => {
    const query = new Parse.Query(Company);
    query.equalTo('displayNameLowerCase', makeAlias(displayName));

    if(id){
      const {id: localId} = fromGlobalId(id);

      query.notEqualTo('objectId', localId);
    }

    query.first().then(
      function (object) {
        if (object) {
          reject({
            displayName: messages.displayNameError,
          });
          return;
        }

        resolve();
      },

      function () {
        reject({
          displayName: messages.error,
        });
      }
    );
  });
}

@reduxForm({
    form: 'company',
    fields: [
      'id',
      'displayName',
      'periodType',
    ],
    validate: companyValidation,
    asyncValidate,
    asyncBlurFields: ['displayName'],
  }, (state, ownProps) => ({
    saveError: state.companies.saveError,
    initialValues: ownProps.company || { id: ownProps.formKey, periodType: 'MONTHLY', }, // Pass company on edit
  }),
  dispatch => bindActionCreators(companyActions, dispatch))
@CSSModules(styles, {})
export default class CompanyForm extends React.Component {
  static contextTypes = {
    intl: intlShape.isRequired,
    router: PropTypes.object.isRequired,
    store: PropTypes.object.isRequired,
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
    ga('send', 'pageview', '/modal/company-form');
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
        displayName,
        periodType,
      },
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

    if(process.env.NODE_ENV !== 'production'){
      // console.group();
      //
      // console.log('Values', [id, displayName, periodType].map(e => e));
      // console.log('Valid', [id, displayName, periodType].filter(e => e.valid).map(e => e));
      // console.log('Invalid', [id, displayName, periodType].filter(e => !e.valid).map(e => e));
      //
      // console.log('Form valid', valid);
      // console.log('Form invalid', invalid);
      // console.log('Form pristine', pristine);
      // console.log('Form dirty', dirty);
      //
      // console.log('Save error', saveError);
      //
      // console.groupEnd();
    }

    return (

      <Modal styleName={'modal'}
             className={classnames({'valid': !pristine && valid, 'submitting': submitting, form: true, 'app-modal': true,})} show={true}
             keyboard={false} backdropStyle={{opacity: 0.5,}} backdrop={'static'} onHide={() => handleClose()} autoFocus enforceFocus>
        <Modal.Header>
          <div className='title'>{formatMessage(messages['formTitle'])}
          </div>
          <div className='subtitle'>{formatMessage(messages['formSubtitle'])}</div>
        </Modal.Header>
        <Modal.Body>

          {/*<Select
            name={formatMessage(messages['periodTypeLabel'])}
            values={periodTypes.map(periodType => [periodType, formatMessage(messages[periodType])])}
            props={periodType}
          />*/}

          <Text
            name={formatMessage(messages['displayNameLabel'])}
            description={formatMessage(messages['displayNameDesc'])}
            placeholder={formatMessage(messages['displayNamePlaceholder'])}
            autoFocus
            props={{...displayName, error: displayName.error && formatMessage(displayName.error)}}
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
            onClick={handleSubmit((data, dispatch) => {
              // return Promise.reject({
              //   displayName: messages['error'],
              // });
              return save({...data, viewer: this.props.viewer})
                    .then(result => {

                      const handleResponse = (result) => {
                        if (result && typeof result.error === 'object') {
                          return Promise.reject(); // { defaultMessage: messages['error'].defaultMessage, _id: messages['error'].id, }
                        }

                        handleClose();
                        setImmediate(() => {this.context.router.push(`/apps/${result.result.id}/`);});
                        return Promise.resolve();
                      };

                      return handleResponse(result);
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
