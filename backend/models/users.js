"use strict";
var mysql      = require('../config/mysql');
var crypt      = require('../utilities/encryption');
var uuid       = require('node-uuid');

module.exports.getUsers = function(callback) {
  mysql.getConnection(function(connection) {
    connection.query("SELECT u.id, u.username, r.name AS role, u.lmuStaff, u.mmi," +
      "u.firstname,u.lastname " +
      "FROM users u " +
      "LEFT JOIN roles r ON r.id=u.role ",
      function(err,result){
        connection.release();
        callback(err,result);
      }
    );
  });
};

module.exports.getUserById = function(id, callback) {
  mysql.getConnection(function(connection) {
    connection.query("SELECT u.id, u.username, r.name AS role, u.lmuStaff, u.mmi," +
      "u.firstname,u.lastname " +
      "FROM users u " +
      "LEFT JOIN roles r ON r.id=u.role " +
      "WHERE u.id=?;",
      id,
      function(err,result){
        connection.release();
        callback(err,result);
      }
    );
  });
};

// used by passport. password has to be included
module.exports.getUserByName = function(username, callback) {
  mysql.getConnection(function(connection) {
    connection.query("SELECT u.id, u.username, u.password, r.name AS role, u.lmuStaff, u.mmi, u.firstname, u.lastname " +
                      "FROM users u " +
                      "LEFT JOIN roles r ON u.role=r.id " +
                      "WHERE u.username=?;",
                      username,
      function(err,result) {
        if (err) {
          callback(err)
        } else {
          connection.release();
          callback(err,result);
        }
      }
    );
  });
};

module.exports.getUserByToken = function(token, callback) {
  mysql.getConnection(function(connection) {
    connection.query( "SELECT u.id, r.name AS role, u.lmuStaff, u.mmi, u.firstname, u.lastname FROM users u " +
                      "INNER JOIN auth a ON u.id=a.userId " +
                      "LEFT JOIN roles r ON u.role=r.id " +
                      "WHERE token=?;",
                      token,
      function(err,result){
        connection.release();
        callback(err,result);
      }
    );
  });
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
    mysql.getConnection(function(connection) {
      connection.query( "INSERT INTO users (username,password,role,firstname,surname,lmuStaff,mmi) " +
        "VALUES (?,?,(SELECT id FROM roles WHERE name=?),?,?,?,?);",
        [queryData.username,
          queryData.password,
          queryData.role,
          queryData.firstname,
          queryData.lastname,
          queryData.lmuStaff,
          queryData.mmi],
        function(err,result){
          connection.release();
          callback(err,result);
        }
      );
    });
  });
};

module.exports.setRole = function(data, callback) {
  mysql.getConnection(function(connection) {
    connection.query("UPDATE users " +
      "SET role=(SELECT name FROM roles WHERE name=?) " +
      "WHERE username=?;",
      [data.role, data.username],
      function(err,result){
        connection.release();
        callback(err,result);
      }
    );
  });
};

module.exports.getUserRole = function(username, callback){
  mysql.getConnection(function(connection) {
    connection.query("SELECT name FROM roles WHERE " +
      "id=(SELECT role FROM users WHERE username=?);",
      username,
      function(err,result){
        connection.release();
        callback(err,result);
      }
    );
  });
};


// ------------------- TOKENS -------------------------------

module.exports.getToken = function (token, callback){
  mysql.getConnection(function(connection) {
    connection.query("SELECT token FROM auth WHERE token=?",
      token,
      function(err,result){
        connection.release();
        callback(err,result);
      }
    );
  });
};

module.exports.createTokenForUser = function (data,callback) {
  var queryData = {
      username: data.username,
      token: uuid.v1(),
      timestamp: new Date()};
  mysql.getConnection(function(connection) {
    connection.query( "INSERT INTO auth (userId,token,timestamp) " +
      "VALUES((SELECT id FROM users WHERE username=?),?,?);",
      [queryData.username,queryData.token,queryData.timestamp],
      function(err,result){
        connection.release();
        callback(err,result);
      }
    );
  });
};

module.exports.getTokensForUser = function (data,callback) {
  var queryData = {
    username: data.username};
  mysql.getConnection(function(connection) {
    connection.query("SELECT token, timestamp FROM auth WHERE " +
      "userId=(SELECT id FROM users WHERE username=?);",
      queryData.username,
      function(err,result){
        connection.release();
        callback(err,result);
      }
    );
  });
};

module.exports.deleteTokensForUserBeforeTimestamp= function (username, timestamp, callback) {
  var queryData = {
    username: username,
    timestamp: timestamp
  };
  mysql.getConnection(function(connection) {
    connection.query("DELETE FROM auth " +
      "WHERE userId=(SELECT id FROM users WHERE username=?) " +
      "AND timestamp < ?",
      [queryData.username,queryData.timestamp],
      function(err,result){
        connection.release();
        callback(err,result);
      }
    );
  });
};

module.exports.deleteToken = function (token, callback) {
  mysql.getConnection(function(connection) {
    connection.query("DELETE FROM auth WHERE token=?",
      token,
      function(err,result){
        connection.release();
        callback(err,result);
      }
    );
  });
};

module.exports.updateToken = function(token, callback) {
  var queryData = {
    token: token,
    timestamp: new Date()};
  mysql.getConnection(function(connection) {
    connection.query("UPDATE auth SET timestamp=? WHERE token=?;",
      [queryData.timestamp,queryData.token],
      function(err,result){
        connection.release();
        callback(err,result);
      }
    );
  });
};

module.exports.getTokenTimestamp = function(token, callback) {
  mysql.getConnection(function(connection) {
    connection.query("SELECT timestamp FROM auth WHERE token=?;",
      token,
      function(err,result){
        connection.release();
        callback(err,result);
      }
    );
  });
};

// ------------------------- MISC -------------------------

module.exports.setLMUStaff = function(username, isLMUstaff, callback) {
  var flag = 0;
  if (isLMUstaff) {
    flag = 1;
  }
  mysql.getConnection(function(connection) {
    connection.query("UPDATE users SET lmuStaff=? WHERE username=?",
      [flag,username],
      function(err,result){
        connection.release();
        callback(err,result);
      }
    );
  });
};

module.exports.setPassword = function(password, username, callback) {
  crypt.cryptPassword(password, function(err,hash){
    if (err) {
      callback(err);
    }

    password = hash;
    mysql.getConnection(function(connection) {
      connection.query( "UPDATE users " +
        "SET password=? " +
        "WHERE username=?;",
        [password,username],
        function(err,result){
          connection.release();
          callback(err,result);
        }
      );
    });
  });
};

// ------------------------- END --------------------------


