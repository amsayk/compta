const Seq = require('./types').Seq;
const SEQ_ID = process.env.SEQ_ID;

const formater = require('error-formatter');

const Company = require('./types').Company;

const ACCOUNTS = require('./accounts');

module.exports.formatError = function (error) {
  // var errMsg = '';
  // if(Array.isArray(error)){
  //   errMsg = error.reduce(
  //     function (result, next) {
  //       if(next){
  //         result.push(next.toString());
  //       }
  //       return result;
  //     }, []).join('\n');
  // }else {
  //   errMsg = error.toString();
  // }
  //
  // console.error(errMsg);
  // return errMsg;

  return formater(error);
};

module.exports.createParseObjectPointer = function createParseObjectPointer(Parse, className, id){
  const Obj = Parse.Object.extend(className);
  return Obj.createWithoutData(id);
};

module.exports.makeAlias = function makeAlias(designation){
  return !!designation ? String(designation).toLowerCase().split(/\s+/).join('_') : undefined;
};

module.exports.getTransactionSequence = function getTransactionSequence(company, callback) {
  const query = new Parse.Query(Seq);
  query.get(SEQ_ID, {
    success: function (object) {
      const key = 'transaction_sequence_' + company.id;
      if(object.has(key)){
        object.increment(key);
      }else{
        object.set(key, 1000);
      }
      object.save(null, {
        success: function (object) {
          const no = object.get(key);
          callback(null, no);
        },
        error: function (object, error) {
          callback(error);
        }
      });
    }, error: function (error) {
      callback(error);
    }
  });
};
module.exports.getPaymentOfBillsTransactionSequence = function getPaymentOfBillsTransactionSequence(company, callback) {
  const query = new Parse.Query(Seq);
  query.get(SEQ_ID, {
    success: function (object) {
      const key = 'payments_transaction_sequence_' + company.id;
      if(object.has(key)){
        object.increment(key);
      }else{
        object.set(key, 0);
      }
      object.save(null, {
        success: function (object) {
          const no = object.get(key);
          callback(null, no);
        },
        error: function (object, error) {
          callback(error);
        }
      });
    }, error: function (error) {
      callback(error);
    }
  });
};

module.exports.resetTransactionsSeq = function (company) {
  const query = new Parse.Query(Seq);
  return query.get(SEQ_ID).then(
    function (object) {

      let hasTransaction = false;
      let hasPaymentsTransaction = false;

      (function(){
        const key = 'transaction_sequence_' + company.id;
        if(object.has(key)){
          hasTransaction = true;
        }else{
          object.set(key, 1000);
        }
      })();

      (function(){
        const key = 'payments_transaction_sequence_' + company.id;
        if(object.has(key)){
          hasPaymentsTransaction = true;
        }else{
          object.set(key, 0);
        }
      })();

      if(hasTransaction && hasPaymentsTransaction){
        return Parse.Promise.as(object);
      }

      return object.save(null, {
        success: function () {
          // console.log('resetTransactionsSeq: Success.');
        },
        error: function (object, error) {
          // console.error('resetTransactionsSeq Error: ' + error);
        }
      });
    }, function (error) {
      // console.error('resetTransactionsSeq Error: ' + error);
    }
  );
};

module.exports.getCurrentSeqObject = function getCurrentSeqObject(callback) {
  const query = new Parse.Query(Seq);
  return query.get(SEQ_ID, {
    success: function (object) {
      callback(null, object);
    }, error: function (error) {
      callback(error);
    }
  });
};

module.exports.withCompany = function withCompany(id, cb){
  const query = new Parse.Query(Company);
  query.get(id, {
    success(company){ cb(null, company); },
    error(err){ cb(err); },
  })
}

module.exports.getAccountName = function getAccountName(code){
  return ACCOUNTS[code].name;
}

module.exports.formatAddress = function formatAddress(a) {
  var lines = [];
  if (a.address) lines.push(a.address);
  if (a.address2) lines.push(a.address2);
  if (a.address3) lines.push(a.address3);
  if (a.city || a.subdivision || a.postalCode) {
    var line = [];
    if (a.city) line.push(a.city);
    if (a.subdivision) line.push(a.subdivision);
    if (a.postalCode) line.push(a.postalCode);
    lines.push(line.join(' '));
  }
  return lines;
}


// const moment = require('moment-range');
//
// module.exports.getCompanyPeriods = function getCompanyPeriods(company, end) {
//   function getPeriodRange() {
//     return moment.range(
//       moment().month('January').startOf('month'), // Jan 1
//       moment().month('December').endOf('month') // December 31
//     );
//   }
//
//   const startDate = moment(company.createdAt).startOf('year');
//   const endDate = (end ? moment(end) : moment()).endOf('year');
//
//   const dates = [];
//
//   const range = moment.range(startDate, endDate);
//
//   range.by(getPeriodRange(), function (moment) {
//     dates.push(moment.toDate());
//   });
//
//   // console.log('getCompanyPeriods in range: ' + range.toString() + " returns " + JSON.stringify(dates));
//
//   return dates;
// };
