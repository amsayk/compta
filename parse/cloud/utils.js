const Seq = Parse.Object.extend('Seq');
const SEQ_ID = 'Ir335eVQwb';

const moment = require('cloud/moment');
require('cloud/moment-range');

module.exports.getCompanyPeriods = function getCompanyPeriods(company, end) {
  const periodType = company.get('periodType');

  function getPeriodRange() {
    switch (periodType) {
      case 'MONTHLY':

        return 'month';

      case 'TRIMESTERLY':

        return moment.range(
          moment().month('January').startOf('month'), // Jan 1
          moment().month('March').endOf('month') // March 31
        );

      default:
        throw new Error('getPeriodRange: invalid periodType ' + periodType);
    }
  }

  function generatePeriod(date) {
    switch (periodType) {
      case 'MONTHLY':

        return 'M' + (date.getMonth() + 1) + '/' + date.getFullYear();

      case 'TRIMESTERLY':

        return 'Q' + Math.ceil((date.getMonth() + 1) / 4) + '/' + date.getFullYear();

      default:

        throw new Error('generatePeriod: invalid periodType ' + periodType);
    }
  }

  const startDate = moment(company.createdAt).startOf('month');
  const endDate = (end ? moment(end) : moment()).endOf('month');

  const dates = [];

  const range = moment.range(startDate, endDate);

  range.by(getPeriodRange(), function (moment) {
    dates.push(generatePeriod(moment.toDate()));
  });

  console.log('getCompanyPeriods in range: ' + range.toString() + " returns " + JSON.stringify(dates));

  return dates;
};


module.exports.encodePeriod = function encodePeriod(period) {
  return period.replace('/', '_');
};

module.exports.getSequence = function getSequence(company, callback) {
  const query = new Parse.Query(Seq);
  query.get(SEQ_ID, {
    success: function (object) {
      object.increment('sequence_' + company.id);
      object.save(null, {
        success: function (object) {
          callback(null, object.get('sequence_' + company.id));
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

module.exports.resetSeq = function (company) {
  const query = new Parse.Query(Seq);
  return query.get(SEQ_ID).then(
    function (object) {
      object.set('sequence_' + company.id, 0);
      return object.save(null, {
        success: function (object) {
          console.log('resetSeq: Success.');
        },
        error: function (object, error) {
          console.error('resetSeq Error: ' + error);
        }
      });
    }, function (error) {
      console.error('resetSeq Error: ' + error);
    }
  );
};

//module.exports.getCurrentSequence = function getCurrentSequence(company, callback) {
//  const query = new Parse.Query(Seq);
//  return query.get(SEQ_ID, {
//    success: function (object) {
//      callback(null, object.get('sequence_' + company.id));
//    }, error: function (error) {
//      callback(error);
//    }
//  });
//};

//module.exports.getCurrentSequenceMany = function getCurrentSequenceMany(keys, callback) {
//  const query = new Parse.Query(Seq);
//  return query.get(SEQ_ID, {
//    success: function (object) {
//      callback(null, keys.reduce((result, key) => {
//        result[key] = object.get('sequence_' + key);
//        return result;
//      }, {}));
//    }, error: function (error) {
//      callback(error);
//    }
//  });
//};

module.exports.getCurrentSeq = function getCurrentSeq(callback) {
  const query = new Parse.Query(Seq);
  return query.get(SEQ_ID, {
    success: function (object) {
      callback(null, object);
    }, error: function (error) {
      callback(error);
    }
  });
};
