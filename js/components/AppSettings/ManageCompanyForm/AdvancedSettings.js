import React, {Component, PropTypes} from 'react';
import Relay from 'react-relay';

import {bindActionCreators} from 'redux';
import {reduxForm} from 'redux-form';

import moment from 'moment';

import pick from 'lodash.pick';

import { setBeforeUnloadMessage, unsetBeforeUnloadMessage, } from '../../../utils/unbeforeunload';

import Actions from '../../confirm/actions';

import getFieldValue from '../../utils/getFieldValue';

import messages from './messages';

import BooleanOption from './BooleanOption';

import DateTimePicker from 'react-widgets/lib/DateTimePicker';

import { createValidator, required, oneOf, } from '../../../utils/validation';

import * as companyActions from '../../../redux/modules/companies';

import UpdateCompanySettingsMutation from '../../../mutations/UpdateCompanySettingsMutation';

import classnames from 'classnames';

import {intlShape,} from 'react-intl';

import styles from '../AppSettings.scss';

import CSSModules from 'react-css-modules';

import {Table, Column, Cell,} from '../../../../fixed-data-table';

const periodTypes = [ 'MONTHLY', 'TRIMESTERLY', ];

@CSSModules(styles, {allowMultiple: true})
export default class extends Component {

  static propTypes = {
    bodyWidth: PropTypes.number.isRequired,
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

    // const rowsCount = 2;
    const rowsCount = 0;

    let tableHeight = 0;

    tableHeight += selected === 0 ? 200 : 170;
    // tableHeight += selected === 1 ? 170 : 150;

    tableHeight += 2;

    const bodyWidth = this.props.bodyWidth;

    const tableWidth = bodyWidth - 1;

    return (
      <Table
        renderRow={(Component, rowIndex, {style, className}) => {
          return (
           <div>
            <Component style={{...style, zIndex: 1}} className={`${className} ${styles['table-row-container']}`}/>
          </div>
          );
        }}
        onRowClick={(e, rowIndex) => self._setActiveRow(rowIndex, e)}
        rowClassNameGetter={(rowIndex) => `${styles.row} ${rowIndex === 0 ? styles['first-row'] : ''} table-row`}
        rowHeight={170}
        rowHeightGetter={rowIndex => {
          switch (rowIndex){
            case 0 : return self.state.selected === 0 ? 200 : 170;
            case 1 : return self.state.selected === 1 ? 170 : 120;
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
              const {View, Form} = ADVANCED_SETTINGS_COMPANY_COMPONENTS[rowIndex];
              return (
                 <Cell {...props}>
                    <div className=''>
                      {rowIndex === self.state.selected
                        ? <Form setForm={self._setFormRef} root={self.props.root} viewer={self.props.viewer} company={self.props.company} onCancel={self._setActiveRow.bind(self, -1)}/>
                        : <View company={self.props.company}/>}
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

const ClosureForm = function () {

  @CSSModules(styles, {allowMultiple: true})
  class View extends Component {

    static propTypes = {
      company: PropTypes.object.isRequired,
    };

    static contextTypes = {
      intl: intlShape.isRequired,
    };

    render() {
      const {intl, } = this.context;
      const closureEnabled = this.props.company.settings.closureEnabled;
      const closureDate = this.props.company.settings.closureDate;
      return (
        <div>
          <div styleName='tableRow'>

            <div styleName='tableCell subsection14TitleText settingName'>{intl.formatMessage(messages['ClosureFormTitle'])}</div>

            <div styleName='tableCell settingContent'>

              <div style={{padding: '0 45px'}}>

                <div>

                  <form onSubmit={e => {e.preventDefault();}}>

                    <div className='form-group row'>

                      <label htmlFor='closureEnabled' styleName='alignRight' className='col-sm-5 form-control-label'>{intl.formatMessage(messages['EnableClosure'])}</label>

                      <div className='col-sm-7'>
                        <p className='form-control-static' styleName='labelText'>{this.props.company.settings.closureEnabled ? 'Oui' : 'Non'}</p>
                      </div>

                    </div>

                    {closureEnabled && <div className='form-group row'>

                      <label htmlFor='closureDate' styleName='alignRight' className='col-sm-5 form-control-label'>{intl.formatMessage(messages['ClosureDate'])}</label>

                      <div className='col-sm-7' id={'closureDate'} style={{textAlign: 'left'}}>

                        <p className='form-control-static' styleName='labelText'>{moment(this.props.company.settings.closureDate).format('ll')}</p>

                      </div>

                    </div>}

                  </form>

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
    // closureDate: [required],
  });

  @reduxForm({
      form: 'company',
      validate: validation,
      fields: [
        'id',
        'closureEnabled',
        'closureDate',
      ],
    }, (state, ownProps) => ({
      saveError: state.companies.saveError,
      initialValues: {
        id: ownProps.company.id,
        closureEnabled: ownProps.company.settings.closureEnabled,
        closureDate: ownProps.company.settings.closureDate,
      },
    }),
    dispatch => bindActionCreators(companyActions, dispatch))
  @CSSModules(styles, {allowMultiple: true})
  class Form extends Component {

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
          closureEnabled,
          closureDate,
        },
        handleSubmit,
        valid,
        invalid,
        pristine,
        updateSettings : update,
        submitting,
        saveError: {[formKey]: saveError},
        values,

        onCancel,
      } = this.props;

      const closureEnabledValue = getFieldValue(closureEnabled);
      const closureDateValue = getFieldValue(closureDate);

      function normalizeMomentForSaving(d){
        const now = moment();
        return moment(d)
          .seconds(now.seconds())
          .minutes(now.minutes())
          .hour(now.hour())
          .toDate()
          .toISOString();
      }

      function normalizeServerData(key, data){
        switch (key) {
          case 'closureDate':
            return data['closureEnabled'] ? normalizeMomentForSaving(data[key]) : undefined;
          default:
            return data[key];
        }
      }

      const closureDateIsInvalid = !pristine && function(){ return closureEnabledValue && ! closureDateValue; }();

      const doUpdate = handleSubmit((data) => {
        const closureDateIsInvalid = function(){ return data['closureEnabled'] ? (!data['closureDate'] || !moment(data['closureDate']).isValid()) : false; }();

        if(closureDateIsInvalid){
          return Promise.reject({});
        }

        return  update({id: this.props.company.id, fieldInfos: Object.keys(data).filter(key => key !== 'id').map(key => ({fieldName: key, value: normalizeServerData(key, data), })), viewer: this.props.viewer, root: this.props.root, company: this.props.company, })
          .then(result => {

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
        <div style={{zIndex: 2,}}>
          <div styleName='tableRow'>

            <div styleName='tableCell subsection14TitleText settingName'>{intl.formatMessage(messages['ClosureFormTitle'])}</div>

            <div styleName='tableCell settingContent'>

              <div style={{padding: '0 45px'}}>

                <div>

                  <form onSubmit={doUpdate}>

                    <div className='form-group row'>

                      <div className="col-sm-5">

                        <BooleanOption
                          autoFocus
                          disabled={submitting}
                          labelText={intl.formatMessage(messages['EnableClosure'])}
                          id='closureEnabled'
                          value={closureEnabledValue}
                          onChange={closureEnabled.onChange}
                        />

                      </div>

                      <div className="col-sm-7" style={{ textAlign: 'left', }} styleName={'labelText'}>{closureEnabledValue ? 'Oui' : 'Non'}</div>

                    </div>

                    {closureEnabledValue && <div className={classnames('form-group row', { 'has-danger': closureDateIsInvalid, })}>

                      <label htmlFor='closureDate' styleName='alignRight' className='col-sm-5 form-control-label'>{intl.formatMessage(messages['ClosureDate'])}</label>

                      <div className='col-sm-5' id={'closureDate'} style={{textAlign: 'left',}}>

                        <DateTimePicker
                          // open={true}
                          // onToggle={e => {}}
                          value={closureDateValue ? moment(closureDateValue).toDate() : null}
                          onChange={value => {
                            closureDate.onChange(value);
                          }}
                          disabled={submitting}
                          min={moment().toDate()}
                          // max={???}
                          className={classnames({ 'has-error' : closureDateIsInvalid, })}
                          time={false}
                        />

                      </div>

                      <div className='col-sm-2'></div>

                    </div>}

                  </form>

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
                      disabled={pristine || invalid || closureDateIsInvalid || submitting}
                      className={'btn btn-primary unselectable' + (!pristine && valid && !closureDateIsInvalid ? ' green' : '')}>
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


const PeriodForm = function () {

  @CSSModules(styles, {allowMultiple: true})
  class View extends Component {

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

            <div styleName='tableCell subsection14TitleText settingName'>{intl.formatMessage(messages['Period'])}</div>

            <div styleName='tableCell settingContent'>

              <div style={{padding: '0 45px'}}>

                <div>

                  <form onSubmit={e => {e.preventDefault();}}>

                    <div className='form-group row'>

                      <div className='col-sm-10 form-inline' style={{textAlign: 'left'}}>

                        <div className='radio'>

                          <label>
                            {intl.formatMessage(messages[this.props.company.periodType])}
                          </label>

                        </div>

                      </div>

                    </div>

                  </form>

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

  const companyValidation = createValidator({
    periodType: [required, oneOf(periodTypes)],
  });

  @reduxForm({
      form: 'company',
      validate: companyValidation,
      fields: [
        'id',
        'periodType',
      ],
    }, (state, ownProps) => ({
      saveError: state.companies.saveError,
      initialValues: pick(ownProps.company, [ 'id', 'periodType', ]), // Pass company on edit
    }),
    dispatch => bindActionCreators(companyActions, dispatch))
  @CSSModules(styles, {allowMultiple: true})
  class Form extends Component {

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
          periodType,
        },
        handleSubmit,
        valid,
        invalid,
        pristine,
        updateSettings : update,
        submitting,
        saveError: {[formKey]: saveError},
        values,

        onCancel,
      } = this.props;

      const doUpdate = handleSubmit((data) => {
        return  update({id: this.props.company.id, fieldInfos: Object.keys(data).filter(key => key !== 'id').map(key => ({fieldName: key, value: data[key]})), viewer: this.props.viewer, root: this.props.root, company: this.props.company, })
          .then(result => {

            const handleResponse = (result) => {
              if (result && typeof result.error === 'object') {
                return Promise.reject(); // { defaultMessage: messages['error'].defaultMessage, _id: messages['error'].id, }
              }

              this._handleClose();
              return Promise.resolve();
            };

            return handleResponse(result);
          });
      });
      return (
        <div>
          <div styleName='tableRow'>

            <div styleName='tableCell subsection14TitleText settingName'>{intl.formatMessage(messages['Period'])}</div>

            <div styleName='tableCell settingContent'>

              <div style={{padding: '0 45px'}}>

                <div>

                  <form onSubmit={doUpdate}>

                    <div className='form-group row'>

                      <div className='col-sm-10 form-inline' style={{textAlign: 'left'}}>

                        {periodTypes.map((p, index) => {

                          return (
                            <div key={p} onClick={e => {e.stopPropagation(); periodType.onChange({target:{value: p}})}} className='radio' style={{marginLeft: index > 0 ? 15 : 0}}>

                              <label>
                                <input disabled={submitting} type='radio' name={'periodType'} value={p} onChange={e => {e.stopPropagation(); periodType.onChange(e);}} checked={periodType.value === p} />
                                <span style={{paddingLeft: 7}}>{intl.formatMessage(messages[p])}</span>
                              </label>

                            </div>
                          );
                        })}

                      </div>

                    </div>

                  </form>

                </div>

                <div style={{textAlign: 'left', marginTop: 30}} className='row'>

                  <div className='col-sm-12'>

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


export const ADVANCED_SETTINGS_COMPANY_COMPONENTS = [
  ClosureForm,
  PeriodForm,
];


function wrap(Component) {
  return Relay.createContainer(Component, {
    fragments: {
      company: () => Relay.QL`

          fragment on Company{

            ${UpdateCompanySettingsMutation.getFragment('company')},

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
            settings{
              periodType,
              closureDate,
              closureEnabled,
            },
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
