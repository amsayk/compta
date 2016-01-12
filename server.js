import express from 'express';
import graphQLHTTP from 'express-graphql';
import path from 'path';
import webpack from 'webpack';
import WebpackDevServer from 'webpack-dev-server';
import {Schema} from './data/schema/index';

import assign from 'object-assign';

import {logIn, getUserFromPayload} from './data/auth';

import bodyParser from 'body-parser';
import morgan from 'morgan';

import jwt from './express-jwt';
import { sign as jwtSign } from 'jsonwebtoken';

import ExtractTextPlugin from 'extract-text-webpack-plugin';

const APP_PORT = process.env.PORT || 5000;
const GRAPHQL_PORT = 9090;

// Expose a GraphQL endpoint
const graphQLServer = express();
graphQLServer.use('/', jwt({ secret: process.env.APP_SECRET, getUser: getUserFromPayload }), graphQLHTTP(req => ({
  graphiql: true,
  pretty: true,
  schema: Schema,
  rootValue: {user: req.user},
})));
graphQLServer.listen(GRAPHQL_PORT, () => console.log(
  `GraphQL Server is now running on http://localhost:${GRAPHQL_PORT}`
));

const __DEV__ = process.env.NODE_ENV !== "production";

const plugins = [
  new ExtractTextPlugin('app.css', {
    allChunks: true
  }),
  new webpack.HotModuleReplacementPlugin(),
  new webpack.DefinePlugin({
    'process.env': {
      NODE_ENV: JSON.stringify(__DEV__ ? 'development' : 'production'),
      APPLICATION_ID: JSON.stringify(process.env.APPLICATION_ID),
      JAVASCRIPT_KEY: JSON.stringify(process.env.JAVASCRIPT_KEY),
    }
  }),
  new webpack.optimize.OccurenceOrderPlugin(),
  new webpack.optimize.DedupePlugin(),
  // Avoid publishing files when compilation fails
  new webpack.NoErrorsPlugin(),
];

if(__DEV__){
  plugins.push(
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        hoist_vars: true,
        screw_ie8: true,
        warnings: false,
      },
    })
  );
}

// Serve the Relay app
const compiler = webpack({
  debug: __DEV__,
  devtool: __DEV__ ? 'cheap-module-eval-source-map' : 'cheap-module-source-map',
  entry: [

    // For hot style updates
    'webpack/hot/dev-server',

    // The script refreshing the browser on none hot updates
    `webpack-dev-server/client?http://localhost:${APP_PORT}`,

    path.resolve(__dirname, 'js', 'app.js')
  ],
  module: {
    loaders: [
      {
        exclude: /node_modules/,
        loader: 'babel',
        query: {
          presets: ["es2015", "stage-0", "react"],
          plugins: [
            './build/babelRelayPlugin',
            'transform-decorators-legacy',
            ['babel-plugin-module-map', assign({}, require('fbjs/module-map'), {
              React: 'react',
              ReactDOM: 'react-dom',
            })],
            ['react-intl', {
              messagesDir: "./build/messages/",
              enforceDescriptions: true
            }],
          ],
          cacheDirectory: true,
          env: {
            production: {
              plugins: ["transform-react-constant-elements"],
            }
          },
        },
        test: /\.js$/,
      },

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
  output: {
    filename: 'app.js',
    path: '/',
    publicPath: '/js/',
    chunkFilename: '[id].app.js',
  },
  plugins,
});
const app = new WebpackDevServer(compiler, {
  contentBase: '/public/',
  proxy: {'/graphql': `http://localhost:${GRAPHQL_PORT}`},
  publicPath: '/js/',

  // Configure hot replacement
  hot: __DEV__,

  // The rest is terminal configurations
  quiet: false,
  noInfo: false,
  stats: {colors: true},

  setup(server){
    __DEV__ || server.use(require('compression')({}));

    // use morgan to log requests to the console
    __DEV__ && server.use(morgan('combined', {}));

    // ---------------------------------------------------------
    // get an instance of the router for auth routes
    // ---------------------------------------------------------
    const authRoutes = express.Router();

    authRoutes.use(bodyParser.urlencoded({ extended: false }));

    // ---------------------------------------------------------
    // authentication (no middleware necessary since this isn't authenticated)
    // ---------------------------------------------------------
    authRoutes.post('/login', function(req, res) {

      if(!req.body.email){
        res.status(400).send({
          ok: false,
          message: 'Username required!',
        });
        return;
      }

      // find the user
      logIn(req.body.email, function(err, user) {

        if (err) {
          res.json({ ok: false, message: 'Authentication failed. User not found.' });
          return;
        }

        // create a token
        jwtSign(user, process.env.APP_SECRET, {
          // expiresIn: 24 * 60 * 60 // expires in 24 hours
        }, token => {

          res.json({
            ok: true,
            message: 'Enjoy your token!',
            token,
          });
        });

      });
    });

    server.use('/auth', authRoutes);

  }
});

// Serve static resources
app.use('/', express.static(path.resolve(__dirname, 'public')));
app.listen(APP_PORT, () => {
  console.log(`App is now running on http://localhost:${APP_PORT}`);
});
