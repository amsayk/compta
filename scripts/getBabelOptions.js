import assign from 'object-assign';

export default function(options) {
  options = assign({
    env: 'production',
    moduleMap: {},
    plugins: [],
  }, options);
  return {
    plugins: options.plugins,
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
            options.moduleMap
          ),
        },
        stripDEV: options.env === 'production',
      }),
    ],
  };
};
