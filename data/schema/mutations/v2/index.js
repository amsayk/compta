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
  SetPasswordMutation,
  ChangePasswordMutation,
  UpdateAccountMutation,
} = require('./account');

const {
  GraphQLCreateOrUpdateCompanyMutation,

  GraphQLGenExcelMutation,
  GraphQLGenPdfMutation,

  GraphQLSetupVATMutation,

  GraphQLAddCompanyMutation,
  GraphQLUpdateCompanyMutation,
  GraphQLUpdateCompanySettingsMutation,
  GraphQLUpdateCompanySalesSettingsMutation,
  GraphQLUpdateCompanyExpensesSettingsMutation,
  GraphQLUpdateCompanyPaymentsSettingsMutation,
  GraphQLRemoveCompanyMutation,

  GraphQLUpdateCustomerNotesMutation,
  GraphQLUpdateVendorNotesMutation,

  GraphQLAddProductMutation,
  GraphQLRemoveProductMutation,

  GraphQLAddEmployeeMutation,
  GraphQLRemoveEmployeeMutation,
  GraphQLAddCustomerMutation,
  GraphQLRemoveCustomerMutation,
  GraphQLAddVendorMutation,
  GraphQLRemoveVendorMutation,

  GraphQLLogInMutation,
  GraphQLLogOutMutation,
} = require('./company');

const {
  GraphQLAddBillMutation,
  GraphQLAddExpenseMutation,
  GraphQLMakePaymentOfBillsMutation,

  GraphQLRemoveBillMutation,
  GraphQLRemoveExpenseMutation,
  GraphQLRemovePaymentOfBillsMutation,
} = require('./expenses');

const {
  GraphQLAddInvoiceMutation,
  GraphQLAddSaleMutation,
  GraphQLReceivePaymentOfInvoicesMutation,

  GraphQLRemoveInvoiceMutation,
  GraphQLRemoveSaleMutation,
  GraphQLRemovePaymentOfInvoicesMutation,
} = require('./sales');

const {
  GraphQLRemoveFileMutation,
} = require('./files');

/**
 * This is the type that will be the root of our mutations,
 * and the entry point into performing writes in our schema.
 */
module.exports = new GraphQLObjectType({
  name: 'Mutation',
  fields: () => ({
    // Add your own mutations here
    genPdf: GraphQLGenPdfMutation,
    genExcel: GraphQLGenExcelMutation,

    setupVAT: GraphQLSetupVATMutation,

    createOrUpdateCompany: GraphQLCreateOrUpdateCompanyMutation,

    addCompany: GraphQLAddCompanyMutation,
    updateCompany: GraphQLUpdateCompanyMutation,
    updateCompanySettings: GraphQLUpdateCompanySettingsMutation,
    updateCompanySalesSettings: GraphQLUpdateCompanySalesSettingsMutation,
    updateCompanyExpensesSettings: GraphQLUpdateCompanyExpensesSettingsMutation,
    updateCompanyPaymentsSettings: GraphQLUpdateCompanyPaymentsSettingsMutation,
    removeCompany: GraphQLRemoveCompanyMutation,

    updateCustomerNotes: GraphQLUpdateCustomerNotesMutation,
    updateVendorNotes: GraphQLUpdateVendorNotesMutation,

    addProduct: GraphQLAddProductMutation,
    delProduct: GraphQLRemoveProductMutation,

    delFile: GraphQLRemoveFileMutation,

    addBill: GraphQLAddBillMutation,
    addInvoice: GraphQLAddInvoiceMutation,
    addSale: GraphQLAddSaleMutation,
    addExpense: GraphQLAddExpenseMutation,
    receivePaymentOfInvoices: GraphQLReceivePaymentOfInvoicesMutation,
    makePaymentOfBills: GraphQLMakePaymentOfBillsMutation,

    removeInvoice: GraphQLRemoveInvoiceMutation,
    removeBill: GraphQLRemoveBillMutation,
    removeSale: GraphQLRemoveSaleMutation,
    removeExpense: GraphQLRemoveExpenseMutation,
    removePaymentOfInvoices: GraphQLRemovePaymentOfInvoicesMutation,
    removePaymentOfBills: GraphQLRemovePaymentOfBillsMutation,

    addEmployee: GraphQLAddEmployeeMutation,
    removeEmployee: GraphQLRemoveEmployeeMutation,
    addCustomer: GraphQLAddCustomerMutation,
    removeCustomer: GraphQLRemoveCustomerMutation,
    addVendor: GraphQLAddVendorMutation,
    removeVendor: GraphQLRemoveVendorMutation,

    logIn: GraphQLLogInMutation,
    logOut: GraphQLLogOutMutation,

    setPassword: SetPasswordMutation,
    changePassword: ChangePasswordMutation,

    updateAccount: UpdateAccountMutation,
  })
});
