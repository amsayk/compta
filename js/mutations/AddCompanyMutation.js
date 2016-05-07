import Relay from 'react-relay';

export default class AddCompanyMutation extends Relay.Mutation {
  static fragments = {
    viewer: () => Relay.QL`
      fragment on User {
        id,
        sessionToken,
      }
    `,
  };
  getMutation() {
    return Relay.QL`mutation{addCompany}`;
  }
  getFatQuery() {
    return Relay.QL`
      fragment on AddCompanyPayload {
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
        fragment on AddCompanyPayload {
          companyEdge,
        }
      `],
    },];
  }
  getVariables() {
    return {
      displayName: this.props.displayName,
      periodType: this.props.periodType,
      sessionToken: this.props.viewer.sessionToken,
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
