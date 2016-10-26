import React, {Component, PropTypes} from 'react';
import Relay from 'react-relay';

import {bindActionCreators} from 'redux';
import {reduxForm} from 'redux-form';

import findIndex from 'lodash.findindex';

import LoadingActions from '../../Loading/actions';

import { setBeforeUnloadMessage, unsetBeforeUnloadMessage, } from '../../../utils/unbeforeunload';

const CODES = [
  '5.1.4.1', // Banque
  '5.1.6.1.1', // Caisse centrale
  '5.1.4.3', // Trésorerie Générale
];

import filter from 'lodash.filter';

import Actions from '../../confirm/actions';

import messages from './messages';

import getFieldValue from '../../utils/getFieldValue';

import Combobox from 'react-widgets/lib/Combobox';

import { createValidator, required, } from '../../../utils/validation';

import * as companyActions from '../../../redux/modules/companies';

import UpdateCompanyPaymentsSettingsMutation from '../../../mutations/UpdateCompanyPaymentsSettingsMutation';

import classnames from 'classnames';

import styles from '../AppSettings.scss';

import CSSModules from 'react-css-modules';

import {Table, Column, Cell,} from '../../../../fixed-data-table';

import {intlShape,} from 'react-intl';

const listOfPreferredPaymentMethods = [ 1, 2, 3, ];
const preferredPaymentMethodsByIndex = { 1: 'Cash', 2:'Check', 3:'Creditcard', };
const preferredPaymentMethodsById = { Cash: 1, Check: 2, Creditcard: 3, };

@CSSModules(styles, {allowMultiple: true})
export default class extends React.Component {

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

    const rowsCount = 1;

    let tableHeight = 0;

    tableHeight += selected === 0 ? 225 : 180;

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
            case 0 : return self.state.selected === 0 ? 200 : 170;
          }
          return 170;
        }}
        rowsCount={1}
        height={tableHeight + 1}
        width={tableWidth}
        headerHeight={0}
        footerHeight={0}>

        <Column
          columnKey={'key'}
          align={'center'}
          width={tableWidth}
          cell={({rowIndex, ...props}) => {
              const {View, Form} = PAYMENTS_SETTINGS_COMPANY_COMPONENTS[rowIndex];
              return (
                 <Cell {...props}>
                    <div className=''>
                      {rowIndex === self.state.selected
                        ? <Form setForm={self._setFormRef} root={self.props.root} viewer={self.props.viewer} company={self.props.company} onCancel={self._setActiveRow.bind(self, -1)}/>
                        : <View root={self.props.root} company={self.props.company}/>}
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

const PaymentsFormSettings = function () {

  function getAccountByCode(list, code){
    const index = findIndex(list, ({code: id}) => id === code);
    return list[index];
  }

  @CSSModules(styles, {allowMultiple: true})
  class View extends React.Component {

    static propTypes = {
      company: PropTypes.object.isRequired,
      root: PropTypes.objectOf(PropTypes.shape({
          paymentsAccounts: PropTypes.arrayOf(PropTypes.shape({
            code: PropTypes.string.isRequired,
            name: PropTypes.string.isRequired,
            _categoryCode: PropTypes.string.isRequired,
            _classCode: PropTypes.string.isRequired,
            _groupCode: PropTypes.string.isRequired,
          })).isRequired,

        }).isRequired,

      ).isRequired,

    };

    static contextTypes = {
      intl: intlShape.isRequired,
    };

    render() {
      const { root: { paymentsAccounts, }, } = this.props;
      const {intl, } = this.context;
      return (
        <div>
          <div styleName='tableRow'>

            <div styleName='tableCell subsection14TitleText settingName'>{intl.formatMessage(messages['PaymentsFormSettingsTitle'])}</div>

            <div styleName='tableCell settingContent'>

              <div style={{padding: '0 45px'}}>

                <div>

                  <div onSubmit={e => {e.preventDefault();}}>

                    <div className='form-group row'>

                      <label htmlFor='preferredPaymentMethod' styleName='alignRight' className='col-sm-5 form-control-label'>{intl.formatMessage(messages['PreferredPaymentMethod'])}</label>

                      <div className='col-sm-7' id={'preferredPaymentMethod'}>

                        <p className='form-control-static' styleName='labelText'>{intl.formatMessage(messages[`preferredPaymentMethod_${this.props.company.paymentsSettings.preferredPaymentMethod}`])}</p>

                      </div>

                    </div>

                    <div className='form-group row'>

                      <label htmlFor='account' styleName='alignRight' className='col-sm-5 form-control-label'>{intl.formatMessage(messages['PaymentsAccountLabel'])}</label>

                      <div className='col-sm-7' id={'account'} style={{textAlign: 'left',}}>

                        <p className='form-control-static' styleName='labelText'>{getAccountByCode(paymentsAccounts, this.props.company.paymentsSettings.defaultDepositToAccountCode).name}</p>

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
    preferredPaymentMethod: [required],
    account: [required],
  });

  @reduxForm({
      form: 'company',
      validate: validation,
      fields: [
        'id',
        'preferredPaymentMethod',
        'account',
      ],
    }, (state, ownProps) => ({
      saveError: state.companies.saveError,
      initialValues: {
        id: ownProps.company.id,
        preferredPaymentMethod: ownProps.company.paymentsSettings.preferredPaymentMethod,
        account: ownProps.company.paymentsSettings.defaultDepositToAccountCode,
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
          paymentsAccounts: PropTypes.arrayOf(PropTypes.shape({
            code: PropTypes.string.isRequired,
            name: PropTypes.string.isRequired,
            _categoryCode: PropTypes.string.isRequired,
            _classCode: PropTypes.string.isRequired,
            _groupCode: PropTypes.string.isRequired,
          })).isRequired,
        }).isRequired,
      ).isRequired,
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
          preferredPaymentMethod,
          account,
        },
        handleSubmit,
        valid,
        invalid,
        pristine,
        updatePaymentsSettings: update,
        submitting,
        saveError: {[formKey]: saveError},
        values,

        root: { paymentsAccounts, },

        onCancel,
      } = this.props;

      function normalizeServerData(key, data){
        return data[key];
      }

      const doUpdate = handleSubmit((data) => {
        LoadingActions.show();
        return  update({id: this.props.company.id, fieldInfos: Object.keys(data).filter(key => key !== 'id').map(key => ({fieldName: key === 'account' ? 'defaultDepositToAccountCode' : key, value: normalizeServerData(key, data), })), viewer: this.props.viewer, root: this.props.root, company: this.props.company, })
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

            <div styleName='tableCell subsection14TitleText settingName'>{intl.formatMessage(messages['PaymentsFormSettingsTitle'])}</div>

            <div styleName='tableCell settingContent'>

              <div style={{padding: '0 45px'}}>

                <div>

                  <div onSubmit={doUpdate}>

                  <div className='form-group row'>

                    <label htmlFor='preferredPaymentMethod' styleName='alignRight' className='col-sm-5 form-control-label'>{intl.formatMessage(messages['PreferredPaymentMethod'])}</label>

                    <div className='col-sm-7' id={'preferredPaymentMethod'} style={{textAlign: 'left',}}>

                      <Combobox
                        autoFocus
                        caseSensitive={false}
                        filter={'contains'}
                        data={listOfPreferredPaymentMethods.map((f, index) => ({
                          id: f,
                          name: intl.formatMessage(messages[`preferredPaymentMethod_${f}`]),
                        }))}
                        value={preferredPaymentMethodsById[getFieldValue(preferredPaymentMethod)]}
                        onChange={value => {
                          if(!value || typeof value === 'string'){
                            preferredPaymentMethod.onChange(undefined);
                            return;
                          }
                          preferredPaymentMethod.onChange(preferredPaymentMethodsByIndex[value.id]);
                        }}
                        textField='name'
                        valueField='id'
                        disabled={submitting}
                        className={classnames('no-new', {'has-error': !pristine && preferredPaymentMethod.invalid})}
                        // groupBy={ person => person.name.length }
                        // groupComponent={GroupByLength}
                        // itemComponent={GroupByLength}
                      />

                    </div>

                  </div>

                  <div className='form-group row'>

                    <label htmlFor='account' styleName='alignRight' className='col-sm-5 form-control-label'>{intl.formatMessage(messages['PaymentsAccountLabel'])}</label>

                    <div className='col-sm-7' id={'account'} style={{textAlign: 'left',}}>

                      <Combobox
                        autoFocus
                        caseSensitive={false}
                        filter={'contains'}
                        data={filter(paymentsAccounts, ({code}) => CODES.indexOf(code) !== -1)}
                        // value={getAccountByCode(paymentsAccounts, getFieldValue(account))}
                        value={getFieldValue(account)}
                        onChange={value => {
                          if(!value || typeof value === 'string'){
                            account.onChange(undefined);
                            return;
                          }
                          account.onChange(value.code);
                        }}
                        textField='name'
                        valueField='code'
                        disabled={submitting}
                        className={classnames('no-new', {'has-error': !pristine && account.invalid})}
                        // groupBy={ person => person.name.length }
                        // groupComponent={GroupByLength}
                        // itemComponent={GroupByLength}
                      />

                    </div>

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

export const PAYMENTS_SETTINGS_COMPANY_COMPONENTS = [
  PaymentsFormSettings,
];

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

            ${UpdateCompanyPaymentsSettingsMutation.getFragment('company')},

            id,
            displayName,
            periodType,
            lastTransactionIndex, lastPaymentsTransactionIndex,
            legalForm,
            address,
            capital,
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

            expensesSettings{
              defaultExpenseAccountCode,
              preferredPaymentMethod,
            },

            paymentsSettings{
              defaultDepositToAccountCode,
              preferredPaymentMethod,
            },

          }

        `,

    }
  })
}
