"use strict";
var Userstudy    = require('../../models/userstudies');
var Promise      = require('es6-promise').Promise;
var Validator    = require('validator');


module.exports.validUserstudyReq = function(req){
  return new Promise(function(resolve,reject) {
    var validationErrors = [];
    if (!Validator.isNumeric(req.body.userstudy.id)) {
      validationErrors.push({message: "Id invalid, has to be numeric: " + req.body.userstudy.id});
    }
    if (!Validator.isAlpha(req.body.userstudy.title) && !Validator.isLength(req.body.userstudy.title, 3)) {
      validationErrors.push({message: "Title invalid, minimum 3 characters: " + req.body.userstudy.title});
    }
    if (validationErrors.length > 0) {
      reject(validationErrors);
    } else {
      var userStudyData = {
        id: Validator.toString(req.body.userstudy.id),
        title: Validator.toString(req.body.userstudy.title)
      };
      resolve(userStudyData);
    }
  });
};

module.exports.validFullUserstudyReq = function(req){
  return new Promise(function(resolve,reject) {
    var validationErrors = [];
    if (!Validator.isAlpha(req.body.userstudy.title) && !Validator.isLength(req.body.userstudy.title, 3)) {
      validationErrors.push({message: "Title invalid, minimum 3 characters: " + req.body.userstudy.title});
    }
    if (!Validator.isEmail(req.body.userstudy.tutorname)) {
      validationErrors.push({message: "Tutorname invalid, has be an email: " + req.body.userstudy.tutorname});
    }
    if (!Validator.isEmail(req.body.userstudy.executorname)) {
      validationErrors.push({message: "Executorname invalid, has be an email:: " + req.body.userstudy.executorname});
    }
    if (!Validator.isNumeric(req.body.userstudy.tutorId)) {
      validationErrors.push({message: "Tutor-ID invalid, has be numeric: " + req.body.userstudy.tutorId});
    }
    if (!Validator.isNumeric(req.body.userstudy.executorId)) {
      validationErrors.push({message: "Executor-ID invalid, has be numeric:: " + req.body.userstudy.executorId});
    }
    if (!Validator.isDate(req.body.userstudy.fromDate)) {
      validationErrors.push({message: "FromDate invalid, has to be of form YYYY-MM-DD: " + req.body.userstudy.fromDate});
    }
    if (!Validator.isDate(req.body.userstudy.untilDate)) {
      validationErrors.push({message: "UntilDate invalid, has to be of form YYYY-MM-DD: " + req.body.userstudy.untilDate});
    }
    if (!Validator.isLength(req.body.userstudy.description, 3)) {
      validationErrors.push({message: "Description invalid, minimum 3 characters: " + req.body.userstudy.description});
    }
    if (req.body.userstudy.doodleLink !== undefined && !Validator.isURL(req.body.userstudy.doodleLink)) {
      validationErrors.push({message: "DoodleLink invalid, has to be a valid URL: " + req.body.userstudy.doodleLink});
    }
    if (req.body.userstudy.paper !== undefined && !Validator.isURL(req.body.userstudy.paper)) {
      validationErrors.push({message: "Paper invalid, has to be a valid URL: " + req.body.userstudy.paper});
    }
    if (!Validator.isNumeric(req.body.userstudy.mmi)) {
      validationErrors.push({message: "MMI Points invalid, numeric required: " + req.body.userstudy.mmi});
    }
    if (!Validator.isNumeric(req.body.userstudy.compensation)) {
      validationErrors.push({message: "Compensation invalid, numeric required: " + req.body.userstudy.compensation});
    }
    if (!Validator.isLength(req.body.userstudy.location, 3)) {
      validationErrors.push({message: "Location invalid, minimum 3 characters: " + req.body.userstudy.location});
    }
    if (!Validator.isNumeric(req.body.userstudy.space, 3)) {
      validationErrors.push({message: "Space invalid, numeric required: " + req.body.userstudy.space});
    }
    if (Array.isArray(req.body.userstudy.requiredStudies)) {
      for (var i=0; i<req.body.userstudy.requiredStudies; i+=1){
        if (!Validator.isNumeric(req.body.userstudy.requiredStudies)) {
          validationErrors.push({message: "requiredStudies invalid, numeric required: " + req.body.userstudy.requiredStudies});
        }
      }
    } else {
      validationErrors.push({message: "requiredStudies invalid, Array of Ids required: " + req.body.userstudy.isFutureStudyFor});
    }
    if (Array.isArray(req.body.userstudy.news)) {
      for (var i=0; i<req.body.userstudy.news; i+=1){
        if (!Validator.isNumeric(req.body.userstudy.news)) {
          validationErrors.push({message: "news invalid, numeric required: " + req.body.userstudy.news});
        }
      }
    } else {
      validationErrors.push({message: "news invalid, Array of Ids required: " + req.body.userstudy.news});
    }
    if (Array.isArray(req.body.userstudy.labels)) {
      for (var i=0; i<req.body.userstudy.labels; i+=1){
        if (!Validator.isNumeric(req.body.userstudy.labels)) {
          validationErrors.push({message: "labels invalid, numeric required: " + req.body.userstudy.labels});
        }
      }
    } else {
      validationErrors.push({message: "labels invalid, Array of Ids required: " + req.body.userstudy.labels});
    }
    if (req.body.userstudy.fromDate > req.body.userstudy.untilDate) {
      validationErrors.push({message: 'The from-date needs to be before the until-date.'});
    }
    if (validationErrors.length > 0) {
      reject(validationErrors);
    } else {
      var userStudyData = {
        title: Validator.toString(req.body.userstudy.title),
        tutorname: Validator.toString(req.body.userstudy.tutorname),
        executorname: Validator.toString(req.body.userstudy.executorname),
        tutorId: Validator.toString(req.body.userstudy.tutorId),
        executorId: Validator.toString(req.body.userstudy.executorId),
        fromDate: Validator.toString(req.body.userstudy.fromDate),
        untilDate: Validator.toString(req.body.userstudy.untilDate),
        description: Validator.toString(req.body.userstudy.description),
        doodleLink: Validator.toString(req.body.userstudy.doodleLink),
        paper: Validator.toString(req.body.userstudy.paper),
        mmi: Validator.toString(req.body.userstudy.mmi),
        compensation: Validator.toString(req.body.userstudy.compensation),
        location: Validator.toString(req.body.userstudy.location),
        space: Validator.toString(req.body.userstudy.space),
        requiredStudies: req.body.userstudy.requiredStudies,
        news: req.body.userstudy.news,
        labels: req.body.userstudy.labels
      };
      resolve(userStudyData);
    }
  });
};

module.exports.userstudyExists = function(userstudy) {
  return new Promise(function(resolve, reject){

    Userstudy.getUserstudyById(userstudy.id,function(err,result){
      if (err) {
        reject(err);
      } else if (result.length === 0) {
        reject({message: 'userstudy not found', userstudy: {
          id: userstudy.id,
          title: userstudy.title
        }});
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
      if (result.length === 0) {reject({message: 'userstudy not found', userstudy: userstudy});}

      Userstudy.getUsersRegisteredToStudy(userstudy, function(err,result){
        if (err) {reject(err);}

        if (result.length < space) {
          resolve(result[0]);
        } else {
          reject({message: 'userstudy: ' + userstudy.title + ' has not open slots'});
        }
      });

    });
  });
};

module.exports.userIsRegisteredToStudy = function(userId, userstudyId){
  return new Promise(function(resolve, reject){
    Userstudy.getUsersRegisteredToStudy(userstudyId, function(err,result){
      if (err) {reject(err);}

      var registered = false;
      for (var i= 0; i<result.length; i+=1) {
        if (result[i].id === userId) {
          registered = true;
          break;
        }
      }

      if (registered) {
        resolve(userId);
      } else {
        reject({message: 'user: ' + userId + ' is not registered to userstudy: ' + userstudyId});
      }
    });
  });
};

module.exports.userIsNOTRegisteredToStudy = function(userId,userstudyId){
  return new Promise(function(resolve, reject){
    Userstudy.getUsersRegisteredToStudy(userstudyId, function(err,result){
      if (err) {reject(err);}

      var registered = false;
      for (var i= 0; i<result.length; i+=1) {
        if (result[i].id === userId) {
          registered = true;
          break;
        }
      }

      if (registered) {
        reject({message: 'user: ' + userId + ' is registered already to userstudy: ' + userstudyId});
      } else {
        resolve(userId);
      }
    });
  });
};

module.exports.labelsForUserstudy = function(userstudy){
  return new Promise(function(resolve, reject){
    Userstudy.getLabelsForStudy(userstudy, function(err, result) {
      if (err) {
        reject(err);
      } else {
        resolve(result[0]);
      }
    });
  });
};

module.exports.userIsExecutorFor = function(user) {
  return new Promise(function (resolve, reject) {
    Userstudy.getStudiesUserIsExecutor(user, function (err, result) {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
};

module.exports.userIsTutorFor = function(user) {
  return new Promise(function (resolve, reject) {
    Userstudy.getStudiesUserIsTutor(user, function (err, result) {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
};

module.exports.userRegisteredStudies = function(user) {
  return new Promise(function (resolve, reject) {
    Userstudy.getStudiesUserIsRegistered(user, function (err, result) {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
};

