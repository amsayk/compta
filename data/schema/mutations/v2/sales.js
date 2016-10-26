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

module.exports.GraphQLAddInvoiceMutation = mutationWithClientMutationId({
  name: 'AddInvoice',
  inputFields: {
    sessionToken: { type: new GraphQLNonNull(GraphQLString) },
    id: { type: GraphQLString },
    companyId: { type: new GraphQLNonNull(GraphQLID) },
    props: {
      type: new GraphQLInputObjectType({
        name: 'AddInvoiceProps',
        fields: () => ({
          customer: {
            type: parseObjectInputFieldType,
          },
          billingAddress: { type: new GraphQLNonNull(GraphQLString) },
          terms: { type: new GraphQLNonNull(paymentTermsType) },
          items: {
            type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(invoiceItemInputType))),
          },
          date: { type: new GraphQLNonNull(GraphQLDateTime) },
          dueDate: { type: new GraphQLNonNull(GraphQLDateTime) },
          discountType: { type: new GraphQLNonNull(discountValueType), },
          discountValue: { type: GraphQLFloat, defaultValue: 0.0, },
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
    invoiceEdge: {
      type: CompanySalesEdge,
      async resolve({id, companyId, }) {
        const invoice = await getObjectByType(Sale, {companyId, id});
        const offset = 0; // findIndex(await getCompanyInvoices({id: companyId}), ({id}) => id === invoice.id);

        return {
          cursor: offsetToCursor(offset),
          node: invoice,
        };
      },
    },
    changedPaymentsIds: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(GraphQLString))),
      resolve: ({ changedPaymentsIds, }) => changedPaymentsIds,
    },
    customer: {
      type: customerType,
      resolve: ({ companyId, customer : { id, }, }) => getObjectByType(People, {companyId, id}),
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
        kind: 'Invoice',
      };
    }

    const { addedInvoiceId, changedPaymentsIds, } = await Parse.Cloud.run('addInvoice', { ..._props, id, companyId: localCompanyId, ...props,}, {sessionToken});

    // parseTableCountLoader.clear(Invoice({id: localCompanyId}));
    // parseTableLoader.clear(Invoice({id: localCompanyId}));
    // parseIDLoader.clear([Invoice({id: localCompanyId}), addedInvoiceId]);

    onSale({ id: localCompanyId, }, addedInvoiceId);

    return { id: addedInvoiceId, companyId: localCompanyId, changedPaymentsIds, customer: props.customer, };
  },
});

module.exports.GraphQLAddSaleMutation = mutationWithClientMutationId({
  name: 'AddSale',
  inputFields: {
    sessionToken: { type: new GraphQLNonNull(GraphQLString) },
    companyId: { type: new GraphQLNonNull(GraphQLID) },
    id: { type: GraphQLString },
    props: {
      type: new GraphQLInputObjectType({
        name: 'AddSaleProps',
        fields: () => ({
          customer: { type: parseObjectInputFieldType },
          billingAddress: { type: new GraphQLNonNull(GraphQLString) },
          date: { type: new GraphQLNonNull(GraphQLDateTime) },
          paymentMethod: { type: new GraphQLNonNull(paymentMethodType) },
          depositToAccountCode: { type: new GraphQLNonNull(GraphQLString) },
          items: {
            type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(saleItemInputType))),
          },
          discountType: { type: new GraphQLNonNull(discountValueType), },
          discountValue: { type: GraphQLFloat, defaultValue: 0.0, },
          memo: { type: GraphQLString },
          files: { type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(fileItemInputType))) },

          inputType: {
            type: new GraphQLNonNull(VATInputType),
          },
        })
      }),
    },
  },
  outputFields: {
    saleEdge: {
      type: CompanySalesEdge,
      async resolve({id, companyId, }) {
        const sale = await getObjectByType(Sale, {companyId, id});
        const offset = 0; // findIndex(await getCompanySales({id: companyId}), ({id}) => id === sale.id);

        return {
          cursor: offsetToCursor(offset),
          node: sale,
        };
      },
    },
    customer: {
      type: customerType,
      resolve: ({ companyId, customer : { id, }, }) => getObjectByType(People, {companyId, id}),
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
        kind: 'Sale',
      };
    }

    const {addedSaleId} = await Parse.Cloud.run('addSale', { ..._props, id, companyId: localCompanyId, ...props,}, {sessionToken});

    // parseTableCountLoader.clear(Sale({id: localCompanyId}));
    // parseTableLoader.clear(Sale({id: localCompanyId}));
    // parseIDLoader.clear([Sale({id: localCompanyId}), addedSaleId]);

    onSale({ id: localCompanyId, }, addedSaleId);

    return { id: addedSaleId, companyId: localCompanyId, customer: props.customer, };
  },
});

module.exports.GraphQLReceivePaymentOfInvoicesMutation = mutationWithClientMutationId({
  name: 'ReceivePaymentOfInvoices',
  inputFields: {
    sessionToken: { type: new GraphQLNonNull(GraphQLString) },
    companyId: { type: new GraphQLNonNull(GraphQLID) },
    id: { type: GraphQLString },
    props: {
      type: new GraphQLInputObjectType({
        name: 'ReceivePaymentOfInvoicesProps',
        fields: () => ({
          customer: {
            type: parseObjectInputFieldType,
          },
          date: { type: new GraphQLNonNull(GraphQLDateTime) },
          paymentMethod: { type: new GraphQLNonNull(paymentMethodType) },
          paymentRef: { type: GraphQLString },
          depositToAccountCode: { type: new GraphQLNonNull(GraphQLString) },
          amountReceived: { type: new GraphQLNonNull(GraphQLFloat) },
          items: {
            type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(paymentOfInvoicesItemInputType))),
          },
          memo: { type: GraphQLString },
          files: { type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(fileItemInputType))) },
        }),
      }),
    },
  },
  outputFields: {
    paymentEdge: {
      type: CompanySalesEdge,
      async resolve({id, companyId, }) {
        const payment = await getObjectByType(Sale, {companyId, id});
        const offset = 0; // findIndex(await getCompanyPaymentsOfInvoices({id: companyId}), ({id}) => id === payment.id);

        return {
          cursor: offsetToCursor(offset),
          node: payment,
        };
      },
    },
    changedInvoicesIds: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(GraphQLString))),
      resolve: ({ companyId, changedInvoicesIds, }) => changedInvoicesIds.map(id => toGlobalId(`Sale_${companyId}`, id)),
    },
    viewer: {
      type: userType,
      resolve: () => getViewer(),
    },
    customer: {
      type: customerType,
      resolve: ({ companyId, customer : { id, }, }) => getObjectByType(People, {companyId, id}),
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
        kind: 'PaymentOfInvoices',
      };
    }

    const { addedPaymentId, changedInvoicesIds, } = await Parse.Cloud.run('receivePaymentOfInvoices', { ..._props, id, companyId: localCompanyId, ...props,}, {sessionToken});

    // parseTableCountLoader.clear(PaymentOfInvoices({id: localCompanyId}));
    // parseTableLoader.clear(PaymentOfInvoices({id: localCompanyId}));
    // parseIDLoader.clear([PaymentOfInvoices({id: localCompanyId}), addedPaymentId]);

    onSale({ id: localCompanyId, }, addedPaymentId);

    return { id: addedPaymentId, changedInvoicesIds, companyId: localCompanyId, customer: props.customer, };
  },
});

module.exports.GraphQLRemoveInvoiceMutation = mutationWithClientMutationId({
  name: 'RemoveInvoice',
  inputFields: {
    sessionToken: { type: new GraphQLNonNull(GraphQLString) },
    id: { type: new GraphQLNonNull(GraphQLString) },
    companyId: { type: new GraphQLNonNull(GraphQLID) },
  },
  outputFields: {
    deletedInvoiceId: {
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

    const {deletedInvoiceId} = await Parse.Cloud.run('delInvoice', {id, companyId: localCompanyId,}, {sessionToken});

    // parseTableCountLoader.clear(Invoice({id: localCompanyId}));
    // parseTableLoader.clear(Invoice({id: localCompanyId}));
    // parseIDLoader.clear([Invoice({id: localCompanyId}), deletedInvoiceId]);

    onSale({ id: localCompanyId, }, deletedInvoiceId);

    return { id: deletedInvoiceId, companyId: localCompanyId, };
  },
});


module.exports.GraphQLRemoveSaleMutation = mutationWithClientMutationId({
  name: 'RemoveSale',
  inputFields: {
    sessionToken: { type: new GraphQLNonNull(GraphQLString) },
    id: { type: new GraphQLNonNull(GraphQLString) },
    companyId: { type: new GraphQLNonNull(GraphQLID) },
  },
  outputFields: {
    deletedSaleId: {
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

    const {deletedSaleId} = await Parse.Cloud.run('delSale', {id, companyId: localCompanyId,}, {sessionToken});

    // parseTableCountLoader.clear(Sale({id: localCompanyId}));
    // parseTableLoader.clear(Sale({id: localCompanyId}));
    // parseIDLoader.clear([Sale({id: localCompanyId}), deletedSaleId]);

    onSale({ id: localCompanyId, }, deletedSaleId);

    return { id: deletedSaleId, companyId: localCompanyId, };
  },
});


module.exports.GraphQLRemovePaymentOfInvoicesMutation = mutationWithClientMutationId({
  name: 'RemovePaymentOfInvoices',
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

    const {deletedPaymentId} = await Parse.Cloud.run('delPaymentOfInvoices', {id, companyId: localCompanyId,}, {sessionToken});

    // parseTableCountLoader.clear(PaymentOfInvoices({id: localCompanyId}));
    // parseTableLoader.clear(PaymentOfInvoices({id: localCompanyId}));
    // parseIDLoader.clear([PaymentOfInvoices({id: localCompanyId}), deletedPaymentId]);

    onSale({ id: localCompanyId, }, deletedPaymentId);

    return { id: deletedPaymentId, companyId: localCompanyId, };
  },
});
