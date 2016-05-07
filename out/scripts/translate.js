#!/usr/bin/env babel-node --optional es7.asyncFunctions
"use strict";

var _fs = require("fs");

var fs = _interopRequireWildcard(_fs);

var _glob = require("glob");

var _mkdirp = require("mkdirp");

var _path = require("path");

var _path2 = _interopRequireDefault(_path);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

require("babel-core/register");
require("babel-polyfill");

var MESSAGES_PATTERN = _path2.default.join(process.cwd(), 'build', 'messages', '/**/*.json');
var LANG_DIR = _path2.default.join(process.cwd(), 'build', 'lang', '/');

// Aggregates the default messages that were extracted from the example app's
// React components via the React Intl Babel plugin. An error will be thrown if
// there are messages in different components that use the same `id`. The result
// is a flat collection of `id: message` pairs for the app's default locale.
var defaultMessages = (0, _glob.sync)(MESSAGES_PATTERN).map(function (filename) {
  return fs.readFileSync(filename, 'utf8');
}).map(function (file) {
  return JSON.parse(file);
}).reduce(function (collection, descriptors) {
  descriptors.forEach(function (_ref) {
    var id = _ref.id;
    var defaultMessage = _ref.defaultMessage;

    if (collection.hasOwnProperty(id)) {
      // return;
      throw new Error("Duplicate message id: " + id);
    }

    collection[id] = defaultMessage;
  });

  return collection;
}, {});

(0, _mkdirp.sync)(LANG_DIR);
fs.writeFileSync(LANG_DIR + 'fr.json', JSON.stringify(defaultMessages, null, 2));

// if (process.env.TRANSLATE === 'yes') {
//
//   const messages = {};
//
//   const doTranslate = function () {
//
//     const MsTranslator = require('mstranslator');
//
//     const client = new MsTranslator({
//       client_id: process.env.MICROSOFT_AZURE_CLIENT_ID
//       , client_secret: process.env.MICROSOFT_AZURE_CLIENT_SECRET,
//     }, true);
//
//     return function (key, text) {
//       return new Promise((resolve, reject) => {
//
//         client.translate({text, from: 'en', to: 'fr-FR'}, function (error, translation) {
//           if (error)  reject(error);
//
//           console.log('Got translation for ', text, ' = ', translation);
//
//           resolve({key, translation});
//
//           if(key){
//             messages[key] = translation;
//           }
//
//         });
//
//       });
//     };
//   }();
//
//   (async function () {
//
//     await doTranslate(null, 'Hello world');
//     await doTranslate(null, 'Hello world');
//
//     await Object.keys(defaultMessages).reduce((promise, key) => {
//       const text = defaultMessages[key];
//       return promise.then(() => doTranslate(key, text));
//     }, Promise.resolve());
//
//     fs.writeFileSync(LANG_DIR + 'fr.json', JSON.stringify(messages, null, 2));
//
//   })();
//
// }