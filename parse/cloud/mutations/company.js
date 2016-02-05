const Company = require('cloud/types').Company;
const setup = require('cloud/setup');

const resetSeq = require('cloud/utils').resetSeq;
const encodePeriod = require('cloud/utils').encodePeriod;
const getCompanyPeriods = require('cloud/utils').getCompanyPeriods;

Parse.Cloud.define("addCompany", function (request, response) {
  const company = new Company();

  company.set('displayName', request.params.displayName);
  company.set('user', request.user);
  company.set('periodType', request.params.periodType);

  return company.save(null).then(
    function(object){response.success({addedCompanyId: object.id})},
    function(error){response.error(error)}
  );
});

Parse.Cloud.define("reset", function (request, response) {
  const query = new Parse.Query(Company);
  query.find().then(
    function(objects){
      return Parse.Object.destroyAll(objects);
    }
  ).then(
    function (result) {
      response.success({ok: true});
    },
    function(error){
      response.error(error);
    }
  );
});


Parse.Cloud.define("delCompany", function (request, response) {
  const company = new Company();
  company.id = request.params.id;

  return Parse.Promise.when([ company.destroy(), resetSeq(company), ]).then(

    function(result){
      console.log('Delete company returned: ' + JSON.stringify(result));
      response.success({deletedCompanyId: result.objectId})
    },

    function(error){
      response.error(error)
    }
  );
});

Parse.Cloud.beforeSave(Company, function(request, response) {
  if (request.object.get("displayName")) {
    request.object.set("displayNameLowerCase", request.object.get("displayName").toLowerCase());
  }

  response.success();
});

Parse.Cloud.afterSave(Company, function (request) {
  if (!request.object.existed()) {
    console.log('Company added: ' + request.object.get('displayName'));
    setup(request.object);
  }
});
Parse.Cloud.afterDelete(Company, function (request) {
  resetSeq(request.object);

  const promises = [];

  // Delete all transactions
  promises.push((function (){
    const Transaction = Parse.Object.extend('Transaction_' + request.object.id);
    const query = new Parse.Query(Transaction);
    query.equalTo('company', request.object);
    query.select([]);
    return query.find().then(function(objects){
      return Parse.Object.destroyAll(objects);
    });
  })());

  // Delete all operations
  promises.push((function (){
    const Operation = Parse.Object.extend('Operation_' + request.object.id);
    const query = new Parse.Query(Operation);
    query.equalTo('company', request.object);
    query.select([]);
    return query.find().then(function(objects){
      return Parse.Object.destroyAll(objects);
    });
  })());

  // Delete all accounts
  getCompanyPeriods(request.object, new Date()).forEach(function(p){
    const Account = Parse.Object.extend('Account_' + request.object.id + "_" + encodePeriod(p));
    const query = new Parse.Query(Account);
    query.equalTo('company', request.object);
    query.select([]);

    promises.push(
      query.find().then(function(objects){
        return Parse.Object.destroyAll(objects);
      })
    );
  });

  return Parse.Promise.when(promises)
    .then(
      function(result){
        console.log('afterDelete company success');
      },
      function(error){
        console.error('afterDelete company error');
      }
    );
});
