import Relay from 'react-relay';

export default class RemoveSaleMutation extends Relay.Mutation {
  static fragments = {
    company: () => Relay.QL`
      fragment on Company {
        id,
        objectId,
      }
    `,
    sale: () => Relay.QL`
      fragment on Sale {
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
    return Relay.QL`mutation{removeSale}`;
  }
  getFatQuery() {
    return Relay.QL`
      fragment on RemoveSalePayload {
        deletedSaleId,
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
      connectionName: 'sales',
      deletedIDFieldName: 'deletedSaleId',
    }];
  }
  getVariables() {
    return {
      companyId: this.props.company.id,
      id: this.props.sale.objectId,
      sessionToken: this.props.viewer.sessionToken,
    };
  }
  getOptimisticResponse() {
    return null;
  }
}
