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

} = require('./change');

const GraphQLDateTime = require('graphql-custom-datetype');

const GraphQLEmail = GraphQLString;
const GraphQLURL = GraphQLString;
const GraphQLLimitedString = GraphQLString;
const GraphQLPassword = GraphQLString;

module.exports.GraphQLCreateOrUpdateCompanyMutation = mutationWithClientMutationId({
  name: 'CreateOrUpdateCompany',
  inputFields: {
    sessionToken: { type: new GraphQLNonNull(GraphQLString) },
    id: { type: GraphQLID },
    fieldInfos: { type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(fieldValueType))) },
    logo: { type: fileItemInputType, },
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
  async mutateAndGetPayload({ id, fieldInfos, logo, sessionToken, }) {
    const {id: localId} = id ? fromGlobalId(id) : {};
    const {companyId} = await Parse.Cloud.run('createOrUpdateCompany', {id: localId, ...(logo ? { logo: logo.isNull ? null : { name: logo.name, type: logo.type, size: logo.size, dataBase64: logo.dataBase64, }, } : {}), fieldInfos,}, {sessionToken});

    // parseTableLoader.clear(Company);
    // parseIDLoader.clear([Company, companyId]);

    onCompany({ id: companyId, });

    return {id: companyId};
  },
});

module.exports.GraphQLGenPdfMutation = mutationWithClientMutationId({
  name: 'GenPdf',
  inputFields: {
    sessionToken: { type: new GraphQLNonNull(GraphQLString) },
    companyId: { type: new GraphQLNonNull(GraphQLID) },
    type: { type: new GraphQLNonNull(GraphQLString) },
    objectId: { type: GraphQLString, },
  },
  outputFields: {
    pdf: {
      type: new GraphQLNonNull(GraphQLString),
      resolve: ({ pdf, }) => pdf,
    },
  },
  async mutateAndGetPayload({ objectId, type, companyId, sessionToken, }) {
    const { id: localId, } = fromGlobalId(companyId);
    const { pdf, } = await Parse.Cloud.run('genPdf', { companyId: localId, objectId, type, }, {sessionToken});

    return { pdf, };
  },
});

module.exports.GraphQLGenExcelMutation = mutationWithClientMutationId({
  name: 'GenExcel',
  inputFields: {
    sessionToken: { type: new GraphQLNonNull(GraphQLString) },
    companyId: { type: new GraphQLNonNull(GraphQLID) },
    type: { type: new GraphQLNonNull(GraphQLString) },
    objectId: { type: GraphQLString, },
  },
  outputFields: {
    excel: {
      type: new GraphQLNonNull(GraphQLString),
      resolve: ({ excel, }) => excel,
    },
  },
  async mutateAndGetPayload({ objectId, type, companyId, sessionToken, }) {
    const { id: localId, } = fromGlobalId(companyId);
    const { excel, } = await Parse.Cloud.run('genExcel', { companyId: localId, type, objectId, }, {sessionToken});

    return { excel, };
  },
});

module.exports.GraphQLSetupVATMutation = mutationWithClientMutationId({
  name: 'SetupVAT',
  inputFields: {
    sessionToken: { type: new GraphQLNonNull(GraphQLString) },
    id: { type: new GraphQLNonNull(GraphQLID), },
    props: {
      type: new GraphQLInputObjectType({
        name: 'SetupVATProps',
        fields: () => ({
          agency: {
            type: GraphQLString,
          },
          IF: {
            type: new GraphQLNonNull(GraphQLString),
          },
          startDate: {
            type: new GraphQLNonNull(GraphQLDateTime),
          },
          frequency: {
            type: new GraphQLNonNull(PeriodType),
          },
          regime: {
            type: new GraphQLNonNull(VATRegimeType),
          },
        }),
      }),
    },
  },
  outputFields: {
    company: {
      type: companyType,
      resolve({id}) {
        return getCompany(id);
      },
    },
    declarations: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(GraphQLID))),
      resolve({ id, declarations, }) {
        return declarations.map(declarationId => toGlobalId('VATDeclaration', `${id}:${declarationId}`));
      },
    },
    viewer: {
      type: userType,
      resolve: () => getViewer(),
    },
  },
  async mutateAndGetPayload({ id, props, sessionToken, }) {
    const { id: localId, } = id ? fromGlobalId(id) : {};

    const { declarations, } = await Parse.Cloud.run('setupVAT', { companyId: localId, ...props, }, {sessionToken});

    onCompany({ id: localId, });

    return { id: localId, declarations, };
  },
});


module.exports.GraphQLAddCompanyMutation = mutationWithClientMutationId({
  name: 'AddCompany',
  inputFields: {
    sessionToken: { type: new GraphQLNonNull(GraphQLString) },
    id: { type: GraphQLID },
    displayName: { type: new GraphQLNonNull(GraphQLString) },
    periodType: { type: new GraphQLNonNull(PeriodType) },
    logo: { type: fileItemInputType, },
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
  async mutateAndGetPayload({ id, displayName, periodType, logo, sessionToken, }) {
    const {id: localId} = id ? fromGlobalId(id) : {};

    const {addedCompanyId} = await Parse.Cloud.run('addCompany', { id: localId, logo, displayName, periodType,}, {sessionToken});

    // parseTableLoader.clear(Company);
    // parseIDLoader.clear([Company, addedCompanyId]);

    // parseSeqLoader.clearAll();

    onCompany({ id: addedCompanyId, });

    return {id: addedCompanyId};
  },
});

module.exports.GraphQLUpdateCompanySettingsMutation = mutationWithClientMutationId({
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

    // parseTableLoader.clear(Company);
    // parseIDLoader.clear([Company, updatedCompanyId]);

    onCompany({ id: updatedCompanyId, });

    return {id: updatedCompanyId};
  },
});

module.exports.GraphQLUpdateCustomerNotesMutation = mutationWithClientMutationId({
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
        return getObjectByType(People, { companyId, id, });
      },
    },
  },
  async mutateAndGetPayload({ id, companyId, notes, sessionToken, }) {
    const {id: localCompanyId} = fromGlobalId(companyId);
    const { updatedCustomerId, } = await Parse.Cloud.run('updateCustomerNotes', { id, companyId: localCompanyId, notes,}, {sessionToken});

    // const Type = Customer({ id: localCompanyId, });

    // parseTableLoader.clear(Type);
    // parseIDLoader.clear([Type, updatedCustomerId]);

    onPerson({ id: localCompanyId, }, updatedCustomerId);

    return { id: updatedCustomerId, companyId: localCompanyId, };
  },
});

module.exports.GraphQLUpdateVendorNotesMutation = mutationWithClientMutationId({
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
        return getObjectByType(People, { companyId, id, });
      },
    },
  },
  async mutateAndGetPayload({ id, companyId, notes, sessionToken, }) {
    const {id: localCompanyId} = fromGlobalId(companyId);
    const { updatedVendorId, } = await Parse.Cloud.run('updateVendorNotes', { id, companyId: localCompanyId, notes,}, {sessionToken});

    // const Type = Vendor({ id: localCompanyId, });

    // parseTableLoader.clear(Type);
    // parseIDLoader.clear([Type, updatedVendorId]);

    onPerson({ id: localCompanyId, }, updatedVendorId);

    return { id: updatedVendorId, companyId: localCompanyId, };
  },
});


module.exports.GraphQLUpdateCompanySalesSettingsMutation = mutationWithClientMutationId({
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

    // parseTableLoader.clear(Company);
    // parseIDLoader.clear([Company, updatedCompanyId]);

    onCompany({ id: updatedCompanyId, });

    return {id: updatedCompanyId};
  },
});

module.exports.GraphQLUpdateCompanyExpensesSettingsMutation = mutationWithClientMutationId({
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

    // parseTableLoader.clear(Company);
    // parseIDLoader.clear([Company, updatedCompanyId]);

    onCompany({ id: updatedCompanyId, });

    return {id: updatedCompanyId};
  },
});

module.exports.GraphQLUpdateCompanyPaymentsSettingsMutation = mutationWithClientMutationId({
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

    // parseTableLoader.clear(Company);
    // parseIDLoader.clear([Company, updatedCompanyId]);

    onCompany({ id: updatedCompanyId, });

    return {id: updatedCompanyId};
  },
});

module.exports.GraphQLUpdateCompanyMutation = mutationWithClientMutationId({
  name: 'UpdateCompany',
  inputFields: {
    sessionToken: { type: new GraphQLNonNull(GraphQLString) },
    id: { type: new GraphQLNonNull(GraphQLID) },
    fieldInfos: { type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(fieldValueType))) },
    logo: { type: fileItemInputType, },
  },
  outputFields: {
    company: {
      type: companyType,
      resolve({id}) {
        return getCompany(id);
      },
    },
  },
  async mutateAndGetPayload({ id, fieldInfos, logo, sessionToken, }) {
    const {id: localId} = fromGlobalId(id);
    const {updatedCompanyId} = await Parse.Cloud.run('updateCompany', {id: localId, ...(logo ? { logo: logo.isNull ? null : { name: logo.name, type: logo.type, size: logo.size, dataBase64: logo.dataBase64, }, } : {}), fieldInfos,}, {sessionToken});

    // parseTableLoader.clear(Company);
    // parseIDLoader.clear([Company, updatedCompanyId]);

    onCompany({ id: updatedCompanyId, });

    return {id: updatedCompanyId};
  },
});

module.exports.GraphQLRemoveCompanyMutation = mutationWithClientMutationId({
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

    // parseTableLoader.clear(Company);
    // parseIDLoader.clear([Company, deletedCompanyId]);

    // parseSeqLoader.clearAll();

    onCompany({ id: deletedCompanyId, });

    return {id: deletedCompanyId};
  },
});

module.exports.GraphQLAddEmployeeMutation = mutationWithClientMutationId({
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
        const employee = await getObjectByType(People, {companyId, id});
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

    if(!id){ // NEW
      fieldInfos.push({
        fieldName: 'kind',
        value: 'Employee',
      });
    }

    const {addedEmployeeId} = await Parse.Cloud.run('addEmployee', { id, fieldInfos, companyId: localCompanyId,}, {sessionToken});

    // parseTableLoader.clear(Employee({id: localCompanyId}));
    // parseIDLoader.clear([Employee({id: localCompanyId}), addedEmployeeId]);

    onPerson({ id: localCompanyId, }, addedEmployeeId);

    return {id: addedEmployeeId, companyId: localCompanyId};
  },
});

module.exports.GraphQLRemoveEmployeeMutation = mutationWithClientMutationId({
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

    // parseTableLoader.clear(Employee({id: localCompanyId}));
    // parseIDLoader.clear([Employee({id: localCompanyId}), deletedEmployeeId]);

    onPerson({ id: localCompanyId, }, deletedEmployeeId);

    return {id: deletedEmployeeId, companyId};
  },
});

module.exports.GraphQLAddCustomerMutation = mutationWithClientMutationId({
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
        const customer = await getObjectByType(People, {companyId, id});
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

    if(!id){ // NEW
      fieldInfos.push({
        fieldName: 'kind',
        value: 'Customer',
      });
    }

    const {addedCustomerId} = await Parse.Cloud.run('addCustomer', { id, fieldInfos, companyId: localCompanyId,}, {sessionToken});

    // parseTableLoader.clear(Customer({id: localCompanyId}));
    // parseIDLoader.clear([Customer({id: localCompanyId}), addedCustomerId]);

    onPerson({ id: localCompanyId, }, addedCustomerId);

    return {id: addedCustomerId, companyId: localCompanyId};
  },
});

module.exports.GraphQLRemoveCustomerMutation = mutationWithClientMutationId({
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

    // parseTableLoader.clear(Customer({id: localCompanyId}));
    // parseIDLoader.clear([Customer({id: localCompanyId}), deletedCustomerId]);

    onPerson({ id: localCompanyId, }, deletedCustomerId);

    return {id: deletedCustomerId, companyId};
  },
});

module.exports.GraphQLAddVendorMutation = mutationWithClientMutationId({
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
        const vendor = await getObjectByType(People, {companyId, id});
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

    if(!id){ // NEW
      fieldInfos.push({
        fieldName: 'kind',
        value: 'Vendor',
      });
    }

    const {addedVendorId} = await Parse.Cloud.run('addVendor', { id, fieldInfos, companyId: localCompanyId,}, {sessionToken});

    // parseTableLoader.clear(Vendor({id: localCompanyId}));
    // parseIDLoader.clear([Vendor({id: localCompanyId}), addedVendorId]);

    onPerson({ id: localCompanyId, }, addedVendorId);

    return {id: addedVendorId, companyId: localCompanyId};
  },
});

module.exports.GraphQLRemoveVendorMutation = mutationWithClientMutationId({
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

    // parseTableLoader.clear(Vendor({id: localCompanyId}));
    // parseIDLoader.clear([Vendor({id: localCompanyId}), deletedVendorId]);

    onPerson({ id: localCompanyId, }, deletedVendorId);

    return {id: deletedVendorId, companyId};
  },
});

module.exports.GraphQLAddProductMutation = mutationWithClientMutationId({
  name: 'AddProduct',
  inputFields: {
    sessionToken: { type: new GraphQLNonNull(GraphQLString) },
    id: { type: GraphQLString },
    companyId: { type: new GraphQLNonNull(GraphQLID) },
    fieldInfos: { type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(fieldValueType))) },
    image: { type: fileItemInputType, },
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
  async mutateAndGetPayload({ id, companyId, fieldInfos, image, sessionToken, }) {
    const {id: localCompanyId} = fromGlobalId(companyId);

    if(!id){ // NEW
      fieldInfos.push({
        fieldName: 'kind',
        value: 'Product',
      });
    }

    const {addedProductId} = await Parse.Cloud.run('addProduct', { id, companyId: localCompanyId, ...(image ? { image: image.isNull ? null : { name: image.name, type: image.type, size: image.size, dataBase64: image.dataBase64, }, } : {}), fieldInfos,}, {sessionToken});

    // parseTableLoader.clear(Product({id: localCompanyId}));
    // parseIDLoader.clear([Product({id: localCompanyId}), addedProductId]);

    onItem({ id: localCompanyId, }, addedProductId);

    return {id: addedProductId, companyId: localCompanyId};
  },
});

module.exports.GraphQLRemoveProductMutation = mutationWithClientMutationId({
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

    // parseTableLoader.clear(Product({id: localCompanyId}));
    // parseIDLoader.clear([Product({id: localCompanyId}), deletedProductId]);

    onItem({ id: localCompanyId, }, deletedProductId);

    return {id: deletedProductId, companyId};
  },
});

module.exports.GraphQLLogInMutation = mutationWithClientMutationId({
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

module.exports.GraphQLLogOutMutation = mutationWithClientMutationId({
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
