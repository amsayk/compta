import Relay from 'react-relay';

export default class UpdateCompanyMutation extends Relay.Mutation {
  static fragments = {
    company: () => Relay.QL`
      fragment on Company {
        id,
      }
    `,
  };
  getMutation() {
    return Relay.QL`mutation{updateCompany}`;
  }
  getFatQuery() {
    return Relay.QL`
      fragment on UpdateCompanyPayload {
        company{
          company_streetAddress,
          company_cityTown,
          company_stateProvince,
          company_postalCode,
          company_country,
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
        fragment on UpdateCompanyPayload {
          company{
            company_streetAddress,
            company_cityTown,
            company_stateProvince,
            company_postalCode,
            company_country,
            objectId,
            logo{
              objectId,
              url,
            },
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
      fieldInfos: this.props.fieldInfos,
      sessionToken: this.props.sessionToken,
      logo: this.props.logo,
    };
  }
  getOptimisticResponse() {
    return {
      // FIXME: totalCount gets updated optimistically, but this edge does not
      // get added until the server responds
      company: {
        logo: this.props.logo ? {
          ...this.props.logo,
          url: `data:${this.props.logo.type};base64,${this.props.logo.dataBase64}`,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        } : null,
        ...this.props.company,
        ...this.props.fieldInfos.reduce(function (props, {fieldName, value}) {
          return {
            ...props,
            [fieldName]: value,
          };
        }, {}),
      },
    };
  }
}
