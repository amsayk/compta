import express from 'express';
import path from 'path';
import useragent from 'express-useragent';

// import locale from 'locale';

import morgan from 'morgan';

// const SUPPORTED_LOCALES = [
//   'en',
//   'fr'
// ];

const __DEVELOPMENT__ = process.env.NODE_ENV !== 'production';

const APP_PORT = process.env.PORT || 5000;

function setup(server = express()) {
  // server.use(locale(SUPPORTED_LOCALES));
  server.use(useragent.express());

  __DEVELOPMENT__ || server.use(require('compression')({}));

  // use morgan to log requests to the console
  __DEVELOPMENT__ && server.use(morgan('combined', {}));

  function getAssets() {
    const fileData = require('fs').readFileSync(
      path.resolve(process.cwd(), 'webpack-assets.json'), 'utf8');
    return JSON.parse(fileData);
  }

  // Rendering

  server.set('views', path.resolve(process.cwd(), 'public'));
  server.set('view engine', 'html');

  server.engine('html', require('ejs').renderFile);

  // Serve static resources

  [ '/', '/index.html', '/apps*', '/login', '/account', '/reset' ].forEach(route => {
    server.get(route, (req, res) => {

      switch (req.useragent.browser) {
        case 'Chrome':

          if(req.useragent.isMobile){
            // Mobile error
            res.end('Sorry, Mobile is unsupported :(');
          }else{
            res.render('index', {
              dev: __DEVELOPMENT__,
              assets: getAssets(),
              port: APP_PORT,
              locale: 'fr', // req.locale,
            });
          }

          break;

        default:
          // Invalid user agent
          res.end('Sorry, unsupported browser :(');
      }

    });
  });

  ['css', 'js'].forEach(p => {
    server.use(`/${p}`, express.static(path.resolve(process.cwd(), 'public', p)));
  });

  return server;
}

function createApp(cb) {
  if (__DEVELOPMENT__) {
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

    // function handleShutdown() {
    //   console.log('Termination signal received. Shutting down.');
    //   (__DEVELOPMENT__ ? app : server).close(function () {
    //     process.exit(0);
    //   });
    // }
    // process.on('SIGTERM', handleShutdown);
    // process.on('SIGINT', handleShutdown);

    console.log(`App is now running on http://localhost:${APP_PORT}`);
  });
});
