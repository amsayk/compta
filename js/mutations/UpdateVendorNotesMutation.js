import Relay from 'react-relay';

export default class extends Relay.Mutation {
  static fragments = {
    vendor: () => Relay.QL`
      fragment on Vendor {
        id,
        objectId,
      }
    `,
  };
  getMutation() {
    return Relay.QL`mutation{updateVendorNotes}`;
  }
  getFatQuery() {
    return Relay.QL`
      fragment on UpdateVendorNotesPayload {
        vendor{
          id,
          notes,

        },
      }
    `;
  }
  getCollisionKey() {
    // Give the same key to like mutations that affect the same story
    return `update_company_${this.props.vendor.id}`;
  }
  getConfigs() {
    return [{
      type: 'FIELDS_CHANGE',
      fieldIDs: {
        vendor: this.props.vendor.id,
      },
    }, {
      type: 'REQUIRED_CHILDREN',
      // Forces these fragments to be included in the query
      children: [Relay.QL`
        fragment on UpdateVendorNotesPayload {
          vendor{
            id,
            notes,

          },
        }
      `],
    },];
  }
  getVariables() {
    return {
      id: this.props.vendor.objectId,
      companyId: this.props.company.id,
      notes: this.props.notes,
      sessionToken: this.props.sessionToken,
    };
  }
  getOptimisticResponse() {
    return {
      // FIXME: totalCount gets updated optimistically, but this edge does not
      // get added until the server responds
      vendor: {
        ...this.props.vendor,
        notes: this.props.notes,
      },
    };
  }
}
