const resetSeq = require('cloud/utils').resetSeq;
const encodePeriod = require('cloud/utils').encodePeriod;
const getSequence = require('cloud/utils').getSequence;

const AccountClass = function (company, period) {
  const name = 'Account_' + company.id + '_' + encodePeriod(period);
  return Parse.Object.extend(name);
};

module.exports = function setup(company){
  const COMPANY_ID = company.id;

  const Transaction = Parse.Object.extend('Transaction_' + COMPANY_ID);
  const Operation = Parse.Object.extend('Operation_' + COMPANY_ID);

  // Set seq number before save
  Parse.Cloud.beforeSave(Transaction, function (request, response) {

    if (request.object.isNew()) {
      getSequence(request.object.get('company'), function (err, sequence) {
        if (err) {
          response.error('Could not get a sequence.');
          return;
        }

        request.object.set('transactionNr', sequence);
        response.success();
      });
    } else {
      response.success();
    }

  });

  // Add Operation to its Account when one is created and mark dirty!
  Parse.Cloud.afterSave(Operation, function (request) {
    const operation = request.object;

    const company = operation.get('company');
    const period = operation.get('period');
    const periodType = operation.get('periodType');
    const code = operation.get('accountCode');

    const Account = AccountClass(company, period);
    const query = new Parse.Query(Account);

    query.equalTo('code', code);
    return query.first().then(function (object) {
      if (object) {
        const relation = object.relation('operations');
        relation.add(operation);
        return object.save({dirty: true});
      } else {

        const account = new Account();
        const _account = accounts[code];

        if (!_account) {
          throw new Error('Invalid account code:' + code);
        }

        const props = {
          code: code,
          name: _account.name,
          cache_classCode: _account._classCode,
          cache_categoryCode: _account._categoryCode,
          cache_groupCode: _account._groupCode,
          dirty: false,
          company: company,
          period: period,
          periodType: periodType,
        };

        return account.save(props).then(function (object) {
          const relation = object.relation('operations');
          relation.add(operation);
          return object.save({dirty: true});
        });
      }
    }).then(function () {
      },
      function (error) {
      });

  });

  // Remove Operation relations from Account and mark dirty when the operation is deleted!
  Parse.Cloud.afterDelete(Operation, function (request) {
    const operation = request.object;

    const company = operation.get('company');
    const period = operation.get('period');
    const accountCode = operation.get('accountCode');

    const Account = AccountClass(company, period);
    const query = new Parse.Query(Account);

    query.equalTo('code', accountCode);
    return query.first().then(function (account) {
      if (account) {
        const relation = account.relation('operations');
        relation.remove(operation);
        return account.save({dirty: true});
      }
    }).then(function () {
      },
      function (error) {
      });

  });

  // Delete all its operations when a Transaction is deleted!
  Parse.Cloud.afterDelete(Transaction, function (request) {
    const transaction = request.object;
    // const company = transaction.get('company');

    const query = new Parse.Query(Operation);
    query.equalTo('transaction', transaction);
    // query.equalTo('company', company);

    return query.find().then(function (ops) {
      return Parse.Object.destroyAll(ops);
    }).then(function () {
    }, function (error) {
    });
  });

  resetSeq(company);
};
