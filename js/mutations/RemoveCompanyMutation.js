import Relay from 'react-relay';

export default class RemoveCompanyMutation extends Relay.Mutation {
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
    return Relay.QL`mutation{removeCompany}`;
  }
  getFatQuery() {
    return Relay.QL`
      fragment on RemoveCompanyPayload {
        deletedCompanyId,
        viewer,
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
      parentName: 'viewer',
      parentID: this.props.viewer.id,
      connectionName: 'companies',
      deletedIDFieldName: 'deletedCompanyId',
    }];
  }
  getVariables() {
    return {
      id: this.props.company.id,
      sessionToken: this.props.viewer.sessionToken,
    };
  }
  getOptimisticResponse() {
    const viewerPayload = {id: this.props.viewer.id};
    return {
      deletedCompanyId: this.props.company.id,
      viewer: viewerPayload,
    };
  }
}
