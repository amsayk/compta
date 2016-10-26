import React, {Component, PropTypes} from 'react';
import {bindActionCreators} from 'redux';
import {reduxForm} from 'redux-form';

import LoadingActions from '../../Loading/actions';

import shallowCompare from 'react-addons-shallow-compare';

import stopEvent from '../../../utils/stopEvent';

import pick from 'lodash.pick';
import memoize from 'lodash.memoize';
import find from 'lodash.find';

import AccountListItem from './AccountListItem';

import productValidation, {} from './productValidation';
import * as productActions from '../../../redux/modules/products';

import { batchActions, } from 'redux-batched-actions';
import {changeWithKey as change,} from 'redux-form';

import classnames from 'classnames';

import throttle from 'lodash.throttle';

// import Upload from '../../upload/v2/item';

import Image from './Image';

import Actions from '../../confirm/actions';

import styles from './ProductForm.scss';

import CSSModules from 'react-css-modules';

import Combobox from 'react-widgets/lib/Combobox';

import Modal from 'react-bootstrap/lib/Modal';

import ButtonToolbar from 'react-bootstrap/lib/ButtonToolbar';
import SplitButton from 'react-bootstrap/lib/SplitButton';
import MenuItem from 'react-bootstrap/lib/MenuItem';

import Dialog, {Header, Body, Footer} from '../../utils/Dialog';

import getFieldValue from '../../utils/getFieldValue';

import filter from 'lodash.filter';

const ENABLE_PURCHASE = process.env.PRODUCT_ENABLE_PURCHASE;

const DEFAULT_ACCOUNT_BY_TYPE = {
  1: '7.1.1.1',
  2: '7.1.2.4.3',
};

const DEFAULT_EXPENSE_ACCOUNT = "6.1.1.1";

// const ACCOUNTS_BY_TYPE = {
//   1: [{
//       code: '7.1.1.1',
//       _categoryCode: '7.1',
//       _groupCode: '7.1.1',
//       _classCode: '7',
//       name: 'Ventes de marchandises', // Ventes de marchandises au Maroc
//   }, {
//     code: '7.1.2.1.1',
//     _categoryCode: '7.1',
//     _groupCode: '7.1.2',
//     _classCode: '7',
//     name: 'Ventes de produits finis',
//   }],
//
//   2: [{
//       code: '7.1.2.4.3', // '7.1.2.4',
//       _categoryCode: '7.1',
//       _groupCode: '7.1.2',
//       _classCode: '7',
//       name: 'Prestations de services', // 7124 Ventes de services produits au Maroc
//   }, {
//     code: '7.1.2.4.1',
//     _categoryCode: '7.1',
//     _groupCode: '7.1.2',
//     _classCode: '7',
//     name: 'Travaux', // 71241 Travaux
//   }],
//
// };

// const EXPENSES_ACCOUNTS = [
//   {
//     "code": "6.1.1.1",
//     "name": "Achats de marchandises", // Achats de marchandises \"groupe A\"
//     "_classCode": "6",
//     "_categoryCode": "6.1",
//     "_groupCode": "6.1.1"
//   },
//
//   // {
//   //   "code": "6.1.1.2",
//   //   "name": "Achats de marchandises \"groupe B\"",
//   //   "_classCode": "6",
//   //   "_categoryCode": "6.1",
//   //   "_groupCode": "6.1.1"
//   // },
//
//   {
//     "code": "6.1.2.1",
//     "name": "Achats de matières premières",
//     "_classCode": "6",
//     "_categoryCode": "6.1",
//     "_groupCode": "6.1.2"
//   },
//
//   {
//     "code": "6.1.2.2",
//     "name": "Achats de matières et fournitures consommables",
//     "_classCode": "6",
//     "_categoryCode": "6.1",
//     "_groupCode": "6.1.2"
//   },
//
//   {
//     "code": "6.1.2.3",
//     "name": "Achats d'emballages",
//     "_classCode": "6",
//     "_categoryCode": "6.1",
//     "_groupCode": "6.1.2"
//   },
//
//   {
//     "code": "6.1.2.6",
//     "name": "Achats de travaux, études et prestations de service",
//     "_classCode": "6",
//     "_categoryCode": "6.1",
//     "_groupCode": "6.1.2"
//   },
//
//   {
//     "code": "6.1.4.4",
//     "name": "Publicité, publications et relations publiques",
//     "_classCode": "6",
//     "_categoryCode": "6.1",
//     "_groupCode": "6.1.4"
//   },
//
//   {
//     "code": "6.1.4.2",
//     "name": "Transport",
//     "_classCode": "6",
//     "_categoryCode": "6.1",
//     "_groupCode": "6.1.4"
//   },
//
//   {
//     "code": "6.1.4.1",
//     "name": "Études, recherches et documentation",
//     "_classCode": "6",
//     "_categoryCode": "6.1",
//     "_groupCode": "6.1.4"
//   }
// ];

const IGNORED_PROPS = [ 'id', 'companyId', 'image', 'purchaseVATPart', 'salesVATPart', ];

const PRODUCT_TYPE_ID_BY_NAME = {
  Product: 1,
  Service: 2,
};

const VAT_ID_TO_TEXT = {
  1: `20%`,
  2: `14%`,
  3: `10%`,
  4: `Exonéré`,
  5: `7%`,
};

const PERCENTAGES = intl => {
  return [{
    id: 1,
    value: 20,
    name: `${intl.formatNumber(20 / 100, { format: 'PERCENT', })} (20%)`,
  }, {
    id: 2,
    value: 14,
    name: `${intl.formatNumber(14 / 100, { format: 'PERCENT', })} (14%)`,
  }, {
    id: 3,
    value: 10,
    name: `${intl.formatNumber(10 / 100, { format: 'PERCENT', })} (10%)`,
  }, {
    id: 4,
    value: 0,
    name: 'Exonéré'
  }, {
    id: 5,
    value: 7,
    name: `${intl.formatNumber(7 / 100, { format: 'PERCENT', })} (7%)`,
  }];
};

const PERCENTAGES_VALUES = [{
  id: 1,
  value: 20,
}, {
  id: 2,
  value: 14,
}, {
  id: 3,
  value: 10,
}, {
  id: 4,
  value: 0,
}, {
  id: 5,
  value: 7,
}];



const getPercentageById = memoize(function getPercentageById({ percentages, _id, }) {
  return find(percentages, ({ id, }) => id === _id);
}, ({ _id, }) => _id);

const PRODUCT_TYPE_NAME_BY_ID = {
  1: 'Product',
  2: 'Service',
};

const VATInputType_NAME_BY_ID = {
  1: 'HT',
  2: 'TTC',
  3: 'NO_VAT',
};

const VATInputType_ID_BY_NAME = {
  HT: 1,
  TTC: 2,
  NO_VAT: 3,
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

const VAT_NAME_TO_ID = {
  Value_20: 1,
  Value_14: 2,
  Value_10: 3,
  Value_Exempt: 4,
  Value_7: 5,
};

// export default class Wrapper extends React.Component{
//   __submitting = false;
//   shouldComponentUpdate(nextProps, nextState){
//     return this.__submitting ? false : shallowCompare(this, nextProps, nextState);
//   }
//   _onSubmitting = __submitting => {
//     this.__submitting = __submitting;
//   };
//   render(){
//     return (
//       <ProductForm {...this.props} onSubmitting={this._onSubmitting} />
//     )
//   }
// }

function idOfVATPart({ inputType, value : id, }) {
  return VAT_NAME_TO_ID[id];

  // switch (inputType){
  //   case 1:
  //   case 2:
  //   case 'HT':
  //   case 'TTC':
  //
  //     for(let i = 0; i < PERCENTAGES_VALUES.length; i++){
  //       if(PERCENTAGES_VALUES[i].id !== 4 && value === PERCENTAGES_VALUES[i].value){
  //         return PERCENTAGES_VALUES[i].id;
  //       }
  //     }
  //
  //     throw `idOfVATPart: Error invalid value: ${value}`;
  //
  //   case 3:
  //   case 'NO_VAT':
  //     return 4; // exempt
  //
  //
  //   default :
  //
  //     throw `idOfVATPart: Error invalid inputType: ${inputType}`;
  // }
}

function valueOfVATPart(intl, inputTypeValue, id) {

  const inputTypeIsTTC = inputTypeValue === 2 || inputTypeValue === 'TTC' || typeof inputTypeValue === 'undefined';

  // const p = getPercentageById({
  //   percentages: PERCENTAGES_VALUES, _id: id
  // });

  switch (id){
    case 1: return {
      inputType: VATInputType_ID_BY_NAME[inputTypeIsTTC ? 'TTC' : 'HT'],
      value: id, // p.value,
    };
    case 2: return {
      inputType: VATInputType_ID_BY_NAME[inputTypeIsTTC ? 'TTC' : 'HT'],
      value: id, // p.value,
    };
    case 3: return {
      inputType: VATInputType_ID_BY_NAME[inputTypeIsTTC ? 'TTC' : 'HT'],
      value: id, // p.value,
    };
    case 4: return {
      inputType: VATInputType_ID_BY_NAME['NO_VAT'],
      value: id, // 0,
    };
    case 5: return {
      inputType: VATInputType_ID_BY_NAME['TTC'],
      value: id, // 0,
    };
    case 6: return {
      inputType: VATInputType_ID_BY_NAME[inputTypeIsTTC ? 'TTC' : 'HT'],
      value: id, // p.value,
    };

    default :

      throw `valueOfVATPart: Error invalid id: ${id}`;
  }
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

    'salesEnabled',
    'salesDesc',
    'salesPrice',
    'salesPriceInputType',
    'salesVATPart',
    'incomeAccountCode',

    'purchaseEnabled',

    'purchaseDesc',
    'cost',
    'costInputType',
    'purchaseVATPart',
    'purchaseAccountCode',
  ],
  validate: productValidation,
  asyncValidate,
  asyncBlurFields: ['displayName'],
}, (state, ownProps) => ({
  product: ownProps.product,
  editing: state.products.editing,
  saveError: state.products.saveError,
  initialValues: ownProps.product ? function () {
    return {
      ...ownProps.product,
      companyId: ownProps.company.objectId,

      salesVATPart: ownProps.product.salesVATPart && ownProps.product.salesVATPart.inputType
        ? idOfVATPart(ownProps.product.salesVATPart)
        : undefined,

      purchaseVATPart: ownProps.product.purchaseVATPart && ownProps.product.purchaseVATPart.inputType
        ? idOfVATPart(ownProps.product.purchaseVATPart)
        : undefined,

      salesPriceInputType: ownProps.product.salesVATPart
        ? ownProps.product.salesVATPart.inputType
        : (ownProps.company.VATSettings.enabled ? 1 : 3),

      costInputType: ownProps.product.purchaseVATPart
        ? ownProps.product.purchaseVATPart.inputType
        : (ownProps.company.VATSettings.enabled ? 1 : 3),

    };
  }() : {
    salesEnabled: true,
    salesPriceInputType: ownProps.company.VATSettings.enabled ? 1 : 3,

    costInputType: ownProps.company.VATSettings.enabled ? 1 : 3,
    purchaseEnabled: false,

    companyId: ownProps.company.objectId,
  },
}), dispatch => bindActionCreators(productActions, dispatch))
@CSSModules(styles, {allowMultiple: true})
export default class ProductForm extends React.Component {

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

    expensesAccounts: PropTypes.arrayOf(PropTypes.shape({
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

  componentDidMount(){
    ga('send', 'pageview', '/modal/app/product');
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

  __saveNew = (data) => {
    LoadingActions.show();
    const fieldInfos = Object.keys(data).filter(key => IGNORED_PROPS.indexOf(key) === -1).map(key => ({fieldName: key, value: this._filterFieldData(key, data)}));

    const {
      intl,
    } = this.context;

    const {
      fields: {
        salesPriceInputType,
        costInputType,
      }
    } = this.props;

    fieldInfos.push({
      fieldName: 'salesVATPart',
      value: data['salesVATPart']
        ? JSON.stringify(valueOfVATPart(intl, getFieldValue(salesPriceInputType), data['salesVATPart']))
        : null,
    });
    fieldInfos.push({
      fieldName: 'purchaseVATPart',
      value: data['purchaseVATPart']
        ? JSON.stringify(valueOfVATPart(intl, getFieldValue(costInputType), data['purchaseVATPart']))
        : null,
    });

    const _data = {id: this.props.product && this.props.product.objectId, product: this.props.product, item: this.props.product, fieldInfos, viewer: this.props.viewer, company: this.props.company, };

    const imageValue = data['image'];

    const {
      fields: {
        image,
      }
    } = this.props;

    if(image.dirty){
      _data.image = imageValue ? {
        ...pick(imageValue, [ 'name', 'type', 'size' ]),
        dataBase64: imageValue.url.split(/,/)[1],
      } : {
        isNull: true,
      };
    }

    return this.props.save(_data)
      .then(result => {
        LoadingActions.hide();

        const handleResponse = (result) => {
          if (result && typeof result.error === 'object') {
            return Promise.reject(); // { defaultMessage: messages['error'].defaultMessage, _id: messages['error'].id, }
          }

          return Promise.resolve().then(() => {
            this.props.onDone({product: result.result,});
              this._handleSaveAndNew();
          });
        };

        return handleResponse(result);
      });
  };

  __saveClose = (data) => {
    LoadingActions.show();
    const fieldInfos = Object.keys(data).filter(key => IGNORED_PROPS.indexOf(key) === -1).map(key => ({fieldName: key, value: this._filterFieldData(key, data)}));

    const {
      intl,
    } = this.context;

    const {
      fields: {
        salesPriceInputType,
        costInputType,
      }
    } = this.props;

    fieldInfos.push({
      fieldName: 'salesVATPart',
      value: data['salesVATPart']
        ? JSON.stringify(valueOfVATPart(intl, getFieldValue(salesPriceInputType), data['salesVATPart']))
        : null,
    });
    fieldInfos.push({
      fieldName: 'purchaseVATPart',
      value: data['purchaseVATPart']
        ? JSON.stringify(valueOfVATPart(intl, getFieldValue(costInputType), data['purchaseVATPart']))
        : null,
    });

    const _data = {id: this.props.product && this.props.product.objectId, product: this.props.product, item: this.props.product, fieldInfos, viewer: this.props.viewer, company: this.props.company, };

    const imageValue = data['image'];

    const {
      fields: {
        image,
      }
    } = this.props;

    if(image.dirty){
      _data.image = imageValue ? {
        ...pick(imageValue, [ 'name', 'type', 'size' ]),
        dataBase64: imageValue.url.split(/,/)[1],
      } : {
        isNull: true,
      };
    }

    return this.props.save(_data)
      .then(result => {
        LoadingActions.hide();

        const handleResponse = (result) => {
          if (result && typeof result.error === 'object') {
            return Promise.reject(); // { defaultMessage: messages['error'].defaultMessage, _id: messages['error'].id, }
          }

          return Promise.resolve().then(() => {
            this.props.onDone({product: result.result,});
              this._handleClose();
          });
        };

        return handleResponse(result);
      });
  };

  _doSave = (close = true) => {
    return this.props.handleSubmit(close ? this.__saveClose : this.__saveNew);
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

  _onSalesEnabledChange = (e) => {
    this.props.fields.salesEnabled.onChange(e.target.checked);
  };

  _onSalesPriceInputTypeChange = (e) => {
    this.props.fields.salesPriceInputType.onChange(e);
  };
  _onSalesVATPartChange = (value) => {
    this.props.fields.salesVATPart.onChange(value);
  };

  _onPurchaseDescriptionChange = (value) => {
    this.props.fields.purchaseDesc.onChange(value);
  };

  _onPriceChange = (value) => {
    this.props.fields.salesPrice.onChange(value);
  };
  _onCostChange = (value) => {
    this.props.fields.cost.onChange(value);
  };

  _onCostInputTypeChange = (e) => {
    this.props.fields.costInputType.onChange(e);
  };
  _onPurchaseVATPartChange = (value) => {
    this.props.fields.purchaseVATPart.onChange(value);
  };

  _onIncomeAccountChange = (value) => {
    this.props.fields.incomeAccountCode.onChange(value);
  };
  _onPurchaseAccountChange = (value) => {
    this.props.fields.purchaseAccountCode.onChange(value);
  };

  _renderValuesForm({ pristine, typeValue, displayName, type, sku, image, salesEnabled, salesDesc, salesPrice, salesPriceInputType, salesVATPart, incomeAccountCode, purchaseEnabled, purchaseDesc, cost, costInputType, purchaseVATPart, purchaseAccountCode, }){
    const {intl} = this.context;
    const accountValue = getFieldValue(incomeAccountCode);

    const purchaseEnabledValue = getFieldValue(purchaseEnabled);
    const purchaseAccountValue = getFieldValue(purchaseAccountCode);

    const salesEnabledValue = getFieldValue(salesEnabled);

    const salesVATPartValue = getFieldValue(salesVATPart);
    const purchaseVATPartValue = getFieldValue(purchaseVATPart);

    const salesPriceInputTypeValue = getFieldValue(salesPriceInputType);
    const salesPriceInputValueIsTTC = salesPriceInputTypeValue === 2 || salesPriceInputTypeValue === 'TTC';

    const costInputTypeValue = getFieldValue(costInputType);
    const costInputValueIsTTC = costInputTypeValue === 2 || costInputTypeValue === 'TTC';

    const VATEnabled = this.props.company.VATSettings.enabled;

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
                              value={this.state.displayName || ''}
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
                              className={classnames('dijitInputInner form-control', { 'has-error': displayName.touched && displayName.invalid, })}
                              type='text'
                              maxLength='140'
                            />
                            <small className='text-muted' style={{ marginTop: 3, display: 'block', height: 15, }}>
                              {displayName.touched && displayName.error ? <div className='text-danger'>{intl.formatMessage(displayName.error)}</div> : ''}
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
                        <Image
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

                          <div className='checkbox' styleName={'sales row'}>
                            <label style={{ display: 'inline', }}>
                              <input styleName={classnames('input', { checked: salesEnabledValue, })} value={'salesEnabled'} onChange={this._onSalesEnabledChange} checked={salesEnabledValue} type='checkbox'/>
                            </label>
                            <span style={{ verticalAlign: 'sub', marginLeft: 5, }}>Je vend ce produit/service à mes clients</span>
                          </div>

                          {salesEnabledValue &&  <div styleName='row'>
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
                          </div>}

                          {salesEnabledValue && <div styleName='row' style={{   marginTop: 16, }}>

                            <div styleName='tableCell'>

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
                                      return !Number.isNaN(value) ? intl.formatNumber(value, { format: 'MONEY', }) : '';
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
                                        e.target.value = intl.formatNumber(value, { format: 'MONEY', });
                                      }else{
                                        e.target.value = '';
                                      }
                                    }}
                                  />
                                </div>
                              </div>

                            </div>


                            <div styleName='tableCell'>

                              <div className={'salesAccountIdPane'} styleName='spacing' style={{ marginLeft: 24, }}>

                                <label id='salesAccountIdLabel'><span className='required'>*</span>{' '}{intl.formatMessage(messages['label_sales_account_code'])}</label>

                                <div styleName='dijitInline' style={{ display: 'block', width: 275, }} role='combobox' aria-haspopup='true' popupactive='true' aria-expanded='false'>

                                  <Combobox
                                    dropUp
                                    caseSensitive={false}
                                    filter={(a, b) => {
                                      return a.name.indexOf(b) !== -1;
                                    }}
                                    className={classnames('choose-account-combo no-new')}
                                    styleName={'dijitReset'}
                                    // data={ACCOUNTS_BY_TYPE[PRODUCT_TYPE_ID_BY_NAME[typeValue]]}
                                    data={this.props.salesAccounts}
                                    value={accountValue /*||  this.props.company.salesSettings.defaultIncomeAccountCode*/}
                                    textField={'name'}
                                    valueField='code'
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
                                    itemComponent={AccountListItem}
                                  />

                                </div>

                              </div>

                            </div>

                          </div>}

                          {VATEnabled && salesEnabledValue &&  <div styleName="row">

                            <div styleName='tableCell'>

                              <div className='checkbox' styleName={'sales row'}>
                                <label style={{ display: 'inline', }}>
                                  <input styleName={classnames('input', { checked: salesPriceInputValueIsTTC, })} value={'salesPriceInputValue'} onChange={e => this._onSalesPriceInputTypeChange(e.target.checked ? 2/* TTC */ : 1/* HT */)} checked={salesPriceInputValueIsTTC} type='checkbox'/>
                                </label>
                                <span style={{ verticalAlign: 'sub', marginLeft: 5, }}>Le {intl.formatMessage(messages['label_sales_price'])} est en TTC</span>
                              </div>

                            </div>

                          </div>}

                          {VATEnabled && salesEnabledValue &&  <div styleName="row">

                            <div styleName='tableCell'>

                              <div className={'salesAccountIdPane'} styleName='spacing'>

                                <label id='salesAccountIdLabel'>{'TVA sur les ventes'}</label>

                                <div styleName='dijitInline' style={{ display: 'block', width: 490, }} role='combobox' aria-haspopup='true' popupactive='true' aria-expanded='false'>

                                  <Combobox
                                    dropUp
                                    caseSensitive={false}
                                    filter={(a, b) => {
                                      return a.name.indexOf(b) !== -1;
                                    }}
                                    className={classnames('choose-VAT-part-combo no-new')}
                                    styleName={'dijitReset'}
                                    data={PERCENTAGES(intl)}
                                    value={salesVATPartValue}
                                    textField={'name'}
                                    valueField='id'
                                    onChange={(item) => {
                                      if(!item || typeof item === 'string'){
                                        this._onSalesVATPartChange(undefined);
                                        return;
                                      }

                                      if(typeof item !== 'string'){
                                        this._onSalesVATPartChange(item['id']);
                                      }
                                    }}
                                    placeholder={intl.formatMessage(messages.VATPartPlaceholder)}
                                    // disabled
                                    // groupBy={ person => person.name.length }
                                    // groupComponent={GroupByLength}
                                    // itemComponent={AccountListItem}
                                  />

                                </div>

                              </div>

                            </div>

                          </div>}


                        </div>

                      </div>


                    </div>

                  </div>

                  {/* Row 3 */}

                  {ENABLE_PURCHASE && <div styleName='table width section border'>

                    <div styleName="tableRow">

                      <div styleName="tableCell purchase">

                        <label>{intl.formatMessage(messages['title_expenses_information'])}</label>

                        <div className='pane'>

                          <div className='checkbox' styleName={'purchase row'}>
                            <label style={{ display: 'inline', }}>
                              <input styleName={classnames('input', { checked: purchaseEnabledValue, })} value={'purchaseEnabled'} onChange={this._onPurchaseAccountEnabledChange} checked={purchaseEnabledValue} type='checkbox'/>
                            </label>
                            <span style={{ verticalAlign: 'sub', marginLeft: 5, }}>J'achete ce produit/service de mes fournisseurs</span>
                          </div>

                          {purchaseEnabledValue && <div styleName='row'>
                            <textarea
                              defaultValue={getFieldValue(purchaseDesc)}
                              onChange={() => {}}
                              onBlur={(e) => { stopEvent(e); this._onPurchaseDescriptionChange(e.target.value); }}
                              name='purchaseDesc'
                              className={'form-control'}
                              styleName='dijitTextBox dijitTextArea'
                              rows='2'
                              maxLength='4000'
                              placeholder={intl.formatMessage(messages['placeholder_description_expenses_form'])}>
                            </textarea>
                          </div>}

                          {purchaseEnabledValue && <div styleName='tableRow'>

                            <div styleName='tableCell'>

                              <div styleName='spacing'>
                                <label htmlFor='cost' id='cost'>{intl.formatMessage(messages['label_cost'])}</label>
                                <div styleName='dijitInline dijitNumberTextBox rightAligned' role='presentation'>
                                  <input
                                    style={{textAlign: 'right'}}
                                    styleName='dijitReset'
                                    className={'form-control'}
                                    type='text'
                                    defaultValue={function () {
                                      const v = getFieldValue(cost);
                                      const value = !!v ? parseFloat(v.toString().replace(/,/, '')) : NaN;
                                      return !Number.isNaN(value) ? intl.formatNumber(value, { format: 'MONEY', }) : '';
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
                                        this._onCostChange(value);
                                        e.target.value = intl.formatNumber(value, { format: 'MONEY', });
                                      }else{
                                        e.target.value = '';
                                      }
                                    }}
                                  />
                                </div>
                              </div>

                            </div>


                            <div styleName='tableCell'>

                              <div className={'purchaseAccountIdPane'} styleName='spacing' style={{ marginLeft: 24, }}>

                                <label id='purchaseAccountIdLabel'><span className='required'>*</span>{' '}{intl.formatMessage(messages['label_expenses_account_code'])}</label>

                                <div styleName='dijitInline' style={{ display: 'block', width: 275, }} role='combobox' aria-haspopup='true' popupactive='true' aria-expanded='false'>

                                  <Combobox
                                    dropUp
                                    caseSensitive={false}
                                    filter={(a, b) => {
                                      return a.name.indexOf(b) !== -1;
                                    }}
                                    className={classnames('choose-account-combo no-new')}
                                    styleName={'dijitReset'}
                                    // data={EXPENSES_ACCOUNTS}
                                    data={this.props.expensesAccounts}
                                    value={purchaseAccountValue}
                                    textField={'name'}
                                    valueField='code'
                                    onChange={(item) => {
                                      if(!item || typeof item === 'string'){
                                        this._onPurchaseAccountChange(undefined);
                                        return;
                                      }

                                      if(typeof item !== 'string'){
                                        this._onPurchaseAccountChange(item['code']);
                                      }
                                    }}
                                    placeholder={intl.formatMessage(messages.accountPlaceholder)}
                                    // disabled
                                    // groupBy={ person => person.name.length }
                                    // groupComponent={GroupByLength}
                                    itemComponent={AccountListItem}
                                  />

                                </div>

                              </div>

                            </div>

                          </div>}

                          {VATEnabled && purchaseEnabledValue &&  <div styleName="row">

                            <div styleName='tableCell'>

                              <div className='checkbox' styleName={'sales row'}>
                                <label style={{ display: 'inline', }}>
                                  <input styleName={classnames('input', { checked: costInputValueIsTTC, })} value={'costInputValue'} onChange={e => this._onCostInputTypeChange(e.target.checked ? 2/* TTC */ : 1/* HT */)} checked={costInputValueIsTTC} type='checkbox'/>
                                </label>
                                <span style={{ verticalAlign: 'sub', marginLeft: 5, }}>Le {intl.formatMessage(messages['label_cost'])} est en TTC</span>
                              </div>

                            </div>

                          </div>}

                          {VATEnabled && purchaseEnabledValue &&  <div styleName="row">

                            <div styleName='tableCell'>

                              <div className={'salesAccountIdPane'} styleName='spacing'>

                                <label id='salesAccountIdLabel'>{'TVA sur les achats'}</label>

                                <div styleName='dijitInline' style={{ display: 'block', width: 490, }} role='combobox' aria-haspopup='true' popupactive='true' aria-expanded='false'>

                                  <Combobox
                                    dropUp
                                    caseSensitive={false}
                                    filter={(a, b) => {
                                      return a.name.indexOf(b) !== -1;
                                    }}
                                    className={classnames('choose-VAT-part-combo no-new')}
                                    styleName={'dijitReset'}
                                    data={PERCENTAGES(intl)}
                                    value={purchaseVATPartValue}
                                    textField={'name'}
                                    valueField='id'
                                    onChange={(item) => {
                                      if(!item || typeof item === 'string'){
                                        this._onPurchaseVATPartChange(undefined);
                                        return;
                                      }

                                      if(typeof item !== 'string'){
                                        this._onPurchaseVATPartChange(item['id']);
                                      }
                                    }}
                                    placeholder={intl.formatMessage(messages.VATPartPlaceholder)}
                                    // disabled
                                    // groupBy={ person => person.name.length }
                                    // groupComponent={GroupByLength}
                                    // itemComponent={AccountListItem}
                                  />

                                </div>

                              </div>

                            </div>

                          </div>}

                        </div>

                      </div>

                    </div>

                  </div>}

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
            <div styleName='table' style={{ width: '100%', }}>

              <div onClick={e => { stopEvent(e); this.state.changeType = false; this._onType('Product'); }} styleName={classnames('tableRow product-item-noninv', {selected: typeValue === 'Product'})}>
                <div styleName='tableCell' style={{ width: '25%', }}><span styleName='type-icon'><span styleName='checkmark'></span></span></div>
                <div styleName='tableCell type-desc spacingRight' style={{ width: '75%', }}>
                  <div styleName='subsection14TitleTextBold'>{PRODUCT_TYPE_LABEL['Product'](intl)}</div>
                  <div styleName='subsection14TitleText'>{intl.formatMessage(messages['product_item_noninv_intro'])}</div>
                </div>
              </div>

              <div onClick={e => { stopEvent(e); this.state.changeType = false; this._onType('Service'); }} styleName={classnames('tableRow product-service', {selected: typeValue === 'Service'})}>
                <div styleName='tableCell' style={{ width: '25%', }}><span styleName='type-icon'><span styleName='checkmark'></span></span></div>
                <div styleName='tableCell type-desc spacingRight' style={{ width: '75%', }}>
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

  _onPurchaseAccountEnabledChange = (e) => {
    const selected = e.target.checked;

    const { formKey, } = this.props;

    const {
      fields: {
        purchaseAccountCode,
        purchaseDesc,
        cost,
      }
    } =  this.props;

    const purchaseAccountValue = getFieldValue(purchaseAccountCode);
    const purchaseDescValue = getFieldValue(purchaseDesc);
    const costValue = getFieldValue(cost);

    this.context.store.dispatch(batchActions([
      change('product', formKey, 'purchaseEnabled', selected),
      change('product', formKey, 'purchaseDesc', selected ? purchaseDescValue : null),
      change('product', formKey, 'cost', selected ? costValue : null),
      change('product', formKey, 'purchaseAccountCode', selected ? purchaseAccountValue || DEFAULT_EXPENSE_ACCOUNT : null),
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

        salesEnabled,
        salesDesc,
        salesPrice,
        salesPriceInputType, salesVATPart,
        incomeAccountCode,

        purchaseEnabled,

        purchaseDesc,
        cost,
        costInputType, purchaseVATPart,
        purchaseAccountCode,
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

                  <div onSubmit={this._doSave()}>

                    <div styleName='content'>

                      {!typeValue || this.state.changeType
                        ? this._renderTypeForm({type, typeValue})
                        : this._renderValuesForm({
                            pristine, displayName, type, typeValue, sku, image, salesEnabled, isSold, salesDesc, salesPrice, salesPriceInputType, salesVATPart, incomeAccountCode, purchaseEnabled, purchaseDesc, cost, costInputType, purchaseVATPart, purchaseAccountCode, })}

                    </div>

                  </div>

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

class MySplitButton extends React.Component{
  static contextTypes = {
    intl: intlShape.isRequired,
  };
  shouldComponentUpdate(nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState);
  }
  render(){
    const {intl} = this.context;
    const {onSave, className, disabled, submitting, valid, styles, } = this.props;
    // const title = <span>{submitting ? <i className={`${styles['submitting']} material-icons`}>loop</i> : null}{' '}{intl.formatMessage(messages['save'])}</span>;
    const title = intl.formatMessage(messages['save']);
    return (
      <div className={styles['dropdown']}>
        <ButtonToolbar>

          <SplitButton className={className} disabled={disabled} onClick={onSave()} title={title} dropup pullRight id={'product-form'}>

            <MenuItem onClick={onSave(false)} eventKey={'1'}>{intl.formatMessage(messages['saveAndNew'])}</MenuItem>

          </SplitButton>

        </ButtonToolbar>
      </div>
    );
  }
}
