'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.logIn = logIn;
exports.logOut = logOut;
exports.handleParseError = handleParseError;

var _parse = require('parse');

var _parse2 = _interopRequireDefault(_parse);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function logIn(email, password, cb) {
  return _parse2.default.User.logIn(email, 'default').then(function (user) {
    return user.toJSON();
  });
}

function logOut() {
  return _parse2.default.User.logOut();
}

function handleParseError(err) {
  switch (err.code) {
    case _parse2.default.Error.INVALID_SESSION_TOKEN:
      _parse2.default.User.logOut();
      break;
  }
}