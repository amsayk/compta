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

} from '../database/index';

import {
  nodeField,
} from './node';

import {
  userType,
  companyType,
  chartAccountType,
} from './types';

import {
} from './common';

export const queryType = new GraphQLObjectType({
  name: 'Query',
  fields: () => ({
    node: nodeField,
    // id: {
    //   type: new GraphQLNonNull(GraphQLString),
    //   resolve: () => 'ROOT',
    // },
    // root: {
    //   type: new GraphQLNonNull(queryType),
    //   resolve: () => ({}),
    // },
    viewer: {
      type: userType,
      resolve: () => getViewer(),
    },
    // companies: {
    //   type: new GraphQLList(companyType),
    //   resolve: () => getCompanies(),
    // },
    // company: {
    //   type: new GraphQLNonNull(companyType),
    //     args: {
    //       id: {
    //         type: new GraphQLNonNull(GraphQLID),
    //       },
    //     },
    //   resolve: (_, {id: globalId}) => {
    //     const {id} = fromGlobalId(globalId);
    //     return getCompany(id);
    //   },
    // },
    // accounts: {
    //   type: new GraphQLList(chartAccountType),
    //   args: {
    //   },
    //   async resolve() {
    //     return getChartAccountList();
    //   },
    // },
    // accountsByCategories: {
    //   type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(chartAccountType))),
    //   args: {
    //     categories: {
    //       type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(GraphQLString))),
    //     }
    //   },
    //   resolve: (_, {categories}) => getAccountsByCategories(categories),
    // },
  }),
});
