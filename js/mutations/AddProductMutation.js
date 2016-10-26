import Relay from 'react-relay';

export default class AddProductMutation extends Relay.Mutation {
  static fragments = {
    item: () => Relay.QL`
      fragment on Product {
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
    return Relay.QL`mutation{addProduct}`;
  }
  getFatQuery() {
    return Relay.QL`
      fragment on AddProductPayload {
        productEdge{
          node{
            active,
            className,
            objectId,
            id,
            type,
            displayName,
            image,
            image{
              objectId,
              url,
            },
            sku,
            salesEnabled,
            salesDesc,
            salesPrice,
            salesVATPart{
              inputType,
              value,
            },
            incomeAccountCode,
            purchaseEnabled,
            purchaseDesc,
            cost,
            purchaseVATPart{
              inputType,
              value,
            },
            purchaseAccountCode,
            updatedAt,
            createdAt,
          }
        },
        company {
          id,
          companyProducts,
        },
      }
    `;
  }
  getConfigs() {
    return [{
      type: 'RANGE_ADD',
      parentName: 'company',
      parentID: this.props.company.id,
      connectionName: 'companyProducts',
      edgeName: 'productEdge',
      rangeBehaviors: {
        '': 'prepend',
      },
    }, {
      type: 'REQUIRED_CHILDREN',
      // Forces these fragments to be included in the query
      children: [Relay.QL`
        fragment on AddProductPayload {
          productEdge{
            node{
              active,
              className,
              objectId,
              id,
              type,
              displayName,
              image,
              image{
                objectId,
                url,
              },
              sku,
              salesEnabled,
              salesDesc,
              salesPrice,
              salesVATPart{
                inputType,
                value,
              },
              incomeAccountCode,
              purchaseEnabled,
              purchaseDesc,
              cost,
              purchaseVATPart{
                inputType,
                value,
              },
              purchaseAccountCode,
              updatedAt,
              createdAt,
            }
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
      image: this.props.image,
    };
  }
  getOptimisticResponse() {
    return null;
    // return {
    //   // FIXME: totalCount gets updated optimistically, but this edge does not
    //   // get added until the server responds
    //   productEdge: {
    //     node: {
    //       image: this.props.image ? {
    //         ...this.props.image,
    //         url: `data:${this.props.image.type};base64,${this.props.image.dataBase64}`,
    //         createdAt: new Date().toISOString(),
    //         updatedAt: new Date().toISOString(),
    //       } : null,
    //       company: this.props.company,
    //       companyId: this.props.company.id,
    //       ...(this.props.item ? this.props.item : {} ),
    //       ...this.props.fieldInfos.reduce(function (props, {fieldName, value}) {
    //         return {
    //           ...props,
    //           [fieldName]: value,
    //         };
    //       }, {}),
    //       createdAt: new Date().toISOString(),
    //       updatedAt: new Date().toISOString(),
    //     },
    //   },
    //   company: {
    //     id: this.props.company.id,
    //   },
    // };
  }
}
