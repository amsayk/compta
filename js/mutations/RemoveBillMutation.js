import Relay from 'react-relay';

export default class RemoveBillMutation extends Relay.Mutation {
  static fragments = {
    company: () => Relay.QL`
      fragment on Company {
        id,
        objectId,
      }
    `,
    bill: () => Relay.QL`
      fragment on Bill {
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
    return Relay.QL`mutation{removeBill}`;
  }
  getFatQuery() {
    return Relay.QL`
      fragment on RemoveBillPayload {
        deletedBillId,
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
      connectionName: 'bills',
      deletedIDFieldName: 'deletedBillId',
    }];
  }
  getVariables() {
    return {
      companyId: this.props.company.id,
      id: this.props.bill.objectId,
      sessionToken: this.props.viewer.sessionToken,
    };
  }
  getOptimisticResponse() {
    return null;
  }
}
