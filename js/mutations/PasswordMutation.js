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
    return this.props.type === 'change'
      ? Relay.QL`mutation{changePassword}`
      : Relay.QL`mutation{setPassword}`;
  }
  getFatQuery() {

    if(this.props.type === 'change' ){
      return Relay.QL`
      fragment on ChangePasswordPayload {
        viewer,
      }
    `;
    }

    return Relay.QL`
    fragment on SetPasswordPayload {
      viewer,
    }
  `;
  }
  getCollisionKey() {
    // Give the same key to like mutations that affect the same story
    return `account_${this.props.viewer.id}`;
  }
  getConfigs() {

    if(this.props.type === 'change' ) {
      return [{
        type: 'FIELDS_CHANGE',
        fieldIDs: {
          viewer: this.props.viewer.id,
        },
      }, {
        type: 'REQUIRED_CHILDREN',
        // Forces these fragments to be included in the query
        children: [Relay.QL`
        fragment on ChangePasswordPayload {
          viewer,
        }
      `],
      },];
    }

    return [{
      type: 'FIELDS_CHANGE',
      fieldIDs: {
        viewer: this.props.viewer.id,
      },
    }, {
      type: 'REQUIRED_CHILDREN',
      // Forces these fragments to be included in the query
      children: [Relay.QL`
        fragment on SetPasswordPayload {
          viewer,
        }
      `],
    },];
  }
  getVariables() {

    if(this.props.type === 'change'){
      return{
        id: this.props.viewer.objectId,
        sessionToken: this.props.viewer.sessionToken,
        password: this.props.password,
        currentPassword: this.props.currentPassword,
      }
    }

    return {
      id: this.props.viewer.objectId,
      sessionToken: this.props.viewer.sessionToken,
      password: this.props.password,
    };
  }
  getOptimisticResponse() {
    return null;
  }
}
