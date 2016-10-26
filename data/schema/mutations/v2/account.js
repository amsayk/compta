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
  parseTableCountLoader,
  parseTableLoader,
  parseIDLoader,
  parseSeqLoader,
} = require('../../../database/loaders');

const Company = require('../../../database/Company');

const findIndex = require('lodash.findindex');

const { logIn, logOut, } = require('../../../auth');

const Parse = require('parse');

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

const Product = require('../../../database/Product');

const Expense = require('../../../database/v2/Expense');
const Sale = require('../../../database/v2/Sale');

const People = require('../../../database/v2/People');

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
  objectIdField,
  createdField,
  editedField,

  OperationKind,
  PeriodType,
  legalFormType,
  paymentMethodType,
  paymentTermsType,

  companySettingsType,
  companySalesSettingsType,
  companyExpensesSettingsType,
  companyPaymentsSettingsType,
  discountValueType,

  personType,
  expenseOrPaymentOfBillsType,

  transactionStatusType,
  productKind,

  filterArgs,

  companySettingsInputType,
  companySalesSettingsInputType,
  companyExpensesSettingsInputType,
  companyPaymentsSettingsInputType,

  invoiceItemLineInputType,
  invoiceItemInputType,
  parseObjectInputFieldType,

  billItemInputType,

  saleItemLineInputType,
  saleItemInputType,

  expenseItemInputType,

  paymentOfInvoicesItemInputType,
  paymentOfBillsItemInputType,

  fieldValueType,

  fileItemInputType,

  companyVATSettingsType,
  VATInputType,
  VATPartType,
  VATPartInputType,

  VATRegimeType,

} = require('../../v2/common');

const {
  onExpense,

  onSale,

  onCompany,
  onItem,
  onPerson,

  onAccount,

} = require('./change');

const GraphQLDateTime = require('graphql-custom-datetype');

const GraphQLEmail = GraphQLString;
const GraphQLURL = GraphQLString;
const GraphQLLimitedString = GraphQLString;
const GraphQLPassword = GraphQLString;

module.exports.UpdateAccountMutation = mutationWithClientMutationId({
  name: 'UpdateAccount',
  inputFields: {
    sessionToken: { type: new GraphQLNonNull(GraphQLString) },
    id: { type: new GraphQLNonNull(GraphQLString) },
    displayName: { type: new GraphQLNonNull(GraphQLString) },
    email: { type: new GraphQLNonNull(GraphQLString) },
  },
  outputFields: {
    viewer: {
      type: userType,
      resolve: () => getViewer(),
    },
  },
  async mutateAndGetPayload({ id, displayName, email, sessionToken, }) {
    await Parse.Cloud.run('updateAccount', {id, displayName, email,}, {sessionToken});
    return onAccount().then(function () {
      return {id};
    });
  },
});

module.exports.ChangePasswordMutation = mutationWithClientMutationId({
  name: 'ChangePassword',
  inputFields: {
    sessionToken: { type: new GraphQLNonNull(GraphQLString) },
    id: { type: new GraphQLNonNull(GraphQLString) },
    password: { type: new GraphQLNonNull(GraphQLString) },
    currentPassword: { type: new GraphQLNonNull(GraphQLString) },
  },
  outputFields: {
    viewer: {
      type: userType,
      resolve: () => getViewer(),
    },
  },
  async mutateAndGetPayload({ id, currentPassword, password, sessionToken, }) {
    await Parse.Cloud.run('changePassword', {id, currentPassword, password,}, {sessionToken});

    return onAccount().then(function () {
      return {id};
    });
  },
});
module.exports.SetPasswordMutation = mutationWithClientMutationId({
  name: 'SetPassword',
  inputFields: {
    sessionToken: { type: new GraphQLNonNull(GraphQLString) },
    id: { type: new GraphQLNonNull(GraphQLString) },
    password: { type: new GraphQLNonNull(GraphQLString) },
  },
  outputFields: {
    viewer: {
      type: userType,
      resolve: () => getViewer(),
    },
  },
  async mutateAndGetPayload({ id, password, sessionToken, }) {
    await Parse.Cloud.run('setPassword', {id, password,}, {sessionToken});
    return onAccount().then(function () {
      return {id};
    });
  },
});
