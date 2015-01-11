"use strict";
var mysql      = require('../config/mysql');

module.exports.addNews = function (news, callback) {
  mysql.getConnection(function(connection) {
    connection.query('INSERT INTO news (title,date,description,link) VALUES (?,?,?,?)',
      [news.title,news.date,news.description,news.link],
      function(err,result){
        connection.release();
        callback(err,result);
      }
    );
  });
};

module.exports.editNews = function (news, callback) {
  mysql.getConnection(function(connection) {
    connection.query('UPDATE news SET ' +
      'title=?, ' +
      'date=?, ' +
      'description=?, ' +
      'link=? ' +
      'WHERE id=?',
      [news.title,news.date,news.description,news.link,news.id],
      function(err,result){
        connection.release();
        callback(err,result);
      }
    );
  });
};

module.exports.getAllNews = function (callback) {
  mysql.getConnection(function(connection) {
    connection.query('SELECT * FROM news ',
      function(err,result){
        connection.release();
        callback(err,result);
      }
    );
  });
};

module.exports.getNewsById = function (id, callback) {
  mysql.getConnection(function(connection) {
    connection.query('SELECT * FROM news WHERE id=?',
      id,
      function(err,result){
        connection.release();
        callback(err,result);
      }
    );
  });
};

module.exports.mapNewstoUserstudy = function (news, userstudy, callback) {
  mysql.getConnection(function(connection) {
    connection.query('UPDATE userstudies ' +
      'SET newsId=? ' +
      'WHERE id=? ',
      [news.id,userstudy.id],
      function(err,result){
        connection.release();
        callback(err,result);
      }
    );
  });
};

