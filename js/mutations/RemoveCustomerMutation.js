import Relay from 'react-relay';

export default class RemoveCustomerMutation extends Relay.Mutation {
  static fragments = {
    customer: () => Relay.QL`
      fragment on Customer {
        id,
        objectId,
      }
    `,
    company: () => Relay.QL`
      fragment on Company {
        id,
        objectId,
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
    return Relay.QL`mutation{removeCustomer}`;
  }
  getFatQuery() {
    return Relay.QL`
      fragment on RemoveCustomerPayload {
        deletedCustomerId,
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
      deletedIDFieldName: 'deletedCustomerId',
    }, {
      type: 'NODE_DELETE',
      parentName: 'company',
      parentID: this.props.company.id,
      connectionName: 'customers',
      deletedIDFieldName: 'deletedCustomerId',
    }];
  }
  getVariables() {
    return {
      id: this.props.customer.id,
      sessionToken: this.props.viewer.sessionToken,
    };
  }
  getOptimisticResponse() {
    const companyPayload = {id: this.props.company.id};
    return {
      deletedCustomerId: this.props.customer.id,
      company: companyPayload,
    };
  }
}
