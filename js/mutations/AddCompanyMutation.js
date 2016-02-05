/**
 *
 */

import Relay from 'react-relay';

export default class AddCompanyMutation extends Relay.Mutation {
  static fragments = {
    root: () => Relay.QL`
      fragment on Query {
        id,
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
        root {
          id,
          companies,
        },
      }
    `;
  }
  getConfigs() {
    return [{
      type: 'RANGE_ADD',
      parentName: 'root',
      parentID: this.props.root.id,
      connectionName: 'companies',
      edgeName: 'companyEdge',
      rangeBehaviors: {
        '': 'append',
      },
    }, {
      type: 'REQUIRED_CHILDREN',
      // Forces these fragments to be included in the query
      children: [Relay.QL`
        fragment on AddCompanyPayload {
          companyEdge
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
    return {
      // FIXME: totalCount gets updated optimistically, but this edge does not
      // get added until the server responds
      companyEdge: {
        node: {
          displayName: this.props.displayName,
          periodType: this.props.periodType,
        },
      },
      root: {
        id: this.props.root.id,
      },
    };
  }
}
