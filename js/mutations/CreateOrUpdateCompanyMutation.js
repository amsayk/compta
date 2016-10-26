import Relay from 'react-relay';

export default class CreateOrUpdateCompanyMutation extends Relay.Mutation {
  static fragments = {
    viewer: () => Relay.QL`
      fragment on User {
        id,
        sessionToken,
      }
    `,
    company: () => Relay.QL`
      fragment on Company {
        id,
      }
    `,
  };
  getMutation() {
    return Relay.QL`mutation{createOrUpdateCompany}`;
  }
  getFatQuery() {
    return Relay.QL`
      fragment on CreateOrUpdateCompanyPayload {
        companyEdge,
        viewer {
          id,
          companies,
        },
      }
    `;
  }
  getConfigs() {
    return [{
      type: 'RANGE_ADD',
      parentName: 'viewer',
      parentID: this.props.viewer.id,
      connectionName: 'companies',
      edgeName: 'companyEdge',
      rangeBehaviors: {
        '': 'prepend',
      },
    }, {
      type: 'REQUIRED_CHILDREN',
      // Forces these fragments to be included in the query
      children: [Relay.QL`
        fragment on CreateOrUpdateCompanyPayload {
          companyEdge{
            node{

              company_streetAddress,
              company_cityTown,
              company_stateProvince,
              company_postalCode,
              company_country,

              VATSettings{
                enabled,
                agency,
                startDate,
                IF,
                frequency,
                regime,
                percentages{ value, },
              },
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
            }

          },
        }
      `],
    },];
  }
  getVariables() {
    return {
      id: this.props.id,
      fieldInfos: this.props.fieldInfos,
      sessionToken: this.props.viewer.sessionToken,
      logo: this.props.logo,
    };
  }
  getOptimisticResponse() {
    return null;
    // return {
    //   // FIXME: totalCount gets updated optimistically, but this edge does not
    //   // get added until the server responds
    //   companyEdge: {
    //     node: {
    //       displayName: this.props.displayName,
    //       periodType: this.props.periodType,
    //     },
    //   },
    //   viewer: {
    //     id: this.props.viewer.id,
    //   },
    // };
  }
}
