import Parse from 'parse';

export function logIn(email, password, cb) {
  return Parse.User.logIn(email, 'default').then(function(user){
    return user.toJSON();
  });
}

export function logOut() {
  return Parse.User.logOut();
}

export function handleParseError(err) {
  switch (err.code) {
    case Parse.Error.INVALID_SESSION_TOKEN:
      Parse.User.logOut();
      break;
  }
}
