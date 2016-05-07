import Relay from 'react-relay';

export default class ReceivePaymentOfInvoicesMutation extends Relay.Mutation {
  static fragments = {
    payment: () => Relay.QL`
      fragment on PaymentOfInvoices {
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
    return Relay.QL`mutation{receivePaymentOfInvoices}`;
  }
  getFatQuery() {
    return Relay.QL`
      fragment on ReceivePaymentOfInvoicesPayload {
        paymentEdge,
        viewer,
        changedInvoicesIds,
        customer{
          salesStatus{

            open{
              totalCount,
              amount,
              edges{
                node{
                  objectId,
                  id,
                }
              }
            },

            overdue{
              totalCount,
              amount,
              edges{
                node{
                  objectId,
                  id,
                }
              }
            },

          },
          payments: paymentsOfInvoices(first: 100000,){
            totalCount,
            edges{
              node {
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
                date,
                paymentMethod,
                paymentRef,
                amountReceived,
                depositToAccountCode,
                memo,
                files,
                itemsConnection{
                  totalCount,
                  totalAmountReceived,
                  edges{
                    cursor,
                    node{
                      objectId,
                      id,
                      date,
                      amount,
                      invoice{
                        createdAt,
                        objectId,
                        id,
                        customer{
                          objectId,
                          id,
                          displayName,
                        },
                        billingAddress,
                        date,
                        dueDate,
                        refNo,
                        itemsConnection{
                          totalAmount,
                        },
                        paymentsConnection{
                          totalAmountReceived,
                        },
                      },
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
          payments: paymentsOfInvoices(first: 100000,){
            totalCount,
            edges{
              node {
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
                date,
                paymentMethod,
                paymentRef,
                amountReceived,
                depositToAccountCode,
                memo,
                files,
                itemsConnection{
                  totalCount,
                  totalAmountReceived,
                  edges{
                    cursor,
                    node{
                      objectId,
                      id,
                      date,
                      amount,
                      invoice{
                        createdAt,
                        objectId,
                        id,
                        customer{
                          objectId,
                          id,
                          displayName,
                        },
                        billingAddress,
                        date,
                        dueDate,
                        refNo,
                        itemsConnection{
                          totalAmount,
                        },
                        paymentsConnection{
                          totalAmountReceived,
                        },
                      },
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
      connectionName: 'paymentsOfInvoices',
      edgeName: 'paymentEdge',
      rangeBehaviors: {
        'sortKey(-1)': 'prepend',
        '': 'append',
      },
    }, {
      type: 'FIELDS_CHANGE',
      // Correlate the `updatedDocument` field in the response
      // with the DataID of the record we would like updated.
      fieldIDs: { changedInvoicesIds: this.props.changedInvoicesIds, },
    }];

    if(this.props._customer){
      cfg.push({
        type: 'RANGE_ADD',
        parentName: 'customer',
        parentID: this.props._customer.id,
        connectionName: 'paymentsOfInvoices',
        edgeName: 'paymentEdge',
        rangeBehaviors: {
          'sortKey(-1)': 'prepend',
          '': 'append',
        },
      });

    }

    cfg.push({
      type: 'RANGE_ADD',
      parentName: 'viewer',
      parentID: this.props.viewer.id,
      connectionName: 'customerOpenInvoices',
      edgeName: 'paymentEdge',
      rangeBehaviors: {
        'sortKey(-1)': 'prepend',
        '': 'append',
      },
    });

    cfg.push({
      type: 'REQUIRED_CHILDREN',
      // Forces these fragments to be included in the query
      children: [Relay.QL`
        fragment on ReceivePaymentOfInvoicesPayload {
          paymentEdge,
        }
      `],
    });

    return cfg;
  }
  getVariables() {
    return {
      sessionToken: this.props.viewer.sessionToken,
      id: this.props.id,
      companyId: this.props.company.id,
      props: {
        items: this.props.items,
        customer: this.props.customer,
        date: this.props.date,
        depositToAccountCode: this.props.depositToAccountCode,
        amountReceived: this.props.amountReceived,
        paymentMethod: this.props.paymentMethod,
        paymentRef: this.props.paymentRef,
        memo: this.props.memo,
        files: this.props.files,
      },
    };
  }
  getOptimisticResponse() {
    return null;
    // return {
    //   // FIXME: totalCount gets updated optimistically, but this edge does not
    //   // get added until the server responds
    //   paymentEdge: {
    //     node: {
    //       company: this.props.company,
    //       companyId: this.props.company.id,
    //       customerId: this.props.customerId,
    //       items: this.props.items,
    //       date: this.props.date,
    //       depositToAccountCode: this.props.depositToAccountCode,
    //       amountReceived: this.props.amountReceived,
    //       paymentMethod: this.props.paymentMethod,
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
