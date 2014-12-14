var mysql     = require('mysql');

module.exports = function(config) {
  this.connection = mysql.createConnection({
    host     : '127.0.0.1',
    user     : 'root',
    password : '1234',
    port     : 3306,
    database : 'userstudymanager'
  });

  connection.connect(function(err) {
  if (err) {
    console.error('error connecting to the database: ' + err.stack);
    return;
  }

  console.log('mysql: connected as id ' + connection.threadId);
  });
};
