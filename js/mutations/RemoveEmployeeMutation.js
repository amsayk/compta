import Relay from 'react-relay';

export default class RemoveEmployeeMutation extends Relay.Mutation {
  static fragments = {
    employee: () => Relay.QL`
      fragment on Employee {
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
    return Relay.QL`mutation{removeEmployee}`;
  }
  getFatQuery() {
    return Relay.QL`
      fragment on RemoveEmployeePayload {
        deletedEmployeeId,
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
      deletedIDFieldName: 'deletedEmployeeId',
    }, {
      type: 'NODE_DELETE',
      parentName: 'company',
      parentID: this.props.company.id,
      connectionName: 'employees',
      deletedIDFieldName: 'deletedEmployeeId',
    }];
  }
  getVariables() {
    return {
      id: this.props.employee.id,
      sessionToken: this.props.viewer.sessionToken,
    };
  }
  getOptimisticResponse() {
    const companyPayload = {id: this.props.company.id};
    return {
      deletedEmployeeId: this.props.employee.id,
      company: companyPayload,
    };
  }
}
