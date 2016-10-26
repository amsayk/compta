import React, {Component, PropTypes} from 'react';
import Relay from 'react-relay';

import {bindActionCreators} from 'redux';
import {reduxForm} from 'redux-form';

import pick from 'lodash.pick';

import * as companyActions from '../../../redux/modules/companies';

import { setBeforeUnloadMessage, unsetBeforeUnloadMessage, } from '../../../utils/unbeforeunload';

import LoadingActions from '../../Loading/actions';

import Actions from '../../confirm/actions';

import Logo from './Logo';

import formatAddress from '../../../utils/formatAddress';

function getAddress({
  company_streetAddress,
  company_cityTown,
  company_stateProvince,
  company_postalCode,
  company_country,
}){
  const addr = formatAddress({
    address: company_streetAddress,
    city: company_cityTown,
    subdivision: company_stateProvince,
    postalCode: company_postalCode,
    country: company_country,
  });

  return addr.length === 0 ? undefined : [...addr].join('<br/>');
}

// import TelInput from '../../utils/TelInput';

import getFieldValue from '../../utils/getFieldValue';

import Combobox from 'react-widgets/lib/Combobox';

import { createValidator, required, email, url, } from '../../../utils/validation';

import Dialog, {Header, Body, Footer} from '../../utils/Dialog';

import {
  fromGlobalId,
} from 'graphql-relay';

import makeAlias from '../../../utils/makeAlias';

const legalForms = [ 1, 2, 3, 4, ];
const legalFormsByIndex = { 1: 'SARL', 2:'SA', 3:'SNC', 4:'SARL_AU', };
const legalFormsById = { 'SARL': 1, 'SA':2, 'SNC':3, 'SARL_AU':4, };

import messages from './messages';

import UpdateCompanyMutation from '../../../mutations/UpdateCompanyMutation';

import classnames from 'classnames';

import styles from '../AppSettings.scss';

import CSSModules from 'react-css-modules';

import Modal from 'react-bootstrap/lib/Modal';

import {Table, Column, Cell,} from '../../../../fixed-data-table';

import throttle from 'lodash.throttle';

import Parse from 'parse';

import events from 'dom-helpers/events';

import {getBodyHeight, getBodyWidth} from '../../../utils/dimensions'

import {Company,} from '../../../utils/types';

import ExpensesSettings from './ExpensesSettings';
import SalesSettings from './SalesSettings';
import PaymentsSettings from './PaymentsSettings';
import AdvancedSettings from './AdvancedSettings';

import {
  intlShape,
} from 'react-intl';

function getMinHeight() {
  return getBodyHeight() - 45 /* HEADER */ - 50 /* FOOTER */;
}

@CSSModules(styles, {allowMultiple: true})
export default class extends React.Component {

  static displayName = 'AppSettingsForm';

  static contextTypes = {
    intl: intlShape.isRequired,
  };

  state = {
    selected: -1,
    tab: 'company',
  };

  componentDidMount() {
    events.on(window, 'resize', this._handleWindowResize);

    ga('send', 'pageview', '/modal/app/settings');
  }

  componentWillUnmount() {
    events.off(window, 'resize', this._handleWindowResize);
  }

  _handleWindowResize = throttle(() => {
    this.forceUpdate();
  }, 150);

  _setFormRef = (ref) => {
    this._form = ref;
  };

  leave = (then) => {
    if(this._form){
      this._form.close(then);
    }else{
      then();
    }
  };

  render() {
    const self = this;

    const {intl,} = this.context;

    const rowsCount = 3;

    let tableHeight = 0;

    tableHeight += self.state.selected === 0 ? 350 : 250;
    tableHeight += self.state.selected === 1 ? 600 : 500;
    tableHeight += self.state.selected === 2 ? 400 : 350;

    tableHeight += 2;

    const bodyWidth = getBodyWidth() - 165 - 30;

    const tableWidth = bodyWidth - 1;

    const handleClose = () => {
      this.props.onCancel();
    };

    const minHeight = getMinHeight();

    const tab = this.state.tab;

    return (
      <Modal dialogClassName={this.props.styles['modal']}
             dialogComponentClass={Dialog}
             className={classnames({'app-settings-form form modal-fullscreen': true, [styles['app-settings-form'] || '']: true, })}
             show={true} keyboard={false} backdrop={false} onHide={() => handleClose()} autoFocus enforceFocus>

        <Header>

          <div styleName='tableCell'>

            <div styleName='f-title'
                 style={{display: 'inline-block', }}>{intl.formatMessage(messages['Title'])}
            </div>

            <div styleName='icon'>
              <i className='material-icons md-light' style={{verticalAlign: 'middle'}}>settings</i>
            </div>

          </div>

        </Header>

        <Body>

          <div styleName='table stretch'>

            <div styleName='tableCell navWrapper' style={{ height: '100%', }}>

              <nav role='navigation' styleName='scroller nav'>

                <div onClick={this._setTab.bind(this, 'company')} styleName='trowserNavItem settingsNavItem' className={tab === 'company' ? this.props.styles['selected'] : ''}>
                  <a>{intl.formatMessage(messages['Company'])}</a>
                </div>

                <div onClick={this._setTab.bind(this, 'sales')} styleName='trowserNavItem settingsNavItem' className={tab === 'sales' ? this.props.styles['selected'] : ''}>
                  <a>{intl.formatMessage(messages['Sales'])}</a>
                </div>

                <div onClick={this._setTab.bind(this, 'expenses')} styleName='trowserNavItem settingsNavItem' className={tab === 'expenses' ? this.props.styles['selected'] : ''}>
                  <a>{intl.formatMessage(messages['Expenses'])}</a>
                </div>

                <div onClick={this._setTab.bind(this, 'employees')} styleName='trowserNavItem settingsNavItem' style={{display: 'none'}} className={tab === 'employees' ? this.props.styles['selected'] : ''}>
                  <a href='javascript:void(0)'>{intl.formatMessage(messages['Employees'])}</a>
                </div>

                <div onClick={this._setTab.bind(this, 'payments')} styleName='trowserNavItem settingsNavItem' className={tab === 'payments' ? this.props.styles['selected'] : ''}>
                  <a>{intl.formatMessage(messages['Payments'])}</a>
                </div>

                {/*<div onClick={this._setTab.bind(this, 'settings')} styleName='trowserNavItem settingsNavItem' className={tab === 'settings' ? this.props.styles['selected'] : ''}>
                 <a>{intl.formatMessage(messages['Advanced'])}</a>
                 </div>*/}

              </nav>

            </div>

            <div styleName='tableCell'>

              <div style={{padding: '15px 15px 15px 15px', overflowY: 'auto', overflowX: 'hidden',}}>

                <div className='scrollable settingsContainer table' style={{height: minHeight - 30 - 3}}>


                  {function () {
                    switch (tab){
                      case 'company':

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
                                  case 0 : return self.state.selected === 0 ? 350 : 250;
                                  case 1 : return self.state.selected === 1 ? 650 : 525;
                                  case 2 : return self.state.selected === 2 ? 400 : 350;
                                }
                              }}
                            rowsCount={rowsCount}
                            height={tableHeight + 4}
                            width={tableWidth}
                            headerHeight={0}
                            footerHeight={0}>

                            <Column
                              columnKey={'key'}
                              align={'center'}
                              width={tableWidth}
                              cell={({rowIndex, ...props}) => {
                                  const {View, Form} = COMPANY_COMPONENTS[rowIndex];
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

                      case 'sales': return <SalesSettings ref={self._setRef.bind(self, 'sales')} root={self.props.root} viewer={self.props.viewer} company={self.props.company} bodyWidth={bodyWidth}/>;
                      case 'expenses': return <ExpensesSettings ref={self._setRef.bind(self, 'expenses')} root={self.props.root} viewer={self.props.viewer} company={self.props.company} bodyWidth={bodyWidth}/>;
                      case 'payments': return <PaymentsSettings ref={self._setRef.bind(self, 'payments')} root={self.props.root} viewer={self.props.viewer}  company={self.props.company} bodyWidth={bodyWidth}/>;
                      // case 'settings': return <AdvancedSettings ref={self._setRef.bind(self, 'settings')} root={self.props.root} viewer={self.props.viewer} company={self.props.company} bodyWidth={bodyWidth}/>;

                      default:

                        throw 'Invalid settings panel'
                    }
                  }()}

                </div>

              </div>


            </div>

          </div>

        </Body>

        <Footer>

          <div styleName='' style={{}}>
            <button
              style={{minWidth: 70}}
              styleName='btn primary floatRight'
              onClick={e => handleClose()} className='unselectable'>{intl.formatMessage(messages['Done'])}</button>
          </div>

        </Footer>

      </Modal>
    );
  }

  _setRef = (ref, el) => {
    this[`_${ref}`] = el;
  };

  _setActiveRow = (rowIndex, e) => {

    if(rowIndex !== this.state.selected){
      if(e){
        e.preventDefault();
        e.stopPropagation();
      }

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

  _setTab = (tab, e) => {
    e.preventDefault();
    e.stopPropagation();

    const done = () => {
      this.setState({
        selected: -1,
        tab
      });
    };

    if(this.state.tab !== tab){
      switch (this.state.tab) {
        case 'company':
          this.leave(done);
          return;
        case 'sales':
          if(this._sales){
            this._sales.leave(done);
          }
          else{
            done();
          }
          return;
        case 'expenses':
          if(this._expenses){
            this._expenses.leave(done);
          }
          else{
            done();
          }
          return;
        case 'payments':
          if(this._payments){
            this._payments.leave(done);
          }
          else{
            done();
          }
          return;
        case 'settings':
          if(this._settings){
            this._settings.leave(done);
          }
          else{
            done();
          }
          return;
        default:
          done();
          return;
      }
    }
  };
}

const CompanyName = function () {

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

            <div styleName='tableCell subsection14TitleText settingName'>{intl.formatMessage(messages['CompanyName'])}</div>

            <div styleName='tableCell settingContent'>

              <div style={{padding: '0 45px'}}>

                <div style={{textAlign: 'left'}}>

                  <div onSubmit={e => {e.preventDefault();}} style={{textAlign: 'left'}}>

                    <div styleName='inlineBlock logoContainer'>

                      {/*<span styleName='logoPlaceHolder inlineBlock'>{ this.props.company.logo ? <img width="128px" height='128px' src={this.props.company.logo.url} /> : null }</span>*/}
                      <span styleName='logoPlaceHolder inlineBlock'>{ this.props.company.logo ? <img height='150px' src={this.props.company.logo.url} /> : null }</span>

                    </div>

                    <fieldset className='form-group'>

                      <label style={{ fontFamily: '"HelveticaNeueBold", Helvetica, Arial, sans-serif' }}>{this.props.company.displayName}</label>

                    </fieldset>

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

  function asyncValidate({displayName, id}) {
    // TODO: figure out a way to move this to the server. need an instance of ApiClient
    if (!displayName) {
      return Promise.resolve({});
    }
    return new Promise((resolve, reject) => {
      const query = new Parse.Query(Company);
      query.equalTo('displayNameLowerCase', makeAlias(displayName));


      const {id: localId} = fromGlobalId(id);

      query.notEqualTo('objectId', localId);

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
        'logo',
      ],
      validate: companyValidation,
      asyncValidate,
      asyncBlurFields: ['displayName'],
    }, (state, ownProps) => ({
      saveError: state.companies.saveError,
      initialValues: {
        id: ownProps.company.id,
        displayName: ownProps.company.displayName,
        logo: ownProps.company.logo,
      },
      // pick(ownProps.company, [ 'id', 'displayName', ]), // Pass company on edit
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
          displayName,
          logo,
        },
        handleSubmit,
        valid,
        invalid,
        pristine,
        update,
        submitting,
        saveError: {[formKey]: saveError},
        values,

        onCancel,
      } = this.props;

      const doUpdate = handleSubmit((data) => {
        LoadingActions.show();

        const fieldInfos = Object.keys(data).filter(key => key !== 'id' && key !== 'logo').map(key => ({fieldName: key, value: data[key]}));
        const _data = {id: this.props.company.id, fieldInfos, viewer: this.props.viewer, root: this.props.root, company: this.props.company, };

        const logoValue = data['logo'];

        const {
          fields: {
            logo,
          }
        } = this.props;

        if(logo.dirty){
          _data.logo = logoValue ? {
            ...pick(logoValue, [ 'name', 'type', 'size' ]),
            dataBase64: logoValue.url.split(/,/)[1],
          } : {
            isNull: true,
          };
        }

        return  update(_data)
          .then(result => {
            LoadingActions.hide();

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

            <div styleName='tableCell subsection14TitleText settingName'>{intl.formatMessage(messages['CompanyName'])}</div>

            <div styleName='tableCell settingContent'>

              <div style={{padding: '0 45px'}}>

                <div>

                  <div onSubmit={doUpdate} style={{textAlign: 'left'}}>

                    {/*<div styleName='inlineBlock logoContainer'>

                      <span styleName='logoPlaceHolder inlineBlock'></span>

                      <div styleName='avatar-edit'>
                        <i className='material-icons '>photo_camera</i>
                      </div>

                    </div>*/}
                    <Logo onChange={logo.onChange} value={getFieldValue(logo)}/>

                    <fieldset className={classnames('form-group', {'has-danger': !pristine && displayName.invalid,})}>

                      <input
                        {...displayName}
                         value={getFieldValue(displayName, '')}
                        disabled={submitting}
                        autoFocus
                        type='text'
                        className={classnames('form-control', { 'form-control-danger': !pristine && displayName.invalid, })}
                        maxLength={'140'} />

                      <small className="text-muted" style={{ marginTop: 3, display: 'block', height: 15, }}>
                        {!pristine && displayName.error ? <div className='text-danger'>{intl.formatMessage(displayName.error)}</div> : ''}
                      </small>

                    </fieldset>

                  </div>

                  {saveError && <div styleName='error'>{intl.formatMessage({ ...saveError, id: saveError._id, })}</div>}

                </div>

                <div style={{textAlign: 'left', marginTop: 30, }}>

                  <button
                    styleName='button'
                    onClick={e => {e.stopPropagation(); e.preventDefault(); this._handleCancel(e); }}
                    disabled={submitting}
                    className='btn btn-primary-outline unselectable'>{intl.formatMessage(messages['cancel'])}
                  </button>

                  <button
                    style={{marginLeft: 10}}
                    styleName='button primary'
                    onClick={doUpdate}
                    disabled={pristine || invalid || submitting}
                    className={'btn btn-primary unselectable' + (!pristine && valid ? ' green' : '')}>
                    {' '}{intl.formatMessage(messages['save'])}
                  </button>

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

const CompanyInfo = function () {

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

            <div styleName='tableCell subsection14TitleText settingName'>{intl.formatMessage(messages['ContactInfo'])}</div>

            <div styleName='tableCell settingContent'>

              <div style={{padding: '0 45px'}}>

                <div>

                  <div onSubmit={e => {e.preventDefault();}}>

                    <div className='form-group row'>

                      <label htmlFor='form-jurique' styleName='alignRight' className='col-sm-4'>{intl.formatMessage(messages['LegalForm'])}</label>

                      <div className='col-sm-8'>

                        <p className='form-control-static' styleName={'labelText'}>{this.props.company.legalForm ? intl.formatMessage(messages[`legalForm${this.props.company.legalForm}`])  : '--'}</p>

                      </div>

                    </div>

                    <div className='form-group row'>

                      <label htmlFor='siege-sociale' styleName='alignRight' className='col-sm-4 form-control-label'>{intl.formatMessage(messages['Address'])}</label>

                      <div className='col-sm-8'>
                        <p className='form-control-static' styleName={'labelText'} dangerouslySetInnerHTML={{__html: getAddress(this.props.company) || '--'}}></p>
                      </div>

                    </div>

                    <div className='form-group row'>

                      <label htmlFor='capital' styleName='alignRight' className='col-sm-4 form-control-label'>{intl.formatMessage(messages['Capital'])}</label>

                      <div className='col-sm-8'>
                        <p className='form-control-static' styleName={'labelText'}>{this.props.company.capital || '--'}</p>
                      </div>

                    </div>

                    <div className='form-group row'>

                      <label htmlFor='activity' styleName='alignRight' className='col-sm-4 form-control-label'>{intl.formatMessage(messages['Activity'])}</label>

                      <div className='col-sm-8'>
                        <p className='form-control-static' styleName={'labelText'}>{this.props.company.activity || '--'}</p>
                      </div>

                    </div>

                    <div className='form-group row'>

                      <label htmlFor='webSite' styleName='alignRight' className='col-sm-4 form-control-label'>{intl.formatMessage(messages['Site'])}</label>

                      <div className='col-sm-8'>
                        <p className='form-control-static' styleName={'labelText'}>{this.props.company.webSite || '--'}</p>
                      </div>

                    </div>

                    <div className='form-group row'>

                      <label htmlFor='tel' styleName='alignRight' className='col-sm-4 form-control-label'>{intl.formatMessage(messages['Tel'])}</label>

                      <div className='col-sm-8'>
                        <p className='form-control-static' styleName={'labelText'}>{this.props.company.tel || '--'}</p>
                      </div>

                    </div>

                    <div className='form-group row'>

                      <label htmlFor='fax' styleName='alignRight' className='col-sm-4 form-control-label'>{intl.formatMessage(messages['Fax'])}</label>

                      <div className='col-sm-8'>
                        <p className='form-control-static' styleName={'labelText'}>{this.props.company.fax || '--'}</p>
                      </div>

                    </div>

                    <div className='form-group row'>

                      <label htmlFor='email' styleName='alignRight' className='col-sm-4 form-control-label'>{intl.formatMessage(messages['Email'])}</label>

                      <div className='col-sm-8'>
                        <p className='form-control-static' styleName={'labelText'}>{this.props.company.email || '--'}</p>
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

  const companyValidation = createValidator({
    email: [email],
    webSite: [url],
    legalForm: [required],
  });

  @reduxForm({
      form: 'company',
      validate: companyValidation,
      fields: [
        'id',
        'legalForm',

        // 'address',

        'company_streetAddress',
        'company_cityTown',
        'company_stateProvince',
        'company_postalCode',
        'company_country',

        'capital',

        'activity',
        'webSite',
        'tel',
        'fax',
        'email',
      ],
    }, (state, ownProps) => ({
      saveError: state.companies.saveError,
      initialValues: pick(ownProps.company, [
        'id',
        'legalForm',
        // 'address',

        'company_streetAddress',
        'company_cityTown',
        'company_stateProvince',
        'company_postalCode',
        'company_country',

        'capital',

        'activity',
        'webSite',
        'tel',
        'fax',
        'email',
      ]), // Pass company on edit
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
          legalForm,

          // address,
          company_streetAddress,
          company_cityTown,
          company_stateProvince,
          company_postalCode,
          company_country,

          capital,

          activity,
          webSite,
          tel,
          fax,
          email,
        },
        handleSubmit,
        valid,
        invalid,
        pristine,
        update,
        submitting,
        saveError: {[formKey]: saveError},
        values,

        onCancel,
      } = this.props;

      const doUpdate = handleSubmit((data) => {
        LoadingActions.show();
        return  update({id: this.props.company.id, fieldInfos: Object.keys(data).filter(key => key !== 'id').map(key => ({fieldName: key, value: key === 'legalForm' ? (data[key] ? legalFormsById[data[key]] : undefined) : data[key]})), viewer: this.props.viewer, root: this.props.root, company: this.props.company, })
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

            <div styleName='tableCell subsection14TitleText settingName'>{intl.formatMessage(messages['ContactInfo'])}</div>

            <div styleName='tableCell settingContent'>

              <div style={{padding: '0 45px'}}>

                <div>

                  <div onSubmit={doUpdate}>

                    <div className='form-group row'>

                      <label htmlFor='form-jurique' styleName='alignRight' className='col-sm-4'>{intl.formatMessage(messages['LegalForm'])}</label>

                      <div className='col-sm-8' style={{textAlign: 'left'}}>

                        {/*<select disabled={submitting} {...legalForm} autoFocus className='form-control' id='form-jurique'>
                          <option value=''>-- Choose a legal form --</option>
                          {legalForms.map((f, index) => {
                            return (
                              <option key={f} value={legalFormsByIndex[f]}>{intl.formatMessage(messages[`legalForm${f}`])}</option>
                            );
                          })}
                        </select>*/}

                        <Combobox
                          autoFocus
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

                    <div className='form-group row'>

                      <label htmlFor='siege-sociale' styleName='alignRight' className='col-sm-4 form-control-label'>{intl.formatMessage(messages['Address'])}</label>

                      <div className='col-sm-8'>

                        {/*<textarea
                          disabled={submitting}
                          maxLength={'300'}
                          {...address}
                          value={getFieldValue(address, '')}
                          // value={address.value || ''}
                          rows='5'
                          className='form-control' id='siege-sociale'
                        />*/}

                        <div className={classnames('tab-pane fade', {'active in': true,})} role='tabpanel'>

                          <div className='form-group row'>

                            <div style={{ paddingLeft: 0, paddingRight: 0, }} className='col-sm-12'>
                              <textarea
                                style={{resize: 'none'}}
                                disabled={submitting}
                                onChange={company_streetAddress.onChange}
                                value={getFieldValue(company_streetAddress, '')}
                                placeholder={intl.formatMessage(messages['placeholder_Street'])}
                                className='form-control'/>
                            </div>

                          </div>

                          <div className='form-group row'>

                            <div style={{ paddingLeft: 0, }} className='col-sm-6'>
                              <input
                              onChange={company_cityTown.onChange}
                              value={getFieldValue(company_cityTown, '')}
                              disabled={submitting} type='text' className='form-control'
                              placeholder={intl.formatMessage(messages['placeholder_cityTown'])}/>
                            </div>

                            <div style={{ paddingRight: 0, }} className='col-sm-6'>
                              <input
                              onChange={company_stateProvince.onChange}
                              value={getFieldValue(company_stateProvince, '')}
                                disabled={submitting} type='text' className='form-control'
                                placeholder={intl.formatMessage(messages['placeholder_stateProvince'])}/>
                            </div>

                          </div>

                          <div className='form-group row'>

                            <div style={{ paddingLeft: 0, }} className='col-sm-6'>
                              <input
                              onChange={company_postalCode.onChange}
                              value={getFieldValue(company_postalCode, '')}
                                disabled={submitting} type='text' className='form-control'
                                placeholder={intl.formatMessage(messages['placeholder_postalCode'])}/>
                            </div>

                            <div style={{ paddingRight: 0, }} className='col-sm-6'>
                              <input
                              onChange={company_country.onChange}
                              value={getFieldValue(company_country, '')}
                                disabled={submitting} type='text' className='form-control'
                                placeholder={intl.formatMessage(messages['placeholder_country'])}/>
                            </div>

                          </div>

                        </div>

                      </div>

                    </div>

                    <div className='form-group row'>

                      <label htmlFor='capital' styleName='alignRight' className='col-sm-4 form-control-label'>{intl.formatMessage(messages['Capital'])}</label>

                      <div className='col-sm-8'>
                        <input
                          disabled={submitting}
                          {...capital}
                          value={getFieldValue(capital, '')}
                          type='text'
                          className='form-control'
                          id='capital'
                        />
                      </div>

                    </div>

                    <div className='form-group row'>

                      <label htmlFor='activity' styleName='alignRight' className='col-sm-4 form-control-label'>{intl.formatMessage(messages['Activity'])}</label>

                      <div className='col-sm-8'>
                        <input
                          disabled={submitting}
                          {...activity}
                          value={getFieldValue(activity, '')}
                          type='text'
                          className='form-control'
                          id='activity'
                        />
                      </div>

                    </div>

                    <div className={classnames('form-group row', { 'has-danger': !pristine && webSite.invalid, })}>

                      <label htmlFor='webSite' styleName='alignRight' className='col-sm-4 form-control-label'>{intl.formatMessage(messages['Site'])}</label>

                      <div className='col-sm-8'>

                        <input
                          disabled={submitting}
                          {...webSite}
                          value={getFieldValue(webSite, '')}
                          type='text'
                          className={classnames('form-control', { 'form-control-danger': !pristine && webSite.invalid, })}
                          id='webSite'
                        />

                      </div>

                    </div>

                    <div className='form-group row'>

                      <label htmlFor='tel' styleName='alignRight' className='col-sm-4 form-control-label'>{intl.formatMessage(messages['Tel'])}</label>

                      <div className='col-sm-8'>
                        <input
                          disabled={submitting}
                          onChange={tel.onChange}
                          value={getFieldValue(tel, '')}
                          type='text'
                          className='form-control'
                          id='tel'
                        />
                        {/*<TelInput disabled={submitting} onChange={tel.onChange} value={getFieldValue(tel)} />*/}
                      </div>

                    </div>

                    <div className='form-group row'>

                      <label htmlFor='fax' styleName='alignRight' className='col-sm-4 form-control-label'>{intl.formatMessage(messages['Fax'])}</label>

                      <div className='col-sm-8'>
                        <input
                          disabled={submitting}
                          onChange={fax.onChange}
                          value={getFieldValue(fax, '')}
                          type='text'
                          className='form-control'
                          id='fax'
                        />
                        {/*<TelInput disabled={submitting} onChange={fax.onChange} value={getFieldValue(fax)} />*/}
                      </div>

                    </div>

                    <div className={classnames('form-group row', { 'has-danger': !pristine && email.invalid, })}>

                      <label htmlFor='email' styleName='alignRight' className='col-sm-4 form-control-label'>{intl.formatMessage(messages['Email'])}</label>

                      <div className='col-sm-8'>

                        <input
                          disabled={submitting}
                          {...email}
                           value={getFieldValue(email, '')}
                          type='email'
                          className={classnames('form-control', { 'form-control-danger': !pristine && email.invalid, })}
                          id='email'/>

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

const AdvancedInfoForm = function () {

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

            <div styleName='tableCell subsection14TitleText settingName'>{intl.formatMessage(messages['MoreInfo'])}</div>

            <div styleName='tableCell settingContent'>

              <div style={{padding: '0 45px'}}>

                <div>

                  <div onSubmit={e => {e.preventDefault();}}>

                    <div className='form-group row'>

                      <label htmlFor='if' styleName='alignRight' className='col-sm-4 form-control-label'>{'ICE'}</label>

                      <div className='col-sm-8'>
                        <p className='form-control-static' styleName={'labelText'}>{this.props.company.ice || '--'}</p>
                      </div>

                    </div>

                    <div className='form-group row'>

                      <label htmlFor='rc' styleName='alignRight' className='col-sm-4 form-control-label'>{intl.formatMessage(messages['RC'])}</label>

                      <div className='col-sm-8'>
                        <p className='form-control-static' styleName={'labelText'}>{this.props.company.rc || '--'}</p>
                      </div>

                    </div>

                    <div className='form-group row'>

                      <label htmlFor='patente' styleName='alignRight' className='col-sm-4 form-control-label'>{intl.formatMessage(messages['Patent'])}</label>

                      <div className='col-sm-8'>
                        <p className='form-control-static' styleName={'labelText'}>{this.props.company.patente || '--'}</p>
                      </div>

                    </div>

                    <div className='form-group row'>

                      <label htmlFor='cnss' styleName='alignRight' className='col-sm-4 form-control-label'>{intl.formatMessage(messages['CNSS'])}</label>

                      <div className='col-sm-8'>
                        <p className='form-control-static' styleName={'labelText'}>{this.props.company.cnss || '--'}</p>
                      </div>

                    </div>

                    <div className='form-group row'>

                      <label htmlFor='banque' styleName='alignRight' className='col-sm-4 form-control-label'>{intl.formatMessage(messages['Banque'])}</label>

                      <div className='col-sm-8'>
                        <p className='form-control-static' styleName={'labelText'}>{this.props.company.rib || '--'}</p>
                      </div>

                    </div>

                    <div className='form-group row'>

                      <label htmlFor='rib-bancaire' styleName='alignRight' className='col-sm-4 form-control-label'>{intl.formatMessage(messages['RIB'])}</label>

                      <div className='col-sm-8'>
                        <p className='form-control-static' styleName={'labelText'}>{this.props.company.rib || '--'}</p>
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

  @reduxForm({
      form: 'company',
      fields: [
        'id',
        'ice',
        // 'if',
        'rc',
        'patente',
        'cnss',
        'banque',
        'rib',
      ],
    }, (state, ownProps) => ({
      saveError: state.companies.saveError,
      initialValues: pick(ownProps.company, [
        'id',
        'ice',
        // 'if',
        'rc',
        'patente',
        'cnss',
        'banque',
        'rib',
      ]), // Pass company on edit
    }),
    dispatch => bindActionCreators(companyActions, dispatch))
  @CSSModules(styles, {allowMultiple: true})
  class Form extends React.Component {

    constructor(props, context){
      super(props, context);

      this.props.editStart(this.props.company.id);
    }

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
          ice,
          rc,
          patente,
          cnss,
          banque,
          rib,
        },
        handleSubmit,
        valid,
        invalid,
        pristine,
        update,
        submitting,
        saveError: {[formKey]: saveError},
        values,

        onCancel,
      } = this.props;

      const doUpdate = handleSubmit((data) => {
        LoadingActions.show();
        return  update({id: this.props.company.id, fieldInfos: Object.keys(data).filter(key => key !== 'id').map(key => ({fieldName: key, value: data[key]})), viewer: this.props.viewer, root: this.props.root, company: this.props.company, })
          .then(result => {
            LoadingActions.hide();

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

            <div styleName='tableCell subsection14TitleText settingName'>{intl.formatMessage(messages['MoreInfo'])}</div>

            <div styleName='tableCell settingContent'>

              <div style={{padding: '0 45px'}}>

                <div>

                  <div onSubmit={doUpdate}>

                    <div className='form-group row'>

                      <label htmlFor='if' styleName='alignRight' className='col-sm-4 form-control-label'>{'ICE'}</label>

                      <div className='col-sm-8'>
                        <input disabled={submitting} {...ice} value={getFieldValue(ice, '')} autoFocus type='text' className='form-control' id='ice'/>
                      </div>

                    </div>

                    <div className='form-group row'>

                      <label htmlFor='rc' styleName='alignRight' className='col-sm-4 form-control-label'>{intl.formatMessage(messages['RC'])}</label>

                      <div className='col-sm-8'>
                        <input disabled={submitting} {...rc} value={getFieldValue(rc, '')} type='text' className='form-control' id='rc'/>
                      </div>

                    </div>

                    <div className='form-group row'>

                      <label htmlFor='patente' styleName='alignRight' className='col-sm-4 form-control-label'>{intl.formatMessage(messages['Patent'])}</label>

                      <div className='col-sm-8'>
                        <input disabled={submitting} {...patente} value={getFieldValue(patente, '')} type='text' className='form-control' id='patente'/>
                      </div>

                    </div>

                    <div className='form-group row'>

                      <label htmlFor='cnss' styleName='alignRight' className='col-sm-4 form-control-label'>{intl.formatMessage(messages['CNSS'])}</label>

                      <div className='col-sm-8'>
                        <input disabled={submitting} {...cnss} value={getFieldValue(cnss, '')} type='text' className='form-control' id='cnss'/>
                      </div>

                    </div>

                    <div className='form-group row'>

                      <label htmlFor='banque' styleName='alignRight' className='col-sm-4 form-control-label'>{intl.formatMessage(messages['Banque'])}</label>

                      <div className='col-sm-8'>
                        <input disabled={submitting} {...banque} value={getFieldValue(banque, '')} type='text' className='form-control' id='banque'/>
                      </div>

                    </div>

                    <div className='form-group row'>

                      <label htmlFor='rib-bancaire' styleName='alignRight' className='col-sm-4 form-control-label'>{intl.formatMessage(messages['RIB'])}</label>

                      <div className='col-sm-8'>
                        <input disabled={submitting} {...rib} value={getFieldValue(rib, '')} type='text' className='form-control' id='rib-bancaire'/>
                      </div>

                    </div>


                  </div>

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

            ${UpdateCompanyMutation.getFragment('company')},

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
            ice,
            if,
            rc,
            patente,
            cnss,
            banque,
            rib,

            logo {
              objectId,
              url,
            },

          }

        `,

    }
  })
}

export const COMPANY_COMPONENTS = [
  CompanyName,
  CompanyInfo,
  AdvancedInfoForm,
];
