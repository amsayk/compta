const {
  GraphQLInterfaceType,
  GraphQLList,
  GraphQLFloat,
  GraphQLID,
  GraphQLInt,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLInputObjectType,
  GraphQLSchema,
  GraphQLString,
  GraphQLEnumType,
  GraphQLBoolean,
  GraphQLUnionType,
} = require('graphql');

const {
  offsetToCursor,
  fromGlobalId,
  globalIdField,
  mutationWithClientMutationId,
  nodeDefinitions,
  connectionArgs,
  connectionDefinitions,
  connectionFromArray,
  connectionFromArraySlice,
  toGlobalId,
} = require('graphql-relay');

const {
  userType,
  transactionType,
  operationType,
  accountType,
  chartAccountType,
  companyType,
  bankType,
  vendorType,
  employeeType,
  customerType,
  saleType,
  expenseType,
  invoiceType,
  paymentOfInvoicesItemType,
  paymentOfInvoicesType,
  billType,
  paymentOfBillsItemType,
  paymentOfBillsType,
  productType,
  expenseItemType,
  billItemType,
  invoiceItemType,
  saleItemType,

  CompanyBankAccountsConnection,
  AccountOperationConnection,

  TransactionOperationConnection,
  CompanyTransactionsConnection,
  CompanyAccountsConnection,

  UserCompaniesConnection,
  UserCompaniesEdge,

  CompanySalesConnection,
  CompanySalesEdge,

  CompanyExpensesConnection,
  CompanyExpensesEdge,

  CompanyCustomersConnection,
  CompanyCustomersEdge,
  CompanyEmployeesEdge,

  CompanyVendorsConnection,
  CompanyVendorsEdge,

  CompanyProductsConnection,
  CompanyProductsEdge,

  saleOrPaymentOfInvoicesType,

} = require('../../v2/types');

const {
  User,

  getChartAccountList,

  getViewer,
  getUser,
  getTransaction,
  getOperation,
  getAccount,
  getCompany,

  getBank,
  getCustomer,
  getVendor,

  getTransactions,
  getCompanyAccounts,
  getCompanies,

  getSale,
  getSaleItem,

  getExpense,
  getExpenseItem,

  getInvoice,
  getPaymentOfBills,
  getBill,
  getInvoiceItem,
  getPaymentOfInvoicesItem,
  getPaymentOfBillsItem,

  getCompanySales,
  getSaleItems,

  getCompanyExpenses,
  getExpenseItems,

  getCompanyInvoices,
  getCompanyBills,
  getInvoiceItems,
  getInvoicePayments,
  getBillPayments,

  getCompanyPeople,
  getCompanyVendors,
  getCompanyCustomers,

  getCompanyPaymentsOfInvoices,
  getCompanyPaymentsOfBills,
  getPaymentOfInvoices,
  getPaymentOfInvoicesItems,

  getBankAccounts,

  getCompanyProducts,
  getProduct,

  getAccountsByCategories,

  getObjectByType,
  getObjectsByType,

  getCompanyInvoicesTotalCount,

  queryOpenInvoices,
  queryOverdueInvoices,

  queryOpenBills,
  queryOverdueBills,

  querySalesRecentlyPaid,
  queryExpensesRecentlyPaid,

  queryInvoices,
  querySales,
  queryPaymentsOfInvoices,
  queryPaymentsOfBills,

  getCustomerOpenInvoices,
  getVendorOpenBills,

  getPaymentOfInvoicesFromPaymentOfInvoicesItem,
  getPaymentOfBillsFromPaymentOfBillsItem,

} = require('../../../database/v2');

const {
  onExpense,

  onSale,

  onCompany,
  onItem,
  onPerson,

} = require('./change');

const { nodeInterface, } = require('../../v2/node');

const { saleOpInterfaceType, expenseOpInterfaceType, } = require('../../v2/common');

const Company = require('../../../database/Company');

const Expense = require('../../../database/v2/Expense');
const Sale = require('../../../database/v2/Sale');

const Product = require('../../../database/Product');

const Transaction = require('../../../database/Transaction');
const Operation = require('../../../database/Operation');

module.exports.GraphQLRemoveFileMutation = mutationWithClientMutationId({
  name: 'RemoveFile',
  inputFields: {
    sessionToken: { type: new GraphQLNonNull(GraphQLString) },

    companyId: { type: new GraphQLNonNull(GraphQLID), },

    id: { type: new GraphQLNonNull(GraphQLString), },

    objectId: { type: new GraphQLNonNull(GraphQLString), },
    type: { type: new GraphQLNonNull(GraphQLString), },
  },
  outputFields: {
    deletedFileId: {
      type: new GraphQLNonNull(GraphQLID),
      async resolve({ localCompanyId, id, }) {
        return toGlobalId('File', `${localCompanyId}:${id}`);
      },
    },
    updatedCompany: {
      type: companyType,
      resolve: ({ type, companyId, id, objectId, }) => {
        return type === 'Company' ? getObjectByType(Company,  { companyId, id: objectId, }) : null;
      },
    },
    updatedProduct: {
      type: productType,
      resolve: ({ type, companyId, id, objectId, }) => {
        return type === 'Item' ? getObjectByType(Product,  { companyId, id: objectId, }) : null;
      },
    },
    updatedSale: {
      type: saleOpInterfaceType,
      resolve: ({ type, companyId, id, objectId, }) => {
        return type in [ 'Invoice', 'Sale', 'PaymentOfInvoices', ] ? getObjectByType(Sale,  { companyId, id: objectId, }) : null;
      },
    },
    updatedExpense: {
      type: expenseOpInterfaceType,
      resolve: ({ type, companyId, id, objectId, }) => {
        return type in [ 'Expense', 'Bill', 'PaymentOfBills', ] ? getObjectByType(Expense,  { companyId, id: objectId, }) : null;
      },
    },
    updatedTransaction: {
      type: transactionType,
      resolve: ({ type, companyId, id, objectId, }) => {
        return type === 'Transaction' ? getObjectByType(Transaction,  { companyId, id: objectId, }) : null;
      },
    },
    updatedOperation: {
      type: operationType,
      resolve: ({ type, companyId, id, objectId, }) => {
        return type === 'Operation' ? getObjectByType(Operation,  { companyId, id: objectId, }) : null;
      },
    },
    viewer: {
      type: userType,
      resolve: () => getViewer(),
    },
  },
  async mutateAndGetPayload({ companyId, objectId, type, id, sessionToken, }) {
    const {id: localCompanyId, } = fromGlobalId(companyId);

    const {deletedFileId} = await Parse.Cloud.run('delFile', { companyId: localCompanyId, id, }, {sessionToken});

    switch (type){
      case 'Company':

        onCompany({ id:localCompanyId, });
        break;

      case 'Item':

        onItem({ id:localCompanyId, });
        break;

      // case 'Employee':
      // case 'Customer':
      // case 'Vendor':
      // case 'People':
      //
      //   onPerson({ id:localCompanyId, });
      //   break;

      case 'Invoice':

        onSale({ id:localCompanyId, }, objectId);
        break;

      case 'Sale':

        onSale({ id:localCompanyId, }, objectId);
        break;

      case 'PaymentOfInvoices':

        onSale({ id:localCompanyId, }, objectId);
        break;

      case 'Expense':

        onExpense({ id:localCompanyId, }, objectId);
        break;

      case 'Bill':

        onExpense({ id:localCompanyId, }, objectId);
        break;

      case 'PaymentOfBills':

        onExpense({ id:localCompanyId, }, objectId);
        break;

      case 'Transaction':

        onExpense({ id:localCompanyId, }, objectId);
        onSale({ id:localCompanyId, }, objectId);
        break;

      case 'Operation':

        onExpense({ id:localCompanyId, }, objectId);
        onSale({ id:localCompanyId, }, objectId);
        break;
    }

    return { id: deletedFileId, companyId: localCompanyId, objectId, type, };
  },
});
