import Parse from 'parse';

import Relay from 'react-relay';

import {Schema as schema,} from '../../data/schema/v2';

import RelayNetworkLayer from './RelayNetworkLayer';

import LogInMutation from '../mutations/LogInMutation';
import LogOutMutation from '../mutations/LogOutMutation';

Relay.injectNetworkLayer(
  new RelayNetworkLayer({
    schema,
    onError(errors, request) {
      errors.forEach(error => {
        if(process.env.NODE_ENV !== 'production'){
          console.log(error.toString());
          console.log('Source', error.source);
          console.log('Positions', error.positions);
          console.log('Locations', error.locations);
        }
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
      onSuccess: function ({logIn: { viewer: user, }}) {

        ga('set', 'dimension1', user.id);

        cb(null, {user});
      },
      onFailure: function (transaction) {
        cb(transaction.getError());
      },
    });
  },

  logOut(user) {

    Relay.Store.commitUpdate(new LogOutMutation({
      viewer: user,
    }), {
      onSuccess: function () {

        const login = localStorage.getItem('app.login');
        const NoVATWarningHidden = localStorage.getItem('VATSettings.warning.no-VAT.hidden');

        localStorage.clear();

        if(login !== null){
          localStorage.setItem('app.login', login);
        }

        if(NoVATWarningHidden !== null){
          localStorage.setItem('VATSettings.warning.no-VAT.hidden', NoVATWarningHidden);
        }

        setImmediate(() => {
          document.location = '/';
        });
      },
      onFailure: function (transaction) {
        console.error(transaction.getError());
      },
    });
  },

  get isLoggedIn() {
    return !!Parse.User.current();
  }

};

export default auth;
