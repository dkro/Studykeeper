"use strict";
var mysql      = require('../config/mysql');
var Promise         = require('es6-promise').Promise;

module.exports.addTemplate = function (template, callback) {
  var id;
  var queryData = {
    title: template.title,
    fields: template.fields
  };

  if (queryData.fields.length > 10){
    throw new Error({message: "Maximum of 10 fields for template allowed"});
  } else {
    mysql.getConnection(function(connection) {
      connection.beginTransaction(function (err) {
        if (err) {
          throw err;
        } else {
        // Create template
        connection.query('INSERT INTO templates (title) VALUES (?)', queryData.title, function (err, result) {
          if (err) {
            connection.rollback(function () {
              throw err;
            });
          } else {
            // Create Fields
            var promises = [];
            id = result.insertId;
            for (var i = 0; i < queryData.fields.length; i += 1) {
              promises.push(new Promise(function (resolve, reject) {

                connection.query('INSERT INTO template_fields ' +
                  '(templateId,title) ' +
                  'VALUES (?,?)',
                  [id, queryData.fields[i].title],
                  function (err) {
                    if (err) {
                      reject(err);
                    } else {
                      resolve();
                    }
                  });
              }));
            }

            Promise.all(promises).then(function () {
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
            }).catch(function (err) {
              connection.rollback(function () {
                throw err;
              });
            });
          }
        });
        }
      });
    });
  }
};

module.exports.editTemplate = function (template, callback) {
  var queryData = {
    id: template.id,
    title: template.title,
    fields: template.fields
  };

  if (queryData.fields.length > 10){
    throw new Error({message: "Maximum of 10 fields for template allowed"});
  } else {
    mysql.getConnection(function(connection) {
      connection.beginTransaction(function (err) {
        if (err) {
          connection.release();
          throw err;
        }

        new Promise(function(resolve,reject){
          connection.query('DELETE FROM template_fields WHERE templateId=?',
            queryData.id,
            function(err){
              if (err) {
                reject(err);
              } else {
                resolve(queryData.id);
              }
            });
          })
          .then(function(){
            return new Promise(function(resolve,reject){
              connection.query('UPDATE templates SET ' +
                'title=? ' +
                'WHERE id=?',
                [queryData.title,queryData.id],
                function(err){
                  if (err) {
                    reject(err);
                  } else {
                    resolve(queryData.id);
                  }
                });
            });
          })
          .then(function(){
            var promises = [];
            for (var i = 0; i < queryData.fields.length; i += 1) {
              promises.push(new Promise(function (resolve, reject) {

                connection.query('INSERT INTO template_fields ' +
                  '(templateId,title) ' +
                  'VALUES (' +
                  '(SELECT id FROM templates WHERE title=?),' +
                  '?)',
                  [queryData.title, queryData.fields[i].title],
                  function (err) {
                    if (err) {
                      reject(err);
                    } else {
                      resolve();
                    }
                  });
              }));
            }

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
          .catch(function(err){
            connection.rollback(function () {
              connection.release();
              callback(err);
              throw err;
            });
          });
      });
    });
  }
};

module.exports.removeTemplate = function (templateId, callback) {
  mysql.getConnection(function(connection) {
    connection.beginTransaction(function (err) {
      if (err) {
        connection.release();
        throw err;
      }
      // Delete Relation
      new Promise(function (resolve, reject) {
        connection.query("DELETE FROM template_fields WHERE templateId=?",
          templateId,
          function (err) {
            if (err) {
              reject(err);
            } else {
              resolve();
            }
          });
      })
        // Delete Template
        .then(function () {
          return new Promise(function (resolve, reject) {
            connection.query("DELETE FROM templates WHERE id=?",
              templateId,
              function (err) {
                if (err) {
                  reject(err);
                } else {
                  resolve();
                }
              });
          });
        })
        // Finally commit
        .then(function () {
          connection.commit(function (err) {
            if (err) {
              connection.rollback(function () {
                connection.release();
                throw err;
              });
            } else {
              connection.release();
              callback(err);
            }
          });
        })
        // Catch all erors
        .catch(function (err) {
          connection.rollback(function () {
            connection.release();
            callback(err);
          });
        });
    });
  });
};

module.exports.getAllTemplates = function (callback) {
  mysql.getConnection(function(connection) {
    connection.query('SELECT t.id, t.title, tf.title AS fieldTitle,  ' +
                     'GROUP_CONCAT(DISTINCT us.id) AS userstudies ' +
                     'FROM templates t ' +
                     'LEFT JOIN template_fields tf ON t.id=tf.templateId ' +
                     'LEFT JOIN userstudies us ON us.templateId=t.id ' +
                     'GROUP BY tf.id;',
      function(err,result){
        connection.release();
        callback(err,result);
      }
    );
  });
};

module.exports.getTemplateById = function (templateId, callback) {
  mysql.getConnection(function(connection) {
    connection.query('SELECT  t.id, t.title, tf.title AS fieldTitle, ' +
                     'GROUP_CONCAT(DISTINCT us.id) AS userstudies ' +
                     'FROM templates t ' +
                     'LEFT JOIN template_fields tf ON t.id=tf.templateId ' +
                     'LEFT JOIN userstudies us ON us.templateId=t.id ' +
                     'WHERE t.id=? ' +
                     'GROUP BY tf.id;',
      templateId,
      function(err,result){
        connection.release();
        callback(err,result);
      }
    );
  });
};

module.exports.getTemplateByTitle = function (templateTitle, callback) {
  mysql.getConnection(function(connection) {
    connection.query('SELECT t.id, t.title, tf.title AS fieldTitle ' +
      'FROM templates t ' +
      'LEFT JOIN template_fields tf ON t.id=tf.templateId ' +
      'WHERE t.title=? ',
      templateTitle,
      function(err,result){
        connection.release();
        callback(err,result);
      }
    );
  });
};


