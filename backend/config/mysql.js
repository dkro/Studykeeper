"use strict";
var mysql     = require('mysql');

var pool = mysql.createPool({
  connectionlimit: 10,
  host     : '127.0.0.1',
  user     : 'root',
  password : '',
  port     : 3306,
  database : 'UserstudyManager'
});

module.exports.getConnection = function(callback) {
  pool.getConnection(function(err, connection) {
    if (err) {
      console.error('Error connecting to the database: ' + err.stack);
    } else {
      console.log('Mysql: Using connection ' + connection.threadId + ' from pool');
      callback(connection);
    }
  });
};

module.exports.pool = pool;
