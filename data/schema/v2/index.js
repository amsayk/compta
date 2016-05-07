import {
  GraphQLSchema,
} from 'graphql';

import mutationType from '../mutations/v2/index';
import {queryType} from '../query';

export const Schema = new GraphQLSchema({
  query: queryType,
  mutation: mutationType
});
