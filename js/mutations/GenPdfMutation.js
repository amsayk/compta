import Relay from 'react-relay';

export default class GenPdfMutation extends Relay.Mutation {
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
    return Relay.QL`mutation{genPdf}`;
  }
  getFatQuery() {
    return Relay.QL`
      fragment on GenPdfPayload {
        pdf,
      }
    `;
  }
  getConfigs() {
    return [{
      type: 'REQUIRED_CHILDREN',
      // Forces these fragments to be included in the query
      children: [Relay.QL`
        fragment on GenPdfPayload {
          pdf,
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
