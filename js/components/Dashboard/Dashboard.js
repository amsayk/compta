import React, {Component, PropTypes} from 'react';
import Relay from 'react-relay';

import Sidebar from '../Sidebar/AppSidebar';
import Loading from '../Loading/Loading';

import CSSModules from 'react-css-modules';

import moment from 'moment';

import { PAYMENTS_OF_INVOICES_ACCOUNTS_CATEGORIES, PAYMENTS_OF_BILLS_ACCOUNTS_CATEGORIES, EXPENSES_ACCOUNTS_CATEGORIES, SALES_ACCOUNTS_CATEGORIES, } from '../../../data/constants';

import LoadingActions from '../Loading/actions';

import {SALES_SETTINGS_COMPANY_COMPONENTS,} from '../AppSettings/ManageCompanyForm/SalesSettings';
import {EXPENSES_SETTINGS_COMPANY_COMPONENTS,} from '../AppSettings/ManageCompanyForm/ExpensesSettings';
import {PAYMENTS_SETTINGS_COMPANY_COMPONENTS,} from '../AppSettings/ManageCompanyForm/PaymentsSettings';
import {ADVANCED_SETTINGS_COMPANY_COMPONENTS,} from '../AppSettings/ManageCompanyForm/AdvancedSettings';

let ManageCompanyForm = null;
import {COMPANY_COMPONENTS,} from '../AppSettings/ManageCompanyForm/ManageCompanyForm'

function loadComponent(type, cb) {
  switch (type){

    case 'settings':

      require.ensure([], function (require) {
        ManageCompanyForm = require('../AppSettings/ManageCompanyForm/ManageCompanyForm').default;
        cb();
      }, 'ManageCompanyForm');

      break;
  }
}

import RemoveCompanyMutation from '../../mutations/RemoveCompanyMutation';
import UpdateCompanyMutation from '../../mutations/UpdateCompanyMutation';
import UpdateCompanySettingsMutation from '../../mutations/UpdateCompanySettingsMutation';
import UpdateCompanySalesSettingsMutation from '../../mutations/UpdateCompanySalesSettingsMutation';
import UpdateCompanyExpensesSettingsMutation from '../../mutations/UpdateCompanyExpensesSettingsMutation';
import UpdateCompanyPaymentsSettingsMutation from '../../mutations/UpdateCompanyPaymentsSettingsMutation';

import { getBodyHeight, } from '../../utils/dimensions';

import LazyCache from 'react-lazy-cache';

import Revision from '../../utils/revision';

import styles from './Dashboard.scss';

import DashboardRoute from '../../routes/DashboardRoute';

import PrivateModeSwitch from './PrivateModeSwitch';

import Income from './cards/Income';
import Expenses from './cards/Expenses';
import ProfitLoss from './cards/ProfitLoss';

import {
  defineMessages,
  intlShape,
} from 'react-intl';

import messages from './messages';

@CSSModules(styles, {allowMultiple: true})
class Dashboard extends React.Component {

  static contextTypes = {
    intl: intlShape.isRequired,
    store: PropTypes.object.isRequired,
  };

  state = {
    modalOpen: false,
  };

  _onTogglePrivateMode = () => {
    const { privateModeOn, } = this.props.relay.variables;
    this.props.relay.setVariables({
      privateModeOn: !privateModeOn,
    }, ({done}) => {
      if(done){
        localStorage.setItem('dashboard.privateModeOn', !privateModeOn);
      }
    });
  }

  _onAddClicked = (e) => {
    e.preventDefault();
  };

  _close = () => {
    this.setState({modalOpen: false, modalType: undefined,});
  };

  _renderForm = () => {
    if(!this.state.modalOpen){
      return null;
    }

    switch(this.state.modalType){
      case 'settings':
        return (
          <ManageCompanyForm
            expensesAccounts={this.props.expensesAccounts}
            paymentsAccounts={this.props.paymentsAccounts}
            onCancel={this._close}
            company={this.props.company}
            viewer={this.props.viewer}
            root={this.props.viewer}
          />
        );

    }

  };

  _onExpensesDate = ({ date, from, to, }, onReadyStateChange) => {
    this.props.relay.setVariables({
       expensesDate: date, expensesFrom: from, expensesTo: to, rev: Revision.incrementAndGet(),
    }, ({done}) => {

      if(done){
        localStorage.setItem('dashboard.expensesDate', date);
      }
      onReadyStateChange && onReadyStateChange({done});;
    });
  };

  _onProfitLossDate = ({ date, from, to, }, onReadyStateChange) => {
    this.props.relay.setVariables({
      profitLossDate: date, profitLossFrom: from, profitLossTo: to, rev: Revision.incrementAndGet(),
    }, ({done}) => {

      if(done){
        localStorage.setItem('dashboard.profitLossDate', date);
      }

      onReadyStateChange && onReadyStateChange({done});;
    });
  };

  _onManageSettingsClicked = (e) => {
    e&&e.preventDefault();
    e&&e.stopPropagation();

    loadComponent('settings', () => {
      this.setState({
        modalOpen: true,
        modalType: 'settings'
      });
    });
  };

  render() {
    const {formatMessage,} = this.context.intl;
    const { route, stale, loading, company, viewer, companies, } = this.props;
    const { privateModeOn, expensesDate, profitLossDate, } = this.props.relay.variables;
    return (
      <div className=''>

        <Sidebar
          route={route}
          loading={loading}
          stale={stale}
          company={company}
          companies={companies.edges.map(({ node: company, }) => company)}
          viewer={viewer}
          page='/dashboard'
        />

        <div className='content' style={{ height: '100%', }}>

          <div styleName='page mainContainer' style={{ minHeight: getBodyHeight(), }}>

            <div styleName='pageContainer'>

              <header>

                <a styleName='headerLink' onClick={this._onManageSettingsClicked}>

                  <div styleName='inlineBlock logoContainer'>

                    <span styleName='logoPlaceHolder inlineBlock'>{ !loading && company.logo ? <img height='56px' src={company.logo.url} alt=""/> : formatMessage(messages['Logo'])}</span>
                    {/*<span styleName='logoPlaceHolder inlineBlock'>{ !loading && company.logo ? <img width="56px" height='56px' src={company.logo.url} alt=""/> : formatMessage(messages['Logo'])}</span>*/}

                  </div>

                  <div styleName='inlineBlock companyData'>

                    <div styleName='companyName'>{loading ? null : company.displayName}</div>

                    <div>
                      <span styleName='date'>{moment(new Date()).format('LLLL')}</span>
                    </div>

                  </div>

                </a>

                <PrivateModeSwitch
                  loading={loading}
                  stale={stale}
                  onToggle={this._onTogglePrivateMode}
                  on={privateModeOn}
                />

              </header>

              <div styleName='pageBodyContainer'>

                <Income
                  stale={stale}
                  loading={loading || stale}
                  company={company}
                  viewer={viewer}
                  privateMode={privateModeOn}
                />

                <Expenses
                  stale={stale}
                  loading={loading || stale}
                  company={company}
                  viewer={viewer}
                  date={expensesDate}
                  onDate={this._onExpensesDate}
                  privateMode={privateModeOn}
                />

                {privateModeOn ? null : <ProfitLoss
                  stale={stale}
                  loading={loading || stale}
                  company={company}
                  viewer={viewer}
                  date={profitLossDate}
                  onDate={this._onProfitLossDate}
                  privateMode={privateModeOn}
                />}

              </div>

            </div>

          </div>

        </div>

        {loading ? null : this._renderForm()}

      </div>
    );
  }
}

function wrapWithC(Component, props) {
  class CWrapper extends React.Component {
    static propTypes = {
      loading: PropTypes.bool.isRequired,
    };
    static defaultProps = {
      loading: false,
      stale: false,
    };
    render() {
      const { stale, loading, viewer : root, relay, children, } = this.props;
      return React.createElement(
        Component, {
          ...props,
          stale: stale,
          loading: loading,
          companies: root.companies,
          company: root.company,
          expensesAccounts: root.expensesAccounts,
          paymentsAccounts: root.paymentsAccounts,
          salesAccounts: root.salesAccounts,
          root: root,
          viewer: root,
          relay: relay,
        },
        this.props.children
      );
    }
  }

  return Relay.createContainer(CWrapper, {
    initialVariables: {
      privateModeOn: localStorage.getItem('dashboard.privateModeOn') === null ? false : function(){ try{ return JSON.parse(localStorage.getItem('dashboard.privateModeOn')); }catch(e) { return false; }}(),

      companyId: props.params.app,

      paymentsAccountCategories: PAYMENTS_OF_INVOICES_ACCOUNTS_CATEGORIES,
      expensesAccountCategories: PAYMENTS_OF_BILLS_ACCOUNTS_CATEGORIES,

      salesAccountCategories: SALES_ACCOUNTS_CATEGORIES,

      // expensesDate: 12,
      // expensesFrom: moment().subtract(30, 'days').toDate(),
      // expensesTo: undefined,

      // profitLossDate: 12,
      // profitLossFrom: moment().subtract(30, 'days').toDate(),
      // profitLossTo: undefined,

      ...getState(),

      // expenses and bills
      expensesCategories: [
        '6.1',
      ],

      // expenses, bills, sales and invoices
      resultCategories: [
        '6.1',
        '7.1'
      ],

      rev: 0,
    },

    fragments: {
      viewer: () => Relay.QL`
        fragment on User {

          id,
          objectId,
          displayName,
          username,
          email,
          createdAt,
          updatedAt,
          sessionToken,
          
          expensesAccounts: accountsByCategories(categories: $expensesAccountCategories){
            code,
            name,
            _groupCode,
            _categoryCode,
            _classCode,
          },

          id,

          paymentsAccounts: accountsByCategories(categories: $paymentsAccountCategories){
            code,
            name,
            _groupCode,
            _categoryCode,
            _classCode,
          },

          salesAccounts: accountsByCategories(categories: $salesAccountCategories){
            code,
            name,
            _groupCode,
            _categoryCode,
            _classCode,
          },          

          company(id: $companyId){
          
            ${RemoveCompanyMutation.getFragment('company')},
            ${UpdateCompanyMutation.getFragment('company')},
            ${UpdateCompanySettingsMutation.getFragment('company')},
            ${UpdateCompanySalesSettingsMutation.getFragment('company')},
            ${UpdateCompanyExpensesSettingsMutation.getFragment('company')},
            ${UpdateCompanyPaymentsSettingsMutation.getFragment('company')},

            ${SALES_SETTINGS_COMPANY_COMPONENTS[0].View.getFragment('company')},
            ${SALES_SETTINGS_COMPANY_COMPONENTS[1].Form.getFragment('company')},

            ${EXPENSES_SETTINGS_COMPANY_COMPONENTS[0].Form.getFragment('company')},

            ${PAYMENTS_SETTINGS_COMPANY_COMPONENTS[0].Form.getFragment('company')},

            ${ADVANCED_SETTINGS_COMPANY_COMPONENTS[0].Form.getFragment('company')},
            ${ADVANCED_SETTINGS_COMPANY_COMPONENTS[1].Form.getFragment('company')},

            ${COMPANY_COMPONENTS[0].View.getFragment('company')},
            ${COMPANY_COMPONENTS[0].Form.getFragment('company')},

            ${COMPANY_COMPONENTS[1].View.getFragment('company')},
            ${COMPANY_COMPONENTS[1].Form.getFragment('company')},

            ${COMPANY_COMPONENTS[2].View.getFragment('company')},
            ${COMPANY_COMPONENTS[2].Form.getFragment('company')},

            VATSettings{
              enabled,
              agency,
              startDate,
              IF,
              frequency,
              regime,
              percentages{ value, },
            },

            dashboard__Expenses: operationsByCategories(first: 100000, categories: $expensesCategories, from: $expensesFrom, to: $expensesTo, _rev: $rev){
              edges{
                node{
                  accountCode,
                  type,
                  amount,
                }
              }
            },

            dashboard__Result: operationsByCategories(first: 100000, categories: $resultCategories, from: $profitLossFrom, to: $profitLossTo, _rev: $rev) @skip(if: $privateModeOn){
              edges{
                node{
                  date,
                  accountCode,
                  categoryCode: _categoryCode,
                  type,
                  amount,
                }
              }
            },

            salesStatus{

              # last 365 days
              open{
                totalCount,
                amount,

              },

              # last 365 days
              overdue{
                totalCount,
                amount,

              },

              # last 30 days
              closed{
                totalCount,
                amount,
              },

            },

            logo {
              objectId,
              url,
            },

            objectId,

            id,
            displayName,
            periodType,
            lastTransactionIndex, lastPaymentsTransactionIndex,

            createdAt,
            updatedAt,

            settings {
              periodType,
              closureEnabled,
              closureDate,
            },
            salesSettings {
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
            expensesSettings {
              defaultExpenseAccountCode,
              preferredPaymentMethod,
            },
            paymentsSettings {
              defaultDepositToAccountCode,
              preferredPaymentMethod,
            },

          },

          companies(first: 100000){
            edges{
              node{
                objectId,
                id,
                displayName,
                periodType,
                lastTransactionIndex, lastPaymentsTransactionIndex,
                createdAt,
                updatedAt,
              }
            }
          },

        }
      `,
    },
  });
}

// module.exports = (props) => (
//   <Relay.RootContainer
//     forceFetch={true}
//     Component={wrapWithC(Dashboard, props)}
//     route={new DashboardRoute({companyId: props.params.app})}
//     renderLoading={function() {
//       return (
//         <div className='loading'>
//
//           <Sidebar
//             viewer={props.viewer}
//             company={props.company}
//             companies={props.companies || []}
//             page='/dashboard'
//           />
//
//           <div className='content'>
//
//               <Loading/>
//
//           </div>
//
//         </div>
//       );
//     }}
//   />
// );

function createContainer({ viewer, params, company, companies, }){
  const Route = new DashboardRoute({companyId: params.app});
  const MyComponent = wrapWithC(Dashboard, { params, route: Route, });

  class Container extends React.Component{
    shouldComponentUpdate(){
      return false;
    }
    render(){
      return (
        <Relay.RootContainer
          Component={MyComponent}
          forceFetch={true}
          route={Route}
          renderFetched={function(data, readyState){
            return (
              <MyComponent
                {...data}
                stale={readyState.stale}
              />
            );
          }}
          renderLoading={function() {
            return (
              <MyComponent
                {...{viewer: {
                  ...viewer,
                  company: company,
                  companies: companies || { edges: [], },
                }}}
                loading={true}
              />
            );
          }}
        />
      );
    }
  }

  return () => Container;
}

class S extends React.Component{
  constructor(props) {
    super(props);
    this.cache = new LazyCache(this, {
      Component: {
        params: [
          // props that effect how redux-form connects to the redux store
        ],
        fn: createContainer(props),
      }
    });
  }
  shouldComponentUpdate(){
    return false;
  }
  componentWillReceiveProps(nextProps) {
    this.cache.componentWillReceiveProps(nextProps);
  }
  render() {
    const {Component} = this.cache;
    return <Component {...this.props}/>;
  }
}

module.exports = S;


function getState(){
  const state = {};

  const expensesDate = localStorage.getItem('dashboard.expensesDate');
  if(expensesDate){
    state.expensesDate = parseInt(expensesDate);
    let from = null, to = null;
    switch(expensesDate){
      case 1: // last 365 days
        from = moment().subtract(365, 'days').toDate();
        break;
      case 2: // today
        from = moment().toDate();
        to = moment().toDate();
        break;
      case 3: // yesterday
        from = moment().subtract(1, 'day').toDate();
        to = moment().subtract(1, 'day').toDate();
        break;
      case 4: // this week
        from = moment().startOf('isoWeek').toDate();
        to = moment().endOf('isoWeek').toDate();
        break;
      case 5: // this month
        from = moment().startOf('month').toDate();
        to = moment().endOf('month').toDate();
        break;
      case 6: // this quarter
        from = moment().startOf('quarter').toDate();
        to = moment().endOf('quarter').toDate();
        break;
      case 7: // this year
        from = moment().startOf('year').toDate();
        to = moment().endOf('year').toDate();
        break;
      case 8: // last week
        from = moment().subtract(1, 'week').startOf('isoWeek').toDate();
        to = moment().subtract(1, 'week').endOf('isoWeek').toDate();
        break;
      case 9: // last month
        from = moment().subtract(1, 'month').startOf('month').toDate();
        to = moment().subtract(1, 'month').endOf('month').toDate();
        break;
      case 10: // last quarter
        from = moment().subtract(1, 'quarter').startOf('quarter').toDate();
        to = moment().subtract(1, 'quarter').endOf('quarter').toDate();
        break;
      case 11: // last year
        from = moment().subtract(1, 'year').startOf('year').toDate();
        to = moment().subtract(1, 'year').endOf('year').toDate();
        break;
      case 12: // custom
        break;
      case 13: // all dates
        break;
    }
    state.expensesFrom = from;
    state.expensesTo = to;
  }else{
    state.expensesDate = 12;
    state.expensesFrom = null;
    state.expensesTo = null;
  }

  const profitLossDate = localStorage.getItem('dashboard.profitLossDate');
  if(profitLossDate){
    state.profitLossDate = parseInt(profitLossDate);
    let from = null, to = null;
    switch(profitLossDate){
      case 1: // last 365 days
        from = moment().subtract(365, 'days').toDate();
        break;
      case 2: // today
        from = moment().toDate();
        to = moment().toDate();
        break;
      case 3: // yesterday
        from = moment().subtract(1, 'day').toDate();
        to = moment().subtract(1, 'day').toDate();
        break;
      case 4: // this week
        from = moment().startOf('isoWeek').toDate();
        to = moment().endOf('isoWeek').toDate();
        break;
      case 5: // this month
        from = moment().startOf('month').toDate();
        to = moment().endOf('month').toDate();
        break;
      case 6: // this quarter
        from = moment().startOf('quarter').toDate();
        to = moment().endOf('quarter').toDate();
        break;
      case 7: // this year
        from = moment().startOf('year').toDate();
        to = moment().endOf('year').toDate();
        break;
      case 8: // last week
        from = moment().subtract(1, 'week').startOf('isoWeek').toDate();
        to = moment().subtract(1, 'week').endOf('isoWeek').toDate();
        break;
      case 9: // last month
        from = moment().subtract(1, 'month').startOf('month').toDate();
        to = moment().subtract(1, 'month').endOf('month').toDate();
        break;
      case 10: // last quarter
        from = moment().subtract(1, 'quarter').startOf('quarter').toDate();
        to = moment().subtract(1, 'quarter').endOf('quarter').toDate();
        break;
      case 11: // last year
        from = moment().subtract(1, 'year').startOf('year').toDate();
        to = moment().subtract(1, 'year').endOf('year').toDate();
        break;
      case 12: // custom
        break;
      case 13: // all dates
        break;
    }
    state.profitLossFrom = from;
    state.profitLossTo = to;
  }else{
    state.profitLossDate = 12;
    state.profitLossFrom = null;
    state.profitLossTo = null;
  }


  return state;
}
