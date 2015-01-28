"use strict";
var Template     = require('../../models/templates');
var Promise      = require('es6-promise').Promise;
var Validator    = require('validator');

module.exports.validFullTemplateReq = function(req){
  return new Promise(function(resolve,reject) {
    var validationErrors = [];
    if (!Validator.isLength(req.body.template.title, 3)) {
      validationErrors.push({message: "Template Title invalid, minimum 3 characters: " + req.body.template.title});
    }
    var fields = [];
    if (req.body.template.fields.length===0){
      validationErrors.push({message: "Minimum of one field for template required"});
    } else if (req.body.template.fields.length > 10) {
      validationErrors.push({message: "Maximum of ten fields for template allowed"});
    } else {
        for (var i=0; i < req.body.template.fields.length; i += 1){
          if (!Validator.isLength(req.body.template.fields[i].title, 3)) {
            validationErrors.push({message: "Template Field Title required. Minimum 3 characters: " + req.body.template.fields[i].title});
          }
          if (req.body.template.fields[i].value && !Validator.isLength(req.body.template.fields[i].value, 3)) {
            validationErrors.push({message: "Template Field Title invalid, minimum 3 characters: " + req.body.template.fields[i].value});
          }

          fields.push({
            title: Validator.toString(req.body.template.fields[i].title),
            value: Validator.toString(req.body.template.fields[i].value)
          });
        }
    }

    if (validationErrors.length > 0) {
      reject(validationErrors);
    } else {
      var templateData = {
        title: Validator.toString(req.body.template.title),
        fields: fields
      };
      resolve(templateData);
    }
  });
};

module.exports.validTemplateReq = function(req){
  return new Promise(function(resolve,reject) {
    var validationErrors = [];

    if (!Validator.isNumeric(req.body.template.id)) {
      validationErrors.push({message: "Template Id invalid, numeric required: " + req.body.template.id});
    }
    if (!Validator.isLength(req.body.template.title, 3)) {
      validationErrors.push({message: "Template Title invalid, minimum 3 characters: " + req.body.template.title});
    }

    if (validationErrors.length > 0) {
      reject(validationErrors);
    } else {
      var templateData = {
        id: Validator.toString(req.body.template.id),
        title: Validator.toString(req.body.template.title)
      };
      resolve(templateData);
    }
  });
};

module.exports.templateExists = function(templateId){
  return new Promise(function(resolve, reject){
    Template.getTemplateById(templateId, function(err, result){
      if (err) {
        reject({message: 'Internal error, please try again.'});
      }

      if (result.length > 0){
        resolve(result[0]);
      } else {
        reject({message: 'Template not found.'});
      }
    });
  });
};

module.exports.templateAvailable = function(templateName) {
  return new Promise(function(resolve, reject){
    Template.getTemplateByTitle(templateName, function(err, result){
      if (err){
        reject({message: 'Internal error, please try again.'});
      }

      if (result.length > 0) {
        reject({message: 'Template with this Title already exists.'});
      } else {
        resolve(result[0]);
      }
    });
  });
};