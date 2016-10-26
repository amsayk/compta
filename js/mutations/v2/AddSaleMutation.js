import Relay from 'react-relay';

export default class AddSaleMutation extends Relay.Mutation {
  static fragments = {
    sale: () => Relay.QL`
      fragment on Sale {
        id,
        objectId,
      }
    `,
    _customer: () => Relay.QL`
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
    return Relay.QL`mutation{addSale}`;
  }
  getFatQuery() {
    return Relay.QL`
      fragment on AddSalePayload {
        saleEdge,
        customer{
          sales(first: 100000){
            totalCount,
            edges{
              node {

                ... on Node{

                  ... on Invoice{
                    id,
                  },
                  ... on PaymentOfInvoices {
                    id,
                  },

                  ... on Sale {

                    __opType: __typename,
                    createdAt,
                    objectId,
                    id,
                    customer{
                      objectId,
                      id,
                      displayName,
                      createdAt,
                    },
                    billingAddress,
                    date,
                    paymentMethod,
                    depositToAccountCode,
                    discountType,
                    discountValue,
                    memo,
                    files,
                    refNo,

                    totalHT,
                    VAT,

                    inputType,

                    itemsConnection : saleItemsConnection{
                      totalCount,
                      amountReceived,
                      edges{
                        cursor,
                        node{
                          objectId,
                          id,
                          index,
                          date,
                          item{
                            objectId,
                            id,
                            displayName,
                            createdAt,
                          },
                          description,
                          qty,
                          rate,
                          discountPart{
                            type,
                            value,
                          },

                          VATPart{
                            inputType,
                            value,
                          },

                        }
                      }
                    }

                  }

                }

              }
            }
          },
        },
        company {
          id,
          operationsByCategories(first: 100000){
            edges{
              node{
                type,
                accountCode,
                _categoryCode,
                amount,
              }
            }
          },
          salesStatus{
            open{
              totalCount,
              amount,
            },
            overdue{
              totalCount,
              amount,
            },
            closed{
              totalCount,
              amount,
            },
          },
          sales(first: 100000){
            totalCount,
            
            invoicesSumOfTotals,
            invoicesSumOfBalances,
            
            salesSumOfTotals,
            salesSumOfBalances,
            
            paymentsSumOfTotals,
            paymentsSumOfCredits,
                        
            edges{
              node {

                ... on Node {

                  ... on Invoice{
                    id,
                  },
                  ... on PaymentOfInvoices {
                    id,
                  },

                  ... on Sale {

                    __opType: __typename,
                    createdAt,
                    objectId,
                    id,
                    customer{
                      objectId,
                      id,
                      displayName,
                      createdAt,
                    },
                    billingAddress,
                    date,
                    paymentMethod,
                    depositToAccountCode,
                    discountType,
                    discountValue,
                    memo,
                    files,
                    refNo,

                    totalHT,
                    VAT,

                    inputType,

                    itemsConnection : saleItemsConnection{
                      totalCount,
                      amountReceived,
                      edges{
                        cursor,
                        node{
                          objectId,
                          id,
                          index,
                          date,
                          item{
                            objectId,
                            id,
                            displayName,
                            createdAt,
                          },
                          description,
                          qty,
                          rate,
                          discountPart{
                            type,
                            value,
                          },

                          VATPart{
                            inputType,
                            value,
                          },

                        }
                      }
                    }

                  }

                }

              }
            }
          },
        },
      }
    `;
  }
  getConfigs() {
    const cfg = [{
      type: 'RANGE_ADD',
      parentName: 'company',
      parentID: this.props.company.id,
      connectionName: 'sales',
      edgeName: 'saleEdge',
      rangeBehaviors: {
        'sortKey(-1)': 'prepend',
        '': 'append',
      },
    }];

    if(this.props._customer){
      cfg.push({
        type: 'RANGE_ADD',
        parentName: 'customer',
        parentID: this.props._customer.id,
        connectionName: 'sales',
        edgeName: 'saleEdge',
        rangeBehaviors: {
          'sortKey(-1)': 'prepend',
          '': 'append',
        },
      });
    }

    cfg.push({
      type: 'REQUIRED_CHILDREN',
      // Forces these fragments to be included in the query
      children: [Relay.QL`
        fragment on AddSalePayload {
          saleEdge{
            node{

              ... on Sale {

                __opType: __typename,
                createdAt,
                objectId,
                id,
                customer{
                  objectId,
                  id,
                  displayName,
                  createdAt,
                },
                billingAddress,
                date,
                paymentMethod,
                depositToAccountCode,
                discountType,
                discountValue,
                memo,
                files,
                refNo,

                totalHT,
                VAT,

                inputType,

                itemsConnection : saleItemsConnection{
                  totalCount,
                  amountReceived,
                  edges{
                    cursor,
                    node{
                      objectId,
                      id,
                      index,
                      date,
                      item{
                        objectId,
                        id,
                        displayName,
                        createdAt,
                      },
                      description,
                      qty,
                      rate,
                      discountPart{
                        type,
                        value,
                      },

                      VATPart{
                        inputType,
                        value,
                      },

                    }
                  }
                }

              }

            }
          },
        }
      `],
    });

    return cfg;
  }
  getVariables() {
    return {
      sessionToken: this.props.viewer.sessionToken,
      companyId: this.props.company.id,
      id: this.props.id,
      props: {
        customer: this.props.customer,
        billingAddress: this.props.billingAddress,
        items: this.props.items,
        date: this.props.date,
        paymentMethod: this.props.paymentMethod,
        depositToAccountCode: this.props.depositToAccountCode,
        discountType: this.props.discountType,
        discountValue: this.props.discountValue,
        inputType: this.props.inputType,
        memo: this.props.memo,
        files: this.props.files && Array.isArray(this.props.files) ? this.props.files : [],
      },
    };
  }
  getOptimisticResponse() {
    return null;
    // return {
    //   // FIXME: totalCount gets updated optimistically, but this edge does not
    //   // get added until the server responds
    //   saleEdge: {
    //     node: {
    //       company: this.props.company,
    //       companyId: this.props.company.id,
    //       customerId: this.props.customerId,
    //       billingAddress: this.props.billingAddress,
    //       items: this.props.items,
    //       date: this.props.date,
    //       paymentMethod: this.props.paymentMethod,
    //       depositToAccountCode: this.props.depositToAccountCode,
    //       discountType: this.props.discountType,
    //       discountValue: this.props.discountValue,
    //       memo: this.props.memo,
    //       files: this.props.files,
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
