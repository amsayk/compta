import React, {Component, PropTypes} from 'react';
import ReactDOM from 'react-dom';
import {bindActionCreators} from 'redux';
import {reduxForm} from 'redux-form';

import stopEvent from '../../../utils/stopEvent';

import events from 'dom-helpers/events';
import contains from 'dom-helpers/query/contains';

import vendorValidation, {} from './vendorValidation';
import * as vendorActions from '../../../redux/modules/vendors';

import classnames from 'classnames';

import styles from './VendorForm.scss';

import CSSModules from 'react-css-modules';

import Combobox from 'react-widgets/lib/Combobox';

import getFieldValue from '../../utils/getFieldValue';

import Modal from 'react-bootstrap/lib/Modal';

import Dialog, {Header, Body, Footer} from '../../utils/Dialog';

const IGNORED_PROPS = [ 'id', 'type', 'companyId', ];

import {
  intlShape,
} from 'react-intl';

import messages from './messages';

import {
  fromGlobalId,
} from 'graphql-relay';

import Parse from 'parse';

import makeAlias from  '../../../utils/makeAlias';

function asyncValidate({ type, displayName, id, companyId}) {
  // TODO: figure out a way to move this to the server. need an instance of ApiClient
  if (!displayName || !companyId || !type) {
    return Promise.resolve({});
  }
  return new Promise((resolve, reject) => {
    const query = new Parse.Query(`${type}_${companyId}`);
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
  form: 'vendor',
  fields: [
    'id',
    'type',
    'displayName',
    'companyId',
  ],
  validate: vendorValidation,
  asyncValidate,
  asyncBlurFields: ['displayName'],
}, (state, ownProps) => ({
  vendor: ownProps.vendor,
  editing: state.vendors.editing,
  saveError: state.vendors.saveError,
  initialValues: ownProps.vendor ? {
    companyId: ownProps.company.objectId,
    id: ownProps.vendor.id,
    displayName: ownProps.vendor.displayName,
    type: 'Vendor',
  } : {
    companyId: ownProps.company.objectId,
    displayName: ownProps.displayNameValue,
    type: typeof ownProps._type !== 'undefined' ? ownProps._type : 'Vendor',
  },
}), dispatch => bindActionCreators(vendorActions, dispatch))
@CSSModules(styles, {allowMultiple: true})
export default class extends Component {

  static displayName = 'VendorMiniForm';

  static contextTypes = {
    intl: intlShape.isRequired,
  };

  static propTypes = {
    _type: PropTypes.oneOf([ 'Customer', 'Vendor', 'Employee' ]).string,

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
  };

  state = {};

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

  componentDidMount() {
    events.on(document, 'click', this._handleClickoutside, true);
  }

  componentWillUnmount() {
    events.off(document, 'click', this._handleClickoutside, true);
  }

  _handleClickoutside = e => {
    if(!this._dialog || !this._dialog._modal){
      return;
    }

    const container = ReactDOM.findDOMNode(this._dialog._modal);
    if(container && !contains(container, e.target)){
      this._handleClose(e);
    }
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
        type,
        displayName,
      },
      valid,
      invalid,
      pristine,
      touched,
      save,
      submitting,
      saveError: {
        [formKey]: saveError,
      },
      values,

      styles,
      _type,

    } = this.props;

    const {intl,} = this.context;

    const displayNameValue = getFieldValue(displayName);
    const typeValue = getFieldValue(type);

    const doSave = handleSubmit((data) => {
      const type = data['type'];
      const fieldInfos = Object.keys(data).filter(key => IGNORED_PROPS.indexOf(key) === -1).map(key => ({fieldName: key, value: data[key]}));
      return save({id: this.props.vendor && this.props.vendor.objectId, type, fieldInfos, viewer: this.props.viewer, company: this.props.company, })
        .then(result => {

          const handleResponse = (result) => {
            if (result && typeof result.error === 'object') {
              return Promise.reject(); // { defaultMessage: messages['error'].defaultMessage, _id: messages['error'].id, }
            }

            this._handleClose();
            return Promise.resolve().then(() => {
              this.props.onDone({ type, vendor: result.result, });
            });
          };

          return handleResponse(result);
        });
    });

    // console.log('=====================================');
    //
    // console.log('Valid', valid);
    // console.log('Invalid', invalid);
    // console.log('initialValues', [displayName].map(({initialValue}) => initialValue));
    // console.log('Values', values);
    // console.log('Values 2', [displayName].map(({value}) => value));
    // console.log('Invalids', [displayName].filter(({invalid}) => invalid));
    //
    // console.log('=====================================');

    return (
      <Modal dialogClassName={`${styles['modal']} ${typeof _type === 'undefined' ? styles['has-type'] : ''} ${styles['mini']} vendor-form`}
             dialogComponentClass={Dialog}
             ref={ref => this._dialog = ref}
             animation={false}
             className={classnames({'vendor-form': true, [styles['vendor-form'] || '']: true, })}
             show={true} keyboard={true} backdrop={false} onHide={() => this._handleClose()} autoFocus enforceFocus container={this.props.container}>

        <Modal.Header styleName={'modal-header'} closeButton={false}>
          {typeof _type === 'undefined' && typeValue === 'Customer' ? intl.formatMessage(messages['FormTitleCustomer']) : intl.formatMessage(messages['FormTitle'])}
        </Modal.Header>

        <Modal.Body>

          <div styleName='table stretch'>

            <div styleName=''>

              <div>

                <div className='the-container table' style={{}}>

                  <div style={{}}>

                  <form onSubmit={doSave}>

                    <fieldset className={classnames('form-group', {'has-danger': touched && displayName.invalid,})}>

                      <label><span className='required'>*</span>{intl.formatMessage(messages['label_name'])}</label>

                      <input
                        autoFocus
                        onChange={displayName.onChange}
                        value={displayNameValue}
                        disabled={submitting}
                        type='text'
                        className={classnames('form-control', { 'form-control-danger': touched && displayName.invalid, })}
                      />

                      <small className="text-muted" style={{ marginTop: 3, display: 'block', height: 15, }}>
                        {displayName.error ? <div className='text-danger'>{intl.formatMessage(displayName.error)}</div> : ''}
                      </small>

                    </fieldset>

                    {this.props._type === 'Vendor' ? null : function(){
                      return (
                        <fieldset className='form-group' style={{ width: 130, }}>

                          <label styleName='subsection12TitleText' htmlFor='type'>{intl.formatMessage(messages['Type'])}</label>

                          <div className={''} id='type'>

                            <Combobox
                              data={TYPES(intl)}
                              value={typeValue}
                              onChange={value => {
                                if(!value || typeof value === 'string'){
                                  type.onChange(type.initialValue);
                                  return;
                                }
                                type.onChange(value.id);
                              }}
                              textField={'name'}
                              valueField={'id'}
                              className={'no-new'}
                            />

                          </div>

                        </fieldset>
                      );
                    }()}

                  </form>

                  </div>

                </div>

              </div>


            </div>

          </div>

        </Modal.Body>

        <Modal.Footer styleName={'modal-footer'}>

          <div style={{
            display: 'inline-block',
            float: 'left',
            marginLeft: -18,
          }}>

            <button
              styleName=''
              onClick={() => this.props.onShowMoreDetails(displayNameValue, this.props._type === 'Vendor' ? 'Vendor' : getFieldValue(type))}
              disabled={submitting}
              className='unselectable btn btn-link'><i style={{ verticalAlign: 'middle', }} className={'material-icons'}>add</i>{' '}{intl.formatMessage(messages['VendorDetails'])}
            </button>

          </div>

          <div style={{
            display: 'inline-block',
          }}>

            <button
              styleName='save-btn'
              onClick={doSave}
              disabled={invalid || submitting}
              className={'unselectable' + (valid ? ' green valid' : (invalid || submitting ? ' disabled' : ''))}>
              {submitting ? <i styleName={'submitting'} className={'material-icons'}>loop</i> : null}{' '}{intl.formatMessage(messages['save'])}
            </button>

          </div>

        </Modal.Footer>

      </Modal>
    );

  }

}

function TYPES(intl){
  return [{
    id: 'Customer',
    name: intl.formatMessage(messages['Customer']),
  }, {
    id: 'Vendor',
    name: intl.formatMessage(messages['Vendor']),

  }, {
    id: 'Employee',
    name: intl.formatMessage(messages['Employee']),

  }];
}
