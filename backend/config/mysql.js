var mysql     = require('mysql');

module.exports = function(config) {
  this.connection = mysql.createConnection({
    host     : '0.0.0.0',
    user     : 'root',
    password : '',
    port     : 3306,
    database : 'test'
  });

  connection.connect(function(err) {
  if (err) {
    console.error('error connecting to the database: ' + err.stack);
    return;
  }

  console.log('mysql: connected as id ' + connection.threadId);
  });
};
