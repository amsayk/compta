/**
 *
 */

import Relay from 'react-relay';

export default class  extends Relay.Mutation {
  static fragments = {
    viewer: () => Relay.QL`
      fragment on User {
        id,
      }
    `,
  };
  getMutation() {
    return Relay.QL`mutation{logOut}`;
  }
  getFatQuery() {
    return Relay.QL`
      fragment on LogOutPayload {
        viewer,
      }
    `;
  }
  getConfigs() {
    return [{
      type: 'REQUIRED_CHILDREN',
      // Forces these fragments to be included in the query
      children: [Relay.QL`
        fragment on LogOutPayload {
          viewer,
        }
      `],
    },];
  }
  getVariables() {
    return {
      viewerId: this.props.viewer.id, // TODO: Needed To clear the cache!!!
    };
  }
  getOptimisticResponse() {
    return {
      // get added until the server responds
      viewer: null,
    };
  }
}
