import Relay from 'react-relay';

import {
  toGlobalId,
} from 'graphql-relay';

export default class RemoveFileMutation extends Relay.Mutation {
  static fragments = {
    company: () => Relay.QL`
      fragment on Company {
        id,
        objectId,
      }
    `,
    file: () => Relay.QL`
      fragment on File {
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
    return Relay.QL`mutation{delFile}`;
  }

  getFatQuery() {
    const type = this.props.type;

    switch (type) {
      case 'Company':

        return Relay.QL`
          fragment on RemoveFilePayload {
            deletedFileId,
            updateCompany{
             objectId,
            },
          }
        `;

      case 'Item':

        return Relay.QL`
          fragment on RemoveFilePayload {
            deletedFileId,
            updateProduct{
             objectId,
            },
          }
        `;

      // case 'Employee':
      // case 'Customer':
      // case 'Vendor':
      // case 'People':
      //
      //   return Relay.QL`
      //     fragment on RemoveFilePayload {
      //       deletedFileId,
      //     }
      //   `;

      case 'Invoice':

        return Relay.QL`
          fragment on RemoveFilePayload {
            deletedFileId,
            updateSale{
             objectId,
            },
          }
        `;

      case 'Sale':

        return Relay.QL`
          fragment on RemoveFilePayload {
            deletedFileId,
            updateSale{
             objectId,
            },
          }
        `;

      case 'PaymentOfInvoices':

        return Relay.QL`
          fragment on RemoveFilePayload {
            deletedFileId,
            updateSale{
             objectId,
            },
          }
        `;

      case 'Expense':

        return Relay.QL`
          fragment on RemoveFilePayload {
            deletedFileId,
            updateExpense{
             objectId,
            },
          }
        `;

      case 'Bill':

        return Relay.QL`
          fragment on RemoveFilePayload {
            deletedFileId,
            updateExpense{
             objectId,
            },
          }
        `;

      case 'PaymentOfBills':

        return Relay.QL`
          fragment on RemoveFilePayload {
            deletedFileId,
            updateExpense{
             objectId,
            },
          }
        `;

      case 'Transaction':

        return Relay.QL`
          fragment on RemoveFilePayload {
            deletedFileId,
            updateTransaction{
             objectId,
            },
          }
        `;

      case 'Operation':

        return Relay.QL`
          fragment on RemoveFilePayload {
            deletedFileId,
            updateOperation{
             objectId,
            },
          }
        `;

    }
  }

  getCollisionKey() {
    // Give the same key to like mutations that affect the same story
    return `update_company_${this.props.company.id}`;
  }

  getConfigs() {
    const type = this.props.type;

    switch (type) {
      case 'Company':

        return [{
          type: 'FIELDS_CHANGE',
          fieldIDs: {updatedCompany: this.props.company.id},
        }];

      case 'Item':

        return [{
          type: 'FIELDS_CHANGE',
          fieldIDs: { updatedProduct: toGlobalId('Product', `${this.props.company.objectId}:${this.props.objectId}`), },
        }];

      // case 'Employee':
      // case 'Customer':
      // case 'Vendor':
      // case 'People':
      //
      //   return [{
      //     type: 'FIELDS_CHANGE',
      //     // Correlate the `updatedDocument` field in the response
      //     // with the DataID of the record we would like updated.
      //     fieldIDs: {updatedDocument: this.props.document.id},
      //   }];
      //   break;

      case 'Invoice':

        return [{
          type: 'FIELDS_CHANGE',
          fieldIDs: {updatedSale: toGlobalId('Invoice', `${this.props.company.objectId}:${this.props.objectId}`), },
        }];

      case 'Sale':

        return [{
          type: 'FIELDS_CHANGE',
          fieldIDs: {updatedSale: toGlobalId('Sale', `${this.props.company.objectId}:${this.props.objectId}`), },
        }];

      case 'PaymentOfInvoices':

        return [{
          type: 'FIELDS_CHANGE',
          fieldIDs: {updatedSale: toGlobalId('PaymentOfInvoices', `${this.props.company.objectId}:${this.props.objectId}`), },
        }];

      case 'Expense':

        return [{
          type: 'FIELDS_CHANGE',
          fieldIDs: {updatedExpense: toGlobalId('Expense', `${this.props.company.objectId}:${this.props.objectId}`), },
        }];

      case 'Bill':

        return [{
          type: 'FIELDS_CHANGE',
          fieldIDs: {updatedExpense: toGlobalId('Bill', `${this.props.company.objectId}:${this.props.objectId}`), },
        }];

      case 'PaymentOfBills':

        return [{
          type: 'FIELDS_CHANGE',
          fieldIDs: {updatedExpense: toGlobalId('PaymentOfBills', `${this.props.company.objectId}:${this.props.objectId}`), },
        }];

      case 'Transaction':

        return [{
          type: 'FIELDS_CHANGE',
          fieldIDs: {updatedTransaction: toGlobalId('Transaction', `${this.props.company.objectId}:${this.props.objectId}`), },
        }];

      case 'Operation':

        return [{
          type: 'FIELDS_CHANGE',
          fieldIDs: {updatedOperation: toGlobalId('Operation', `${this.props.company.objectId}:${this.props.objectId}`), },
        }];
    }

  }

  getVariables() {
    return {
      companyId: this.props.company.id,

      id: this.props.file.objectId,

      objectId: this.props.objectId,
      type: this.props.type,

      sessionToken: this.props.viewer.sessionToken,
    };
  }

  getOptimisticResponse() {
    return null;
  }
}
