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
    'WHERE us.id=? AND us.title=?',
    [userstudy.id,userstudy.title],
    callback);
};

module.exports.getUserstudyById = function (id, callback) {
  connection.query('SELECT us.id, u.username AS tutor, u2.username AS executor, us.fromDate, us.untilDate, ' +
    'us.title, us.description, us.link, us.paper, us.space, us.mmi, us.compensation, ' +
    'us.location ' +
    'FROM userstudies us ' +
    'LEFT JOIN users u ' +
    'ON us.tutorId=u.id ' +
    'LEFT JOIN users u2 ' +
    'ON us.executorId=u2.id ' +
    'WHERE us.id=?',
    id, callback);
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
  var labelstring = "";
  var tutorstring = "";
  var executorstring = "";
  var fromDatestring = "";
  var untilDatestring = "";
  var titlestring = "";
  var descrstring = "";
  var visiblestr = "";
  var publishedstr = "";
  var closedstr = "";
  var countString = "GROUP BY us.id ";
  var orderstring = "";
  var limitstring = "";

  // Parse label array for mysql syntax
  var labels = "";
  for (var i = 0; i < filter.label.length; i++){
    if (i===0){
      labels = connection.escape(filter.label[i].title);
    } else {
      labels = labels + "," + connection.escape(filter.label[i].title);
    }
  }
  // Take only the userstudy which has every label from array
  if (filter.label !== "") {
    labelstring = "AND la.title IN (" + labels + ") ";
    countString = "GROUP BY us.id HAVING count(us.title)>=" + filter.label.length + " ";
  }

  if (filter.tutor !== "") {tutorstring = "AND user1.username=" + connection.escape(filter.tutor) + " " ;}
  if (filter.executor !== "") {executorstring = "AND user2.username=" + connection.escape(filter.executor) + " ";}
  if (filter.fromDate !== "") {fromDatestring = "AND us.fromDate=" + connection.escape(filter.fromDate) + " ";}
  if (filter.untilDate !== "") {untilDatestring = "AND us.untilDate=" + connection.escape(filter.untilDate) + " ";}
  if (filter.title !== "") {titlestring = "AND us.title=" + connection.escape(filter.title) + " ";}
  if (filter.description !== "") {descrstring = "AND us.description=" + connection.escape(filter.description) + " ";}
  if (filter.visible !== "") {visiblestr = "AND us.visible=" + connection.escape(filter.visible) + " ";}
  if (filter.published !== "") {publishedstr = "AND us.published=" + connection.escape(filter.published) + " ";}
  if (filter.closed !== "") {closedstr = "AND us.closed=" + connection.escape(filter.closed) + " ";}

  if (filter.order !== "" && filter.orderBy !== "") {
    orderstring = "ORDER BY us." + filter.orderBy + " " + filter.order + " ";
  } else {
    orderstring = "ORDER BY fromDate DESC ";
  }
  if (filter.limit !== "") {
    limitstring = "LIMIT " + filter.limit + " ";
  } else {
    limitstring = "LIMIT 20 ";
  }

  connection.query('SELECT us.title, user1.username, user2.username, us.description, us.untilDate, us.fromDate, us.location, ' +
                  'us.visible, us.published, us.closed ' +
                  'FROM userstudies us ' +
                  'LEFT JOIN users user1 ON us.tutorId=user1.id ' +
                  'LEFT JOIN users user2 ON us.executorId=user2.id ' +
                  'LEFT JOIN studies_labels_rel slrel ON slrel.studyId=us.id ' +
                  'LEFT JOIN labels la ON slrel.labelId=la.id ' +
                  'WHERE 1=1 '
                  + labelstring
                  + tutorstring
                  + executorstring
                  + fromDatestring
                  + untilDatestring
                  + titlestring
                  + descrstring
                  + visiblestr
                  + publishedstr
                  + closedstr
                  + countString
                  + orderstring
                  + limitstring, callback);
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

module.exports.getStudiesFinishedByUser = function(user, callback){
  connection.query('SELECT us.title, user1.username AS tutor, user2.username AS executor, ' +
                    'us.description, us.untilDate, us.fromDate, us.location, us.link, us.mmi, us.compensation, us.closed ' +
                    'FROM userstudies us ' +
                    'LEFT JOIN users_studies_rel usrel ON us.id=usrel.studyId ' +
                    'LEFT JOIN users user1 ON us.tutorId=user1.id ' +
                    'LEFT JOIN users user2 ON us.executorId=user2.id ' +
                    'WHERE usrel.userId=? ' +
                    'AND usrel.registered=1 ' +
                    'AND usrel.confirmed=1 ' +
                    'AND us.visible=1 ' +
                    'AND us.published=1 ' +
                    'AND us.closed=1' ,
    user.id,
    callback);
};

module.exports.getStudiesCurrentByUser = function(user, callback){
  connection.query('SELECT us.title, user1.username AS tutor, user2.username AS executor, ' +
                    'us.description, us.untilDate, us.fromDate, us.location, us.link, us.mmi, us.compensation, us.closed ' +
                    'FROM userstudies us ' +
                    'LEFT JOIN users_studies_rel usrel ON us.id=usrel.studyId ' +
                    'LEFT JOIN users user1 ON us.tutorId=user1.id ' +
                    'LEFT JOIN users user2 ON us.executorId=user2.id ' +
                    'WHERE usrel.userId=? ' +
                    'AND usrel.registered=1 ' +
                    'AND us.visible=1 ' +
                    'AND us.published=1 ' +
                    'AND us.closed=0' ,
    user.id,
    callback);
};

module.exports.getStudiesCreatedByUser = function(user, callback){
  connection.query('SELECT us.title, user1.username AS tutor, user2.username AS executor, ' +
    'us.description, us.untilDate, us.fromDate, us.location, us.link, us.mmi, us.compensation, us.closed ' +
    'FROM userstudies us ' +
    'LEFT JOIN users user1 ON us.tutorId=user1.id ' +
    'LEFT JOIN users user2 ON us.executorId=user2.id ' +
    'WHERE us.creator=? ',
    user.id,
    callback);
};



module.exports.getLabelsForStudy = function(userstudy, callback){
  connection,query('SELECT id,title FROM labels ' +
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
  connection.query('SELECT id,username FROM users' +
  'WHERE id=(SELECT userId FROM users_studies_rel WHERE id=?)'
  ,userstudy.id,callback);
};


