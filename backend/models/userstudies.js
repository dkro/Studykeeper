"use strict";
var mysql      = require('../config/mysql');
var Promise      = require('es6-promise').Promise;

module.exports.addUserStudy = function (data, callback) {
  var queryData = {
    title: data.title, tutorId: data.tutorId, executorId: data.executorId, from: data.fromDate, until: data.untilDate,
    description: data.description, link: data.doodleLink, paper: data.paper, space: data.space, mmi: data.mmi,
    compensation: data.compensation, location: data.location,
    isFutureStudyFor: data.isFutureStudyFor, isHistoryFor: data.isHistoryFor
  };
  mysql.getConnection(function(connection) {
    // Start a Transaction
    connection.beginTransaction(function (err) {
      if (err) {
        connection.release();
        throw err;
      }
      // Create the userstudy in userstudies Table
      var pr = new Promise(function(resolve,reject){
        connection.query('INSERT INTO userstudies ' +
          '(tutorId,executorId,fromDate,untilDate,title,description,link,paper,space,mmi,compensation,' +
          'location,visible,published,closed,creatorId,newsId) ' +
          'VALUES ((SELECT id FROM users WHERE id=?),(SELECT id FROM users WHERE id=?),' +
          '?,?,?,?,?,?,?,?,?,?,1,0,0,1,1);',
          // todo creator is hardcoded remove this
          [queryData.tutorId,
            queryData.executorId,queryData.from, queryData.until, queryData.title, queryData.description,
            queryData.link, queryData.paper, queryData.space,queryData.mmi, queryData.compensation, queryData.location],
          function(err,result){
            if (err) {
              reject(err)
            } else {
              resolve(result.insertId)
            }
          })
      })
        // Add the required userstudies to studies_requires_rel
        .then(function(userstudyId){
          return new Promise(function(resolve,reject) {
            addUserstudyHistory(connection,userstudyId, queryData.isHistoryFor, function (err, result) {
              if (err) {
                reject(err)
              } else {
                resolve(userstudyId)
              }
            })
          })
        })
        // Add All restricted userstudies to studies_restricts_rel
        .then(function(userstudyId){
          return new Promise(function(resolve,reject) {
            addUserstudyRestrictions(connection,userstudyId, queryData.isFutureStudyFor, function (err, result) {
              if (err) {
                reject(err)
              } else {
                resolve(userstudyId)
              }
            })
          })
        })
        // Finally commit
        .then(function(userstudy){
          connection.commit(function (err) {
            if (err) {
              connection.rollback(function () {
                connection.release();
                throw err;
              });
            } else {
              connection.release();
              callback();
            }
          });
        })
        // Catch all erors
        .catch(function(err){
          connection.rollback(function () {
            connection.release();
            throw err;
            callback(err);
          });
        })
    });
  });
};

module.exports.editUserStudy = function (data, callback) {
  var queryData = {
    id:data.id, title: data.title, tutorId: data.tutorId, executorId: data.executorId, from: data.fromDate, until: data.untilDate,
    description: data.description, link: data.doodleLink, paper: data.paper, space: data.space, mmi: data.mmi,
    compensation: data.compensation, location: data.location,
    isFutureStudyFor: data.isFutureStudyFor, isHistoryFor: data.isHistoryFor
  };
  mysql.getConnection(function(connection) {
    connection.beginTransaction(function (err) {
      if (err) {
        connection.release();
        throw err;
      }
      // Create the userstudy in userstudies Table
      var pr = new Promise(function(resolve,reject){
        connection.query('UPDATE userstudies ' +
          'SET tutorId=?,executorId=?,fromDate=?,untilDate=?,title=?,description=?,link=?,paper=?,' +
          'space=?,mmi=?,compensation=?,location=?, creatorId=1, newsId=1 ' +
          'WHERE id=?;',
          [queryData.tutorId, queryData.executorId, queryData.from,queryData.until, queryData.title,queryData.description,
            queryData.link,queryData.paper, queryData.space, queryData.mmi,queryData.compensation, queryData.location,
            queryData.id, queryData.title],
          function(err,result){
            if (err) {
              reject(err)
            } else {
              resolve(queryData.id)
            }
          }
        );
      })
        // Add the required userstudies to studies_requires_rel
        .then(function(userstudyId){
          return new Promise(function(resolve,reject) {
            delUserstudyHistory(connection,userstudyId, function (err, result) {
              if (err) {
                reject(err)
              } else {
                resolve(userstudyId)
              }
            })
          })
        })
        // Add the required userstudies to studies_requires_rel
        .then(function(userstudyId){
          return new Promise(function(resolve,reject) {
            delUserstudyRestrictions(connection,userstudyId, function (err, result) {
              if (err) {
                reject(err)
              } else {
                resolve(userstudyId)
              }
            })
          })
        })
        // Add the required userstudies to studies_requires_rel
        .then(function(userstudyId){
          return new Promise(function(resolve,reject) {
            addUserstudyHistory(connection, userstudyId, queryData.isHistoryFor, function (err, result) {
              if (err) {
                reject(err)
              } else {
                resolve(userstudyId)
              }
            })
          })
        })
        // Add All restricted userstudies to studies_restricts_rel
        .then(function(userstudyId){
          return new Promise(function(resolve,reject) {
            addUserstudyRestrictions(connection, userstudyId, queryData.isFutureStudyFor, function (err, result) {
              if (err) {
                reject(err)
              } else {
                resolve(userstudyId)
              }
            })
          })
        })
        // Finally commit
        .then(function(userstudy){
          connection.commit(function (err) {
            if (err) {
              connection.rollback(function () {
                connection.release();
                throw err;
              });
            } else {
              connection.release();
              callback();
            }
          });
        })
        // Catch all erors
        .catch(function(err){
          connection.rollback(function () {
            connection.release();
            throw err;
            callback(err);
          });
        })
    });
  });
};

module.exports.getUserstudy = function (userstudy, callback) {
  mysql.getConnection(function(connection) {
    connection.query(
      'SELECT us.id, us.tutorId AS tutor, us.executorId AS executor, us.fromDate, us.untilDate, ' +
      'us.title, us.description, us.link, us.paper, us.space, us.mmi, us.compensation, ' +
      'us.location, us.closed ' +
      'FROM userstudies us '+
      'WHERE us.id=? AND us.title=?',
      [userstudy.id,userstudy.title],
      function(err,result){
        connection.release();
        callback(err,result);
      }
    );
  });
};

module.exports.getUserstudyById = function (id, callback) {
  mysql.getConnection(function(connection){
    connection.query('SELECT us.id, us.tutorId AS tutor, us.executorId AS executor, us.fromDate, us.untilDate, ' +
      'us.title, us.description, us.link, us.paper, us.space, us.mmi, us.compensation, ' +
      'us.location ' +
      'FROM userstudies us ' +
      'WHERE us.id=?',
      id, function(err,result){
        connection.release();
        callback(err,result);
      }
    );
  })
};

module.exports.getAllUserstudies = function (callback) {
  mysql.getConnection(function(connection) {
    connection.query('SELECT us.id, us.tutorId AS tutor, us.executorId AS executor, us.fromDate, us.untilDate, ' +
    'us.title, us.description, us.link, us.paper, us.space, us.mmi, us.compensation, ' +
    'us.location, us.closed ' +
    'FROM userstudies us ',
      function(err,result){
        connection.release();
        callback(err,result);
      }
    );
  });
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
  mysql.getConnection(function(connection) {
    connection.query('SELECT us.id, us.title, user1.username, user2.username, us.description, us.untilDate, us.fromDate, us.location, ' +
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
                    + limitstring,
      function(err,result){
        connection.release();
        callback(err,result);
      }
    );
  });
};

module.exports.getAllUserstudiesFilteredForUser = function (users, filter, callback) {
  var queryFilters = filters;
  // todo
  mysql.getConnection(function(connection) {
    connection.query('SELECT * FROM userstudies',
      function(err,result){
        connection.release();
        callback(err,result);
      }
    );
  });
};

module.exports.getUsersRegisteredToStudy = function(userstudyId, callback){
  mysql.getConnection(function(connection) {
    connection.query('SELECT * FROM users ' +
      'WHERE id=(SELECT userId FROM users_studies_rel WHERE studyId=?)' ,
      userstudyId,
      function(err,result){
        connection.release();
        callback(err,result);
      }
    );
  });
};

module.exports.getStudiesUserIsExecutor = function(user, callback){
  mysql.getConnection(function(connection) {
    connection.query('SELECT us.id, us.title, us.tutorId, us.executorId, ' +
      'us.description, us.untilDate, us.fromDate, us.location, us.link, us.mmi, us.compensation, us.closed ' +
      'FROM userstudies us ' +
      'WHERE us.executorId=? ' +
      'AND us.visible=1',
      user.id,
      function(err,result){
        connection.release();
        callback(err,result);
      }
    );
  });
};

module.exports.getStudiesUserIsTutor = function(user, callback){
  mysql.getConnection(function(connection) {
    connection.query('SELECT us.id, us.title, us.tutorId, us.executorId, ' +
      'us.description, us.untilDate, us.fromDate, us.location, us.link, us.mmi, us.compensation, us.closed ' +
      'FROM userstudies us ' +
      'WHERE us.tutorId=? ' +
      'AND us.visible=1',
      user.id,
      function(err,result){
        connection.release();
        callback(err,result);
      }
    );
  });
};

module.exports.getStudiesFinishedByUser = function(user, callback){
  mysql.getConnection(function(connection) {
    connection.query('SELECT us.id, us.title, user1.username AS tutor, user2.username AS executor, ' +
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
      function(err,result){
        connection.release();
        callback(err,result);
      }
    );
  });
};

module.exports.getStudiesCurrentByUser = function(user, callback){
  mysql.getConnection(function(connection) {
    connection.query('SELECT us.id, us.title, user1.username AS tutor, user2.username AS executor, ' +
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
      function(err,result){
        connection.release();
        callback(err,result);
      }
    );
  });
};

module.exports.getStudiesCreatedByUser = function(user, callback){
  mysql.getConnection(function(connection) {
    connection.query('SELECT us.id, us.title, user1.username AS tutor, user2.username AS executor, ' +
      'us.description, us.untilDate, us.fromDate, us.location, us.link, us.mmi, us.compensation, us.closed ' +
      'FROM userstudies us ' +
      'LEFT JOIN users user1 ON us.tutorId=user1.id ' +
      'LEFT JOIN users user2 ON us.executorId=user2.id ' +
      'WHERE us.creator=? ',
      user.id,
      function(err,result){
        connection.release();
        callback(err,result);
      }
    );
  });
};


module.exports.getLabelsForStudy = function(userstudy, callback){
  mysql.getConnection(function(connection) {
    connection.query('SELECT id,title FROM labels ' +
    'WHERE id=(SELECT labelId FROM studies_labels_rel WHERE studyId=?)',
    userstudy.id,
      function(err,result){
        connection.release();
        callback(err,result);
      }
    );
  });
};

module.exports.getStudiesRequiredFor = function(userstudy, callback){
  mysql.getConnection(function(connection) {
    connection.query('SELECT requiresId AS id FROM studies_requires_rel ' +
      'WHERE studyId=?',
      userstudy.id,
      function(err,result){
        connection.release();
        callback(err,result);
      }
    );
  });
};

module.exports.getStudiesRestricedBy = function(userstudy, callback){
  mysql.getConnection(function(connection) {
    connection.query('SELECT restrictsId AS id FROM studies_restricts_rel ' +
      'WHERE studyId=?',
      userstudy.id,
      function(err,result){
        connection.release();
        callback(err,result);
      }
    );
  });
};

module.exports.publishUserstudy = function(userstudy, callback){
  mysql.getConnection(function(connection) {
    connection.query('UPDATE userstudies ' +
      'SET published=1 ' +
      'WHERE id=? AND title=?',
      [userstudy.id,userstudy.title],
      function(err,result){
        connection.release();
        callback(err,result);
      }
    );
  });
};

module.exports.deleteUserstudy = function (userstudy, callback) {
  mysql.getConnection(function(connection) {
    connection.query('UPDATE userstudies ' +
      'SET visible=0 ' +
      'WHERE id=? AND title=?',
      [userstudy.id,userstudy.title],
      function(err,result){
        connection.release();
        callback(err,result);
      }
    );
  });
};

module.exports.closeUserstudy = function(userstudy, callback){
  mysql.getConnection(function(connection) {
    connection.query('UPDATE userstudies ' +
      'SET closed=1 ' +
      'WHERE id=? AND title=?',
      [userstudy.id,userstudy.title],
      function(err,result){
        connection.release();
        callback(err,result);
      }
    );
  });
};

module.exports.mapUserToStudy = function(userId, userstudyId, callback){
  mysql.getConnection(function(connection) {
    connection.query('INSERT INTO users_studies_rel ' +
      '(studyId,userId,registered,confirmed) ' +
      'VALUES (?,?,1,0);',
      [userId,userstudyId],
      function(err,result){
        connection.release();
        callback(err,result);
      }
    );
  });
};

module.exports.unmapUserFromStudy = function(userId, userstudyId, callback){
  mysql.getConnection(function(connection) {
    connection.query('DELETE FROM users_studies_rel ' +
      'WHERE userId=? ' +
      'AND studyId=?',
      [userId, userstudyId],
      // todo what happens if the user is confirmed. Unmap or not?
      function(err,result){
        connection.release();
        callback(err,result);
      }
    );
  });
};

module.exports.confirmUser = function(user, userstudy, callback){
  mysql.getConnection(function(connection) {
    connection.query('UPDATE users_studies_rel ' +
      'SET confirmed=1 ' +
      'WHERE studyId=(SELECT id FROM users WHERE id=? AND username=?) ' +
      'AND userId=(SELECT id FROM userstudies WHERE id=? AND title=?)',
      [user.id,user.username,
        userstudy.id,userstudy.title],
      function(err,result){
        connection.release();
        callback(err,result);
      }
    );
  });
};

module.exports.getUserRegisteredToStudy = function(userstudy, callback){
  mysql.getConnection(function(connection) {
    connection.query('SELECT id,username FROM users' +
      'WHERE id=(SELECT userId FROM users_studies_rel WHERE id=?)',
      userstudy.id,
      function(err,result) {
        connection.release();
        callback(err, result);
      }
    );
  });
};

/**
 *
 * Maps Userstudies to be required for another userstudie. Creates fields in studies_requires_rel
 *
 * @param userstudyId Id of the userstudy for which the history should be created
 * @param historyIds Array of Userstudies to be referenced as history
 */
var addUserstudyHistory = function(connection, userstudyId, historyIds, callback) {
  if (historyIds.length === 0){
    callback();
  } else {
    var queryString = 'INSERT INTO studies_requires_rel (studyId, requiresId) ' +
      'VALUES (' + userstudyId + ',' + historyIds[0] + ')'
    for (var i = 1; i<historyIds.length; i += 1) {
      queryString = queryString.concat(',(' + userstudyId + ',' + historyIds[i] + ')')
    }
    connection.query(queryString,callback);
  }
}

var addUserstudyRestrictions = function(connection, userstudyId, restrictionIds, callback) {
  if (restrictionIds.length === 0){
    callback();
  } else {
    var queryString = 'INSERT INTO studies_restricts_rel (studyId, restrictsId) ' +
      'VALUES (' + userstudyId + ',' + restrictionIds[0] + ')'
    for (var i = 1; i<restrictionIds.length; i += 1) {
      queryString = queryString.concat(',(' + userstudyId + ',' + restrictionIds[i] + ')')
    }

    connection.query(queryString,callback);
  }
}


var delUserstudyHistory = function(connection,userstudyId,callback) {
  connection.query('DELETE FROM studies_requires_rel WHERE studyId=?',userstudyId,callback);
}

var delUserstudyRestrictions = function(connection,userstudyId,callback) {
  connection.query('DELETE FROM studies_restricts_rel WHERE studyId=?',userstudyId,callback);
}
