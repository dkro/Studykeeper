"use strict";
var Template         = require('../models/templates');
var Promise          = require('es6-promise').Promise;
var TemplatePromise  = require('./promises/templatePromises');


module.exports.createTemplate = function(req, res){
  var template;
  TemplatePromise.validFullTemplateReq(req)
    .then(function(result){
      template = result;
      return TemplatePromise.templateAvailable(template.title);
    })
    .then(function(){
      Template.addTemplate(template, function(err,result){
        if (err) {
          throw err;
        } else {
          template.id = result.insertId;
          res.json({status: 'success', message: 'Template created.', template: template});
        }
      });
    })
    .catch(function(err){
      res.json(500, {status: 'failure', errors: err});
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
          throw err;
        } else {
          res.json({status: 'success', message: 'Template edited', template: template});
        }
      });
    })
    .catch(function (err) {
      res.json(500, {status: 'failure', errors: err});
    });
};

module.exports.deleteTemplate = function(req, res){
    TemplatePromise.templateExists(req.params.id)
    .then(function(){
      Template.removeTemplate(req.params.id, function(err){
        if (err) {
          throw err;
        } else {
          res.json({status: 'success', message: 'Template removed.'});
        }
      });
    })
    .catch(function(err){
      res.json(500, {status: 'failure', errors: err});
    });
};

module.exports.allTemplates = function (req, res){
  Template.getAllTemplates(function(err,result){
    if (err) {
      res.json(500, {status: 'failure', message: err});
    } else {
      res.json({templates: parseTemplateSQL(result)});
    }
  });
};

module.exports.getTemplateById = function (req, res){
  Template.getTemplateById(req.params.id, function(err,result){
    if (err) {
      res.json(500, {status: 'failure', message: err});
    } else {
      res.json({template: parseTemplateSQL(result)[0]});
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