"use strict";
var Template         = require('../models/templates');
var Promise          = require('es6-promise').Promise;
var TemplatePromise  = require('./promises/templatePromises');
var Async       = require('async');


module.exports.createTemplate = function(req, res){
  var template;
  TemplatePromise.validFullTemplateReq(req)
    .then(function(result){
      template = result;
      return TemplatePromise.templateAvailable(template.title);
    })
    .then(function(){
      Template.addTemplate(template, function(err,insertId){
        if (err) {
          res.json(500, {status: 'failure', message: 'Server Fehler.', internal: err});
        } else {
          template.id = insertId;
          res.json({status: 'success', message: 'Template erstellt.', template: template});
        }
      });
    })
    .catch(function(err){
      res.json(500, {status: 'failure', message: err});
    });
};

module.exports.editTemplate = function (req, res) {
  var template;
  TemplatePromise.validFullTemplateReq(req, true)
    .then(function (result) {
      template = result;
      template.id = req.params.id;
      return TemplatePromise.templateExists(template.id);
    })
    .then(function () {
      Template.editTemplate(template, function (err) {
        if (err) {
          res.json(500, {status: 'failure', message: 'Server Fehler.', internal: err});
        } else {
          res.json({status: 'success', message: 'Template geändert', template: template});
        }
      });
    })
    .catch(function (err) {
      res.json(500, {status: 'failure', message: err});
    });
};

module.exports.deleteTemplate = function(req, res){
    TemplatePromise.templateExists(req.params.id)
    .then(function(template){
        if (template.userstudies === null) {
          Template.removeTemplate(req.params.id, function(err){
            if (err) {
              res.json(500, {status: 'failure', message: 'Server Fehler.', internal: err});
            } else {
              res.json({status: 'success', message: 'Template gelöscht.'});
            }
          });
        } else {
          template.userstudies = template.userstudies.split(",").map(function(x){return parseInt(x);});
          res.json(500, {status: 'failure',
            message: 'Das Template konnte nicht gelöscht werden, da mindestens eine Nutzerstudie dieses Template hat.',
            userstudies: template.userstudies});
        }
    })
    .catch(function(err){
      res.json(500, {status: 'failure', message: err});
    });
};

module.exports.allTemplates = function (req, res){
  Template.getAllTemplates(function(err,result){
    if (err) {
      res.json(500, {status: 'failure', message: 'Server Fehler.', internal: err});
    } else {
      Async.eachSeries(result, function(item, callback){
        if (item.userstudies === null) {
          item.userstudies = [];
        } else {
          item.userstudies = item.userstudies.split(",").map(function(x){return parseInt(x);});
        }
        callback();
      }, function(err){
        if(err){
          res.json(500, {status:'failure', message: err});
        } else {
          res.json({templates: parseTemplateSQL(result)});
        }
      });
    }
  });
};

module.exports.getTemplateById = function (req, res){
  Template.getTemplateById(req.params.id, function(err,result){
    if (err) {
      res.json(500, {status: 'failure', message: 'Server Fehler.', internal: err});
    } else {
      if (result[0].userstudies === null) {
        result[0].userstudies = [];
      } else {
        result[0].userstudies = result[0].userstudies.split(",").map(function(x){return parseInt(x);});
      }

      res.json({template: parseTemplateSQL(result)});
    }
  });
};

var parseTemplateSQL = function(templateArray){
  var ids = [];
  var templates = [];
  var iteratorTemplate = -1;
  for (var i = 0; i < templateArray.length; i += 1) {
    var template = {};
    if (ids.indexOf(templateArray[i].id) < 0){
      ids.push(templateArray[i].id);
      template.id = templateArray[i].id;
      template.title = templateArray[i].title;
      template.userstudies = templateArray[i].userstudies;
      template.fields = [];
      template.fields.push({
        title : templateArray[i].fieldTitle,
        value : templateArray[i].value
      });
      templates.push(template);
      iteratorTemplate = iteratorTemplate += 1;
    } else {
      templates[iteratorTemplate].fields.push({
        title : templateArray[i].fieldTitle,
        value : templateArray[i].value
      });
    }
  }

  return templates;
};