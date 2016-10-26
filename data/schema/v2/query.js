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

} = require('../../database/v2');

const {
  nodeField,
} = require('./node');

const {
  userType,
  companyType,
  chartAccountType,
} = require('./types');

const {
} = require('./common');

module.exports.queryType = new GraphQLObjectType({
  name: 'Query',
  fields: () => ({
    node: nodeField,
    viewer: {
      type: userType,
      resolve: () => getViewer(),
    },
  }),
});
