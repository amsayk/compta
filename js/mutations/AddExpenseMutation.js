import Relay from 'react-relay';

export default class AddExpenseMutation extends Relay.Mutation {
  static fragments = {
    expense: () => Relay.QL`
      fragment on Expense {
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
    return Relay.QL`mutation{addExpense}`;
  }
  getFatQuery() {
    return Relay.QL`
      fragment on AddExpensePayload {
        expenseEdge,
        vendor{
          expensesStatus{
            open{
              totalCount,
              amount,
            },
            overdue{
              totalCount,
              amount,
            },
          }

          expenses(first: 100000){
            totalCount,
            sumOfTotals,
            edges{
              node {
                createdAt,
                id,
                objectId,
                payee{

                  ... on Node{

                    ... on Customer{
                      type: __typename,
                      id,
                      displayName,
                    },

                    ... on Vendor{
                      type: __typename,
                      id,
                      displayName,
                    },

                  },

                },
                creditToAccountCode,
                date,
                paymentRef,
                paymentMethod,
                memo,
                files,
                paymentRef,
                itemsConnection{
                  totalCount,
                  amountPaid,
                  edges{
                    cursor,
                    node{
                      id,
                      objectId,
                      index,
                      accountCode,
                      description,
                      amount,
                    },
                  }
                },
              }
            },
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
          expenses(first: 100000){
            totalCount,
            sumOfTotals,
            edges{
              node {
                createdAt,
                id,
                objectId,
                payee{

                  ... on Node{

                    ... on Customer{
                      type: __typename,
                      id,
                      displayName,
                    },

                    ... on Vendor{
                      type: __typename,
                      id,
                      displayName,
                    },

                  },

                },
                creditToAccountCode,
                date,
                paymentMethod,
                memo,
                files,
                paymentRef,
                itemsConnection{
                  totalCount,
                  amountPaid,
                  edges{
                    cursor,
                    node{
                      id,
                      index,
                      accountCode,
                      description,
                      amount,
                    },
                  }
                },
              }
            },
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
      connectionName: 'expenses',
      edgeName: 'expenseEdge',
      rangeBehaviors: {
        'sortKey(-1)': 'prepend',
        '': 'append',
      },
    }];

    if(this.props._vendor){
      cfg.push({
        type: 'RANGE_ADD',
        parentName: 'vendor',
        parentID: this.props._vendor.id,
        connectionName: 'expenses',
        edgeName: 'expenseEdge',
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
        fragment on AddExpensePayload {
          expenseEdge,
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
        payee: this.props.payee,
        creditToAccountCode: this.props.creditToAccountCode,
        items: this.props.items,
        date: this.props.date,
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
    //   expenseEdge: {
    //     node: {
    //       company: this.props.company,
    //       companyId: this.props.company.id,
    //       payeeId: this.props.payeeId,
    //       creditToAccountCode: this.props.creditToAccountCode,
    //       items: this.props.items,
    //       date: this.props.date,
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
