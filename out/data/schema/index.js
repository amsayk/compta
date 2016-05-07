'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Schema = undefined;

var _graphql = require('graphql');

var _index = require('./mutations/index');

var _index2 = _interopRequireDefault(_index);

var _query = require('./query');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Schema = exports.Schema = new _graphql.GraphQLSchema({
  query: _query.queryType,
  mutation: _index2.default
});