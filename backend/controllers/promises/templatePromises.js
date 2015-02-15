"use strict";
var Template     = require('../../models/templates');
var Promise      = require('es6-promise').Promise;
var Validator    = require('validator');

module.exports.validFullTemplateReq = function(req){
  return new Promise(function(resolve,reject) {
    var validationErrors = [];
    var fields = [];
    if (!req.body.template) {
      validationErrors.push("Template Request hat ein falsches Format");
    } else {
      if (!Validator.isLength(req.body.template.title, 3)) {
        validationErrors.push("Template Titel ungültig. minimum 3 characters: " + req.body.template.title);
      }
      if (req.body.template.fields.length===0){
        validationErrors.push("Es wird mindestens ein Template Field benötigt");
      } else if (req.body.template.fields.length > 9) {
        validationErrors.push("Es sind maximal zehn Template Fields möglich");
      } else {
          for (var i=0; i < req.body.template.fields.length; i += 1){
            if (!Validator.isLength(req.body.template.fields[i], 3)) {
              validationErrors.push("Template Feld Titel ungültig. Minimum 3 Charakter: " + req.body.template.fields[i]);
            }

            fields.push(Validator.toString(req.body.template.fields[i]));
          }
      }
    }

    if (validationErrors.length > 0) {
      reject(validationErrors.join(' '));
    } else {
      var templateData = {
        title: Validator.toString(req.body.template.title),
        fields: fields
      };
      resolve(templateData);
    }
  });
};

module.exports.templateExists = function(templateId){
  return new Promise(function(resolve, reject){
    Template.getTemplateById(templateId, function(err, result){
      if (err) {
        reject(err);
      } else if (result.length > 0){
        resolve(result[0]);
      } else {
        reject("Template wurde nicht gefunden.");
      }
    });
  });
};

module.exports.templateAvailable = function(templateName) {
  return new Promise(function(resolve, reject){
    Template.getTemplateByTitle(templateName, function(err, result){
      if (err){
        reject(err);
      } else if (result.length > 0) {
        reject("Template Titel schon vergeben.");
      } else {
        resolve(result[0]);
      }
    });
  });
};