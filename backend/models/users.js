"use strict";
var mysql      = require('../config/mysql');
var crypt      = require('../utilities/encryption');
var uuid       = require('node-uuid');

module.exports.getUsers = function(callback) {
  mysql.getConnection(function(connection) {
    connection.query("SELECT u.id, u.username, r.name AS role, u.lmuStaff, u.mmi," +
      "u.firstname,u.lastname," +
      "GROUP_CONCAT(DISTINCT sur.studyId) AS registeredFor, " +
      "GROUP_CONCAT(DISTINCT ust.id) AS isTutorFor, " +
      "GROUP_CONCAT(DISTINCT usex.id) AS isExecutorFor " +
      "FROM users u " +
      "LEFT JOIN roles r ON r.id=u.role " +
      "LEFT JOIN studies_users_rel sur ON u.id=sur.userId " +
      "LEFT JOIN userstudies ust ON u.id=ust.tutorId " +
      "LEFT JOIN userstudies usex ON u.id=usex.executorId " +
      "WHERE u.visible=1 " +
      "GROUP BY u.id;",
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
      "WHERE u.id=? AND u.visible=1;",
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
                      "WHERE u.username=? AND u.visible=1;",
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
    connection.query( "SELECT u.id, u.username, r.name AS role, u.lmuStaff, u.mmi, u.firstname, u.lastname FROM users u " +
                      "INNER JOIN auth a ON u.id=a.userId " +
                      "LEFT JOIN roles r ON u.role=r.id " +
                      "WHERE token=? AND u.visible=1;",
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
                   mmi: data.mmi,
                   collectsMMI: data.collectsMMI};

  crypt.cryptPassword(queryData.password, function(err,hash){
    if (err) {
      callback(err);
    }
    mysql.getConnection(function(connection) {
      connection.query( "INSERT INTO users " +
        "(username,password,role,firstname,lastname,lmuStaff,mmi,collectsMMI) " +
        "VALUES (?,?,(SELECT id FROM roles WHERE name=?),?,?,?,?,?);",
        [queryData.username,
          hash,
          queryData.role,
          queryData.firstname,
          queryData.lastname,
          queryData.lmuStaff,
          queryData.mmi,
          queryData.collectsMMI],
        function(err,result){
          connection.release();
          callback(err,result);
        }
      );
    });
  });
};

module.exports.editUser = function(data,callback){
  var queryData = {username: data.username, firstname: data.firstname, lastname: data.lastname,
    role: data.role, lmuStaff: data.lmuStaff, mmi: data.mmi, collectsMMI:data.collectsMMI, id:data.id};

    mysql.getConnection(function(connection) {
      connection.query( "UPDATE users SET " +
        "username=?, " +
        "role=(SELECT id FROM roles WHERE name=?), " +
        "firstname=?, " +
        "lastname=?, " +
        "lmuStaff=?, " +
        "mmi=?, " +
        "collectsMMI=? " +
        "WHERE id=?",
        [queryData.username,
          queryData.role,
          queryData.firstname,
          queryData.lastname,
          queryData.lmuStaff,
          queryData.mmi,
          queryData.collectsMMI,
          queryData.id],
        function(err,result){
          connection.release();
          callback(err,result);
        }
    );
  });
};

module.exports.getUserRole = function(userId, callback){
  mysql.getConnection(function(connection) {
    connection.query("SELECT name FROM roles WHERE " +
      "id=(SELECT role FROM users WHERE id=?);",
      userId,
      function(err,result){
        connection.release();
        callback(err,result);
      }
    );
  });
};

module.exports.getRole = function(roleId, callback){
  mysql.getConnection(function(connection) {
    connection.query("SELECT * FROM roles WHERE id=?",
      roleId,
      function(err,result){
        connection.release();
        callback(err,result);
      }
    );
  });
};

module.exports.deleteUser = function(userId, callback){
  var secret = uuid.v1();

  crypt.cryptPassword(secret, function(err,hash){
    if (err) {
      callback(err);
    }

    mysql.getConnection(function(connection){
      connection.query("UPDATE users SET username='deleted" + userId + "', firstname='deleted', lastname='deleted', " +
        "password='" + hash + "' " +
        "WHERE id=?",
        userId,
        function(err,result){
          connection.release();
          callback(err,result);
        }
      );
    });
  });
};

module.exports.getOpenStudieIdsForExecutor = function(userId, callback){
  mysql.getConnection(function(connection){
    connection.query("SELECT us.id FROM userstudies us " +
      "LEFT JOIN users u ON u.id=us.executorId " +
      "WHERE u.id=? AND us.closed=0 AND us.visible=1",
      userId,
      function(err,result){
        connection.release();
        callback(err,result);
      }
    );
  });
};

module.exports.getOpenStudieIdsForTutor = function(userId, callback){
  mysql.getConnection(function(connection){
    connection.query("SELECT us.id FROM userstudies us " +
      "LEFT JOIN users u ON u.id=us.tutorId " +
      "WHERE u.id=? AND us.closed=0 AND us.visible=1",
      userId,
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
    connection.query("SELECT * FROM auth WHERE token=?",
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
      role: data.role,
      token: uuid.v1(),
      timestamp: new Date()};
  mysql.getConnection(function(connection) {
    connection.query( "INSERT INTO auth (userId,roleId,token,timestamp) " +
      "VALUES((SELECT id FROM users WHERE username=?)," +
      "(SELECT id FROM roles WHERE name=?),?,?);",
      [queryData.username,queryData.role,queryData.token,queryData.timestamp],
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


