/**
 *  Copyright (c) 2015, Epsilon, SARL.
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree. An additional grant
 *  of patent rights can be found in the PATENTS file in the same directory.
 */

import {
  GraphQLBoolean,
  GraphQLFloat,
  GraphQLID,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString,
  GraphQLEnumType,
} from 'graphql';

import {
  connectionArgs,
  connectionDefinitions,
  connectionFromArray,
  fromGlobalId,
  globalIdField,
  mutationWithClientMutationId,
  nodeDefinitions,
} from 'graphql-relay';

import {
  User,
  Transaction,
  Operation,
  getUser,
  getTransaction,
  getOperation,
  getAccount,
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
var {nodeInterface, nodeField} = nodeDefinitions(
  (globalId) => {
    var {type, id} = fromGlobalId(globalId);
    if (type === 'User') {
      return getUser(id);
    } else if(type === 'Transaction'){
      return getTransaction(id);
    } else if(type === 'Operation'){
      return getOperation(id);
    } else if(type === 'Account'){
      return getAccount(id);
    } else {
      return null;
    }
  },
  (obj) => {
    if (obj instanceof User) {
      return userType;
    }else if (obj instanceof Transaction) {
      return transactionType;
    }else if (obj instanceof Operation) {
      return operationType;
    } else {
      return null;
    }
  }
);

/**
 * Define your own types here
 */

var userType = new GraphQLObjectType({
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
    createdAt: createdField(),
    updatedAt: editedField(),
    transactions: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(transactionType))),
      resolve: ({user}) => {throw new Error('NotImplemented')},
    },
  }),
  interfaces: [nodeInterface],
});

var transactionType = new GraphQLObjectType({
  name: 'Transaction',
  description: 'A group of operations between a client and a vendor',
  fields: () => ({
    id: globalIdField('Transaction'),
    operations: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(operationType))),
    },
    createdAt: createdField(),
    updatedAt: editedField(),
  }),
  interfaces: [nodeInterface],
});

var OperationKind = new GraphQLEnumType({
  name: 'OperationKind',
  values: {
    DEBIT: { value: 0 },
    CREDIT: { value: 1 },
  }
});

var operationType = new GraphQLObjectType({
  name: 'Operation',
  description: 'A debit or credit operation in a Transaction',
  fields: () => ({
    id: globalIdField('Operation'),
    account: {
      type: new GraphQLNonNull(accountType),
      resolve: (operation) => getAccount(operation.accountCode),
    },
    type: {
      type: new GraphQLNonNull(OperationKind),
    },
    amount: {
      type: new GraphQLNonNull(GraphQLFloat),
    },
    createdAt: createdField(),
    updatedAt: editedField(),
  }),
  interfaces: [nodeInterface],
});

var accountType = new GraphQLObjectType({
  name: 'Account',
  description: 'An account',
  fields: () => ({
    id: globalIdField('Account', obj => obj.code),
    code: {
      type: new GraphQLNonNull(GraphQLString),
    },
    class: {
      type: new GraphQLNonNull(NamedType),
    },
    category: {
      type: new GraphQLNonNull(NamedType),
    },
    group: {
      type: new GraphQLNonNull(NamedType),
    },
    hasParent: {
      type: new GraphQLNonNull(GraphQLBoolean),
    },
    parent: {
      type: accountType,
      resolve: (account) => account.hasParent ? getAccount(account.parentCode) : undefined,
    },
  }),
  interfaces: [nodeInterface],
});

var NamedType = new GraphQLObjectType({
  name: 'NamedType',
  fields: {
    name: { type: new GraphQLNonNull(GraphQLString) },
    code: { type: new GraphQLNonNull(GraphQLString) },
  }
});

/**
 * This is the type that will be the root of our query,
 * and the entry point into our schema.
 */
var queryType = new GraphQLObjectType({
  name: 'Query',
  fields: () => ({
    node: nodeField,
    viewer: {
      type: userType,
      resolve: ({user}) => getUser(user.id),
    },
  }),
});

/**
 * This is the type that will be the root of our mutations,
 * and the entry point into performing writes in our schema.
 */
var mutationType = new GraphQLObjectType({
  name: 'Mutation',
  fields: () => ({
    // Add your own mutations here
  })
});

/**
 * Finally, we construct our schema (whose starting query type is the query
 * type we defined above) and export it.
 */
export var Schema = new GraphQLSchema({
  query: queryType,
  // Uncomment the following after adding some mutation fields:
  // mutation: mutationType
});
