"use strict";
var Label         = require('../../models/labels');
var Promise      = require('es6-promise').Promise;
var Validator    = require('validator');

/**
 * Validates the Body of the Request to be of the following form:
 *
 * {
 *   "label": {
 *     "title": "title"
 *   }
 * }
 *
 * @param req Incoming Request Object
 * @returns {Promise} A Promise validating the Label Request
 */
module.exports.validLabelReq = function(req){
  return new Promise(function(resolve,reject) {
    var validationErrors = [];
    if (!req.body.label) {
      validationErrors.push("Die gesendeten Daten sind nicht im geforderten Format. " +
      "Bitte wenden Sie sich an einen Administrator.");
    } else {
      if (!Validator.isLength(req.body.label.title, 3)) {
        validationErrors.push("Ein Label Titel muss mindestens aus drei Zeichen bestehen. Erhalten: \"" + req.body.label.title + "\"");
      }
    }
    if (validationErrors.length > 0) {
      reject(validationErrors.join(' '));
    } else {
      var labelData = {
        title: Validator.toString(req.body.label.title)
      };
      resolve(labelData);
    }
  });
};

/**
 * Promises that the label with a certain ID exists in the System
 *
 * @param label a label object with an id
 * @returns {Promise} A Promise with the label object
 */
module.exports.labelExists = function(label){
  return new Promise(function(resolve, reject){
    Label.getLabelById(label.id, function(err, result){
      if (err) {
        reject(err);
      } else if (result.length > 0){
        resolve(result[0]);
      } else {
        reject('Das Label existiert nicht.');
      }
    });
  });
};

/**
 * Promises that the title of the Label is not used in the System yet
 * @param label a Label object with a title
 * @returns {Promise} A Promise with the label object
 */
module.exports.labelAvailable = function(label) {
  return new Promise(function(resolve, reject){
    Label.getLabelByName(label.title,function(err, result){
      if (err){
       reject(err);
      }

      if (result.length > 0) {
        reject("Das Label \"" + label.title + "\" existiert bereits.");
      } else {
        resolve(result[0]);
      }
    });
  });
};