"use strict";
var Label        = require('../models/labels');
var Promise      = require('es6-promise').Promise;
var UserstudyPromise = require('./promises/userstudyPromises');
var LabelPromise = require('./promises/labelPromises');
var Async       = require('async');


module.exports.createLabel = function(req, res){
  var label;

  LabelPromise.validLabelReq(req,false)
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

module.exports.deleteLabel = function(req, res){
    var label = {id:req.params.id};
    LabelPromise.labelExists(label)
    .then(function(){
      Label.deleteLabel(label, function(err){
        if (err) {
          throw err;
        } else {
          res.json({status: 'success', message: 'label deleted', label: label});
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
      Async.eachSeries(list, function(item, callback){
        if (item.userstudies === null) {
          item.userstudies = [];
        } else {
          item.userstudies = item.userstudies.split(",").map(function(x){return parseInt(x);});
        }

        callback();
      }, function(err){
        if(err){
          res.json({status:'failure',message: err});
        } else {
          res.json({labels: list});
        }
      });
    }
  });
};

module.exports.getLabelById = function(req, res){
  Label.getLabelById(req.params.id, function(err,result){
    if (err) {
      res.json(500, {status: 'failure', errors: err});
    } else if (result.length === 0 ){
      res.json({status: 'failure', errors: [{message: 'Label not found'}]});
    } else {
      var label = result[0];
      if (label.userstudies === null) {
        label.userstudies = [];
      } else {
        label.userstudies = label.userstudies.split(",").map(function(x){return parseInt(x);});
      }

      res.json({label: label});
    }
  });
};

module.exports.addLabeltoUserstudy = function(req, res){
  var validationPromises = [UserstudyPromise.validUserstudyReq(req), LabelPromise.validLabelReq(req,true)];

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
