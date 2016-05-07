import React, {Component, PropTypes} from 'react';
import {bindActionCreators} from 'redux';
import {reduxForm} from 'redux-form';

import stopEvent from '../../../utils/stopEvent';

import productValidation, {} from './productValidation';
import * as productActions from '../../../redux/modules/products';

import { batchActions, } from 'redux-batched-actions';
import {changeWithKey as change,} from 'redux-form';

import classnames from 'classnames';

import throttle from 'lodash.throttle';

import Upload from '../../upload/item';

import Actions from '../../confirm/actions';

import styles from './ProductForm.scss';

import CategoryListItem from './CategoryListItem';

import CSSModules from 'react-css-modules';

import Combobox from 'react-widgets/lib/Combobox';

import Modal from 'react-bootstrap/lib/Modal';

import ButtonToolbar from 'react-bootstrap/lib/ButtonToolbar';
import SplitButton from 'react-bootstrap/lib/SplitButton';
import MenuItem from 'react-bootstrap/lib/MenuItem';

import Dialog, {Header, Body, Footer} from '../../utils/Dialog';

import getFieldValue from '../../utils/getFieldValue';

import filter from 'lodash.filter';

const DEFAULT_ACCOUNT_BY_TYPE = {
  1: '7.1.1.1',
  2: '7.1.2.4.3',
};

const ACCOUNTS_BY_TYPE = {
  1: [{
      code: '7.1.1.1',
      _categoryCode: '7.1',
      _groupCode: '7.1.1',
      _classCode: '7',
      name: 'Ventes de marchandises', // Ventes de marchandises au Maroc
  }, {
    code: '7.1.2.1.1',
    _categoryCode: '7.1',
    _groupCode: '7.1.2',
    _classCode: '7',
    name: 'Ventes de produits finis',
  }],

  2: [{
      code: '7.1.2.4.3', // '7.1.2.4',
      _categoryCode: '7.1',
      _groupCode: '7.1.2',
      _classCode: '7',
      name: 'Prestations de services', // 7124 Ventes de services produits au Maroc
  }, {
    code: '7.1.2.4.1',
    _categoryCode: '7.1',
    _groupCode: '7.1.2',
    _classCode: '7',
    name: 'Travaux', // 71241 Travaux
  }],

};

const IGNORED_PROPS = [ 'id', 'companyId', ];

const PRODUCT_TYPE_ID_BY_NAME = {
  Product: 1,
  Service: 2,
};

const PRODUCT_TYPE_NAME_BY_ID = {
  1: 'Product',
  2: 'Service',
};

import {
  intlShape,
} from 'react-intl';

import messages from '../messages';

import {
  fromGlobalId,
} from 'graphql-relay';

import Parse from 'parse';

import makeAlias from  '../../../utils/makeAlias';

const PRODUCT_TYPE_LABEL = {
  Service: intl => intl.formatMessage(messages['productType_Service']),
  Product: intl => intl.formatMessage(messages['productType_Product']),
};

function asyncValidate({displayName, id, companyId}) {
  // TODO: figure out a way to move this to the server. need an instance of ApiClient
  if (!displayName || !companyId) {
    return Promise.resolve({});
  }
  return new Promise((resolve, reject) => {
    const query = new Parse.Query(`Product_${companyId}`);
    query.equalTo('displayNameLowerCase', makeAlias(displayName));

    if(id){
      const {id: localId} = fromGlobalId(id);

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
  form: 'product',
  fields: [
    'companyId',

    'id',

    'displayName',
    'type',
    'sku',
    'image',

    'salesDesc',
    'salesPrice',
    'incomeAccountCode',
  ],
  validate: productValidation,
  asyncValidate,
  asyncBlurFields: ['displayName'],
}, (state, ownProps) => ({
  product: ownProps.product,
  editing: state.products.editing,
  saveError: state.products.saveError,
  initialValues: ownProps.product ? {
    ...ownProps.product,
    companyId: ownProps.company.objectId,
  } : {
    companyId: ownProps.company.objectId,
  },
}), dispatch => bindActionCreators(productActions, dispatch))
@CSSModules(styles, {allowMultiple: true})
export default class extends Component {

  static displayName = 'ProductForm';

  static contextTypes = {
    intl: intlShape.isRequired,
    store: PropTypes.object.isRequired,
  };

  static propTypes = {
    salesAccounts: PropTypes.arrayOf(PropTypes.shape({
      code: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      _categoryCode: PropTypes.string.isRequired,
      _groupCode: PropTypes.string.isRequired,
      _classCode: PropTypes.string.isRequired,
    })).isRequired,

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

    company: PropTypes.object.isRequired,

    onDone: PropTypes.func.isRequired,
  };

  state = {
    changeType: false,
  };

  constructor(props, context){
    super(props, context);

    this.props.editStart(this.props.formKey);

    this.state.displayName = getFieldValue(this.props.fields.displayName);
  }

  componentWillReceiveProps(nextProps){
    this.setState({
      displayName: getFieldValue(nextProps.fields.displayName),
    });
  }

  _handleClose = (e) => {
    if(e){
      stopEvent(e);
    }

    this.props.editStop(this.props.formKey);
    this.props.onCancel();
  };

  _handleSaveAndNew = () => {
    this._handleClose();

    setTimeout(() => {
      this.props.onNew();
    }, 200);
  };

  _handleCancel = () => {
    // const {intl,} = this.context;
    // const {
    //   dirty,
    // } = this.props;
    //
    // if(dirty){
    //   Actions.show(intl.formatMessage(messages['Confirm']))
    //     .then(this._handleClose)
    //     .catch(() => {});
    // }else{
      this._handleClose();
    // }
  };

  _filterFieldData(key, data){
    switch (key) {
      case 'type':
        return PRODUCT_TYPE_ID_BY_NAME[data[key]];
      default:
       return data[key];
    }
  }

  _doSave = (close = true) => {
    const self = this;
    return self.props.handleSubmit((data) => {
      const fieldInfos = Object.keys(data).filter(key => IGNORED_PROPS.indexOf(key) === -1).map(key => ({fieldName: key, value: self._filterFieldData(key, data)}));
      return self.props.save({id: self.props.product && self.props.product.objectId, product: this.props.product, fieldInfos, viewer: self.props.viewer, company: this.props.company, })
        .then(result => {

          const handleResponse = (result) => {
            if (result && typeof result.error === 'object') {
              return Promise.reject(); // { defaultMessage: messages['error'].defaultMessage, _id: messages['error'].id, }
            }

            return Promise.resolve().then(() => {
              self.props.onDone({product: result.result,});
              if(close){
                self._handleClose();
              }else{
                self._handleSaveAndNew();
              }
            });
          };

          return handleResponse(result);
        });
    });
  };

  _onDisplayNameChange = throttle((value) => {
    this.props.fields.displayName.onChange(value);
  }, 3000);

  _onSkuChange = (value) => {
    this.props.fields.sku.onChange(value);
  };

  _onPhotoChange = (value) => {
    this.props.fields.image.onChange(value);
  };

  _onDescriptionChange = (value) => {
    this.props.fields.salesDesc.onChange(value);
  };

  _onPriceChange = (value) => {
    this.props.fields.salesPrice.onChange(value);
  };

  _onIncomeAccountChange = (value) => {
    this.props.fields.incomeAccountCode.onChange(value);
  };

  _renderValuesForm({ pristine, typeValue, displayName, type, sku, image, salesDesc, salesPrice, incomeAccountCode, }){
    const {intl} = this.context;
    const accountValue = getFieldValue(incomeAccountCode);
    return (
      <div className='inner-content'>

        <div styleName='drawer-content-title'>

          <div styleName='table'>
              <div styleName='tableRow'>
                  <div styleName='tableCell middleAlign spacingRt'>
                      <span styleName={classnames('typeIconSmall', {noninvItemImgSmall: typeValue === 'Product', serviceImgSmall: typeValue === 'Service'})}></span>
                  </div>
                  <div styleName='tableCell'>
                      <span styleName='subsection14TitleTextBold'>{PRODUCT_TYPE_LABEL[typeValue](intl)}</span>
                      <div styleName='changeTypeText'>
                          <a onClick={e => { stopEvent(e); this.setState({ changeType: true, }) }} styleName='expand-collapse-link'>{intl.formatMessage(messages['label_changeType'])}</a>
                      </div>
                  </div>
              </div>
          </div>

        </div>

        <div>

            <div styleName={'improved-inventory main-content'}>

              <div styleName='form fullAdd itemView'>

                <div>

                  <div styleName='table width section border'>

                    <div styleName='tableRow'>

                      <div styleName='tableCell nameCell'>
                        <div styleName='row'>
                          <label>{intl.formatMessage(messages['label_Name'])}<span styleName='requiredAsterisk'>*</span></label>
                          <div styleName='dijitInline item-name ' role='presentation'>
                            <input
                              autoFocus
                              value={this.state.displayName}
                              onFocus={displayName.onFocus}
                              onBlur={displayName.onBlur}
                              onChange={(e) => {
                                stopEvent(e);
                                this.setState({
                                  displayName: e.target.value,
                                }, () => {
                                  this._onDisplayNameChange(this.state.displayName);
                                })
                              }}
                              styleName='dijitReset'
                              className={classnames('dijitInputInner form-control', { 'has-error': !pristine && displayName.invalid, })}
                              type='text'
                              maxLength='140'
                            />
                            <small className='text-muted' style={{ marginTop: 3, display: 'block', height: 15, }}>
                              {!pristine && displayName.error ? <div className='text-danger'>{intl.formatMessage(displayName.error)}</div> : ''}
                            </small>
                          </div>
                        </div>
                        <div styleName='row'>
                          <label>{intl.formatMessage(messages['label_SKU'])}<span styleName='required' style={{display: 'none'}}>*</span></label>
                          <div styleName='dijitInline item-sku ' role='presentation'>
                            <input
                              defaultValue={getFieldValue(sku)}
                              onChange={() => {}}
                              onBlur={(e) => { stopEvent(e); this._onSkuChange(e.target.value); }}
                              styleName='dijitReset'
                              className={'dijitInputInner form-control'}
                              type='text'
                              maxLength='100'
                              aria-invalid='false'
                              aria-required='false'/>
                          </div>
                        </div>
                      </div>

                      <div styleName='tableCell'>
                        <Upload
                          ref={'upload'}
                          accept={['.jpg', '.jpeg', '.png', '.gif']}
                          value={getFieldValue(image)}
                          onChange={this._onPhotoChange}/>
                      </div>

                    </div>

                  </div>

                  {/* Row 2 */}

                  <div styleName='table width section border'>

                    <div styleName='tableRow'>

                      <div styleName='tableCell sales'>

                        <label>{intl.formatMessage(messages['title_sales_information'])}</label>

                        <div className='pane'>

                          <div styleName='row'>
                            <textarea
                              defaultValue={getFieldValue(salesDesc)}
                              onChange={() => {}}
                              onBlur={(e) => { stopEvent(e); this._onDescriptionChange(e.target.value); }}
                              name='salesDesc'
                              className={'form-control'}
                              styleName='dijitTextBox dijitTextArea'
                              rows='2'
                              maxLength='4000'
                              placeholder={intl.formatMessage(messages['placeholder_description_sales_form'])}>
                            </textarea>
                          </div>

                          <div styleName='spacing'>
                            <label htmlFor='salesPrice' id='salesPrice'>{intl.formatMessage(messages['label_sales_price'])}</label>
                            <div styleName='dijitInline dijitNumberTextBox rightAligned' role='presentation'>
                              <input
                                style={{textAlign: 'right'}}
                                styleName='dijitReset'
                                className={'form-control'}
                                type='text'
                                defaultValue={function () {
                                  const v = getFieldValue(salesPrice);
                                  const value = !!v ? parseFloat(v.toString().replace(/,/, '')) : NaN;
                                  return !Number.isNaN(value) ? intl.formatNumber(value) : '';
                                }()}
                                onChange={() => {}}
                                onBlur={(e) => {
                                  stopEvent(e);
                                  const v = e.target.value;
                                  const value = parseFloat(
                                    (!!v ? v : '')
                                      .toString()
                                      .replace(/,/, ''));
                                  if(!Number.isNaN(value)){
                                    this._onPriceChange(value);
                                    e.target.value = intl.formatNumber(value);
                                  }else{
                                    e.target.value = '';
                                  }
                                }}
                              />
                            </div>
                          </div>

                          <div className={'salesAccountIdPane'} styleName='spacing'>

                            <label id='salesAccountIdLabel'><span className='required'>*</span>{' '}{intl.formatMessage(messages['label_sales_account_code'])}</label>

                            <div styleName='dijitInline' style={{ display: 'block', width: 350, }} role='combobox' aria-haspopup='true' popupactive='true' aria-expanded='false'>

                              <Combobox
                                caseSensitive={false}
                                filter={(a, b) => {
                                  return a.name.indexOf(b) !== -1;
                                }}
                                className={classnames('choose-account-combo', { 'has-error': !pristine && displayName.invalid, })}
                                styleName={'dijitReset'}
                                data={ACCOUNTS_BY_TYPE[PRODUCT_TYPE_ID_BY_NAME[typeValue]]}
                                value={accountValue /*||  this.props.company.salesSettings.defaultIncomeAccountCode*/}
                                textField={'name'}
                                valueField='code'
                                className={'no-new'}
                                onChange={(item) => {
                                  if(!item || typeof item === 'string'){
                                    this._onIncomeAccountChange(undefined);
                                    return;
                                  }

                                  if(typeof item !== 'string'){
                                    this._onIncomeAccountChange(item['code']);
                                  }
                                }}
                                placeholder={intl.formatMessage(messages.accountPlaceholder)}
                                // disabled
                                // groupBy={ person => person.name.length }
                                // groupComponent={GroupByLength}
                                itemComponent={CategoryListItem}
                              />

                            </div>

                          </div>

                        </div>

                      </div>

                    </div>

                  </div>

                </div>

              </div>

            </div>

        </div>

      </div>
    );
  }

  _renderTypeForm({type, typeValue}){
    const {intl} = this.context;
    return (
      <div className='inner-content'>

        <div styleName='drawer-content-title'>
          <div >
            {typeValue
              ? <span styleName='subsection14TitleTextBold'>{intl.formatMessage(messages['title_changeType'])}</span>
              : <span styleName='subsection14TitleTextBold'>{intl.formatMessage(messages['title_selectType'])}:</span>}
          </div>
        </div>

        <div>
          <div styleName='improved-inventory item-drawer'>
            <div styleName='table'>

              <div onClick={e => { stopEvent(e); this.state.changeType = false; this._onType('Product'); }} styleName={classnames('tableRow product-item-noninv', {selected: typeValue === 'Product'})}>
                <div styleName='tableCell'><span styleName='type-icon'><span styleName='checkmark'></span></span></div>
                <div styleName='tableCell type-desc spacingRight'>
                  <div styleName='subsection14TitleTextBold'>{PRODUCT_TYPE_LABEL['Product'](intl)}</div>
                  <div styleName='subsection14TitleText'>{intl.formatMessage(messages['product_item_noninv_intro'])}</div>
                </div>
              </div>

              <div onClick={e => { stopEvent(e); this.state.changeType = false; this._onType('Service'); }} styleName={classnames('tableRow product-service', {selected: typeValue === 'Service'})}>
                <div styleName='tableCell'><span styleName='type-icon'><span styleName='checkmark'></span></span></div>
                <div styleName='tableCell type-desc spacingRight'>
                  <div styleName='subsection14TitleTextBold'>{PRODUCT_TYPE_LABEL['Service'](intl)}</div>
                  <div styleName='subsection14TitleText'>{intl.formatMessage(messages['product_item_service_intro'])}</div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    );
  }

  _onType = (type) => {
    const { formKey, } = this.props;

    this.context.store.dispatch(batchActions([
      change('product', formKey, 'type', type),
      change('product', formKey, 'incomeAccountCode', DEFAULT_ACCOUNT_BY_TYPE[PRODUCT_TYPE_ID_BY_NAME[type]]),
    ]));

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
        type,
        sku,
        image,

        isSold,
        salesDesc,
        salesPrice,
        incomeAccountCode,
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

    const typeValue = getFieldValue(type);

    return (
      <Modal dialogClassName={`${this.props.styles['modal']} container product-form`}
             dialogComponentClass={Dialog}
             animation={false}
             className={classnames({'product-form product-full-form': true, [styles['product-full-form'] || '']: true, })}
             show={true} keyboard={true} backdropStyle={{opacity: 0.5,}} backdrop={'static'} onHide={() => this._handleCancel()} autoFocus enforceFocus>

        <Modal.Header styleName={'modal-header'} closeButton>
          <h3 style={{
            margin: '20px 12px -10px',
            // fontSize: 20,
            fontFamily: 'HelveticaNeueLight,Helvetica,Arial,sans-serif',
            fontWeight: 400,
          }}>{intl.formatMessage(messages['FormTitle'])}</h3>
        </Modal.Header>

        <Body styleName={'modal-body'}>

          <div styleName='table stretch'>

            <div styleName=''>

              <div>

                <div className='the-container table' style={{}}>

                  <div style={{}}>

                  <form onSubmit={this._doSave()}>

                    <div styleName='content'>

                      {!typeValue || this.state.changeType
                        ? this._renderTypeForm({type, typeValue})
                        : this._renderValuesForm({
                            pristine, displayName, type, typeValue, sku, image, isSold, salesDesc, salesPrice, incomeAccountCode, })}

                    </div>

                  </form>

                  </div>

                </div>

              </div>


            </div>

          </div>

        </Body>

        <Footer styleName={'modal-footer'}>

        <div styleName='tableCell'>

          <button
            styleName='btn floatLeft dark'
            onClick={() => this._handleCancel()}
            disabled={submitting}
            className='unselectable'>{intl.formatMessage(messages['cancel'])}
          </button>

        </div>

        <div styleName='tableCell'></div>

        <div styleName='tableCell floatRight'>

          <MySplitButton
            // className={'unselectable' + (valid && dirty ? ' green valid' : (invalid || submitting || !dirty ? ' disabled' : ''))}
            className={'unselectable' + (invalid || submitting ? ' disabled' : 'green valid')}
            styleName={'btn primary'}
            styles={this.props.styles}
            valid={valid}
            onSave={this._doSave.bind(this)}
            // disabled={invalid || submitting || !dirty}
            disabled={invalid || submitting}
            submitting={submitting}
          />

        </div>

        </Footer>

      </Modal>
    );

  }

}

class MySplitButton extends Component{
  static contextTypes = {
    intl: intlShape.isRequired,
  };
  render(){
    const {intl} = this.context;
    const {onSave, className, disabled, submitting, valid, styles, } = this.props;
    return (
      <div className={styles['dropdown']}>
        <ButtonToolbar>

          <SplitButton className={className} disabled={disabled} onClick={onSave()} title={<span>{submitting ? <i className={`${styles['submitting']} material-icons`}>loop</i> : null}{' '}{intl.formatMessage(messages['save'])}</span>} dropup pullRight id={'product-form'}>

            <MenuItem onClick={onSave(false)} eventKey={'1'}>{intl.formatMessage(messages['saveAndNew'])}</MenuItem>

          </SplitButton>

        </ButtonToolbar>
      </div>
    );
  }
}
