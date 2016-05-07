'use strict';

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _expressUseragent = require('express-useragent');

var _expressUseragent2 = _interopRequireDefault(_expressUseragent);

var _morgan = require('morgan');

var _morgan2 = _interopRequireDefault(_morgan);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// const SUPPORTED_LOCALES = [
//   'en',
//   'fr'
// ];

var __DEVELOPMENT__ = process.env.NODE_ENV !== 'production';

// import locale from 'locale';

var APP_PORT = process.env.PORT || 5000;

function setup() {
  var server = arguments.length <= 0 || arguments[0] === undefined ? (0, _express2.default)() : arguments[0];

  // server.use(locale(SUPPORTED_LOCALES));
  server.use(_expressUseragent2.default.express());

  __DEVELOPMENT__ || server.use(require('compression')({}));

  // use morgan to log requests to the console
  __DEVELOPMENT__ && server.use((0, _morgan2.default)('combined', {}));

  function getAssets() {
    var fileData = require('fs').readFileSync(_path2.default.resolve(process.cwd(), 'webpack-assets.json'), 'utf8');
    return JSON.parse(fileData);
  }

  // Rendering

  server.set('views', _path2.default.resolve(process.cwd(), 'public'));
  server.set('view engine', 'html');

  server.engine('html', require('ejs').renderFile);

  // Serve static resources

  ['/', '/index.html', '/apps*', '/login', '/account', '/reset'].forEach(function (route) {
    server.get(route, function (req, res) {

      switch (req.useragent.browser) {
        case 'Chrome':

          if (req.useragent.isMobile) {
            // Mobile error
            res.end('Sorry, Mobile is unsupported :(');
          } else {
            res.render('index', {
              dev: __DEVELOPMENT__,
              assets: getAssets(),
              port: APP_PORT,
              locale: 'fr' });
          }

          // req.locale,
          break;

        default:
          // Invalid user agent
          res.end('Sorry, unsupported browser :(');
      }
    });
  });

  ['css', 'js'].forEach(function (p) {
    server.use('/' + p, _express2.default.static(_path2.default.resolve(process.cwd(), 'public', p)));
  });

  return server;
}

function createApp(cb) {
  if (__DEVELOPMENT__) {
    var webpack = require('webpack');
    var WebpackDevServer = require('webpack-dev-server');

    var buildConfig = require('./webpack.config.js');

    var compiler = webpack(buildConfig);

    var devServer = new WebpackDevServer(compiler, {
      contentBase: false,
      publicPath: buildConfig.output.publicPath,

      // Configure hot replacement
      hot: true,

      // Set this as true if you want to access dev server from arbitrary url.
      // This is handy if you are using a html5 router.
      historyApiFallback: false,

      // The rest is terminal configurations
      quiet: false,
      noInfo: false,
      stats: { colors: true },

      setup: setup
    });

    return cb(devServer);
  }

  var app = setup();

  return cb(app);
}

createApp(function (app) {
  var server = app.listen(APP_PORT, function (err) {
    if (err) {
      throw err;
    }

    // function handleShutdown() {
    //   console.log('Termination signal received. Shutting down.');
    //   (__DEVELOPMENT__ ? app : server).close(function () {
    //     process.exit(0);
    //   });
    // }
    // process.on('SIGTERM', handleShutdown);
    // process.on('SIGINT', handleShutdown);

    console.log('App is now running on http://localhost:' + APP_PORT);
  });
});