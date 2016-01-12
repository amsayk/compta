//
//
//Parse.Cloud.beforeSave("SomeClass", function (request, response) {
//
//  if (request.object.isNew()) {
//    getSequence(function(sequence) {
//      if (sequence) {
//        request.object.set("myAIColumn", sequence);
//        response.success();
//      } else {
//        response.error('Could not get a sequence.')
//      }
//    });
//  } else {
//    response.success();
//  }
//
//});
//
//function getCurrentSequence(callback) {
//  var Test = Parse.Object.extend("Sequence");
//  var query = new Parse.Query(Test);
//  //console.log('Getting the sequence object');
//  query.get("lQyJu5P86j", {
//    success: function(object) {
//      //console.log(object);
//      //console.log(object.get('sequence'));
//      callback(object.get('sequence'));
//    }, error: function (error) {
//      callback(undefined);
//    }
//  });
//}
//
//function getSequence(callback) {
//  var Test = Parse.Object.extend("Sequence");
//  var query = new Parse.Query(Test);
//  //console.log('Getting the Sequence object');
//  query.get("lQyJu5P86j", {
//    success: function(object) {
//      object.increment('sequence');
//      object.save(null,{
//        success:function(object) {
//          //console.log('In success from getSequence save');
//          callback(object.get('sequence'));
//        },
//        error:function(object,error) {
//          //console.log('In error from getSequence save');
//          //console.log(error);
//          callback(undefined);
//        }
//      });
//    }, error: function (error) {
//      //console.log('In error from getSeq get');
//      console.log(error);
//      callback(undefined);
//    }
//  });
//}
