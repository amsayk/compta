import Parse from 'parse';
import DataLoader from 'dataloader';

export const parseIDLoader = fieldLoader('objectId', false, (obj) => obj.id);

export const parsePeriodLoader = fieldLoader('period', true, (obj) => obj.get('period'));

// Perform only one load for several queries per type!
export const parseTableLoader = new DataLoader(keys => new Promise((resolve) => {

  function fetch(Type, cb) {

    if (process.env.NODE_ENV !== 'production') {
      console.log(`DataLoader table query for type ${Type}`);
    }

    const query = new Parse.Query(Type);
    query.limit(1000);
    query.find().then(
      function (objects) {

        if (process.env.NODE_ENV !== 'production') {
          console.log(`DataLoader table query for type ${Type} found:`, JSON.stringify(objects));
        }

        cb(null, objects);
      },
      function (error) {
        cb(error);
      }
    );
  }

  const types = {};
  keys.forEach(function (Type) {
    types[Type.className] = (types[Type.className] || 0) + 1;
  });

  const typesKeys = Object.keys(types);

  let remaining = typesKeys.length;
  const results = {};

  typesKeys.forEach(function (Type) {

    fetch(Type, function (err, objects) {
      results[Type] = err ? null : objects;

      if (--remaining === 0) {
        resolve(typesKeys.reduce(function (result, Type) {

          if (results[Type]) {
            for (let i = 0; i < types[Type]; i++) {
              result.push(results[Type]);
            }

          } else {

            for (let i = 0; i < types[Type]; i++) {
              result.push(new Error(`Error fetching ${Type.name}`));
            }
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

      const query = new Parse.Query(Type);
      query.containedIn(field, keys);
      query.limit(1000);
      return query.find().then(
        function (objects) {

          if (process.env.NODE_ENV !== 'production') {
            console.log(`DataLoader table query for type ${Type} found:`, JSON.stringify(objects));
          }

          cb(null, objects);
        },
        function (error) {
          cb(error);
        }
      );
    }

    const queries = {};
    keys.forEach(function ([Type, key]) {
      queries[Type.className] = (queries[Type.className] || []).concat([key]);
    });

    const queriesKeys = Object.keys(queries);

    let remaining = queriesKeys.length;
    const results = {};

    queriesKeys.forEach(function (Type) {
      const keys = queries[Type];

      fetch(Type, keys, function (err, objects) {
        results[Type] = err ? null : objects;

        if (--remaining === 0) {
          resolve(queriesKeys.reduce((result, Type) => {

            if (results[Type]) {

              keys.forEach(function (key) {

                if (isPlural) {

                  let found = [];

                  results[Type].forEach(function (value) {

                    if (key === fieldGetter(value)) {
                      found.push(value);
                    }

                  });

                  result.push(found);

                } else {

                  let found;

                  results[Type].forEach(function (value) {

                    if (key === fieldGetter(value)) {
                      found = value;
                    }

                  });

                  if (found) {
                    result.push(found);
                  } else {
                    result.push(new Error(`Error fetching ${key}`));
                  }
                }


              });

            } else {

              keys.forEach(function (key) {
                result.push(isPlural ? [] : new Error(`Error fetching ${key}`));
              });

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

export const parseSeqLoader = function () {

  let _seq,
    _promise;

  function getKey(key){
    return () => _seq.get('sequence_' + key);
  }

  function doLoad(key) {
    _promise = Parse.Cloud.run('getCurrentSeq');

    return _promise.then(
      function ({result}) {

        _seq = result;
        _promise = undefined;

        return _seq.get('sequence_' + key);
      }
    );
  }

  return {
    load(key){
      if (_seq && _seq.has('sequence_' + key)) {
        return Parse.Promise.as(_seq.get('sequence_' + key));
      }

      if(_promise){
        return _promise.then(getKey(key));
      }

      return doLoad(key);
    },
    clear(key){
      if (_seq) {
        _seq.unset('sequence_' + key);
      }
    },
    clearAll(){
      _seq = null;
    },
  }

}();
