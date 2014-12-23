"use strict";
var Label         = require('../../models/labels');
var Promise      = require('es6-promise').Promise;
var Validator    = require('validator');

module.exports.validLabelReq = function(req){
  return new Promise(function(resolve,reject) {
    var validationErrors = [];
    if (!Validator.isNumeric(req.body.labelId)) {
      validationErrors.push({message: "Label Id invalid, has to be numeric: " + req.body.id});
    }
    if (!Validator.isAlpha(req.body.labelTitle) && !Validator.isLength(req.body.title, 3)) {
      validationErrors.push({message: "Label Title invalid, minimum 3 characters: " + req.body.title});
    }
    if (validationErrors.length > 0) {
      reject(validationErrors);
    } else {
      var labelData = {
        id: Validator.toString(req.body.labelId),
        title: Validator.toString(req.body.labelTitle)
      };
      resolve(labelData);
    }
  });
};

module.exports.labelExists = function(label){
  return new Promise(function(resolve, reject){
    Label.getLabel(label, function(err, result){
      if (err) {
        reject(err);
      }

      if (result > 0){
        resolve(result[0]);
      } else {
        reject({message: 'Label not found.'});
      }
    });
  });
};
