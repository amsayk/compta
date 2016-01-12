import Parse from 'parse';
// import jwt from 'jsonwebtoken';

Parse.initialize(
  process.env.APPLICATION_ID,
  process.env.JAVASCRIPT_KEY
);

const storage = /*process.env.NODE_ENV !== 'production' ? {} : */localStorage;

export default{
  login(email, cb) {
    doLogin(email, (err, res) => {

      if (err) {
        this.onChange(false);
        cb(false);
        return;
      }

      const {ok, token} = res;

      if (ok) {
        storage.token = token;

        //const {payload: {sessionToken}} = jwt.decode(token, { complete: true }) || {};

        // This will make Parse.User.current() work
        //Parse.User.become(sessionToken).then((user) => {
        //  cb(true);
        //  this.onChange(true);
        //}, (error) => {
        //  cb(false);
        //  this.onChange(false);
        //});

        this.onChange(true);
        cb(true);

      } else {
        this.onChange(false);
        cb(false);
      }
    });
  },

  getToken() {
    return storage.token;
  },

  logOut(cb) {
    delete storage.token;
    // Parse.User.logOut();

    this.onChange(false);
    if (cb) cb();
  },

  isLoggedIn() {
    return !!storage.token; // && Parse.User.current();
  },

  onChange() {
  }
};

function doLogin(email, cb) {
  fetch('/auth/login', {
    method: 'POST',
    body: `email=${encodeURIComponent(email)}`,
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8'
    },
  }).then(function (response) {
    return response.json();
  }).then((res) => {
    cb(null, res);
  }, () => {
    cb(new Error())
  });
}
