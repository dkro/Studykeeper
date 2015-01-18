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
    connection.query('SELECT n.id, n.title, n.date, n.description, n.link, ' +
    'GROUP_CONCAT(DISTINCT snr.studyId) AS userstudies ' +
    'FROM news n ' +
    'LEFT JOIN studies_news_rel snr ON n.id=snr.newsId ' +
    'GROUP BY n.id;',
      function(err,result){
        connection.release();
        callback(err,result);
      }
    );
  });
};

/**
 *
 * Get the database row from the news table
 *
 * @returns array for all news for id
 * @params string newsid
 * @type {function(this:exports.query)}
 */
module.exports.getNewsById = mysql.query.bind(mysql.query,
  'SELECT n.id, n.title, n.date, n.description, n.link, ' +
  'GROUP_CONCAT(DISTINCT snr.studyId) AS userstudies ' +
  'FROM news n ' +
  'LEFT JOIN studies_news_rel snr ON n.id=snr.newsId ' +
  'WHERE n.id=? ' +
  'GROUP BY n.id;');


module.exports.mapNewstoUserstudy = function (news, userstudy, callback) {
  mysql.query('UPDATE userstudies ' +
      'SET newsId=? ' +
      'WHERE id=? ',
      [news.id,userstudy.id],
       callback
    );
};

