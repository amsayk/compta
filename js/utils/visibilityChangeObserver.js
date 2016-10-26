import auth from './auth';

import Parse from 'parse';

export default function doSetupVisibilityChangeObserver() {
  let timeout = null;

  function logOut() {
    if(timeout){
      window.clearTimeout(timeout);
      timeout = null;
    }

    const user = Parse.User.current();

    if(user){
      auth.logOut(user);
    }

  }

  function cb() {
    console.log(`[VISIBILITY CHANGED]: ${document.visibilityState}`);

    // fires when user switches tabs, apps, goes to homescreen, etc.
    if (document.visibilityState === 'hidden') {
      timeout = window.setTimeout(logOut, /* 10 minutes */10 * 60 * 1000);
    }

    // fires when app transitions from prerender, user returns to the app / tab.
    if (document.visibilityState === 'visible') {
      if(timeout){
        window.clearTimeout(timeout);
        timeout = null;
      }
    }

  }


  cb();

  // subscribe to visibility change events
  document.addEventListener('visibilitychange', cb);
}
