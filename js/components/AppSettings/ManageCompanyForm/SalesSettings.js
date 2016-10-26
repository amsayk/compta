import React, {Component, PropTypes} from 'react';
import Relay from 'react-relay';

import {bindActionCreators} from 'redux';
import {reduxForm} from 'redux-form';

import pick from 'lodash.pick';

import messages from './messages';

import LoadingActions from '../../Loading/actions';

import findIndex from 'lodash.findindex';

import { setBeforeUnloadMessage, unsetBeforeUnloadMessage, } from '../../../utils/unbeforeunload';

import Actions from '../../confirm/actions';

import getFieldValue from '../../utils/getFieldValue';

import BooleanOption from './BooleanOption';

import Combobox from 'react-widgets/lib/Combobox';

import { createValidator, required, } from '../../../utils/validation';

import * as companyActions from '../../../redux/modules/companies';

import UpdateCompanySalesSettingsMutation from '../../../mutations/UpdateCompanySalesSettingsMutation';

import classnames from 'classnames';

import styles from '../AppSettings.scss';

import CSSModules from 'react-css-modules';

import {intlShape,} from 'react-intl';

import {Table, Column, Cell,} from '../../../../fixed-data-table';

const listOfPreferredSalesTerms = [ 1, 2, 3, 4/*, 5*/, ];
const preferredSalesTermsByIndex = { 1: 'OnReception', 2:'Net_15', 3:'Net_30', 4:'Net_60'/*, 5: 'Custom'*/, };
const preferredSalesTermsById = { OnReception: 1, Net_15: 2, Net_30: 3, Net_60: 4/*, Custom: 5*/, };

@CSSModules(styles, {allowMultiple: true})
export default class extends React.Component {

  static propTypes = {
    bodyWidth: PropTypes.number.isRequired,

    root: PropTypes.objectOf(PropTypes.shape({
        salesAccounts: PropTypes.arrayOf(PropTypes.shape({
          code: PropTypes.string.isRequired,
          name: PropTypes.string.isRequired,
          _categoryCode: PropTypes.string.isRequired,
          _classCode: PropTypes.string.isRequired,
          _groupCode: PropTypes.string.isRequired,
        })).isRequired,
      }).isRequired
    ).isRequired,
  };

  state = {
    selected: -1,
  };

  _setFormRef = (ref) => {
    this._form = ref;
  }

  leave = (then) => {
    if(this._form){
      this._form.close(then);
    }else{
      then();
    }
  };

  render() {
    const self = this;
    const {styles,} = this.props;
    const {selected,} = this.state;

    const {intl,} = this.context;

    const rowsCount = 2;

    let tableHeight = 0;

    tableHeight += selected === 0 ? 270 : 270;
    tableHeight += selected === 1 ? 270 : 270;

    tableHeight += 2;

    const bodyWidth = this.props.bodyWidth;

    const tableWidth = bodyWidth - 1;

    return (
      <Table
        renderRow={(Component, rowIndex, {style, className}) => {
          return (
           <div>
              <Component style={{...style, zIndex: 0}} className={`${className} ${styles['table-row-container']}`}/>
            </div>
          );
        }}
        onRowClick={(e, rowIndex) => self._setActiveRow(rowIndex, e)}
        rowClassNameGetter={(rowIndex) => `${styles.row} ${rowIndex === 0 ? styles['first-row'] : ''} table-row`}
        rowHeight={170}
        rowHeightGetter={rowIndex => {
          switch (rowIndex){
            case 0 : return self.state.selected === 0 ? 270 : 270;
            case 1 : return self.state.selected === 1 ? 270 : 270;
          }
          return 170;
        }}
        rowsCount={rowsCount}
        height={tableHeight + 1}
        width={tableWidth}
        headerHeight={0}
        footerHeight={0}>

        <Column
          columnKey={'key'}
          align={'center'}
          width={tableWidth}
          cell={({rowIndex, ...props}) => {
              const {View, Form} = SALES_SETTINGS_COMPANY_COMPONENTS[rowIndex];
              return (
                 <Cell {...props}>
                    <div className=''>
                      {rowIndex === self.state.selected
                        ? <Form setForm={self._setFormRef} root={self.props.root} viewer={self.props.viewer} company={self.props.company} onCancel={self._setActiveRow.bind(self, -1)}/>
                        : <View salesAccounts={self.props.root.salesAccounts} company={self.props.company}/>}
                    </div>
                 </Cell>
               );
            }}
        />

      </Table>
    );
  }

  _setActiveRow = (rowIndex, e) => {
    if(e){
      e.preventDefault();
      e.stopPropagation();
    }

    if(rowIndex !== this.state.selected){
      const done = () => {
        this.setState({
          selected: rowIndex,
        });
      };

      if(this._form && rowIndex !== -1){
        this._form.close(done);
      }else{
        done();
      }
    }
  };
}

const SalesForm = function () {

  @CSSModules(styles, {allowMultiple: true})
  class View extends React.Component {

    static propTypes = {
      company: PropTypes.object.isRequired,
    };

    static contextTypes = {
      intl: intlShape.isRequired,
    };

    render() {
      const {intl, } = this.context;
      return (
        <div>
          <div styleName='tableRow'>

            <div styleName='tableCell subsection14TitleText settingName'>{intl.formatMessage(messages['SalesFormTitle'])}</div>

            <div styleName='tableCell settingContent'>

              <div style={{padding: '0 45px'}}>

                <div>

                  <div onSubmit={e => {e.preventDefault();}}>

                    <div className='form-group row'>

                      <label htmlFor='preferredInvoiceTerms' styleName='alignRight' className='col-sm-8 form-control-label'>{intl.formatMessage(messages['PreferredTerms'])}</label>

                      <div className='col-sm-4' id={'preferredInvoiceTerms'}>

                        <p className='form-control-static' styleName='labelText'>{intl.formatMessage(messages[`preferredInvoiceTerms_${this.props.company.salesSettings.preferredInvoiceTerms}`])}</p>

                      </div>

                    </div>

                    {/*<div className='form-group row'>

                      <label htmlFor='enableCustomTransactionNumbers' styleName='alignRight' className='col-sm-8 form-control-label'>{intl.formatMessage(messages['EnableCustomTransactionNumbers'])}</label>

                      <div className='col-sm-4'>
                        <p className='form-control-static' styleName='labelText'>{this.props.company.salesSettings.enableCustomTransactionNumbers ? 'Oui' : 'Non'}</p>
                      </div>

                    </div>*/}

                    <div className='form-group row'>

                      <label htmlFor='enableServiceDate' styleName='alignRight' className='col-sm-8 form-control-label'>{intl.formatMessage(messages['EnableServiceDate'])}</label>

                      <div className='col-sm-4' styleName='labelText'>
                        <p className='form-control-static'>{this.props.company.salesSettings.enableServiceDate ? 'Oui' : 'Non'}</p>
                      </div>

                    </div>

                    <div className='form-group row'>

                      <label htmlFor='enableDiscount' styleName='alignRight' className='col-sm-8 form-control-label'>{intl.formatMessage(messages['EnableDiscount'])}</label>

                      <div className='col-sm-4'>
                        <p className='form-control-static' styleName='labelText'>{this.props.company.salesSettings.discountEnabled ? 'Oui' : 'Non'}</p>
                      </div>

                    </div>

                  </div>

                </div>

              </div>

            </div>

            <div styleName='tableCell editSetting'>
              <i className='material-icons'>edit</i>
            </div>

          </div>
        </div>
      );
    }
  }

  const validation = createValidator({
    preferredInvoiceTerms: [required],
  });

  @reduxForm({
      form: 'company',
      validate: validation,
      fields: [
        'id',
        'preferredInvoiceTerms',
        'enableCustomTransactionNumbers',
        'enableServiceDate',
        'enableDiscount',
      ],
    }, (state, ownProps) => ({
      saveError: state.companies.saveError,
      initialValues: {
        id: ownProps.company.id,
        preferredInvoiceTerms: ownProps.company.salesSettings.preferredInvoiceTerms,
        enableCustomTransactionNumbers: ownProps.company.salesSettings.enableCustomTransactionNumbers,
        enableServiceDate: ownProps.company.salesSettings.enableServiceDate,
        enableDiscount: ownProps.company.salesSettings.discountEnabled,
      },
    }),
    dispatch => bindActionCreators(companyActions, dispatch))
  @CSSModules(styles, {allowMultiple: true})
  class Form extends React.Component {

    constructor(props, context){
      super(props, context);

      this.props.editStart(this.props.company.id);
    }

    static propTypes = {
      company: PropTypes.object.isRequired,
      viewer: PropTypes.object.isRequired,
    };

    static contextTypes = {
      intl: intlShape.isRequired,
      store: PropTypes.object.isRequired,
    };

    componentDidMount(){
      this.props.setForm(this);
    }

    componentWillUnmount() {
      this.props.setForm(undefined);
      unsetBeforeUnloadMessage();
    }

    componentDidUpdate(){
      const { intl, } = this.context;

      const {
        dirty,
      } = this.props;

      if(dirty){
        setBeforeUnloadMessage(
          intl.formatMessage(messages['Confirm'])
        );
      }
    }

    close = (then) => {
      const {intl,} = this.context;
      const {
        dirty,
      } = this.props;

      if(dirty){
        Actions.show(intl.formatMessage(messages['Confirm']))
          .then(() => {
            this.props.editStop(this.props.company.id);
            then();
          })
          .catch(() => {});
      }else{
        then();
      }
    };

    _handleClose = (e) => {
      this.props.onCancel(e);
    };

    _handleCancel = (e) => {
      const {intl,} = this.context;
      const {
        dirty,
      } = this.props;

      if(dirty){
        Actions.show(intl.formatMessage(messages['Confirm']))
          .then(() => {
            this.props.editStop(this.props.company.id);
            this.props.onCancel(e);
          })
          .catch(() => {});
      }else{
        this.props.onCancel(e);
      }
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
          preferredInvoiceTerms,
          enableCustomTransactionNumbers,
          enableServiceDate,
          enableDiscount,
        },
        handleSubmit,
        valid,
        invalid,
        pristine,
        updateSalesSettings : update,
        submitting,
        saveError: {[formKey]: saveError},
        values,

        onCancel,
      } = this.props;

      function normalizeServerData(key, data){
        switch (key) {
          case 'preferredInvoiceTerms': return {fieldName: 'preferredInvoiceTerms', value: data[key]};
          case 'enableCustomTransactionNumbers': return {fieldName: 'enableCustomTransactionNumbers', value: data[key]};
          case 'enableServiceDate':  return {fieldName: 'enableServiceDate', value: data[key]};
          case 'enableDiscount': return {fieldName: 'discountEnabled', value: data[key]};
        }
      }

      const doUpdate = handleSubmit((data) => {
        LoadingActions.show();
        return  update({id: this.props.company.id, fieldInfos: Object.keys(data).filter(key => key !== 'id').map(key => normalizeServerData(key, data)), viewer: this.props.viewer, root: this.props.root, company: this.props.company, })
          .then(result => {
            LoadingActions.hide();

            const handleResponse = (result) => {
              if (result && typeof result.error === 'object') {
                return Promise.reject(); // { defaultMessage: messages['error'].defaultMessage, _id: messages['error'].id, }
              }

              setImmediate(() => {
                this._handleClose();
              });
              return Promise.resolve();
            };

            return handleResponse(result);
          });
      });

      return (
        <div>
          <div styleName='tableRow'>

            <div styleName='tableCell subsection14TitleText settingName'>{intl.formatMessage(messages['SalesFormTitle'])}</div>

            <div styleName='tableCell settingContent'>

              <div style={{padding: '0 45px'}}>

                <div>

                  <div onSubmit={doUpdate}>

                    <div className='form-group row'>

                      <label htmlFor='preferredInvoiceTerms' styleName='alignRight' className='col-sm-8 form-control-label'>{intl.formatMessage(messages['PreferredTerms'])}</label>

                      <div className='col-sm-4' id={'preferredInvoiceTerms'} style={{textAlign: 'left',}}>

                        <Combobox
                          autoFocus
                          caseSensitive={false}
                          filter={'contains'}
                          data={listOfPreferredSalesTerms.map((f, index) => ({
                            id: f,
                            name: intl.formatMessage(messages[`preferredInvoiceTerms_${f}`]),
                          }))}
                          value={preferredSalesTermsById[getFieldValue(preferredInvoiceTerms)]}
                          onChange={value => {
                            if(!value || typeof value === 'string'){
                              preferredInvoiceTerms.onChange(undefined);
                              return;
                            }
                            preferredInvoiceTerms.onChange(preferredSalesTermsByIndex[value.id]);
                          }}
                          textField='name'
                          valueField='id'
                          disabled={submitting}
                          className={classnames('no-new', {'has-error': !pristine && preferredInvoiceTerms.invalid})}
                          // groupBy={ person => person.name.length }
                          // groupComponent={GroupByLength}
                          // itemComponent={GroupByLength}
                        />

                      </div>

                    </div>

                    {/*<div className='form-group row'>

                      <div className='col-sm-8'>

                        <BooleanOption
                          disabled={submitting}
                          labelText={intl.formatMessage(messages['EnableCustomTransactionNumbers'])}
                          id='enableCustomTransactionNumbers'
                          value={getFieldValue(enableCustomTransactionNumbers)}
                          onChange={enableCustomTransactionNumbers.onChange}
                        />

                      </div>

                      <div className='col-sm-4' style={{ textAlign: 'left', }} styleName={'labelText'}>{getFieldValue(enableCustomTransactionNumbers) ? 'Oui' : 'Non'}</div>

                    </div>*/}

                    <div className='form-group row'>

                      <div className='col-sm-8'>

                        <BooleanOption
                          disabled={submitting}
                          labelText={intl.formatMessage(messages['EnableServiceDate'])}
                          id='enableServiceDate'
                          value={getFieldValue(enableServiceDate)}
                          onChange={enableServiceDate.onChange}
                        />

                      </div>

                      <div className='col-sm-4' style={{ textAlign: 'left', }} styleName={'labelText'}>{getFieldValue(enableServiceDate) ? 'Oui' : 'Non'}</div>

                    </div>

                    <div className='form-group row'>

                    <div className='col-sm-8'>

                      <BooleanOption
                        disabled={submitting}
                        labelText={intl.formatMessage(messages['EnableDiscount'])}
                        id='enableDiscount'
                        value={getFieldValue(enableDiscount)}
                        onChange={enableDiscount.onChange}
                      />

                    </div>

                    <div className='col-sm-4' style={{ textAlign: 'left', }} styleName={'labelText'}>{getFieldValue(enableDiscount) ? 'Oui' : 'Non'}</div>

                    </div>

                  </div>

                  {saveError && <div styleName='error'>{intl.formatMessage({ ...saveError, id: saveError._id, })}</div>}

                </div>

                <div style={{textAlign: 'left', marginTop: 30}} className='row'>

                  <div className='col-sm-1'></div>

                  <div className='col-sm-11'>

                    <button
                      styleName='button'
                      onClick={e => {e.stopPropagation(); e.preventDefault(); this._handleCancel(e); }}
                      disabled={submitting}
                      className='btn btn-primary-outline unselectable'>{intl.formatMessage(messages['cancel'])}
                    </button>

                    <button
                      style={{marginLeft: 10}}
                      styleName='button'
                      onClick={doUpdate}
                      disabled={pristine || invalid || submitting}
                      className={'btn btn-primary unselectable' + (!pristine && valid ? ' green' : '')}>
                      {' '}{intl.formatMessage(messages['save'])}
                    </button>

                  </div>

                </div>

              </div>

            </div>

            <div styleName='tableCell editSetting'>
            </div>

          </div>
        </div>
      );
    }
  }

  return {
    Form: wrap(Form),
    View: wrap(View),
  };
}();

function wrap(Component) {
  return Relay.createContainer(Component, {
    fragments: {
      company: () => Relay.QL`

          fragment on Company{

            company_streetAddress,
            company_cityTown,
            company_stateProvince,
            company_postalCode,
            company_country,            

            ${UpdateCompanySalesSettingsMutation.getFragment('company')},

            id,
            displayName,
            periodType,
            lastTransactionIndex, lastPaymentsTransactionIndex,
            legalForm,
            address,
            activity,
            webSite,
            tel,
            fax,
            email,
            if,
            rc,
            patente,
            cnss,
            banque,
            rib,
            salesSettings{
              defaultDepositToAccountCode,
              preferredInvoiceTerms,
              enableCustomTransactionNumbers,
              enableServiceDate,
              discountEnabled,

              showProducts,
              showRates,
              trackInventory,
              defaultIncomeAccountCode,
            },
          }

        `,

    }
  })
}

const ProductsSettings = function () {

  function getAccountByCode(list, code){
    const index = findIndex(list, ({code: id}) => id === code);
    return list[index];
  }

  @CSSModules(styles, {allowMultiple: true})
  class View extends React.Component {

    static propTypes = {
      company: PropTypes.object.isRequired,

      salesAccounts: PropTypes.arrayOf(PropTypes.shape({
        code: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        _categoryCode: PropTypes.string.isRequired,
        _classCode: PropTypes.string.isRequired,
        _groupCode: PropTypes.string.isRequired,
      })).isRequired,
    };

    static contextTypes = {
      intl: intlShape.isRequired,
    };

    render() {
      const { salesAccounts, } = this.props;
      const {intl, } = this.context;
      return (
        <div>
          <div styleName='tableRow'>

            <div styleName='tableCell subsection14TitleText settingName'>{intl.formatMessage(messages['ProductsSettingsTitle'])}</div>

            <div styleName='tableCell settingContent'>

              <div style={{padding: '0 45px'}}>

                <div>

                  <div onSubmit={e => {e.preventDefault();}}>

                    <div className='form-group row'>

                      <label htmlFor='showProducts' styleName='alignRight' className='col-sm-8 form-control-label'>{intl.formatMessage(messages['ShowProducts'])}</label>

                      <div className='col-sm-4'>
                        <p className='form-control-static' styleName='labelText'>{this.props.company.salesSettings.showProducts ? 'Oui' : 'Non'}</p>
                      </div>

                    </div>

                    <div className='form-group row'>

                      <label htmlFor='showRates' styleName='alignRight' className='col-sm-8 form-control-label'>{intl.formatMessage(messages['ShowRates'])}</label>

                      <div className='col-sm-4' styleName='labelText'>
                        <p className='form-control-static'>{this.props.company.salesSettings.showRates ? 'Oui' : 'Non'}</p>
                      </div>

                    </div>

                    {/*<div className='form-group row'>

                      <label htmlFor='trackInventory' styleName='alignRight' className='col-sm-8 form-control-label'>{intl.formatMessage(messages['TrackInventory'])}</label>

                      <div className='col-sm-4'>
                        <p className='form-control-static' styleName='labelText'>{this.props.company.salesSettings.trackInventory ? 'Oui' : 'Non'}</p>
                      </div>

                    </div>*/}

                    {/*<div className='form-group row'>

                      <label htmlFor='defaultIncomeAccountCode' styleName='alignRight' className='col-sm-8 form-control-label'>{intl.formatMessage(messages['DefaultIncomeAccountCode'])}</label>

                      <div className='col-sm-4'>
                        <p className='form-control-static' styleName='labelText'>
                          {getAccountByCode(salesAccounts, this.props.company.salesSettings.defaultIncomeAccountCode).name}
                        </p>
                      </div>

                    </div>*/}

                  </div>

                </div>

              </div>

            </div>

            <div styleName='tableCell editSetting'>
              <i className='material-icons'>edit</i>
            </div>

          </div>
        </div>
      );
    }
  }

  const validation = createValidator({
    // preferredInvoiceTerms: [required],
    // defaultIncomeAccountCode: [required],
  });

  @reduxForm({
      form: 'company',
      validate: validation,
      fields: [
        'id',
        'showProducts',
        'showRates',
        // 'trackInventory',
        // 'defaultIncomeAccountCode',
      ],
    }, (state, ownProps) => ({
      saveError: state.companies.saveError,
      initialValues: {
        id: ownProps.company.id,
        showProducts: ownProps.company.salesSettings.showProducts,
        showRates: ownProps.company.salesSettings.showRates,
        // trackInventory: ownProps.company.salesSettings.trackInventory,
        // defaultIncomeAccountCode: ownProps.company.salesSettings.defaultIncomeAccountCode,
      },
    }),
    dispatch => bindActionCreators(companyActions, dispatch))
  @CSSModules(styles, {allowMultiple: true})
  class Form extends React.Component {

    constructor(props, context){
      super(props, context);

      this.props.editStart(this.props.company.id);
    }

    static propTypes = {
      company: PropTypes.object.isRequired,
      viewer: PropTypes.object.isRequired,

      root: PropTypes.objectOf(PropTypes.shape({
        salesAccounts: PropTypes.arrayOf(PropTypes.shape({
          code: PropTypes.string.isRequired,
          name: PropTypes.string.isRequired,
          _categoryCode: PropTypes.string.isRequired,
          _classCode: PropTypes.string.isRequired,
          _groupCode: PropTypes.string.isRequired,
        })).isRequired,
      })).isRequired,
    };

    static contextTypes = {
      intl: intlShape.isRequired,
      store: PropTypes.object.isRequired,
    };

    componentDidMount(){
      this.props.setForm(this);
    }

    componentWillUnmount() {
      this.props.setForm(undefined);
      unsetBeforeUnloadMessage();
    }

    componentDidUpdate(){
      const { intl, } = this.context;

      const {
        dirty,
      } = this.props;

      if(dirty){
        setBeforeUnloadMessage(
          intl.formatMessage(messages['Confirm'])
        );
      }
    }

    close = (then) => {
      const {intl,} = this.context;
      const {
        dirty,
      } = this.props;

      if(dirty){
        Actions.show(intl.formatMessage(messages['Confirm']))
          .then(() => {
            this.props.editStop(this.props.company.id);
            then();
          })
          .catch(() => {});
      }else{
        then();
      }
    };

    _handleClose = (e) => {
      this.props.onCancel(e);
    };

    _handleCancel = (e) => {
      const {intl,} = this.context;
      const {
        dirty,
      } = this.props;

      if(dirty){
        Actions.show(intl.formatMessage(messages['Confirm']))
          .then(() => {
            this.props.editStop(this.props.company.id);
            this.props.onCancel(e);
          })
          .catch(() => {});
      }else{
        this.props.onCancel(e);
      }
    };

    render() {
      const { root: { salesAccounts, }, } = this.props;
      const {intl, store, } = this.context;

      const {
        asyncValidating,
        dirty,
        formKey,
        editStop,
        fields: {
          id,
          showProducts,
          showRates,
          // trackInventory,
          // defaultIncomeAccountCode,
        },
        handleSubmit,
        valid,
        invalid,
        pristine,
        updateSalesSettings : update,
        submitting,
        saveError: {[formKey]: saveError},
        values,

        onCancel,
      } = this.props;

      function normalizeServerData(key, data){
        return data[key];
      }

      const doUpdate = handleSubmit((data) => {
        LoadingActions.show();
        return  update({id: this.props.company.id, fieldInfos: Object.keys(data).filter(key => key !== 'id').map(key => ({fieldName: key, value: normalizeServerData(key, data), })), viewer: this.props.viewer, root: this.props.root, company: this.props.company, })
          .then(result => {
            LoadingActions.hide();

            const handleResponse = (result) => {
              if (result && typeof result.error === 'object') {
                return Promise.reject(); // { defaultMessage: messages['error'].defaultMessage, _id: messages['error'].id, }
              }

              setImmediate(() => {
                this._handleClose();
              });
              return Promise.resolve();
            };

            return handleResponse(result);
          });
      });

      return (
        <div>
          <div styleName='tableRow'>

            <div styleName='tableCell subsection14TitleText settingName'>{intl.formatMessage(messages['ProductsSettingsTitle'])}</div>

            <div styleName='tableCell settingContent'>

              <div style={{padding: '0 45px'}}>

                <div>

                  <div onSubmit={doUpdate}>

                    <div className='form-group row'>

                      <div className='col-sm-8'>

                        <BooleanOption
                          disabled={submitting}
                          labelText={intl.formatMessage(messages['ShowProducts'])}
                          id='showProducts'
                          value={getFieldValue(showProducts)}
                          onChange={showProducts.onChange}
                        />

                      </div>

                      <div className='col-sm-4' style={{ textAlign: 'left', }} styleName={'labelText'}>{getFieldValue(showProducts) ? 'Oui' : 'Non'}</div>

                    </div>

                    <div className='form-group row' style={{ paddingTop: 10, }}>

                      <div className='col-sm-8'>

                        <BooleanOption
                          disabled={submitting}
                          labelText={intl.formatMessage(messages['ShowRates'])}
                          id='showRates'
                          value={getFieldValue(showRates)}
                          onChange={showRates.onChange}
                        />

                      </div>

                      <div className='col-sm-4' style={{ textAlign: 'left', }} styleName={'labelText'}>{getFieldValue(showRates) ? 'Oui' : 'Non'}</div>

                    </div>

                    {/*<div className='form-group row'>

                      <div className='col-sm-8'>

                        <BooleanOption
                          disabled={submitting}
                          labelText={intl.formatMessage(messages['TrackInventory'])}
                          id='trackInventory'
                          value={getFieldValue(trackInventory)}
                          onChange={trackInventory.onChange}
                        />

                      </div>

                      <div className='col-sm-4' style={{ textAlign: 'left', }} styleName={'labelText'}>{getFieldValue(trackInventory) ? 'Oui' : 'Non'}</div>

                    </div>*/}

                    {/*<div className='form-group row'>

                      <label htmlFor='defaultIncomeAccountCode' styleName='alignRight' className='col-sm-8 form-control-label'>{intl.formatMessage(messages['DefaultIncomeAccountCode'])}</label>

                      <div className='col-sm-4' id={'defaultIncomeAccountCode'} style={{textAlign: 'left',}}>

                        <Combobox
                          autoFocus
                          caseSensitive={false}
                          filter={'contains'}
                          data={salesAccounts}
                          value={getFieldValue(defaultIncomeAccountCode)}
                          onChange={value => {
                            if(!value || typeof value === 'string'){
                              defaultIncomeAccountCode.onChange(undefined);
                              return;
                            }
                            defaultIncomeAccountCode.onChange(
                              value[code]
                            );
                          }}
                          textField='name'
                          valueField='code'
                          disabled={submitting}
                          className={classnames('no-new', {'has-error': !pristine && defaultIncomeAccountCode.invalid})}
                          // groupBy={ person => person.name.length }
                          // groupComponent={GroupByLength}
                          // itemComponent={GroupByLength}
                        />

                      </div>

                    </div>*/}

                  </div>

                  {saveError && <div styleName='error'>{intl.formatMessage({ ...saveError, id: saveError._id, })}</div>}

                </div>

                <div style={{textAlign: 'left', marginTop: 30}} className='row'>

                  <div className='col-sm-1'></div>

                  <div className='col-sm-11'>

                    <button
                      styleName='button'
                      onClick={e => {e.stopPropagation(); e.preventDefault(); this._handleCancel(e); }}
                      disabled={submitting}
                      className='btn btn-primary-outline unselectable'>{intl.formatMessage(messages['cancel'])}
                    </button>

                    <button
                      style={{marginLeft: 10}}
                      styleName='button'
                      onClick={doUpdate}
                      disabled={pristine || invalid || submitting}
                      className={'btn btn-primary unselectable' + (!pristine && valid ? ' green' : '')}>
                      {' '}{intl.formatMessage(messages['save'])}
                    </button>

                  </div>

                </div>

              </div>

            </div>

            <div styleName='tableCell editSetting'>
            </div>

          </div>
        </div>
      );
    }
  }

  return {
    Form: wrap(Form),
    View: wrap(View),
  };
}();

export const SALES_SETTINGS_COMPANY_COMPONENTS = [
  SalesForm,
  ProductsSettings,
];
