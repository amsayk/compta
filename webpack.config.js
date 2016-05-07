import webpack from 'webpack';
import path from 'path';
import AssetsPlugin from 'assets-webpack-plugin';
import VendorChunkPlugin from 'webpack-vendor-chunk-plugin';

import assign from 'object-assign';

import pkg from './package.json';

const excl = Object.keys(pkg.devDependencies).map(function(i){
    return new RegExp('node_modules/' + i);
});

import ExtractTextPlugin from 'extract-text-webpack-plugin';

const __DEVELOPMENT__ = process.env.NODE_ENV !== 'production';

const APP_PORT = process.env.PORT || 5000;

const vendors = [
  'alt',
  'alt-container',
  // 'alt-utils',
  'babel-polyfill',
  'base64-arraybuffer',
  'classnames',
  // 'cldr',
  // 'cldr-data',
  'dataloader',
  'debug',
  'dom-helpers',
  // 'faker',
  'fbjs',
  'globalize',
  // 'graphiql',
  'graphql',
  'graphql-custom-datetype',
  'graphql-custom-types',
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
  'moment-range',
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

const query = {
  cacheDirectory: __DEVELOPMENT__,
  presets: [
    'react',
    'es2015',
    'stage-0',
    require('babel-preset-fbjs/configure')({
      autoImport: true,
      inlineRequires: true,
      rewriteModules: {
        map: assign({},
          require('fbjs-scripts/third-party-module-map'),
          require('fbjs/module-map'),
          {
            React: 'react',
            ReactDOM: 'react-dom',
          },
        ),
      },
      stripDEV: !__DEVELOPMENT__,
    }),
  ],
  plugins: [
    'transform-runtime',
    path.resolve(__dirname, 'build', 'babelRelayPlugin'),
    'transform-decorators-legacy',
    // [path.resolve(__dirname, 'build', 'rewrite-modules'), {
    //   map: { ...require('fbjs/module-map'),
    //     React: 'react',
    //     ReactDOM: 'react-dom',
    //   },
    //   prefix: '',
    // }],
    // ['react-intl', {
    //   messagesDir: path.resolve(process.cwd(), 'build', 'messages'),
    //   enforceDescriptions: false
    // }],
  ],
};

let entry = {
  main: [
    path.resolve(process.cwd(), 'js', 'app.js'),
  ],

  vendors
};

let output = {
  filename: '[hash:8].app.js',
  path: path.resolve(process.cwd(), 'public', 'js'),
  publicPath: '/js/',
  chunkFilename: '[id].[chunkhash:8].app.js',
};

if(!__DEVELOPMENT__){

  query.plugins = query.plugins.concat(
    [
      'babel-plugin-remove-proptypes',
      'transform-react-constant-elements',
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

}else {

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
    filename: '[hash:8].app.js',
    path: '/',
    publicPath: '/js/',
    chunkFilename: '[id].[chunkhash:8].app.js',
  };

  plugins.push(
    new webpack.HotModuleReplacementPlugin()
  );

}

// Serve the Relay app
module.exports = {
  noParse: excl,
  debug: __DEVELOPMENT__,
  devtool: __DEVELOPMENT__ ? 'cheap-module-eval-source-map' : undefined,
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
      { test: /\.(ttf|eot|svg)(\?v=[0-9].[0-9].[0-9])?$/, loader: 'file-loader', query: {name: '[name].[ext]'}, },

      { test: /\.(png)$/, loader: 'url-loader', query: {limit: 100000}, },

      { test: /\.jpg$/, loader: 'file-loader' },

      { test: /globalize/, loader: 'imports?define=>false' },

      {
        // exclude: /node_modules/,
        test: /\.json/,
        loader: 'json',
      },

      {
        exclude: /node_modules/,
        test: /\.scss$/,
        loader: ExtractTextPlugin.extract('style', 'css?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]!sass'),
      },

    ]
  },
  output,
  plugins
};
