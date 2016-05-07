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
  GraphQLLogOutMutation
} from './company';

import {
  GraphQLAddBillMutation,
  GraphQLAddExpenseMutation,
  GraphQLReceivePaymentOfBillsMutation,

  GraphQLRemoveBillMutation,
  GraphQLRemoveExpenseMutation,
  GraphQLRemovePaymentOfBillsMutation,
} from './expenses';

import {
  GraphQLAddInvoiceMutation,
  GraphQLAddSaleMutation,
  GraphQLReceivePaymentOfInvoicesMutation,

  GraphQLRemoveInvoiceMutation,
  GraphQLRemoveSaleMutation,
  GraphQLRemovePaymentOfInvoicesMutation,
} from './sales';

/**
 * This is the type that will be the root of our mutations,
 * and the entry point into performing writes in our schema.
 */
export default new GraphQLObjectType({
  name: 'Mutation',
  fields: () => ({
    // Add your own mutations here
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

    addBill: GraphQLAddBillMutation,
    addInvoice: GraphQLAddInvoiceMutation,
    addSale: GraphQLAddSaleMutation,
    addExpense: GraphQLAddExpenseMutation,
    receivePaymentOfInvoices: GraphQLReceivePaymentOfInvoicesMutation,
    receivePaymentOfBills: GraphQLReceivePaymentOfBillsMutation,

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
  })
});
