import Relay from 'react-relay';

export default class GenExcelMutation extends Relay.Mutation {
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
    return Relay.QL`mutation{genExcel}`;
  }
  getFatQuery() {
    return Relay.QL`
      fragment on GenExcelPayload {
        excel,
      }
    `;
  }
  getConfigs() {
    return [{
      type: 'REQUIRED_CHILDREN',
      // Forces these fragments to be included in the query
      children: [Relay.QL`
        fragment on GenExcelPayload {
          excel,
        }
      `],
    }];
  }
  getVariables() {
    return {
      type: this.props.type,
      objectId: this.props.objectId,
      sessionToken: this.props.viewer.sessionToken,
      companyId: this.props.company.id,
    };
  }
  getOptimisticResponse() {
    return null;
  }
}
