const memoize = require('lodash.memoize');

module.exports = memoize(function getType(obj){
  if(obj.__type){
    return obj.__type;
  }

  const kind = obj.get('kind');

  return kind;
}, obj => obj.id);
