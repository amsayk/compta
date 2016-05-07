import Relay from 'react-relay';

export default class AddInvoiceMutation extends Relay.Mutation {
  static fragments = {
    invoice: () => Relay.QL`
      fragment on Invoice {
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
    return Relay.QL`mutation{addInvoice}`;
  }
  getFatQuery() {
    return Relay.QL`
      fragment on AddInvoicePayload{
        invoiceEdge,
        changedPaymentsIds,
        viewer,
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
          invoices(first: 100000){
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
                billingAddress,
                terms,
                date,
                dueDate,
                memo,
                files,
                refNo,
                itemsConnection{
                  totalCount,
                  totalAmount,
                  edges{
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
                    }
                  }
                },
                paymentsConnection{
                  totalAmountReceived,
                },
                discountType,
                discountValue,
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
          invoices(first: 100000){
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
                billingAddress,
                terms,
                date,
                dueDate,
                memo,
                files,
                refNo,
                itemsConnection{
                  totalCount,
                  totalAmount,
                  edges{
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
                    }
                  }
                },
                paymentsConnection{
                  totalAmountReceived,
                },
                discountType,
                discountValue,
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
      connectionName: 'invoices',
      edgeName: 'invoiceEdge',
      rangeBehaviors: {
        'sortKey(-1)': 'prepend',
        '': 'append',
      },
    }, {
      type: 'FIELDS_CHANGE',
      // Correlate the `updatedDocument` field in the response
      // with the DataID of the record we would like updated.
      fieldIDs: { changedPaymentsIds: this.props.changedPaymentsIds, },
    }];

    if(this.props._customer){
      cfg.push({
        type: 'RANGE_ADD',
        parentName: 'customer',
        parentID: this.props._customer.id,
        connectionName: 'invoices',
        edgeName: 'invoiceEdge',
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
      edgeName: 'invoiceEdge',
      rangeBehaviors: {
        'sortKey(-1)': 'prepend',
        '': 'append',
      },
    });

    cfg.push({
      type: 'REQUIRED_CHILDREN',
      // Forces these fragments to be included in the query
      children: [Relay.QL`
        fragment on AddInvoicePayload {
          invoiceEdge,
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
        terms: this.props.terms,
        date: this.props.date,
        dueDate: this.props.dueDate,
        discountType: this.props.discountType,
        discountValue: this.props.discountValue,
        items: this.props.items,
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
    //   invoiceEdge: {
    //     node: {
    //       companyId: this.props.company.id,
    //       customer: this.props.customer,
    //       billingAddress: this.props.billingAddress,
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
