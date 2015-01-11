"use strict";
var mysql      = require('../config/mysql');

module.exports.addLabel = function (label, callback) {
  mysql.getConnection(function(connection) {
    connection.query('INSERT INTO labels (title) VALUES (?)',
      label.title,
      function(err,result){
        connection.release();
        callback(err,result);
      }
    );
  });
};

module.exports.deleteLabel = function (label, callback) {
  mysql.getConnection(function(connection) {
    connection.query('DELETE FROM labels ' +
                      'WHERE id=?',
      [label.id,label.title],
      function(err,result){
        connection.release();
        callback(err,result);
      }
    );
  });
};

module.exports.getAllLabels = function (callback) {
  mysql.getConnection(function(connection) {
    connection.query('SELECT * FROM labels',
      function(err,result){
        connection.release();
        callback(err,result);
      }
    );
  });
};

module.exports.getLabelById = function (id, callback) {
  mysql.getConnection(function(connection) {
    connection.query('SELECT * FROM labels WHERE id=?',
      id,
      function(err,result){
        connection.release();
        callback(err,result);
      }
    );
  });
};

module.exports.mapLabeltoUserstudy = function (label, userstudy, callback) {
  mysql.getConnection(function(connection) {
    connection.query('INSERT INTO studies_labels_rel ' +
      '(studyId,labelId) ' +
      'VALUES (' +
      '(SELECT id FROM userstudies WHERE id=? AND title=?),' +
      '(SELECT id FROM labels WHERE id=? AND title=?));',
      [userstudy.id,userstudy.title,label.id,label.title],
      function(err,result){
        connection.release();
        callback(err,result);
      }
    );
  });
};
