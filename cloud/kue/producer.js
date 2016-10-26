const kue = require('kue');
const Redis = require('ioredis');

var redis = {
  createClientFactory: function () {
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

process.once('SIGTERM', function (sig) {
  queue.shutdown(5000, function (err) {
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

queue.on('error', function (err) {
  console.log('Oops... ', err);
});

process.once('SIGTERM', function (sig) {
  queue.shutdown(5000, function (err) {
    console.log('Kue shutdown: ', err || '');
    process.exit(0);
  });
});

queue.on('job enqueue', function (id, type) {
  console.log('Job %s got queued of type %s', id, type);

}).on('job complete', function (id, result) {
  kue.Job.get(id, function (err, job) {
    if (err) return;
    job.remove(function (err) {
      if (err) throw err;
      console.log('removed completed job #%d', job.id);
    });
  });
});

let sequence = 0;

setInterval(function () {

  sequence += 1;

  (function (sequence) {

    const job = queue.create('email', {
      title: 'Hello #' + sequence,
      to: 'cisse.amadou.9@gmail.com',
      body: 'Hello from amadou',
    }).save(function (err) {

    });


    console.log('created job #' + sequence + ' with id ' + job.id);

    // job.on('complete', function(){
    //   console.log('job ' + sequence + ' completed!');
    // });

    // job.on('failed', function(){
    //   console.log('job ' + sequence + ' failed !');
    // });

    job.on('complete', function (result) {
      console.log('Job completed with data ', result);

    }).on('failed attempt', function (errorMessage, doneAttempts) {
      console.log('Job failed');

    }).on('failed', function (errorMessage) {
      console.log('Job failed');

    }).on('progress', function (progress, data) {
      console.log('\r  job #' + job.id + ' ' + progress + '% complete with data ', data);

    });

  })(sequence);

}, 1000);
