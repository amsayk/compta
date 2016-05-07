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

import isType from './isType';

import {
  connectionDefinition,
} from '../connections';

import {
  parseTableCountLoader,
  parseTableLoader,
  parseIDLoader,
  parseSeqLoader,
} from '../../database/loaders';

import concat from 'lodash.concat';
import orderBy from 'lodash.orderby';
import group from 'lodash.groupby';
import compact from 'lodash.compact';
import map from 'lodash.map';

import {
  CASH_ACCOUNT_CODE as CASH,
  DEFAULT_PAYMENT_OF_INVOICES_METHOD,
  DEFAULT_PAYMENT_OF_BILLS_METHOD,
  DEFAULT_INVOICE_TERMS,
  DEFAULT_BILL_TERMS,
  DEFAULT_SALES_ACCOUNT_CODE,
} from '../constants';

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
  getPaymentOfBillsItems,
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
  getBillItems,

  getCompanyPeople,
  getCompanyVendors,
  getCompanyCustomers,
  getCompanyEmployees,

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

  queryCustomerOpenInvoices,
  queryCustomerOverdueInvoices,

  queryBills,
  queryExpenses,

  vendorsQueryBills,
  vendorsQueryExpenses,
  vendorsQueryPaymentsOfBills,

  customersQueryInvoices,
  customersQuerySales,
  customersQueryPaymentsOfInvoices,

  queryOpenBills,
  queryOverdueBills,

  queryVendorOpenBills,
  queryVendorOverdueBills,

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

  getTransactionOperations,
  getTransactionByType,

  getOperationsByCategories,

} from '../../database/v2/index';

import Product from '../../database/Product';

import Expense from '../../database/v2/Expense';
import Sale from '../../database/v2/Sale';
import Invoice from '../../database/v2/Invoice';
import Bill from '../../database/v2/Bill';
import PaymentOfInvoices from '../../database/v2/PaymentOfInvoices';
import PaymentOfBills from '../../database/v2/PaymentOfBills';

import Customer from '../../database/v2/Customer';
import Vendor from '../../database/v2/Vendor';

import {
  classNameField,
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
  discountPartType,
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

} from '../common';

import * as moment from 'moment';

/**
 * We get the node interface and field from the Relay library.
 *
 * The first method defines the way we resolve an ID to its object.
 * The second defines the way we resolve an object to its GraphQL type.
 */
import { nodeInterface, nodeField, } from '../node'

/**
 * Define your own types here
 */
export const userType = new GraphQLObjectType({
  name: 'User',
  description: 'A person who uses our app',
  fields: () => ({
    id: globalIdField('User'),
    displayName: {
      type: GraphQLString,
      resolve: (user) => user.get('displayName'),
    },
    email: {
      type: GraphQLEmail,
      resolve: (user) => user.get('email'),
    },
    username: {
      type: GraphQLString,
      resolve: (user) => user.get('username'),
    },
    sessionToken: {
      type: GraphQLString,
      resolve: (user) => user.get('sessionToken'),
    },
    company: {
      type: new GraphQLNonNull(companyType),
      args: {
        id: {
          type: new GraphQLNonNull(GraphQLID),
        },
      },
      resolve: (_, {id: globalId}) => {
        const {id} = fromGlobalId(globalId);
        return getCompany(id);
      },
    },
    getTransaction: {
      type: transactionType,
      args: {
        companyId: {
          type: new GraphQLNonNull(GraphQLString),
        },
        id: {
          type: new GraphQLNonNull(GraphQLString),
        },
      },
      resolve: (obj, { companyId, id, }) => {
        const { id : localCompanyId, } = fromGlobalId(companyId);
        return getObjectByType(Transaction, { companyId: localCompanyId, id, });
      },
    },
    getTransactionByType: {
      type: transactionType,
      args: {
        companyId: {
          type: new GraphQLNonNull(GraphQLString),
        },
        type: {
          type: new GraphQLNonNull(GraphQLString),
        },
        id: {
          type: new GraphQLNonNull(GraphQLString),
        },
      },
      resolve: (obj, { type, companyId, id, }) => {
        const { id : localCompanyId, } = fromGlobalId(companyId);
        return getTransactionByType({ companyId: localCompanyId, type, id, });
      },
    },
    customerOpenInvoices: function(){
      const {connectionType, edgeType} = connectionDefinitions({
        name: 'CustomerOpenInvoices',
        nodeType: invoiceType,
        connectionFields: () => ({
        })
      });

      const {connection,} = {
        connection: {
          type: connectionType,
          args: {
            ...connectionArgs,
            companyId: {
              type: new GraphQLNonNull(GraphQLID),
            },
            id: {
              type: GraphQLString,
            },
          },
          async resolve(obj, { companyId, id, }, info) {
            let array = [];
            if(typeof id !== 'undefined'){
              const { id : localCompanyId, } = fromGlobalId(companyId);
              array = await getCustomerOpenInvoices({id: localCompanyId}, {id});
            }
            return {
              ...connectionFromArray(array, {first: array.length}),
            };
          },
        },
        edgeType,
      };

      return connection;
    }(),
    vendorOpenBills: function(){
      const {connectionType, edgeType} = connectionDefinitions({
        name: 'CustomerOpenBills',
        nodeType: billType,
        connectionFields: () => ({
        })
      });

      const {connection,} = {
        connection: {
          type: connectionType,
          args: {
            ...connectionArgs,
            companyId: {
              type: new GraphQLNonNull(GraphQLID),
            },
            id: {
              type: GraphQLString,
            },
          },
          async resolve(obj, { companyId, id, }, info) {
            let array = [];
            if(typeof id !== 'undefined'){
              const { id : localCompanyId, } = fromGlobalId(companyId);
              array = await getVendorOpenBills({id: localCompanyId}, {id});
            }
            return {
              ...connectionFromArray(array, {first: array.length}),
            };
          },
        },
        edgeType,
      };

      return connection;
    }(),
    companies: UserCompaniesConnection,
    accounts: {
      type: new GraphQLList(chartAccountType),
      args: {
      },
      async resolve() {
        return getChartAccountList();
      },
    },
    accountsByCategories: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(chartAccountType))),
      args: {
        categories: {
          type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(GraphQLString))),
        }
      },
      resolve: (obj, {categories}) => getAccountsByCategories(categories),
    },
    paymentOfInvoicesFromPaymentOfInvoicesItem: {
      type: new GraphQLNonNull(paymentOfInvoicesType),
      args: {
        companyId: {
          type: new GraphQLNonNull(GraphQLString),
        },
        id: {
          type: new GraphQLNonNull(GraphQLString),
        },
      },
      resolve: (obj, { companyId: globalId, id, }) => {
        const { id: localCompanyId, } = fromGlobalId(globalId);
        return getPaymentOfInvoicesFromPaymentOfInvoicesItem({ id: localCompanyId, }, id);
      },
    },
    paymentOfBillsFromPaymentOfBillsItem: {
      type: new GraphQLNonNull(paymentOfBillsType),
      args: {
        companyId: {
          type: new GraphQLNonNull(GraphQLString),
        },
        id: {
          type: new GraphQLNonNull(GraphQLString),
        },
      },
      resolve: (obj, { companyId: globalId, id, }) => {
        const { id: localCompanyId, } = fromGlobalId(globalId);
        return getPaymentOfBillsFromPaymentOfBillsItem({ id: localCompanyId, }, id);
      },
    },
    getCustomer: {
      type: customerType,
      args: {
        companyId: {
          type: new GraphQLNonNull(GraphQLString),
        },
        id: {
          type: new GraphQLNonNull(GraphQLString),
        },
      },
      resolve: (obj, { companyId, id, }) => {
        const { id : localCompanyId, } = fromGlobalId(companyId);
        return getObjectByType(Customer, { companyId: localCompanyId, id, });
      },
    },
    getCustomers: {
      type: new GraphQLObjectType({
        name: 'CompanyCustomersQuery',
        fields: ({
          // expenses: CompanyCustomersExpensesQueryConnection,
          invoices: CompanyCustomersInvoicesQueryConnection,
          sales: CompanyCustomersSalesQueryConnection,
          payments: CompanyCustomersPaymentsOfInvoicesQueryConnection,
        }),
      }),
      args: {
        companyId: {
          type: new GraphQLNonNull(GraphQLString),
        },
      },
      resolve: (obj, { companyId, }) => ({ id: fromGlobalId(companyId).id, }),
    },
    getVendor: {
      type: vendorType,
      args: {
        companyId: {
          type: new GraphQLNonNull(GraphQLString),
        },
        id: {
          type: new GraphQLNonNull(GraphQLString),
        },
      },
      resolve: (obj, { companyId, id, }) => {
        const { id : localCompanyId, } = fromGlobalId(companyId);
        return getObjectByType(Vendor, { companyId: localCompanyId, id, });
      },
    },
    getVendors: {
      type: new GraphQLObjectType({
        name: 'CompanyVendorsQuery',
        fields: ({
          bills: CompanyVendorsBillsQueryConnection,
          expenses: CompanyVendorsExpensesQueryConnection,
          payments: CompanyVendorsPaymentsOfBillsQueryConnection,
        }),
      }),
      args: {
        companyId: {
          type: new GraphQLNonNull(GraphQLString),
        },
      },
      resolve: (obj, { companyId, }) => ({ id: fromGlobalId(companyId).id, }),
    },
    createdAt: createdField(),
    updatedAt: editedField(),
    objectId: objectIdField(),
    className: classNameField(),
  }),
  interfaces: [ nodeInterface ],
});

export const transactionType = new GraphQLObjectType({
  name: 'Transaction',
  description: 'A group of operations between a client and a vendor',
  fields: () => ({
    id: globalIdField('Transaction', object => [object.id, object.get('company').id].join(':')),
    operations: TransactionOperationConnection,
    refNo: {
      type: GraphQLInt,
      resolve: (transaction) => transaction.get('refNo'),
    },
    isAdjustment: {
      type: new GraphQLNonNull(GraphQLBoolean),
      resolve: (transaction) => transaction.has('isAdjustment') ? transaction.get('isAdjustment') : false,
    },
    // TODO: add total debit, total debit, etc
    date: {
      type: new GraphQLNonNull(GraphQLDateTime),
      resolve: (transaction) => transaction.get('date'),
    },
    memo: {
      type: GraphQLString,
      resolve: (transaction) => transaction.get('memo'),
    },
    // files: {
    //   type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(GraphQLURL))),
    //   description: 'The files of transaction.',
    //   resolve: (transaction) => transaction.get('files') || [],
    // },
    createdAt: createdField(),
    updatedAt: editedField(),
    objectId: objectIdField(),
    className: classNameField(),
    user: {
      type: userType,
      description: 'The user who created this object.',
      resolve: transaction => transaction.has('user') ? getUser(transaction.get('user').id) : null,
    },
  }),
  interfaces: [ nodeInterface ],
});

export const operationType = new GraphQLObjectType({
  name: 'Operation',
  description: 'A debit or credit operation in a Transaction',
  fields: () => ({
    id: globalIdField('Operation', object => [object.id, object.get('company').id].join(':')),
    refNo: {
      type: GraphQLInt,
      resolve: (operation) => operation.get('refNo'),
    },
    isAdjustment: {
      type: new GraphQLNonNull(GraphQLBoolean),
      resolve: (operation) => operation.has('isAdjustment') ? operation.get('isAdjustment') : false,
    },
    accountCode: {
      type: new GraphQLNonNull(GraphQLString),
      resolve: (operation) => operation.get('accountCode'),
    },
    type: {
      type: new GraphQLNonNull(OperationKind),
      resolve: (operation) => operation.get('type'),
    },
    amount: {
      type: new GraphQLNonNull(GraphQLFloat),
      resolve: (operation) => operation.get('amount'),
    },
    date: {
      type: new GraphQLNonNull(GraphQLDateTime),
      description: 'The date of this operation.',
      resolve: (operation) => operation.get('date'),
    },
    memo: {
      type: GraphQLString,
      description: 'The memo of this operation.',
      resolve: (operation) => operation.get('memo'),
    },
    _classCode: {
      type: new GraphQLNonNull(GraphQLString),
      resolve: (operation) => operation.get('classCode'),
    },
    _categoryCode: {
      type: new GraphQLNonNull(GraphQLString),
      resolve: (operation) => operation.get('categoryCode'),
    },
    _groupCode: {
      type: new GraphQLNonNull(GraphQLString),
      resolve: (operation) => operation.get('groupCode'),
    },
    createdAt: createdField(),
    updatedAt: editedField(),
    objectId: objectIdField(),
    className: classNameField(),
    user: {
      type: userType,
      description: 'The user who created this object.',
      resolve: operation => operation.has('user') ? getUser(operation.get('user').id) : null,
    },
  }),
  interfaces: [ nodeInterface ],
});

export const accountType = new GraphQLObjectType({
  name: 'Account',
  description: 'An Account',
  fields: () => ({
    id: globalIdField('Account', object => [object.id, object.get('company').id].join(':')),
    code: {
      type: new GraphQLNonNull(GraphQLString),
      resolve: (account) => account.get('code'),
    },
    name: {
      type: new GraphQLNonNull(GraphQLString),
      resolve: (account) => account.get('name'),
    },
    beginningBal: {
      type: new GraphQLNonNull(GraphQLFloat),
      resolve: (account) => account.has('beginningBal') ? account.get('beginningBal') : 0.0,
    },
    operations: AccountOperationConnection,
    // TODO: add total debit, total credits, etc
  }),
  interfaces: [ nodeInterface ],
});

export const chartAccountType = new GraphQLObjectType({
  name: 'ChartAccount',
  description: 'A Chart Account',
  fields: () => ({
    id: globalIdField('ChartAccount', ({code}) => code),
    code: {
      type: new GraphQLNonNull(GraphQLString),
    },
    name: {
      type: new GraphQLNonNull(GraphQLString),
    },
    _classCode: {
      type: new GraphQLNonNull(GraphQLString),
    },
    _categoryCode: {
      type: new GraphQLNonNull(GraphQLString),
    },
    _groupCode: {
      type: new GraphQLNonNull(GraphQLString),
    },
    _parentCode: {
      type: GraphQLString,
    },
  }),
  // interfaces: [ nodeInterface ],
});

const saleOrPaymentOfInvoicesBridgeType = new GraphQLObjectType({
  name: 'SaleOrPaymentOfInvoicesBridge',
  fields: () => ({
    value: {
      type: new GraphQLNonNull(saleOrPaymentOfInvoicesType),
    }
  }),
});

const expenseOrPaymentOfBillsBridgeType = new GraphQLObjectType({
  name: 'SaleOrPaymentOfBillsBridge',
  fields: () => ({
    value: {
      type: new GraphQLNonNull(expenseOrPaymentOfBillsType),
    }
  }),
});

export const companyType = new GraphQLObjectType({
  name: 'Company',
  description: 'A company',
  fields: () => ({
    id: globalIdField('Company'),
    ...[ 'address', 'activity', 'webSite', 'tel', 'fax', 'email', 'if', 'rc', 'patente', 'cnss', 'banque', 'rib', ].reduce(function (fields, prop) {
      return {
        ...fields,
        [prop]: {
          type: GraphQLString,
          resolve: (company) => company.get(prop)
        }
      };
    }, {}),
    legalForm: {
      type: legalFormType,
      resolve: (company) => company.has('legalForm') ? parseInt(company.get('legalForm')) : null,
    },
    periodType: {
      type: new GraphQLNonNull(PeriodType),
      resolve: (company) => company.get('periodType'),
    },
    displayName: {
      type: new GraphQLNonNull(GraphQLString),
      resolve: (company) => company.get('displayName'),
    },
    lastTransactionIndex: {
      type: new GraphQLNonNull(GraphQLInt),
      resolve: (company) => parseSeqLoader.load(`transaction_sequence_${company.id}`),
    },
    lastPaymentsTransactionIndex: {
      type: new GraphQLNonNull(GraphQLInt),
      resolve: (company) => parseSeqLoader.load(`payments_transaction_sequence_${company.id}`),
    },
    operationsByCategories: function(){
      const {connectionType, edgeType} = connectionDefinitions({
        name: 'CompanyOperationsByCategories',
        nodeType: operationType,
        connectionFields: () => ({
        })
      });

      const {connection,} = {
        connection: {
          type: connectionType,
          args: {
            ...connectionArgs,
            type: {
              type: OperationKind,
            },
            from: {
              type: GraphQLDateTime,
            },
            to: {
              type: GraphQLDateTime,
            },
            categories: {
              type: new GraphQLList(new GraphQLNonNull(GraphQLString)),
            },
            _rev: {
              type: GraphQLInt,
            },
          },
          async resolve(obj, { type, companyId, from, to, categories, }, info) {
            const array = await getOperationsByCategories({ companyId: obj.id, from, to, type, categories, });
            return {
              ...connectionFromArray(array, {first: array.length}),
            };
          },
        },
        edgeType,
      };

      return connection;
    }(),
    employees: CompanyEmployeesConnection,
    customers: CompanyCustomersConnection,
    vendors: CompanyVendorsConnection,
    people: function() {

      const { connectionType, } = connectionDefinitions({
        name: 'CompanyPeople',
        nodeType: personType,
        connectionFields: () => ({
          totalCount: {
            type: GraphQLInt,
            resolve: (conn) => conn.totalCount,
          },

        }),
      });

      return {
        type: connectionType,
        args: {
          ...connectionArgs,
        },
        async resolve(obj) {
          const array = await getCompanyPeople(obj);
          return {
            ...connectionFromArray(array, { first: array.length, }),
            totalCount: array.length
          };
        },
      };
    }(),
    sales: CompanySalesConnection,
    expenses: CompanyExpensesConnection,
    paymentsOfInvoices: CompanyPaymentsOfInvoicesConnection,
    paymentsOfBills: CompanyPaymentsOfBillsConnection,
    invoices: CompanyInvoicesConnection,
    bills: CompanyBillsConnection,
    transactions: CompanyTransactionsConnection,
    accounts: CompanyAccountsConnection,
    bankAccounts: CompanyBankAccountsConnection,
    settings: {
      type: companySettingsType,
      resolve: (company) => ({
        periodType: company.get('periodType'),
        closureEnabled: company.has('settings_key_closureEnabled') ? company.get('settings_key_closureEnabled') : false,
        closureDate: !!company.get('settings_key_closureEnabled') ? company.get('settings_key_closureDate') : null,
      }),
    },
    salesSettings: {
      type: new GraphQLNonNull(companySalesSettingsType),
      resolve: (company) => ({
        discountEnabled: company.has('sales_setting_key_discountEnabled') ? company.get('sales_setting_key_discountEnabled') : false,
        defaultDepositToAccountCode: company.has('sales_setting_key_defaultDepositToAccountCode') ? company.get('sales_setting_key_defaultDepositToAccountCode') : CASH,
        preferredInvoiceTerms: company.has('sales_setting_key_preferredInvoiceTerms') ? company.get('sales_setting_key_preferredInvoiceTerms') : DEFAULT_INVOICE_TERMS,
        enableCustomTransactionNumbers: company.has('sales_setting_key_enableCustomTransactionNumbers') ? company.get('sales_setting_key_enableCustomTransactionNumbers') : false,
        enableServiceDate: company.has('sales_setting_key_enableServiceDate') ? company.get('sales_setting_key_enableServiceDate') : true,

        showProducts: company.has('sales_setting_key_showProducts') ? company.get('sales_setting_key_showProducts') : true,
        showRates: company.has('sales_setting_key_showRates') ? company.get('sales_setting_key_showRates') : true,
        trackInventory: company.has('sales_setting_key_trackInventory') ? company.get('sales_setting_key_trackInventory') : false,

        defaultIncomeAccountCode: company.has('sales_setting_key_defaultIncomeAccountCode') ? company.get('sales_setting_key_defaultIncomeAccountCode') : DEFAULT_SALES_ACCOUNT_CODE,
      }),
    },
    expensesSettings: {
      type: new GraphQLNonNull(companyExpensesSettingsType),
      resolve: (company) => ({
        defaultExpenseAccountCode: company.has('expenses_setting_key_defaultExpenseAccountCode') ? company.get('expenses_setting_key_defaultExpenseAccountCode') : CASH,
        preferredPaymentMethod: company.has('expenses_setting_key_preferredPaymentMethod') ? company.get('expenses_setting_key_preferredPaymentMethod') : DEFAULT_PAYMENT_OF_INVOICES_METHOD,
      }),
    },
    paymentsSettings: {
      type: new GraphQLNonNull(companyPaymentsSettingsType),
      resolve: (company) => ({
        defaultDepositToAccountCode: company.has('payments_setting_key_defaultDepositToAccountCode') ? company.get('payments_setting_key_defaultDepositToAccountCode') : CASH,
        preferredPaymentMethod: company.get('payments_setting_key_preferredPaymentMethod') ? company.get('payments_setting_key_preferredPaymentMethod') : DEFAULT_PAYMENT_OF_INVOICES_METHOD,
      }),
    },
    companyProducts: CompanyProductsConnection,
    salesStatus: {
      type: new GraphQLObjectType({
        name: 'SalesStatus',
        fields: () => {

          function resolveType(name, nodeType, queryData){

            const {connectionType} = connectionDefinitions({
              name: 'CompanySalesStatusInvoices_' + name,
              nodeType,
              connectionFields: () => ({
                totalCount: {
                  type: new GraphQLNonNull(GraphQLInt),
                  resolve: (conn) => conn.totalCount,
                },
                amount: {
                  type: new GraphQLNonNull(GraphQLFloat),
                  resolve: (conn) => conn.amount,
                },
              }),
            });

            return {
              type: connectionType,
              args: {
              },
              async resolve(obj) {
                const array = await queryData({id: obj.id, });
                return {
                  ...connectionFromArray(array, {first: array.length}),
                  totalCount: array.length,
                  amount: array.reduce((sum, node) => sum + (function(){
                    const next = node.value || node;

                    if(typeof next.__type === 'undefined'){

                      if(next.className.indexOf('Invoice') !== -1){
                        return next.get('total') || 0.0;
                      }

                      if(next.className.indexOf('Sale') !== -1){
                        return next.get('total') || 0.0;
                      }

                      if(next.className.indexOf('PaymentOfInvoices') !== -1){
                        return next.get('amountReceived') || 0.0;
                      }
                    }

                    switch (next.__type) {
                      case 'Invoice':           return next.get('total') || 0.0;
                      case 'Sale':              return next.get('total') || 0.0;
                      case 'PaymentOfInvoices': return next.get('amountReceived') || 0.0;;
                    }
                  }()), 0.0),
                };
              },
            };
          }

          // const saleOrPaymentOfInvoicesBridgeType = new GraphQLObjectType({
          //   name: 'SaleOrPaymentOfInvoicesBridge',
          //   fields: () => ({
          //     value: {
          //       type: new GraphQLNonNull(saleOrPaymentOfInvoicesType),
          //     }
          //   }),
          // });

          return {
            open: resolveType('Open', invoiceType, function({id, }){
              return queryOpenInvoices({id}, {});
            }),
            overdue: resolveType('Overdue', invoiceType, function({id, }){
              return queryOverdueInvoices({id}, {});
            }),
            closed: resolveType('Closed', saleOrPaymentOfInvoicesBridgeType, function({id, }){
              return querySalesRecentlyPaid({id}, {}).then(({ sales, payments, }) => {
                return orderBy(

                  concat(
                    sales,
                    payments
                  ),

                  [ 'date' ],

                  [ 'asc' ]
                ).map((node) => ({ value: node, }));
              });
            }),
          };
        },
      }),
      resolve: (obj) => obj,
    },
    expensesStatus: {
      type: new GraphQLObjectType({
        name: 'ExpensesStatus',
        fields: () => {

          function resolveType(name, nodeType, queryData){
            const {connectionType} = connectionDefinitions({
              name: 'CompanyExpensesStatusBills_' + name,
              nodeType,
              connectionFields: () => ({
                totalCount: {
                  type: new GraphQLNonNull(GraphQLInt),
                  resolve: (conn) => conn.totalCount,
                },
                amount: {
                  type: new GraphQLNonNull(GraphQLFloat),
                  resolve: (conn) => conn.amount,
                },
              })
            });

            return {
              type: connectionType,
              args: {
              },
              async resolve(obj) {
                const array = await queryData({id: obj.id, });
                const amount = array.reduce((sum, node) => sum + (function(){
                  const next = node.value || node;

                  if(typeof next.__type === 'undefined'){

                    if(next.className.indexOf('Bill') !== -1){
                      return next.get('total') || 0.0;
                    }

                    if(next.className.indexOf('Expense') !== -1){
                      return next.get('total') || 0.0;
                    }

                    if(next.className.indexOf('PaymentOfBills') !== -1){
                      return next.get('amountReceived') || 0.0;
                    }
                  }

                  switch (next.__type) {
                    case 'Bill':           return next.get('total') || 0.0;
                    case 'Expense':        return next.get('total') || 0.0;
                    case 'PaymentOfBills': return next.get('amountReceived') || 0.0;
                  }
                }()), 0.0);

                return {
                  ...connectionFromArray(array, {first: array.length}),
                  totalCount: array.length,
                  amount,
                };
              },
            };
          }

          // const expenseOrPaymentOfBillsBridgeType = new GraphQLObjectType({
          //   name: 'SaleOrPaymentOfBillsBridge',
          //   fields: () => ({
          //     value: {
          //       type: new GraphQLNonNull(expenseOrPaymentOfBillsType),
          //     }
          //   }),
          // });

          return {
            open: resolveType('Open', billType, function({id, }){
              return queryOpenBills({id}, {});
            }),
            overdue: resolveType('Overdue', billType, function({id, }){
              return queryOverdueBills({id}, {});
            }),
            closed: resolveType('Closed', expenseOrPaymentOfBillsBridgeType, function({id, }){
              return queryExpensesRecentlyPaid({id}, {}).then(({ expenses, payments, }) => {
                return orderBy(

                  concat(
                    expenses,
                    payments
                  ),

                  [ 'date' ],

                  [ 'asc' ]
                ).map((node) => ({ value: node, }));
              });
            }),
          };
        },
      }),
      resolve: (obj) => obj,
    },
    createdAt: createdField(),
    updatedAt: editedField(),
    objectId: objectIdField(),
    className: classNameField(),
    user: {
      type: userType,
      description: 'The user who created this object.',
      resolve: company => company.has('user') ? getUser(company.get('user').id) : null,
    },
  }),
  interfaces: [ nodeInterface ],
});

export const bankType = new GraphQLObjectType({
  name: 'Bank',
  description: 'A Bank Account',
  fields: () => ({
    id: globalIdField('Bank', object => object.code),
    displayName: {
      type: new GraphQLNonNull(GraphQLString),
      resolve: ({name}) => name,
    },
    icon: {
      type: new GraphQLNonNull(GraphQLString),
      resolve: ({icon}) => icon,
    },
    accountCode: {
      type: new GraphQLNonNull(GraphQLString),
      resolve: ({code}) => code,
    },
  }),
  interfaces: [ nodeInterface ],
});

export const vendorType = new GraphQLObjectType({
  name: 'Vendor',
  description: 'A Vendor',
  fields: () => ({
    id: globalIdField('Vendor', object => [object.id, object.get('company').id].join(':')),
    // company: {
    //   type: new GraphQLNonNull(parseObjectInputFieldType),
    //   resolve: (customer) => customer.get('company'),
    // },
    displayName: {
      type: new GraphQLNonNull(GraphQLString),
      resolve: (vendor) => vendor.get('displayName'),
    },
    image: {
      type: GraphQLString,
      resolve: (vendor) => vendor.get('image'),
    },
    title: {
      type: GraphQLString,
      resolve: (vendor) => vendor.get('title'),
    },
    givenName: {
      type: GraphQLString,
      resolve: (vendor) => vendor.get('givenName'),
    },
    middleName: {
      type: GraphQLString,
      resolve: (vendor) => vendor.get('middleName'),
    },
    familyName: {
      type: GraphQLString,
      resolve: (vendor) => vendor.get('familyName'),
    },
    affiliation: {
      type: GraphQLString,
      resolve: (vendor) => vendor.get('affiliation'),
    },
    emails: {
      type: GraphQLString,
      resolve: (vendor) => vendor.get('emails'),
    },
    phone: {
      type: GraphQLString,
      resolve: (vendor) => vendor.get('phone'),
    },
    mobile: {
      type: GraphQLString,
      resolve: (vendor) => vendor.get('mobile'),
    },
    fax: {
      type: GraphQLString,
      resolve: (vendor) => vendor.get('fax'),
    },
    website: {
      type: GraphQLString,
      resolve: (vendor) => vendor.get('website'),
    },
    mailing_streetAddress: {
      type: GraphQLString,
      resolve: (vendor) => vendor.get('mailing_streetAddress'),
    },
    mailing_cityTown: {
      type: GraphQLString,
      resolve: (vendor) => vendor.get('mailing_cityTown'),
    },
    mailing_stateProvince: {
      type: GraphQLString,
      resolve: (vendor) => vendor.get('mailing_stateProvince'),
    },
    mailing_postalCode: {
      type: GraphQLString,
      resolve: (vendor) => vendor.get('mailing_postalCode'),
    },
    mailing_country: {
      type: GraphQLString,
      resolve: (vendor) => vendor.get('mailing_country'),
    },
    notes: {
      type: GraphQLString,
      resolve: (vendor) => vendor.get('notes'),
    },
    openBalance: {
      type: new GraphQLNonNull(GraphQLFloat),
      resolve: (vendor) => vendor.has('openBalance') ? vendor.get('openBalance') : 0.0,
    },
    expenses: VendorExpensesConnection,
    paymentsOfBills: VendorPaymentsOfBillsConnection,
    bills: VendorBillsConnection,
    expensesStatus: {
      type: new GraphQLObjectType({
        name: 'VendorExpensesStatus',
        fields: () => {

          function resolveType(name, nodeType, queryData){
            const {connectionType} = connectionDefinitions({
              name: 'VendorExpensesStatusBills_' + name,
              nodeType,
              connectionFields: () => ({
                totalCount: {
                  type: new GraphQLNonNull(GraphQLInt),
                  resolve: (conn) => conn.totalCount,
                },
                amount: {
                  type: new GraphQLNonNull(GraphQLFloat),
                  resolve: (conn) => conn.amount,
                },
              })
            });

            return {
              type: connectionType,
              args: {
              },
              async resolve(obj) {
                const array = await queryData({ id: obj.id, companyId: obj.get('company').id, });
                return {
                  ...connectionFromArray(array, {first: array.length}),
                  totalCount: array.length,
                  amount: array.reduce((sum, node) => sum + (function(){
                    const next = node.value || node;

                    if(typeof next.__type === 'undefined'){

                      if(next.className.indexOf('Bill') !== -1){
                        return next.get('total') || 0.0;
                      }

                      if(next.className.indexOf('Expense') !== -1){
                        return next.get('total') || 0.0;
                      }

                      if(next.className.indexOf('PaymentOfBills') !== -1){
                        return next.get('amountReceived') || 0.0;
                      }
                    }

                    switch (next.__type) {
                      case 'Bill':           return next.get('total') || 0.0;
                      case 'Expense':        return next.get('total') || 0.0;
                      case 'PaymentOfBills': return next.get('amountReceived') || 0.0;;
                    }
                  }()), 0.0),
                };
              },
            };
          }

          return {
            open: resolveType('Open', billType, function({id, companyId, }){
              return queryVendorOpenBills({id: companyId}, {id});
            }),
            overdue: resolveType('Overdue', billType, function({id, companyId, }){
              return queryVendorOverdueBills({id: companyId}, {id});
            }),
          };
        },
      }),
      resolve: (obj) => obj,
    },
    createdAt: createdField(),
    updatedAt: editedField(),
    objectId: objectIdField(),
    className: classNameField(),
    // user: {
    //   type: userType,
    //   description: 'The user who created this object.',
    //   resolve: vendor => vendor.has('user') ? getUser(vendor.get('user').id) : null,
    // },
  }),
  interfaces: [ nodeInterface, personType ],
  isTypeOf: ({ __type, className, }) => __type === 'Vendor' || className.indexOf('Vendor_') !== -1,
});

export const employeeType = new GraphQLObjectType({
  name: 'Employee',
  description: 'A Employee',
  fields: () => ({
    id: globalIdField('Employee', object => [object.id, object.get('company').id].join(':')),
    // company: {
    //   type: new GraphQLNonNull(parseObjectInputFieldType),
    //   resolve: (employee) => employee.get('company'),
    // },
    displayName: {
      type: new GraphQLNonNull(GraphQLString),
      resolve: (employee) => employee.get('displayName'),
    },
    image: {
      type: GraphQLString,
      resolve: (employee) => employee.get('image'),
    },
    title: {
      type: GraphQLString,
      resolve: (employee) => employee.get('title'),
    },
    givenName: {
      type: GraphQLString,
      resolve: (employee) => employee.get('givenName'),
    },
    middleName: {
      type: GraphQLString,
      resolve: (employee) => employee.get('middleName'),
    },
    familyName: {
      type: GraphQLString,
      resolve: (employee) => employee.get('familyName'),
    },
    affiliation: {
      type: GraphQLString,
      resolve: (employee) => employee.get('affiliation'),
    },
    emails: {
      type: GraphQLString,
      resolve: (employee) => employee.get('emails'),
    },
    phone: {
      type: GraphQLString,
      resolve: (employee) => employee.get('phone'),
    },
    mobile: {
      type: GraphQLString,
      resolve: (employee) => employee.get('mobile'),
    },
    fax: {
      type: GraphQLString,
      resolve: (employee) => employee.get('fax'),
    },
    website: {
      type: GraphQLString,
      resolve: (employee) => employee.get('website'),
    },
    address_streetAddress: {
      type: GraphQLString,
      resolve: (employee) => employee.get('address_streetAddress'),
    },
    address_cityTown: {
      type: GraphQLString,
      resolve: (employee) => employee.get('address_cityTown'),
    },
    address_stateProvince: {
      type: GraphQLString,
      resolve: (employee) => employee.get('address_stateProvince'),
    },
    address_postalCode: {
      type: GraphQLString,
      resolve: (employee) => employee.get('address_postalCode'),
    },
    address_country: {
      type: GraphQLString,
      resolve: (employee) => employee.get('address_country'),
    },
    notes: {
      type: GraphQLString,
      resolve: (employee) => employee.get('notes'),
    },
    createdAt: createdField(),
    updatedAt: editedField(),
    objectId: objectIdField(),
    className: classNameField(),
    // user: {
    //   type: userType,
    //   description: 'The user who created this object.',
    //   resolve: employee => employee.has('user') ? getUser(employee.get('user').id) : null,
    // },
  }),
  interfaces: [ nodeInterface, personType ],
  isTypeOf: ({ __type, className, }) => __type === 'Employee' || className.indexOf('Employee_') !== -1,
});

export const customerType = new GraphQLObjectType({
  name: 'Customer',
  description: 'A Customer',
  fields: () => ({
    id: globalIdField('Customer', object => [object.id, object.get('company').id].join(':')),
    // company: {
    //   type: new GraphQLNonNull(parseObjectInputFieldType),
    //   resolve: (customer) => customer.get('company'),
    // },
    displayName: {
      type: new GraphQLNonNull(GraphQLString),
      resolve: (customer) => customer.get('displayName'),
    },
    image: {
      type: GraphQLString,
      resolve: (customer) => customer.get('image'),
    },
    title: {
      type: GraphQLString,
      resolve: (customer) => customer.get('title'),
    },
    givenName: {
      type: GraphQLString,
      resolve: (customer) => customer.get('givenName'),
    },
    middleName: {
      type: GraphQLString,
      resolve: (customer) => customer.get('middleName'),
    },
    familyName: {
      type: GraphQLString,
      resolve: (customer) => customer.get('familyName'),
    },
    affiliation: {
      type: GraphQLString,
      resolve: (customer) => customer.get('affiliation'),
    },
    emails: {
      type: GraphQLString,
      resolve: (customer) => customer.get('emails'),
    },
    phone: {
      type: GraphQLString,
      resolve: (customer) => customer.get('phone'),
    },
    mobile: {
      type: GraphQLString,
      resolve: (customer) => customer.get('mobile'),
    },
    fax: {
      type: GraphQLString,
      resolve: (customer) => customer.get('fax'),
    },
    website: {
      type: GraphQLString,
      resolve: (customer) => customer.get('website'),
    },
    billing_streetAddress: {
      type: GraphQLString,
      resolve: (customer) => customer.get('billing_streetAddress'),
    },
    billing_cityTown: {
      type: GraphQLString,
      resolve: (customer) => customer.get('billing_cityTown'),
    },
    billing_stateProvince: {
      type: GraphQLString,
      resolve: (customer) => customer.get('billing_stateProvince'),
    },
    billing_postalCode: {
      type: GraphQLString,
      resolve: (customer) => customer.get('billing_postalCode'),
    },
    billing_country: {
      type: GraphQLString,
      resolve: (customer) => customer.get('billing_country'),
    },
    notes: {
      type: GraphQLString,
      resolve: (customer) => customer.get('notes'),
    },
    openBalance: {
      type: new GraphQLNonNull(GraphQLFloat),
      resolve: (customer) => customer.has('openBalance') ? customer.get('openBalance') : 0.0,
    },
    sales: CustomerSalesConnection,
    // expenses: CustomerExpensesConnection,
    paymentsOfInvoices: CustomerPaymentsOfInvoicesConnection,
    invoices: CustomerInvoicesConnection,
    salesStatus: {
      type: new GraphQLObjectType({
        name: 'CustomerSalesStatus',
        fields: () => {

          function resolveType(name, nodeType, queryData){

            const {connectionType} = connectionDefinitions({
              name: 'CustomerSalesStatusInvoices_' + name,
              nodeType,
              connectionFields: () => ({
                totalCount: {
                  type: new GraphQLNonNull(GraphQLInt),
                  resolve: (conn) => conn.totalCount,
                },
                amount: {
                  type: new GraphQLNonNull(GraphQLFloat),
                  resolve: (conn) => conn.amount,
                },
              }),
            });

            return {
              type: connectionType,
              args: {
              },
              async resolve(obj) {
                const array = await queryData({id: obj.id, companyId: obj.get('company').id, });
                const amount = array.reduce((sum, node) => sum + (function(){
                  const next = node.value || node;

                  if(typeof next.__type === 'undefined'){

                    if(next.className.indexOf('Invoice') !== -1){
                      return next.get('total') || 0.0;
                    }

                    if(next.className.indexOf('Sale') !== -1){
                      return next.get('total') || 0.0;
                    }

                    if(next.className.indexOf('PaymentOfInvoices') !== -1){
                      return next.get('amountReceived') || 0.0;
                    }
                  }

                  switch (next.__type) {
                    case 'Invoice':           return next.get('total') || 0.0;
                    case 'Sale':              return next.get('total') || 0.0;
                    case 'PaymentOfInvoices': return next.get('amountReceived') || 0.0;
                  }
                }()), 0.0);

                return {
                  ...connectionFromArray(array, {first: array.length}),
                  totalCount: array.length,
                  amount,
                };
              },
            };
          }

          return {
            open: resolveType('Open', invoiceType, function({ id, companyId, }){
              return queryCustomerOpenInvoices({ id: companyId, }, {id});
            }),
            overdue: resolveType('Overdue', invoiceType, function({ id, companyId, }){
              return queryCustomerOverdueInvoices({ id: companyId, }, {id});
            }),
          };
        },
      }),
      resolve: (obj) => obj,
    },
    createdAt: createdField(),
    updatedAt: editedField(),
    objectId: objectIdField(),
    className: classNameField(),
    // user: {
    //   type: userType,
    //   description: 'The user who created this object.',
    //   resolve: customer => customer.has('user') ? getUser(customer.get('user').id) : null,
    // },
  }),
  interfaces: [ nodeInterface, personType ],
  isTypeOf: ({ __type, className, }) => __type === 'Customer' || className.indexOf('Customer_') !== -1,
});

export const saleOrPaymentOfInvoicesType = new GraphQLInterfaceType({
  name: 'SaleOrPaymentOfInvoices',
  fields: () => ({
    id: {
      type: new GraphQLNonNull(GraphQLID),
    },
    customer: {
      type: customerType,
    },
    date: {
      type: new GraphQLNonNull(GraphQLDateTime),
    },
    memo: {
      type: GraphQLString,
    },
    files: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(GraphQLURL))),
    },
    createdAt: {
      type: new GraphQLNonNull(GraphQLDateTime),
    },
    updatedAt: {
      type: GraphQLDateTime,
    },
    objectId: {
      type: new GraphQLNonNull(GraphQLString),
    },
  }),
});

export const saleType = new GraphQLObjectType({
  name: 'Sale',
  description: 'A Sale',
  fields: () => ({
    id: globalIdField('Sale', object => [object.id, object.get('company').id].join(':')),
    customer: {
      type: customerType,
      resolve: (sale) => sale.has('customer') ? sale.get('customer').fetch().then(obj => { obj.__type = 'Customer'; return obj; }) : null,
    },
    billingAddress: {
      type: new GraphQLNonNull(GraphQLString),
      resolve: (sale) => sale.get('billingAddress'),
    },
    date: {
      type: new GraphQLNonNull(GraphQLDateTime),
      resolve: (sale) => sale.get('date'),
    },
    paymentMethod: {
      type: new GraphQLNonNull(paymentMethodType),
      resolve: (sale) => sale.get('paymentMethod'),
    },
    paymentRef: {
      type: GraphQLString,
      resolve: (sale) => sale.get('paymentRef'),
    },
    refNo: {
      type: new GraphQLNonNull(GraphQLInt),
      resolve: (sale) => sale.get('refNo'),
    },
    depositToAccountCode: {
      type: new GraphQLNonNull(GraphQLString),
      resolve: (sale) => sale.get('depositToAccountCode'),
    },
    discountType: {
      type: new GraphQLNonNull(discountValueType),
      resolve: (sale) => sale.get('discountType'),
    },
    discountValue: {
      type: GraphQLFloat,
      resolve: (sale) => sale.get('discountValue'),
    },
    itemsConnection: function () {
      const {connectionType, edgeType} = connectionDefinitions({
        name: 'SaleItems',
        nodeType: saleItemType,
        connectionFields: () => ({
          totalCount: {
            type: GraphQLInt,
            resolve: (conn) => conn.totalCount,
          },
          amountReceived: {
            type: GraphQLFloat,
            resolve: (conn) => conn.amountReceived,
          },
        })
      });

      const {connection,} = {
        connection: {
          type: connectionType,
          args: {},
          async resolve(obj, args, info) {
            const array = await getSaleItems(obj);
            return {
              ...connectionFromArray(array, {first: array.length}),
              totalCount: array.length,
              // amountReceived: array.reduce((sum, item) => {
              //   const qty = item.get('qty');
              //   const rate = item.get('rate');
              //   return sum + (qty * rate);
              // }, 0.0),
              amountReceived: obj.get('total'),
            };
          },
        },
        edgeType,
      };

      return connection;
    }(),
    _balanceDue: {
      type: new GraphQLNonNull(GraphQLFloat),
      resolve: (sale) => sale.get('balanceDue'),
    },
    _total: {
      type: new GraphQLNonNull(GraphQLFloat),
      resolve: (sale) => sale.get('total'),
    },
    memo: {
      type: GraphQLString,
      resolve: (sale) => sale.get('memo'),
    },
    files: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(GraphQLURL))),
      resolve: (sale) => sale.get('files') || [],
    },
    createdAt: createdField(),
    updatedAt: editedField(),
    objectId: objectIdField(),
    className: classNameField(),
    user: {
      type: userType,
      description: 'The user who created this object.',
      resolve: sale => sale.has('user') ? getUser(sale.get('user').id) : null,
    },
  }),
  interfaces: [ nodeInterface, saleOrPaymentOfInvoicesType ],
  isTypeOf: (obj) => obj.__type === 'Sale' || isType(obj, 'Sale'),
});

export const expenseType = new GraphQLObjectType({
  name: 'Expense',
  description: 'An Expense',
  fields: () => ({
    id: globalIdField('Expense', object => [object.id, object.get('company').id].join(':')),
    payee: {
      type: personType,
      resolve: (expense) => expense.has('payeeType') ? function(){
        const type = expense.get('payeeType');
        switch (type) {
          case 1 /* 'Customer' */:
          case 'Customer': return expense.has('customer') ? expense.get('customer').fetch().then(obj => { obj.__type = 'Customer'; return obj; }) : undefined;

          case 2 /* 'Vendor' */:
          case 'Vendor':   return expense.has('vendor') ? expense.get('vendor').fetch().then(obj => { obj.__type = 'Vendor'; return obj; }) : undefined;

          case 3 /* 'Employee' */:
          case 'Employee':   return expense.has('employee') ? expense.get('employee').fetch().then(obj => { obj.__type = 'Employee'; return obj; }) : undefined;
        }
      }() : undefined,
    },
    creditToAccountCode: {
      type: new GraphQLNonNull(GraphQLString),
      resolve: (expense) => expense.get('creditToAccountCode'),
    },
    date: {
      type: new GraphQLNonNull(GraphQLDateTime),
      resolve: (expense) => expense.get('date'),
    },
    paymentMethod: {
      type: new GraphQLNonNull(paymentMethodType),
      resolve: (expense) => expense.get('paymentMethod'),
    },
    paymentRef: {
      type: GraphQLString,
      resolve: (expense) => expense.get('paymentRef'),
    },
    // refNo: {
    //   type: new GraphQLNonNull(GraphQLInt),
    //   resolve: (expense) => expense.get('refNo'),
    // },
    itemsConnection: function () {
      const {connectionType, edgeType} = connectionDefinitions({
        name: 'expenseItemTypeItems',
        nodeType: expenseItemType,
        connectionFields: () => ({
          totalCount: {
            type: GraphQLInt,
            resolve: (conn) => conn.totalCount,
          },
          amountPaid: {
            type: GraphQLFloat,
            resolve: (conn) => conn.amountPaid,
          },
        })
      });

      const {connection, } = {
        connection: {
          type: connectionType,
          args: {},
          async resolve(obj, args, info) {
            const array = await getExpenseItems(obj);
            return {
              ...connectionFromArray(array, {first: array.length}),
              totalCount: array.length,
              amountPaid: array.reduce((sum, item) => sum + item.get('amount'), 0.0),
            };
          },
        },
        edgeType,
      };

      return connection;
    }(),
    memo: {
      type: GraphQLString,
      resolve: (expense) => expense.get('memo'),
    },
    files: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(GraphQLURL))),
      resolve: (expense) => expense.get('files') || [],
    },
    createdAt: createdField(),
    updatedAt: editedField(),
    objectId: objectIdField(),
    className: classNameField(),
    user: {
      type: userType,
      description: 'The user who created this object.',
      resolve: expense => expense.has('user') ? getUser(expense.get('user').id) : null,
    },
  }),
  interfaces: [ nodeInterface, expenseOrPaymentOfBillsType ],
  isTypeOf: (obj) => obj.__type === 'Expense' || isType(obj, 'Expense'),
});

export const invoiceType = new GraphQLObjectType({
  name: 'Invoice',
  description: 'An Invoice',
  fields: () => ({
    id: globalIdField('Invoice', object => [object.id, object.get('company').id].join(':')),
    refNo: {
      type: new GraphQLNonNull(GraphQLInt),
      resolve: (invoice) => invoice.get('refNo'),
    },
    customer: {
      type: customerType,
      resolve: (invoice) => invoice.has('customer') ? invoice.get('customer').fetch().then(obj => { obj.__type = 'Customer'; return obj; }) : null,
    },
    billingAddress: {
      type: new GraphQLNonNull(GraphQLString),
      resolve: (invoice) => invoice.get('billingAddress'),
    },
    terms: {
      type: new GraphQLNonNull(paymentTermsType),
      resolve: (invoice) => invoice.get('terms'),
    },
    date: {
      type: new GraphQLNonNull(GraphQLDateTime),
      resolve: (invoice) => invoice.get('date'),
    },
    dueDate: {
      type: new GraphQLNonNull(GraphQLDateTime),
      resolve: (invoice) => invoice.get('dueDate'),
    },
    discountType: {
      type: new GraphQLNonNull(discountValueType),
      resolve: (invoice) => invoice.get('discountType'),
    },
    discountValue: {
      type: GraphQLFloat,
      resolve: (invoice) => invoice.get('discountValue'),
    },
    itemsConnection: function () {
      const {connectionType, edgeType} = connectionDefinitions({
        name: 'InvoiceItems',
        nodeType: invoiceItemType,
        connectionFields: () => ({
          totalCount: {
            type: GraphQLInt,
            resolve: (conn) => conn.totalCount,
          },
          totalAmount: {
            type: GraphQLFloat,
            resolve: (conn) => conn.totalAmount,
          },
        })
      });

      const {connection, } = {
        connection: {
          type: connectionType,
          args: {},
          async resolve(obj, args, info) {
            const array = await getInvoiceItems(obj);
            return {
              ...connectionFromArray(array, {first: array.length}),
              totalCount: array.length,
              // totalAmount: array.reduce((sum, item) => {
              //   const qty = item.get('qty');
              //   const rate = item.get('rate');
              //   return sum + (qty * rate);
              // }, 0.0),
              totalAmount: obj.get('total'),
            };
          },
        },
        edgeType,
      };

      return connection;
    }(),
    paymentsConnection: function () {
      const {connectionType, edgeType} = connectionDefinitions({
        name: 'InvoicePayments',
        nodeType: paymentOfInvoicesItemType,
        connectionFields: () => ({
          totalCount: {
            type: GraphQLInt,
            resolve: (conn) => conn.totalCount,
          },
          totalAmountReceived: {
            type: GraphQLFloat,
            resolve: (conn) => conn.totalAmountReceived,
          },
          latestPayment: {
            type: paymentOfInvoicesItemType,
            resolve: (conn) => conn.latestPayment,
          },
        })
      });

      const {connection, } = {
        connection: {
          type: connectionType,
          args: {},
          async resolve(obj, args, info) {
            const array = await getInvoicePayments(obj);
            return {
              ...connectionFromArray(array, {first: array.length}),
              totalCount: array.length,
              totalAmountReceived: array.reduce((sum, payment) => sum + payment.get('amount'), 0.0),
              latestPayment: array[0],
            };
          },
        },
        edgeType,
      };

      return connection;
    }(),
    _balanceDue: {
      type: new GraphQLNonNull(GraphQLFloat),
      resolve: (invoice) => invoice.get('balanceDue'),
    },
    _total: {
      type: new GraphQLNonNull(GraphQLFloat),
      resolve: (invoice) => invoice.get('total'),
    },
    _totalReceived: {
      type: new GraphQLNonNull(GraphQLFloat),
      resolve: (invoice) => {
        const total = invoice.get('total');
        const balanceDue = invoice.get('balanceDue');
        return total - balanceDue;
      },
    },
    _status: {
      type: new GraphQLNonNull(transactionStatusType),
      resolve: (invoice) => {
        // const totalAmount = invoice.get('total');
        const balanceDue = invoice.get('balanceDue');
        const _dueDate = moment(invoice.get('dueDate'));
        const now = moment();

        const isPaidInFull = balanceDue === 0.0;
        if(isPaidInFull){
          return 2; // 'Closed';
        }

        if(_dueDate.isBefore(now)){
          return 3; // 'Overdue';
        }

        // const hasPayment = amountPaid !== 0;
        //
        // if(hasPayment){
        //   return 'Partial';
        // }

        return 1; // 'Open';
      },
    },
    memo: {
      type: GraphQLString,
      resolve: (invoice) => invoice.get('memo'),
    },
    files: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(GraphQLURL))),
      resolve: (invoice) => invoice.get('files') || [],
    },
    createdAt: createdField(),
    updatedAt: editedField(),
    objectId: objectIdField(),
    className: classNameField(),
    user: {
      type: userType,
      description: 'The user who created this object.',
      resolve: invoice => invoice.has('user') ? getUser(invoice.get('user').id) : null,
    },
  }),
  interfaces: [ nodeInterface ],
});

export const paymentOfInvoicesItemType = new GraphQLObjectType({
  name: 'PaymentOfInvoicesItem',
  description: 'An Invoice Payment entry',
  fields: () => ({
    id: globalIdField('PaymentOfInvoicesItem', object => [object.id, object.get('company').id].join(':')),
    index: {
      type: new GraphQLNonNull(GraphQLInt),
      resolve: (item) => item.get('index'),
    },
    date: {
      type: new GraphQLNonNull(GraphQLDateTime),
      resolve: (item) => item.get('date'),
    },
    amount: {
      type: new GraphQLNonNull(GraphQLFloat),
      resolve: (item) => item.get('amount'),
    },
    payment: {
      type: new GraphQLNonNull(paymentOfInvoicesType),
      resolve: (item) => item.get('payment'),
    },
    invoice: {
      type: new GraphQLNonNull(invoiceType),
      resolve: (item) => item.get('invoice'),
    },
    createdAt: createdField(),
    objectId: objectIdField(),
    className: classNameField(),
  }),
  interfaces: [ nodeInterface ],
});

export const paymentOfInvoicesType = new GraphQLObjectType({
  name: 'PaymentOfInvoices',
  description: 'A Payment of invoices',
  fields: () => ({
    id: globalIdField('PaymentOfInvoices', object => [object.id, object.get('company').id].join(':')),
    customer: {
      type: customerType,
      resolve: (payment) => payment.has('customer') ? payment.get('customer').fetch().then(obj => { obj.__type = 'Customer'; return obj; }) : null,
    },
    date: {
      type: new GraphQLNonNull(GraphQLDateTime),
      resolve: (payment) => payment.get('date'),
    },
    paymentMethod: {
      type: new GraphQLNonNull(paymentMethodType),
      resolve: (payment) => payment.get('paymentMethod'),
    },
    paymentRef: {
      type: GraphQLString,
      resolve: (payment) => payment.get('paymentRef'),
    },
    depositToAccountCode: {
      type: new GraphQLNonNull(GraphQLString),
      resolve: (payment) => payment.get('depositToAccountCode'),
    },
    itemsConnection: function () {
      const {connectionType, edgeType} = connectionDefinitions({
        name: 'PaymentOfInvoicesItems',
        nodeType: paymentOfInvoicesItemType,
        connectionFields: () => ({
          totalCount: {
            type: GraphQLInt,
            resolve: (conn) => conn.totalCount,
          },
          totalAmountReceived: {
            type: GraphQLFloat,
            resolve: (conn) => conn.totalAmountReceived,
          },
        })
      });

      const {connection, } = {
        connection: {
          type: connectionType,
          args: {},
          async resolve(obj, args, info) {
            const array = await getPaymentOfInvoicesItems(obj);
            return {
              ...connectionFromArray(array, {first: array.length}),
              totalCount: array.length,
              // totalAmountReceived: array.reduce((sum, payment) => sum + payment.get('amount'), 0.0),
              totalAmountReceived: obj.get('amountToApply'),
            };
          },
        },
        edgeType,
      };

      return connection;
    }(),
    amountReceived: {
      type: new GraphQLNonNull(GraphQLFloat),
      resolve: (payment) => payment.get('amountReceived'),
    },
    _amountToApply: {
      type: new GraphQLNonNull(GraphQLFloat),
      resolve: (payment) => payment.get('amountToApply'),
    },
    _amountToCredit: {
      type: new GraphQLNonNull(GraphQLFloat),
      resolve: (payment) => payment.get('amountToCredit'),
    },
    memo: {
      type: GraphQLString,
      resolve: (payment) => payment.get('memo'),
    },
    files: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(GraphQLURL))),
      resolve: (payment) => payment.get('files') || [],
    },
    createdAt: createdField(),
    updatedAt: editedField(),
    objectId: objectIdField(),
    className: classNameField(),
    user: {
      type: userType,
      description: 'The user who created this object.',
      resolve: payment => payment.has('user') ? getUser(payment.get('user').id) : null,
    },
  }),
  interfaces: [ nodeInterface, saleOrPaymentOfInvoicesType ],
  isTypeOf: (obj) => obj.__type === 'PaymentOfInvoices' || isType(obj, 'PaymentOfInvoices'),
});

export const billType = new GraphQLObjectType({
  name: 'Bill',
  description: 'An Bill',
  fields: () => ({
    id: globalIdField('Bill', object => [object.id, object.get('company').id].join(':')),
    paymentRef: {
      type: GraphQLString,
      resolve: (bill) => bill.get('paymentRef'),
    },
    payee: {
      type: vendorType,
      resolve: (bill) => bill.has('payee') ? bill.get('payee').fetch().then(obj => { obj.__type = 'Vendor'; return obj; }) : null,
    },
    mailingAddress: {
      type: new GraphQLNonNull(GraphQLString),
      resolve: (bill) => bill.get('mailingAddress'),
    },
    terms: {
      type: new GraphQLNonNull(paymentTermsType),
      resolve: (bill) => bill.get('terms'),
    },
    date: {
      type: new GraphQLNonNull(GraphQLDateTime),
      resolve: (bill) => bill.get('date'),
    },
    dueDate: {
      type: new GraphQLNonNull(GraphQLDateTime),
      resolve: (bill) => bill.get('dueDate'),
    },
    itemsConnection: function () {
      const {connectionType, edgeType} = connectionDefinitions({
        name: 'BillItems',
        nodeType: billItemType,
        connectionFields: () => ({
          totalCount: {
            type: GraphQLInt,
            resolve: (conn) => conn.totalCount,
          },
          totalAmount: {
            type: GraphQLFloat,
            resolve: (conn) => conn.totalAmount,
          },
        })
      });

      const {connection, } = {
        connection: {
          type: connectionType,
          args: {},
          async resolve(obj, args, info) {
            const array = await getBillItems(obj);
            return {
              ...connectionFromArray(array, {first: array.length}),
              totalCount: array.length,
              // totalAmount: array.reduce((sum, item) => {
              //   const qty = item.get('qty');
              //   const rate = item.get('rate');
              //   return sum + (qty * rate);
              // }, 0.0),
              totalAmount: obj.get('total'),
            };
          },
        },
        edgeType,
      };

      return connection;
    }(),
    paymentsConnection: function () {
      const {connectionType, edgeType} = connectionDefinitions({
        name: 'BillPayments',
        nodeType: paymentOfBillsItemType,
        connectionFields: () => ({
          totalCount: {
            type: GraphQLInt,
            resolve: (conn) => conn.totalCount,
          },
          totalAmountPaid: {
            type: GraphQLFloat,
            resolve: (conn) => conn.totalAmountPaid,
          },
          latestPayment: {
            type: paymentOfBillsItemType,
            resolve: (conn) => conn.latestPayment,
          },
        })
      });

      const {connection, } = {
        connection: {
          type: connectionType,
          args: {},
          async resolve(obj, args, info) {
            const array = await getBillPayments(obj);
            return {
              ...connectionFromArray(array, {first: array.length}),
              totalCount: array.length,
              totalAmountPaid: array.reduce((sum, payment) => sum + payment.get('amount'), 0.0),
              latestPayment: array[0],
            };
          },
        },
        edgeType,
      };

      return connection;
    }(),
    _balanceDue: {
      type: new GraphQLNonNull(GraphQLFloat),
      resolve: (bill) => bill.get('balanceDue'),
    },
    _total: {
      type: new GraphQLNonNull(GraphQLFloat),
      resolve: (bill) => bill.get('total'),
    },
    _totalReceived: {
      type: new GraphQLNonNull(GraphQLFloat),
      resolve: (bill) => {
        const total = bill.get('total');
        const balanceDue = bill.get('balanceDue');
        return total - balanceDue;
      },
    },
    _status: {
      type: new GraphQLNonNull(transactionStatusType),
      resolve: (bill) => {
        // const totalAmount = bill.get('total');
        const balanceDue = bill.get('balanceDue');
        const _dueDate = moment(bill.get('dueDate'));
        const now = moment();

        const isPaidInFull = balanceDue === 0.0;
        if(isPaidInFull){
          return 2; // 'Closed';
        }

        if(_dueDate.isBefore(now)){
          return 3; // 'Overdue';
        }

        // const hasPayment = amountPaid !== 0;
        //
        // if(hasPayment){
        //   return 'Partial';
        // }

        return 1; // 'Open';
      },
    },
    memo: {
      type: GraphQLString,
      resolve: (bill) => bill.get('memo'),
    },
    files: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(GraphQLURL))),
      resolve: (bill) => bill.get('files') || [],
    },
    createdAt: createdField(),
    updatedAt: editedField(),
    objectId: objectIdField(),
    className: classNameField(),
    user: {
      type: userType,
      description: 'The user who created this object.',
      resolve: bill => bill.has('user') ? getUser(bill.get('user').id) : null,
    },
  }),
  interfaces: [ nodeInterface ],
});

export const paymentOfBillsItemType = new GraphQLObjectType({
  name: 'PaymentOfBillsItem',
  description: 'An Bill Payment entry',
  fields: () => ({
    id: globalIdField('PaymentOfBillsItem', object => [object.id, object.get('company').id].join(':')),
    index: {
      type: new GraphQLNonNull(GraphQLInt),
      resolve: (item) => item.get('index'),
    },
    date: {
      type: new GraphQLNonNull(GraphQLDateTime),
      resolve: (item) => item.get('date'),
    },
    amount: {
      type: new GraphQLNonNull(GraphQLFloat),
      resolve: (item) => item.get('amount'),
    },
    payment: {
      type: new GraphQLNonNull(paymentOfBillsType),
      resolve: (item) => item.get('payment'),
    },
    bill: {
      type: new GraphQLNonNull(billType),
      resolve: (item) => item.get('bill'),
    },
    createdAt: createdField(),
    objectId: objectIdField(),
    className: classNameField(),
  }),
  interfaces: [ nodeInterface ],
});

export const paymentOfBillsType = new GraphQLObjectType({
  name: 'PaymentOfBills',
  description: 'A Payment of bills',
  fields: () => ({
    id: globalIdField('PaymentOfBills', object => [object.id, object.get('company').id].join(':')),
    payee: {
      type: vendorType,
      resolve: (payment) => payment.has('payee') ? payment.get('payee').fetch().then(obj => { obj.__type = 'Vendor'; return obj; }) : null,
    },
    date: {
      type: new GraphQLNonNull(GraphQLDateTime),
      resolve: (payment) => payment.get('date'),
    },
    mailingAddress: {
      type: new GraphQLNonNull(GraphQLString),
      resolve: (invoice) => invoice.get('mailingAddress'),
    },
    // paymentMethod: {
    //   type: new GraphQLNonNull(paymentMethodType),
    //   resolve: (payment) => payment.get('paymentMethod'),
    // },
    paymentRef: {
      type: GraphQLString,
      resolve: (payment) => payment.get('paymentRef'),
    },
    creditToAccountCode: {
      type: new GraphQLNonNull(GraphQLString),
      resolve: (payment) => payment.get('creditToAccountCode'),
    },
    itemsConnection: function () {
      const {connectionType, edgeType} = connectionDefinitions({
        name: 'PaymentOfBillsItems',
        nodeType: paymentOfBillsItemType,
        connectionFields: () => ({
          totalCount: {
            type: GraphQLInt,
            resolve: (conn) => conn.totalCount,
          },
          totalAmountPaid: {
            type: GraphQLFloat,
            resolve: (conn) => conn.totalAmountPaid,
          },
        })
      });

      const {connection, } = {
        connection: {
          type: connectionType,
          args: {},
          async resolve(obj, args, info) {
            const array = await getPaymentOfBillsItems(obj);
            return {
              ...connectionFromArray(array, {first: array.length}),
              totalCount: array.length,
              // totalAmountPaid: array.reduce((sum, payment) => sum + payment.get('amount'), 0.0),
              totalAmountPaid: obj.get('amountToApply'),
            };
          },
        },
        edgeType,
      };

      return connection;
    }(),
    amountReceived: {
      type: new GraphQLNonNull(GraphQLFloat),
      resolve: (payment) => payment.get('amountReceived'),
    },
    _amountToApply: {
      type: new GraphQLNonNull(GraphQLFloat),
      resolve: (payment) => payment.get('amountToApply'),
    },
    _amountToCredit: {
      type: new GraphQLNonNull(GraphQLFloat),
      resolve: (payment) => payment.get('amountToCredit'),
    },
    memo: {
      type: GraphQLString,
      resolve: (payment) => payment.get('memo'),
    },
    files: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(GraphQLURL))),
      resolve: (payment) => payment.get('files') || [],
    },
    createdAt: createdField(),
    updatedAt: editedField(),
    objectId: objectIdField(),
    className: classNameField(),
    user: {
      type: userType,
      description: 'The user who created this object.',
      resolve: payment => payment.has('user') ? getUser(payment.get('user').id) : null,
    },
  }),
  interfaces: [ nodeInterface, expenseOrPaymentOfBillsType ],
  isTypeOf: (obj) => obj.__type === 'PaymentOfBills' || isType(obj, 'PaymentOfBills'),
});

export const productType = new GraphQLObjectType({
  name: 'Product',
  fields: () => ({
    id: globalIdField('Product', object => [object.id, object.get('company').id].join(':')),
    type: {
      type: new GraphQLNonNull(productKind),
      resolve: (item) => parseInt(item.get('type')),
    },
    displayName: {
      type: new GraphQLNonNull(GraphQLString),
      resolve: (item) => item.get('displayName'),
    },
    image: {
      type: GraphQLString,
      resolve: (item) => item.get('image'),
    },
    sku: {
      type: GraphQLString,
      resolve: (item) => item.get('sku'),
    },
    salesDesc: {
      type: GraphQLString,
      resolve: (item) => item.get('salesDesc'),
    },
    salesPrice: {
      type: GraphQLFloat,
      resolve: (item) => item.get('salesPrice'),
    },
    incomeAccountCode: {
      type: GraphQLString,
      resolve: (item) => item.get('incomeAccountCode'),
    },
    createdAt: createdField(),
    updatedAt: editedField(),
    objectId: objectIdField(),
    className: classNameField(),
    user: {
      type: userType,
      description: 'The user who created this object.',
      resolve: invoice => invoice.has('user') ? getUser(invoice.get('user').id) : null,
    },
  }),
  interfaces: [ nodeInterface ],
});

export const expenseItemType = new GraphQLObjectType({
  name: 'ExpenseItem',
  description: 'An Expense Item',
  fields: () => ({
    id: globalIdField('ExpenseItem', object => [object.id, object.get('company').id].join(':')),
    index: {
      type: new GraphQLNonNull(GraphQLInt),
      resolve: (item) => item.get('index'),
    },
    accountCode: {
      type: new GraphQLNonNull(GraphQLString),
      resolve: (item) => item.get('accountCode'),
    },
    description: {
      type: GraphQLString,
      resolve: (item) => item.get('description'),
    },
    amount: {
      type: new GraphQLNonNull(GraphQLFloat),
      resolve: (item) => item.get('amount'),
    },
    createdAt: createdField(),
    objectId: objectIdField(),
    className: classNameField(),
  }),
  interfaces: [ nodeInterface ],
});

export const billItemType = new GraphQLObjectType({
  name: 'BillItem',
  description: 'An Bill Item',
  fields: () => ({
    id: globalIdField('BillItem', object => [object.id, object.get('company').id].join(':')),
    index: {
      type: new GraphQLNonNull(GraphQLInt),
      resolve: (item) => item.get('index'),
    },
    accountCode: {
      type: new GraphQLNonNull(GraphQLString),
      resolve: (item) => item.get('accountCode'),
    },
    description: {
      type: GraphQLString,
      resolve: (item) => item.get('description'),
    },
    amount: {
      type: new GraphQLNonNull(GraphQLFloat),
      resolve: (item) => item.get('amount'),
    },
    createdAt: createdField(),
    objectId: objectIdField(),
    className: classNameField(),
  }),
  interfaces: [ nodeInterface ],
});

export const invoiceItemType = new GraphQLObjectType({
  name: 'InvoiceItem',
  description: 'An Invoice Item',
  fields: () => ({
    id: globalIdField('InvoiceItem', object => [object.id, object.get('company').id].join(':')),
    index: {
      type: new GraphQLNonNull(GraphQLInt),
      resolve: (item) => item.get('index'),
    },
    date: {
      type: GraphQLDateTime,
      resolve: (item) => item.get('date'),
    },
    item: {
      type: productType,
      resolve: (item) => item.has('item') ? item.get('item').fetch().then(obj => { obj.__type = 'Product'; return obj; }) : null,
    },
    description: {
      type: GraphQLString,
      resolve: (item) => item.get('description'),
    },
    qty: {
      type: new GraphQLNonNull(GraphQLInt),
      resolve: (item) => item.get('qty'),
    },
    rate: {
      type: new GraphQLNonNull(GraphQLFloat),
      resolve: (item) => item.get('rate'),
    },
    discountPart: {
      type: discountPartType,
      resolve: (item) => item.get('discountPart'),
    },
    createdAt: createdField(),
    objectId: objectIdField(),
    className: classNameField(),
  }),
  interfaces: [ nodeInterface ],
});

export const saleItemType = new GraphQLObjectType({
  name: 'SaleItem',
  description: 'A Sale Item',
  fields: () => ({
    id: globalIdField('SaleItem', object => [object.id, object.get('company').id].join(':')),
    index: {
      type: new GraphQLNonNull(GraphQLInt),
      resolve: (item) => item.get('index'),
    },
    item: {
      type: new GraphQLNonNull(productType),
      resolve: (item) => item.has('item') ? item.get('item').fetch().then(obj => { obj.__type = 'Product'; return obj; }) : null,
    },
    date: {
      type: GraphQLDateTime,
      resolve: (item) => item.get('date'),
    },
    description: {
      type: GraphQLString,
      resolve: (item) => item.get('description'),
    },
    qty: {
      type: new GraphQLNonNull(GraphQLInt),
      resolve: (item) => item.get('qty'),
    },
    rate: {
      type: new GraphQLNonNull(GraphQLFloat),
      resolve: (item) => item.get('rate'),
    },
    discountPart: {
      type: discountPartType,
      resolve: (item) => item.get('discountPart'),
    },
    createdAt: createdField(),
    objectId: objectIdField(),
    className: classNameField(),
  }),
  interfaces: [ nodeInterface ],
});

export const {connection: CompanyBankAccountsConnection} = connectionDefinition(
  'CompanyBankAccounts',
  bankType,
  () => {
    return getBankAccounts();
  }
);

export const {connection: AccountOperationConnection} = connectionDefinition(
  'AccountOperations',
  operationType,
  (account) => {

    throw 'NotImplementedError';

    // const query = account.relation('operations').query();
    // return new Promise((resolve, reject) => {
    //   query.find().then(
    //     function (objects) {
    //       resolve(objects.map(obj => { obj.__type = 'Operation'; return obj; }));
    //     },
    //     function () {
    //       reject()
    //     }
    //   );
    // });

  }
);

export const {connection: TransactionOperationConnection} = connectionDefinition(
  'TransactionOperations',
  operationType,
  (transaction) => {
    // const query = transaction.relation('operations').query();
    // return new Promise((resolve, reject) => {
    //   query.find().then(
    //     function (objects) {
    //       resolve(objects.map(obj => { obj.__type = 'Transaction'; return obj; }));
    //     },
    //     function () {
    //       reject()
    //     }
    //   );
    // });
    return getTransactionOperations({ companyId: transaction.get('company').id, id: transaction.id, });
  }
);

export const {connection: CompanyTransactionsConnection} = connectionDefinition(
  'CompanyTransactions',
  transactionType,
  (company) => getTransactions(company)
);

export const {connection: CompanyAccountsConnection} = connectionDefinition(
  'CompanyAccounts',
  accountType,
  (company) => getCompanyAccounts(company)
);

export const {connection: UserCompaniesConnection, edgeType: UserCompaniesEdge} = connectionDefinition(
  'UserCompanies',
  companyType,
  (user, info) => getCompanies()
);

export const { connection: CompanyVendorsBillsQueryConnection, edgeType: CompanyVendorsBillsQueryEdge, } = function() {
  const {connectionType, edgeType} = connectionDefinitions({
    name: 'CompanyVendorsBillsQuery',
    nodeType: vendorType,
    connectionFields: () => ({
      totalCount: {
        type: GraphQLInt,
        resolve: (conn) => conn.totalCount,
      },

    })
  });
  return {
    connection: {
      type: connectionType,
      args: {
        ...connectionArgs,
        ...filterArgs,
      },
      async resolve(obj, { offset, limit, type, status, from, to, sortKey = 'date', sortDir = -1, }) {
        const { count: totalCount, results, } = await vendorsQueryBills(obj, {offset, limit, type, status, from, to, sortKey, sortDir,});
        const vendors = await Parse.Promise.when(results);

        const edges = vendors.map((value, index) => ({
          cursor: offsetToCursor(offset + index),
          node: value,
        }));

        return {
          edges,
          pageInfo: {
            hasPreviousPage: false,
            hasNextPage: false,
          },
          totalCount,
        };
      },
    },
    edgeType,
  };
}();

export const {connection: CompanyBillsConnection, edgeType: CompanyBillsEdge} = function() {
  const {connectionType, edgeType} = connectionDefinitions({
    name: 'CompanyBills',
    nodeType: billType,
    connectionFields: () => ({
      totalCount: {
        type: GraphQLInt,
        resolve: (conn) => conn.totalCount,
      },
      sumOfTotals: {
        type: GraphQLFloat,
        resolve: (conn) => conn.sumOfTotals,
      },
      sumOfBalances: {
        type: GraphQLFloat,
        resolve: (conn) => conn.sumOfBalances,
      },

    })
  });
  return {
    connection: {
      type: connectionType,
      args: {
        ...connectionArgs,
        ...filterArgs,
      },
      async resolve(obj, { offset, limit, type, status, from, to, sortKey = 'date', sortDir = -1, payee, customer, }) {
        const { count: totalCount, sumOfTotals, sumOfBalances, results: bills, } = await queryBills(obj, {offset, limit, type, status, from, to, sortKey, sortDir, payee, customer,});

        const edges = bills.map((value, index) => ({
          cursor: offsetToCursor(offset + index),
          node: value,
        }));

        return {
          edges,
          pageInfo: {
            hasPreviousPage: false,
            hasNextPage: false,
          },
          totalCount, sumOfTotals, sumOfBalances,
        };
      },
    },
    edgeType,
  };
}();

export const {connection: CompanyInvoicesConnection, edgeType: CompanyInvoicesEdge} = function() {
  const {connectionType, edgeType} = connectionDefinitions({
    name: 'CompanyInvoices',
    nodeType: invoiceType,
    connectionFields: () => ({
      totalCount: {
        type: GraphQLInt,
        resolve: (conn) => conn.totalCount,
      },
      sumOfTotals: {
        type: GraphQLFloat,
        resolve: (conn) => conn.sumOfTotals,
      },
      sumOfBalances: {
        type: GraphQLFloat,
        resolve: (conn) => conn.sumOfBalances,
      },

    })
  });
  return {
    connection: {
      type: connectionType,
      args: {
        ...connectionArgs,
        ...filterArgs,
      },
      async resolve(obj, {offset, limit, type, status, from, to, sortKey = 'date', sortDir = -1, customer,}) {
        const { count: totalCount, sumOfTotals, sumOfBalances, results: invoices, } = await queryInvoices(obj, {offset, limit, type, status, from, to, sortKey, sortDir, customer,});

        const edges = invoices.map((value, index) => ({
          cursor: offsetToCursor(offset + index),
          node: value,
        }));

        return {
          edges,
          pageInfo: {
            hasPreviousPage: false,
            hasNextPage: false,
          },
          totalCount, sumOfTotals, sumOfBalances,
        };
      },
    },
    edgeType,
  };
}();

export const {connection: CompanySalesConnection, edgeType: CompanySalesEdge} = function() {
  const {connectionType, edgeType} = connectionDefinitions({
    name: 'CompanySales',
    nodeType: saleType,
    connectionFields: () => ({
      totalCount: {
        type: GraphQLInt,
        resolve: (conn) => conn.totalCount,
      },
      sumOfTotals: {
        type: GraphQLFloat,
        resolve: (conn) => conn.sumOfTotals,
      },

    })
  });
  return {
    connection: {
      type: connectionType,
      args: {
        ...connectionArgs,
        ...filterArgs,
      },
      async resolve(obj, {offset, limit, type, from, to, sortKey = 'date', sortDir = -1, customer,}) {
        const { count: totalCount, sumOfTotals, results: sales, } = await querySales(obj, {offset, limit, type, from, to, sortKey, sortDir, customer,});

        const edges = sales.map((value, index) => ({
          cursor: offsetToCursor(offset + index),
          node: value,
        }));

        return {
          edges,
          pageInfo: {
            hasPreviousPage: false,
            hasNextPage: false,
          },
          totalCount, sumOfTotals,
        };
      },
    },
    edgeType,
  };
}();

// const {connection: CompanyExpensesConnection, edgeType: CompanyExpensesEdge} = connectionDefinition(
//   'CompanyExpenses',
//   expenseType,
//   (company, info) => getCompanyExpenses(company)
// );

export const {connection: CompanyExpensesConnection, edgeType: CompanyExpensesEdge} = function() {
  const {connectionType, edgeType} = connectionDefinitions({
    name: 'CompanyExpenses',
    nodeType: expenseType,
    connectionFields: () => ({
      totalCount: {
        type: GraphQLInt,
        resolve: (conn) => conn.totalCount,
      },
      sumOfTotals: {
        type: GraphQLFloat,
        resolve: (conn) => conn.sumOfTotals,
      },

    })
  });
  return {
    connection: {
      type: connectionType,
      args: {
        ...connectionArgs,
        ...filterArgs,
      },
      async resolve(obj, { offset, limit, type, from, to, sortKey = 'date', sortDir = -1, customer, payee, }) {
        const { count: totalCount, sumOfTotals, results: expenses, } = await queryExpenses(obj, { offset, limit, type, from, to, sortKey, sortDir, customer, payee, });

        const edges = expenses.map((value, index) => ({
          cursor: offsetToCursor(offset + index),
          node: value,
        }));

        return {
          edges,
          pageInfo: {
            hasPreviousPage: false,
            hasNextPage: false,
          },
          totalCount, sumOfTotals,
        };
      },
    },
    edgeType,
  };
}();

export const {connection: CompanyPaymentsOfBillsConnection, edgeType: CompanyPaymentsOfBillsEdge} = function() {
  const {connectionType, edgeType} = connectionDefinitions({
    name: 'CompanyPaymentsOfBills',
    nodeType: paymentOfBillsType,
    connectionFields: () => ({
      totalCount: {
        type: GraphQLInt,
        resolve: (conn) => conn.totalCount,
      },
      sumOfTotals: {
        type: GraphQLFloat,
        resolve: (conn) => conn.sumOfTotals,
      },
      sumOfCredits: {
        type: GraphQLFloat,
        resolve: (conn) => conn.sumOfCredits,
      },

    })
  });
  return {
    connection: {
      type: connectionType,
      args: {
        ...connectionArgs,
        ...filterArgs,
      },
      async resolve(obj, {offset, limit, type, from, to, sortKey = 'date', sortDir = -1, payee, customer,}) {
        const { count: totalCount, sumOfTotals, sumOfCredits, results: payments, } = await queryPaymentsOfBills(obj, {offset, limit, type, from, to, sortKey, sortDir, payee, customer,});

        const edges = payments.map((value, index) => ({
          cursor: offsetToCursor(offset + index),
          node: value,
        }));

        return {
          edges,
          pageInfo: {
            hasPreviousPage: false,
            hasNextPage: false,
          },
          totalCount,
          sumOfTotals, sumOfCredits,
        };
      },
    },
    edgeType,
  };
}();

export const {connection: CompanyPaymentsOfInvoicesConnection, edgeType: CompanyPaymentsOfInvoicesEdge} = function() {
  const {connectionType, edgeType} = connectionDefinitions({
    name: 'CompanyPaymentsOfInvoices',
    nodeType: paymentOfInvoicesType,
    connectionFields: () => ({
      totalCount: {
        type: GraphQLInt,
        resolve: (conn) => conn.totalCount,
      },
      sumOfTotals: {
        type: GraphQLFloat,
        resolve: (conn) => conn.sumOfTotals,
      },
      sumOfCredits: {
        type: GraphQLFloat,
        resolve: (conn) => conn.sumOfCredits,
      },

    })
  });
  return {
    connection: {
      type: connectionType,
      args: {
        ...connectionArgs,
        ...filterArgs,
      },
      async resolve(obj, {offset, limit, type, from, to, sortKey = 'date', sortDir = -1, customer,}) {
        const { count: totalCount, sumOfTotals, sumOfCredits, results: payments, } = await queryPaymentsOfInvoices(obj, {offset, limit, type, from, to, sortKey, sortDir, customer,});

        const edges = payments.map((value, index) => ({
          cursor: offsetToCursor(offset + index),
          node: value,
        }));

        return {
          edges,
          pageInfo: {
            hasPreviousPage: false,
            hasNextPage: false,
          },
          totalCount,
          sumOfTotals, sumOfCredits,
        };
      },
    },
    edgeType,
  };
}();

export const { connection: CompanyCustomersInvoicesQueryConnection, edgeType: CompanyCustomersInvoicesQueryEdge, } = function() {
  const {connectionType, edgeType} = connectionDefinitions({
    name: 'CompanyCustomersInvoicesQuery',
    nodeType: customerType,
    connectionFields: () => ({
      totalCount: {
        type: GraphQLInt,
        resolve: (conn) => conn.totalCount,
      },

    })
  });
  return {
    connection: {
      type: connectionType,
      args: {
        ...connectionArgs,
        ...filterArgs,
      },
      async resolve(obj, {offset, limit, type, status, from, to, sortKey = 'date', sortDir = -1,}) {
        const { count: totalCount, results, } = await customersQueryInvoices(obj, {offset, limit, type, status, from, to, sortKey, sortDir,});
        const customers = await Parse.Promise.when(results);

        const edges = customers.map((value, index) => ({
          cursor: offsetToCursor(offset + index),
          node: value,
        }));

        return {
          edges,
          pageInfo: {
            hasPreviousPage: false,
            hasNextPage: false,
          },
          totalCount,
        };
      },
    },
    edgeType,
  };
}();

export const { connection: CompanyCustomersSalesQueryConnection, edgeType: CompanyCustomersSalesQueryEdge, } = function() {
  const {connectionType, edgeType} = connectionDefinitions({
    name: 'CompanyCustomersSalesQuery',
    nodeType: customerType,
    connectionFields: () => ({
      totalCount: {
        type: GraphQLInt,
        resolve: (conn) => conn.totalCount,
      },

    })
  });
  return {
    connection: {
      type: connectionType,
      args: {
        ...connectionArgs,
        ...filterArgs,
      },
      async resolve(obj, { offset, limit, type, from, to, sortKey = 'date', sortDir = -1, }) {
        const { count: totalCount, results, } = await customersQuerySales(obj, {offset, limit, type, from, to, sortKey, sortDir,});
        const customers = await Parse.Promise.when(results);

        const edges = customers.map((value, index) => ({
          cursor: offsetToCursor(offset + index),
          node: value,
        }));

        return {
          edges,
          pageInfo: {
            hasPreviousPage: false,
            hasNextPage: false,
          },
          totalCount,
        };
      },
    },
    edgeType,
  };
}();

export const { connection: CompanyVendorsExpensesQueryConnection, edgeType: CompanyVendorsExpensesQueryEdge, } = function() {
  const {connectionType, edgeType} = connectionDefinitions({
    name: 'CompanyVendorsExpensesQuery',
    nodeType: vendorType,
    connectionFields: () => ({
      totalCount: {
        type: GraphQLInt,
        resolve: (conn) => conn.totalCount,
      },

    })
  });
  return {
    connection: {
      type: connectionType,
      args: {
        ...connectionArgs,
        ...filterArgs,
      },
      async resolve(obj, { offset, limit, type, from, to, sortKey = 'date', sortDir = -1, }) {
        const { count: totalCount, results, } = await vendorsQueryExpenses(obj, { offset, limit, type, from, to, sortKey, sortDir, });
        const vendors = await Parse.Promise.when(results);

        const edges = vendors.map((value, index) => ({
          cursor: offsetToCursor(offset + index),
          node: value,
        }));

        return {
          edges,
          pageInfo: {
            hasPreviousPage: false,
            hasNextPage: false,
          },
          totalCount,
        };
      },
    },
    edgeType,
  };
}();

export const { connection: CompanyCustomersExpensesQueryConnection, edgeType: CompanyCustomersExpensesQueryEdge, } = function() {
  const {connectionType, edgeType} = connectionDefinitions({
    name: 'CompanyCustomersExpensesQuery',
    nodeType: customerType,
    connectionFields: () => ({
      totalCount: {
        type: GraphQLInt,
        resolve: (conn) => conn.totalCount,
      },

    })
  });
  return {
    connection: {
      type: connectionType,
      args: {
        ...connectionArgs,
        ...filterArgs,
      },
      async resolve(obj, { offset, limit, type, from, to, sortKey = 'date', sortDir = -1, }) {
        const { count: totalCount, results, } = await customersQueryExpenses(obj, { offset, limit, type, from, to, sortKey, sortDir, });
        const customers = await Parse.Promise.when(results);

        const edges = customers.map((value, index) => ({
          cursor: offsetToCursor(offset + index),
          node: value,
        }));

        return {
          edges,
          pageInfo: {
            hasPreviousPage: false,
            hasNextPage: false,
          },
          totalCount,
        };
      },
    },
    edgeType,
  };
}();

export const { connection: CompanyVendorsPaymentsOfBillsQueryConnection, edgeType: CompanyVendorsPaymentsOfBillsQueryEdge, } = function() {
  const {connectionType, edgeType} = connectionDefinitions({
    name: 'CompanyVendorsPaymentsOfBillsQuery',
    nodeType: vendorType,
    connectionFields: () => ({
      totalCount: {
        type: GraphQLInt,
        resolve: (conn) => conn.totalCount,
      },

    })
  });
  return {
    connection: {
      type: connectionType,
      args: {
        ...connectionArgs,
        ...filterArgs,
      },
      async resolve(obj, { offset, limit, type, from, to, sortKey = 'date', sortDir = -1, }) {
        const { count: totalCount, results, } = await vendorsQueryPaymentsOfBills(obj, { offset, limit, type, from, to, sortKey, sortDir, });
        const vendors = await Parse.Promise.when(results);

        const edges = vendors.map((value, index) => ({
          cursor: offsetToCursor(offset + index),
          node: value,
        }));

        return {
          edges,
          pageInfo: {
            hasPreviousPage: false,
            hasNextPage: false,
          },
          totalCount,
        };
      },
    },
    edgeType,
  };
}();

export const { connection: CompanyCustomersPaymentsOfInvoicesQueryConnection, edgeType: CompanyCustomersPaymentsOfInvoicesQueryEdge, } = function() {
  const {connectionType, edgeType} = connectionDefinitions({
    name: 'CompanyCustomersPaymentsOfInvoicesQuery',
    nodeType: customerType,
    connectionFields: () => ({
      totalCount: {
        type: GraphQLInt,
        resolve: (conn) => conn.totalCount,
      },

    })
  });
  return {
    connection: {
      type: connectionType,
      args: {
        ...connectionArgs,
        ...filterArgs,
      },
      async resolve(obj, { offset, limit, type, from, to, sortKey = 'date', sortDir = -1, }) {
        const { count: totalCount, results, } = await customersQueryPaymentsOfInvoices(obj, {offset, limit, type, from, to, sortKey, sortDir,});
        const customers = await Parse.Promise.when(results);

        const edges = customers.map((value, index) => ({
          cursor: offsetToCursor(offset + index),
          node: value,
        }));

        return {
          edges,
          pageInfo: {
            hasPreviousPage: false,
            hasNextPage: false,
          },
          totalCount,
        };
      },
    },
    edgeType,
  };
}();

export const {connection: CompanyEmployeesConnection, edgeType: CompanyEmployeesEdge} = connectionDefinition(
  'CompanyEmployees',
  employeeType,
  (company, info) => getCompanyEmployees(company)
);
export const {connection: CompanyCustomersConnection, edgeType: CompanyCustomersEdge} = connectionDefinition(
  'CompanyCustomers',
  customerType,
  (company, info) => getCompanyCustomers(company)
);
export const {connection: CompanyVendorsConnection, edgeType: CompanyVendorsEdge} = connectionDefinition(
  'CompanyVendors',
  vendorType,
  (company, info) => getCompanyVendors(company)
);

export const {connection: CompanyProductsConnection, edgeType: CompanyProductsEdge} = connectionDefinition(
  'CompanyProducts',
  productType,
  (company, info) => getCompanyProducts(company)
);

export const { connection: VendorExpensesConnection, edgeType: VendorExpensesEdge, } = function() {
  const {connectionType, edgeType} = connectionDefinitions({
    name: 'VendorExpenses',
    nodeType: expenseType,
    connectionFields: () => ({
      totalCount: {
        type: GraphQLInt,
        resolve: (conn) => conn.totalCount,
      },
      sumOfTotals: {
        type: GraphQLFloat,
        resolve: (conn) => conn.sumOfTotals,
      },

    })
  });
  return {
    connection: {
      type: connectionType,
      args: {
        ...connectionArgs,
        ...filterArgs,
      },
      async resolve(obj, { offset, limit, type, from, to, sortKey = 'date', sortDir = -1, }) {
        const { count: totalCount, sumOfTotals, results: expenses, } = await queryExpenses({ id: obj.get('company').id, }, { offset, limit, type, from, to, sortKey, sortDir, payee: obj.id, }, false);

        const edges = expenses.map((value, index) => ({
          cursor: offsetToCursor(offset + index),
          node: value,
        }));

        return {
          edges,
          pageInfo: {
            hasPreviousPage: false,
            hasNextPage: false,
          },
          totalCount, sumOfTotals,
        };
      },
    },
    edgeType,
  };
}();

export const { connection: CustomerExpensesConnection, edgeType: CustomerExpensesEdge, } = function() {
  const {connectionType, edgeType} = connectionDefinitions({
    name: 'CustomerExpenses',
    nodeType: expenseType,
    connectionFields: () => ({
      totalCount: {
        type: GraphQLInt,
        resolve: (conn) => conn.totalCount,
      },
      sumOfTotals: {
        type: GraphQLFloat,
        resolve: (conn) => conn.sumOfTotals,
      },

    })
  });
  return {
    connection: {
      type: connectionType,
      args: {
        ...connectionArgs,
        ...filterArgs,
      },
      async resolve(obj, { offset, limit, type, from, to, sortKey = 'date', sortDir = -1, }) {
        const { count: totalCount, sumOfTotals, results: expenses, } = await queryExpenses({ id: obj.get('company').id, }, { offset, limit, type, from, to, sortKey, sortDir, customer: obj.id, }, false);

        const edges = expenses.map((value, index) => ({
          cursor: offsetToCursor(offset + index),
          node: value,
        }));

        return {
          edges,
          pageInfo: {
            hasPreviousPage: false,
            hasNextPage: false,
          },
          totalCount, sumOfTotals,
        };
      },
    },
    edgeType,
  };
}();

export const { connection: VendorPaymentsOfBillsConnection, edgeType: VendorPaymentsOfBillsEdge, } = function() {
  const {connectionType, edgeType} = connectionDefinitions({
    name: 'VendorPaymentsOfBills',
    nodeType: paymentOfBillsType,
    connectionFields: () => ({
      totalCount: {
        type: GraphQLInt,
        resolve: (conn) => conn.totalCount,
      },
      sumOfTotals: {
        type: GraphQLFloat,
        resolve: (conn) => conn.sumOfTotals,
      },
      sumOfCredits: {
        type: GraphQLFloat,
        resolve: (conn) => conn.sumOfCredits,
      },

    })
  });
  return {
    connection: {
      type: connectionType,
      args: {
        ...connectionArgs,
        ...filterArgs,
      },
      async resolve(obj, {offset, limit, type, from, to, sortKey = 'date', sortDir = -1, }) {
        const { count: totalCount, sumOfTotals, sumOfCredits, results: payments, } = await queryPaymentsOfBills({ id: obj.get('company').id, }, { offset, limit, type, from, to, sortKey, sortDir, payee: obj.id, }, false);

        const edges = payments.map((value, index) => ({
          cursor: offsetToCursor(offset + index),
          node: value,
        }));

        return {
          edges,
          pageInfo: {
            hasPreviousPage: false,
            hasNextPage: false,
          },
          totalCount,
          sumOfTotals, sumOfCredits,
        };
      },
    },
    edgeType,
  };
}();

export const { connection: CustomerPaymentsOfInvoicesConnection, edgeType: CustomerPaymentsOfInvoicesEdge, } = function() {
  const {connectionType, edgeType} = connectionDefinitions({
    name: 'CustomerPaymentsOfInvoices',
    nodeType: paymentOfInvoicesType,
    connectionFields: () => ({
      totalCount: {
        type: GraphQLInt,
        resolve: (conn) => conn.totalCount,
      },
      sumOfTotals: {
        type: GraphQLFloat,
        resolve: (conn) => conn.sumOfTotals,
      },
      sumOfCredits: {
        type: GraphQLFloat,
        resolve: (conn) => conn.sumOfCredits,
      },

    })
  });
  return {
    connection: {
      type: connectionType,
      args: {
        ...connectionArgs,
        ...filterArgs,
      },
      async resolve(obj, { offset, limit, type, from, to, sortKey = 'date', sortDir = -1, }) {
        const { count: totalCount, sumOfTotals, sumOfCredits, results: payments, } = await queryPaymentsOfInvoices({ id: obj.get('company').id, }, { offset, limit, type, from, to, sortKey, sortDir, customer: obj.id, }, false);

        const edges = payments.map((value, index) => ({
          cursor: offsetToCursor(offset + index),
          node: value,
        }));

        return {
          edges,
          pageInfo: {
            hasPreviousPage: false,
            hasNextPage: false,
          },
          totalCount,
          sumOfTotals, sumOfCredits,
        };
      },
    },
    edgeType,
  };
}();

export const {connection: VendorBillsConnection, edgeType: VendorBillsEdge} = function() {
  const {connectionType, edgeType} = connectionDefinitions({
    name: 'VendorBills',
    nodeType: billType,
    connectionFields: () => ({
      totalCount: {
        type: GraphQLInt,
        resolve: (conn) => conn.totalCount,
      },
      sumOfTotals: {
        type: GraphQLFloat,
        resolve: (conn) => conn.sumOfTotals,
      },
      sumOfBalances: {
        type: GraphQLFloat,
        resolve: (conn) => conn.sumOfBalances,
      },

    })
  });
  return {
    connection: {
      type: connectionType,
      args: {
        ...connectionArgs,
        ...filterArgs,
      },
      async resolve(obj, { offset, limit, type, status, from, to, sortKey = 'date', sortDir = -1, }) {
        const { count: totalCount, sumOfTotals, sumOfBalances, results: invoices, } = await queryBills({ id: obj.get('company').id, }, { offset, limit, type, status, from, to, sortKey, sortDir, payee: obj.id, }, false);

        const edges = invoices.map((value, index) => ({
          cursor: offsetToCursor(offset + index),
          node: value,
        }));

        return {
          edges,
          pageInfo: {
            hasPreviousPage: false,
            hasNextPage: false,
          },
          totalCount, sumOfTotals, sumOfBalances,
        };
      },
    },
    edgeType,
  };
}();

export const { connection: CustomerInvoicesConnection, edgeType: CustomerInvoicesEdge, } = function() {
  const {connectionType, edgeType} = connectionDefinitions({
    name: 'CustomerInvoices',
    nodeType: invoiceType,
    connectionFields: () => ({
      totalCount: {
        type: GraphQLInt,
        resolve: (conn) => conn.totalCount,
      },
      sumOfTotals: {
        type: GraphQLFloat,
        resolve: (conn) => conn.sumOfTotals,
      },
      sumOfBalances: {
        type: GraphQLFloat,
        resolve: (conn) => conn.sumOfBalances,
      },

    })
  });
  return {
    connection: {
      type: connectionType,
      args: {
        ...connectionArgs,
        ...filterArgs,
      },
      async resolve(obj, { offset, limit, type, status, from, to, sortKey = 'date', sortDir = -1, }) {
        const { count: totalCount, sumOfTotals, sumOfBalances, results: invoices, } = await queryInvoices({ id: obj.get('company').id, }, { offset, limit, type, status, from, to, sortKey, sortDir, customer: obj.id, }, false);

        const edges = invoices.map((value, index) => ({
          cursor: offsetToCursor(offset + index),
          node: value,
        }));

        return {
          edges,
          pageInfo: {
            hasPreviousPage: false,
            hasNextPage: false,
          },
          totalCount, sumOfTotals, sumOfBalances,
        };
      },
    },
    edgeType,
  };
}();

export const { connection: CustomerSalesConnection, edgeType: CustomerSalesEdge, } = function() {
  const {connectionType, edgeType} = connectionDefinitions({
    name: 'CustomerSales',
    nodeType: saleType,
    connectionFields: () => ({
      totalCount: {
        type: GraphQLInt,
        resolve: (conn) => conn.totalCount,
      },
      sumOfTotals: {
        type: GraphQLFloat,
        resolve: (conn) => conn.sumOfTotals,
      },

    })
  });
  return {
    connection: {
      type: connectionType,
      args: {
        ...connectionArgs,
        ...filterArgs,
      },
      async resolve(obj, { offset, limit, type, from, to, sortKey = 'date', sortDir = -1, }) {
        const { count: totalCount, sumOfTotals, results: sales, } = await querySales({ id: obj.get('company').id, }, { offset, limit, type, from, to, sortKey, sortDir, customer: obj.id, }, false);

        const edges = sales.map((value, index) => ({
          cursor: offsetToCursor(offset + index),
          node: value,
        }));

        return {
          edges,
          pageInfo: {
            hasPreviousPage: false,
            hasNextPage: false,
          },
          totalCount, sumOfTotals,
        };
      },
    },
    edgeType,
  };
}();
