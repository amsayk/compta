'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _webpack = require('webpack');

var _webpack2 = _interopRequireDefault(_webpack);

var _webpackDevServer = require('webpack-dev-server');

var _webpackDevServer2 = _interopRequireDefault(_webpackDevServer);

var _assetsWebpackPlugin = require('assets-webpack-plugin');

var _assetsWebpackPlugin2 = _interopRequireDefault(_assetsWebpackPlugin);

var _locale = require('locale');

var _locale2 = _interopRequireDefault(_locale);

var _morgan = require('morgan');

var _morgan2 = _interopRequireDefault(_morgan);

var _extractTextWebpackPlugin = require('extract-text-webpack-plugin');

var _extractTextWebpackPlugin2 = _interopRequireDefault(_extractTextWebpackPlugin);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var SUPPORTED_LOCALES = ["en", "fr"];

var __DEVELOPMENT__ = process.env.NODE_ENV !== "production";

var APP_PORT = process.env.PORT || 5000;

var vendors = ['babel-polyfill', 'classnames', 'dataloader', 'dom-helpers', 'debug', 'fixed-data-table', 'graphql', 'graphql-relay', 'lodash.findindex', 'lodash.throttle', 'moment', 'moment-range', 'parse', 'react', 'react-addons-update', 'react-bootstrap', 'react-css-modules', 'react-datepicker', 'react-dnd', 'react-dnd-html5-backend', 'react-document-meta', 'react-dom', 'react-intl', 'react-relay', 'react-router', 'redux', 'redux-form', 'relay-local-schema', 'uid'];

var plugins = [new _extractTextWebpackPlugin2.default('[hash].app.css', {
  allChunks: true
}), new _webpack2.default.DefinePlugin({
  'process.env': {
    NODE_ENV: JSON.stringify(__DEVELOPMENT__ ? 'development' : 'production'),
    APPLICATION_ID: JSON.stringify(process.env.APPLICATION_ID),
    JAVASCRIPT_KEY: JSON.stringify(process.env.JAVASCRIPT_KEY)
  }
}), new _webpack2.default.optimize.OccurenceOrderPlugin(), new _webpack2.default.optimize.DedupePlugin(),
// Avoid publishing files when compilation fails
new _webpack2.default.NoErrorsPlugin(), new _assetsWebpackPlugin2.default({}), new _webpack2.default.optimize.CommonsChunkPlugin({
  name: 'vendors',
  filename: '[hash].vendors.js',
  minChunks: Infinity
})];

if (!__DEVELOPMENT__) {
  plugins.push(new _webpack2.default.optimize.UglifyJsPlugin({
    compress: {
      hoist_vars: true,
      screw_ie8: true,
      warnings: false
    }
  }));
} else {
  plugins.push(new _webpack2.default.HotModuleReplacementPlugin());
}

var entry = {
  main: [_path2.default.resolve(process.cwd(), 'js', 'app.js')],

  vendors: vendors
};

var output = {
  filename: '[hash].app.js',
  path: _path2.default.resolve(process.cwd(), 'public', 'js', '__build__'),
  publicPath: '/js/__build__/',
  chunkFilename: '[id].[chunkhash].app.js'
};

if (__DEVELOPMENT__) {
  entry = {
    main: [
    // For hot style updates
    'webpack/hot/dev-server',

    // The script refreshing the browser on none hot updates
    'webpack-dev-server/client?http://localhost:' + APP_PORT, _path2.default.resolve(process.cwd(), 'js', 'app.js')],

    vendors: vendors
  };

  output = {
    filename: '[hash].app.js',
    path: '/',
    publicPath: '/js/',
    chunkFilename: '[id].[chunkhash].app.js'
  };
}

// Serve the Relay app
var compiler = (0, _webpack2.default)({
  debug: __DEVELOPMENT__,
  devtool: __DEVELOPMENT__ ? 'cheap-module-eval-source-map' : 'cheap-module-source-map',
  entry: entry,
  module: {
    loaders: [{
      exclude: /node_modules/,
      loader: 'babel',
      query: {
        presets: ["es2015", "stage-0", "react"],
        plugins: [_path2.default.resolve(__dirname, 'build', 'babelRelayPlugin'), 'transform-decorators-legacy', ['babel-plugin-module-map', _extends({}, require('fbjs/module-map'), {
          React: 'react',
          ReactDOM: 'react-dom'
        })], ['react-intl', {
          messagesDir: _path2.default.resolve(process.cwd(), 'build', 'messages'),
          enforceDescriptions: false
        }]],
        cacheDirectory: true,
        env: {
          production: {
            plugins: ["transform-react-constant-elements"]
          }
        }
      },

      // "transform-react-inline-elements",
      test: /\.js$/
    }, { test: /\.css$/, loader: "style-loader!css-loader" }, { test: /\.less$/, loader: "style-loader!css-loader!less-loader" }, { test: /\.gif$/, loader: "url-loader?mimetype=image/png" }, { test: /\.woff(2)?(\?v=[0-9].[0-9].[0-9])?$/, loader: "url-loader?mimetype=application/font-woff" }, { test: /\.(ttf|eot|svg)(\?v=[0-9].[0-9].[0-9])?$/, loader: "file-loader?name=[name].[ext]" }, { test: /\.(png)$/, loader: 'url-loader?limit=100000' }, { test: /\.jpg$/, loader: "file-loader" }, {
      exclude: /node_modules/,
      test: /\.json/, loader: "json"
    }, {
      exclude: /node_modules/,
      test: /\.scss$/,
      loader: _extractTextWebpackPlugin2.default.extract('style', 'css?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]!sass')
    }]
  },
  output: output,
  plugins: plugins
});

function setup(server) {
  server || (server = (0, _express2.default)());

  server.use((0, _locale2.default)(SUPPORTED_LOCALES));

  __DEVELOPMENT__ || server.use(require('compression')({}));

  // use morgan to log requests to the console
  __DEVELOPMENT__ && server.use((0, _morgan2.default)('combined', {}));

  function getAssets() {
    var fileData = require("fs").readFileSync(_path2.default.resolve(process.cwd(), "webpack-assets.json"), 'utf8');
    return JSON.parse(fileData);
  }

  // Rendering

  server.set('views', _path2.default.resolve(process.cwd(), 'public'));
  server.set('view engine', 'html');

  server.engine('html', require('ejs').renderFile);

  // Serve static resources

  ['/', '/index.html', '/apps*', '/login', '/account', '/reset'].forEach(function (path) {
    server.get(path, function (req, res) {

      res.render('index', {
        dev: __DEVELOPMENT__,
        assets: getAssets(),
        port: APP_PORT,
        locale: req.locale
      });
    });
  });

  ['css', 'js'].forEach(function (p) {
    server.use('/' + p, _express2.default.static(_path2.default.resolve(process.cwd(), 'public', p)));
  });

  return server;
}

function createApp(cb) {

  if (__DEVELOPMENT__) {
    var _app = new _webpackDevServer2.default(compiler, {
      contentBase: '/public/',
      publicPath: '/js/',

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

    return cb(_app);
  }

  //compiler.run(function(err, stats) {
  //  if(err) throw err;
  //
  //  if(stats.hasErrors()) {
  //    console.log(stats.toString({colors: true}));
  //    return;
  //  }
  //
  //  console.log('webpack: bundle is now VALID.');

  var app = setup();

  cb(app);
  //});
}

createApp(function (app) {

  app.listen(APP_PORT, function (err) {

    if (err) {
      throw err;
    }

    console.log('App is now running on http://localhost:' + APP_PORT);
  });
});