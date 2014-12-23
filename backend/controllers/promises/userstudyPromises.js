"use strict";
var Userstudy    = require('../../models/userstudies');
var Promise      = require('es6-promise').Promise;
var Validator    = require('validator');


module.exports.validUserstudyReq = function(req){
  return new Promise(function(resolve,reject) {
    var validationErrors = [];
    if (!Validator.isNumeric(req.body.id)) {
      validationErrors.push({message: "Id invalid, has to be numeric: " + req.body.id});
    }
    if (!Validator.isAlpha(req.body.title) && !Validator.isLength(req.body.title, 3)) {
      validationErrors.push({message: "Title invalid, minimum 3 characters: " + req.body.title});
    }
    if (validationErrors.length > 0) {
      reject(validationErrors);
    } else {
      var userStudyData = {
        id: Validator.toString(req.body.id),
        title: Validator.toString(req.body.title)
      };
      resolve(userStudyData);
    }
  });
};

module.exports.validFullUserstudyReq = function(req){
  return new Promise(function(resolve,reject) {
    var validationErrors = [];
    if (!Validator.isNumeric(req.body.id)) {
      validationErrors.push({message: "Id invalid, has to be numeric: " + req.body.id});
    }
    if (!Validator.isAlpha(req.body.title) && !Validator.isLength(req.body.title, 3)) {
      validationErrors.push({message: "Title invalid, minimum 3 characters: " + req.body.title});
    }
    if (!Validator.isEmail(req.body.tutorname)) {
      validationErrors.push({message: "Tutorname invalid, has be an email: " + req.body.tutorname});
    }
    if (!Validator.isEmail(req.body.executorname)) {
      validationErrors.push({message: "Executorname invalid, has be an email:: " + req.body.executorname});
    }
    if (!Validator.isDate(req.body.fromDate)) {
      validationErrors.push({message: "FromDate invalid, has to be of form YYYY-MM-DD: " + req.body.fromDate});
    }
    if (!Validator.isDate(req.body.untilDate)) {
      validationErrors.push({message: "UntilDate invalid, has to be of form YYYY-MM-DD: " + req.body.untilDate});
    }
    if (!Validator.isLength(req.body.description, 3)) {
      validationErrors.push({message: "Description invalid, minimum 3 characters: " + req.body.description});
    }
    if (req.body.doodleLink !== undefined && !Validator.isURL(req.body.doodleLink)) {
      validationErrors.push({message: "DoodleLink invalid, has to be a valid URL: " + req.body.doodleLink});
    }
    if (req.body.paper !== undefined && !Validator.isURL(req.body.paper)) {
      validationErrors.push({message: "Paper invalid, has to be a valid URL: " + req.body.paper});
    }
    if (!Validator.isNumeric(req.body.mmi)) {
      validationErrors.push({message: "MMI Points invalid, numeric required: " + req.body.mmi});
    }
    if (!Validator.isNumeric(req.body.compensation)) {
      validationErrors.push({message: "Compensation invalid, numeric required: " + req.body.compensation});
    }
    if (!Validator.isLength(req.body.location, 3)) {
      validationErrors.push({message: "Location invalid, minimum 3 characters: " + req.body.location});
    }
    if (!Validator.isNumeric(req.body.space, 3)) {
      validationErrors.push({message: "Space invalid, numeric required: " + req.body.space});
    }


    if (req.body.fromDate > req.body.untilDate) {
      validationErrors.push({message: 'The from-date needs to be before the until-date.'});
    }
    if (validationErrors.length > 0) {
      reject(validationErrors);
    } else {
      var userStudyData = {
        id: Validator.toString(req.body.id),
        title: Validator.toString(req.body.title),
        tutorname: Validator.toString(req.body.tutorname),
        executorname: Validator.toString(req.body.executorname),
        fromDate: Validator.toString(req.body.fromDate),
        untilDate: Validator.toString(req.body.untilDate),
        description: Validator.toString(req.body.description),
        doodleLink: Validator.toString(req.body.doodleLink),
        paper: Validator.toString(req.body.paper),
        mmi: Validator.toString(req.body.mmi),
        compensation: Validator.toString(req.body.compensation),
        location: Validator.toString(req.body.location)
      };
      resolve(userStudyData);
    }
  });
};

module.exports.userstudyExists = function(userstudy) {
  return new Promise(function(resolve, reject){
    Userstudy.getUserstudy(userstudy,function(err,result){
      if (err) {reject(err);}
      if (result.length === 0) {
        reject({message: 'userstudy:' + userstudy + ' not found'});
      } else {
        resolve(result[0]);
      }
    });
  });
};

module.exports.userstudyHasSpace = function(userstudy) {
  return new Promise(function(resolve, reject){
    Userstudy.getUserstudy(userstudy,function(err,result){
      if (err) {reject(err);}
      var space = result[0].space;
      //TODO

      if (result.length === 0) {reject({message: 'userstudy:' + userstudy + ' not found'});}
      resolve(result[0]);
    });
  });
};

module.exports.userIsRegisteredToStudy = function(user, userstudy){
  return new Promise(function(resolve, reject){
    //todo
  });
};

module.exports.userIsNOTRegisteredToStudy = function(user,userstudy){
  return new Promise(function(resolve, reject){
    // todo
  });
};
