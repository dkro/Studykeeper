var mysql     = require('mysql');
var connection;

connection = mysql.createConnection({
  host     : '127.0.0.1',
  user     : 'root',
  password : '',
  port     : 3306,
  database : 'UserstudyManager'
});

connection.connect(function(err) {
if (err) {
  console.error('error connecting to the database: ' + err.stack);
  return;
}

console.log('mysql: connected as id ' + connection.threadId);
});


module.exports.connection = connection;
