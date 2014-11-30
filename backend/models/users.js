var mysql = require('../config/mysql');

exports.getUsers = function(callback) {
  var query = connection.query('SELECT * FROM users;', callback);
};

exports.getUserByName = function(data, callback) {
  var queryData = [
    {UserName : data.username}
  ];
  var query = connection.query("SELECT * FROM users WHERE username=?;", queryData[0].UserName, callback);
  console.log(query.sql);
};

exports.getUserByToken = function(data, callback) {
  var queryData = [
    {token : data}
  ];
  console.log(queryData);
  var query = connection.query( "SELECT u.username FROM users u\
                                       INNER JOIN auth a ON u.id=a.userId\
                                       WHERE token=?;",
                                queryData[0].token, callback);
  console.log(query.sql);
};