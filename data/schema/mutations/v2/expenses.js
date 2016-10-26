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

// const {
//   // GraphQLEmail,
//   // GraphQLURL,
//   // GraphQLDateTime,
//   // GraphQLLimitedString,
//   // GraphQLPassword
// } = require('graphql-custom-types');

// const GraphQLDateTime = GraphQLString;
const GraphQLDateTime = require('graphql-custom-datetype');
const GraphQLEmail = GraphQLString;
const GraphQLURL = GraphQLString;
const GraphQLLimitedString = GraphQLString;
const GraphQLPassword = GraphQLString;

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
  customerType,
  employeeType,
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
  parseTypedObjectInputFieldType,

  billItemInputType,

  saleItemLineInputType,
  saleItemInputType,

  expenseItemInputType,

  paymentOfInvoicesItemInputType,
  paymentOfBillsItemInputType,

  fieldValueType,

  fileItemInputType,

} = require('../../v2/common');

const {
  onExpense,

  onSale,

  onCompany,
  onItem,
  onPerson,

} = require('./change');

const {
  companyVATSettingsType,
  VATInputType,
  VATPartType,
  VATPartInputType,
} = require('../../v2/common');

module.exports.GraphQLAddBillMutation = mutationWithClientMutationId({
  name: 'AddBill',
  inputFields: {
    sessionToken: { type: new GraphQLNonNull(GraphQLString) },
    id: { type: GraphQLString },
    companyId: { type: new GraphQLNonNull(GraphQLID) },
    props: {
      type: new GraphQLInputObjectType({
        name: 'AddBillProps',
        fields: () => ({
          payee: {
            type: parseObjectInputFieldType,
          },
          mailingAddress: { type: new GraphQLNonNull(GraphQLString) },
          terms: { type: new GraphQLNonNull(paymentTermsType) },
          items: {
            type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(billItemInputType))),
          },
          date: { type: new GraphQLNonNull(GraphQLDateTime) },
          dueDate: { type: new GraphQLNonNull(GraphQLDateTime) },
          paymentRef: { type: GraphQLString },
          memo: { type: GraphQLString },
          files: { type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(fileItemInputType))) },

          inputType: {
            type: new GraphQLNonNull(VATInputType),
          },
        }),
      }),
    },
  },
  outputFields: {
    billEdge: {
      type: CompanyExpensesEdge,
      async resolve({id, companyId, }) {
        const bill = await getObjectByType(Expense, {companyId, id});
        const offset = 0; // findIndex(await getCompanyBills({id: companyId}), ({id}) => id === bill.id);

        return {
          cursor: offsetToCursor(offset),
          node: bill,
        };
      },
    },
    changedPaymentsIds: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(GraphQLString))),
      resolve: ({ changedPaymentsIds, }) => changedPaymentsIds,
    },
    payee: {
      type: vendorType,
      resolve: ({ companyId, payee : { id, }, }) => getObjectByType(People, {companyId, id}),
    },
    company: {
      type: companyType,
      resolve: ({companyId : id,}) => getCompany(id),
    },
    viewer: {
      type: userType,
      resolve: () => getViewer(),
    },
  },
  async mutateAndGetPayload({ sessionToken, id, companyId, props, }) {
    const {id: localCompanyId,} = fromGlobalId(companyId);

    let _props = {};

    if(!id){ // NEW
      _props = {
        kind: 'Bill',
      };
    }

    const { addedBillId, changedPaymentsIds, } = await Parse.Cloud.run('addBill', { ..._props, id, companyId: localCompanyId, ...props,}, {sessionToken});

    // parseTableCountLoader.clear(Bill({id: localCompanyId}));
    // parseTableLoader.clear(Bill({id: localCompanyId}));
    // parseIDLoader.clear([Bill({id: localCompanyId}), addedBillId]);

    onExpense({ id: localCompanyId, }, addedBillId);

    return { id: addedBillId, companyId: localCompanyId, changedPaymentsIds, payee: props.payee, };
  },
});

module.exports.GraphQLAddExpenseMutation = mutationWithClientMutationId({
  name: 'AddExpense',
  inputFields: {
    sessionToken: { type: new GraphQLNonNull(GraphQLString) },
    id: { type: GraphQLString },
    companyId: { type: new GraphQLNonNull(GraphQLID) },
    props: {
      type: new GraphQLInputObjectType({
        name: 'AddExpenseProps',
        fields: () => ({
          payee: { type: new GraphQLNonNull(parseTypedObjectInputFieldType([ [  'Customer', 1 ], [ 'Vendor', 2 ], [ 'Employee', 3 ] ])) },
          creditToAccountCode: { type: new GraphQLNonNull(GraphQLString) },
          date: { type: new GraphQLNonNull(GraphQLDateTime) },
          paymentMethod: { type: new GraphQLNonNull(paymentMethodType) },
          items: {
            type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(expenseItemInputType))),
          },
          paymentRef: { type: GraphQLString },
          memo: { type: GraphQLString },
          files: { type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(fileItemInputType))) },

          inputType: {
            type: new GraphQLNonNull(VATInputType),
          },
        }),
      }),
    },
  },
  outputFields: {
    expenseEdge: {
      type: CompanyExpensesEdge,
      async resolve({id, companyId, }) {
        const expense = await getObjectByType(Expense, {companyId, id});
        const offset = 0; // findIndex(await getCompanyExpenses({id: companyId}), ({id}) => id === expense.id);

        return {
          cursor: offsetToCursor(offset),
          node: expense,
        };
      },
    },
    customer: {
      type: customerType,
      resolve: ({ companyId, payee : { type, id, }, }) => type === 'Customer' || type === 1 ? getObjectByType(People, {companyId, id}) : undefined,
    },
    vendor: {
      type: vendorType,
      resolve: ({ companyId, payee : { type, id, }, }) => type === 'Vendor' || type === 2 ? getObjectByType(People, {companyId, id}) : undefined,
    },
    employee: {
      type: employeeType,
      resolve: ({ companyId, payee : { type, id, }, }) => type === 'Employee' || type === 3 ? getObjectByType(People, {companyId, id}) : undefined,
    },
    company: {
      type: companyType,
      resolve: ({companyId}) => getCompany(companyId),
    },
  },
  async mutateAndGetPayload({sessionToken, id, companyId, props, }) {
    const {id: localCompanyId} = fromGlobalId(companyId);

    let _props = {};

    if(!id){ // NEW
      _props = {
        kind: 'Expense',
      };
    }

    const {addedExpenseId} = await Parse.Cloud.run('addExpense', { ..._props, id, companyId: localCompanyId, ...props,}, {sessionToken});

    // parseTableCountLoader.clear(Expense({id: localCompanyId}));
    // parseTableLoader.clear(Expense({id: localCompanyId}));
    // parseIDLoader.clear([Expense({id: localCompanyId}), addedExpenseId]);

    onExpense({ id: localCompanyId, }, addedExpenseId);

    return { id: addedExpenseId, companyId: localCompanyId, payee: props.payee, };
  },
});

module.exports.GraphQLMakePaymentOfBillsMutation = mutationWithClientMutationId({
  name: 'MakePaymentOfBills',
  inputFields: {
    sessionToken: { type: new GraphQLNonNull(GraphQLString) },
    companyId: { type: new GraphQLNonNull(GraphQLID) },
    id: { type: GraphQLString },
    props: {
      type: new GraphQLInputObjectType({
        name: 'MakePaymentOfBillsProps',
        fields: () => ({
          payee: {
            type: parseObjectInputFieldType,
          },
          date: { type: new GraphQLNonNull(GraphQLDateTime) },
          // paymentMethod: { type: new GraphQLNonNull(paymentMethodType) },
          mailingAddress: { type: new GraphQLNonNull(GraphQLString) },
          paymentRef: { type: GraphQLString },
          creditToAccountCode: { type: new GraphQLNonNull(GraphQLString) },
          amountReceived: { type: new GraphQLNonNull(GraphQLFloat) },
          items: {
            type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(paymentOfBillsItemInputType))),
          },
          memo: { type: GraphQLString },
          files: { type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(fileItemInputType))) },
        }),
      }),
    },
  },
  outputFields: {
    paymentEdge: {
      type: CompanyExpensesEdge,
      async resolve({id, companyId, }) {
        const payment = await getObjectByType(Expense, {companyId, id});
        const offset = 0; // findIndex(await getCompanyPaymentsOfBills({id: companyId}), ({id}) => id === payment.id);

        return {
          cursor: offsetToCursor(offset),
          node: payment,
        };
      },
    },
    changedBillsIds: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(GraphQLString))),
      resolve: ({ companyId, changedBillsIds, }) => changedBillsIds.map(id => toGlobalId(`Expense_${companyId}`, id)),
    },
    viewer: {
      type: userType,
      resolve: () => getViewer(),
    },
    payee: {
      type: vendorType,
      resolve: ({ companyId, payee : { id, }, }) => getObjectByType(People, {companyId, id}),
    },
    company: {
      type: companyType,
      resolve: ({companyId}) => getCompany(companyId),
    },
  },
  async mutateAndGetPayload({sessionToken, id, companyId, props, }) {
    const {id: localCompanyId} = fromGlobalId(companyId);

    let _props = {};

    if(!id){ // NEW
      _props = {
        kind: 'PaymentOfBills',
      };
    }

    const { addedPaymentId, changedBillsIds, } = await Parse.Cloud.run('makePaymentOfBills', { ..._props, id, companyId: localCompanyId, ...props,}, {sessionToken});

    // parseTableCountLoader.clear(PaymentOfBills({id: localCompanyId}));
    // parseTableLoader.clear(PaymentOfBills({id: localCompanyId}));
    // parseIDLoader.clear([PaymentOfBills({id: localCompanyId}), addedPaymentId]);

    onExpense({ id: localCompanyId, }, addedPaymentId);

    return { id: addedPaymentId, changedBillsIds, companyId: localCompanyId, payee: props.payee, };
  },
});

module.exports.GraphQLRemoveBillMutation = mutationWithClientMutationId({
  name: 'RemoveBill',
  inputFields: {
    sessionToken: { type: new GraphQLNonNull(GraphQLString) },
    id: { type: new GraphQLNonNull(GraphQLString) },
    companyId: { type: new GraphQLNonNull(GraphQLID) },
  },
  outputFields: {
    deletedBillId: {
      type: GraphQLID,
      resolve: ({id}) => id,
    },
    company: {
      type: companyType,
      resolve: ({companyId : id,}) => getCompany(id),
    },
  },
  async mutateAndGetPayload({ sessionToken, id, companyId, }) {
    const {id: localCompanyId,} = fromGlobalId(companyId);

    const {deletedBillId} = await Parse.Cloud.run('delBill', {id, companyId: localCompanyId,}, {sessionToken});

    // parseTableCountLoader.clear(Bill({id: localCompanyId}));
    // parseTableLoader.clear(Bill({id: localCompanyId}));
    // parseIDLoader.clear([Bill({id: localCompanyId}), deletedBillId]);

    onExpense({ id: localCompanyId, }, deletedBillId);

    return { id: deletedBillId, companyId: localCompanyId, };
  },
});

module.exports.GraphQLRemoveExpenseMutation = mutationWithClientMutationId({
  name: 'RemoveExpense',
  inputFields: {
    sessionToken: { type: new GraphQLNonNull(GraphQLString) },
    id: { type: new GraphQLNonNull(GraphQLString) },
    companyId: { type: new GraphQLNonNull(GraphQLID) },
  },
  outputFields: {
    deletedExpenseId: {
      type: GraphQLID,
      resolve: ({id}) => id,
    },
    company: {
      type: companyType,
      resolve: ({companyId : id,}) => getCompany(id),
    },
  },
  async mutateAndGetPayload({ sessionToken, id, companyId, }) {
    const {id: localCompanyId,} = fromGlobalId(companyId);

    const {deletedExpenseId} = await Parse.Cloud.run('delExpense', {id, companyId: localCompanyId,}, {sessionToken});

    // parseTableCountLoader.clear(Expense({id: localCompanyId}));
    // parseTableLoader.clear(Expense({id: localCompanyId}));
    // parseIDLoader.clear([Expense({id: localCompanyId}), deletedExpenseId]);

    onExpense({ id: localCompanyId, }, deletedExpenseId);

    return { id: deletedExpenseId, companyId: localCompanyId, };
  },
});


module.exports.GraphQLRemovePaymentOfBillsMutation = mutationWithClientMutationId({
  name: 'RemovePaymentOfBills',
  inputFields: {
    sessionToken: { type: new GraphQLNonNull(GraphQLString) },
    id: { type: new GraphQLNonNull(GraphQLString) },
    companyId: { type: new GraphQLNonNull(GraphQLID) },
  },
  outputFields: {
    deletedPaymentId: {
      type: GraphQLID,
      resolve: ({id}) => id,
    },
    company: {
      type: companyType,
      resolve: ({companyId : id,}) => getCompany(id),
    },
  },
  async mutateAndGetPayload({ sessionToken, id, companyId, }) {
    const {id: localCompanyId,} = fromGlobalId(companyId);

    const {deletedPaymentId} = await Parse.Cloud.run('delPaymentOfBills', {id, companyId: localCompanyId,}, {sessionToken});

    // parseTableCountLoader.clear(PaymentOfBills({id: localCompanyId}));
    // parseTableLoader.clear(PaymentOfBills({id: localCompanyId}));
    // parseIDLoader.clear([PaymentOfBills({id: localCompanyId}), deletedPaymentId]);

    onExpense({ id: localCompanyId, }, deletedPaymentId);

    return { id: deletedPaymentId, companyId: localCompanyId, };
  },
});
