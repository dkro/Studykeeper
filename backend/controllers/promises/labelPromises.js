"use strict";
var Label         = require('../../models/labels');
var Promise      = require('es6-promise').Promise;
var Validator    = require('validator');

module.exports.validLabelReq = function(req){
  return new Promise(function(resolve,reject) {
    var validationErrors = [];
    if (!Validator.isLength(req.body.label.title, 3)) {
      validationErrors.push({message: "Label Title invalid, minimum 3 characters: " + req.body.label.title});
    }
    if (validationErrors.length > 0) {
      reject(validationErrors);
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
    Label.getLabel(label, function(err, result){
      if (err) {
        reject({message: 'Internal error, please try again.'});
      }

      if (result.length > 0){
        resolve(result[0]);
      } else {
        reject({message: 'Label not found.'});
      }
    });
  });
};

module.exports.labelAvailable = function(label) {
  return new Promise(function(resolve, reject){
    Label.getLabel(label,function(err, result){
      if (err){
       reject({message: 'Internal error, please try again.'});
      }

      if (result.length > 0) {
        reject({message: 'Label already exists.'});
      } else {
        resolve(result[0]);
      }
    });
  });
};