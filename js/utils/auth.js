import Parse from 'parse';

import Relay from 'react-relay';

import {Schema as schema} from '../../data/schema/index';

import RelayLocalSchema from 'relay-local-schema';

import LogInMutation from '../mutations/LogInMutation';
import LogOutMutation from '../mutations/LogOutMutation';

Parse.initialize(
  process.env.APPLICATION_ID,
  process.env.JAVASCRIPT_KEY
);

Relay.injectNetworkLayer(
  new RelayLocalSchema.NetworkLayer({
    schema,
    onError: (errors, request) => console.error(errors, request),
  })
);

const auth = {
  sendEmail(email, cb){
    cb(null);
  },
  login(email, password, cb) {

    Relay.Store.commitUpdate(new LogInMutation({
      email,
      password,
    }), {
      onSuccess: function ({logIn: { user}}) {
        cb(null, {user});
      },
      onFailure: function (transaction) {
        cb(transaction.getError());
      },
    });
  },

  logOut(user, cb) {
    Relay.Store.commitUpdate(new LogOutMutation({
      viewerId: user.id,
    }), {
      onSuccess: function ({logIn: { user}}) {
        cb(null, {user});
      },
      onFailure: function (transaction) {
        cb(transaction.getError());
      },
    });
  },

  isLoggedIn() {
    return !!Parse.User.current();
  }
};

export default auth;
