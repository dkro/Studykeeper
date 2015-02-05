"use strict";
var mysql      = require('../config/mysql');
var Promise    = require('es6-promise').Promise;

module.exports.addUserStudy = function (data, callback) {
  var id;
  var queryData = {
    title: data.title, tutorId: data.tutorId, executorId: data.executorId, from: data.fromDate, until: data.untilDate,
    description: data.description, link: data.doodleLink, paper: data.paper, space: data.space, mmi: data.mmi,
    compensation: data.compensation, location: data.location,
    requiredStudies: data.requiredStudies, news: data.news, labels: data.labels, templateId: data.templateId,
    creatorId: data.creatorId
  };
  mysql.getConnection(function(connection) {
    // Start a Transaction
    connection.beginTransaction(function (err) {
      if (err) {
        connection.release();
        throw err;
      }
      // Create the userstudy in userstudies Table
      new Promise(function(resolve,reject){
        connection.query('INSERT INTO userstudies ' +
          '(tutorId,executorId,fromDate,untilDate,title,description,link,paper,space,mmi,compensation,' +
          'location,visible,published,closed,creatorId,templateId) ' +
          'VALUES ((SELECT id FROM users WHERE id=?),(SELECT id FROM users WHERE id=?),' +
          '?,?,?,?,?,?,?,?,?,?,1,0,0,?,?);',
          [queryData.tutorId,
            queryData.executorId,queryData.from, queryData.until, queryData.title, queryData.description,
            queryData.link, queryData.paper, queryData.space,queryData.mmi, queryData.compensation, queryData.location,
            queryData.creatorId, queryData.templateId],
          function(err,result){
            if (err) {
              reject(err);
            } else {
              id = result.insertId;
              resolve(result.insertId);
            }
          });
      })
        .then(function(userstudyId){
          var promises = [
            addUserstudyRelations(connection, userstudyId, 'news', queryData.news),
            addUserstudyRelations(connection, userstudyId, 'labels', queryData.labels),
            addUserstudyRelations(connection, userstudyId, 'requires', queryData.requiredStudies)
          ];
          return Promise.all(promises);
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
              callback(err,id);
            }
          });
        })
        // Catch all erors
        .catch(function(err){
          connection.rollback(function () {
            connection.release();
            if(err.code === "ER_DUP_ENTRY") {
              err = {message: "Userstudy title already taken."};
            }
            callback(err);
          });
        });
    });
  });
};

module.exports.editUserStudy = function (data, callback) {
  var queryData = {
    id:data.id, title: data.title, tutorId: data.tutorId, executorId: data.executorId, from: data.fromDate,
    until: data.untilDate, description: data.description, link: data.doodleLink, paper: data.paper,
    space: data.space, mmi: data.mmi, compensation: data.compensation, location: data.location,
    requiredStudies: data.requiredStudies, news: data.news, labels: data.labels, templateId: data.templateId
  };
  mysql.getConnection(function(connection) {
    connection.beginTransaction(function (err) {
      if (err) {
        connection.release();
        throw err;
      }
      // Create the userstudy in userstudies Table
      new Promise(function(resolve,reject){
        connection.query('UPDATE userstudies ' +
          'SET tutorId=?,executorId=?, fromDate=?, untilDate=?, title=?, description=?, link=?, paper=?,' +
          'space=?, mmi=?, compensation=?,location=?, templateId=? ' +
          'WHERE id=?;',
          [queryData.tutorId, queryData.executorId, queryData.from, queryData.until, queryData.title,queryData.description,
            queryData.link,queryData.paper, queryData.space, queryData.mmi,queryData.compensation, queryData.location,
            queryData.templateId, queryData.id],
          function(err){
            if (err) {
              reject(err);
            } else {
              resolve(queryData.id);
            }
          }
        );
      })
        .then(function(userstudyId){
          var promises = [
            delUserstudyRelations(connection, userstudyId, 'news'),
            delUserstudyRelations(connection, userstudyId, 'labels'),
            delUserstudyRelations(connection, userstudyId, 'requires')
          ];
          return Promise.all(promises);
        })
        .then(function(results){
          var promises = [
            addUserstudyRelations(connection, results[0], 'news', queryData.news),
            addUserstudyRelations(connection, results[1], 'labels', queryData.labels),
            addUserstudyRelations(connection, results[2], 'requires', queryData.requiredStudies)
          ];
          return Promise.all(promises);
        })
        // Finally commit
        .then(function(){
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
            if(err.code === "ER_DUP_ENTRY") {
              err = {message: "Userstudy title already taken."};
            }
            callback(err);
            throw err;
          });
        });
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
  // todo visible for all?
  mysql.getConnection(function(connection){
    connection.query('SELECT us.id, us.tutorId AS tutor, us.executorId AS executor, us.fromDate, us.untilDate, ' +
      'us.title, us.description, us.link, us.paper, us.space, us.mmi, us.compensation, us.location, us.closed, ' +
      'GROUP_CONCAT(DISTINCT slr.labelId) AS labels, GROUP_CONCAT(DISTINCT snr.newsId) AS news, ' +
      'GROUP_CONCAT(DISTINCT srr.requiresId) AS requiredStudies, ' +
      'GROUP_CONCAT(DISTINCT sur.userId) AS registeredUsers, ' +
      'us.templateId AS template, us.creatorId AS creator ' +
      'FROM userstudies us ' +
      'LEFT JOIN studies_news_rel snr ON us.id=snr.studyId ' +
      'LEFT JOIN studies_labels_rel slr ON us.id=slr.studyId ' +
      'LEFT JOIN studies_requires_rel srr ON us.id=srr.studyId ' +
      'LEFT JOIN studies_users_rel sur ON (us.id=sur.studyId AND sur.confirmed=1) ' +
      'WHERE us.id=? ' +
      'GROUP BY us.id;',
      id, function(err,result){
        connection.release();
        callback(err,result);
      }
    );
  });
};

module.exports.getPublicUserstudyById = function (id, callback) {
  mysql.getConnection(function(connection){
    connection.query('SELECT us.id, ' +
      'tutor.username AS tutorEmail, tutor.firstname AS tutorFirstname, tutor.lastname AS tutorLastname, ' +
      'executor.username AS executorEmail, executor.firstname AS executorFirstname, executor.lastname AS executorLastname, ' +
      'us.fromDate, us.untilDate, us.closed, ' +
      'us.title, us.description, us.link, us.paper, us.mmi, us.compensation, us.location ' +
      'FROM userstudies us ' +
      'LEFT JOIN users tutor ON us.tutorId=tutor.id ' +
      'LEFT JOIN users executor ON us.executorId=executor.id ' +
      'WHERE us.id=? AND us.visible=1 AND us.published=1',
      id, function(err,result){
        connection.release();
        callback(err,result);
      }
    );
  });
};

module.exports.getAllUserstudies = function (callback) {
  mysql.getConnection(function(connection) {
    connection.query('SELECT us.id, us.tutorId AS tutor, us.executorId AS executor, us.fromDate, us.untilDate, ' +
      'us.title, us.description, us.link, us.paper, us.space, us.mmi, us.compensation, us.location, us.closed, ' +
      'GROUP_CONCAT(DISTINCT slr.labelId) AS labels, GROUP_CONCAT(DISTINCT snr.newsId) AS news, ' +
      'GROUP_CONCAT(DISTINCT srr.requiresId) AS requiredStudies, ' +
      'GROUP_CONCAT(DISTINCT sur.userId) AS registeredUsers, ' +
      'us.templateId as template, us.creatorId AS creator '+
      'FROM userstudies us ' +
      'LEFT JOIN studies_news_rel snr ON us.id=snr.studyId ' +
      'LEFT JOIN studies_labels_rel slr ON us.id=slr.studyId ' +
      'LEFT JOIN studies_requires_rel srr ON us.id=srr.studyId ' +
      'LEFT JOIN studies_users_rel sur ON (us.id=sur.studyId AND sur.registered=1) ' +
      'GROUP BY us.id;',
      function(err,result){
        connection.release();
        callback(err,result);
      }
    );
  });
};

// Returns all userstudies which either have no required studies or the user has
// completed and confirmed all required studies
// TODO if a study has multiple required studies and the user has completed only one it is still shown...
module.exports.getAllUserstudiesFilteredForUser = function (user, callback) {
  mysql.getConnection(function(connection) {
    connection.query('SELECT us.id, us.tutorId AS tutor, us.executorId AS executor, us.fromDate, us.untilDate, ' +
      'us.title, us.description, us.link, us.paper, us.space, us.mmi, us.compensation, us.location, us.closed, ' +
      'GROUP_CONCAT(DISTINCT slr.labelId) AS labels, GROUP_CONCAT(DISTINCT snr.newsId) AS news, ' +
      'GROUP_CONCAT(DISTINCT srr.requiresId) AS requiredStudies,  ' +
      'GROUP_CONCAT(DISTINCT sur.userId) AS registeredUsers, ' +
      'us.templateId AS template, us.creatorId AS creator '+
      'FROM userstudies us ' +
      'LEFT JOIN studies_news_rel snr ON us.id=snr.studyId ' +
      'LEFT JOIN studies_labels_rel slr ON us.id=slr.studyId ' +
      'LEFT JOIN studies_requires_rel srr ON us.id=srr.studyId ' +
      'LEFT JOIN studies_users_rel sur ON (us.id=sur.studyId AND sur.registered=1) ' +
      'LEFT JOIN studies_users_rel surful ON (srr.requiresId=surful.studyId AND surful.confirmed=1 AND surful.userId=?) ' +
      'WHERE us.visible=1 AND us.published=1 ' +
      'AND (srr.studyId IS NULL OR (surful.userId=? AND surful.confirmed=1 AND surful.id IS NOT NULL))  ' +
      'GROUP BY us.id;',
      [user.id,user.id],
      function(err,result){
        connection.release();
        callback(err,result);
      }
    );
  });
};

module.exports.getUsersRegisteredToStudy = function(userstudyId, callback){
  mysql.getConnection(function(connection) {
    connection.query("SELECT DISTINCT u.id FROM users u " +
     "LEFT JOIN studies_users_rel sur ON sur.userId=u.id " +
     "WHERE sur.studyId=?",
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


module.exports.getStudiesUserIsRegistered = function(user, callback){
  mysql.getConnection(function(connection) {
    connection.query('SELECT us.id, us.title, user1.username AS tutor, user2.username AS executor, ' +
                      'us.description, us.untilDate, us.fromDate, us.location, us.link, us.mmi, us.compensation, us.closed ' +
                      'FROM userstudies us ' +
                      'LEFT JOIN studies_users_rel usrel ON us.id=usrel.studyId ' +
                      'LEFT JOIN users user1 ON us.tutorId=user1.id ' +
                      'LEFT JOIN users user2 ON us.executorId=user2.id ' +
                      'WHERE usrel.userId=? ' +
                      'AND usrel.registered=1 ' +
                      'AND us.visible=1 ' +
                      'AND us.published=1 ',
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

module.exports.getStudiesFinishedByUser = function(userId, callback){
  mysql.getConnection(function(connection){
    connection.query("SELECT studyId FROM studies_users_rel " +
      "WHERE userId=? AND confirmed=1 AND registered=1",
      userId,
      function(err,result){
        connection.release();
        callback(err,result);
      });
  });
}


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

module.exports.deleteUserstudy = function (userstudyId, callback) {
  mysql.getConnection(function(connection) {
    connection.query('UPDATE userstudies ' +
      'SET visible=0 ' +
      'WHERE id=? ',
      userstudyId,
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
    connection.query('INSERT INTO studies_users_rel ' +
      '(studyId,userId,registered,confirmed) ' +
      'VALUES (?,?,1,0);',
      [userstudyId,userId],
      function(err,result){
        connection.release();
        callback(err,result);
      }
    );
  });
};

module.exports.unmapUserFromStudy = function(userId, userstudyId, callback){
  mysql.getConnection(function(connection) {
    connection.query('DELETE FROM studies_users_rel ' +
      'WHERE userId=? ' +
      'AND studyId=?',
      [userId, userstudyId],
      function(err,result){
        connection.release();
        callback(err,result);
      }
    );
  });
};

module.exports.confirmUser = function(user, userstudy, callback){
  mysql.getConnection(function(connection) {
    connection.query('UPDATE studies_users_rel ' +
      'SET confirmed=1 ' +
      'WHERE userId=(SELECT id FROM users WHERE id=?) ' +
      'AND studyId=(SELECT id FROM userstudies WHERE id=?)',
      [user.id, userstudy.id],
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
      'WHERE id=(SELECT userId FROM studies_users_rel WHERE id=?)',
      userstudy.id,
      function(err,result) {
        connection.release();
        callback(err, result);
      }
    );
  });
};


var addUserstudyRelations = function(connection, userstudyId, type, relationIds) {
  relationIds = relationIds || [];


  return new Promise(function(resolve,reject) {
    var tableName;
    var columnName;

    switch(type){
      case 'news':
        tableName = "studies_news_rel";
        columnName = "newsId";
        break;
      case 'labels':
        tableName = "studies_labels_rel";
        columnName = "labelId";
        break;
      case 'requires':
        tableName = "studies_requires_rel";
        columnName = "requiresId";
        break;
      default:
    }

    if (!tableName) {
      reject({message: "wrong type for userstudy relation... recieved: " + type + " expected: [news/labels,requires]"});
    } else if (relationIds.length === 0){
      resolve(userstudyId);
    } else {
      var queryString = 'INSERT INTO ' + tableName + ' (studyId, ' + columnName + ') ' +
        'VALUES (' + userstudyId + ',' + relationIds[0] + ')';
      for (var i = 1; i < relationIds.length; i += 1) {
        queryString = queryString.concat(',(' + userstudyId + ',' + relationIds[i] + ')');
      }
      connection.query(queryString, function (err, result) {
        if (err) {
          reject(err);
        } else {
          resolve(userstudyId);
        }
      });
    }
  });
};


var delUserstudyRelations = function(connection, userstudyId, type) {
  return new Promise(function(resolve,reject) {
    var tableName;

    switch(type){
      case 'news':
        tableName = "studies_news_rel";
        break;
      case 'labels':
        tableName = "studies_labels_rel";
        break;
      case 'requires':
        tableName = "studies_requires_rel";
        break;
      default:
    }

    if (!tableName) {
      reject({message: "wrong type for userstudy relation deletion... recieved: " + type + " expected: [news/labels,requires]"});
    } else {
      connection.query('DELETE FROM ' + tableName + ' WHERE studyId=?',
        userstudyId,
        function (err, result) {
          if (err) {
            reject(err);
          } else {
            resolve(userstudyId);
          }
        });
    }
  });
};

module.exports.getStudiesRelationFor = function(userstudyId, type, callback){
    var tableName;

    switch(type){
      case 'news':
        tableName = "studies_news_rel";
        break;
      case 'labels':
        tableName = "studies_labels_rel";
        break;
      case 'requires':
        tableName = "studies_requires_rel";
        break;
      case 'users':
        tableName = "studies_users_rel";
        break;
      default:
    }

    if (!tableName) {
      callback("wrong type for userstudy relation getter... recieved: " + type + " " +
      "expected: news || labels || requires || users]");
    } else {
      mysql.getConnection(function(connection) {
        connection.query('SELECT * FROM ' + tableName + ' WHERE studyId=?',
          userstudyId,
          function (err, result) {
            if (err) {
              connection.release();
              callback(err);
            } else {
              connection.release();
              callback(err,result);
            }
          });
      });
    }
};



