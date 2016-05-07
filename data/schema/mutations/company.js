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

import Employee from '../../database/Employee';
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
  CompanyEmployeesEdge,

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

export const GraphQLAddCompanyMutation = mutationWithClientMutationId({
  name: 'AddCompany',
  inputFields: {
    sessionToken: { type: new GraphQLNonNull(GraphQLString) },
    id: { type: GraphQLID },
    displayName: { type: new GraphQLNonNull(GraphQLString) },
    periodType: { type: new GraphQLNonNull(PeriodType) },
  },
  outputFields: {
    companyEdge: {
      type: UserCompaniesEdge,
      async resolve({id}) {
        const company = await getCompany(id);
        const offset = 0; // findIndex(await getCompanies(), ({id}) => id === company.id);

        return {
          cursor: offsetToCursor(offset),
          node: company,
        };
      },
    },
    viewer: {
      type: userType,
      resolve: () => getViewer(),
    },
  },
  async mutateAndGetPayload({ id, displayName, periodType, sessionToken, }) {
    const {id: localId} = id ? fromGlobalId(id) : {};
    const {addedCompanyId} = await Parse.Cloud.run('addCompany', {id: localId, displayName, periodType,}, {sessionToken});

    parseTableLoader.clear(Company);
    parseIDLoader.clear([Company, addedCompanyId]);

    parseSeqLoader.clearAll();

    return {id: addedCompanyId};
  },
});

export const GraphQLUpdateCompanySettingsMutation = mutationWithClientMutationId({
  name: 'UpdateCompanySettings',
  inputFields: {
    sessionToken: { type: new GraphQLNonNull(GraphQLString) },
    id: { type: new GraphQLNonNull(GraphQLID) },
    settings: { type: new GraphQLNonNull(companySettingsInputType) },
  },
  outputFields: {
    company: {
      type: companyType,
      resolve({id}) {
        return getCompany(id);
      },
    },
  },
  async mutateAndGetPayload({ id, settings, sessionToken, }) {
    const {id: localId} = fromGlobalId(id);
    const {updatedCompanyId} = await Parse.Cloud.run('updateCompanySettings', {id: localId, settings,}, {sessionToken});

    parseTableLoader.clear(Company);
    parseIDLoader.clear([Company, updatedCompanyId]);

    return {id: updatedCompanyId};
  },
});

export const GraphQLUpdateCustomerNotesMutation = mutationWithClientMutationId({
  name: 'UpdateCustomerNotes',
  inputFields: {
    sessionToken: { type: new GraphQLNonNull(GraphQLString) },
    companyId: { type: new GraphQLNonNull(GraphQLID) },
    id: { type: new GraphQLNonNull(GraphQLString) },
    notes: { type: GraphQLString, },
  },
  outputFields: {
    customer: {
      type: customerType,
      resolve({ companyId, id, }) {
        return getObjectByType(Customer, { companyId, id, });
      },
    },
  },
  async mutateAndGetPayload({ id, companyId, notes, sessionToken, }) {
    const {id: localCompanyId} = fromGlobalId(companyId);
    const { updatedCustomerId, } = await Parse.Cloud.run('updateCustomerNotes', { id, companyId: localCompanyId, notes,}, {sessionToken});

    const Type = Customer({ id: localCompanyId, });

    parseTableLoader.clear(Type);
    parseIDLoader.clear([Type, updatedCustomerId]);

    return { id: updatedCustomerId, companyId: localCompanyId, };
  },
});

export const GraphQLUpdateVendorNotesMutation = mutationWithClientMutationId({
  name: 'UpdateVendorNotes',
  inputFields: {
    sessionToken: { type: new GraphQLNonNull(GraphQLString) },
    companyId: { type: new GraphQLNonNull(GraphQLID) },
    id: { type: new GraphQLNonNull(GraphQLString) },
    notes: { type: GraphQLString, },
  },
  outputFields: {
    vendor: {
      type: vendorType,
      resolve({ companyId, id, }) {
        return getObjectByType(Vendor, { companyId, id, });
      },
    },
  },
  async mutateAndGetPayload({ id, companyId, notes, sessionToken, }) {
    const {id: localCompanyId} = fromGlobalId(companyId);
    const { updatedVendorId, } = await Parse.Cloud.run('updateVendorNotes', { id, companyId: localCompanyId, notes,}, {sessionToken});

    const Type = Vendor({ id: localCompanyId, });

    parseTableLoader.clear(Type);
    parseIDLoader.clear([Type, updatedVendorId]);

    return { id: updatedVendorId, companyId: localCompanyId, };
  },
});


export const GraphQLUpdateCompanySalesSettingsMutation = mutationWithClientMutationId({
  name: 'UpdateCompanySalesSettings',
  inputFields: {
    sessionToken: { type: new GraphQLNonNull(GraphQLString) },
    id: { type: new GraphQLNonNull(GraphQLID) },
    settings: { type: new GraphQLNonNull(companySalesSettingsInputType) },
  },
  outputFields: {
    company: {
      type: companyType,
      resolve({id}) {
        return getCompany(id);
      },
    },
  },
  async mutateAndGetPayload({ id, settings, sessionToken, }) {
    const {id: localId} = fromGlobalId(id);
    const {updatedCompanyId} = await Parse.Cloud.run('updateCompanySalesSettings', {id: localId, settings,}, {sessionToken});

    parseTableLoader.clear(Company);
    parseIDLoader.clear([Company, updatedCompanyId]);

    return {id: updatedCompanyId};
  },
});

export const GraphQLUpdateCompanyExpensesSettingsMutation = mutationWithClientMutationId({
  name: 'UpdateCompanyExpensesSettings',
  inputFields: {
    sessionToken: { type: new GraphQLNonNull(GraphQLString) },
    id: { type: new GraphQLNonNull(GraphQLID) },
    settings: { type: new GraphQLNonNull(companyExpensesSettingsInputType) },
  },
  outputFields: {
    company: {
      type: companyType,
      resolve({id}) {
        return getCompany(id);
      },
    },
  },
  async mutateAndGetPayload({ id, settings, sessionToken, }) {
    const {id: localId} = fromGlobalId(id);
    const {updatedCompanyId} = await Parse.Cloud.run('updateCompanyExpensesSettings', {id: localId, settings,}, {sessionToken});

    parseTableLoader.clear(Company);
    parseIDLoader.clear([Company, updatedCompanyId]);

    return {id: updatedCompanyId};
  },
});

export const GraphQLUpdateCompanyPaymentsSettingsMutation = mutationWithClientMutationId({
  name: 'UpdateCompanyPaymentsSettings',
  inputFields: {
    sessionToken: { type: new GraphQLNonNull(GraphQLString) },
    id: { type: new GraphQLNonNull(GraphQLID) },
    settings: { type: new GraphQLNonNull(companyPaymentsSettingsInputType) },
  },
  outputFields: {
    company: {
      type: companyType,
      resolve({id}) {
        return getCompany(id);
      },
    },
  },
  async mutateAndGetPayload({ id, settings, sessionToken, }) {
    const {id: localId} = fromGlobalId(id);
    const {updatedCompanyId} = await Parse.Cloud.run('updateCompanyPaymentsSettings', {id: localId, settings,}, {sessionToken});

    parseTableLoader.clear(Company);
    parseIDLoader.clear([Company, updatedCompanyId]);

    return {id: updatedCompanyId};
  },
});

export const GraphQLUpdateCompanyMutation = mutationWithClientMutationId({
  name: 'UpdateCompany',
  inputFields: {
    sessionToken: { type: new GraphQLNonNull(GraphQLString) },
    id: { type: new GraphQLNonNull(GraphQLID) },
    fieldInfos: { type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(fieldValueType))) },
  },
  outputFields: {
    company: {
      type: companyType,
      resolve({id}) {
        return getCompany(id);
      },
    },
  },
  async mutateAndGetPayload({ id, fieldInfos, sessionToken, }) {
    const {id: localId} = fromGlobalId(id);
    const {updatedCompanyId} = await Parse.Cloud.run('updateCompany', {id: localId, fieldInfos,}, {sessionToken});

    parseTableLoader.clear(Company);
    parseIDLoader.clear([Company, updatedCompanyId]);

    return {id: updatedCompanyId};
  },
});

export const GraphQLRemoveCompanyMutation = mutationWithClientMutationId({
  name: 'RemoveCompany',
  inputFields: {
    sessionToken: { type: new GraphQLNonNull(GraphQLString) },
    id: { type: new GraphQLNonNull(GraphQLID) },
  },
  outputFields: {
    deletedCompanyId: {
      type: GraphQLID,
      resolve: ({id}) => id,
    },
    viewer: {
      type: userType,
      resolve: () => getViewer(),
    },
  },
  async mutateAndGetPayload({id, sessionToken}) {
    const {id: localId} = fromGlobalId(id);
    const {deletedCompanyId} = await Parse.Cloud.run('delCompany', {id: localId,}, {sessionToken});

    parseTableLoader.clear(Company);
    parseIDLoader.clear([Company, deletedCompanyId]);

    parseSeqLoader.clearAll();

    return {id: deletedCompanyId};
  },
});

export const GraphQLAddEmployeeMutation = mutationWithClientMutationId({
  name: 'AddEmployee',
  inputFields: {
    id: { type: GraphQLString },
    sessionToken: { type: new GraphQLNonNull(GraphQLString) },
    companyId: { type: new GraphQLNonNull(GraphQLID) },
    fieldInfos: { type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(fieldValueType))) },
  },
  outputFields: {
    employeeEdge: {
      type: CompanyEmployeesEdge,
      async resolve({id, companyId, }) {
        const employee = await getObjectByType(Employee, {companyId, id});
        const offset = 0; // findIndex(await getCompanyEmployees({id: companyId}), ({id}) => id === employee.id);

        return {
          cursor: offsetToCursor(offset),
          node: employee,
        };
      },
    },
    viewer: {
      type: userType,
      resolve: () => getViewer(),
    },
    company: {
      type: companyType,
      resolve: ({companyId}) => getCompany(companyId),
    },
  },
  async mutateAndGetPayload({id, sessionToken, companyId, fieldInfos, }) {
    const {id: localCompanyId} = fromGlobalId(companyId);

    const {addedEmployeeId} = await Parse.Cloud.run('addEmployee', {id, fieldInfos, companyId: localCompanyId,}, {sessionToken});

    parseTableLoader.clear(Employee({id: localCompanyId}));
    parseIDLoader.clear([Employee({id: localCompanyId}), addedEmployeeId]);

    return {id: addedEmployeeId, companyId: localCompanyId};
  },
});

export const GraphQLRemoveEmployeeMutation = mutationWithClientMutationId({
  name: 'RemoveEmployee',
  inputFields: {
    sessionToken: { type: new GraphQLNonNull(GraphQLString) },
    id: { type: new GraphQLNonNull(GraphQLID) },
    companyId: { type: new GraphQLNonNull(GraphQLID) },
  },
  outputFields: {
    deletedEmployeeId: {
      type: GraphQLID,
      resolve: ({id}) => id,
    },
    company: {
      type: companyType,
      resolve: ({companyId : id}) => getCompany(id),
    },
  },
  async mutateAndGetPayload({id, companyId, sessionToken}) {
    const {id: localEmployeeId} = fromGlobalId(id);
    const {id: localCompanyId} = fromGlobalId(companyId);
    const {deletedEmployeeId} = await Parse.Cloud.run('delEmployee', {id: localEmployeeId,}, {sessionToken});

    parseTableLoader.clear(Employee({id: localCompanyId}));
    parseIDLoader.clear([Employee({id: localCompanyId}), deletedEmployeeId]);

    return {id: deletedEmployeeId, companyId};
  },
});

export const GraphQLAddCustomerMutation = mutationWithClientMutationId({
  name: 'AddCustomer',
  inputFields: {
    id: { type: GraphQLString },
    sessionToken: { type: new GraphQLNonNull(GraphQLString) },
    companyId: { type: new GraphQLNonNull(GraphQLID) },
    fieldInfos: { type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(fieldValueType))) },
  },
  outputFields: {
    customerEdge: {
      type: CompanyCustomersEdge,
      async resolve({id, companyId, }) {
        const customer = await getObjectByType(Customer, {companyId, id});
        const offset = 0; // findIndex(await getCompanyCustomers({id: companyId}), ({id}) => id === customer.id);

        return {
          cursor: offsetToCursor(offset),
          node: customer,
        };
      },
    },
    viewer: {
      type: userType,
      resolve: () => getViewer(),
    },
    company: {
      type: companyType,
      resolve: ({companyId}) => getCompany(companyId),
    },
  },
  async mutateAndGetPayload({id, sessionToken, companyId, fieldInfos, }) {
    const {id: localCompanyId} = fromGlobalId(companyId);

    const {addedCustomerId} = await Parse.Cloud.run('addCustomer', {id, fieldInfos, companyId: localCompanyId,}, {sessionToken});

    parseTableLoader.clear(Customer({id: localCompanyId}));
    parseIDLoader.clear([Customer({id: localCompanyId}), addedCustomerId]);

    return {id: addedCustomerId, companyId: localCompanyId};
  },
});

export const GraphQLRemoveCustomerMutation = mutationWithClientMutationId({
  name: 'RemoveCustomer',
  inputFields: {
    sessionToken: { type: new GraphQLNonNull(GraphQLString) },
    id: { type: new GraphQLNonNull(GraphQLID) },
    companyId: { type: new GraphQLNonNull(GraphQLID) },
  },
  outputFields: {
    deletedCustomerId: {
      type: GraphQLID,
      resolve: ({id}) => id,
    },
    company: {
      type: companyType,
      resolve: ({companyId : id}) => getCompany(id),
    },
  },
  async mutateAndGetPayload({id, companyId, sessionToken}) {
    const {id: localCustomerId} = fromGlobalId(id);
    const {id: localCompanyId} = fromGlobalId(companyId);
    const {deletedCustomerId} = await Parse.Cloud.run('delCustomer', {id: localCustomerId,}, {sessionToken});

    parseTableLoader.clear(Customer({id: localCompanyId}));
    parseIDLoader.clear([Customer({id: localCompanyId}), deletedCustomerId]);

    return {id: deletedCustomerId, companyId};
  },
});

export const GraphQLAddVendorMutation = mutationWithClientMutationId({
  name: 'AddVendor',
  inputFields: {
    id: { type: GraphQLString },
    sessionToken: { type: new GraphQLNonNull(GraphQLString) },
    companyId: { type: new GraphQLNonNull(GraphQLID) },
    fieldInfos: { type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(fieldValueType))) },
  },
  outputFields: {
    vendorEdge: {
      type: CompanyVendorsEdge,
      async resolve({id, companyId, }) {
        const vendor = await getObjectByType(Vendor, {companyId, id});
        const offset = 0;// findIndex(await getCompanyVendors({id: companyId}), ({id}) => id === vendor.id);

        return {
          cursor: offsetToCursor(offset),
          node: vendor,
        };
      },
    },
    viewer: {
      type: userType,
      resolve: () => getViewer(),
    },
    company: {
      type: companyType,
      resolve: ({companyId}) => getCompany(companyId),
    },
  },
  async mutateAndGetPayload({id, sessionToken, companyId, fieldInfos, }) {
    const {id: localCompanyId} = fromGlobalId(companyId);
    const {addedVendorId} = await Parse.Cloud.run('addVendor', {id, fieldInfos, companyId: localCompanyId,}, {sessionToken});

    parseTableLoader.clear(Vendor({id: localCompanyId}));
    parseIDLoader.clear([Vendor({id: localCompanyId}), addedVendorId]);

    return {id: addedVendorId, companyId: localCompanyId};
  },
});

export const GraphQLRemoveVendorMutation = mutationWithClientMutationId({
  name: 'RemoveVendor',
  inputFields: {
    sessionToken: { type: new GraphQLNonNull(GraphQLString) },
    id: { type: new GraphQLNonNull(GraphQLID) },
    companyId: { type: new GraphQLNonNull(GraphQLID) },
  },
  outputFields: {
    deletedVendorId: {
      type: GraphQLID,
      resolve: ({id}) => id,
    },
    company: {
      type: companyType,
      resolve: ({companyId : id}) => getCompany(id),
    },
  },
  async mutateAndGetPayload({id, companyId, sessionToken}) {
    const {id: localVendorId} = fromGlobalId(id);
    const {id: localCompanyId} = fromGlobalId(companyId);
    const {deletedVendorId} = await Parse.Cloud.run('delVendor', {id: localVendorId,}, {sessionToken});

    parseTableLoader.clear(Vendor({id: localCompanyId}));
    parseIDLoader.clear([Vendor({id: localCompanyId}), deletedVendorId]);

    return {id: deletedVendorId, companyId};
  },
});

export const GraphQLAddProductMutation = mutationWithClientMutationId({
  name: 'AddProduct',
  inputFields: {
    sessionToken: { type: new GraphQLNonNull(GraphQLString) },
    id: { type: GraphQLString },
    companyId: { type: new GraphQLNonNull(GraphQLID) },
    fieldInfos: { type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(fieldValueType))) },
  },
  outputFields: {
    productEdge: {
      type: CompanyProductsEdge,
      async resolve({id, companyId, }) {
        const product = await getObjectByType(Product, {companyId, id});
        const offset = 0; // findIndex(await getCompanyProducts({id: companyId}), ({id}) => id === product.id);

        return {
          cursor: offsetToCursor(offset),
          node: product,
        };
      },
    },
    company: {
      type: companyType,
      resolve: ({companyId}) => getCompany(companyId),
    },
  },
  async mutateAndGetPayload({ id, companyId, fieldInfos, sessionToken, }) {
    const {id: localCompanyId} = fromGlobalId(companyId);
    const {addedProductId} = await Parse.Cloud.run('addProduct', {id, companyId: localCompanyId, fieldInfos,}, {sessionToken});

    parseTableLoader.clear(Product({id: localCompanyId}));
    parseIDLoader.clear([Product({id: localCompanyId}), addedProductId]);

    return {id: addedProductId, companyId: localCompanyId};
  },
});

export const GraphQLRemoveProductMutation = mutationWithClientMutationId({
  name: 'RemoveProduct',
  inputFields: {
    sessionToken: { type: new GraphQLNonNull(GraphQLString) },
    id: { type: new GraphQLNonNull(GraphQLID) },
    companyId: { type: new GraphQLNonNull(GraphQLID) },
  },
  outputFields: {
    deletedProductId: {
      type: GraphQLID,
      resolve: ({id}) => id,
    },
    company: {
      type: companyType,
      resolve: ({companyId : id}) => getCompany(id),
    },
  },
  async mutateAndGetPayload({id, companyId, sessionToken}) {
    const {id: localProductId} = fromGlobalId(id);
    const {id: localCompanyId} = fromGlobalId(companyId);
    const {deletedProductId} = await Parse.Cloud.run('delProduct', {id: localProductId,}, {sessionToken});

    parseTableLoader.clear(Product({id: localCompanyId}));
    parseIDLoader.clear([Product({id: localCompanyId}), deletedProductId]);

    return {id: deletedProductId, companyId};
  },
});

export const GraphQLLogInMutation = mutationWithClientMutationId({
  name: 'LogIn',
  inputFields: {
    email: { type: new GraphQLNonNull(GraphQLString) },
    password: { type: GraphQLString },
  },
  outputFields: {
    viewer: {
      type: userType,
      resolve({user}) {
        return user;
      },
    },
  },
  async mutateAndGetPayload({ email, password, }) {
    const user = await logIn(email, password);

    parseIDLoader.clear([User, user.id]);

    return {user};
  },
});

export const GraphQLLogOutMutation = mutationWithClientMutationId({
  name: 'LogOut',
  inputFields: {
    viewerId: { type: new GraphQLNonNull(GraphQLID) },
  },
  outputFields: {
    viewer: {
      type: userType,
      resolve() {
        return null;
      },
    },
  },
  async mutateAndGetPayload({ viewerId, }) {
    await logOut();

    parseIDLoader.clear([User, viewerId]);

    return {viewerId};
  },
});
