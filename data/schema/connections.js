/* @flow */
/**
 *  Copyright (c) 2015, Epsilon, SARL.
 *  All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE-examples file in the root directory of this source tree.
 */

const {
  connectionFromArray,
  connectionArgs,
  connectionDefinitions,
} = require('graphql-relay');

const {
  GraphQLInt,
  GraphQLList,
  GraphQLString,
  GraphQLNonNull,
} = require('graphql');

import type {
  GraphQLOutputType,
  GraphQLFieldConfig
} from 'graphql';

type DataFetcherType = (obj: any) => Promise<any>;

/**
 * Constructs a GraphQL connection field config; it is assumed
 * that the object has a property named `prop`, and that property
 * contains a list of URLs.
 */
module.exports.connectionDefinition = function connectionDefinition(
  name: string,
  type: GraphQLOutputType,
  dataFetcher?: ?DataFetcherType
): GraphQLFieldConfig {
  const {connectionType, edgeType} = connectionDefinitions({
    name: name,
    nodeType: type,
    connectionFields: () => ({
      totalCount: {
        type: GraphQLInt,
        resolve: (conn) => conn.totalCount,
        description:
          `A count of the total number of objects in this connection, ignoring pagination.
This allows a client to fetch the first five objects by passing "5" as the
argument to "first", then fetch the total count so it could display "5 of 83",
for example.`
      },

    })
  });
  return {
    connection: {
      type: connectionType,
      args: connectionArgs,
      async resolve(obj, args, info) {
        const array = await dataFetcher(obj, info);
        return {
          ...connectionFromArray(array, args),
          totalCount: array.length
        };
      },
    },
    edgeType,
  };
}
