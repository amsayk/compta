require('./mutations/company');
require('./mutations/account');

// const accounts = require('./accounts');
const setup = require('./setup');

const Company = require('./types').Company;
const getCurrentSeqObject = require('./utils').getCurrentSeqObject;
const formatError = require('./utils').formatError;

Parse.Cloud.define('initialization', function (request, response) {

  const query = new Parse.Query(Company);
  query.find().then(function (companies) {

    const _promises = [];

    companies.forEach(function (company) {
      // console.log('Found company: ' + company.get('displayName'));
      _promises.push(setup(company));
    });

    return Parse.Promise.when(_promises);
  }).then(function () {
    response.success({ok: true, message: 'Success!'});
  }, function () {
    response.error('Initialize failed');
  });
});


Parse.Cloud.define('initSeq', function (request, response) {
  response.success({ok: true, message: 'Success!'});

  // const Seq = Parse.Object.extend('Seq');

  // const query = new Parse.Query(Seq);
  // query.get(request.params.id, {
  //   success(o){
  //     response.success({ok: true, message: 'Success!'});
  //   },
  //   error(){
  //     const e = new Seq();
  //     e.objectId = request.params.id;
  //     e.save(null, {
  //       success(o){
  //         response.success({ok: true, message: 'Success!'});
  //       },
  //       error(err){
  //         response.error('initSeq failed: ' + formatError(err));
  //       },
  //     })
  //   },
  // });
});

Parse.Cloud.define('getCurrentSeq', function (request, response) {
  getCurrentSeqObject(function (error, result) {
    if (error) {
      response.error();
      return;
    }

    response.success({result: result});
  });
});

Parse.Cloud.define('doFindUsers', function (request, response) {
  const qy = new Parse.Query(Parse.User);
  qy.find({useMasterKey: true}).then(function (objects) {
    console.log('found: ', objects);
    // objects.forEach(function(o){
    //   o.destroy({useMasterKey: true});
    // });
    response.success(objects);
  }, function (err) {
    response.error(err);
  });
});

Parse.Cloud.define('initUsers', function (request, response) {

  function doAdd(obj) {
    console.log(obj.displayName + ' doesn\'t exist, creating now...');

    const p = new Parse.User();

    p.set('password', 'default');
    p.set('email', obj.email);
    p.set('username', obj.username);

    p.set('displayName', obj.displayName);

    return p.signUp(null, {
      useMasterKey: true,
      success: function (user) {
        console.log('Successfully created user `', user.get('displayName'), '`');
      },
      error: function (user, err) {
        console.error('Error creating user `' + obj.displayName + '`: ', err);
      }
    });
  }

  const promises = require('../data/_User.js').results.map(function (obj) {

    const qy = new Parse.Query(Parse.User);
    qy.find({useMasterKey: true}).then(function (objects) {
      console.log('found: ', objects.map(function (o) {
        return o;
      }));
      // objects.forEach(function(o){
      //   o.destroy({useMasterKey: true});
      // });
    });

    const query = new Parse.Query(Parse.User);
    query.equalTo('username', obj.username);

    return query.first({
      useMasterKey: true, error: function (err) {
        return doAdd(obj);
      }, success: function (o) {
        if (!o) {
          return doAdd(obj);
        }
        return Promise.resolve(o);
      }
    });

  });

  Promise.all(promises).then(
    function () {
      response.success({});
    },
    function (err) {
      response.error(err);
    }
  );
});
