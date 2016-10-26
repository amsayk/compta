import Relay from 'react-relay';

export default class  extends Relay.Mutation {
  static fragments = {
    viewer: () => Relay.QL`
     fragment on User {
         id,
         objectId,
         sessionToken,
     }
    `,
  };
  getMutation() {
    return Relay.QL`mutation{updateAccount}`;
  }
  getFatQuery() {
    return Relay.QL`
      fragment on UpdateAccountPayload {
        viewer,
      }
    `;
  }
  getCollisionKey() {
    // Give the same key to like mutations that affect the same story
    return `account_${this.props.viewer.id}`;
  }
  getConfigs() {
    return [{
      type: 'FIELDS_CHANGE',
      fieldIDs: {
        viewer: this.props.viewer.id,
      },
    }, {
      type: 'REQUIRED_CHILDREN',
      // Forces these fragments to be included in the query
      children: [Relay.QL`
        fragment on UpdateAccountPayload {
          viewer,
        }
      `],
    },];
  }
  getVariables() {
    return {
      id: this.props.viewer.objectId,
      sessionToken: this.props.viewer.sessionToken,
      displayName: this.props.displayName,
      email: this.props.email,
    };
  }
  getOptimisticResponse() {
    return null;
  }
}
