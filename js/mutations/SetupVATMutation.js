import Relay from 'react-relay';

export default class SetupVATMutation extends Relay.Mutation {
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
    declarations: () => Relay.QL`
      fragment on VATDeclarationHistoryConnection {
        edges{
          node{
            id,
            objectId,
          },
        }
      }
    `,
  };
  getMutation() {
    return Relay.QL`mutation{setupVAT}`;
  }
  getFatQuery() {
    return Relay.QL`
      fragment on SetupVATPayload {
        company,
        declarations,
      }
    `;
  }
  getConfigs() {

    const configs = [{
      type: 'FIELDS_CHANGE',
      fieldIDs: {
        company: this.props.company.id,
      },
    }];

    if(this.props.declarations){
      configs.push({
        type: 'FIELDS_CHANGE',
        fieldIDs: {
          declarations: this.props.declarations.edges.map(o => o.node.id),
        },
      });
    }

    configs.push({
      type: 'REQUIRED_CHILDREN',
      // Forces these fragments to be included in the query
      children: [Relay.QL`
        fragment on SetupVATPayload {
          company{

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

        }
      `]
    });

    return configs;
  }
  getVariables() {
    return {
      props: {
        agency: this.props.agency,
        frequency: this.props.frequency,
        startDate: this.props.startDate,
        regime: this.props.regime,
        IF: this.props.IF,
      },
      sessionToken: this.props.viewer.sessionToken,
      id: this.props.company.id,
    };
  }
  getOptimisticResponse() {
    return null;

  }
}
