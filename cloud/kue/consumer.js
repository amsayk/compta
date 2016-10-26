const kue = require('kue');
const Redis = require('ioredis');

var redis = {
  createClientFactory: function() {
      return new Redis({
        host: process.env.REDIS_HOST,
        port: process.env.REDIS_PORT,
        password: process.env.REDIS_PASSWORD,
        db: 0
      });
    }
};

const queue = kue.createQueue({
  prefix: 'q',
  redis,
});

queue.watchStuckJobs();

process.once( 'SIGTERM', function ( sig ) {
  queue.shutdown(5000, function(err) {
    console.log('Kue shutdown: ', err || 'OK');
    process.exit(0);
  });
});

process.once('uncaughtException', function (err) {
  console.error('Something bad happened: ', err);
  queue.shutdown(1000, function (err) {
    console.error('Kue shutdown result: ', err || 'OK');
    process.exit(0);
  });
});

queue.process('email', function(job, done){
  console.log(job.data);

  setTimeout(function(){
    console.log('email sent');
    done();
  }, 3000);

});
