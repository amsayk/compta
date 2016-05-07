import Relay from 'react-relay';

export default class RemoveVendorMutation extends Relay.Mutation {
  static fragments = {
    vendor: () => Relay.QL`
      fragment on Vendor {
        id,
        objectId,
      }
    `,
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
    return Relay.QL`mutation{removeVendor}`;
  }
  getFatQuery() {
    return Relay.QL`
      fragment on RemoveVendorPayload {
        deletedVendorId,
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
      connectionName: 'people',
      deletedIDFieldName: 'deletedVendorId',
    }, {
      type: 'NODE_DELETE',
      parentName: 'company',
      parentID: this.props.company.id,
      connectionName: 'vendors',
      deletedIDFieldName: 'deletedVendorId',
    }];
  }
  getVariables() {
    return {
      id: this.props.vendor.id,
      sessionToken: this.props.viewer.sessionToken,
    };
  }
  getOptimisticResponse() {
    const companyPayload = {id: this.props.company.id};
    return {
      deletedVendorId: this.props.vendor.id,
      company: companyPayload,
    };
  }
}
