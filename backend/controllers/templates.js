"use strict";
var Template         = require('../models/templates');
var Promise          = require('es6-promise').Promise;
var TemplatePromise  = require('./promises/templatePromises');
var Async       = require('async');

/**
 * Creates a new Template
 * @param req Incoming Request Object
 * @param res Outgoing Response Object
 * @param next next handler
 */
module.exports.createTemplate = function(req, res, next){
  var template;
  TemplatePromise.validFullTemplateReq(req)
    .then(function(result){
      template = result;
      return TemplatePromise.templateAvailable(template.title);
    })
    .then(function(){
      Template.addTemplate(template, function(err, id){
        if (err) {
          res.json(500, {status: 'failure', message: 'Server Fehler.', internal: err});
          return next();
        } else {
          template.id = id;
          res.json({template: template});
          return next();
        }
      });
    })
    .catch(function(err){
      res.json(500, {status: 'failure', message: err});
      return next();
    });
};

/**
 * Edits an existing template via req.params.id
 * @param req Incoming Request Object
 * @param res Outgoing Response Object
 * @param next next handler
 */
module.exports.editTemplate = function (req, res, next) {
  var template;
  TemplatePromise.validFullTemplateReq(req, true)
    .then(function (result) {
      template = result;
      template.id = req.params.id;
      return TemplatePromise.templateExists(template.id);
    })
    .then(function (result) {
      if (!result.userstudies || result.userstudies === null) {
        Template.editTemplate(template, function (err) {
          if (err) {
            res.json(500, {status: 'failure', message: 'Server Fehler.', internal: err});
            return next();
          } else {
            res.json({status: 'success', message: 'Template geändert', template: template});
            return next();
          }
        });
      } else {
        result.userstudies = result.userstudies.split(",").map(function(x){return parseInt(x);});
        res.json(500, {status: 'failure',
          message: 'Dieses Template konnte nicht verändert werden, da es zurzeit von mindestens einer Nutzerstudie ' +
          'verwendet wird.'});
        return next();
      }
    })
    .catch(function (err) {
      res.json(500, {status: 'failure', message: err});
      return next();
    });
};

/**
 * Deletes an existing template via req.params.id
 * @param req Incoming Request Object
 * @param res Outgoing Response Object
 * @param next next handler
 */
module.exports.deleteTemplate = function(req, res, next){
    TemplatePromise.templateExists(req.params.id)
    .then(function(template){
        if (template.userstudies === null) {
          Template.removeTemplate(req.params.id, function(err){
            if (err) {
              res.json(500, {status: 'failure', message: 'Server Fehler.', internal: err});
              return next();
            } else {
              res.json({});
              return next();
            }
          });
        } else {
          template.userstudies = template.userstudies.split(",").map(function(x){return parseInt(x);});
          res.json(500, {status: 'failure',
            message: 'Dieses Template konnte nicht gelöscht werden, da es zurzeit von mindestens einer Nutzerstudie ' +
            'verwendet wird.'});
          return next();
        }
    })
    .catch(function(err){
      res.json(500, {status: 'failure', message: err});
      return next();
    });
};

/**
 * Provides a list of all templates
 * @param req Incoming Request Object
 * @param res Outgoing Response Object
 * @param next next handler
 */
module.exports.allTemplates = function (req, res, next){
  Template.getAllTemplates(function(err,result){
    if (err) {
      res.json(500, {status: 'failure', message: 'Server Fehler.', internal: err});
      return next();
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
          return next();
        } else {
          res.json({templates: parseTemplateSQL(result)});
          return next();
        }
      });
    }
  });
};

/**
 * Provides a template by id via the req.params.id
 * @param req Incoming Request Object
 * @param res Outgoing Response Object
 * @param next next handler
 */
module.exports.getTemplateById = function (req, res, next){
  Template.getTemplateById(req.params.id, function(err,result){
    if (err) {
      res.json(500, {status: 'failure', message: 'Server Fehler.', internal: err});
      return next();
    } else if (result.length === 0){
      res.json({status: 'failure', message: 'Dieses Template existiert nicht.'});
      return next();
    } else {
      if (result[0].userstudies === null) {
        result[0].userstudies = [];
      } else {
        result[0].userstudies = result[0].userstudies.split(",").map(function(x){return parseInt(x);});
      }

      res.json({template: parseTemplateSQL(result)});
      return next();
    }
  });
};

/**
 * Parses the templates SQL According to the API
 * @param templateArray an Array of templates to be parsed
 * @returns {Array} a parsed version of the templates
 */
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
      template.fields.push(templateArray[i].fieldTitle);
      templates.push(template);
      iteratorTemplate = iteratorTemplate += 1;
    } else {
      templates[iteratorTemplate].fields.push(templateArray[i].fieldTitle);
    }
  }

  return templates;
};