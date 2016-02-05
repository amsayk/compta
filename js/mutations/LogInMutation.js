/**
 *
 */

import Relay from 'react-relay';

export default class  extends Relay.Mutation {
  static fragments = {
    //viewer: () => Relay.QL`
    //  fragment on User {
    //      id,
    //      displayName,
    //      username,
    //      email,
    //      createdAt,
    //      updatedAt,
    //      sessionToken,
    //  }
    //`,
  };
  getMutation() {
    return Relay.QL`mutation{logIn}`;
  }
  getFatQuery() {
    return Relay.QL`
      fragment on LogInPayload {
        viewer,
      }
    `;
  }
  getConfigs() {
    return [{
      type: 'REQUIRED_CHILDREN',
      // Forces these fragments to be included in the query
      children: [Relay.QL`
        fragment on LogInPayload {
          viewer,
        }
      `],
    },];
  }
  getVariables() {
    return {
      email: this.props.email,
      password: this.props.password,
    };
  }
  getOptimisticResponse() {
    return null;
  }
}
