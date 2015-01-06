"use strict";
var connection      = require('../config/mysql').connection;

module.exports.addUserStudy = function (data, callback) {
  var queryData = {
    title: data.title,
    tutorname: data.tutorname,
    tutorId: data.tutorId,
    executorname : data.executorname,
    executorId: data.executorId,
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
    'visible,published,closed) ' +
  'VALUES (' +
    '(SELECT id FROM users WHERE username=? AND id=?),' +
    '(SELECT id FROM users WHERE username=? AND id=?),' +
    '?,?,?,?,?,?,?,?,?,?,' +
    '1,0,0);',
    [queryData.tutorname,queryData.tutorId,
      queryData.executorname,queryData.executorId,
      queryData.from,queryData.until,
      queryData.title,queryData.description,
      queryData.link,queryData.paper,
      queryData.space,
      queryData.mmi,queryData.compensation,
      queryData.location],
    callback);
};

module.exports.editUserStudy = function (data, callback) {
  var queryData = {
    id: data.id,
    title: data.title,
    tutorname: data.tutorname,
    tutorId: data.tutorId,
    executorname : data.executorname,
    executorId: data.executorId,
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

  connection.query('UPDATE userstudies ' +
  'SET tutorId=(SELECT id FROM users WHERE id=? AND username=?)' +
    ',executorId=(SELECT id FROM users WHERE id=? AND username=?),' +
  'fromDate=?,untilDate=?,' +
  'title=?,description=?,' +
  'link=?,paper=?,' +
  'space=?,' +
  'mmi=?,compensation=?,' +
  'location=? ' +
  'WHERE id=? ' +
  'AND title=?;',
    [queryData.tutorId,queryData.tutorname,
      queryData.executorId,queryData.executorname,
      queryData.from,queryData.until,
      queryData.title,queryData.description,
      queryData.link,queryData.paper,
      queryData.space,
      queryData.mmi,queryData.compensation,
      queryData.location,
      queryData.id, queryData.title],
    callback);
};

module.exports.getUserstudy = function (userstudy, callback) {
  connection.query(
    'SELECT us.id, u.username AS tutor, u2.username AS executor, us.fromDate, us.untilDate, ' +
    'us.title, us.description, us.link, us.paper, us.space, us.mmi, us.compensation, ' +
    'us.location ' +
    'FROM userstudies us '+
    'LEFT JOIN users u '+
    'ON us.tutorId=u.id '+
    'LEFT JOIN users u2 '+
    'ON us.executorId=u2.id '+
    'WHERE id=? AND title=?',
    [userstudy.id,userstudy.title],
    callback);
};

module.exports.getAllUserstudies = function (callback) {
  connection.query('SELECT us.id, u.username AS tutor, u2.username AS executor, us.fromDate, us.untilDate, ' +
  'us.title, us.description, us.link, us.paper, us.space, us.mmi, us.compensation, ' +
  'us.location ' +
  'FROM userstudies us ' +
  'LEFT JOIN users u ' +
  'ON us.tutorId=u.id ' +
  'LEFT JOIN users u2 ' +
  'ON us.executorId=u2.id'
  , callback);
};

module.exports.getAllUserstudiesFiltered = function (filter, callback) {
  var labelstring = "LEFT JOIN studies_labels_rel slrel ON slrel.studyId=us.id " +
                    "LEFT JOIN labels la ON slrel.labelId=la.id " +
                    "WHERE la.title=\"" + filter.label + "\" ";
  var orderstring = "ORDER BY " + filter.field + " " + filter.order + " ";
  var limitstring = "LIMIT " + filter.limit + " ";

  connection.query('SELECT us.title FROM userstudies us ' + labelstring + orderstring + limitstring, callback);
};

module.exports.getAllUserstudiesFilteredForUser = function (users, filter, callback) {
  var queryFilters = filters;
  connection.query('SELECT * FROM userstudies', callback);
  //todo
};

module.exports.getUsersRegisteredToStudy = function(userstudy, callback){
  connection.query('SELECT * FROM users ' +
    'WHERE id=' +
      '(SELECT userId FROM users_studies_rel WHERE studyId=?)' ,
    userstudy.id,
    callback);
};

module.exports.getLabelsForStudy = function(userstudy, callback){
  connection,query('SELECT title FROM labels ' +
  'WHERE id=(SELECT labelId FROM studies_labels_rel WHERE studyId=?',
  userstudy.id,
  callback);
};

module.exports.publishUserstudy = function(userstudy, callback){
  connection.query('UPDATE userstudies ' +
    'SET published=1 ' +
    'WHERE id=? AND title=?',
    [userstudy.id,userstudy.title],
    callback);
};

module.exports.deleteUserstudy = function (userstudy, callback) {
  connection.query('UPDATE userstudies ' +
    'SET visible=0 ' +
    'WHERE id=? AND title=?',
    [userstudy.id,userstudy.title],
    callback);
};

module.exports.closeUserstudy = function(userstudy, callback){
  connection.query('UPDATE userstudies ' +
    'SET closed=1 ' +
    'WHERE id=? AND title=?',
    [userstudy.id,userstudy.title],
    callback);
};

module.exports.mapUserToStudy = function(user, userstudy, callback){
  connection.query('INSERT INTO users_studies_rel ' +
    '(studyId,userId,registered,confirmed) ' +
    'VALUES (' +
    '(SELECT id FROM users WHERE id=? AND username=?),' +
    '(SELECT id FROM userstudies WHERE id=? AND username=?),' +
    '1,0);',
    [user.id,user.username,
      userstudy.id,userstudy.title],
    callback);
};

module.exports.unmapUserFromStudy = function(user, userstudy, callback){
  connection.query('UPDATE users_studies_rel ' +
    'SET confirmed=0 ' +
    'WHERE userId=(SELECT * FROM users WHERE id=? AND username=?) ' +
    'AND studyId=(SELECT * FROM userstudies WHERE id=? AND title=?)',
    [user.id,user.username,
      userstudy.id,userstudy.title],
    callback);
};

module.exports.confirmUser = function(user, userstudy, callback){
  connection.query('UPDATE users_studies_rel ' +
    'SET confirmed=1 ' +
    'WHERE studyId=(SELECT id FROM users WHERE id=? AND username=?) ' +
    'AND userId=(SELECT id FROM userstudies WHERE id=? AND title=?)',
    [user.id,user.username,
      userstudy.id,userstudy.title],
    callback);
};

module.exports.getUserRegisteredToStudy = function(userstudy, callback){
  connection.query('SELECT username,id FROM users' +
  'WHERE id=(SELECT userId FROM users_studies_rel WHERE id=?)'
  ,userstudy.id,callback);
};


