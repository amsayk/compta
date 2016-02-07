import express from 'express';
import path from 'path';
import webpack from 'webpack';
import WebpackDevServer from 'webpack-dev-server';
import AssetsPlugin from 'assets-webpack-plugin';

import locale from 'locale';

import morgan from 'morgan';

import ExtractTextPlugin from 'extract-text-webpack-plugin';

const SUPPORTED_LOCALES = [ "en", "fr", ];

const __DEVELOPMENT__ = process.env.NODE_ENV !== "production";

const APP_PORT = process.env.PORT || 5000;

const vendors = [
  'babel-polyfill',
  'classnames',
  'dataloader',
  'dom-helpers',
  'debug',
  'fixed-data-table',
  'graphql',
  'graphql-relay',
  'lodash.findindex',
  'lodash.throttle',
  'moment',
  'moment-range',
  'parse',
  'react',
  'react-addons-update',
  'react-bootstrap',
  'react-css-modules',
  'react-datepicker',
  'react-dnd',
  'react-dnd-html5-backend',
  'react-document-meta',
  'react-dom',
  'react-intl',
  'react-relay',
  'react-router',
  'redux',
  'redux-form',
  'relay-local-schema',
  'uid',
];

const plugins = [
  new ExtractTextPlugin('[hash].app.css', {
    allChunks: true
  }),
  new webpack.DefinePlugin({
    'process.env': {
      NODE_ENV: JSON.stringify(__DEVELOPMENT__ ? 'development' : 'production'),
      APPLICATION_ID: JSON.stringify(process.env.APPLICATION_ID),
      JAVASCRIPT_KEY: JSON.stringify(process.env.JAVASCRIPT_KEY),
    }
  }),
  new webpack.optimize.OccurenceOrderPlugin(),
  new webpack.optimize.DedupePlugin(),
  // Avoid publishing files when compilation fails
  new webpack.NoErrorsPlugin(),
  new AssetsPlugin({

  }),
  new webpack.optimize.CommonsChunkPlugin({
    name: 'vendors',
    filename: '[hash].vendors.js',
    minChunks: Infinity,
  }),
];

if(!__DEVELOPMENT__){
  plugins.push(
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        hoist_vars: true,
        screw_ie8: true,
        warnings: false,
      },
    })
  );
}else {
  plugins.push(
    new webpack.HotModuleReplacementPlugin()
  );
}

let entry = {
  main: [
    path.resolve(process.cwd(), 'js', 'app.js'),
  ],

  vendors
};

let output = {
  filename: '[hash].app.js',
  path: path.resolve(process.cwd(), 'public', 'js', '__build__'),
  publicPath: '/js/__build__/',
  chunkFilename: '[id].[chunkhash].app.js',
};

if(__DEVELOPMENT__){
  entry = {
    main: [
      // For hot style updates
      'webpack/hot/dev-server',

      // The script refreshing the browser on none hot updates
      `webpack-dev-server/client?http://localhost:${APP_PORT}`,

      path.resolve(process.cwd(), 'js', 'app.js'),
    ],

    vendors
  };

  output = {
    filename: '[hash].app.js',
    path: '/',
    publicPath: '/js/',
    chunkFilename: '[id].[chunkhash].app.js',
  };
}

// Serve the Relay app
const compiler = webpack({
  debug: __DEVELOPMENT__,
  devtool: __DEVELOPMENT__ ? 'cheap-module-eval-source-map' : 'cheap-module-source-map',
  entry,
  module: {
    loaders: [
      {
        exclude: /node_modules/,
        loader: 'babel',
        query: {
          presets: ["es2015", "stage-0", "react"],
          plugins: [
            path.resolve(__dirname, 'build', 'babelRelayPlugin'),
            'transform-decorators-legacy',
            ['babel-plugin-module-map', { ...require('fbjs/module-map'),
              React: 'react',
              ReactDOM: 'react-dom',
            }],
            ['react-intl', {
              messagesDir: path.resolve(process.cwd(), 'build', 'messages'),
              enforceDescriptions: false
            }],
          ],
          cacheDirectory: true,
          env: {
            production: {
              plugins: [
                "transform-react-constant-elements",
                // "transform-react-inline-elements",
              ],
            }
          },
        },
        test: /\.js$/,
      },

      { test: /\.css$/, loader: "style-loader!css-loader" },
      { test: /\.less$/, loader: "style-loader!css-loader!less-loader" },

      { test: /\.gif$/, loader: "url-loader?mimetype=image/png" },
      { test: /\.woff(2)?(\?v=[0-9].[0-9].[0-9])?$/, loader: "url-loader?mimetype=application/font-woff" },
      { test: /\.(ttf|eot|svg)(\?v=[0-9].[0-9].[0-9])?$/, loader: "file-loader?name=[name].[ext]" },

      { test: /\.(png)$/, loader: 'url-loader?limit=100000' },

      { test: /\.jpg$/, loader: "file-loader" },

      {
        exclude: /node_modules/,
        test: /\.json/, loader: "json"
      },

      {
        exclude: /node_modules/,
        test: /\.scss$/,
        loader: ExtractTextPlugin.extract('style', 'css?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]!sass')
      },

    ]
  },
  output,
  plugins,
});

function setup(server){
  server || (server = express());

  server.use(locale(SUPPORTED_LOCALES));

  __DEVELOPMENT__ || server.use(require('compression')({}));

  // use morgan to log requests to the console
  __DEVELOPMENT__ && server.use(morgan('combined', {}));

  function getAssets(){
    const fileData = require("fs").readFileSync(
      path.resolve(process.cwd(), "webpack-assets.json"), 'utf8');
    return JSON.parse(fileData);
  }

  // Rendering

  server.set('views', path.resolve(process.cwd(), 'public'));
  server.set('view engine', 'html');

  server.engine('html', require('ejs').renderFile);

  // Serve static resources

  [ '/', '/index.html', '/apps*', '/login', '/account', '/reset', ].forEach(function(path){
    server.get(path, function(req, res) {

      res.render('index', {
        dev: __DEVELOPMENT__,
        assets: getAssets(),
        port: APP_PORT,
        locale: req.locale,
      });

    });
  });

  [ 'css', 'js', ].forEach(function(p){
    server.use('/' + p, express.static(path.resolve(process.cwd(), 'public', p)));
  });

  return server;
}

function createApp(cb){

  if(__DEVELOPMENT__){
    const app = new WebpackDevServer(compiler, {
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
      stats: {colors: true},

      setup
    });

    return cb(app);
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

    const app = setup();

    cb(app);
  //});
}

createApp(function (app){

  app.listen(APP_PORT, (err) => {

    if(err) {
      throw err;
    }

    console.log(`App is now running on http://localhost:${APP_PORT}`);
  });
});
