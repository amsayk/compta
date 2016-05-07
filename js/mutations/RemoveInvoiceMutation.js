import Relay from 'react-relay';

export default class RemoveInvoiceMutation extends Relay.Mutation {
  static fragments = {
    company: () => Relay.QL`
      fragment on Company {
        id,
        objectId,
      }
    `,
    invoice: () => Relay.QL`
      fragment on Invoice {
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
    return Relay.QL`mutation{removeInvoice}`;
  }
  getFatQuery() {
    return Relay.QL`
      fragment on RemoveInvoicePayload {
        deletedInvoiceId,
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
      connectionName: 'invoices',
      deletedIDFieldName: 'deletedInvoiceId',
    }];
  }
  getVariables() {
    return {
      companyId: this.props.company.id,
      id: this.props.invoice.objectId,
      sessionToken: this.props.viewer.sessionToken,
    };
  }
  getOptimisticResponse() {
    return null;
  }
}
