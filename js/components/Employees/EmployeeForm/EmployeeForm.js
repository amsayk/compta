import React, {Component, PropTypes} from 'react';
import ReactDOM from 'react-dom';
import {bindActionCreators} from 'redux';
import {reduxForm} from 'redux-form';

import stopEvent from '../../../utils/stopEvent';

import employeeValidation, {} from './employeeValidation';
import * as employeeActions from '../../../redux/modules/employees';

import classnames from 'classnames';

import styles from './EmployeeForm.scss';

import CSSModules from 'react-css-modules';

import Modal from 'react-bootstrap/lib/Modal';

import getFieldValue from '../../utils/getFieldValue';

import Dialog, {Header, Body, Footer} from '../../utils/Dialog';

import {
  intlShape,
} from 'react-intl';

import messages from './messages';

const IGNORED_PROPS = [ 'id', 'companyId', ];

import {
  fromGlobalId,
} from 'graphql-relay';

import Parse from 'parse';

import makeAlias from  '../../../utils/makeAlias';

function asyncValidate({displayName, id, companyId}) {
  // TODO: figure out a way to move this to the server. need an instance of ApiClient
  if (!displayName || !companyId) {
    return Promise.resolve({});
  }
  return new Promise((resolve, reject) => {
    const query = new Parse.Query(`Employee_${companyId}`);
    query.equalTo('displayNameLowerCase', makeAlias(displayName));

    if(id){
      const {id: localId} = fromGlobalId(id);

      // query.notEqualTo('objectId', localId);
      query.notEqualTo('objectId', localId.split(':')[0]);
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
  form: 'employee',
  fields: [
    'id',
    'displayName',

    'title',
    'givenName',
    'middleName',
    'familyName',
    'emails',
    'phone',
    'mobile',
    'fax',
    'website',

    'address_streetAddress',
    'address_cityTown',
    'address_stateProvince',
    'address_postalCode',
    'address_country',

    'notes',

    'companyId',
  ],
  validate: employeeValidation,
  asyncValidate,
  asyncBlurFields: ['displayName'],
}, (state, ownProps) => ({
  employee: ownProps.employee,
  editing: state.employees.editing,
  saveError: state.employees.saveError,
  initialValues: ownProps.employee ? {
    companyId: ownProps.company.objectId,
    ...ownProps.employee,
  } : {
    companyId: ownProps.company.objectId,
    displayName: ownProps.displayNameValue,
  },
}), dispatch => bindActionCreators(employeeActions, dispatch))
@CSSModules(styles, {allowMultiple: true})
export default class extends Component {

  static displayName = 'EmployeeForm';

  static contextTypes = {
    intl: intlShape.isRequired,
  };

  static propTypes = {
    fields: PropTypes.object.isRequired,
    dirty: PropTypes.bool.isRequired,
    editStart: PropTypes.func.isRequired,
    editStop: PropTypes.func.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    valid: PropTypes.bool.isRequired,
    invalid: PropTypes.bool.isRequired,
    pristine: PropTypes.bool.isRequired,
    save: PropTypes.func.isRequired,
    submitting: PropTypes.bool.isRequired,
    saveError: PropTypes.object,
    formKey: PropTypes.string.isRequired,
    values: PropTypes.object.isRequired,

    onDone: PropTypes.func.isRequired,
  };

  state = { activeTab: 1, };

  constructor(props, context){
    super(props, context);

    this.props.editStart(this.props.formKey);
  }

  _handleClose = (e) => {
    if(e){
      stopEvent(e);
    }

    setImmediate(() => {
      this.props.editStop(this.props.formKey);
      this.props.onCancel();
    });
  };

  _setActiveTab = (index) => {
    this.setState({
      activeTab: index,
    });
  };

  render() {
    const self = this;

    const {
      formKey,
      dirty,
      editStart,
      editStop,
      handleSubmit,
      fields: {
        id,
        displayName,
        // displayNameValidation,
        title,
        givenName,
        middleName,
        familyName,
        emails,
        phone,
        mobile,
        fax,
        website,

        address_streetAddress,
        address_cityTown,
        address_stateProvince,
        address_postalCode,
        address_country,

        notes,
      },
      valid,
      invalid,
      pristine,
      save,
      submitting,
      saveError: {
        [formKey]: saveError,
      },
      values,

      styles,

    } = this.props;

    const {activeTab} = this.state;

    const {intl,} = this.context;

    const doSave = handleSubmit((data) => {
      const fieldInfos = Object.keys(data).filter(key => IGNORED_PROPS.indexOf(key) === -1).map(key => ({fieldName: key, value: data[key]}));
      return save({id: this.props.employee && this.props.employee.objectId, employee: this.props.employee, fieldInfos, viewer: this.props.viewer, company: this.props.company, })
        .then(result => {

          const handleResponse = (result) => {
            if (result && typeof result.error === 'object') {
              return Promise.reject(); // { defaultMessage: messages['error'].defaultMessage, _id: messages['error'].id, }
            }

            this._handleClose();
            return Promise.resolve().then(() => {
              this.props.onDone({employee: result.result});
            });
          };

          return handleResponse(result);
        });
    });

    return (
      <Modal dialogClassName={`${this.props.styles['modal']} ${this.props.styles['full']} container employee-form`}
             dialogComponentClass={Dialog}
             ref={ref => this._dialog = ref}
             onShow={() => { this.refs.displayName && this.refs.displayName.focus(); }}
             animation={false}
             className={classnames({'employee-form employee-full-form': true, [styles['employee-full-form'] || '']: true, })}
             show={true} backdropStyle={{opacity: 0.5,}} keyboard={true} backdrop={'static'} onHide={() => this._handleClose()} autoFocus enforceFocus container={this.props.container}>

        <Modal.Header styleName={'modal-header'} closeButton>{intl.formatMessage(messages['FormTitle'])}
        </Modal.Header>

        <Modal.Body styleName={'modal-body'}>

          <div styleName='table stretch'>

            <div styleName=''>

              <div>

                <div className='the-container table' style={{}}>

                  <div style={{}}>

                  <form onSubmit={doSave}>

                    <div className='row'>

                      <div className='col-sm-6'>

                        <div className='row'>

                          <div className='col-sm-2' styleName={'col-field'}>
                            <fieldset className='form-group'>
                              <label>{intl.formatMessage(messages['label_prefix'])}</label>
                              <input
                                onChange={title.onChange}
                                value={getFieldValue(title)}
                                type='text'
                                className='form-control'/>
                            </fieldset>
                          </div>

                          <div className='col-sm-5' styleName={'col-field'}>
                            <fieldset className='form-group'>
                              <label>{intl.formatMessage(messages['label_first_name'])}</label>
                              <input
                                onChange={e => {
                                  if(this._displayNameSet){
                                    givenName.onChange(e);
                                    return;
                                  }

                                  const givenNameValue = e.target.value;
                                  const familyNameValue = getFieldValue(familyName);

                                  const hasGivenName = !!givenNameValue;
                                  const hasFamilyName = !!familyNameValue;

                                  givenName.onChange(e);
                                  displayName.onChange(
                                    `${givenNameValue || ''}${hasFamilyName ? `${hasGivenName ? ' ' : ''}${familyNameValue}` : ''}`);
                                }}
                                value={getFieldValue(givenName)}
                                type='text' className='form-control'/>
                            </fieldset>
                          </div>

                          {/*<div className='col-sm-3' styleName={'col-field'}>
                            <fieldset className='form-group'>
                              <label>{intl.formatMessage(messages['label_middle_name'])}</label>
                              <input
                                onChange={middleName.onChange}
                                value={getFieldValue(middleName)}
                                type='text' className='form-control'/>
                            </fieldset>
                          </div>*/}

                          <div className='col-sm-5' styleName={'col-field'}>
                            <fieldset className='form-group'>
                              <label>{intl.formatMessage(messages['label_last_name'])}</label>
                              <input
                                onChange={familyName.onChange}
                                value={getFieldValue(familyName)}
                                type='text' className='form-control'/>
                            </fieldset>
                          </div>

                        </div>

                        <div className='row'>
                          <div className='col-sm-12'>
                            <fieldset className={classnames('form-group', {'has-danger': !pristine && displayName.invalid,})}>
                              <label><span className='required'>*</span>{intl.formatMessage(messages['label_display_name'])}</label>
                              <input
                                ref={'displayName'}
                                onChange={displayName.onChange}
                                onBlur={e => {
                                  this._displayNameSet = !!e.target.value;
                                }}
                                value={getFieldValue(displayName)}
                                autoFocus type='text'
                                className={classnames('form-control', {'form-control-danger': !pristine && displayName.invalid,})}
                                />
                              <small className="text-muted" style={{ marginTop: 3, display: 'block', height: 15, }}>
                                {!pristine && displayName.error ? <div className='text-danger'>{intl.formatMessage(displayName.error)}</div> : ''}
                              </small>
                            </fieldset>
                          </div>
                        </div>

                      </div>

                      <div className='col-sm-6'>

                        <div className='row'>
                          <div className='col-sm-12'>
                            <fieldset className='form-group'>
                              <label>{intl.formatMessage(messages['label_emails'])}</label>
                              <input
                                onChange={emails.onChange}
                                value={getFieldValue(emails)}
                                type='text' className='form-control'/>
                            </fieldset>
                          </div>
                        </div>

                        <div className='row'>

                          <div className='col-sm-4' styleName={'col-field'}>
                            <fieldset className='form-group'>
                              <label>{intl.formatMessage(messages['label_phone'])}</label>
                              <input
                              onChange={phone.onChange}
                              value={getFieldValue(phone)}
                                type='text' className='form-control'/>
                            </fieldset>
                          </div>

                          <div className='col-sm-4' styleName={'col-field'}>
                            <fieldset className='form-group'>
                              <label>{intl.formatMessage(messages['label_mobile'])}</label>
                              <input
                              onChange={mobile.onChange}
                              value={getFieldValue(mobile)}
                                type='text' className='form-control'/>
                            </fieldset>
                          </div>

                          <div className='col-sm-4' styleName={'col-field'}>
                            <fieldset className='form-group'>
                              <label>{intl.formatMessage(messages['label_fax'])}</label>
                              <input
                              onChange={fax.onChange}
                              value={getFieldValue(fax)}
                                type='text' className='form-control'/>
                            </fieldset>
                          </div>

                        </div>

                        <div className='row'>
                          <div className='col-sm-12'>
                            <fieldset className='form-group'>
                              <label>{intl.formatMessage(messages['label_website'])}</label>
                              <input
                              onChange={website.onChange}
                              value={getFieldValue(website)}
                                type='text' className='form-control'/>
                            </fieldset>
                          </div>
                        </div>

                      </div>

                    </div>

                    <div className='row' style={{}}>

                      <div className='col-sm-12'>

                        <div className='row'>

                          <div className='col-sm-12'>

                            <ul className='nav nav-tabs' role='tablist'>
                              <li className='nav-item'>
                                <a onClick={e => { stopEvent(e); this._setActiveTab(1); }} className={classnames('nav-link', {active: activeTab === 1,})} role='tab'>
                                {intl.formatMessage(messages['tab_title_address'])}</a>
                              </li>

                              <li className='nav-item'>
                                <a onClick={e => { stopEvent(e); this._setActiveTab(2); }} className={classnames('nav-link', {active: activeTab === 2,})} role='tab'>
                                {intl.formatMessage(messages['tab_title_notes'])}</a>
                              </li>

                            </ul>

                            <div className='tab-content'>

                              <div className={classnames('tab-pane fade', {'active in': activeTab === 1,})} role='tabpanel'>

                                <div className='form-group row' style={{paddingTop: 5}}>

                                  <label style={{textAlign: 'left'}} className='col-sm-12'>{intl.formatMessage(messages['label_addressAddress'])}</label>

                                </div>

                                <div className='form-group row'>

                                  <div className='col-sm-12'>
                                    <textarea
                                      style={{resize: 'none'}}
                                      disabled={submitting}
                                      onChange={address_streetAddress.onChange}
                                      value={getFieldValue(address_streetAddress)}
                                      placeholder={intl.formatMessage(messages['placeholder_Street'])}
                                      className='form-control'/>
                                  </div>

                                </div>

                                <div className='form-group row'>

                                  <div className='col-sm-6'>
                                    <input
                                    onChange={address_cityTown.onChange}
                                    value={getFieldValue(address_cityTown)}
                                    disabled={submitting} type='text' className='form-control'
                                    placeholder={intl.formatMessage(messages['placeholder_cityTown'])}/>
                                  </div>

                                  <div className='col-sm-6'>
                                    <input
                                    onChange={address_stateProvince.onChange}
                                    value={getFieldValue(address_stateProvince)}
                                      disabled={submitting} type='text' className='form-control'
                                      placeholder={intl.formatMessage(messages['placeholder_stateProvince'])}/>
                                  </div>

                                </div>

                                <div className='form-group row'>

                                  <div className='col-sm-6'>
                                    <input
                                    onChange={address_postalCode.onChange}
                                    value={getFieldValue(address_postalCode)}
                                      disabled={submitting} type='text' className='form-control'
                                      placeholder={intl.formatMessage(messages['placeholder_postalCode'])}/>
                                  </div>

                                  <div className='col-sm-6'>
                                    <input
                                    onChange={address_country.onChange}
                                    value={getFieldValue(address_country)}
                                      disabled={submitting} type='text' className='form-control'
                                      placeholder={intl.formatMessage(messages['placeholder_country'])}/>
                                  </div>

                                </div>

                              </div>

                              <div className={classnames('tab-pane fade', {'active in': activeTab === 2,})} role='tabpanel'>

                                <div className='form-group row' style={{paddingTop: 5}}>

                                  <label style={{textAlign: 'left'}} className='col-sm-12'>{intl.formatMessage(messages['label_notes'])}</label>

                                </div>

                                <div className='form-group row'>

                                  <div className='col-sm-12'>
                                    <textarea
                                      style={{resize: 'none'}}
                                      disabled={submitting}
                                      onChange={notes.onChange}
                                      value={getFieldValue(notes)}
                                      rows={6}
                                      className='form-control'/>
                                  </div>

                                </div>

                              </div>

                            </div>

                          </div>

                        </div>

                      </div>

                    </div>

                  </form>

                  </div>

                </div>

              </div>


            </div>

          </div>

        </Modal.Body>

        <Modal.Footer styleName={'modal-footer'}>

          <hr/>

          <div style={{
            display: 'inline-block',
            float: 'left',
          }}>

            <button
              styleName='btn save-btn'
              onClick={() => this._handleClose()}
              disabled={submitting}
              className='unselectable'>{intl.formatMessage(messages['cancel'])}
            </button>

          </div>

          <div style={{
            display: 'inline-block',
          }}>

            <button
              styleName='btn dark primary'
              onClick={doSave}
              disabled={invalid || submitting || !dirty}
              className={'unselectable' + (valid && dirty ? ' green valid' : (invalid || submitting || !dirty ? ' disabled' : ''))}>
              {submitting ? <i styleName={'submitting'} className={'material-icons'}>loop</i> : null}{' '}{intl.formatMessage(messages['save'])}
            </button>

          </div>

        </Modal.Footer>

      </Modal>
    );

  }

}
