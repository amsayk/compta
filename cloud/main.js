
Parse.Cloud.define("hello", function(request, response) {
  console.log('Ran cloud function.');
  response.success("Hello world! " + (request.params.a + request.params.b));
});

Parse.Cloud.beforeSave('Transaction', function (request, response) {

  if (request.object.isNew()) {
    getSequence(function (err, sequence) {
      if (err) {
        response.error('Could not get a sequence.');
        return;
      }

      request.object.set('_nr', sequence);
      response.success();
    });
  } else {
    response.success();
  }

});

var Seq = Parse.Object.extend('Seq');
var SEQ_ID = 'lQyJu5P86j';

//function getCurrentSequence(callback) {
//  var query = new Parse.Query(Seq);
//  // console.log('Getting the sequence object');
//  query.get(SEQ_ID, {
//    success: function (object) {
//      // console.log(object);
//      // console.log(object.get('sequence'));
//      callback(null, object.get('sequence'));
//    }, error: function (error) {
//      callback(error);
//    }
//  });
//}

function getSequence(callback) {
  var query = new Parse.Query(Seq);
  // console.log('Getting the Sequence object');
  query.get(SEQ_ID, {
    success: function (object) {
      object.increment('sequence');
      object.save(null, {
        success: function (object) {
          // console.log('In success from getSequence save');
          callback(null, object.get('sequence'));
        },
        error: function (object, error) {
          // console.log('In error from getSequence save');
          // console.log(error);
          callback(error);
        }
      });
    }, error: function (error) {
      // console.log('In error from getSeq get:', error);
      callback(error);
    }
  });
}

console.log('Deployed');
