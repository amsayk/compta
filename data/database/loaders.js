const Parse = require('parse');
const DataLoader = require('dataloader');

const { DEFAULT_LIMIT, } = require('../constants');

module.exports.parseIDLoader = fieldLoader('objectId', false, (obj) => obj.id);

// Perform only one load for several queries per type!
module.exports.parseTableLoader = new DataLoader(keys => new Promise((resolve) => {

  function fetch(Type, cb) {

    if (process.env.NODE_ENV !== 'production') {
      console.log(`DataLoader table query for type ${Type}`);
    }

    const query = new Parse.Query(Queries[Type]);
    query.notEqualTo('deleted', true);
    query.descending('updatedAt,createdAt');
    query.limit(DEFAULT_LIMIT);
    query.find().then(
      function (objects) {

        if (process.env.NODE_ENV !== 'production') {
          // console.log(`DataLoader table query for type ${Type} found:`, JSON.stringify(objects));
        }

        cb(null, objects);
      },
      function (error) {
        cb(error);
      }
    );
  }

  const types = {};
  const Queries = {};
  const typesKeys = [];
  const seen = {};
  keys.forEach(function (Type) {
    types[Type.className] = (types[Type.className] || 0) + 1;
    if(!seen[Type.className]){
      typesKeys.push(Type.className);
      Queries[Type.className] = Type;
      seen[Type.className] = true;
    }
  });

  // const typesKeys = Object.keys(types);

  let remaining = typesKeys.length;
  const results = {};

  typesKeys.forEach(function (Type) {

    fetch(Type, function (err, objects) {
      results[Type] = err ? null : objects;

      if (--remaining === 0) {
        resolve(keys.reduce(function (result, { className: Type, }) {

          if (results[Type]) {
            // for (let i = 0, len = types[Type]; i < len; i++) {
            //   result.push(results[Type]);
            // }

            result.push(results[Type]);

          } else {

            // for (let i = 0, len = types[Type]; i < len; i++) {
            //   result.push(new Error(`Error fetching ${Type.name}`));
            // }

            result.push(new Error(`parseTableLoader: Error fetching ${Type.name}`));
          }

          return result;
        }, []));
      }
    });
  });

}), {
  cache: true,
  cacheKeyFn: ({className}) => className,
});

// Perform only one load for several queries per type!
module.exports.parseTableCountLoader = new DataLoader(keys => new Promise((resolve) => {

  function count(Type, cb) {

    if (process.env.NODE_ENV !== 'production') {
      console.log(`DataLoader table count query for type ${Type}`);
    }

    const query = new Parse.Query(Queries[Type]);
    query.count().then(
      function (count) {

        if (process.env.NODE_ENV !== 'production') {
          // console.log(`DataLoader table query for type ${Type} found:`, JSON.stringify(objects));
        }

        cb(null, count);
      },
      function (error) {
        cb(error);
      }
    );
  }

  const types = {};
  const Queries = {};
  const typesKeys = [];
  const seen = {};
  keys.forEach(function (Type) {
    types[Type.className] = (types[Type.className] || 0) + 1;
    if(!seen[Type.className]){
      typesKeys.push(Type.className);
      Queries[Type.className] = Type;
      seen[Type.className] = true;
    }
  });

  // const typesKeys = Object.keys(types);

  let remaining = typesKeys.length;
  const results = {};

  typesKeys.forEach(function (Type) {

    count(Type, function (err, count) {
      results[Type] = err ? null : count;

      if (--remaining === 0) {
        resolve(keys.reduce(function (result, { className: Type, }) {

          if (results[Type] !== null) {
            // for (let i = 0, len = types[Type]; i < len; i++) {
            //   result.push(results[Type]);
            // }

            result.push(results[Type]);

          } else {

            // for (let i = 0, len = types[Type]; i < len; i++) {
            //   result.push(new Error(`Error counting ${Type.name}`));
            // }

            result.push(new Error(`parseTableCountLoader: Error counting ${Type.name}`));
          }

          return result;
        }, []));
      }
    });
  });

}), {
  cache: true,
  cacheKeyFn: ({className}) => className,
});

function fieldLoader(field, isPlural, fieldGetter) {
  return new DataLoader(keys => new Promise((resolve) => {

    function fetch(Type, keys, cb) {

      if (process.env.NODE_ENV !== 'production') {
        console.log(`DataLoader table query for type ${Type}`);
      }

      const query = new Parse.Query(types[Type]);
      query.limit(keys.length);
      query.containedIn(field, keys);
      return query.find().then(
        function (objects) {

          if (process.env.NODE_ENV !== 'production') {
            // console.log(`DataLoader table query for type ${Type} found:`, JSON.stringify(objects));
          }

          cb(null, objects);
        },
        function (error) {
          cb(error);
        }
      );
    }

    const queries = {};
    const types = {};
    const queriesKeys = [];
    const seen = {};
    keys.forEach(function ([Type, key]) {
      queries[Type.className] = (queries[Type.className] || []).concat([key]);
      if(!seen[Type.className]){
        queriesKeys.push(Type.className);
        types[Type.className] = Type;
        seen[Type.className] = true;
      }
    });

    // const queriesKeys = Object.keys(queries);

    let remaining = queriesKeys.length;
    const results = {};

    queriesKeys.forEach(function (Type) {
      const props = queries[Type];

      fetch(Type, props, function (err, objects) {
        results[Type] = err ? null : objects;

        if (--remaining === 0) {
          resolve(keys.reduce((result, [ { className: Type, }, id ]) => {

            if (results[Type]) {

              // props.forEach(function (key) {

                if (isPlural) {

                  let found = [];

                  results[Type].forEach(function (value) {

                    if (id === fieldGetter(value)) {
                      found.push(value);
                    }

                  });

                  result.push(found);

                } else {

                  let found = undefined;

                  results[Type].forEach(function (value) {
                    if(found){
                      return;
                    }

                    if (id === fieldGetter(value)) {
                      found = value;
                    }

                  });

                  if (found) {
                    result.push(found);
                  } else {
                    result.push(new Error(`fieldLoader-${Type}: Error fetching ${id}`));
                  }
                }


              // });

            } else {

              // props.forEach(function (key) {
                result.push(isPlural ? [] : new Error(`fieldLoader-${Type}: Error fetching ${key}`));
              // });

            }

            return result;
          }, []));
        }
      })
    });

  }), {
    cache: true,
    cacheKeyFn: ([Type, propertyValue]) => `${Type.className}:${propertyValue}`,
  });
}

module.exports.parseSeqLoader = function () {

  // const Seq = Parse.Object.extend('Seq');

  function getCurrentSeqObject() {
    // const query = new Parse.Query(Seq);
    // return query.get(process.env.SEQ_ID);

    return Parse.Cloud.run('getCurrentSeq');
  }

  let _seq,
    _promise;

  function getKey(key){
    return () => _seq.has(key) ? _seq.get(key) : function(){
      // console.warn('Key is null `', key, '`');
      return key.startsWith('transaction_sequence_') ? 1000 : 0;
    }();
  }

  function doLoad(key) {
    _promise = getCurrentSeqObject();

    return _promise.then(
      function ({ result: obj, }) {

        _seq = obj;
        _promise = undefined;

        return _seq.has(key) ? _seq.get(key) : function(){
          // console.warn('Key is null `', key, '`');
          return key.startsWith('transaction_sequence_') ? 1000 : 0;
        }();
      }
    );
  }

  return {
    load(key){

      if (_seq && _seq.has(key) && _seq.get(key) !== null) {
        return Parse.Promise.as(_seq.get(key));
      }

      if(_promise){
        return _promise.then(getKey(key));
      }

      return doLoad(key);
    },
    clear(key){
      if (_seq) {
        _seq.unset(key);
      }
    },
    clearCompany(id){
      if (_seq) {
        // _seq.unset(`transaction_sequence_${id}`);
        // _seq.unset(`payments_transaction_sequence_${id}`);
        _seq = null;
      }
    },
    clearAll(){
      _seq = null;
    },
  }

}();
