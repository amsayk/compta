import debug from 'debug';

import { addLocaleData, } from 'react-intl';

const loaders = {
  en(callback, force = false) {
    if (!window.Intl || force) {
      require.ensure([], (require) => {
        require('intl');
        require('intl/locale-data/jsonp/en.js');
        const lang = require('../../build/lang/en');
        return callback({messages: lang});
      });
    } else {
      require.ensure([], (require) => {
        require('react-intl/dist/locale-data/en.js');
        const lang = require('../../build/lang/en');
        return callback({messages: lang});
      });
    }

  },

  fr(callback, force = false) {
    if (!window.Intl || force) {
      require.ensure([], (require) => {
        require('intl');
        require('intl/locale-data/jsonp/fr.js');
        const lang = require('../../build/lang/fr');
        return callback({messages: lang});
      });
    } else {
      require.ensure([], (require) => {
        addLocaleData(require('react-intl/dist/locale-data/fr.js'));
        const lang = require('../../build/lang/fr');
        return callback({messages: lang});
      });
    }
  }

};

export default (locale, force) => {
  debug('dev')(`loading lang ${locale}`);
  return new Promise((resolve) => {
    return loaders[locale]((result) => {
      return resolve(result);
    }, force);
  });
};
