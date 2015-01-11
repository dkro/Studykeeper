"use strict";
var connection = require('../config/mysql').connection;
var crypt      = require('../utilities/encryption');
var uuid       = require('node-uuid');

module.exports.getUsers = function(callback) {
  connection.query('SELECT * FROM users;', callback);
};

module.exports.getUserById = function(id, callback) {
  connection.query("SELECT * FROM users WHERE id=?;",
    id, callback);
};

module.exports.getUserByName = function(username, callback) {
  connection.query("SELECT * FROM users WHERE username=?;",
                    username, callback);
};

module.exports.getUserByToken = function(data, callback) {
  var queryData = [
    {token : data}
  ];
  connection.query( "SELECT u.id, r.name AS role, u.lmuStaff, u.mmi, u.firstname, u.surname FROM users u " +
                    "INNER JOIN auth a ON u.id=a.userId " +
                    "LEFT JOIN roles r ON u.role=r.id " +
                    "WHERE token=?;",
                    queryData[0].token,
                    callback);
};

module.exports.saveUser = function(data, callback) {
  var queryData = {username: data.username,
                   firstname: data.firstname,
                   lastname: data.lastname,
                   password: data.password,
                   role: data.role,
                   lmuStaff: data.lmuStaff,
                   mmi: data.mmi};

  crypt.cryptPassword(queryData.password, function(err,hash){
    if (err) {
      callback(err);
    }

    queryData.password = hash;
    connection.query( "INSERT INTO users (username,password,role,firstname,surname,lmuStaff,mmi) " +
      "VALUES (?,?,(SELECT id FROM roles WHERE name=?),?,?,?,?);",
      [queryData.username,
        queryData.password,
        queryData.role,
        queryData.firstname,
        queryData.lastname,
        queryData.lmuStaff,
        queryData.mmi],
      callback);
  });
};

module.exports.setRole = function(data, callback) {
  connection.query("UPDATE users " +
    "SET role=(SELECT name FROM roles WHERE name=?) " +
    "WHERE username=?;",
    [data.role, data.username],
    callback);
};

module.exports.getUserRole = function(username, callback){
  connection.query("SELECT name FROM roles WHERE " +
    "id=(SELECT role FROM users WHERE username=?);",username,callback);
};


// ------------------- TOKENS -------------------------------

module.exports.getToken = function (token, callback){
  connection.query("SELECT token FROM auth WHERE token=?",
    token,
    callback);
};

module.exports.createTokenForUser = function (data,callback) {
  var queryData = {
      username: data.username,
      token: uuid.v1(),
      timestamp: new Date()};
  connection.query( "INSERT INTO auth (userId,token,timestamp) " +
    "VALUES((SELECT id FROM users WHERE username=?),?,?);",
    [queryData.username,queryData.token,queryData.timestamp],
    callback);
};

module.exports.getTokensForUser = function (data,callback) {
  var queryData = {
    username: data.username};
  connection.query("SELECT token, timestamp FROM auth WHERE " +
    "userId=(SELECT id FROM users WHERE username=?);",
    queryData.username,
    callback);
};

module.exports.deleteTokensForUserBeforeTimestamp= function (username, timestamp, callback) {
  var queryData = {
    username: username,
    timestamp: timestamp
  };
  connection.query("DELETE FROM auth " +
    "WHERE userId=(SELECT id FROM users WHERE username=?) " +
    "AND timestamp < ?",
    [queryData.username,queryData.timestamp],
    callback);
};

module.exports.deleteToken = function (token, callback) {
  connection.query("DELETE FROM auth WHERE token=?",
    token,
    callback);
};

module.exports.updateToken = function(token, callback) {
  var queryData = {
    token: token,
    timestamp: new Date()};
  connection.query("UPDATE auth SET timestamp=? WHERE token=?;",
    [queryData.timestamp,queryData.token],
    callback);
};

module.exports.getTokenTimestamp = function(token, callback) {
  connection.query("SELECT timestamp FROM auth WHERE token=?;",
    token,
    callback);
};

// ------------------------- MISC -------------------------

module.exports.setLMUStaff = function(username, isLMUstaff, callback) {
  var flag = 0;
  if (isLMUstaff) {
    flag = 1;
  }
  connection.query("UPDATE users SET lmuStaff=? WHERE username=?",
    [flag,username],
    callback);
};

module.exports.setPassword = function(password, username, callback) {
  crypt.cryptPassword(password, function(err,hash){
    if (err) {
      callback(err);
    }

    password = hash;
    connection.query( "UPDATE users " +
      "SET password=? " +
      "WHERE username=?;",
      [password,username],
      callback);
  });
};

// ------------------------- END --------------------------


