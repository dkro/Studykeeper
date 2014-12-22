"use strict";
var connection      = require('../config/mysql').connection;

module.exports.addUserStudy = function (data, callback) {
  var queryData = {
    title: data.title,
    tutorname: data.tutorname,
    executorname : data.executorname,
    from: data.fromDate,
    until: data.untilDate,
    description: data.description,
    link: data.doodleLink,
    paper: data.paper,
    space: data.space,
    mmi: data.mmi,
    compensation: data.compensation,
    location: data.location
  };
  connection.query('INSERT INTO userstudies ' +
  '(tutorId,executorId,' +
    'fromDate,untilDate,' +
    'title,description,' +
    'link,paper,' +
    'space,' +
    'mmi,compensation,' +
    'location,' +
    'visible,published) ' +
  'VALUES (' +
    '(SELECT id FROM users WHERE username=?),(SELECT id FROM users WHERE username=?),' +
    '?,?,?,?,?,?,?,?,?,?,' +
    '1,0);',
    [queryData.tutorname,queryData.executorname,
      queryData.from,queryData.until,
      queryData.title,queryData.description,
      queryData.link,queryData.paper,
      queryData.space,
      queryData.mmi,queryData.compensation,
      queryData.location],
    callback);
};

module.exports.deleteUserStudy = function (data, callback) {
  // TODO set visible false
};

module.exports.editUserStudy = function (data, callback) {
  // TODO
};

module.exports.getUserstudy = function (userstudy, callback) {
  connection.query('SELECT * FROM userstudies ' +
    'WHERE id=? AND title=?',
    [userstudy.id,userstudy.title],
    callback);
};

module.exports.getAllUserstudies = function (callback) {
  connection.query('SELECT * FROM userstudies', callback);
};

module.exports.getAllUserstudiesFiltered = function (filters, callback) {
  var queryFilters = filters;
  connection.query('SELECT * FROM userstudies', callback);
  //todo
};

module.exports.getAllUserstudiesFilteredForUser = function (filters, callback) {
  var queryFilters = filters;
  connection.query('SELECT * FROM userstudies', callback);
  //todo
};

module.exports.publishUserStudy = function(title, callback){
  // TODO set published true
};

module.exports.mapUserToStudy = function(user, study, callback){
  connection.query('',
  [user.id,user.username,
  study.id,study.title,
    callback]);
};
