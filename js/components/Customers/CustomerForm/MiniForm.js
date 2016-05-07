import React, {Component, PropTypes} from 'react';
import ReactDOM from 'react-dom';
import {bindActionCreators} from 'redux';
import {reduxForm} from 'redux-form';

import stopEvent from '../../../utils/stopEvent';

import events from 'dom-helpers/events';
import contains from 'dom-helpers/query/contains';

import customerValidation, {} from './customerValidation';
import * as customerActions from '../../../redux/modules/customers';

import classnames from 'classnames';

import styles from './CustomerForm.scss';

import CSSModules from 'react-css-modules';

import Modal from 'react-bootstrap/lib/Modal';

import Dialog, {Header, Body, Footer} from '../../utils/Dialog';

import getFieldValue from '../../utils/getFieldValue';

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
    const query = new Parse.Query(`Customer_${companyId}`);
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
  form: 'customer',
  fields: [
    'id',
    'displayName',
    'companyId',
  ],
  validate: customerValidation,
  asyncValidate,
  asyncBlurFields: ['displayName'],
}, (state, ownProps) => ({
  customer: ownProps.customer,
  editing: state.customers.editing,
  saveError: state.customers.saveError,
  initialValues: ownProps.customer ? {
    companyId: ownProps.company.objectId,
    id: ownProps.customer.id,
    displayName: ownProps.customer.displayName,
  } : {
    companyId: ownProps.company.objectId,
    displayName: ownProps.displayNameValue,
  },
}), dispatch => bindActionCreators(customerActions, dispatch))
@CSSModules(styles, {allowMultiple: true})
export default class extends Component {

  static displayName = 'CustomerMiniForm';

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
        displayName,
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

    const {intl,} = this.context;

    const displayNameValue = getFieldValue(displayName);

    const doSave = handleSubmit((data) => {
      const fieldInfos = Object.keys(data).filter(key => IGNORED_PROPS.indexOf(key) === -1).map(key => ({fieldName: key, value: data[key]}));
      return save({id: this.props.customer && this.props.customer.objectId, fieldInfos, viewer: this.props.viewer, company: this.props.company, })
        .then(result => {

          const handleResponse = (result) => {
            if (result && typeof result.error === 'object') {
              return Promise.reject(); // { defaultMessage: messages['error'].defaultMessage, _id: messages['error'].id, }
            }

            this._handleClose();
            return Promise.resolve().then(() => {
              this.props.onDone({customer: result.result});
            });
          };

          return handleResponse(result);
        });
    });

    return (
      <Modal dialogClassName={`${this.props.styles['modal']} ${this.props.styles['mini']} customer-form`}
             dialogComponentClass={Dialog}
             ref={ref => this._dialog = ref}
             animation={false}
             className={classnames({'customer-form': true, [styles['customer-form'] || '']: true, })}
             show={true} keyboard={true} backdrop={false} onHide={() => this._handleClose()} autoFocus enforceFocus container={this.props.container}>

        <Modal.Header styleName={'modal-header'} closeButton={false}>{intl.formatMessage(messages['FormTitle'])}
        </Modal.Header>

        <Modal.Body>

          <div styleName='table stretch'>

            <div styleName=''>

              <div>

                <div className='the-container table' style={{}}>

                  <div style={{}}>

                  <form onSubmit={doSave}>

                    <fieldset className={classnames('form-group', {'has-danger': !pristine && displayName.invalid,})}>

                      <label><span className='required'>*</span>{intl.formatMessage(messages['label_name'])}</label>

                      <input
                        autoFocus
                        onChange={displayName.onChange}
                        value={displayNameValue}
                        disabled={submitting}
                        type='text'
                        className={classnames('form-control', { 'form-control-danger': !pristine && displayName.invalid, })}
                      />

                      <small className="text-muted" style={{ marginTop: 3, display: 'block', height: 15, }}>
                        {displayName.error ? <div className='text-danger'>{intl.formatMessage(displayName.error)}</div> : ''}
                      </small>

                    </fieldset>

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
              onClick={() => this.props.onShowMoreDetails(displayNameValue)}
              disabled={submitting}
              className='unselectable btn btn-link'><i style={{ verticalAlign: 'middle', }} className={'material-icons'}>add</i>{' '}{intl.formatMessage(messages['CustomerDetails'])}
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
