"use strict";
var restify   = require('restify');
var bunyan    = require('bunyan');
var port      = process.env.PORT || 10001;

// Initialize the logger
var log = new bunyan.createLogger({
  name: 'studykeeper',
  streams: [
    {
      stream: process.stdout,
      level: 'trace'
    },
    {
      type: 'rotating-file',
      path: 'server.log',
      level: 'info',
      period: '1d',   // daily rotation
      count: 1        // keep 1 back copy
    }
  ],
  serializers: bunyan.stdSerializers
});

// Create the Restify Server
var app       = restify.createServer({
  name : 'UserstudyManager',
  log: log
});
app.use(restify.bodyParser({ mapParams: false}));

// Bootstrap Application
var mysql  = require('./config/mysql.js');

require('./config/passport.js')();

require('./config/routes.js')(app);

// Start Restify Server
app.pre(restify.pre.userAgentConnection()); // Just for curl
app.listen(port, function(){
  console.log('%s listening at %s', app.name, app.url);
});

app.pre(function (request, response, next) {
  request.log.info({req: request}, 'start');
  return next();
});
app.on('after', function (req, res, route) {
  req.log.info({res: res}, "finished");
});

var auditLogger = bunyan.createLogger({
  name: 'audit',
  stream: process.stdout
});
app.on('after', restify.auditLogger({
  log: auditLogger
}));

// Handle exit events
function exitHandler(options, err) {
  var log = bunyan.createLogger({
    name: 'exit',
    streams: [{
      path: './exit.log'
    },{
      stream: process.stdout
    }]
  });
  log.info(options);
  log.info(err);

  if (options.cleanup) {
    console.log('Cleaning up...');
    mysql.cleanup();
  }
  if (err) {
    console.log(err.stack);
  }
  if (options.exit) {
    process.exit();
  }
}

//do something when app is closing
process.on('exit', exitHandler.bind(null,{cleanup:true}));
//catches ctrl+c event
process.on('SIGINT', exitHandler.bind(null, {cleanup:true, exit:true}));
//catches uncaught exceptions
process.on('uncaughtException', exitHandler.bind(null, {cleanup:true, exit:true}));