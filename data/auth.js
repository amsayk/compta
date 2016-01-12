import Parse from 'parse/node';

Parse.initialize(
  process.env.APPLICATION_ID,
  process.env.JAVASCRIPT_KEY
);

export function logIn(email, cb) {
  process.nextTick(function () {
    Parse.User.logIn(email, "default", {
      success(user) {
        cb(null, user.toJSON());
      },
      error(user, error) {
        cb(error, user ? user.toJSON() : undefined);
      }
    });
  });
}

export function getUserFromPayload({sessionToken}, cb) {
  process.nextTick(function () {
    _become({sessionToken}).then(function (user) {
      cb(null, user);
    }, function (error) {
      cb(error);
    });
  });
}

function _become(options) {
  const user = new Parse.User();
  const RESTController = Parse.CoreManager.getRESTController();
  return RESTController.request(
    'GET', 'users/me', {}, options
  ).then((response, status) => {
    user._finishFetch(response);
    user._setExisted(true);
    return user;
  });
}
