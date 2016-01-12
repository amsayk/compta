export default {
  path: '/',
  getComponent(location, cb) {
    return require.ensure([], (require) => {
      cb(null, require('../components/App'));
    })
  },
  indexRoute: {
    getComponent(location, cb) {
      return require.ensure([], (require) => {
        cb(null, require('../components/Home'))
      })
    }
  },
  childRoutes: [],
};
