import Relay from 'react-relay';

export default class extends Relay.Mutation {
  static fragments = {
    customer: () => Relay.QL`
      fragment on Customer {
        id,
        objectId,
      }
    `,
  };
  getMutation() {
    return Relay.QL`mutation{updateCustomerNotes}`;
  }
  getFatQuery() {
    return Relay.QL`
      fragment on UpdateCustomerNotesPayload {
        customer{
          id,
          notes,

        },
      }
    `;
  }
  getCollisionKey() {
    // Give the same key to like mutations that affect the same story
    return `update_company_${this.props.customer.id}`;
  }
  getConfigs() {
    return [{
      type: 'FIELDS_CHANGE',
      fieldIDs: {
        customer: this.props.customer.id,
      },
    }, {
      type: 'REQUIRED_CHILDREN',
      // Forces these fragments to be included in the query
      children: [Relay.QL`
        fragment on UpdateCustomerNotesPayload {
          customer{
            id,
            notes,

          },
        }
      `],
    },];
  }
  getVariables() {
    return {
      id: this.props.customer.objectId,
      companyId: this.props.company.id,
      notes: this.props.notes,
      sessionToken: this.props.sessionToken,
    };
  }
  getOptimisticResponse() {
    return {
      // FIXME: totalCount gets updated optimistically, but this edge does not
      // get added until the server responds
      customer: {
        ...this.props.customer,
        notes: this.props.notes,
      },
    };
  }
}
