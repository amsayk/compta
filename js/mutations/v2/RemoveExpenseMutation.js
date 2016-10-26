import Relay from 'react-relay';

export default class RemoveExpenseMutation extends Relay.Mutation {
  static fragments = {
    company: () => Relay.QL`
      fragment on Company {
        id,
        objectId,
      }
    `,
    expense: () => Relay.QL`
      fragment on Expense {
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
    return Relay.QL`mutation{removeExpense}`;
  }
  getFatQuery() {
    return Relay.QL`
      fragment on RemoveExpensePayload {
        deletedExpenseId,
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
      connectionName: 'expenses',
      deletedIDFieldName: 'deletedExpenseId',
    }];
  }
  getVariables() {
    return {
      companyId: this.props.company.id,
      id: this.props.expense.objectId,
      sessionToken: this.props.viewer.sessionToken,
    };
  }
  getOptimisticResponse() {
    return null;
  }
}
