var assign = require('object-assign');

module.exports = require('babel-preset-fbjs/configure')({
  autoImport: true,
  inlineRequires: true,
  rewriteModules: {
    map: assign({},
      require('fbjs-scripts/third-party-module-map'),
      require('fbjs/module-map')
    ),
    prefix: ''
  },
  stripDEV: process.env.NODE_ENV === 'production'
});
