#!/usr/bin/env babel-node --optional es7.asyncFunctions

require("babel-core/register");
require("babel-polyfill");

import * as fs from 'fs';
import {sync as globSync} from 'glob';
import {sync as mkdirpSync} from 'mkdirp';
import path from 'path';

const MESSAGES_PATTERN = path.join(process.cwd(), 'build', 'messages', '/**/*.json');
const LANG_DIR = path.join(process.cwd(), 'build', 'lang', '/');

// Aggregates the default messages that were extracted from the example app's
// React components via the React Intl Babel plugin. An error will be thrown if
// there are messages in different components that use the same `id`. The result
// is a flat collection of `id: message` pairs for the app's default locale.
const defaultMessages = globSync(MESSAGES_PATTERN)
  .map((filename) => fs.readFileSync(filename, 'utf8'))
  .map((file) => JSON.parse(file))
  .reduce((collection, descriptors) => {
    descriptors.forEach(({id, defaultMessage}) => {
      if (collection.hasOwnProperty(id)) {
        // return;
        throw new Error(`Duplicate message id: ${id}`);
      }

      collection[id] = defaultMessage;
    });

    return collection;
  }, {});


mkdirpSync(LANG_DIR);
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
