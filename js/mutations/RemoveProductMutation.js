import Relay from 'react-relay';

export default class RemoveProductMutation extends Relay.Mutation {
  static fragments = {
    company: () => Relay.QL`
      fragment on Company {
        id,
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
    return Relay.QL`mutation{delProduct}`;
  }
  getFatQuery() {
    return Relay.QL`
      fragment on RemoveProductPayload {
        deletedProductId,
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
      connectionName: 'companyProducts',
      deletedIDFieldName: 'deletedProductId',
    }];
  }
  getVariables() {
    return {
      id: this.props.product.id,
      sessionToken: this.props.viewer.sessionToken,
    };
  }
  getOptimisticResponse() {
    const companyPayload = {id: this.props.company.id};
    return {
      deletedProductId: this.props.product.id,
      company: companyPayload,
    };
  }
}
