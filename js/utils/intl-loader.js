import debug from 'debug';

import { addLocaleData, } from 'react-intl';

const loaders = {
  en(callback, force = false) {
    if (!window.Intl || force) {
      require.ensure([], (require) => {

        // Globalize
        const Globalize = require('./globalize');

        Globalize.load(
        	require( "cldr-data/main/en/numbers.json" ),
        	require( "cldr-data/supplemental/numberingSystems.json" ),
        	require( "cldr-data/supplemental/likelySubtags.json" ),
        );

        require('intl');
        require('intl/locale-data/jsonp/en.js');
        const messages = require('../../build/lang/en');
        return callback({messages});
      });
    } else {
      require.ensure([], (require) => {

        // Globalize
        const Globalize = require('./globalize');

        Globalize.load(
        	require( "cldr-data/main/en/numbers.json" ),
        	require( "cldr-data/supplemental/numberingSystems.json" ),
        	require( "cldr-data/supplemental/likelySubtags.json" ),
        );

        require('react-intl/locale-data/en.js');
        const messages = require('../../build/lang/en');
        return callback({messages});
      });
    }

  },

  fr(callback, force = false) {
    if (!window.Intl || force) {
      require.ensure([], (require) => {

        // Globalize
        const Globalize = require('./globalize');

        Globalize.load(
        	require( "cldr-data/main/fr/numbers.json" ),
        	require( "cldr-data/supplemental/numberingSystems.json" ),
        	require( "cldr-data/supplemental/likelySubtags.json" ),
        );

        require('intl');
        require('intl/locale-data/jsonp/fr.js');
        const messages = require('../../build/lang/fr');
        return callback({messages});
      });
    } else {
      require.ensure([], (require) => {

        // Globalize
        const Globalize = require('./globalize');

        Globalize.load(
        	require( "cldr-data/main/fr/numbers.json" ),
        	require( "cldr-data/supplemental/numberingSystems.json" ),
        	require( "cldr-data/supplemental/likelySubtags.json" ),
        );

        addLocaleData(require('react-intl/locale-data/fr.js'));
        const messages = require('../../build/lang/fr');
        return callback({messages});
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
