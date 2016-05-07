import createLogger from 'redux-logger';

export default createLogger({
  predicate: () => false, // process.env.NODE_ENV !== 'production',
});
