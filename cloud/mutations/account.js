const formatError = require('../utils').formatError;

Parse.Cloud.define('updateAccount', function (request, response) {
  const { displayName, email, } = request.params;

  if(!request.user/*  || !request.user.isCurrent() */){
    response.error(new Error('L\'utilisateur doit être connecté.'));
    return;
  }

  request.user.set({ displayName, email, username: email, });
  request.user.save(null, { useMasterKey: true, sessionToken: request.user.getSessionToken(), }).then(function () {
    response.success({});
  }, function (error) {
    response.error(formatError(error));
  });
});

Parse.Cloud.define('setPassword', function (request, response) {
  const { password } = request.params;

  if(!request.user/*  || !request.user.isCurrent() */){
    response.error(new Error('L\'utilisateur doit être connecté.'));
    return;
  }

  request.user.set({password});
  request.user.save(null, { useMasterKey: true, sessionToken: request.user.getSessionToken(), }).then(function () {
    response.success({});
  }, function (error) {
    response.error(formatError(error));
  });
});

Parse.Cloud.define('changePassword', function (request, response) {
  const { password, } = request.params;

  if(!request.user/*  || !request.user.isCurrent() */){
    response.error(new Error('L\'utilisateur doit être connecté.'));
    return;
  }

  request.user.set({password});
  request.user.save(null, { useMasterKey: true, sessionToken: request.user.getSessionToken(), }).then(function () {
    response.success({});
  }, function (error) {
    response.error(formatError(error));
  });
});