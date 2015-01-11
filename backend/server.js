"use strict";
// Create Restify Server
var restify   = require('restify');
var port      = process.env.PORT || 8080;
var app       = restify.createServer({
  name : 'UserstudyManager API'
});
app.use(restify.bodyParser({ mapParams: false}));

// Bootstrap Application
var config = require('./config/config.js');

var pool  = require('./config/mysql.js').pool;

require('./config/passport.js')();

require('./config/routes.js')(app);

// Start Restify Server
app.pre(restify.pre.userAgentConnection()); // Just for curl
app.listen(port, function(){
  console.log('%s listening at %s', app.name, app.url);
});

// Handle exit events
function exitHandler(options, err) {
  if (options.cleanup) {
    console.log('Cleaning up...');
    pool.end(function(err) {
      if (err){
        console.log(err);
      } else {
        console.log('Ending the database connection safely.');
      }
    });
  }
  if (err) console.log(err.stack);
  if (options.exit) process.exit();
}

//do something when app is closing
process.on('exit', exitHandler.bind(null,{cleanup:true}));
//catches ctrl+c event
process.on('SIGINT', exitHandler.bind(null, {cleanup:true, exit:true}));
//catches uncaught exceptions
process.on('uncaughtException', exitHandler.bind(null, {cleanup:true, exit:true}));