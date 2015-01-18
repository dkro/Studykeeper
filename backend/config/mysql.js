"use strict";
var mysql = require('mysql');

var pool = mysql.createPool({
  connectionlimit: 10,
  host: 'localhost',
  user: '',
  password: '',
  port: 3306,
  database: 'studykeeper'
});


function getConnection(callback) {
  pool.getConnection(function (err, connection) {
    if (err) {
      console.error('Error connecting to the database: ' + err.stack);
    } else {
      console.log('Mysql: Using connection ' + connection.threadId + ' from pool');
      callback(connection);
    }
  });
}

module.exports.getConnection = getConnection;

/**
 * Wraps getting a connection and releasing the connection around
 * a query call
 */
module.exports.query = function () {
  var args = Array.prototype.slice.call(arguments),
    callback = args.pop();

  getConnection(function (connection) {

    args.push(function callbackQueryMock(error, result) {
      connection.release();
      return callback(error, result);
    });

    connection.query.apply(connection, args);
  });

};

module.exports.cleanup = function() {
  pool.end(function (err){
    if (err){
      console.log(err);
    } else {
      console.log('The mysql pool with all its connections have been closed.');
    }
  });
};
