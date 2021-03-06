export default function clientMiddleware() {
  return ({dispatch, getState}) => {
    return next => action => {
      if (typeof action === 'function') {
        return action(dispatch, getState);
      }

      const { promise, types, ...rest } = action; // eslint-disable-line no-redeclare
      if (!promise) {
        return next(action);
      }

      const [ REQUEST, SUCCESS, FAILURE ] = types;
      next({...rest, type: REQUEST});
      return promise().then(
        (result) => next({...rest, result, type: SUCCESS}),
        (error) => next({...rest, error, type: FAILURE})
      ).catch((error)=> {

        if(process.env.NODE_ENV !== 'production'){
          console.error('MIDDLEWARE ERROR:', error);
        }

        next({...rest, error, type: FAILURE});
      });
    };
  };
}
