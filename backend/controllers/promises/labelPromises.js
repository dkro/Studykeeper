"use strict";
var Label         = require('../../models/labels');
var Promise      = require('es6-promise').Promise;
var Validator    = require('validator');

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