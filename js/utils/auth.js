import Parse from 'parse';

import Relay from 'react-relay';

import {Schema as schema,} from '../../data/schema/index';

import RelayNetworkLayer from './RelayNetworkLayer';

import LogInMutation from '../mutations/LogInMutation';
import LogOutMutation from '../mutations/LogOutMutation';

Relay.injectNetworkLayer(
  new RelayNetworkLayer({
    schema,
    onError(errors, request) {
      errors.forEach(error => {
        console.log(error.toString());
        console.log('Source', error.source);
        console.log('Positions', error.positions);
        console.log('Locations', error.locations);
      });
    },
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
      onSuccess: function ({logIn: { user, }}) {
        cb(null, {user});
      },
      onFailure: function (transaction) {
        cb(transaction.getError());
      },
    });
  },

  logOut(user, cb) {

    Relay.Store.commitUpdate(new LogOutMutation({
      viewer: user,
    }), {
      onSuccess: function () {

        const login = localStorage.getItem('app.login');

        localStorage.clear();

        if(login){
          localStorage.setItem('app.login', login);
        }

        cb(null);
      },
      onFailure: function (transaction) {
        cb(transaction.getError());
      },
    });
  },

  get isLoggedIn() {
    return !!Parse.User.current();
  },

};

export default auth;
