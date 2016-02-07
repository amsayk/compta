'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.parseSeqLoader = exports.parseTableLoader = exports.parsePeriodLoader = exports.parseIDLoader = undefined;

var _parse = require('parse');

var _parse2 = _interopRequireDefault(_parse);

var _dataloader = require('dataloader');

var _dataloader2 = _interopRequireDefault(_dataloader);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var parseIDLoader = exports.parseIDLoader = fieldLoader('objectId', false, function (obj) {
  return obj.id;
});

var parsePeriodLoader = exports.parsePeriodLoader = fieldLoader('period', true, function (obj) {
  return obj.get('period');
});

// Perform only one load for several queries per type!
var parseTableLoader = exports.parseTableLoader = new _dataloader2.default(function (keys) {
  return new Promise(function (resolve) {

    function fetch(Type, cb) {

      if (process.env.NODE_ENV !== 'production') {
        console.log('DataLoader table query for type ' + Type);
      }

      var query = new _parse2.default.Query(Type);
      query.limit(1000);
      query.find().then(function (objects) {

        if (process.env.NODE_ENV !== 'production') {
          console.log('DataLoader table query for type ' + Type + ' found:', JSON.stringify(objects));
        }

        cb(null, objects);
      }, function (error) {
        cb(error);
      });
    }

    var types = {};
    keys.forEach(function (Type) {
      types[Type.className] = (types[Type.className] || 0) + 1;
    });

    var typesKeys = Object.keys(types);

    var remaining = typesKeys.length;
    var results = {};

    typesKeys.forEach(function (Type) {

      fetch(Type, function (err, objects) {
        results[Type] = err ? null : objects;

        if (--remaining === 0) {
          resolve(typesKeys.reduce(function (result, Type) {

            if (results[Type]) {
              for (var i = 0; i < types[Type]; i++) {
                result.push(results[Type]);
              }
            } else {

              for (var i = 0; i < types[Type]; i++) {
                result.push(new Error('Error fetching ' + Type.name));
              }
            }

            return result;
          }, []));
        }
      });
    });
  });
}, {
  cache: true,
  cacheKeyFn: function cacheKeyFn(_ref) {
    var className = _ref.className;
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

        var query = new _parse2.default.Query(Type);
        query.containedIn(field, keys);
        query.limit(1000);
        return query.find().then(function (objects) {

          if (process.env.NODE_ENV !== 'production') {
            console.log('DataLoader table query for type ' + Type + ' found:', JSON.stringify(objects));
          }

          cb(null, objects);
        }, function (error) {
          cb(error);
        });
      }

      var queries = {};
      keys.forEach(function (_ref2) {
        var _ref3 = _slicedToArray(_ref2, 2);

        var Type = _ref3[0];
        var key = _ref3[1];

        queries[Type.className] = (queries[Type.className] || []).concat([key]);
      });

      var queriesKeys = Object.keys(queries);

      var remaining = queriesKeys.length;
      var results = {};

      queriesKeys.forEach(function (Type) {
        var keys = queries[Type];

        fetch(Type, keys, function (err, objects) {
          results[Type] = err ? null : objects;

          if (--remaining === 0) {
            resolve(queriesKeys.reduce(function (result, Type) {

              if (results[Type]) {

                keys.forEach(function (key) {

                  if (isPlural) {
                    (function () {

                      var found = [];

                      results[Type].forEach(function (value) {

                        if (key === fieldGetter(value)) {
                          found.push(value);
                        }
                      });

                      result.push(found);
                    })();
                  } else {

                    var found = undefined;

                    results[Type].forEach(function (value) {

                      if (key === fieldGetter(value)) {
                        found = value;
                      }
                    });

                    if (found) {
                      result.push(found);
                    } else {
                      result.push(new Error('Error fetching ' + key));
                    }
                  }
                });
              } else {

                keys.forEach(function (key) {
                  result.push(isPlural ? [] : new Error('Error fetching ' + key));
                });
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
      var _ref5 = _slicedToArray(_ref4, 2);

      var Type = _ref5[0];
      var propertyValue = _ref5[1];
      return Type.className + ':' + propertyValue;
    }
  });
}

var parseSeqLoader = exports.parseSeqLoader = function () {

  var _seq = undefined,
      _promise = undefined;

  function getKey(key) {
    return function () {
      return _seq.get('sequence_' + key);
    };
  }

  function doLoad(key) {
    _promise = _parse2.default.Cloud.run('getCurrentSeq');

    return _promise.then(function (_ref6) {
      var result = _ref6.result;

      _seq = result;
      _promise = undefined;

      return _seq.get('sequence_' + key);
    });
  }

  return {
    load: function load(key) {
      if (_seq && _seq.has('sequence_' + key)) {
        return _parse2.default.Promise.as(_seq.get('sequence_' + key));
      }

      if (_promise) {
        return _promise.then(getKey(key));
      }

      return doLoad(key);
    },
    clear: function clear(key) {
      if (_seq) {
        _seq.unset('sequence_' + key);
      }
    },
    clearAll: function clearAll() {
      _seq = null;
    }
  };
}();