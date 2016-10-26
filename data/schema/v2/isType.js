const getType = require('./getType');

module.exports = function isType(obj, typeName){
  return getType(obj) === typeName || obj.className.indexOf(typeName) !== -1;
}
