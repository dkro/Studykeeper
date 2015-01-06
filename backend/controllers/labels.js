"use strict";
var Label        = require('../models/labels');
var Promise      = require('es6-promise').Promise;
var UserstudyPromise = require('./promises/userstudyPromises');
var LabelPromise = require('./promises/labelPromises');


module.exports.createLabel = function(req, res){
  var label;

  LabelPromise.validLabelReq(req)
  .then(function(result){
    label = result;
    return LabelPromise.labelAvailable(label);
  })
  .then(function(){
    Label.addLabel(label, function(err){
      if (err) {
        throw err;
      } else {
        res.json({status: 'success', message: 'label created', label: label});
      }
    });
  })
  .catch(function(err){
    res.json(500, {status: 'failure', errors: err});
  });
};

module.exports.allLabels = function(req, res){
  Label.getAllLabels(function(err, list){
    if (err){
      res.json(500,{status: 'failure', errors: {message: 'Internal error, please try again.'}});
    } else {
      res.json({label: list});
    }
  });
};

module.exports.addLabeltoUserstudy = function(req, res){
  var validationPromises = [UserstudyPromise.validUserstudyReq(req), LabelPromise.validLabelReq(req)];

  Promise.all(validationPromises).then(function(results){
    var userstudy = results[0];
    var label = results[1];

    var existencePromises = [UserstudyPromise.userstudyExists(userstudy), LabelPromise.labelExists(label)];

    Promise.all(existencePromises).then(function(){
      Label.mapLabeltoUserstudy(label, userstudy, function(err){
        if (err) {
          throw err;
        } else {
          res.json({status: 'success', message: 'label added to userstudy', label: label, usertudy: userstudy});
        }
      });
    });
  })
  .catch(function(err){
    res.json(500, {status: 'failure', errors: err});
  });
};
