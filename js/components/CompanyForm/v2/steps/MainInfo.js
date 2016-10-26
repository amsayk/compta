import React, { PropTypes, } from 'react';

import Parse from 'parse';

import Relay from 'react-relay';

import {bindActionCreators} from 'redux';
import {reduxForm} from 'redux-form';

import pick from 'lodash.pick';

import messages from './messages';

import * as companyActions from '../../../../redux/modules/companies';

import { setBeforeUnloadMessage, unsetBeforeUnloadMessage, } from '../../../../utils/unbeforeunload';

import LoadingActions from '../../../Loading/actions';

import Actions from '../../../confirm/actions';

import Logo from '../../../AppSettings/ManageCompanyForm/Logo';

import getFieldValue from '../../../utils/getFieldValue';

import Combobox from 'react-widgets/lib/Combobox';

import { createValidator, required, email, url, } from '../../../../utils/validation';

import {Company,} from '../../../../utils/types';

import {
  fromGlobalId,
} from 'graphql-relay';

const legalForms = [ 1, 2, 3, 4, ];
const legalFormsByIndex = { 1: 'SARL', 2:'SA', 3:'SNC', 4:'SARL_AU', };
const legalFormsById = { 'SARL': 1, 'SA':2, 'SNC':3, 'SARL_AU':4, };

import makeAlias from '../../../../utils/makeAlias';

import classnames from 'classnames';

import {
  intlShape,
} from 'react-intl';

import styles from './styles.scss';

import CSSModules from 'react-css-modules';

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

const companyValidation = createValidator({
  displayName: [required],
});

@reduxForm({
    form: 'company',
    fields: [
      'id',
      'displayName',

      'legalForm',
      'email',
      'fax',
      'webSite',

      'activity',

      'logo',
    ],
    validate: companyValidation,
    asyncValidate,
    asyncBlurFields: ['displayName'],
  }, (state, ownProps) => ({
    saveError: state.companies.saveError,
    initialValues: {
      id: ownProps.data.id,
      displayName: ownProps.data.displayName,
      logo: ownProps.data.logo,
    },
  }),
  dispatch => bindActionCreators(companyActions, dispatch))
@CSSModules(styles, {allowMultiple: true})
export default class MainInfo extends React.Component{
  constructor(...args){
    super(...args);

    this.props.onRef(this);
  }
  static propTypes = {
    viewer: PropTypes.object.isRequired,
  };

  static contextTypes = {
    intl: intlShape.isRequired,
    store: PropTypes.object.isRequired,
  };

  render() {
    const {intl, store, } = this.context;

    const {
      asyncValidating,
      dirty,
      formKey,
      editStop,
      fields: {
        id,
        displayName,
        legalForm,
        email,
        fax,
        webSite,
        activity,
        logo,
      },
      handleSubmit,
      valid,
      invalid,
      pristine,
      save,
      update,
      submitting,
      saveError: {[formKey]: saveError},
      values,

      onCancel,
    } = this.props;

    return (
      <div>
        <div styleName='tableRow'>

          <div styleName='tableCell settingContent'>

            <div style={{padding: '0 45px'}}>

              {saveError && <div styleName='error'>{intl.formatMessage({ ...saveError, id: saveError._id, })}</div>}

              <div>

                <div style={{textAlign: 'left'}}>

                  <label htmlFor='logo' style={{ paddingLeft: 0, }} styleName='subsection14TitleText settingName'>{intl.formatMessage(messages['Logo'])}</label>

                  <fieldset className={classnames('form-group')}>
                    <Logo onChange={logo.onChange} value={getFieldValue(logo)}/>
                  </fieldset>

                  <fieldset className={classnames('form-group', {'has-danger': displayName.touched && displayName.invalid,})}>

                    <label htmlFor='displayName' style={{ paddingLeft: 0, }} styleName='subsection14TitleText settingName'>{intl.formatMessage(messages['CompanyName'])}{' '}<span className={'required'}>*</span></label>

                    <input
                      {...displayName}
                       value={getFieldValue(displayName, '')}
                      disabled={submitting}
                      autoFocus
                      type='text'
                      className={classnames('form-control', { 'form-control-danger': displayName.touched && displayName.invalid, })}
                      maxLength={'140'} />

                    <small className="text-muted" style={{ marginTop: 3, display: 'block', height: 15, }}>
                      {displayName.touched && displayName.error ? <div className='text-danger'>{intl.formatMessage(displayName.error)}</div> : ''}
                    </small>

                  </fieldset>

                  <br/>

                  <div className='form-group'>

                    <label htmlFor='form-jurique' style={{ paddingLeft: 0, }} styleName='subsection14TitleText settingName'>{intl.formatMessage(messages['LegalForm'])}</label>

                    <div style={{ width: '75%', textAlign: 'left'}}>

                      <Combobox
                        caseSensitive={false}
                        filter={'contains'}
                        data={legalForms.map((f, index) => ({
                          id: f,
                          name: intl.formatMessage(messages[`legalForm${f}`]),
                        }))}
                        value={legalFormsById[getFieldValue(legalForm)]}
                        onChange={value => {
                          if(!value || typeof value === 'string'){
                            legalForm.onChange(undefined);
                            return;
                          }
                          legalForm.onChange(legalFormsByIndex[value.id]);
                        }}
                        textField='name'
                        valueField='id'
                        disabled={submitting}
                        className={classnames('no-new', {'has-error': !pristine && legalForm.invalid})}
                        // groupBy={ person => person.name.length }
                        // groupComponent={GroupByLength}
                        // itemComponent={GroupByLength}
                      />

                    </div>

                  </div>

                  <br/>

                  <fieldset className={classnames('form-group', { 'has-danger': !pristine && activity.invalid, })}>

                    <label htmlFor='activity' style={{ paddingLeft: 0, }} styleName='subsection14TitleText settingName'>{intl.formatMessage(messages['Activity'])}</label>

                    <input
                      style={{ width: '75%', }}
                      disabled={submitting}
                      {...activity}
                       value={getFieldValue(activity, '')}
                      type='activity'
                      className={classnames('form-control', { 'form-control-danger': !pristine && activity.invalid, })}
                      id='activity'/>

                  </fieldset>

                  <br/>

                  <fieldset className={classnames('form-group', { 'has-danger': !pristine && email.invalid, })}>

                    <label htmlFor='email' style={{ paddingLeft: 0, }} styleName='subsection14TitleText settingName'>{intl.formatMessage(messages['Email'])}</label>

                    <input
                      style={{ width: '75%', }}
                      disabled={submitting}
                      {...email}
                       value={getFieldValue(email, '')}
                      type='email'
                      className={classnames('form-control', { 'form-control-danger': !pristine && email.invalid, })}
                      id='email'/>

                  </fieldset>

                  <fieldset className={classnames('form-group', { 'has-danger': !pristine && fax.invalid, })}>

                    <label htmlFor='fax' style={{ paddingLeft: 0, }} styleName='subsection14TitleText settingName'>{intl.formatMessage(messages['Fax'])}</label>

                    <input
                      style={{ width: '75%', }}
                      disabled={submitting}
                      {...fax}
                       value={getFieldValue(fax, '')}
                      type='fax'
                      className={classnames('form-control', { 'form-control-danger': !pristine && fax.invalid, })}
                      id='fax'/>

                  </fieldset>

                  <fieldset className={classnames('form-group', { 'has-danger': !pristine && webSite.invalid, })}>

                    <label htmlFor='webSite' style={{ paddingLeft: 0, }} styleName='subsection14TitleText settingName'>{intl.formatMessage(messages['Site'])}</label>

                    <input
                      style={{ width: '75%', }}
                      disabled={submitting}
                      {...webSite}
                       value={getFieldValue(webSite, '')}
                      type='webSite'
                      className={classnames('form-control', { 'form-control-danger': !pristine && webSite.invalid, })}
                      id='webSite'/>

                  </fieldset>

                </div>

                <br/>
                <br/>

              </div>

            </div>

          </div>

        </div>
      </div>
    );
  }
}
