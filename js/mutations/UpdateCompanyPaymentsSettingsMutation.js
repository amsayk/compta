import Relay from 'react-relay';

export default class extends Relay.Mutation {
  static fragments = {
    company: () => Relay.QL`
      fragment on Company {
        id,
      }
    `,
  };
  getMutation() {
    return Relay.QL`mutation{updateCompanyPaymentsSettings}`;
  }
  getFatQuery() {
    return Relay.QL`
      fragment on UpdateCompanyPaymentsSettingsPayload {
        company{
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
      }
    `;
  }
  getCollisionKey() {
    // Give the same key to like mutations that affect the same story
    return `update_company_${this.props.company.id}`;
  }
  getConfigs() {
    return [{
      type: 'FIELDS_CHANGE',
      fieldIDs: {
        company: this.props.company.id,
      },
    }, {
      type: 'REQUIRED_CHILDREN',
      // Forces these fragments to be included in the query
      children: [Relay.QL`
        fragment on UpdateCompanyPaymentsSettingsPayload {
          company{
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
        }
      `],
    },];
  }
  getVariables() {
    return {
      id: this.props.company.id,
      settings: this.props.settings,
      sessionToken: this.props.sessionToken,
    };
  }
  getOptimisticResponse() {
    return {
      // FIXME: totalCount gets updated optimistically, but this edge does not
      // get added until the server responds
      company: {
        ...this.props.company,
        paymentsSettings: this.props.settings,
      },
    };
  }
}
