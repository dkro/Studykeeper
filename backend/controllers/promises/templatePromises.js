"use strict";
var Template     = require('../../models/templates');
var Promise      = require('es6-promise').Promise;
var Validator    = require('validator');

/**
 * Validates the Body of the Request Object to be of the following Form:
 * {
 *  "template" : {
 *  "title" : "template title5",
 *  "fields" : ["field1 title","field2 title","field 3 title"]
 *  }
 *}
 *
 * @param req Incoming Request Object
 * @returns {Promise} A Promise with the validated Template Request
 */
module.exports.validFullTemplateReq = function(req){
  return new Promise(function(resolve,reject) {
    var validationErrors = [];
    var fields = [];
    if (!req.body.template) {
      validationErrors.push("Die gesendeten Daten sind nicht im geforderten Format. " +
      "Bitte wenden Sie sich an einen Administrator.");
    } else {
      if (!Validator.isLength(req.body.template.title, 3)) {
        validationErrors.push("Ein Template Titel muss mindestens aus drei Zeichen bestehen. Erhalten: \"" + req.body.template.title+ "\"");
      }
      if (req.body.template.fields.length===0){
        validationErrors.push("Es wird mindestens ein Template Feld benötigt.");
      } else if (req.body.template.fields.length > 9) {
        validationErrors.push("Es sind maximal zehn Template Felder möglich.");
      } else {
          for (var i=0; i < req.body.template.fields.length; i += 1){
            if (!Validator.isLength(req.body.template.fields[i], 3)) {
              validationErrors.push("Ein Template Feld Titel muss mindestens aus drei Zeichen bestehen. Erhalten: \"" + req.body.template.fields[i]+ "\"");
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

/**
 * Promises that the template with a certain ID exists in the System
 * @param templateId the ID for the template
 * @returns {Promise} A Promise with the template object
 */
module.exports.templateExists = function(templateId){
  return new Promise(function(resolve, reject){
    Template.getTemplateById(templateId, function(err, result){
      if (err) {
        reject(err);
      } else if (result.length > 0){
        resolve(result[0]);
      } else {
        reject("Das Template existiert nicht.");
      }
    });
  });
};

/**
 * Promises that the template name is not yet used
 * @param templateName the template name to be checked against
 * @returns {Promise} A Promise with the template Object
 */
module.exports.templateAvailable = function(templateName) {
  return new Promise(function(resolve, reject){
    Template.getTemplateByTitle(templateName, function(err, result){
      if (err){
        reject(err);
      } else if (result.length > 0) {
        reject("Der Template Titel \"" + templateName + "\"existiert bereits.");
      } else {
        resolve(result[0]);
      }
    });
  });
};