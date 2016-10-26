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

const isType = require('./isType');

const {
  connectionDefinition,
} = require('../connections');

const {
  parseTableCountLoader,
  parseTableLoader,
  parseIDLoader,
  parseSeqLoader,
} = require('../../database/loaders');

const formatAddress = require('./utils/formatAddress');

// const concat = require('lodash.concat');
// const orderBy = require('lodash.orderby');
// const group = require('lodash.groupby');
// const compact = require('lodash.compact');
// const map = require('lodash.map');

const {
  CASH_ACCOUNT_CODE : CASH,
  DEFAULT_PAYMENT_OF_INVOICES_METHOD,
  DEFAULT_PAYMENT_OF_BILLS_METHOD,
  DEFAULT_INVOICE_TERMS,
  DEFAULT_BILL_TERMS,
  DEFAULT_SALES_ACCOUNT_CODE,
} = require('../../constants');

const Company = require('../../database/Company');

const Transaction = require('../../database/Transaction');
const Operation = require('../../database/Operation');

const findIndex = require('lodash.findindex');

const { logIn, logOut, } = require('../../auth');

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

  ops__querySales,
  ops__queryExpenses,

  ops__customersQuerySales,
  ops__vendorsQueryExpenses,

  getCustomerOpenInvoices,
  getVendorOpenBills,

  getPaymentOfInvoicesFromPaymentOfInvoicesItem,
  getPaymentOfBillsFromPaymentOfBillsItem,

  getTransactionOperations,
  getTransactionByType,

  getOperationsByCategories,

  getFile,
  getObjectFiles,
  getObjectFile,

  declaration_sales_getTotalVAT,
  declaration_expenses_getTotalVAT,

  _getCompanyVATDeclarationSales,
  _getCompanyVATDeclarationExpenses,

  // getCompanyVATDeclarationSales,
  // getCompanyVATDeclarationExpenses,

} = require('../../database/v2');

const Product = require('../../database/Product');

const Expense = require('../../database/v2/Expense');
const Sale = require('../../database/v2/Sale');

const People = require('../../database/v2/People');

const {
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

  saleOpInterfaceType,
  expenseOpInterfaceType,

  accountItemType,
  productItemType,

} = require('./common');

const moment = require('moment');

/**
 * We get the node interface and field from the Relay library.
 *
 * The first method defines the way we resolve an ID to its object.
 * The second defines the way we resolve an object to its GraphQL type.
 */
const { nodeInterface, } = require('./node');

const {
  companyVATSettingsType,
  VATInputType,
  VATPartType,
  VATPartInputType,

  activityField,
} = require('./common');

const {
  getVATDeclarationAtDate,
  getCompanyVATDeclarationHistory,
  getCompanyCurrentVATDeclaration,
  getVATDeclarationById,
} = require('../../database/v2');

const VATDeclarationType = new GraphQLObjectType({
  name: 'VATDeclaration',
  fields: () => ({
    id: globalIdField('VATDeclaration', object => [object.id, object.get('company').id].join(':')),
    settings: {
      type: new GraphQLNonNull(companyVATSettingsType),
      resolve: (obj) => {
        const settings = obj.get('settings');
        return {
          ...settings,
          startDate: new Date(settings.startDate),
        };
      },
    },
    periodStart: {
      type: new GraphQLNonNull(GraphQLDateTime),
      resolve: (obj) => obj.get('periodStart'),
    },
    periodEnd: {
      type: new GraphQLNonNull(GraphQLDateTime),
      resolve: (obj) => obj.get('periodEnd'),
    },
    report: {
      type: new GraphQLObjectType({
        name: 'CompanyVATDeclarationReport',
        fields: () => ({

          sales: {

            type: new GraphQLObjectType({
              name: 'CompanyVATDeclarationReport_Sales',
              fields: () => ({
                totalVAT: {
                  type: new GraphQLNonNull(GraphQLFloat),
                  resolve: (obj) => {
                    const companyId = obj.get('company').id;

                    const id = obj.id;
                    const settings = obj.get('settings');
                    const periodStart = obj.get('periodStart');
                    const periodEnd = obj.get('periodEnd');

                    return declaration_sales_getTotalVAT({id: companyId}, {id, periodStart, periodEnd, settings,});
                  },
                },
              }),
            }),

            resolve: (obj) => obj,
          },

          expenses: {

            type: new GraphQLObjectType({
              name: 'CompanyVATDeclarationReport_Expenses',
              fields: () => ({
                totalVAT: {
                  type: new GraphQLNonNull(GraphQLFloat),
                  resolve: (obj) => {
                    const companyId = obj.get('company').id;

                    const id = obj.id;
                    const settings = obj.get('settings');
                    const periodStart = obj.get('periodStart');
                    const periodEnd = obj.get('periodEnd');

                    return declaration_expenses_getTotalVAT({id: companyId}, {id, periodStart, periodEnd, settings,});
                  },
                },
              }),
            }),

            resolve: (obj) => obj,

          },

        }),
      }),

      resolve: (obj) => obj,
    },

    _sales: function(){
      const {connectionType, edgeType} = connectionDefinitions({
        name: '_CompanyVATDeclarationSales',
        nodeType: operationType,
        connectionFields: () => ({
          totalCount: {
            type: GraphQLInt,
            resolve: (conn) => conn.totalCount,
          },

          totalHT: {
            type: GraphQLFloat,
            resolve: (conn) => conn.totalHT,
          },
          totalVAT: {
            type: GraphQLFloat,
            resolve: (conn) => conn.totalVAT,
          },

          total: {
            type: GraphQLFloat,
            resolve: (conn) => conn.total,
          },

        }),
      });

      const {connection,} = {
        connection: {
          type: connectionType,
          args: connectionArgs,
          async resolve(obj) {
            const companyId = obj.get('company').id;

            const id = obj.id;
            const settings = obj.get('settings');
            const periodStart = obj.get('periodStart');
            const periodEnd = obj.get('periodEnd');

            const { sales, totalHT, totalVAT, } = await _getCompanyVATDeclarationSales({id: companyId}, {id, periodStart, periodEnd, settings,});

            const edges = sales.map((value, index) => ({
              cursor: offsetToCursor(index),
              node: value,
            }));

            return {
              totalCount: sales.length,
              pageInfo: {
                hasPreviousPage: false,
                hasNextPage: false,
              },
              edges,
              totalHT, totalVAT, total: totalHT + totalVAT,
            };
          },
        },
        edgeType,
      };

      return connection;
    }(),
    _expenses: function(){
      const {connectionType, edgeType} = connectionDefinitions({
        name: '_CompanyVATDeclarationExpenses',
        nodeType: operationType,
        connectionFields: () => ({
          totalCount: {
            type: GraphQLInt,
            resolve: (conn) => conn.totalCount,
          },

          totalHT: {
            type: GraphQLFloat,
            resolve: (conn) => conn.totalHT,
          },
          totalVAT: {
            type: GraphQLFloat,
            resolve: (conn) => conn.totalVAT,
          },

          total: {
            type: GraphQLFloat,
            resolve: (conn) => conn.total,
          },

        }),
      });

      const {connection,} = {
        connection: {
          type: connectionType,
          args: connectionArgs,
          async resolve(obj) {
            const companyId = obj.get('company').id;

            const id = obj.id;
            const settings = obj.get('settings');
            const periodStart = obj.get('periodStart');
            const periodEnd = obj.get('periodEnd');

            const { expenses, totalHT, totalVAT, } = await _getCompanyVATDeclarationExpenses({id: companyId}, {id, periodStart, periodEnd, settings,});

            const edges = expenses.map((value, index) => ({
              cursor: offsetToCursor(index),
              node: value,
            }));

            return {
              totalCount: expenses.length,
              pageInfo: {
                hasPreviousPage: false,
                hasNextPage: false,
              },
              edges,
              totalHT, totalVAT, total: totalHT + totalVAT,
            };
          },
        },
        edgeType,
      };

      return connection;
    }(),

    // sales: function(){
    //   const {connectionType, edgeType} = connectionDefinitions({
    //     name: 'CompanyVATDeclarationSales',
    //     nodeType: saleOpInterfaceType,
    //     connectionFields: () => ({
    //       totalCount: {
    //         type: GraphQLInt,
    //         resolve: (conn) => conn.totalCount,
    //       },
    //
    //       totalHT: {
    //         type: GraphQLFloat,
    //         resolve: (conn) => conn.totalHT,
    //       },
    //       totalVAT: {
    //         type: GraphQLFloat,
    //         resolve: (conn) => conn.totalVAT,
    //       },
    //
    //       total: {
    //         type: GraphQLFloat,
    //         resolve: (conn) => conn.total,
    //       },
    //
    //     }),
    //   });
    //
    //   const {connection,} = {
    //     connection: {
    //       type: connectionType,
    //       args: connectionArgs,
    //       async resolve(obj) {
    //         const companyId = obj.get('company').id;
    //
    //         const id = obj.id;
    //         const settings = obj.get('settings');
    //         const periodStart = obj.get('periodStart');
    //         const periodEnd = obj.get('periodEnd');
    //
    //         const { sales, totalHT, totalVAT, } = await getCompanyVATDeclarationSales({id: companyId}, {id, periodStart, periodEnd, settings,});
    //
    //         const edges = sales.map((value, index) => ({
    //           cursor: offsetToCursor(index),
    //           node: value,
    //         }));
    //
    //         return {
    //           totalCount: sales.length,
    //           pageInfo: {
    //             hasPreviousPage: false,
    //             hasNextPage: false,
    //           },
    //           edges,
    //           totalHT, totalVAT, total: totalHT + totalVAT,
    //         };
    //       },
    //     },
    //     edgeType,
    //   };
    //
    //   return connection;
    // }(),
    // expenses: function(){
    //   const {connectionType, edgeType} = connectionDefinitions({
    //     name: 'CompanyVATDeclarationExpenses',
    //     nodeType: expenseOpInterfaceType,
    //     connectionFields: () => ({
    //       totalCount: {
    //         type: GraphQLInt,
    //         resolve: (conn) => conn.totalCount,
    //       },
    //
    //       totalHT: {
    //         type: GraphQLFloat,
    //         resolve: (conn) => conn.totalHT,
    //       },
    //       totalVAT: {
    //         type: GraphQLFloat,
    //         resolve: (conn) => conn.totalVAT,
    //       },
    //
    //       total: {
    //         type: GraphQLFloat,
    //         resolve: (conn) => conn.total,
    //       },
    //
    //     }),
    //   });
    //
    //   const {connection,} = {
    //     connection: {
    //       type: connectionType,
    //       args: connectionArgs,
    //       async resolve(obj) {
    //         const companyId = obj.get('company').id;
    //
    //         const id = obj.id;
    //         const settings = obj.get('settings');
    //         const periodStart = obj.get('periodStart');
    //         const periodEnd = obj.get('periodEnd');
    //
    //         const { expenses, totalHT, totalVAT, } = await getCompanyVATDeclarationExpenses({id: companyId}, {id, periodStart, periodEnd, settings,});
    //
    //         const edges = expenses.map((value, index) => ({
    //           cursor: offsetToCursor(index),
    //           node: value,
    //         }));
    //
    //         return {
    //           totalCount: expenses.length,
    //           pageInfo: {
    //             hasPreviousPage: false,
    //             hasNextPage: false,
    //           },
    //           edges,
    //           totalHT, totalVAT, total: totalHT + totalVAT,
    //         };
    //       },
    //     },
    //     edgeType,
    //   };
    //
    //   return connection;
    // }(),
    createdAt: createdField(),
    updatedAt: editedField(),
    objectId: objectIdField(),
    className: classNameField(),
    user: {
      type: userType,
      description: 'The user who created this object.',
      resolve: obj => obj.has('user') ? getUser(obj.get('user').id) : null,
    },
  }),
});

module.exports.VATDeclarationType = VATDeclarationType;

const fileType = new GraphQLObjectType({
  name: 'File',
  fields: () => ({
    id: globalIdField('File', object => [object.id, object.get('company').id].join(':')),
    name: {
      type: new GraphQLNonNull(GraphQLString),
      resolve: (obj) => obj.get('name'),
    },
    contentType: {
      type: new GraphQLNonNull(GraphQLString),
      resolve: (obj) => obj.get('contentType'),
    },
    url: {
      type: new GraphQLNonNull(GraphQLString),
      resolve: (obj) => obj.get('file').url(),
    },
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
  isTypeOf: (obj) => isType(obj, 'File'),
});

module.exports.fileType = fileType;

const imageField = (type) => ({
  type: fileType,
  resolve: obj => getObjectFile(obj, type),
});

const filesField = (type) => ({
  type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(fileType))),
  resolve: obj => getObjectFiles(obj, type),
});

/**
 * Define your own types here
 */
const userType = new GraphQLObjectType({
  name: 'User',
  description: 'A person who uses our app',
  fields: () => ({
    id: globalIdField('User'),
    avatar: imageField('Avatar'),
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
    getVATDeclaration: {
      type: VATDeclarationType,
      args: {
        companyId: {
          type: new GraphQLNonNull(GraphQLID),
        },
        id: {
          type: new GraphQLNonNull(GraphQLString),
        },
      },
      resolve: (obj, { companyId, id, }) => {
        const { id: localCompanyId, } = fromGlobalId(companyId);
        return getVATDeclarationById({ id: localCompanyId, }, id);
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
        return getObjectByType(People, { companyId: localCompanyId, id, });
      },
    },
    getCustomers: {
      type: new GraphQLObjectType({
        name: 'CompanyCustomersQuery',
        fields: ({
          sales: CompanyCustomersSalesQueryConnection,
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
        return getObjectByType(People, { companyId: localCompanyId, id, });
      },
    },
    getVendors: {
      type: new GraphQLObjectType({
        name: 'CompanyVendorsQuery',
        fields: ({
          expenses: CompanyVendorsExpensesQueryConnection,
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

module.exports.userType = userType;

const transactionType = new GraphQLObjectType({
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
    files: filesField('Transaction'),
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

module.exports.transactionType = transactionType;

const operationType = new GraphQLObjectType({
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

    operationType: {
      type: new GraphQLNonNull(GraphQLString),
      resolve: (operation) => operation.get('transactionType'),
    },

    saleItem: {
      type: productItemType,
      resolve: (operation) => {
        const transactionType = operation.get('transactionType');
        switch (transactionType){
          case 'Invoice': return operation.get('invoiceItem');
          case 'Sale': return operation.get('saleItem');
        }

        return null;
      },
    },
    expenseItem: {
      type: accountItemType,
      resolve: (operation) => {
        const transactionType = operation.get('transactionType');
        switch (transactionType){
          case 'Bill': return operation.get('billItem');
          case 'Expense': return operation.get('expenseItem');
        }

        return null;
      },
    },

    sale: {
      type: saleOpInterfaceType,
      resolve: (operation) => {
        const transactionType = operation.get('transactionType');
        switch (transactionType){
          case 'Invoice': return operation.get('invoice');
          case 'Sale': return operation.get('sale');
          case 'PaymentOfInvoices': return operation.get('paymentOfInvoices');
        }

        return null;
      },
    },
    expense: {
      type: expenseOpInterfaceType,
      resolve: (operation) => {
        const transactionType = operation.get('transactionType');
        switch (transactionType){
          case 'Bill': return operation.get('bill');
          case 'Expense': return operation.get('expense');
          case 'PaymentOfBills': return operation.get('paymentOfBills');
        }

        return null;
      },
    },

    amount: {
      type: new GraphQLNonNull(GraphQLFloat),
      resolve: (operation) => operation.get('amount'),
    },

    VAT: {
      type: new GraphQLNonNull(GraphQLFloat),
      resolve: (operation) => operation.has('VAT') ? operation.get('VAT') : 0.0,
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
    files: filesField('Operation'),
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

module.exports.operationType = operationType;

const accountType = new GraphQLObjectType({
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

module.exports.accountType = accountType;

const chartAccountType = new GraphQLObjectType({
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

module.exports.chartAccountType = chartAccountType;

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

const companyType = new GraphQLObjectType({
  name: 'Company',
  description: 'A company',
  fields: () => ({
    id: globalIdField('Company'),
    VATSettings: {
      type: new GraphQLNonNull(companyVATSettingsType),
      resolve: (company) => ({
        enabled: company.has('VATEnabled') ? company.get('VATEnabled') : false,
        startDate: company.get('VATSetting_startDate'),
        agency: company.get('VATSetting_agency'),
        IF: company.get('VATSetting_IF'),
        frequency: company.has('VATSetting_frequency') ? company.get('VATSetting_frequency') : null,
        regime: company.has('VATSetting_regime') ? parseInt(company.get('VATSetting_regime')) : null,
        percentages: company.get('VATSetting_percentages') || [],
      }),
    },
    VATDeclaration: {
      type: VATDeclarationType,
      resolve: (company) => getCompanyCurrentVATDeclaration(company),
    },
    VATDeclarationHistory: function () {
      const {connectionType, edgeType} = connectionDefinitions({
        name: 'VATDeclarationHistory',
        nodeType: VATDeclarationType,
        connectionFields: () => ({
          totalCount: {
            type: new GraphQLNonNull(GraphQLInt),
            resolve: (conn) => conn.totalCount,
          },
        }),
      });

      const {connection,} = {
        connection: {
          type: connectionType,
          args: {
            ...connectionArgs,
          },
          async resolve(obj) {
            const array = await getCompanyVATDeclarationHistory(obj);
            return {
              totalCount: array.length,
              ...connectionFromArray(array, {first: array.length,}),
            };
          },
        },
        edgeType,
      };

      return connection;
    }(),
    logo: imageField('Logo'),
    ...[
        'capital',
        'activity',
        'webSite',
        'tel',
        'fax',
        'email',
        'ice',
        'if',
        'rc',
        'patente',
        'cnss',
        'banque',
        'rib',
        'company_streetAddress',
        'company_cityTown',
        'company_stateProvince',
        'company_postalCode',
        'company_country',
    ].reduce(function (fields, prop) {
      return {
        ...fields,
        [prop]: {
          type: GraphQLString,
          resolve: (company) => company.get(prop)
        }
      };
    }, {}),
    address: function(){

      function getAddress({
        company_streetAddress,
        company_cityTown,
        company_stateProvince,
        company_postalCode,
        company_country,
      }){
        const addr = formatAddress({
          address: company_streetAddress,
          city: company_cityTown,
          subdivision: company_stateProvince,
          postalCode: company_postalCode,
          country: company_country,
        });

        return addr.length === 0 ? undefined : [...addr].join('\n');
      }

      return {
        type: GraphQLString,
        resolve: (company) => getAddress(company.toJSON()),
      }
    }(),
    legalForm: {
      type: legalFormType,
      resolve: (company) => company.has('legalForm') ? parseInt(company.get('legalForm')) : null,
    },
    periodType: {
      // type: new GraphQLNonNull(PeriodType),
      type: PeriodType,
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

    transactions: CompanyTransactionsConnection,
    accounts: CompanyAccountsConnection,
    bankAccounts: CompanyBankAccountsConnection,
    settings: {
      type: companySettingsType,
      resolve: (company) => ({
        periodType: company.get('periodType'),
        defaultVATInputType: company.has('settings_key_defaultVATInputType') ? company.get('settings_key_defaultVATInputType') : null,
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

                      const kind = next.get('kind');

                      if(kind === 'Invoice'){
                        return next.get('total') || 0.0;
                      }

                      if(kind === 'Sale'){
                        return next.get('total') || 0.0;
                      }

                      if(kind === 'PaymentOfInvoices'){
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

          return {
            open: resolveType('Open', invoiceType, function({id, }){
              return queryOpenInvoices({id}, {});
            }),
            overdue: resolveType('Overdue', invoiceType, function({id, }){
              return queryOverdueInvoices({id}, {});
            }),
            closed: resolveType('Closed', saleOrPaymentOfInvoicesBridgeType, function({id, }){
              return querySalesRecentlyPaid({id}, {}).then(results => {
                // return orderBy(
                //
                //   results,
                //
                //   [ 'date' ],
                //
                //   [ 'asc' ]
                // ).map((node) => ({ value: node, }));

                return results.map((node) => ({ value: node, }));
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

                    const kind = next.get('kind');

                    if(kind === 'Bill'){
                      return next.get('total') || 0.0;
                    }

                    if(kind === 'Expense'){
                      return next.get('total') || 0.0;
                    }

                    if(kind === 'PaymentOfBills'){
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

          return {
            open: resolveType('Open', billType, function({id, }){
              return queryOpenBills({id}, {});
            }),
            overdue: resolveType('Overdue', billType, function({id, }){
              return queryOverdueBills({id}, {});
            }),
            closed: resolveType('Closed', expenseOrPaymentOfBillsBridgeType, function({id, }){
              return queryExpensesRecentlyPaid({id}, {}).then(results => {
                // return orderBy(
                //
                //   results,
                //
                //   [ 'date' ],
                //
                //   [ 'asc' ]
                // ).map((node) => ({ value: node, }));

                return results.map((node) => ({ value: node, }));
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

module.exports.companyType = companyType;

const bankType = new GraphQLObjectType({
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

module.exports.bankType = bankType;

const vendorType = new GraphQLObjectType({
  name: 'Vendor',
  description: 'A Vendor',
  fields: () => ({
    id: globalIdField('Vendor', object => [object.id, object.get('company').id].join(':')),
    // company: {
    //   type: new GraphQLNonNull(parseObjectInputFieldType),
    //   resolve: (customer) => customer.get('company'),
    // },

    active: activityField(),

    displayName: {
      type: new GraphQLNonNull(GraphQLString),
      resolve: (vendor) => vendor.get('displayName'),
    },
    image: imageField('Vendor'),
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
    if: {
      type: GraphQLString,
      resolve: (vendor) => vendor.get('if'),
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
    // openBalance: {
    //   type: new GraphQLNonNull(GraphQLFloat),
    //   resolve: (vendor) => vendor.has('openBalance') ? vendor.get('openBalance') : 0.0,
    // },
    expenses: VendorExpensesConnection,
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
                const amount = array.reduce((sum, node) => sum + (function(){
                  const next = node.value || node;

                  if(typeof next.__type === 'undefined'){

                    const kind = next.get('kind');

                    if(kind === 'Bill'){
                      return next.get('total') || 0.0;
                    }

                    if(kind === 'Expense'){
                      return next.get('total') || 0.0;
                    }

                    if(kind === 'PaymentOfBills'){
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
  isTypeOf: (obj) => isType(obj, 'Vendor'),
});

module.exports.vendorType = vendorType;

const employeeType = new GraphQLObjectType({
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
    image: imageField('Employee'),
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
  isTypeOf: (obj) => isType(obj, 'Employee'),
});

module.exports.employeeType = employeeType;

const customerType = new GraphQLObjectType({
  name: 'Customer',
  description: 'A Customer',
  fields: () => ({
    id: globalIdField('Customer', object => [object.id, object.get('company').id].join(':')),
    // company: {
    //   type: new GraphQLNonNull(parseObjectInputFieldType),
    //   resolve: (customer) => customer.get('company'),
    // },

    active: activityField(),

    displayName: {
      type: new GraphQLNonNull(GraphQLString),
      resolve: (customer) => customer.get('displayName'),
    },
    image: imageField('Customer'),
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
    if: {
      type: GraphQLString,
      resolve: (customer) => customer.get('if'),
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
    // openBalance: {
    //   type: new GraphQLNonNull(GraphQLFloat),
    //   resolve: (customer) => customer.has('openBalance') ? customer.get('openBalance') : 0.0,
    // },
    sales: CustomerSalesConnection,

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

                    const kind = next.get('kind');

                    if(kind === 'Invoice'){
                      return next.get('total') || 0.0;
                    }

                    if(kind === 'Sale'){
                      return next.get('total') || 0.0;
                    }

                    if(kind === 'PaymentOfInvoices'){
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
  isTypeOf: (obj) => isType(obj, 'Customer'),
});

module.exports.customerType = customerType;

const saleOrPaymentOfInvoicesType = new GraphQLInterfaceType({
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
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(fileType))),
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

module.exports.saleOrPaymentOfInvoicesType = saleOrPaymentOfInvoicesType;

const saleType = new GraphQLObjectType({
  name: 'Sale',
  description: 'A Sale',
  fields: () => ({
    id: globalIdField('Sale', object => [object.id, object.get('company').id].join(':')),
    customer: {
      type: customerType,
      resolve: (sale) => sale.has('customer') ? sale.get('customer').fetch() : null,
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

    totalHT: {
      type: new GraphQLNonNull(GraphQLFloat),
      resolve: (operation) => operation.get('totalHT'),
    },
    VAT: {
      type: new GraphQLNonNull(GraphQLFloat),
      resolve: (operation) => operation.get('VAT'),
    },

    // VATSettings: {
    //   type: new GraphQLNonNull(companyVATSettingsType),
    //   resolve: (operation) => operation.has('VATDeclaration')
    //     ? operation.get('VATDeclaration').fetch().then(declaration => declaration.get('settings'))
    //     : { enabled: false, },
    // },
    // VATDeclaration: {
    //   type: VATDeclarationType,
    //   resolve: (operation) => operation.has('VATDeclaration')
    //     ? operation.get('VATDeclaration').fetch()
    //     : null,
    // },

    VATDeclaration: {
      type: VATDeclarationType,
      resolve: (operation) => getVATDeclarationAtDate(operation.get('company').id, operation.get('date')),
    },

    inputType: {
      type: new GraphQLNonNull(VATInputType),
      resolve: (operation) => operation.has('inputType')
        ? parseInt(operation.get('inputType'))
        : 3 /* NO_VAT */,
    },

    saleItemsConnection: function () {
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
    files: filesField('Sale'),
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
  interfaces: [ nodeInterface, saleOrPaymentOfInvoicesType, saleOpInterfaceType, ],
  isTypeOf: (obj) => isType(obj, 'Sale'),
});

module.exports.saleType = saleType;

const expenseType = new GraphQLObjectType({
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
          case 'Customer': return expense.has('customer') ? expense.get('customer').fetch() : undefined;

          case 2 /* 'Vendor' */:
          case 'Vendor':   return expense.has('vendor') ? expense.get('vendor').fetch() : undefined;

          case 3 /* 'Employee' */:
          case 'Employee':   return expense.has('employee') ? expense.get('employee').fetch() : undefined;
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

    totalHT: {
      type: new GraphQLNonNull(GraphQLFloat),
      resolve: (operation) => operation.get('totalHT'),
    },
    VAT: {
      type: new GraphQLNonNull(GraphQLFloat),
      resolve: (operation) => operation.get('VAT'),
    },

    // VATSettings: {
    //   type: new GraphQLNonNull(companyVATSettingsType),
    //   resolve: (operation) => operation.has('VATDeclaration')
    //     ? operation.get('VATDeclaration').fetch().then(declaration => declaration.get('settings'))
    //     : { enabled: false, },
    // },
    // VATDeclaration: {
    //   type: VATDeclarationType,
    //   resolve: (operation) => operation.has('VATDeclaration')
    //     ? operation.get('VATDeclaration').fetch()
    //     : null,
    // },

    VATDeclaration: {
      type: VATDeclarationType,
      resolve: (operation) => getVATDeclarationAtDate(operation.get('company').id, operation.get('date')),
    },

    inputType: {
      type: new GraphQLNonNull(VATInputType),
      resolve: (operation) => operation.has('inputType')
        ? parseInt(operation.get('inputType'))
        : 3 /* None */,
    },

    expenseItemsConnection: function () {
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
              amountPaid: obj.get('total'), // array.reduce((sum, item) => sum + item.get('amount'), 0.0),
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
    files: filesField('Expense'),
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
  interfaces: [ nodeInterface, expenseOrPaymentOfBillsType, expenseOpInterfaceType, ],
  isTypeOf: (obj) => isType(obj, 'Expense'),
});

module.exports.expenseType = expenseType;

const invoiceType = new GraphQLObjectType({
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
      resolve: (invoice) => invoice.has('customer') ? invoice.get('customer').fetch() : null,
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

    totalHT: {
      type: new GraphQLNonNull(GraphQLFloat),
      resolve: (operation) => operation.get('totalHT'),
    },
    VAT: {
      type: new GraphQLNonNull(GraphQLFloat),
      resolve: (operation) => operation.get('VAT'),
    },

    lastPaymentDate: {
      type: GraphQLDateTime,
      resolve: (operation) => operation.get('lastPaymentDate'),
    },

    // VATSettings: {
    //   type: new GraphQLNonNull(companyVATSettingsType),
    //   resolve: (operation) => operation.has('VATDeclaration')
    //     ? operation.get('VATDeclaration').fetch().then(declaration => declaration.get('settings'))
    //     : { enabled: false, },
    // },
    // VATDeclaration: {
    //   type: VATDeclarationType,
    //   resolve: (operation) => operation.has('VATDeclaration')
    //     ? operation.get('VATDeclaration').fetch()
    //     : null,
    // },

    VATDeclaration: {
      type: VATDeclarationType,
      resolve: (operation) => getVATDeclarationAtDate(operation.get('company').id, operation.get('date')),
    },

    inputType: {
      type: new GraphQLNonNull(VATInputType),
      resolve: (operation) => operation.has('inputType')
        ? parseInt(operation.get('inputType'))
        : 3 /* None */,
    },

    invoiceItemsConnection: function () {
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
    invoicePaymentsConnection: function () {
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
        const totalAmount = invoice.get('total');
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

        const hasPayment = totalAmount !== balanceDue;

        if(hasPayment){
          return 4; // 'Partial';
        }

        return 1; // 'Open';
      },
    },
    memo: {
      type: GraphQLString,
      resolve: (invoice) => invoice.get('memo'),
    },
    files: filesField('Invoice'),
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
  interfaces: [ nodeInterface, saleOpInterfaceType, ],
  isTypeOf: (obj) => isType(obj, 'Invoice'),
});

module.exports.invoiceType = invoiceType;

const paymentOfInvoicesItemType = new GraphQLObjectType({
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
      resolve: (item) => item.get('payment').fetch(),
    },
    invoice: {
      type: new GraphQLNonNull(invoiceType),
      resolve: (item) => item.get('invoice').fetch(),
    },
    createdAt: createdField(),
    objectId: objectIdField(),
    className: classNameField(),
  }),
  interfaces: [ nodeInterface ],
});

module.exports.paymentOfInvoicesItemType = paymentOfInvoicesItemType;

const paymentOfInvoicesType = new GraphQLObjectType({
  name: 'PaymentOfInvoices',
  description: 'A Payment of invoices',
  fields: () => ({
    id: globalIdField('PaymentOfInvoices', object => [object.id, object.get('company').id].join(':')),
    customer: {
      type: customerType,
      resolve: (payment) => payment.has('customer') ? payment.get('customer').fetch() : null,
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
    paymentItemsConnection: function () {
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
    files: filesField('PaymentOfInvoices'),
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
  interfaces: [ nodeInterface, saleOrPaymentOfInvoicesType, saleOpInterfaceType, ],
  isTypeOf: (obj) => isType(obj, 'PaymentOfInvoices'),
});

module.exports.paymentOfInvoicesType = paymentOfInvoicesType;

const billType = new GraphQLObjectType({
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
      resolve: (bill) => bill.has('payee') ? bill.get('payee').fetch() : null,
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

    totalHT: {
      type: new GraphQLNonNull(GraphQLFloat),
      resolve: (operation) => operation.get('totalHT'),
    },
    VAT: {
      type: new GraphQLNonNull(GraphQLFloat),
      resolve: (operation) => operation.get('VAT'),
    },

    lastPaymentDate: {
      type: GraphQLDateTime,
      resolve: (operation) => operation.get('lastPaymentDate'),
    },

    // VATSettings: {
    //   type: new GraphQLNonNull(companyVATSettingsType),
    //   resolve: (operation) => operation.has('VATDeclaration')
    //     ? operation.get('VATDeclaration').fetch().then(declaration => declaration.get('settings'))
    //     : { enabled: false, },
    // },
    // VATDeclaration: {
    //   type: VATDeclarationType,
    //   resolve: (operation) => operation.has('VATDeclaration')
    //     ? operation.get('VATDeclaration').fetch()
    //     : null,
    // },

    VATDeclaration: {
      type: VATDeclarationType,
      resolve: (operation) => getVATDeclarationAtDate(operation.get('company').id, operation.get('date')),
    },

    inputType: {
      type: new GraphQLNonNull(VATInputType),
      resolve: (operation) => operation.has('inputType')
        ? parseInt(operation.get('inputType'))
        : 3 /* None */,
    },

    billItemsConnection: function () {
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
    billPaymentsConnection: function () {
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
        const totalAmount = bill.get('total');
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

        const hasPayment = balanceDue !== totalAmount;

        if(hasPayment){
          return 4; // 'Partial';
        }

        return 1; // 'Open';
      },
    },
    memo: {
      type: GraphQLString,
      resolve: (bill) => bill.get('memo'),
    },
    files: filesField('Bill'),
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
  interfaces: [ nodeInterface, expenseOpInterfaceType, ],
  isTypeOf: (obj) => isType(obj, 'Bill'),
});

module.exports.billType = billType;

const paymentOfBillsItemType = new GraphQLObjectType({
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

module.exports.paymentOfBillsItemType = paymentOfBillsItemType;

const paymentOfBillsType = new GraphQLObjectType({
  name: 'PaymentOfBills',
  description: 'A Payment of bills',
  fields: () => ({
    id: globalIdField('PaymentOfBills', object => [object.id, object.get('company').id].join(':')),
    payee: {
      type: vendorType,
      resolve: (payment) => payment.has('payee') ? payment.get('payee').fetch() : null,
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
    paymentItemsConnection: function () {
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
    files: filesField('PaymentOfBills'),
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
  interfaces: [ nodeInterface, expenseOrPaymentOfBillsType, expenseOpInterfaceType, ],
  isTypeOf: (obj) => isType(obj, 'PaymentOfBills'),
});

module.exports.paymentOfBillsType = paymentOfBillsType;

const productType = new GraphQLObjectType({
  name: 'Product',
  fields: () => ({
    id: globalIdField('Product', object => [object.id, object.get('company').id].join(':')),
    type: {
      type: new GraphQLNonNull(productKind),
      resolve: (item) => parseInt(item.get('type')),
    },

    active: activityField(),

    displayName: {
      type: new GraphQLNonNull(GraphQLString),
      resolve: (item) => item.get('displayName'),
    },
    image: imageField('Item'),
    sku: {
      type: GraphQLString,
      resolve: (item) => item.get('sku'),
    },

    salesEnabled: {
      type: GraphQLBoolean,
      resolve: (item) => item.has('salesEnabled') ? item.get('salesEnabled') : true,
    },
    salesDesc: {
      type: GraphQLString,
      resolve: (item) => item.get('salesDesc'),
    },
    salesPrice: {
      type: GraphQLFloat,
      resolve: (item) => item.get('salesPrice'),
    },
    // salesPriceInputType: {
    //   type: VATInputType,
    //   resolve: (item) => item.has('salesPriceInputType') ? parseInt(item.get('salesPriceInputType')) : 1 /* HT */,
    // },
    salesVATPart: {
      type: VATPartType,
      resolve: (item) => item.has('salesVATPart') ? item.get('salesVATPart') : { inputType: 3 /* NO_VAT */, value: 0, },
    },
    incomeAccountCode: {
      type: GraphQLString,
      resolve: (item) => item.get('incomeAccountCode'),
    },

    purchaseEnabled: {
      type: GraphQLBoolean,
      resolve: (item) => item.has('purchaseEnabled') ? item.get('purchaseEnabled') : false,
    },
    purchaseDesc: {
      type: GraphQLString,
      resolve: (item) => item.get('purchaseDesc'),
    },
    cost: {
      type: GraphQLFloat,
      resolve: (item) => item.get('cost'),
    },
    // costInputType: {
    //   type: VATInputType,
    //   resolve: (item) => item.has('costInputType') ? parseInt(item.get('costInputType')) : 1 /* HT */,
    // },
    purchaseVATPart: {
      type: VATPartType,
      resolve: (item) => item.has('purchaseVATPart') ? item.get('purchaseVATPart') : { inputType: 3 /* NO_VAT */, value: 0, },
    },
    purchaseAccountCode: {
      type: GraphQLString,
      resolve: (item) => item.get('purchaseAccountCode'),
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

module.exports.productType = productType;

const expenseItemType = new GraphQLObjectType({
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
    VATPart: {
      type: new GraphQLNonNull(VATPartType),
      resolve: (item) => item.has('VATPart') ? function () {
        const { inputType, value, } = item.get('VATPart');
        return {
          inputType,
          value,
        };
      }() : {
        inputType: 3 /* NO_VAT */,
        value: 0,
      },
    },
    createdAt: createdField(),
    objectId: objectIdField(),
    className: classNameField(),
  }),
  interfaces: [ nodeInterface, accountItemType, ],
  isTypeOf: (obj) => isType(obj, 'ExpenseItem'),
});

module.exports.expenseItemType = expenseItemType;

const billItemType = new GraphQLObjectType({
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
    VATPart: {
      type: new GraphQLNonNull(VATPartType),
      resolve: (item) => item.has('VATPart') ? function () {
        const { inputType, value, } = item.get('VATPart');
        return {
          inputType,
          value,
        };
      }() : {
        inputType: 3 /* NO_VAT */,
        value: 0,
      },
    },
    createdAt: createdField(),
    objectId: objectIdField(),
    className: classNameField(),
  }),
  interfaces: [ nodeInterface, accountItemType, ],
  isTypeOf: (obj) => isType(obj, 'BillItem'),
});

module.exports.billItemType = billItemType;

const invoiceItemType = new GraphQLObjectType({
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
      resolve: (item) => item.has('item') ? item.get('item').fetch() : null,
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
      type: new GraphQLNonNull(discountPartType),
      resolve: (item) => item.get('discountPart'),
    },
    VATPart: {
      type: new GraphQLNonNull(VATPartType),
      resolve: (item) => item.has('VATPart') ? function () {
        const { inputType, value, } = item.get('VATPart');
        return {
          inputType,
          value,
        };
      }() : {
        inputType: 3 /* NO_VAT */,
        value: 0,
      },
    },
    createdAt: createdField(),
    objectId: objectIdField(),
    className: classNameField(),
  }),
  interfaces: [ nodeInterface, productItemType, ],
  isTypeOf: (obj) => isType(obj, 'InvoiceItem'),
});

module.exports.invoiceItemType = invoiceItemType;

const saleItemType = new GraphQLObjectType({
  name: 'SaleItem',
  description: 'A Sale Item',
  fields: () => ({
    id: globalIdField('SaleItem', object => [object.id, object.get('company').id].join(':')),
    index: {
      type: new GraphQLNonNull(GraphQLInt),
      resolve: (item) => item.get('index'),
    },
    item: {
      type: productType,
      resolve: (item) => item.has('item') ? item.get('item').fetch() : null,
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
      type: new GraphQLNonNull(discountPartType),
      resolve: (item) => item.get('discountPart'),
    },
    VATPart: {
      type: new GraphQLNonNull(VATPartType),
      resolve: (item) => item.has('VATPart') ? function () {
        const { inputType, value, } = item.get('VATPart');
        return {
          inputType,
          value,
        };
      }() : {
        inputType: 3 /* NO_VAT */,
        value: 0,
      },
    },
    createdAt: createdField(),
    objectId: objectIdField(),
    className: classNameField(),
  }),
  interfaces: [ nodeInterface, productItemType, ],
  isTypeOf: (obj) => isType(obj, 'SaleItem'),
});

module.exports.saleItemType = saleItemType;

const {connection: CompanyBankAccountsConnection} = connectionDefinition(
  'CompanyBankAccounts',
  bankType,
  () => {
    return getBankAccounts();
  }
);
module.exports.CompanyBankAccountsConnection = CompanyBankAccountsConnection;

const {connection: AccountOperationConnection} = connectionDefinition(
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
module.exports.AccountOperationConnection = AccountOperationConnection;

const {connection: TransactionOperationConnection} = connectionDefinition(
  'TransactionOperations',
  operationType,
  (transaction) => {
    return getTransactionOperations({ companyId: transaction.get('company').id, id: transaction.id, });
  }
);
module.exports.TransactionOperationConnection = TransactionOperationConnection;

const {connection: CompanyTransactionsConnection} = connectionDefinition(
  'CompanyTransactions',
  transactionType,
  (company) => getTransactions(company)
);
module.exports.CompanyTransactionsConnection = CompanyTransactionsConnection;

const {connection: CompanyAccountsConnection} = connectionDefinition(
  'CompanyAccounts',
  accountType,
  (company) => getCompanyAccounts(company)
);
module.exports.CompanyAccountsConnection = CompanyAccountsConnection;

const {connection: UserCompaniesConnection, edgeType: UserCompaniesEdge} = connectionDefinition(
  'UserCompanies',
  companyType,
  (user, info) => getCompanies()
);
module.exports.UserCompaniesConnection = UserCompaniesConnection;
module.exports.UserCompaniesEdge = UserCompaniesEdge;

const {connection: CompanySalesConnection, edgeType: CompanySalesEdge} = function() {
  const {connectionType, edgeType} = connectionDefinitions({
    name: 'CompanySales',
    nodeType: saleOpInterfaceType,
    connectionFields: () => ({
      totalCount: {
        type: GraphQLInt,
        resolve: (conn) => conn.totalCount,
      },

      invoicesSumOfTotals: {
        type: GraphQLFloat,
        resolve: (conn) => conn.invoicesSumOfTotals,
      },
      invoicesSumOfBalances: {
        type: GraphQLFloat,
        resolve: (conn) => conn.invoicesSumOfBalances,
      },

      salesSumOfTotals: {
        type: GraphQLFloat,
        resolve: (conn) => conn.salesSumOfTotals,
      },
      salesSumOfBalances: {
        type: GraphQLFloat,
        resolve: (conn) => conn.salesSumOfBalances,
      },

      paymentsSumOfTotals: {
        type: GraphQLFloat,
        resolve: (conn) => conn.paymentsSumOfTotals,
      },
      paymentsSumOfCredits: {
        type: GraphQLFloat,
        resolve: (conn) => conn.paymentsSumOfCredits,
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
        const {
          count: totalCount,

          invoicesSumOfTotals = 0.0,
          invoicesSumOfBalances = 0.0,

          salesSumOfTotals = 0.0,
          salesSumOfBalances = 0.0,

          paymentsSumOfTotals = 0.0,
          paymentsSumOfCredits = 0.0,

          results: sales,
        } = await ops__querySales(obj, { offset, limit, type, status, from, to, sortKey, sortDir, customer, });

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
          totalCount,

          invoicesSumOfTotals,
          invoicesSumOfBalances,

          salesSumOfTotals,
          salesSumOfBalances,

          paymentsSumOfTotals,
          paymentsSumOfCredits,
        };
      },
    },
    edgeType,
  };
}();
module.exports.CompanySalesConnection = CompanySalesConnection;
module.exports.CompanySalesEdge = CompanySalesEdge;

const { connection: CompanyExpensesConnection, edgeType: CompanyExpensesEdge, } = function() {
  const {connectionType, edgeType} = connectionDefinitions({
    name: 'CompanyExpenses',
    nodeType: expenseOpInterfaceType,
    connectionFields: () => ({
      totalCount: {
        type: GraphQLInt,
        resolve: (conn) => conn.totalCount,
      },

      billsSumOfTotals: {
        type: GraphQLFloat,
        resolve: (conn) => conn.billsSumOfTotals,
      },
      billsSumOfBalances: {
        type: GraphQLFloat,
        resolve: (conn) => conn.billsSumOfBalances,
      },

      expensesSumOfTotals: {
        type: GraphQLFloat,
        resolve: (conn) => conn.expensesSumOfTotals,
      },
      expensesSumOfBalances: {
        type: GraphQLFloat,
        resolve: (conn) => conn.expensesSumOfBalances,
      },

      paymentsSumOfTotals: {
        type: GraphQLFloat,
        resolve: (conn) => conn.paymentsSumOfTotals,
      },
      paymentsSumOfCredits: {
        type: GraphQLFloat,
        resolve: (conn) => conn.paymentsSumOfCredits,
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
      async resolve(obj, { offset, limit, type, status, from, to, sortKey = 'date', sortDir = -1, customer, payee, }) {
        const {
          count: totalCount,

          billsSumOfTotals = 0.0,
          billsSumOfBalances = 0.0,

          expensesSumOfTotals = 0.0,
          expensesSumOfBalances = 0.0,

          paymentsSumOfTotals = 0.0,
          paymentsSumOfCredits = 0.0,

          results: expenses,
        } = await ops__queryExpenses(obj, { offset, limit, type, status, from, to, sortKey, sortDir, customer, payee, });

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
          totalCount,

          billsSumOfTotals,
          billsSumOfBalances,

          expensesSumOfTotals,
          expensesSumOfBalances,

          paymentsSumOfTotals,
          paymentsSumOfCredits,

        };
      },
    },
    edgeType,
  };
}();
module.exports.CompanyExpensesConnection = CompanyExpensesConnection;
module.exports.CompanyExpensesEdge = CompanyExpensesEdge;

const { connection: CompanyCustomersSalesQueryConnection, edgeType: CompanyCustomersSalesQueryEdge, } = function() {
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
        const { count: totalCount, results, } = await ops__customersQuerySales(obj, { offset, limit, type, from, to, sortKey, sortDir, });
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
module.exports.CompanyCustomersSalesQueryConnection = CompanyCustomersSalesQueryConnection;
module.exports.CompanyCustomersSalesQueryEdge = CompanyCustomersSalesQueryEdge;

const { connection: CompanyVendorsExpensesQueryConnection, edgeType: CompanyVendorsExpensesQueryEdge, } = function() {
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
        const { count: totalCount, results, } = await ops__vendorsQueryExpenses(obj, { offset, limit, type, from, to, sortKey, sortDir, });
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
module.exports.CompanyVendorsExpensesQueryConnection = CompanyVendorsExpensesQueryConnection;
module.exports.CompanyVendorsExpensesQueryEdge = CompanyVendorsExpensesQueryEdge;

const {connection: CompanyEmployeesConnection, edgeType: CompanyEmployeesEdge} = connectionDefinition(
  'CompanyEmployees',
  employeeType,
  (company, info) => getCompanyEmployees(company)
);
module.exports.CompanyEmployeesConnection = CompanyEmployeesConnection;
module.exports.CompanyEmployeesEdge = CompanyEmployeesEdge;

const {connection: CompanyCustomersConnection, edgeType: CompanyCustomersEdge} = connectionDefinition(
  'CompanyCustomers',
  customerType,
  (company, info) => getCompanyCustomers(company)
);
module.exports.CompanyCustomersConnection = CompanyCustomersConnection;
module.exports.CompanyCustomersEdge = CompanyCustomersEdge;

const {connection: CompanyVendorsConnection, edgeType: CompanyVendorsEdge} = connectionDefinition(
  'CompanyVendors',
  vendorType,
  (company, info) => getCompanyVendors(company)
);
module.exports.CompanyVendorsConnection = CompanyVendorsConnection;
module.exports.CompanyVendorsEdge = CompanyVendorsEdge;


const {connection: CompanyProductsConnection, edgeType: CompanyProductsEdge} = connectionDefinition(
  'CompanyProducts',
  productType,
  (company, info) => getCompanyProducts(company)
);

module.exports.CompanyProductsConnection = CompanyProductsConnection;
module.exports.CompanyProductsEdge = CompanyProductsEdge;

const { connection: VendorExpensesConnection, edgeType: VendorExpensesEdge, } = function() {
  const {connectionType, edgeType} = connectionDefinitions({
    name: 'VendorExpenses',
    nodeType: expenseOpInterfaceType,
    connectionFields: () => ({
      totalCount: {
        type: GraphQLInt,
        resolve: (conn) => conn.totalCount,
      },

      billsSumOfTotals: {
        type: GraphQLFloat,
        resolve: (conn) => conn.billsSumOfTotals,
      },
      billsSumOfBalances: {
        type: GraphQLFloat,
        resolve: (conn) => conn.billsSumOfBalances,
      },

      expensesSumOfTotals: {
        type: GraphQLFloat,
        resolve: (conn) => conn.expensesSumOfTotals,
      },
      expensesSumOfBalances: {
        type: GraphQLFloat,
        resolve: (conn) => conn.expensesSumOfBalances,
      },

      paymentsSumOfTotals: {
        type: GraphQLFloat,
        resolve: (conn) => conn.paymentsSumOfTotals,
      },
      paymentsSumOfCredits: {
        type: GraphQLFloat,
        resolve: (conn) => conn.paymentsSumOfCredits,
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
        const {
          count: totalCount,

          billsSumOfTotals = 0.0,
          billsSumOfBalances = 0.0,

          expensesSumOfTotals = 0.0,
          expensesSumOfBalances = 0.0,

          paymentsSumOfTotals = 0.0,
          paymentsSumOfCredits = 0.0,

          results: expenses,
        } = await ops__queryExpenses({ id: obj.get('company').id, }, { offset, limit, type, status, from, to, sortKey, sortDir, payee: obj.id, }, false);

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
          totalCount,

          billsSumOfTotals,
          billsSumOfBalances,

          expensesSumOfTotals,
          expensesSumOfBalances,

          paymentsSumOfTotals,
          paymentsSumOfCredits,

        };
      },
    },
    edgeType,
  };
}();

module.exports.VendorExpensesConnection = VendorExpensesConnection;
module.exports.VendorExpensesEdge = VendorExpensesEdge;

const { connection: CustomerSalesConnection, edgeType: CustomerSalesEdge, } = function() {
  const {connectionType, edgeType} = connectionDefinitions({
    name: 'CustomerSales',
    nodeType: saleOpInterfaceType,
    connectionFields: () => ({
      totalCount: {
        type: GraphQLInt,
        resolve: (conn) => conn.totalCount,
      },

      invoicesSumOfTotals: {
        type: GraphQLFloat,
        resolve: (conn) => conn.invoicesSumOfTotals,
      },
      invoicesSumOfBalances: {
        type: GraphQLFloat,
        resolve: (conn) => conn.invoicesSumOfBalances,
      },

      salesSumOfTotals: {
        type: GraphQLFloat,
        resolve: (conn) => conn.salesSumOfTotals,
      },
      salesSumOfBalances: {
        type: GraphQLFloat,
        resolve: (conn) => conn.salesSumOfBalances,
      },

      paymentsSumOfTotals: {
        type: GraphQLFloat,
        resolve: (conn) => conn.paymentsSumOfTotals,
      },
      paymentsSumOfCredits: {
        type: GraphQLFloat,
        resolve: (conn) => conn.paymentsSumOfCredits,
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
        const {
          count: totalCount,

          invoicesSumOfTotals = 0.0,
          invoicesSumOfBalances = 0.0,

          salesSumOfTotals = 0.0,
          salesSumOfBalances = 0.0,

          paymentsSumOfTotals = 0.0,
          paymentsSumOfCredits = 0.0,

          results: sales,
        } = await ops__querySales({ id: obj.get('company').id, }, { offset, limit, type, status, from, to, sortKey, sortDir, customer: obj.id, }, false);

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
          totalCount,
          invoicesSumOfTotals,
          invoicesSumOfBalances,

          salesSumOfTotals,
          salesSumOfBalances,

          paymentsSumOfTotals,
          paymentsSumOfCredits,

        };
      },
    },
    edgeType,
  };
}();

module.exports.CustomerSalesConnection = CustomerSalesConnection;
module.exports.CustomerSalesEdge = CustomerSalesEdge;
