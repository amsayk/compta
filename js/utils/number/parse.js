const Globalize = require('../globalize');

const numberParser = Globalize( window.__locale ).numberParser();

export default numberParser;
