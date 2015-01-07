"use strict";
var connection      = require('../config/mysql').connection;
var Promise         = require('es6-promise').Promise;

module.exports.addTemplate = function (template, callback) {
  var queryData = {
    title: template.title,
    fields: template.fields
  };

  if (queryData.fields.length > 10){
    throw new Error({message: "Maximum of 10 fields for template allowed"});
  } else {
    connection.beginTransaction(function (err) {
      if (err) {
        throw err;
      }
      // Create template
      connection.query('INSERT INTO templates (title) VALUES (?)', queryData.title, function (err) {

        if (err) {
          connection.rollback(function () {
            throw err;
          });
        }

        // Create Fields
        var promises = [];
        for (var i = 0; i < queryData.fields.length; i += 1) {
          promises.push(new Promise(function(resolve, reject){

            connection.query('INSERT INTO template_fields ' +
              '(templateId,fieldtypeId,title,description) ' +
              'VALUES (' +
              '(SELECT id FROM templates WHERE title=?),' +
              '(SELECT id FROM fieldtypes WHERE type=?),' +
              '?,?)',
              [queryData.title, queryData.fields[i].fieldtype, queryData.fields[i].title, queryData.fields[i].description],
              function (err) {
                if (err) {
                  reject(err);
                } else {
                  resolve();
                }
            });
          }));
        }

        Promise.all(promises).then(function(){
          connection.commit(function (err) {
            if (err) {
              connection.rollback(function () {
                throw err;
              });
            }
            callback();
          });
        }).catch(function(err){
          connection.rollback(function () {
            throw err;
          });
        });

      });
    });
  }
};

module.exports.removeTemplate = function (template, callback) {
  var queryData = {
    id: template.id,
    title: template.title,
    fields: template.fields
  };
  connection.beginTransaction(function (err) {
    if (err) {
      throw err;
    }
    // Put dummy data into template
    connection.query('UPDATE templates SET title=\"removed\" WHERE id=?',
      queryData.id,
      function (err) {
      if (err) {
        connection.rollback(function () {
          throw err;
        });
      }

      // remove all fields connected to template
      connection.query('DELETE FROM template_fields WHERE templateId=?',
        queryData.id,
        function (err) {
          if (err) {
            connection.rollback(function () {
              throw err;
            });
          }
          connection.commit(function (err) {
            if (err) {
              connection.rollback(function () {
                throw err;
              });
            }
            callback();
          });
        });
    });
  });
};

module.exports.getAllTemplates = function (callback) {

};

module.exports.getTemplate = function (template, callback) {
  connection.query('SELECT * FROM templates WHERE title=? AND id=?',
    [template.title,template.id],
    callback);
};

module.exports.mapTemplatetoUserstudy = function (template, userstudy, callback) {

};

