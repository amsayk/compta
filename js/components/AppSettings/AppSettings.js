import React, {Component,PropTypes} from 'react';
import Relay from 'react-relay';

import Sidebar from '../Sidebar/AppSidebar';
import Loading from '../Loading/Loading';

import CSSModules from 'react-css-modules';

import { PAYMENTS_OF_INVOICES_ACCOUNTS_CATEGORIES, PAYMENTS_OF_BILLS_ACCOUNTS_CATEGORIES, EXPENSES_ACCOUNTS_CATEGORIES, SALES_ACCOUNTS_CATEGORIES, } from '../../../data/constants';

import styles from './AppSettings.scss';

import AppSettingsRoute from '../../routes/AppSettingsRoute';

import RemoveCompanyMutation from '../../mutations/RemoveCompanyMutation';
import UpdateCompanyMutation from '../../mutations/UpdateCompanyMutation';
import UpdateCompanySettingsMutation from '../../mutations/UpdateCompanySettingsMutation';
import UpdateCompanySalesSettingsMutation from '../../mutations/UpdateCompanySalesSettingsMutation';
import UpdateCompanyExpensesSettingsMutation from '../../mutations/UpdateCompanyExpensesSettingsMutation';
import UpdateCompanyPaymentsSettingsMutation from '../../mutations/UpdateCompanyPaymentsSettingsMutation';

import {getBodyHeight, getBodyWidth} from '../../utils/dimensions';

import ManageProducts from '../Products/Items/Items';

import ManageCompanyForm, {COMPANY_COMPONENTS,} from './ManageCompanyForm/ManageCompanyForm';

import {SALES_SETTINGS_COMPANY_COMPONENTS,} from './ManageCompanyForm/SalesSettings';
import {EXPENSES_SETTINGS_COMPANY_COMPONENTS,} from './ManageCompanyForm/ExpensesSettings';
import {PAYMENTS_SETTINGS_COMPANY_COMPONENTS,} from './ManageCompanyForm/PaymentsSettings';
import {ADVANCED_SETTINGS_COMPANY_COMPONENTS,} from './ManageCompanyForm/AdvancedSettings';

import messages from './messages';

import {
  intlShape,
} from 'react-intl';

const Title = (company) => company.displayName;

@CSSModules(styles, {allowMultiple: true})
class AppSettings extends Component {

  static contextTypes = {
    intl: intlShape.isRequired,
    store: PropTypes.object.isRequired,
  };

  state = {
    modalOpen: false
  };

  _onManageSettingsClicked = (e) => {
    e.preventDefault();
    this.setState({
      modalOpen: true,
      modalType: 'settings'
    });
  };

  _onManageProductsClicked = (e) => {
    e&&e.preventDefault();
    this.setState({
      modalOpen: true,
      modalType: 'products'
    });
  };

  _onDelClicked = (e) => {
    e.preventDefault();
  };

  _onManageCollaborators = (e) => {
    e.preventDefault();
  };

  _close = () => {
    this.setState({ modalOpen: false, modalType: undefined, });
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

      case 'products':

      return (
        <ManageProducts
          onCancel={this._close}
          company={this.props.company}
          viewer={this.props.viewer}
          root={this.props.viewer}
        />
      );
    }

  };

  render() {
    const { company, viewer, companies, route, } = this.props;
    const {formatMessage,} = this.context.intl;
    return (
      <div className=''>

        <Sidebar
          route={route}
          company={company}
          companies={companies.edges.map(({ node: company, }) => company)}
          viewer={viewer}
          page='/settings'
        />

        <div className='content'>

          <div styleName='page'>

            <div styleName='toolbar'>

              <div styleName='title'>
                <div styleName='section'>{Title(company)}</div>

                <div>
                  <span styleName='subsection'>{formatMessage(messages.Subtitle)}</span>
                  <span styleName='details'></span>
                </div>

              </div>

              <div styleName='actions'></div>

            </div>

            <div styleName='app-settings-page' className='scrollable-shadow scrollable' style={{zIndex: 0, top: 96, position: 'absolute', height: getBodyHeight() - 96, width: getBodyWidth() - 225, }}>


              <div styleName='fieldset'>

                <div styleName='legend'>{formatMessage(messages.Legend)}</div>

                <div styleName='description-1'>{formatMessage(messages.Desc1)}</div>

                <div styleName='fields'>

                  <div styleName='field'>

                    <div styleName='left' style={{width:'56%'}}>
                      <div styleName='label centered' style={{padding:'0 20px'}}>
                        <div styleName='text'>{formatMessage(messages.LeftLabel)}</div>
                        <div styleName='description-2'>{formatMessage(messages.LeftDesc)}</div>
                      </div>
                    </div>

                    <div styleName='right' style={{marginLeft:'56%'}}>

                      <div styleName='input'>

                        <a href='javascript:;' onClick={this._onManageSettingsClicked} role='button' style={{width:'80%',minWidth:'80%'}}
                           styleName='button unselectable primary'>
                          <span>{formatMessage(messages.Action)}</span>
                        </a>

                      </div>

                    </div>

                  </div>

                </div>

              </div>

              <br/>

              <div styleName='fieldset'>

                <div styleName='legend'>{formatMessage(messages.AppManagementLegend)}</div>

                <div styleName='description-1'>{formatMessage(messages.AppManagementLegendDesc)}</div>

                <div styleName='fields'>

                  <div styleName='field'>

                    <div styleName='left' style={{width:'56%'}}>
                      <div styleName='label centered' style={{padding:'0 20px'}}>
                        <div styleName='text'>{formatMessage(messages.CollaboratorsLabel)}</div>
                        <div styleName='description-2'>{formatMessage(messages.CollaboratorsDesc)}</div>
                      </div>
                    </div>

                    <div styleName='right' style={{marginLeft:'56%'}}>

                      <div styleName='input'>

                        <a href='javascript:;' onClick={this._onManageCollaborators} role='button' style={{width:'80%',minWidth:'80%'}}
                           styleName='button unselectable primary'>
                          <span>{formatMessage(messages.CollaboratorsAction)}</span>
                        </a>

                      </div>

                    </div>

                  </div>

                  <div styleName='field'>

                    <div styleName='left' style={{width:'56%'}}>
                      <div styleName='label centered' style={{padding:'0 20px'}}>
                        <div styleName='text'>{formatMessage(messages.ProductsLabel)}</div>
                        <div styleName='description-2'>{formatMessage(messages.ProductsDesc)}</div>
                      </div>
                    </div>

                    <div styleName='right' style={{marginLeft:'56%'}}>

                      <div styleName='input'>

                        <a href='javascript:;' onClick={this._onManageProductsClicked} role='button' style={{width:'80%',minWidth:'80%'}}
                           styleName='button unselectable primary'>
                          <span>{formatMessage(messages.ProductsAction)}</span>
                        </a>

                      </div>

                    </div>

                  </div>

                  <div styleName='field'>

                    <div styleName='left' style={{width:'56%'}}>
                      <div styleName='label centered' style={{padding:'0 20px'}}>
                        <div styleName='text'>{formatMessage(messages.AppManagementLegendLeftLabel)}</div>
                        <div styleName='description-2'>{formatMessage(messages.AppManagementLegendLeftDesc)}</div>
                      </div>
                    </div>

                    <div styleName='right' style={{marginLeft:'56%'}}>

                      <div styleName='input'>

                        <a href='javascript:;' onClick={this._onDelClicked} role='button' style={{width:'80%',minWidth:'80%'}}
                           styleName='button unselectable btn-danger'>
                          <span>{formatMessage(messages.AppManagementLegendDelAction)}</span>
                        </a>

                      </div>

                    </div>

                  </div>

                </div>

              </div>

            </div>

          </div>

        </div>

        {this._renderForm()}

      </div>
    );
  }
}

function wrapWithC(Component, props) {
  class CWrapper extends React.Component {
    render() {
      return React.createElement(
        Component, {
          ...props,
          companies: this.props.viewer.companies,
          company: this.props.viewer.company,
          expensesAccounts: this.props.viewer.expensesAccounts,
          paymentsAccounts: this.props.viewer.paymentsAccounts,
          salesAccounts: this.props.viewer.salesAccounts,
          viewer: this.props.viewer,
          root: this.props.viewer,
        },
        this.props.children
      );
    }
  }

  return Relay.createContainer(CWrapper, {
    initialVariables: {
      companyId: props.params.app,
      paymentsAccountCategories: PAYMENTS_OF_INVOICES_ACCOUNTS_CATEGORIES,
      expensesAccountCategories: PAYMENTS_OF_BILLS_ACCOUNTS_CATEGORIES,
      salesAccountCategories: SALES_ACCOUNTS_CATEGORIES,
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

            objectId,

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

            edges {

              node{

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

                objectId,
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

module.exports = (props) => {
  const route = new AppSettingsRoute({companyId: props.params.app});
  return (
    <Relay.RootContainer
      forceFetch={true}
      Component={wrapWithC(AppSettings, { ...props, route})}
      route={route}
      renderLoading={function() {
        return (
          <div className='loading'>

            <Sidebar
              route={route}
              viewer={props.viewer}
              company={props.company}
              companies={props.companies || []}
              page='/settings'
            />

            <div className='content'>

                <Loading/>

            </div>

          </div>
        );
      }}
    />
  );
};
