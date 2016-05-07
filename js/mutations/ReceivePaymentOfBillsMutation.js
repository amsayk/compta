import Relay from 'react-relay';

export default class ReceivePaymentOfBillsMutation extends Relay.Mutation {
  static fragments = {
    payment: () => Relay.QL`
      fragment on PaymentOfBills {
        id,
        objectId,
      }
    `,
    _vendor: () => Relay.QL`
      fragment on Vendor {
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
    return Relay.QL`mutation{receivePaymentOfBills}`;
  }
  getFatQuery() {
    return Relay.QL`
      fragment on ReceivePaymentOfBillsPayload {
        paymentEdge,
        changedBillsIds,
        viewer,
        payee{
          expensesStatus{
            open{
              totalCount,
              amount,
            },
            overdue{
              totalCount,
              amount,
            },

          },
          payments: paymentsOfBills(first: 100000,){
            totalCount,
            edges{
              node {
                __opType: __typename,
                createdAt,
                objectId,
                id,
                payee{
                  objectId,
                  id,
                  displayName,
                  createdAt,
                },
                date,
                mailingAddress,
                paymentRef,
                amountReceived,
                creditToAccountCode,
                memo,
                files,
                itemsConnection{
                  totalCount,
                  totalAmountPaid,
                  edges{
                    cursor,
                    node{
                      objectId,
                      id,
                      date,
                      amount,
                      bill{
                        createdAt,
                        objectId,
                        id,
                        payee{
                          objectId,
                          id,
                          displayName,
                        },
                        mailingAddress,
                        date,
                        dueDate,
                        paymentRef,
                        itemsConnection{
                          totalAmount,
                        },
                        paymentsConnection{
                          totalAmountPaid,
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
          expensesStatus{
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
          payments: paymentsOfBills(first: 100000,){
            totalCount,
            edges{
              node {
                __opType: __typename,
                createdAt,
                objectId,
                id,
                payee{
                  objectId,
                  id,
                  displayName,
                  createdAt,
                },
                date,
                mailingAddress,
                paymentRef,
                amountReceived,
                creditToAccountCode,
                memo,
                files,
                itemsConnection{
                  totalCount,
                  totalAmountPaid,
                  edges{
                    cursor,
                    node{
                      objectId,
                      id,
                      date,
                      amount,
                      bill{
                        createdAt,
                        objectId,
                        id,
                        payee{
                          objectId,
                          id,
                          displayName,
                        },
                        mailingAddress,
                        date,
                        dueDate,
                        paymentRef,
                        itemsConnection{
                          totalAmount,
                        },
                        paymentsConnection{
                          totalAmountPaid,
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
      connectionName: 'paymentsOfBills',
      edgeName: 'paymentEdge',
      rangeBehaviors: {
        'sortKey(-1)': 'prepend',
        '': 'append',
      },
    }];

    if(this.props._vendor){
      cfg.push({
        type: 'RANGE_ADD',
        parentName: 'payee',
        parentID: this.props._vendor.id,
        connectionName: 'paymentsOfBills',
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
      connectionName: 'vendorOpenBills',
      edgeName: 'paymentEdge',
      rangeBehaviors: {
        'sortKey(-1)': 'prepend',
        '': 'append',
      },
    });

    cfg.push({
      type: 'FIELDS_CHANGE',
      // Correlate the `updatedDocument` field in the response
      // with the DataID of the record we would like updated.
      fieldIDs: { changedBillsIds: this.props.changedBillsIds, },
    });

    cfg.push({
      type: 'REQUIRED_CHILDREN',
      // Forces these fragments to be included in the query
      children: [Relay.QL`
        fragment on ReceivePaymentOfBillsPayload {
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
        payee: this.props.payee,
        date: this.props.date,
        creditToAccountCode: this.props.creditToAccountCode,
        amountReceived: this.props.amountReceived,
        mailingAddress: this.props.mailingAddress,
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
    //       creditToAccountCode: this.props.creditToAccountCode,
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
