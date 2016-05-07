import {
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
} from 'graphql';

import {
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
} from 'graphql-relay';

import {
  // GraphQLEmail,
  // GraphQLURL,
  // GraphQLDateTime,
  // GraphQLLimitedString,
  // GraphQLPassword
} from 'graphql-custom-types';

// const GraphQLDateTime = GraphQLString;
import GraphQLDateTime from 'graphql-custom-datetype';
const GraphQLEmail = GraphQLString;
const GraphQLURL = GraphQLString;
const GraphQLLimitedString = GraphQLString;
const GraphQLPassword = GraphQLString;

import {
  parseTableCountLoader,
  parseTableLoader,
  parseIDLoader,
  parseSeqLoader,
} from '../../database/loaders';

import Company from '../../database/Company';

import findIndex from 'lodash.findindex';

import { logIn, logOut, } from '../../auth';

import Parse from 'parse';

import {
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

} from '../../database/index';

import Product from '../../database/Product';

import Expense from '../../database/Expense';
import Sale from '../../database/Sale';
import Invoice from '../../database/Invoice';
import Bill from '../../database/Bill';
import PaymentOfInvoices from '../../database/PaymentOfInvoices';
import PaymentOfBills from '../../database/PaymentOfBills';

import Customer from '../../database/Customer';
import Vendor from '../../database/Vendor';

import {
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

  CompanyBillsConnection,
  CompanyBillsEdge,

  CompanyInvoicesConnection,
  CompanyInvoicesEdge,

  CompanySalesConnection,
  CompanySalesEdge,

  CompanyExpensesConnection,
  CompanyExpensesEdge,

  CompanyPaymentsOfBillsConnection,
  CompanyPaymentsOfBillsEdge,

  CompanyPaymentsOfInvoicesConnection,
  CompanyPaymentsOfInvoicesEdge,

  CompanyCustomersConnection,
  CompanyCustomersEdge,

  CompanyVendorsConnection,
  CompanyVendorsEdge,

  CompanyProductsConnection,
  CompanyProductsEdge,

  saleOrPaymentOfInvoicesType,

} from '../types';

import {
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

} from '../common';

export const GraphQLAddInvoiceMutation = mutationWithClientMutationId({
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
          files: { type: new GraphQLList(new GraphQLNonNull(GraphQLString)) },
        }),
      }),
    },
  },
  outputFields: {
    invoiceEdge: {
      type: CompanyInvoicesEdge,
      async resolve({id, companyId, }) {
        const invoice = await getObjectByType(Invoice, {companyId, id});
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
      resolve: ({ companyId, customer : { id, }, }) => getObjectByType(Customer, {companyId, id}),
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

    const { addedInvoiceId, changedPaymentsIds, } = await Parse.Cloud.run('addInvoice', {id, companyId: localCompanyId, ...props,}, {sessionToken});

    parseTableCountLoader.clear(Invoice({id: localCompanyId}));
    parseTableLoader.clear(Invoice({id: localCompanyId}));
    parseIDLoader.clear([Invoice({id: localCompanyId}), addedInvoiceId]);

    parseSeqLoader.clearCompany(localCompanyId);

    return { id: addedInvoiceId, companyId: localCompanyId, changedPaymentsIds, customer: props.customer, };
  },
});

export const GraphQLAddSaleMutation = mutationWithClientMutationId({
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
          files: { type: new GraphQLList(new GraphQLNonNull(GraphQLString)) },
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
      resolve: ({ companyId, customer : { id, }, }) => getObjectByType(Customer, {companyId, id}),
    },
    company: {
      type: companyType,
      resolve: ({companyId}) => getCompany(companyId),
    },
  },
  async mutateAndGetPayload({sessionToken, id, companyId, props, }) {
    const {id: localCompanyId} = fromGlobalId(companyId);

    const {addedSaleId} = await Parse.Cloud.run('addSale', {id, companyId: localCompanyId, ...props,}, {sessionToken});

    parseTableCountLoader.clear(Sale({id: localCompanyId}));
    parseTableLoader.clear(Sale({id: localCompanyId}));
    parseIDLoader.clear([Sale({id: localCompanyId}), addedSaleId]);

    parseSeqLoader.clearCompany(localCompanyId);

    return {id: addedSaleId, companyId: localCompanyId, customer: props.customer, };
  },
});

export const GraphQLReceivePaymentOfInvoicesMutation = mutationWithClientMutationId({
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
          files: { type: new GraphQLList(new GraphQLNonNull(GraphQLString)) },
        }),
      }),
    },
  },
  outputFields: {
    paymentEdge: {
      type: CompanyPaymentsOfInvoicesEdge,
      async resolve({id, companyId, }) {
        const payment = await getObjectByType(PaymentOfInvoices, {companyId, id});
        const offset = 0; // findIndex(await getCompanyPaymentsOfInvoices({id: companyId}), ({id}) => id === payment.id);

        return {
          cursor: offsetToCursor(offset),
          node: payment,
        };
      },
    },
    changedInvoicesIds: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(GraphQLString))),
      resolve: ({ companyId, changedInvoicesIds, }) => changedInvoicesIds.map(id => toGlobalId(`Invoice_${companyId}`, id)),
    },
    viewer: {
      type: userType,
      resolve: () => getViewer(),
    },
    customer: {
      type: customerType,
      resolve: ({ companyId, customer : { id, }, }) => getObjectByType(Customer, {companyId, id}),
    },
    company: {
      type: companyType,
      resolve: ({companyId}) => getCompany(companyId),
    },
  },
  async mutateAndGetPayload({sessionToken, id, companyId, props, }) {
    const {id: localCompanyId} = fromGlobalId(companyId);

    const { addedPaymentId, changedInvoicesIds, } = await Parse.Cloud.run('receivePaymentOfInvoices', {id, companyId: localCompanyId, ...props,}, {sessionToken});

    parseTableCountLoader.clear(PaymentOfInvoices({id: localCompanyId}));
    parseTableLoader.clear(PaymentOfInvoices({id: localCompanyId}));
    parseIDLoader.clear([PaymentOfInvoices({id: localCompanyId}), addedPaymentId]);

    return { id: addedPaymentId, changedInvoicesIds, companyId: localCompanyId, customer: props.customer, };
  },
});

export const GraphQLRemoveInvoiceMutation = mutationWithClientMutationId({
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

    parseTableCountLoader.clear(Invoice({id: localCompanyId}));
    parseTableLoader.clear(Invoice({id: localCompanyId}));
    parseIDLoader.clear([Invoice({id: localCompanyId}), deletedInvoiceId]);

    parseSeqLoader.clearCompany(localCompanyId);

    return {id: deletedInvoiceId, companyId: localCompanyId};
  },
});


export const GraphQLRemoveSaleMutation = mutationWithClientMutationId({
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

    parseTableCountLoader.clear(Sale({id: localCompanyId}));
    parseTableLoader.clear(Sale({id: localCompanyId}));
    parseIDLoader.clear([Sale({id: localCompanyId}), deletedSaleId]);

    parseSeqLoader.clearCompany(localCompanyId);

    return {id: deletedSaleId, companyId: localCompanyId};
  },
});


export const GraphQLRemovePaymentOfInvoicesMutation = mutationWithClientMutationId({
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

    parseTableCountLoader.clear(PaymentOfInvoices({id: localCompanyId}));
    parseTableLoader.clear(PaymentOfInvoices({id: localCompanyId}));
    parseIDLoader.clear([PaymentOfInvoices({id: localCompanyId}), deletedPaymentId]);

    return {id: deletedPaymentId, companyId: localCompanyId};
  },
});
