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
  parseTypedObjectInputFieldType,

  billItemInputType,

  saleItemLineInputType,
  saleItemInputType,

  expenseItemInputType,

  paymentOfInvoicesItemInputType,
  paymentOfBillsItemInputType,

  fieldValueType,

} from '../common';

export const GraphQLAddBillMutation = mutationWithClientMutationId({
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
          files: { type: new GraphQLList(new GraphQLNonNull(GraphQLString)) },
        }),
      }),
    },
  },
  outputFields: {
    billEdge: {
      type: CompanyBillsEdge,
      async resolve({id, companyId, }) {
        const bill = await getObjectByType(Bill, {companyId, id});
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
      resolve: ({ companyId, payee : { id, }, }) => getObjectByType(Vendor, {companyId, id}),
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

    const { addedBillId, changedPaymentsIds, } = await Parse.Cloud.run('addBill', {id, companyId: localCompanyId, ...props,}, {sessionToken});

    parseTableCountLoader.clear(Bill({id: localCompanyId}));
    parseTableLoader.clear(Bill({id: localCompanyId}));
    parseIDLoader.clear([Bill({id: localCompanyId}), addedBillId]);

    return {id: addedBillId, companyId: localCompanyId, changedPaymentsIds, payee: props.payee, };
  },
});

export const GraphQLAddExpenseMutation = mutationWithClientMutationId({
  name: 'AddExpense',
  inputFields: {
    sessionToken: { type: new GraphQLNonNull(GraphQLString) },
    id: { type: GraphQLString },
    companyId: { type: new GraphQLNonNull(GraphQLID) },
    props: {
      type: new GraphQLInputObjectType({
        name: 'AddExpenseProps',
        fields: () => ({
          payee: { type: new GraphQLNonNull(parseTypedObjectInputFieldType([ [  'Customer', 1 ], [ 'Vendor', 2 ] ])) },
          creditToAccountCode: { type: new GraphQLNonNull(GraphQLString) },
          date: { type: new GraphQLNonNull(GraphQLDateTime) },
          paymentMethod: { type: new GraphQLNonNull(paymentMethodType) },
          items: {
            type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(expenseItemInputType))),
          },
          paymentRef: { type: GraphQLString },
          memo: { type: GraphQLString },
          files: { type: new GraphQLList(new GraphQLNonNull(GraphQLString)) },
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
      resolve: ({ companyId, payee : { type, id, }, }) => type === 'Customer' || type === 1 ? getObjectByType(Customer, {companyId, id}) : undefined,
    },
    vendor: {
      type: vendorType,
      resolve: ({ companyId, payee : { type, id, }, }) => type === 'Vendor' || type === 2 ? getObjectByType(Vendor, {companyId, id}) : undefined,
    },
    company: {
      type: companyType,
      resolve: ({companyId}) => getCompany(companyId),
    },
  },
  async mutateAndGetPayload({sessionToken, id, companyId, props, }) {
    const {id: localCompanyId} = fromGlobalId(companyId);

    const {addedExpenseId} = await Parse.Cloud.run('addExpense', {id, companyId: localCompanyId, ...props,}, {sessionToken});

    parseTableCountLoader.clear(Expense({id: localCompanyId}));
    parseTableLoader.clear(Expense({id: localCompanyId}));
    parseIDLoader.clear([Expense({id: localCompanyId}), addedExpenseId]);

    return { id: addedExpenseId, companyId: localCompanyId, payee: props.payee, };
  },
});

export const GraphQLReceivePaymentOfBillsMutation = mutationWithClientMutationId({
  name: 'ReceivePaymentOfBills',
  inputFields: {
    sessionToken: { type: new GraphQLNonNull(GraphQLString) },
    companyId: { type: new GraphQLNonNull(GraphQLID) },
    id: { type: GraphQLString },
    props: {
      type: new GraphQLInputObjectType({
        name: 'ReceivePaymentOfBillsProps',
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
          files: { type: new GraphQLList(new GraphQLNonNull(GraphQLString)) },
        }),
      }),
    },
  },
  outputFields: {
    paymentEdge: {
      type: CompanyPaymentsOfBillsEdge,
      async resolve({id, companyId, }) {
        const payment = await getObjectByType(PaymentOfBills, {companyId, id});
        const offset = 0; // findIndex(await getCompanyPaymentsOfBills({id: companyId}), ({id}) => id === payment.id);

        return {
          cursor: offsetToCursor(offset),
          node: payment,
        };
      },
    },
    changedBillsIds: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(GraphQLString))),
      resolve: ({ companyId, changedBillsIds, }) => changedBillsIds.map(id => toGlobalId(`Bill_${companyId}`, id)),
    },
    viewer: {
      type: userType,
      resolve: () => getViewer(),
    },
    payee: {
      type: vendorType,
      resolve: ({ companyId, payee : { id, }, }) => getObjectByType(Vendor, {companyId, id}),
    },
    company: {
      type: companyType,
      resolve: ({companyId}) => getCompany(companyId),
    },
  },
  async mutateAndGetPayload({sessionToken, id, companyId, props, }) {
    const {id: localCompanyId} = fromGlobalId(companyId);

    const { addedPaymentId, changedBillsIds, } = await Parse.Cloud.run('receivePaymentOfBills', {id, companyId: localCompanyId, ...props,}, {sessionToken});

    parseTableCountLoader.clear(PaymentOfBills({id: localCompanyId}));
    parseTableLoader.clear(PaymentOfBills({id: localCompanyId}));
    parseIDLoader.clear([PaymentOfBills({id: localCompanyId}), addedPaymentId]);

    return { id: addedPaymentId, changedBillsIds, companyId: localCompanyId, payee: props.payee, };
  },
});

export const GraphQLRemoveBillMutation = mutationWithClientMutationId({
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

    parseTableCountLoader.clear(Bill({id: localCompanyId}));
    parseTableLoader.clear(Bill({id: localCompanyId}));
    parseIDLoader.clear([Bill({id: localCompanyId}), deletedBillId]);

    return {id: deletedBillId, companyId: localCompanyId};
  },
});

export const GraphQLRemoveExpenseMutation = mutationWithClientMutationId({
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

    parseTableCountLoader.clear(Expense({id: localCompanyId}));
    parseTableLoader.clear(Expense({id: localCompanyId}));
    parseIDLoader.clear([Expense({id: localCompanyId}), deletedExpenseId]);

    return {id: deletedExpenseId, companyId: localCompanyId};
  },
});


export const GraphQLRemovePaymentOfBillsMutation = mutationWithClientMutationId({
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

    parseTableCountLoader.clear(PaymentOfBills({id: localCompanyId}));
    parseTableLoader.clear(PaymentOfBills({id: localCompanyId}));
    parseIDLoader.clear([PaymentOfBills({id: localCompanyId}), deletedPaymentId]);

    return {id: deletedPaymentId, companyId: localCompanyId};
  },
});
