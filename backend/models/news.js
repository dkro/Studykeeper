"use strict";
var connection      = require('../config/mysql').connection;

module.exports.addNews = function (news, callback) {
  connection.query('INSERT INTO news (title,date,description,link) VALUES (?,?,?,?)',
    [news.title,news.date,news.description,news.link],
    callback);
};

module.exports.getAllNews = function (callback) {
  connection.query('SELECT * FROM news ', callback);
};

module.exports.getNews = function (news, callback) {
  connection.query('SELECT * FROM news WHERE title=? AND id=?',
    [news.title,news.id],
    callback);
};

module.exports.mapNewstoUserstudy = function (news, userstudy, callback) {
  connection.query('UPDATE userstudies ' +
    'SET newsId=? ' +
    'WHERE id=? ',
    [news.id,userstudy.id],
    callback);
};

