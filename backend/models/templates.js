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

            connection.query('INSERT INTO template_fieldssss ' +
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

module.exports.getAllTemplates = function (callback) {

};

module.exports.getTemplate = function (template, callback) {
  connection.query('SELECT title FROM templates WHERE title=?',template.title,callback);
};

module.exports.mapTemplatetoUserstudy = function (template, userstudy, callback) {

};

