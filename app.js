const express = require('express');
const path = require('path');
const useragent = require('express-useragent');

const cors = require('cors');
const ParseServer = require('parse-server').ParseServer;

const moment = require('moment');

moment.locale('fr');

// const locale = require('locale');

const morgan = require('morgan');

// const SUPPORTED_LOCALES = [
//   'en',
//   'fr'
// ];

const __DEV__ = process.env.NODE_ENV !== 'production';

const APP_PORT = process.env.PORT || 5000;

const databaseUri = process.env.DATABASE_URI || process.env.MONGOLAB_URI;
if (!databaseUri) {
  console.log('DATABASE_URI not specified, falling back to localhost.');
}

const mountPath = process.env.PARSE_MOUNT || '/parse';

const SERVER_URL = process.env.SERVER_URL || `http://localhost:${APP_PORT}${mountPath}`;

const api = new ParseServer({
  databaseURI: databaseUri || 'mongodb://localhost:27017/dev',
  cloud: path.resolve(process.cwd(), 'cloud', 'main.js'),
  appId: process.env.APPLICATION_ID,
  javascriptKey: process.env.JAVASCRIPT_KEY,
  masterKey: process.env.MASTER_KEY,
  serverURL: SERVER_URL,
  enableAnonymousUsers: typeof process.env.ANON_USERS !== 'undefined' ? process.env.ANON_USERS : false,
  allowClientClassCreation: true,
  maxUploadSize: '25mb',
});

function setup(server = express()) {
  server.use(cors());

  // Serve the Parse API on the /parse URL prefix
  server.use(mountPath, api);

  // server.use(locale(SUPPORTED_LOCALES));
  server.use(useragent.express());

  __DEV__ || (process.env.SECURE === 'true' && server.use(https()));

  __DEV__ || server.use(require('compression')({}));

  // use morgan to log requests to the console
  __DEV__ && server.use(morgan('combined', {}));

  let assets = undefined;

  function getAssets() {
    if(__DEV__ || typeof assets === 'undefined'){
      const fileData = require('fs').readFileSync(path.resolve(process.cwd(), 'webpack-assets.json'), 'utf8');
      assets = JSON.parse(fileData);
    }

    return assets;
  }

  // Rendering

  server.set('views', path.resolve(process.cwd(), 'public'));
  server.set('view engine', 'html');

  server.engine('html', require('ejs').renderFile);

  // Serve static resources

  [ '/', '/index.html', '/assets/', '/apps*', '/login', '/account', '/reset' ].forEach(route => {
    server.get(route, (req, res) => {

      switch (req.useragent.browser) {
        case 'Chrome':

          if(req.useragent.isMobile){
            // Mobile error
            res.end('Sorry, Mobile is unsupported :(');
          }else{
            res.render('index', {
              dev: __DEV__,
              assets: getAssets(),
              port: APP_PORT,
              locale: 'fr', // req.locale,
            });
          }

          break;

        default:
          // Invalid user agent
          res.end('Sorry, unsupported browser. Please use Google Chrome. :(');
      }

    });
  });

  process.env.SERVE_ASSETS === 'true' && server.use(
    '/assets/', express.static(path.resolve(process.cwd(), 'public')));

  return server;
}

function createApp(cb) {
  if (__DEV__) {
    const webpack = require('webpack');
    const WebpackDevServer = require('webpack-dev-server');

    const buildConfig = require('./webpack.config.js');

    const compiler = webpack(buildConfig);

    const devServer = new WebpackDevServer(compiler, {
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

      setup,
    });

    return cb(devServer);
  }

  const app = setup();

  return cb(app);
}

createApp((app) => {
  const server = app.listen(APP_PORT, (err) => {
    if (err) {
      throw err;
    }

    (function (){
      const Parse = require('parse/node');

      Parse.initialize(
        process.env.APPLICATION_ID,
        process.env.JAVASCRIPT_KEY,
        process.env.MASTER_KEY
      );

      Parse.serverURL = SERVER_URL;

      Parse.CoreManager.set(
        'REQUEST_ATTEMPT_LIMIT', 0
      );

      Parse.Promise.when([
        Parse.Cloud.run('initialization', {}),
        Parse.Cloud.run('initUsers', {}),
        Parse.Cloud.run('initSeq', { id: process.env.SEQ_ID, })
      ]).then(function(){
        console.log('Server initialized.');
      }, function(err){
        console.log('Error initialing server:', err);
        throw err;
      });

    })();

    // function handleShutdown() {
    //   console.log('Termination signal received. Shutting down.');
    //   (__DEV__ ? app : server).close(function () {
    //     process.exit(0);
    //   });
    // }
    // process.on('SIGTERM', handleShutdown);
    // process.on('SIGINT', handleShutdown);

    console.log(`App is now running on http://localhost:${APP_PORT}`);
  });
});

function https() {

  function isSecure(req) {
    // Check the trivial case first.
    if (req.secure) {
      return true;
    }
    // Check if we are behind Application Request Routing (ARR).
    // This is typical for Azure.
    if (req.headers['x-arr-log-id']) {
      return typeof req.headers['x-arr-ssl'] === 'string';
    }
    // Check for forwarded protocol header.
    // This is typical for AWS.
    return req.headers['x-forwarded-proto'] === 'https';
  }

  return function(req, res, next) {
    if (isSecure(req)) {
      return next();
    }
    // Note that we do not keep the port as we are using req.hostname
    // and not req.headers.host. The port number does not really have
    // a meaning in most cloud deployments since they port forward.
    res.redirect('https://' + req.hostname + req.originalUrl);
  };
}
