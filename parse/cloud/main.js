require('cloud/mutations/company');

//const accounts = require('cloud/accounts');
const setup = require('cloud/setup');

const Company = require('cloud/types').Company;
const getCurrentSeq = require('cloud/utils').getCurrentSeq;

Parse.Cloud.define('initialize', function (request, response) {
  const query = new Parse.Query(Company);
  query.each(function (company) {
    console.log('Found company: ' + company.get('displayName'));
    setup(company);
  }).then(
    function () {
      response.success();
    },
    function () {
      response.error();
    }
  );
});

//Parse.Cloud.define('getSeq', function (request, response) {
//  getCurrentSequenceMany(request.params.keys, function(error, result){
//    if(error){
//      response.error();
//      return;
//    }
//
//    response.success({result});
//  })
//});

Parse.Cloud.define('getCurrentSeq', function (request, response) {
  getCurrentSeq(function(error, result){
    if(error){
      response.error();
      return;
    }

    response.success({result: result});
  })
});


//function encode_period(period) {
//  return period.replace('/', '_');
//}
//
//const AccountClass = function (company, period) {
//  const name = 'Account_' + company.id + '_' + encode_period(period);
//  return Parse.Object.extend(name);
//};
//
//function createOperation(company, op) {
//  const o = new Operation();
//  Object.keys(op).forEach(function (key) {
//    o.set(key, op[key]);
//  });
//
//  o.set('company', company);
//
//  return o;
//}
//
//function generatePeriod(company, date) {
//  const periodType = company.get('periodType');
//  switch (periodType) {
//    case 'MONTHLY':
//      return periodType[0] + (date.getMonth() + 1) + '/' + date.getFullYear();
//    case 'TRIMESTERLY':
//      return periodType[0] + Math.ceil(date.getMonth() / 4) + '/' + date.getFullYear();
//    default:
//      throw new Error('generatePeriod: invalid periodType ' + periodType);
//  }
//}

//Parse.Cloud.define("deleteTransactions", function (request, response) {
//  const q = new Parse.Query(Transaction);
//
//  q.find().then(function (transactions) {
//    return Parse.Object.destroyAll(transactions);
//  }).then(function () {
//    response.success('All transactions deleted');
//  }, function (error) {
//    response.error(error);
//  });
//
//});

//Parse.Cloud.define("deleteAccounts", function (request, response) {
//  const q = new Parse.Query(AccountClass({id: COMPANY_ID}, 'M1/2016'));
//
//  q.find().then(function (accounts) {
//    return Parse.Object.destroyAll(accounts);
//  }).then(function () {
//    response.success('All accounts deleted');
//  }, function (error) {
//    response.error(error);
//  });
//
//});

//Parse.Cloud.define("addTransaction", function (request, response) {
//  const query = new Parse.Query(Company);
//
//  query.get(COMPANY_ID)
//    .then(function (company) {
//
//      const user = request.user;
//
//      const date = new Date();
//
//      const period = generatePeriod(company, date);
//
//      const t = new Transaction();
//      t.set('company', company);
//      t.set('period', period);
//      t.set('periodType', company.get('periodType'));
//      t.set('date', date);
//      t.set('user', user);
//
//      return t.save(null).then(function (transaction) {
//        const ops = [
//          createOperation(company, {
//            transaction: transaction,
//            accountCode: '5.1.4.1',
//            amount: 400,
//            type: 'DEBIT',
//            period: period,
//            periodType: company.get('periodType'),
//            date: date,
//            user: user,
//          }).save(null),
//
//          createOperation(company, {
//            transaction: transaction,
//            accountCode: '5.1.6.1',
//            amount: 9600,
//            type: 'DEBIT',
//            period: period,
//            periodType: company.get('periodType'),
//            date: date,
//            user: user,
//          }).save(null),
//
//          createOperation(company, {
//            transaction: transaction,
//            accountCode: '5.1.4.3',
//            amount: 10000,
//            type: 'CREDIT',
//            period: period,
//            periodType: company.get('periodType'),
//            date: date,
//            user: user,
//          }).save(null),
//        ];
//
//        return Parse.Promise.when(ops).then(function (){
//          const operations = Array.prototype.slice.call(arguments);
//          const relation = transaction.relation('operations');
//          relation.add(operations);
//          return transaction.save(null);
//        });
//      }).then(function () {
//          response.success('Transaction saved');
//        },
//        function (transaction, error) {
//          response.error(error);
//        });
//
//    }, function (error) {
//      response.error(error);
//    });
//});

