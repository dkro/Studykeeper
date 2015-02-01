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
    Label.addLabel(label, function(err,result){
      if (err) {
        throw err;
      } else {
        label.id = result.insertId;
        res.json({status: 'success', message: 'Label erstellt.', label: label});
      }
    });
  })
  .catch(function(err){
    res.json(500, {status: 'failure', message: err});
  });
};

module.exports.deleteLabel = function(req, res){
    var label = {id:req.params.id};
    LabelPromise.labelExists(label)
      // todo dont delete label when its used in a userstudy
    .then(function(){
      Label.deleteLabel(label, function(err){
        if (err) {
          throw err;
        } else {
          res.json({status: 'success', message: 'Label gelöscht.'});
        }
      });
    })
    .catch(function(err){
      res.json(500, {status: 'failure', message: err});
    });
};

module.exports.allLabels = function(req, res){
  Label.getAllLabels(function(err, list){
    if (err){
      res.json(500,{status: 'failure', message: 'Server Fehler.', internal: err});
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
          res.json(500, {status:'failure', message: err});
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
      res.json({status: 'failure', message: 'Label wurde nicht gefunden'});
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


