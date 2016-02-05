/**
 *  Copyright (c) 2015, Epsilon, SARL.
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree. An additional grant
 *  of patent rights can be found in the PATENTS file in the same directory.
 */

import {
  GraphQLList,
  GraphQLFloat,
  GraphQLID,
  GraphQLInt,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString,
  GraphQLEnumType,
} from 'graphql';

import {
  offsetToCursor,
  fromGlobalId,
  globalIdField,
  mutationWithClientMutationId,
  nodeDefinitions,
} from 'graphql-relay';

import {
  GraphQLEmail,
  GraphQLURL,
  GraphQLDateTime,
  GraphQLLimitedString,
  GraphQLPassword
} from 'graphql-custom-types';

import {
  connectionDefinition,
  connectionDefinition0,
} from './connections';

import {
  parseTableLoader,
  parseIDLoader,
  parseSeqLoader,
} from '../database/loaders';

import Company from '../database/Company';

import findIndex from 'lodash.findindex';

import { logIn, logOut, } from '../auth';

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

  getTransactions,
  getCompanyAccounts,
  getCompanies,
} from '../database/index';

import {
  createdField,
  editedField
} from './commonFields';

/**
 * We get the node interface and field from the Relay library.
 *
 * The first method defines the way we resolve an ID to its object.
 * The second defines the way we resolve an object to its GraphQL type.
 */
const {nodeInterface, nodeField} = nodeDefinitions(
  (globalId) => {
    const {type, id} = fromGlobalId(globalId);

    switch (type){
      case 'Company':     return getCompany(id);
      case 'User':        return getUser(id);
      case 'Transaction': return getTransaction(id);
      case 'Operation':   return getOperation(id);
      case 'Account':     return getAccount(id);
    }
  },
  (obj) => {

    if (obj instanceof User) {
      return userType;
    }

    switch (obj.__type){
      case 'Company':     return companyType;
      case 'Transaction': return transactionType;
      case 'Operation':   return operationType;
      case 'Account':     return accountType;
    }
  }
);

/**
 * Define your own types here
 */
const userType = new GraphQLObjectType({
  name: 'User',
  description: 'A person who uses our app',
  fields: () => ({
    id: globalIdField('User'),
    displayName: {
      type: GraphQLString,
      resolve: (user) => user.get('displayName'),
    },
    email: {
      type: GraphQLString,
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
    companies: UserCompaniesConnection,
    createdAt: createdField(),
    updatedAt: editedField(),
  }),
  interfaces: [nodeInterface],
});

const transactionType = new GraphQLObjectType({
  name: 'Transaction',
  description: 'A group of operations between a client and a vendor',
  fields: () => ({
    id: globalIdField('Transaction', object => [object.id, object.get('company').id].join(':')),
    operations: TransactionOperationConnection,
    transactionNr: {
      type: new GraphQLNonNull(GraphQLInt),
      resolve: (transaction) => transaction.get('transactionNr'),
    },
    // TODO: add total debit, total debit, etc
    date: {
      type: new GraphQLNonNull(GraphQLString),
      description: 'The date of this transaction.',
      resolve: (transaction) => transaction.get('date'),
    },
    memo: {
      type: GraphQLString,
      description: 'The memo of this transaction.',
      resolve: (transaction) => transaction.get('memo'),
    },
    period: {
      type: new GraphQLNonNull(GraphQLString),
      description: 'The period of this transaction.',
      resolve: (transaction) => transaction.get('period'),
    },
    periodType: {
      type: new GraphQLNonNull(PeriodType),
      description: 'The type of period when this transaction happened.',
      resolve: (transaction) => transaction.get('periodType'),
    },
    files: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(GraphQLURL))),
      description: 'The files of transaction.',
      resolve: (transaction) => transaction.get('files'),
    },
    createdAt: createdField(),
    updatedAt: editedField(),
    user: {
      type: userType,
      description: 'The user who created this object.',
      resolve: transaction => transaction.has('user') ? getUser(transaction.get('user').id) : null,
    },
  }),
  interfaces: [nodeInterface],
});

const OperationKind = new GraphQLEnumType({
  name: 'OperationKind',
  values: {
    DEBIT: {value: 'DEBIT'},
    CREDIT: {value: 'CREDIT'},
  }
});

const operationType = new GraphQLObjectType({
  name: 'Operation',
  description: 'A debit or credit operation in a Transaction',
  fields: () => ({
    id: globalIdField('Operation', object => [object.id, object.get('company').id].join(':')),
    index: {
      type: new GraphQLNonNull(GraphQLString),
      resolve: (operation) => operation.get('index'),
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
    transaction: {
      type: transactionType,
      resolve: (operation) => operation.get('transaction').fetch(),
    },
    date: {
      type: new GraphQLNonNull(GraphQLString),
      description: 'The date of this operation.',
      resolve: (operation) => operation.get('date'),
    },
    description: {
      type: GraphQLString,
      description: 'The description of this operation.',
      resolve: (operation) => operation.get('description'),
    },
    period: {
      type: new GraphQLNonNull(GraphQLString),
      description: 'The period of this operation.',
      resolve: (operation) => operation.get('period'),
    },
    periodType: {
      type: new GraphQLNonNull(PeriodType),
      description: 'The type of period when this operation happened.',
      resolve: (operation) => operation.get('periodType'),
    },
    createdAt: createdField(),
    updatedAt: editedField(),
    user: {
      type: userType,
      description: 'The user who created this object.',
      resolve: operation => operation.has('user') ? getUser(operation.get('user').id) : null,
    },
  }),
  interfaces: [nodeInterface],
});

const accountType = new GraphQLObjectType({
  name: 'Account',
  description: 'An account',
  fields: () => ({
    id: globalIdField('Account', object => [object.id, object.get('company').id, object.period].join(':')),
    code: {
      type: new GraphQLNonNull(GraphQLString),
      resolve: (account) => account.get('code'),
    },
    name: {
      type: new GraphQLNonNull(GraphQLString),
      resolve: (account) => account.get('name'),
    },
    // TODO: add class, category, group, parent, etc
    operations: AccountOperationConnection,
    // TODO: add total debit, total debit, etc
    period: {
      type: new GraphQLNonNull(GraphQLString),
      description: 'The period of this account.',
      resolve: (account) => account.get('period'),
    },
    periodType: {
      type: new GraphQLNonNull(PeriodType),
      description: 'The type of period for this account.',
      resolve: (account) => account.get('periodType'),
    },
  }),
  interfaces: [nodeInterface],
});

const chartAccountType = new GraphQLObjectType({
  name: 'ChartAccount',
  description: 'A chart account',
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
  interfaces: [nodeInterface],
});

const PeriodType = new GraphQLEnumType({
  name: 'PeriodType',
  values: {
    MONTHLY: {value: 'MONTHLY'},
    TRIMESTERLY: {value: 'TRIMESTERLY'},
  }
});

const companyType = new GraphQLObjectType({
  name: 'Company',
  description: 'A company',
  fields: () => ({
    id: globalIdField('Company'),
    periodType: {
      type: new GraphQLNonNull(PeriodType),
      description: 'The type of period, immutable!',
      resolve: (company) => company.get('periodType'),
    },
    displayName: {
      type: new GraphQLNonNull(GraphQLString),
      resolve: (company) => company.get('displayName'),
    },
    lastSeqNr: {
      type: new GraphQLNonNull(GraphQLInt),
      resolve: (company) => parseSeqLoader.load(company.id),
    },
    transactions: CompanyTransactionsConnection,
    accounts: CompanyAccountsConnection,
    createdAt: createdField(),
    updatedAt: editedField(),
    user: {
      type: userType,
      description: 'The user who created this object.',
      resolve: company => company.has('user') ? getUser(company.get('user').id) : null,
    },
  }),
  interfaces: [nodeInterface],
});

/**
 * This is the type that will be the root of our query,
 * and the entry point into our schema.
 */
const queryType = new GraphQLObjectType({
  name: 'Query',
  fields: () => ({
    node: nodeField,
    id: {
      type: new GraphQLNonNull(GraphQLString),
      resolve: () => 'ROOT',
    },
    root: {
      type: new GraphQLNonNull(queryType),
      resolve: () => ({})
    },
    viewer: {
      type: userType,
      resolve: () => getViewer(),
    },
    companies: {
      type: new GraphQLList(companyType),
      resolve: () => getCompanies(),
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
    accounts: {
      type: new GraphQLList(chartAccountType),
      args: {
      },
      async resolve() {
        return getChartAccountList();
      },
    },
  }),
});

const {connection: AccountOperationConnection} = connectionDefinition(
  'AccountOperations',
  operationType,
  (account) => {
    const query = account.relation('operations').query();
    query.limit(1000);
    return new Promise((resolve, reject) => {
      query.find().then(
        function (objects) {
          resolve(objects);
        },
        function () {
          reject()
        }
      );
    });
  }
);

const {connection: TransactionOperationConnection} = connectionDefinition(
  'TransactionOperations',
  operationType,
  (transaction) => {
    const query = transaction.relation('operations').query();
    query.limit(1000);
    return new Promise((resolve, reject) => {
      query.find().then(
        function (objects) {
          resolve(objects);
        },
        function () {
          reject()
        }
      );
    });
  }
);

const {connection: CompanyTransactionsConnection} = connectionDefinition0(
  'CompanyTransactions',
  transactionType,
  (company, period, info) => getTransactions(company, period)
);

const {connection: CompanyAccountsConnection} = connectionDefinition0(
  'CompanyAccounts',
  accountType,
  (company, period, info) => getCompanyAccounts(company, period)
);

const {connection: UserCompaniesConnection, edgeType: UserCompaniesEdge} = connectionDefinition(
  'UserCompanies',
  companyType,
  (user, info) => getCompanies()
);

const GraphQLAddCompanyMutation = mutationWithClientMutationId({
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
        const offset = findIndex(await getCompanies(), ({id}) => id === company.id);

        return {
          cursor: offsetToCursor(offset),
          node: company,
        };
      },
    },
    root: {
      type: queryType,
      resolve: () => ({}),
    },
  },
  async mutateAndGetPayload({ id, displayName, periodType, sessionToken, }) {
    const {addedCompanyId} = await Parse.Cloud.run('addCompany', {id, displayName, periodType,}, {sessionToken});

    process.nextTick(() => {
      parseTableLoader.clear(Company);
      parseIDLoader.clear([Company, addedCompanyId]);
      parseSeqLoader.clear(addedCompanyId);
    });

    return {id: addedCompanyId};
  },
});

const GraphQLRemoveCompanyMutation = mutationWithClientMutationId({
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
    const {id: localTodoId} = fromGlobalId(id);
    const {deletedCompanyId} = await Parse.Cloud.run('delCompany', {id: localTodoId,}, {sessionToken});

    process.nextTick(() => {
      parseTableLoader.clear(Company);
      parseIDLoader.clear([Company, deletedCompanyId]);
    });

    return {id: deletedCompanyId};
  },
});

const GraphQLLogInMutation = mutationWithClientMutationId({
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

    process.nextTick(() => {
      parseIDLoader.clear([User, user.id]);
    });

    return {user};
  },
});

const GraphQLLogOutMutation = mutationWithClientMutationId({
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

    process.nextTick(() => {
      parseIDLoader.clear([User, viewerId]);
    });
  },
});

/**
 * This is the type that will be the root of our mutations,
 * and the entry point into performing writes in our schema.
 */
const mutationType = new GraphQLObjectType({
  name: 'Mutation',
  fields: () => ({
    // Add your own mutations here
    addCompany: GraphQLAddCompanyMutation,
    removeCompany: GraphQLRemoveCompanyMutation,

    logIn: GraphQLLogInMutation,
    logOut: GraphQLLogOutMutation,
  })
});

/**
 * Finally, we construct our schema (whose starting query type is the query
 * type we defined above) and export it.
 */
export const Schema = new GraphQLSchema({
  query: queryType,
  mutation: mutationType
});
