import Relay from 'react-relay';

export default class AddCustomerMutation extends Relay.Mutation {
  static fragments = {
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
    return Relay.QL`mutation{addCustomer}`;
  }
  getFatQuery() {
    return Relay.QL`
      fragment on AddCustomerPayload {
        customerEdge{
          node{
            objectId,
            id,
            displayName,
            image,
            title,
            givenName,
            middleName,
            familyName,
            affiliation,
            emails,
            phone,
            mobile,
            fax,
            billing_streetAddress,
            billing_cityTown,
            billing_stateProvince,
            billing_postalCode,
            billing_country,
            notes,
            updatedAt,
            createdAt,
          }
        },
        company {
          id,
          customers,
          people,
        },
      }
    `;
  }
  getConfigs() {
    return [{
      type: 'RANGE_ADD',
      parentName: 'company',
      parentID: this.props.company.id,
      connectionName: 'customers',
      edgeName: 'customerEdge',
      rangeBehaviors: {
        '': 'prepend',
      },
    }, {
      type: 'RANGE_ADD',
      parentName: 'company',
      parentID: this.props.company.id,
      connectionName: 'people',
      edgeName: 'customerEdge',
      rangeBehaviors: {
        '': 'prepend',
      },
    }, {
      type: 'REQUIRED_CHILDREN',
      // Forces these fragments to be included in the query
      children: [Relay.QL`
        fragment on AddCustomerPayload {
          customerEdge{
            node{
              objectId,
              id,
              displayName,
              image,
              title,
              givenName,
              middleName,
              familyName,
              affiliation,
              emails,
              phone,
              mobile,
              fax,
              billing_streetAddress,
              billing_cityTown,
              billing_stateProvince,
              billing_postalCode,
              billing_country,
              notes,
              updatedAt,
              createdAt,
            },
          },
        }
      `],
    },];
  }
  getVariables() {
    return {
      id: this.props.id,
      sessionToken: this.props.viewer.sessionToken,
      companyId: this.props.company.id,
      fieldInfos: this.props.fieldInfos,
    };
  }
  getOptimisticResponse() {
    return {
      // FIXME: totalCount gets updated optimistically, but this edge does not
      // get added until the server responds
      customerEdge: {
        node: {
          company: this.props.company,
          companyId: this.props.company.id,
          ...this.props.fieldInfos.reduce(function (props, {fieldName, value}) {
            return {
              ...props,
              [fieldName]: value,
            };
          }, {}),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      },
      company: {
        id: this.props.company.id,
      },
    };
  }
}
