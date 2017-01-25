require('dotenv').config();

const webpack = require('webpack');
const path = require('path');
const AssetsPlugin = require('assets-webpack-plugin');
const VendorChunkPlugin = require('webpack-vendor-chunk-plugin');

const OfflinePlugin = require('offline-plugin');

const ExtractTextPlugin = require('extract-text-webpack-plugin');

const __DEV__ = process.env.NODE_ENV !== 'production';

const APP_PORT = process.env.PORT || 5000;

const mountPath = process.env.PARSE_MOUNT || '/parse';

const SERVER_URL = process.env.SERVER_URL || `http://localhost:${APP_PORT}${mountPath}`;

const vendors = [
  // 'redux-worker',

  'react-tooltip',
  'react-addons-shallow-compare',

  'alt',
  'alt-container',
  // 'alt-utils',
  // 'babel-polyfill',
  // 'base64-arraybuffer',
  'classnames',
  // 'cldr',
  // 'cldr-data',
  'dataloader',
  // 'debug',
  'dom-helpers/events',
  // 'faker',
  'fbjs',
  // 'globalize',
  // 'graphiql',
  'graphql',
  'graphql-custom-datetype',
  'graphql-relay',
  'highcharts',
  'intl',
  'lodash.compact',
  'lodash.concat',
  'lodash.drop',
  'lodash.every',
  'lodash.filter',
  'lodash.findindex',
  'lodash.findwhere',
  'lodash.first',
  'lodash.get',
  'lodash.groupby',
  'lodash.isequal',
  'lodash.map',
  'lodash.merge',
  'lodash.orderby',
  'lodash.padend',
  'lodash.pick',
  'lodash.set',
  'lodash.some',
  'lodash.sortby',
  'lodash.take',
  'lodash.throttle',
  'lodash.uniq',
  'lodash.uniqby',
  'moment',
  'parse',
  'react',
  'react-addons-create-fragment',
  'react-addons-update',
  'react-bootstrap',
  'react-css-modules',
  'react-dnd',
  'react-dnd-html5-backend',
  'react-dom',
  'react-dropzone',
  'react-helmet',
  'react-imageloader',
  'react-intl',
  'react-lazy-cache',
  'react-motion',
  'react-paginate',
  'react-prop-types',
  'react-redux',
  'react-relay',
  'react-router',
  'react-widgets',
  'redux',
  'redux-batched-actions',
  'redux-form',
  'redux-logger',
  'validator',
];

const externals = [
  '/material-icons/material-icons.css',
  '/material-icons/fonts/MaterialIcons.woff2',

  '/css/bootstrap/4.0.0-alpha.2/bootstrap.min.css',
  '/css/common.css',

  '/css/fonts/HelveticaNeueLTW1G-Roman.woff',
  '/css/fonts/HelveticaNeueLTW1G-Roman.ttf',
  '/css/fonts/HelveticaNeueLTW1G-Lt.woff',
  '/css/fonts/HelveticaNeueLTW1G-Lt.ttf',
  '/css/fonts/HelveticaNeueLTW1G-Bd.woff',
  '/css/fonts/HelveticaNeueLTW1G-Bd.ttf',
  '/css/fonts/harmonyicons-regular-webfont.woff',
  '/css/fonts/DINNextLTPro-Regular.woff',
  '/css/fonts/DINNextLTPro-Regular.ttf',
  '/css/fonts/DINNextLTPro-Light.woff',
  '/css/fonts/DINNextLTPro-Light.ttf',

  '/css/popover.css',
  '/css/caret.css',
  '/css/spinner.css',
  '/css/progress.css',
  '/css/fixed-data-table.css',
  '/css/table-overrides.css',
  '/css/form.css',
  '/css/modal.css',
  '/css/notifications.css',
  '/css/mdl-checkbox.css',
  '/css/react-vis-overrides.css',
  '/css/table.css',
  '/css/fab.css',
  '/css/sidebar.css',
  '/css/wizard.css',
  '/css/alert.css',
];

const plugins = [
  new ExtractTextPlugin('[hash:8].app.css', {
    disable: false,
    allChunks: true
  }),
  new webpack.DefinePlugin({
    'process.env': {
      NODE_ENV: JSON.stringify(process.env.NODE_ENV),
      APPLICATION_ID: JSON.stringify(process.env.APPLICATION_ID),
      JAVASCRIPT_KEY: JSON.stringify(process.env.JAVASCRIPT_KEY),
      MASTER_KEY: JSON.stringify(process.env.MASTER_KEY),
      PRODUCT_ENABLE_PURCHASE: JSON.stringify(true),
      GA_TRACKING_CODE: JSON.stringify('UA-77364031-1'),
      SERVER_URL: JSON.stringify(SERVER_URL),
    }
  }),
  new webpack.optimize.OccurenceOrderPlugin(),
  // Avoid publishing files when compilation fails
  new webpack.NoErrorsPlugin(),
  new AssetsPlugin({

  }),
  new webpack.optimize.CommonsChunkPlugin({
    name: 'vendors',
    filename: '[hash].vendors.js',
    minChunks: Infinity,
  }),

  new VendorChunkPlugin('vendors'),

  // new webpack.LoaderOptionsPlugin({
  //   minimize: true,
  //   debug: false
  // }),

];

const presets = [
  'react-native',
];

const query = {
  cacheDirectory: false, // __DEV__,
  presets,
  plugins: [
    'transform-runtime',
    'transform-decorators-legacy',
    path.resolve(__dirname, 'build', 'babelRelayPlugin'),
    // ['react-intl', {
    //   messagesDir: path.resolve(process.cwd(), 'build', 'messages'),
    //   enforceDescriptions: false
    // }],
  ],
};

let entry = {
  main: [
    'babel-polyfill',
    path.resolve(process.cwd(), 'js', 'app.js'),
  ],

  vendors,
};

let output = {
  filename: '[hash:8].[name].js',
  path: path.resolve(process.cwd(), 'dist'),
  publicPath: '/assets/',
  chunkFilename: '[id].[chunkhash:8].[name].js',
};

if(!__DEV__){

  query.plugins = query.plugins.concat(
    [
      'transform-react-remove-prop-types',
      // 'transform-react-constant-elements',
      // 'transform-react-inline-elements',
    ]
  );

  plugins.push(new webpack.optimize.DedupePlugin());

  plugins.push(
    new webpack.optimize.UglifyJsPlugin({
      sourceMap: false,
      minimize: true,
      compress: {
        drop_debugger: true,
        drop_console: true,
        hoist_vars: true,
        screw_ie8: true,
        warnings: false
      },
    })
  );

  // plugins.push(
  //   new webpack.LoaderOptionsPlugin({
  //     minimize: true,
  //     debug: false
  //   })
  // );

  plugins.push(new OfflinePlugin({
    relativePaths: false,
    publicPath: '/assets/',
    ServiceWorker:{
      events: true,
    },
    caches: {
      main: [
        ...externals,
        ':rest:',
      ],
    },
    excludes: [ '**/.*', '**/*.map', '[hash:8].main.js', '[hash].vendors.js', '[hash:8].app.css', '/assets/index.html', ],
    externals,
  }));

}else {

  entry = {
    main: [
      // For hot style updates
      'webpack/hot/dev-server',

      // The script refreshing the browser on none hot updates
      `webpack-dev-server/client?http://localhost:${APP_PORT}`,

      path.resolve(process.cwd(), 'js', 'app.js'),
    ],

    vendors,
  };

  output = {
    filename: '[hash:8].[name].js',
    path: '/',
    publicPath: '/assets/',
    chunkFilename: '[id].[chunkhash:8].[name].js',
  };

  plugins.push(
    new webpack.HotModuleReplacementPlugin()
  );

}

// Serve the Relay app
module.exports = {
  debug: __DEV__,
  devtool: __DEV__ ? 'cheap-module-eval-source-map' : false,
  entry,
  module: {
    loaders: [
      {
        exclude: /node_modules/,
        loader: 'babel',
        query,
        test: /\.js$/,
      },

      { test: /\.css$/, loader: 'style-loader!css-loader' },
      { test: /\.less$/, loader: 'style-loader!css-loader!less-loader' },

      { test: /\.gif$/, loader: 'url-loader', query: {mimetype: 'image/png'}, },
      { test: /\.woff(2)?(\?v=[0-9].[0-9].[0-9])?$/, loader: 'url-loader', query: {mimetype: 'application/font-woff'}, },

      { test: /\.svg$/, loader: 'url-loader', query: {} },

      { test: /\.(ttf|eot|svg)(\?v=[0-9].[0-9].[0-9])?$/, loader: 'file-loader', query: {name: '[name].[ext]'}, },

      { test: /\.(png)$/, loader: 'url-loader', query: {limit: 100000}, },

      { test: /\.jpg$/, loader: 'file-loader' },
      {
        // exclude: /node_modules/,
        test: /\.json/,
        loader: 'json',
      },

      {
        exclude: /node_modules/,
        test: /\.scss$/,
        loader: __DEV__
          ? ExtractTextPlugin.extract('style', 'css?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]!sass')
          : ExtractTextPlugin.extract('style', 'css?minimize&modules&importLoaders=1&localIdentName=[hash:base64:5]!sass'),
      },

    ]
  },
  output,
  plugins,
};
