"use strict";
var Label        = require('../models/labels');
var Promise      = require('es6-promise').Promise;
var LabelPromise = require('./promises/labelPromises');
var Async       = require('async');

/**
 * Creates a new Label
 * @param req Incoming Request Object
 * @param res Outgoing Response Object
 * @param next next handler
 */
module.exports.createLabel = function(req, res, next){
  var label;

  LabelPromise.validLabelReq(req)
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
        res.json({label: label});
        return next();
      }
    });
  })
  .catch(function(err){
    res.json(500, {status: 'failure', message: err});
    return next();
  });
};

/**
 * Deletes an existing label
 * @param req Incoming Request Object
 * @param res Outgoing Response Object
 * @param next next handler
 */
module.exports.deleteLabel = function(req, res, next){
    var label = {id:req.params.id};
    LabelPromise.labelExists(label)
    .then(function(label){
          if (label.userstudies === null) {
            Label.deleteLabel(label.id, function(err){
              if (err) {
                throw err;
              } else {
                res.json({});
                return next();
              }
            });
          } else {
            label.userstudies = label.userstudies.split(",").map(function(x){return parseInt(x);});
            res.json(500, {status: 'failure',
              message: 'Das Label konnte nicht gelöscht werden, da es zurzeit von mindestens einer Nutzerstudie ' +
              'verwendet wird.'});
            return next();
          }
    })
    .catch(function(err){
      res.json(500, {status: 'failure', message: err});
      return next();
    });
};

/**
 * Provides a list of all available labels
 * @param req Incoming Request Object
 * @param res Outgoing Response Object
 * @param next next handler
 */
module.exports.allLabels = function(req, res, next){
  Label.getAllLabels(function(err, list){
    if (err){
      res.json(500,{status: 'failure', message: 'Server Fehler.', internal: err});
      return next();
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
          return next();
        } else {
          res.json({labels: list});
          return next();
        }
      });
    }
  });
};

/**
 * Provides a label by id
 * @param req Incoming Request Object
 * @param res Outgoing Response Object
 * @param next next handler
 */
module.exports.getLabelById = function(req, res, next){
  Label.getLabelById(req.params.id, function(err,result){
    if (err) {
      res.json(500, {status: 'failure', errors: err});
      return next();
    } else if (result.length === 0 ){
      res.json(500, {status: 'failure', message: 'Dieses Label existiert nicht.'});
      return next();
    } else {
      var label = result[0];
      if (label.userstudies === null) {
        label.userstudies = [];
      } else {
        label.userstudies = label.userstudies.split(",").map(function(x){return parseInt(x);});
      }

      res.json({label: label});
      return next();
    }
  });
};


