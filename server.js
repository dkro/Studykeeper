// Create Restify Server
var restify   = require('restify');
var port      = process.env.PORT || 8080;
var app       = restify.createServer({
  name : 'UserstudyManager API'
});

// Bootstrap Application
var config = require('./config/config.js');

require('./config/mysql.js')(config);

require('./config/passport.js')();

require('./config/routes.js')(app);

// Start Restify Server
app.pre(restify.pre.userAgentConnection()); // Just for curl
app.listen(port, function(){
  console.log('%s listening at %s', app.name, app.url);
});
