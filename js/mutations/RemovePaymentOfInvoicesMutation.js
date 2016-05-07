import Relay from 'react-relay';

export default class RemovePaymentOfInvoicesMutation extends Relay.Mutation {
  static fragments = {
    company: () => Relay.QL`
      fragment on Company {
        id,
        objectId,
      }
    `,
    payment: () => Relay.QL`
      fragment on PaymentOfInvoices {
        id,
        objectId,
      }
    `,
    viewer: () => Relay.QL`
      fragment on User {
        id,
        sessionToken,
      }
    `,
  };
  getMutation() {
    return Relay.QL`mutation{removePaymentOfInvoices}`;
  }
  getFatQuery() {
    return Relay.QL`
      fragment on RemovePaymentOfInvoicesPayload {
        deletedPaymentId,
        company,
      }
    `;
  }
  getCollisionKey() {
    // Give the same key to like mutations that affect the same story
    return `update_company_${this.props.company.id}`;
  }
  getConfigs() {
    return [{
      type: 'NODE_DELETE',
      parentName: 'company',
      parentID: this.props.company.id,
      connectionName: 'paymentsOfInvoices',
      deletedIDFieldName: 'deletedPaymentId',
    }];
  }
  getVariables() {
    return {
      companyId: this.props.company.id,
      id: this.props.payment.objectId,
      sessionToken: this.props.viewer.sessionToken,
    };
  }
  getOptimisticResponse() {
    return null;
  }
}
