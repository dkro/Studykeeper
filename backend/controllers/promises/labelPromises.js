"use strict";
var Label         = require('../../models/labels');
var Promise      = require('es6-promise').Promise;
var Validator    = require('validator');

module.exports.validLabelReq = function(req,hasId){
  return new Promise(function(resolve,reject) {
    var validationErrors = [];

    if (hasId){
      if (!Validator.isNumeric(req.body.label.id)) {
        validationErrors.push({message: "Label Id invalid, numeric required: " + req.body.label.title});
      }
    }
    if (!Validator.isLength(req.body.label.title, 3)) {
      validationErrors.push({message: "Label Title invalid, minimum 3 characters: " + req.body.label.title});
    }
    if (validationErrors.length > 0) {
      reject(validationErrors);
    } else {
      var labelData = {
        title: Validator.toString(req.body.label.title)
      };
      if (hasId) {
        labelData.id = req.body.label.id;
      }
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
        reject('Label wurde nicht gefunden.');
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
        reject('Label existiert schon.');
      } else {
        resolve(result[0]);
      }
    });
  });
};