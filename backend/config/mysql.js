"use strict";
var mysql = require('mysql');

var pool = mysql.createPool({
  connectionlimit: 10,
  host: '127.0.0.1',
  user: 'root',
  password: '',
  port: 3306,
  database: 'studykeeper'
});

/**
 * Returns die connection in the callback
 *
 * @param callback Function to be executed with the Connection
 */
function getConnection(callback) {
  pool.getConnection(function (err, connection) {
    if (err) {
      console.error('Error connecting to the database: ' + err.stack);
    } else {
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

/**
 * Closes the MySql Pool with all connections
 */
module.exports.cleanup = function() {
  pool.end(function (err){
    if (err){
      console.log(err);
    } else {
      console.log('The mysql pool with all its connections have been closed.');
    }
  });
};
