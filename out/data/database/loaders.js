'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.parseSeqLoader = exports.parseTableCountLoader = exports.parseTableLoader = exports.parseIDLoader = undefined;

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _parse = require('parse');

var _parse2 = _interopRequireDefault(_parse);

var _dataloader = require('dataloader');

var _dataloader2 = _interopRequireDefault(_dataloader);

var _constants = require('../constants');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var parseIDLoader = exports.parseIDLoader = fieldLoader('objectId', false, function (obj) {
  return obj.id;
});

// Perform only one load for several queries per type!
var parseTableLoader = exports.parseTableLoader = new _dataloader2.default(function (keys) {
  return new Promise(function (resolve) {

    function fetch(Type, cb) {

      if (process.env.NODE_ENV !== 'production') {
        console.log('DataLoader table query for type ' + Type);
      }

      var query = new _parse2.default.Query(Queries[Type]);
      query.descending('updatedAt,createdAt');
      query.limit(_constants.DEFAULT_LIMIT);
      query.find().then(function (objects) {

        if (process.env.NODE_ENV !== 'production') {
          // console.log(`DataLoader table query for type ${Type} found:`, JSON.stringify(objects));
        }

        cb(null, objects);
      }, function (error) {
        cb(error);
      });
    }

    var types = {};
    var Queries = {};
    var typesKeys = [];
    var seen = {};
    keys.forEach(function (Type) {
      types[Type.className] = (types[Type.className] || 0) + 1;
      if (!seen[Type.className]) {
        typesKeys.push(Type.className);
        Queries[Type.className] = Type;
        seen[Type.className] = true;
      }
    });

    // const typesKeys = Object.keys(types);

    var remaining = typesKeys.length;
    var results = {};

    typesKeys.forEach(function (Type) {

      fetch(Type, function (err, objects) {
        results[Type] = err ? null : objects;

        if (--remaining === 0) {
          resolve(keys.reduce(function (result, _ref) {
            var Type = _ref.className;


            if (results[Type]) {
              // for (let i = 0, len = types[Type]; i < len; i++) {
              //   result.push(results[Type]);
              // }

              result.push(results[Type]);
            } else {

              // for (let i = 0, len = types[Type]; i < len; i++) {
              //   result.push(new Error(`Error fetching ${Type.name}`));
              // }

              result.push(new Error('Error fetching ' + Type.name));
            }

            return result;
          }, []));
        }
      });
    });
  });
}, {
  cache: true,
  cacheKeyFn: function cacheKeyFn(_ref2) {
    var className = _ref2.className;
    return className;
  }
});

// Perform only one load for several queries per type!
var parseTableCountLoader = exports.parseTableCountLoader = new _dataloader2.default(function (keys) {
  return new Promise(function (resolve) {

    function count(Type, cb) {

      if (process.env.NODE_ENV !== 'production') {
        console.log('DataLoader table count query for type ' + Type);
      }

      var query = new _parse2.default.Query(Queries[Type]);
      query.count().then(function (count) {

        if (process.env.NODE_ENV !== 'production') {
          // console.log(`DataLoader table query for type ${Type} found:`, JSON.stringify(objects));
        }

        cb(null, count);
      }, function (error) {
        cb(error);
      });
    }

    var types = {};
    var Queries = {};
    var typesKeys = [];
    var seen = {};
    keys.forEach(function (Type) {
      types[Type.className] = (types[Type.className] || 0) + 1;
      if (!seen[Type.className]) {
        typesKeys.push(Type.className);
        Queries[Type.className] = Type;
        seen[Type.className] = true;
      }
    });

    // const typesKeys = Object.keys(types);

    var remaining = typesKeys.length;
    var results = {};

    typesKeys.forEach(function (Type) {

      count(Type, function (err, count) {
        results[Type] = err ? null : count;

        if (--remaining === 0) {
          resolve(keys.reduce(function (result, _ref3) {
            var Type = _ref3.className;


            if (results[Type] !== null) {
              // for (let i = 0, len = types[Type]; i < len; i++) {
              //   result.push(results[Type]);
              // }

              result.push(results[Type]);
            } else {

              // for (let i = 0, len = types[Type]; i < len; i++) {
              //   result.push(new Error(`Error counting ${Type.name}`));
              // }

              result.push(new Error('Error counting ' + Type.name));
            }

            return result;
          }, []));
        }
      });
    });
  });
}, {
  cache: true,
  cacheKeyFn: function cacheKeyFn(_ref4) {
    var className = _ref4.className;
    return className;
  }
});

function fieldLoader(field, isPlural, fieldGetter) {
  return new _dataloader2.default(function (keys) {
    return new Promise(function (resolve) {

      function fetch(Type, keys, cb) {

        if (process.env.NODE_ENV !== 'production') {
          console.log('DataLoader table query for type ' + Type);
        }

        var query = new _parse2.default.Query(types[Type]);
        query.limit(keys.length);
        query.containedIn(field, keys);
        return query.find().then(function (objects) {

          if (process.env.NODE_ENV !== 'production') {
            // console.log(`DataLoader table query for type ${Type} found:`, JSON.stringify(objects));
          }

          cb(null, objects);
        }, function (error) {
          cb(error);
        });
      }

      var queries = {};
      var types = {};
      var queriesKeys = [];
      var seen = {};
      keys.forEach(function (_ref5) {
        var _ref6 = _slicedToArray(_ref5, 2);

        var Type = _ref6[0];
        var key = _ref6[1];

        queries[Type.className] = (queries[Type.className] || []).concat([key]);
        if (!seen[Type.className]) {
          queriesKeys.push(Type.className);
          types[Type.className] = Type;
          seen[Type.className] = true;
        }
      });

      // const queriesKeys = Object.keys(queries);

      var remaining = queriesKeys.length;
      var results = {};

      queriesKeys.forEach(function (Type) {
        var props = queries[Type];

        fetch(Type, props, function (err, objects) {
          results[Type] = err ? null : objects;

          if (--remaining === 0) {
            resolve(keys.reduce(function (result, _ref7) {
              var _ref8 = _slicedToArray(_ref7, 2);

              var Type = _ref8[0].className;
              var id = _ref8[1];


              if (results[Type]) {

                // props.forEach(function (key) {

                if (isPlural) {
                  (function () {

                    var found = [];

                    results[Type].forEach(function (value) {

                      if (id === fieldGetter(value)) {
                        found.push(value);
                      }
                    });

                    result.push(found);
                  })();
                } else {
                  (function () {

                    var found = undefined;

                    results[Type].forEach(function (value) {
                      if (found) {
                        return;
                      }

                      if (id === fieldGetter(value)) {
                        found = value;
                      }
                    });

                    if (found) {
                      result.push(found);
                    } else {
                      result.push(new Error(Type + ': Error fetching ' + id));
                    }
                  })();
                }

                // });
              } else {

                  // props.forEach(function (key) {
                  result.push(isPlural ? [] : new Error(Type + ': Error fetching ' + key));
                  // });
                }

              return result;
            }, []));
          }
        });
      });
    });
  }, {
    cache: true,
    cacheKeyFn: function cacheKeyFn(_ref9) {
      var _ref10 = _slicedToArray(_ref9, 2);

      var Type = _ref10[0];
      var propertyValue = _ref10[1];
      return Type.className + ':' + propertyValue;
    }
  });
}

var parseSeqLoader = exports.parseSeqLoader = function () {

  // const Seq = Parse.Object.extend('Seq');

  function getCurrentSeqObject() {
    // const query = new Parse.Query(Seq);
    // return query.get(process.env.SEQ_ID);

    return _parse2.default.Cloud.run('getCurrentSeq');
  }

  var _seq = void 0,
      _promise = void 0;

  function getKey(key) {
    return function () {
      return _seq.get(key);
    };
  }

  function doLoad(key) {
    _promise = getCurrentSeqObject();

    return _promise.then(function (_ref11) {
      var obj = _ref11.result;


      _seq = obj;
      _promise = undefined;

      return _seq.has(key) ? _seq.get(key) : function () {
        console.warn('Key is null `', key, '`');
        return 1000;
      }();
    });
  }

  return {
    load: function load(key) {

      if (_seq && _seq.has(key)) {
        return _parse2.default.Promise.as(_seq.get(key));
      }

      if (_promise) {
        return _promise.then(getKey(key));
      }

      return doLoad(key);
    },
    clear: function clear(key) {
      if (_seq) {
        _seq.unset(key);
      }
    },
    clearCompany: function clearCompany(id) {
      if (_seq) {
        // _seq.unset(`transaction_sequence_${id}`);
        // _seq.unset(`payments_transaction_sequence_${id}`);
        _seq = null;
      }
    },
    clearAll: function clearAll() {
      _seq = null;
    }
  };
}();