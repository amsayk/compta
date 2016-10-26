const Parse = require('parse');

module.exports.logIn = function logIn(email, password, cb) {
  return Parse.User.logIn(email, password).then(function(user){
    return user.toJSON();
  });
};

module.exports.logOut = function logOut() {
  return Parse.User.logOut();
};

module.exports.handleParseError = function handleParseError(err) {
  switch (err.code) {
    case Parse.Error.INVALID_SESSION_TOKEN:
      Parse.User.logOut();
      break;
  }
};
