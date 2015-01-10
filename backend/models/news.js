"use strict";
var connection      = require('../config/mysql').connection;

module.exports.addNews = function (news, callback) {
  connection.query('INSERT INTO news (title,date,description,link) VALUES (?,?,?,?)',
    [news.title,news.date,news.description,news.link],
    callback);
};

module.exports.editNews = function (news, callback) {
  connection.query('UPDATE news SET ' +
    'title=?, ' +
    'date=?, ' +
    'description=?, ' +
    'link=? ' +
    'WHERE id=?',
    [news.title,news.date,news.description,news.link,news.id],
    callback);
};

module.exports.getAllNews = function (callback) {
  connection.query('SELECT * FROM news ', callback);
};

module.exports.getNewsById = function (id, callback) {
  connection.query('SELECT * FROM news WHERE id=?',
    id,
    callback);
};

module.exports.mapNewstoUserstudy = function (news, userstudy, callback) {
  connection.query('UPDATE userstudies ' +
    'SET newsId=? ' +
    'WHERE id=? ',
    [news.id,userstudy.id],
    callback);
};

