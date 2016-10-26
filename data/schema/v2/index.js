const {
  GraphQLSchema,
} = require('graphql');

const mutationType = require('../mutations/v2');
const {queryType} = require('./query');

const {
  userType,
  companyType,
  transactionType,
  operationType,
  accountType,
  bankType,
  productType,
  employeeType,
  customerType,
  vendorType,
  expenseType,
  expenseItemType,
  invoiceType,
  billType,
  billItemType,
  saleType,
  paymentOfInvoicesType,
  paymentOfBillsType,
  saleItemType,
  invoiceItemType,
  paymentOfInvoicesItemType,
  paymentOfBillsItemType,
  fileType,
} = require('./types');

module.exports.Schema = new GraphQLSchema({
  types: [
    userType,
    companyType,
    transactionType,
    operationType,
    accountType,
    bankType,
    productType,
    employeeType,
    customerType,
    vendorType,
    expenseType,
    expenseItemType,
    invoiceType,
    billType,
    billItemType,
    saleType,
    paymentOfInvoicesType,
    paymentOfBillsType,
    saleItemType,
    invoiceItemType,
    paymentOfInvoicesItemType,
    paymentOfBillsItemType,
    fileType,
  ],
  query: queryType,
  mutation: mutationType,
});
