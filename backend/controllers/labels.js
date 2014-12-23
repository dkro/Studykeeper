"use strict";
var Label        = require('../models/labels');
var Promise      = require('es6-promise').Promise;
var UserstudyPromise = require('./promises/userstudyPromises');
var LabelPromise = require('./promises/labelPromises');


module.exports.addLabeltoUserstudy = function(req, res){
  var validationPromises = [UserstudyPromise.validUserstudyReq(req),
    LabelPromise.validLabelReq(req)];

  Promise.all(validationPromises).then(function(results){

    var existencePromises =
      [UserstudyPromise.userstudyExists(results[0]),
      LabelPromise.labelExists(results[1])];

    Promise.all(existencePromises).then(function(results){
      var userstudy = results[0];
      var label = results[1];

      Label.mapLabeltoUserstudy(label, userstudy, function(err){
        if (err) {
          throw err;
        } else {
          res.json({status: 'success', message: 'label ' + label.title + 'added to userstudy ' + userstudy.title});
        }
      });
    })
      .catch(function(err){
        res.json(500, {status: 'failure', errors: err});
      });
  });
};

module.exports.createLabel = function(req, res){
  LabelPromise.labelAvailable(req)
  .then(function(label){
    Label.addLabel(label, function(err){
      if (err) {
        throw err;
      } else {
        res.json({status: 'success', message: 'label created:' + label.title});
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
      res.json(500,{status: 'failure', errors: err});
    } else {
      res.json(list);
    }
  });
};

module.exports.labelsFromUserstudy = function(req, res){
  UserstudyPromise.validUserstudyReq(req)
    .then(function(userstudy){
      return UserstudyPromise.userstudyExists(userstudy);
    })
    .then(function(userstudy){
      Label.getLabelsFromUserstudy(userstudy, function(err, list){
        if (err){
          res.json(500,{status: 'failure', errors: err});
        } else {
          res.json(list);
        }
      });
    })
    .catch(function(err){
      res.json(500,{status: 'failure', errors: err});
    });
};
