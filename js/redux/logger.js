import createLogger from 'redux-logger';

export default createLogger({
  predicate: () => process.env.NODE_ENV !== 'production',
  collapsed: true,
  duration: true,
});
