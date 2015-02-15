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
        validationErrors.push("Template Title ungültig. minimum 3 characters: " + req.body.template.title);
      }
      if (req.body.template.fields.length===0){
        validationErrors.push("Es ist mindestens ein Template Field benötigt");
      } else if (req.body.template.fields.length > 10) {
        validationErrors.push("Es sind maximal zehn Template Fields möglich");
      } else {
          for (var i=0; i < req.body.template.fields.length; i += 1){
            if (!Validator.isLength(req.body.template.fields[i].title, 3)) {
              validationErrors.push("Template Field Title ungültig. Minimum 3 Charakter: " + req.body.template.fields[i].title);
            }
            if (req.body.template.fields[i].value && !Validator.isLength(req.body.template.fields[i].value, 3)) {
              validationErrors.push("Template Field Value ungültig, Minimum 3 Charakter: " + req.body.template.fields[i].value);
            }

            fields.push({
              title: Validator.toString(req.body.template.fields[i].title),
              value: Validator.toString(req.body.template.fields[i].value)
            });
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
      }

      if (result.length > 0){
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
      }

      if (result.length > 0) {
        reject("Template Title schon vergeben.");
      } else {
        resolve(result[0]);
      }
    });
  });
};