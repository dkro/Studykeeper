var mysql      = require('../config/mysql');
var crypt      = require('../utilities/encryption');
var uuid       = require('node-uuid');

exports.getUsers = function(callback) {
  var query = connection.query('SELECT * FROM users;', callback);
};


exports.getUserByName = function(data, callback) {
  var queryData = [
    {UserName : data.username}
  ];
  connection.query("SELECT * FROM users WHERE username=?;",
                    queryData[0].UserName, callback);
};

exports.getUserByToken = function(data, callback) {
  var queryData = [
    {token : data}
  ];
  connection.query( "SELECT u.username FROM users u " +
                    "INNER JOIN auth a ON u.id=a.userId " +
                    "WHERE token=?;",
                    queryData[0].token,
                    callback);
};

exports.saveUser = function(data, callback) {
  var queryData = {username: data.username,
                   password: data.password,
                   role: data.role};

  crypt.cryptPassword(queryData.password, function(err,hash){
    if (err) {
      callback(err);
    }

    queryData.password = hash;
    var query = connection.query( "INSERT INTO users (username,password,role) " +
      "VALUES (?,?,(SELECT id FROM roles WHERE name=?));",
      [queryData.username,queryData.password,queryData.role],
      callback);
  });
};

exports.setRole = function(data, callback) {
  var queryData = {username: data.username,
     role: data.role};
  var query = connection.query("INSERT INTO", queryData, callback);
};

exports.getUserRole = function(data, callback){
  var queryData = {username: data.username};
  connection.query("SELECT name FROM roles WHERE " +
    "id=(SELECT role FROM users WHERE username=?);",queryData.username,callback);
};

exports.createTokenForUser = function (data,callback) {
  var queryData = {
      username: data.username,
      token: uuid.v1(),
      timestamp: new Date()};
  connection.query( "INSERT INTO auth (userId,token,timestamp) " +
    "VALUES((SELECT id FROM users WHERE username=?),?,?);",
    [queryData.username,queryData.token,queryData.timestamp],
    callback);
};

exports.getTokensForUser = function (data,callback) {
  var queryData = {
    username: data.username};
  connection.query("SELECT token FROM auth WHERE " +
    "userId=(SELECT id FROM users WHERE username=?);",
    queryData.username,
    callback);
};

exports.deleteInvalidTokensForUser = function (data, callback) {
  var queryData = {
    username: data.username,
    timestamp: new Date()
  };
  connection.query("",
    [queryData.username,queryData.timestamp],
    callback)
};

exports.updateToken = function(token, callback) {
  var queryData = {
    token: token,
    timestamp: new Date()};
  connection.query("UPDATE auth SET timestamp=? WHERE token=?;",
    [queryData.timestamp,queryData.token],
    callback);
};

exports.getTokenTimestamp = function(token, callback) {
  connection.query("SELECT timestamp FROM auth WHERE token=?;",
    token,
    callback);
};

// TODO validate Tokens... delete old + update new
// make roles work.