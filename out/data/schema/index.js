'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Schema = undefined;

var _graphql = require('graphql');

var _graphqlRelay = require('graphql-relay');

var _graphqlCustomTypes = require('graphql-custom-types');

var _connections = require('./connections');

var _loaders = require('../database/loaders');

var _Company = require('../database/Company');

var _Company2 = _interopRequireDefault(_Company);

var _lodash = require('lodash.findindex');

var _lodash2 = _interopRequireDefault(_lodash);

var _auth = require('../auth');

var _parse = require('parse');

var _parse2 = _interopRequireDefault(_parse);

var _index = require('../database/index');

var _commonFields = require('./commonFields');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          *  Copyright (c) 2015, Epsilon, SARL.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          *  All rights reserved.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          *
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          *  This source code is licensed under the BSD-style license found in the
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          *  LICENSE file in the root directory of this source tree. An additional grant
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          *  of patent rights can be found in the PATENTS file in the same directory.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          */

/**
 * We get the node interface and field from the Relay library.
 *
 * The first method defines the way we resolve an ID to its object.
 * The second defines the way we resolve an object to its GraphQL type.
 */

var _nodeDefinitions = (0, _graphqlRelay.nodeDefinitions)(function (globalId) {
  var _fromGlobalId3 = (0, _graphqlRelay.fromGlobalId)(globalId);

  var type = _fromGlobalId3.type;
  var id = _fromGlobalId3.id;

  switch (type) {
    case 'Company':
      return (0, _index.getCompany)(id);
    case 'User':
      return (0, _index.getUser)(id);
    case 'Transaction':
      return (0, _index.getTransaction)(id);
    case 'Operation':
      return (0, _index.getOperation)(id);
    case 'Account':
      return (0, _index.getAccount)(id);
  }
}, function (obj) {

  if (obj instanceof _index.User) {
    return userType;
  }

  switch (obj.__type) {
    case 'Company':
      return companyType;
    case 'Transaction':
      return transactionType;
    case 'Operation':
      return operationType;
    case 'Account':
      return accountType;
  }
});

var nodeInterface = _nodeDefinitions.nodeInterface;
var nodeField = _nodeDefinitions.nodeField;

/**
 * Define your own types here
 */

var userType = new _graphql.GraphQLObjectType({
  name: 'User',
  description: 'A person who uses our app',
  fields: function fields() {
    return {
      id: (0, _graphqlRelay.globalIdField)('User'),
      displayName: {
        type: _graphql.GraphQLString,
        resolve: function resolve(user) {
          return user.get('displayName');
        }
      },
      email: {
        type: _graphql.GraphQLString,
        resolve: function resolve(user) {
          return user.get('email');
        }
      },
      username: {
        type: _graphql.GraphQLString,
        resolve: function resolve(user) {
          return user.get('username');
        }
      },
      sessionToken: {
        type: _graphql.GraphQLString,
        resolve: function resolve(user) {
          return user.get('sessionToken');
        }
      },
      companies: UserCompaniesConnection,
      createdAt: (0, _commonFields.createdField)(),
      updatedAt: (0, _commonFields.editedField)()
    };
  },
  interfaces: [nodeInterface]
});

var transactionType = new _graphql.GraphQLObjectType({
  name: 'Transaction',
  description: 'A group of operations between a client and a vendor',
  fields: function fields() {
    return {
      id: (0, _graphqlRelay.globalIdField)('Transaction', function (object) {
        return [object.id, object.get('company').id].join(':');
      }),
      operations: TransactionOperationConnection,
      transactionNr: {
        type: new _graphql.GraphQLNonNull(_graphql.GraphQLInt),
        resolve: function resolve(transaction) {
          return transaction.get('transactionNr');
        }
      },
      // TODO: add total debit, total debit, etc
      date: {
        type: new _graphql.GraphQLNonNull(_graphql.GraphQLString),
        description: 'The date of this transaction.',
        resolve: function resolve(transaction) {
          return transaction.get('date');
        }
      },
      memo: {
        type: _graphql.GraphQLString,
        description: 'The memo of this transaction.',
        resolve: function resolve(transaction) {
          return transaction.get('memo');
        }
      },
      period: {
        type: new _graphql.GraphQLNonNull(_graphql.GraphQLString),
        description: 'The period of this transaction.',
        resolve: function resolve(transaction) {
          return transaction.get('period');
        }
      },
      periodType: {
        type: new _graphql.GraphQLNonNull(PeriodType),
        description: 'The type of period when this transaction happened.',
        resolve: function resolve(transaction) {
          return transaction.get('periodType');
        }
      },
      files: {
        type: new _graphql.GraphQLNonNull(new _graphql.GraphQLList(new _graphql.GraphQLNonNull(_graphqlCustomTypes.GraphQLURL))),
        description: 'The files of transaction.',
        resolve: function resolve(transaction) {
          return transaction.get('files');
        }
      },
      createdAt: (0, _commonFields.createdField)(),
      updatedAt: (0, _commonFields.editedField)(),
      user: {
        type: userType,
        description: 'The user who created this object.',
        resolve: function resolve(transaction) {
          return transaction.has('user') ? (0, _index.getUser)(transaction.get('user').id) : null;
        }
      }
    };
  },
  interfaces: [nodeInterface]
});

var OperationKind = new _graphql.GraphQLEnumType({
  name: 'OperationKind',
  values: {
    DEBIT: { value: 'DEBIT' },
    CREDIT: { value: 'CREDIT' }
  }
});

var operationType = new _graphql.GraphQLObjectType({
  name: 'Operation',
  description: 'A debit or credit operation in a Transaction',
  fields: function fields() {
    return {
      id: (0, _graphqlRelay.globalIdField)('Operation', function (object) {
        return [object.id, object.get('company').id].join(':');
      }),
      index: {
        type: new _graphql.GraphQLNonNull(_graphql.GraphQLString),
        resolve: function resolve(operation) {
          return operation.get('index');
        }
      },
      accountCode: {
        type: new _graphql.GraphQLNonNull(_graphql.GraphQLString),
        resolve: function resolve(operation) {
          return operation.get('accountCode');
        }
      },
      type: {
        type: new _graphql.GraphQLNonNull(OperationKind),
        resolve: function resolve(operation) {
          return operation.get('type');
        }
      },
      amount: {
        type: new _graphql.GraphQLNonNull(_graphql.GraphQLFloat),
        resolve: function resolve(operation) {
          return operation.get('amount');
        }
      },
      transaction: {
        type: transactionType,
        resolve: function resolve(operation) {
          return operation.get('transaction').fetch();
        }
      },
      date: {
        type: new _graphql.GraphQLNonNull(_graphql.GraphQLString),
        description: 'The date of this operation.',
        resolve: function resolve(operation) {
          return operation.get('date');
        }
      },
      description: {
        type: _graphql.GraphQLString,
        description: 'The description of this operation.',
        resolve: function resolve(operation) {
          return operation.get('description');
        }
      },
      period: {
        type: new _graphql.GraphQLNonNull(_graphql.GraphQLString),
        description: 'The period of this operation.',
        resolve: function resolve(operation) {
          return operation.get('period');
        }
      },
      periodType: {
        type: new _graphql.GraphQLNonNull(PeriodType),
        description: 'The type of period when this operation happened.',
        resolve: function resolve(operation) {
          return operation.get('periodType');
        }
      },
      createdAt: (0, _commonFields.createdField)(),
      updatedAt: (0, _commonFields.editedField)(),
      user: {
        type: userType,
        description: 'The user who created this object.',
        resolve: function resolve(operation) {
          return operation.has('user') ? (0, _index.getUser)(operation.get('user').id) : null;
        }
      }
    };
  },
  interfaces: [nodeInterface]
});

var accountType = new _graphql.GraphQLObjectType({
  name: 'Account',
  description: 'An account',
  fields: function fields() {
    return {
      id: (0, _graphqlRelay.globalIdField)('Account', function (object) {
        return [object.id, object.get('company').id, object.period].join(':');
      }),
      code: {
        type: new _graphql.GraphQLNonNull(_graphql.GraphQLString),
        resolve: function resolve(account) {
          return account.get('code');
        }
      },
      name: {
        type: new _graphql.GraphQLNonNull(_graphql.GraphQLString),
        resolve: function resolve(account) {
          return account.get('name');
        }
      },
      // TODO: add class, category, group, parent, etc
      operations: AccountOperationConnection,
      // TODO: add total debit, total debit, etc
      period: {
        type: new _graphql.GraphQLNonNull(_graphql.GraphQLString),
        description: 'The period of this account.',
        resolve: function resolve(account) {
          return account.get('period');
        }
      },
      periodType: {
        type: new _graphql.GraphQLNonNull(PeriodType),
        description: 'The type of period for this account.',
        resolve: function resolve(account) {
          return account.get('periodType');
        }
      }
    };
  },
  interfaces: [nodeInterface]
});

var chartAccountType = new _graphql.GraphQLObjectType({
  name: 'ChartAccount',
  description: 'A chart account',
  fields: function fields() {
    return {
      id: (0, _graphqlRelay.globalIdField)('ChartAccount', function (_ref) {
        var code = _ref.code;
        return code;
      }),
      code: {
        type: new _graphql.GraphQLNonNull(_graphql.GraphQLString)
      },
      name: {
        type: new _graphql.GraphQLNonNull(_graphql.GraphQLString)
      },
      _classCode: {
        type: new _graphql.GraphQLNonNull(_graphql.GraphQLString)
      },
      _categoryCode: {
        type: new _graphql.GraphQLNonNull(_graphql.GraphQLString)
      },
      _groupCode: {
        type: new _graphql.GraphQLNonNull(_graphql.GraphQLString)
      },
      _parentCode: {
        type: _graphql.GraphQLString
      }
    };
  },
  interfaces: [nodeInterface]
});

var PeriodType = new _graphql.GraphQLEnumType({
  name: 'PeriodType',
  values: {
    MONTHLY: { value: 'MONTHLY' },
    TRIMESTERLY: { value: 'TRIMESTERLY' }
  }
});

var companyType = new _graphql.GraphQLObjectType({
  name: 'Company',
  description: 'A company',
  fields: function fields() {
    return {
      id: (0, _graphqlRelay.globalIdField)('Company'),
      periodType: {
        type: new _graphql.GraphQLNonNull(PeriodType),
        description: 'The type of period, immutable!',
        resolve: function resolve(company) {
          return company.get('periodType');
        }
      },
      displayName: {
        type: new _graphql.GraphQLNonNull(_graphql.GraphQLString),
        resolve: function resolve(company) {
          return company.get('displayName');
        }
      },
      lastSeqNr: {
        type: new _graphql.GraphQLNonNull(_graphql.GraphQLInt),
        resolve: function resolve(company) {
          return _loaders.parseSeqLoader.load(company.id);
        }
      },
      transactions: CompanyTransactionsConnection,
      accounts: CompanyAccountsConnection,
      createdAt: (0, _commonFields.createdField)(),
      updatedAt: (0, _commonFields.editedField)(),
      user: {
        type: userType,
        description: 'The user who created this object.',
        resolve: function resolve(company) {
          return company.has('user') ? (0, _index.getUser)(company.get('user').id) : null;
        }
      }
    };
  },
  interfaces: [nodeInterface]
});

/**
 * This is the type that will be the root of our query,
 * and the entry point into our schema.
 */
var queryType = new _graphql.GraphQLObjectType({
  name: 'Query',
  fields: function fields() {
    return {
      node: nodeField,
      id: {
        type: new _graphql.GraphQLNonNull(_graphql.GraphQLString),
        resolve: function resolve() {
          return 'ROOT';
        }
      },
      root: {
        type: new _graphql.GraphQLNonNull(queryType),
        resolve: function resolve() {
          return {};
        }
      },
      viewer: {
        type: userType,
        resolve: function resolve() {
          return (0, _index.getViewer)();
        }
      },
      companies: {
        type: new _graphql.GraphQLList(companyType),
        resolve: function resolve() {
          return (0, _index.getCompanies)();
        }
      },
      company: {
        type: new _graphql.GraphQLNonNull(companyType),
        args: {
          id: {
            type: new _graphql.GraphQLNonNull(_graphql.GraphQLID)
          }
        },
        resolve: function resolve(_, _ref2) {
          var globalId = _ref2.id;

          var _fromGlobalId = (0, _graphqlRelay.fromGlobalId)(globalId);

          var id = _fromGlobalId.id;

          return (0, _index.getCompany)(id);
        }
      },
      accounts: {
        type: new _graphql.GraphQLList(chartAccountType),
        args: {},
        resolve: function resolve() {
          var _this = this;

          return _asyncToGenerator(regeneratorRuntime.mark(function _callee() {
            return regeneratorRuntime.wrap(function _callee$(_context) {
              while (1) {
                switch (_context.prev = _context.next) {
                  case 0:
                    return _context.abrupt('return', (0, _index.getChartAccountList)());

                  case 1:
                  case 'end':
                    return _context.stop();
                }
              }
            }, _callee, _this);
          }))();
        }
      }
    };
  }
});

var _connectionDefinition = (0, _connections.connectionDefinition)('AccountOperations', operationType, function (account) {
  var query = account.relation('operations').query();
  query.limit(1000);
  return new Promise(function (resolve, reject) {
    query.find().then(function (objects) {
      resolve(objects);
    }, function () {
      reject();
    });
  });
});

var AccountOperationConnection = _connectionDefinition.connection;

var _connectionDefinition2 = (0, _connections.connectionDefinition)('TransactionOperations', operationType, function (transaction) {
  var query = transaction.relation('operations').query();
  query.limit(1000);
  return new Promise(function (resolve, reject) {
    query.find().then(function (objects) {
      resolve(objects);
    }, function () {
      reject();
    });
  });
});

var TransactionOperationConnection = _connectionDefinition2.connection;

var _connectionDefinition3 = (0, _connections.connectionDefinition0)('CompanyTransactions', transactionType, function (company, period, info) {
  return (0, _index.getTransactions)(company, period);
});

var CompanyTransactionsConnection = _connectionDefinition3.connection;

var _connectionDefinition4 = (0, _connections.connectionDefinition0)('CompanyAccounts', accountType, function (company, period, info) {
  return (0, _index.getCompanyAccounts)(company, period);
});

var CompanyAccountsConnection = _connectionDefinition4.connection;

var _connectionDefinition5 = (0, _connections.connectionDefinition)('UserCompanies', companyType, function (user, info) {
  return (0, _index.getCompanies)();
});

var UserCompaniesConnection = _connectionDefinition5.connection;
var UserCompaniesEdge = _connectionDefinition5.edgeType;

var GraphQLAddCompanyMutation = (0, _graphqlRelay.mutationWithClientMutationId)({
  name: 'AddCompany',
  inputFields: {
    sessionToken: { type: new _graphql.GraphQLNonNull(_graphql.GraphQLString) },
    id: { type: _graphql.GraphQLID },
    displayName: { type: new _graphql.GraphQLNonNull(_graphql.GraphQLString) },
    periodType: { type: new _graphql.GraphQLNonNull(PeriodType) }
  },
  outputFields: {
    companyEdge: {
      type: UserCompaniesEdge,
      resolve: function resolve(_ref3) {
        var _this2 = this;

        var id = _ref3.id;
        return _asyncToGenerator(regeneratorRuntime.mark(function _callee2() {
          var company, offset;
          return regeneratorRuntime.wrap(function _callee2$(_context2) {
            while (1) {
              switch (_context2.prev = _context2.next) {
                case 0:
                  _context2.next = 2;
                  return (0, _index.getCompany)(id);

                case 2:
                  company = _context2.sent;
                  _context2.next = 5;
                  return (0, _index.getCompanies)();

                case 5:
                  _context2.t0 = _context2.sent;

                  _context2.t1 = function (_ref4) {
                    var id = _ref4.id;
                    return id === company.id;
                  };

                  offset = (0, _lodash2.default)(_context2.t0, _context2.t1);
                  return _context2.abrupt('return', {
                    cursor: (0, _graphqlRelay.offsetToCursor)(offset),
                    node: company
                  });

                case 9:
                case 'end':
                  return _context2.stop();
              }
            }
          }, _callee2, _this2);
        }))();
      }
    },
    root: {
      type: queryType,
      resolve: function resolve() {
        return {};
      }
    }
  },
  mutateAndGetPayload: function mutateAndGetPayload(_ref5) {
    var _this3 = this;

    var id = _ref5.id;
    var displayName = _ref5.displayName;
    var periodType = _ref5.periodType;
    var sessionToken = _ref5.sessionToken;
    return _asyncToGenerator(regeneratorRuntime.mark(function _callee3() {
      var _ref6, addedCompanyId;

      return regeneratorRuntime.wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              _context3.next = 2;
              return _parse2.default.Cloud.run('addCompany', { id: id, displayName: displayName, periodType: periodType }, { sessionToken: sessionToken });

            case 2:
              _ref6 = _context3.sent;
              addedCompanyId = _ref6.addedCompanyId;

              process.nextTick(function () {
                _loaders.parseTableLoader.clear(_Company2.default);
                _loaders.parseIDLoader.clear([_Company2.default, addedCompanyId]);
                _loaders.parseSeqLoader.clear(addedCompanyId);
              });

              return _context3.abrupt('return', { id: addedCompanyId });

            case 6:
            case 'end':
              return _context3.stop();
          }
        }
      }, _callee3, _this3);
    }))();
  }
});

var GraphQLRemoveCompanyMutation = (0, _graphqlRelay.mutationWithClientMutationId)({
  name: 'RemoveCompany',
  inputFields: {
    sessionToken: { type: new _graphql.GraphQLNonNull(_graphql.GraphQLString) },
    id: { type: new _graphql.GraphQLNonNull(_graphql.GraphQLID) }
  },
  outputFields: {
    deletedCompanyId: {
      type: _graphql.GraphQLID,
      resolve: function resolve(_ref7) {
        var id = _ref7.id;
        return id;
      }
    },
    viewer: {
      type: userType,
      resolve: function resolve() {
        return (0, _index.getViewer)();
      }
    }
  },
  mutateAndGetPayload: function mutateAndGetPayload(_ref8) {
    var _this4 = this;

    var id = _ref8.id;
    var sessionToken = _ref8.sessionToken;
    return _asyncToGenerator(regeneratorRuntime.mark(function _callee4() {
      var _fromGlobalId2, localTodoId, _ref9, deletedCompanyId;

      return regeneratorRuntime.wrap(function _callee4$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              _fromGlobalId2 = (0, _graphqlRelay.fromGlobalId)(id);
              localTodoId = _fromGlobalId2.id;
              _context4.next = 4;
              return _parse2.default.Cloud.run('delCompany', { id: localTodoId }, { sessionToken: sessionToken });

            case 4:
              _ref9 = _context4.sent;
              deletedCompanyId = _ref9.deletedCompanyId;

              process.nextTick(function () {
                _loaders.parseTableLoader.clear(_Company2.default);
                _loaders.parseIDLoader.clear([_Company2.default, deletedCompanyId]);
              });

              return _context4.abrupt('return', { id: deletedCompanyId });

            case 8:
            case 'end':
              return _context4.stop();
          }
        }
      }, _callee4, _this4);
    }))();
  }
});

var GraphQLLogInMutation = (0, _graphqlRelay.mutationWithClientMutationId)({
  name: 'LogIn',
  inputFields: {
    email: { type: new _graphql.GraphQLNonNull(_graphql.GraphQLString) },
    password: { type: _graphql.GraphQLString }
  },
  outputFields: {
    viewer: {
      type: userType,
      resolve: function resolve(_ref10) {
        var user = _ref10.user;

        return user;
      }
    }
  },
  mutateAndGetPayload: function mutateAndGetPayload(_ref11) {
    var _this5 = this;

    var email = _ref11.email;
    var password = _ref11.password;
    return _asyncToGenerator(regeneratorRuntime.mark(function _callee5() {
      var user;
      return regeneratorRuntime.wrap(function _callee5$(_context5) {
        while (1) {
          switch (_context5.prev = _context5.next) {
            case 0:
              _context5.next = 2;
              return (0, _auth.logIn)(email, password);

            case 2:
              user = _context5.sent;

              process.nextTick(function () {
                _loaders.parseIDLoader.clear([_index.User, user.id]);
              });

              return _context5.abrupt('return', { user: user });

            case 5:
            case 'end':
              return _context5.stop();
          }
        }
      }, _callee5, _this5);
    }))();
  }
});

var GraphQLLogOutMutation = (0, _graphqlRelay.mutationWithClientMutationId)({
  name: 'LogOut',
  inputFields: {
    viewerId: { type: new _graphql.GraphQLNonNull(_graphql.GraphQLID) }
  },
  outputFields: {
    viewer: {
      type: userType,
      resolve: function resolve() {
        return null;
      }
    }
  },
  mutateAndGetPayload: function mutateAndGetPayload(_ref12) {
    var _this6 = this;

    var viewerId = _ref12.viewerId;
    return _asyncToGenerator(regeneratorRuntime.mark(function _callee6() {
      return regeneratorRuntime.wrap(function _callee6$(_context6) {
        while (1) {
          switch (_context6.prev = _context6.next) {
            case 0:
              _context6.next = 2;
              return (0, _auth.logOut)();

            case 2:

              process.nextTick(function () {
                _loaders.parseIDLoader.clear([_index.User, viewerId]);
              });

            case 3:
            case 'end':
              return _context6.stop();
          }
        }
      }, _callee6, _this6);
    }))();
  }
});

/**
 * This is the type that will be the root of our mutations,
 * and the entry point into performing writes in our schema.
 */
var mutationType = new _graphql.GraphQLObjectType({
  name: 'Mutation',
  fields: function fields() {
    return {
      // Add your own mutations here
      addCompany: GraphQLAddCompanyMutation,
      removeCompany: GraphQLRemoveCompanyMutation,

      logIn: GraphQLLogInMutation,
      logOut: GraphQLLogOutMutation
    };
  }
});

/**
 * Finally, we construct our schema (whose starting query type is the query
 * type we defined above) and export it.
 */
var Schema = exports.Schema = new _graphql.GraphQLSchema({
  query: queryType,
  mutation: mutationType
});