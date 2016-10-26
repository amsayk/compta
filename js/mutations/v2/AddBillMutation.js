import Relay from 'react-relay';

export default class AddBillMutation extends Relay.Mutation {
  static fragments = {
    bill: () => Relay.QL`
      fragment on Bill {
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
    return Relay.QL`mutation{addBill}`;
  }
  getFatQuery() {
    return Relay.QL`
      fragment on AddBillPayload{
        billEdge,
        changedPaymentsIds,
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
          expenses(first: 100000){
            totalCount,
            edges{
              node {

                ... on Node {

                  ... on Expense {
                    id,
                  },

                  ... on PaymentOfBills {
                    id,
                  },

                  ... on Bill {

                    __opType: __typename,
                    createdAt,
                    objectId,
                    id,
                    payee{
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
                      mailing_streetAddress,
                      mailing_cityTown,
                      mailing_stateProvince,
                      mailing_postalCode,
                      mailing_country,
                      notes,
                      updatedAt,
                      createdAt,
                    },
                    mailingAddress,
                    terms,
                    date,
                    dueDate,
                    memo,
                    files,
                    paymentRef,

                    totalHT,
                    VAT,

                    inputType,

                    itemsConnection : billItemsConnection{
                      totalCount,
                      totalAmount,
                      edges{
                        node{
                          objectId,
                          id,
                          index,
                          accountCode,
                          description,
                          amount,

                          VATPart{
                            inputType,
                            value,
                          },

                        }
                      }
                    },
                    paymentsConnection : billPaymentsConnection{
                      totalAmountPaid,
                    },

                  }

                }

              },
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
            edges{
              node {

                ... on Node {


                  ... on Expense {
                    id,
                  },

                  ... on PaymentOfBills {
                    id,
                  },

                  ... on Bill {

                    __opType: __typename,
                    createdAt,
                    objectId,
                    id,
                    payee{
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
                      mailing_streetAddress,
                      mailing_cityTown,
                      mailing_stateProvince,
                      mailing_postalCode,
                      mailing_country,
                      notes,
                      updatedAt,
                      createdAt,
                    },
                    mailingAddress,
                    terms,
                    date,
                    dueDate,
                    memo,
                    files,
                    paymentRef,

                    totalHT,
                    VAT,

                    inputType,

                    itemsConnection : billItemsConnection{
                      totalCount,
                      totalAmount,
                      edges{
                        node{
                          objectId,
                          id,
                          index,
                          accountCode,
                          description,
                          amount,

                          VATPart{
                            inputType,
                            value,
                          },

                        }
                      }
                    },
                    paymentsConnection : billPaymentsConnection{
                      totalAmountPaid,
                    },

                  },

                }

              },
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
      edgeName: 'billEdge',
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
        connectionName: 'expenses',
        edgeName: 'billEdge',
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
      edgeName: 'billEdge',
      rangeBehaviors: {
        'sortKey(-1)': 'prepend',
        '': 'append',
      },
    });

    cfg.push({
      type: 'FIELDS_CHANGE',
      // Correlate the `updatedDocument` field in the response
      // with the DataID of the record we would like updated.
      fieldIDs: { changedPaymentsIds: this.props.changedPaymentsIds, },
    });

    cfg.push({
      type: 'REQUIRED_CHILDREN',
      // Forces these fragments to be included in the query
      children: [Relay.QL`
        fragment on AddBillPayload {
          billEdge{
            node{
              ... on Node{
                ... on Bill {

                  __opType: __typename,
                  createdAt,
                  objectId,
                  id,
                  payee{
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
                    mailing_streetAddress,
                    mailing_cityTown,
                    mailing_stateProvince,
                    mailing_postalCode,
                    mailing_country,
                    notes,
                    updatedAt,
                    createdAt,
                  },
                  mailingAddress,
                  terms,
                  date,
                  dueDate,
                  memo,
                  files,
                  paymentRef,

                  totalHT,
                  VAT,

                  inputType,

                  itemsConnection : billItemsConnection{
                    totalCount,
                    totalAmount,
                    edges{
                      node{
                        objectId,
                        id,
                        index,
                        accountCode,
                        description,
                        amount,

                        VATPart{
                          inputType,
                          value,
                        },

                      }
                    }
                  },
                  paymentsConnection : billPaymentsConnection{
                    totalAmountPaid,
                  },

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
        payee: this.props.payee,
        mailingAddress: this.props.mailingAddress,
        terms: this.props.terms,
        paymentRef: this.props.paymentRef,
        inputType: this.props.inputType,
        date: this.props.date,
        dueDate: this.props.dueDate,
        items: this.props.items,
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
    //   billEdge: {
    //     node: {
    //       companyId: this.props.company.id,
    //       payee: this.props.payee,
    //       mailingAddress: this.props.mailingAddress,
    //       terms: this.props.terms,
    //       date: this.props.date,
    //       dueDate: this.props.dueDate,
    //       discountType: this.props.discountType,
    //       discountValue: this.props.discountValue,
    //       items: this.props.items,
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
