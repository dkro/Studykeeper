"use strict";
var Userstudy    = require('../../models/userstudies');
var Promise      = require('es6-promise').Promise;
var Validator    = require('validator');

module.exports.validFullUserstudyReq = function(req){
  return new Promise(function(resolve,reject) {
    var validationErrors = [];
    if (!req.body.userstudy) {
      validationErrors.push("Nutzerstudien request hat ein falsches Format.");
    } else {
      if (!Validator.isAlpha(req.body.userstudy.title) && !Validator.isLength(req.body.userstudy.title, 3)) {
        validationErrors.push("Title ungültig. Minimum 3 Charakter: " + req.body.userstudy.title);
      }
      if (!Validator.isNumeric(req.body.userstudy.tutor)) {
        validationErrors.push("Tutor-ID ungültig. Zahl erwartet: " + req.body.userstudy.tutor);
      }
      if (!Validator.isNumeric(req.body.userstudy.executor)) {
        validationErrors.push("Executor-ID ungültig. Zahl erwartet:: " + req.body.userstudy.executor);
      }
      if (!Validator.isDate(req.body.userstudy.fromDate)) {
        validationErrors.push("FromDate ungültig. Datum Fromat erwartet YYYY-MM-DD: " + req.body.userstudy.fromDate);
      }
      if (!Validator.isDate(req.body.userstudy.untilDate)) {
        validationErrors.push("UntilDate ungültig. Datum Fromat erwartet  YYYY-MM-DD: " + req.body.userstudy.untilDate);
      }
      if (!Validator.isLength(req.body.userstudy.description, 3)) {
        validationErrors.push("Description ungültig. Minimum 3 Charakter: " + req.body.userstudy.description);
      }
      if (req.body.userstudy.doodleLink  && !Validator.isURL(req.body.userstudy.doodleLink)) {
        validationErrors.push("DoodleLink ungültig. URL Format erwartet: " + req.body.userstudy.doodleLink);
      }
      if (req.body.userstudy.paper  && !Validator.isURL(req.body.userstudy.paper)) {
        validationErrors.push("Paper ungültig. URL Format erwartet: " + req.body.userstudy.paper);
      }
      if (!Validator.isNumeric(req.body.userstudy.mmi)) {
        validationErrors.push("MMI Points ungültig. Zahl erwartet: " + req.body.userstudy.mmi);
      }
      if (!Validator.isNumeric(req.body.userstudy.compensation)) {
        validationErrors.push("Compensation ungültig, numeric required: " + req.body.userstudy.compensation);
      }
      if (!Validator.isLength(req.body.userstudy.location, 3)) {
        validationErrors.push("Location ungültig. Minimum 3 Charakter: " + req.body.userstudy.location);
      }
      if (!Validator.isNumeric(req.body.userstudy.space)) {
        validationErrors.push("Space ungültig. Zahl erwartet: " + req.body.userstudy.space);
      }
      if (req.body.userstudy.templateId && !Validator.isNumeric(req.body.userstudy.templateId)) {
        validationErrors.push("TemplateId ungültig. Zahl erwartet: " + req.body.userstudy.templateId);
      }
      if (Array.isArray(req.body.userstudy.requiredStudies)) {
        for (var i=0; i<req.body.userstudy.requiredStudies; i+=1){
          if (!Validator.isNumeric(req.body.userstudy.requiredStudies)) {
            validationErrors.push("requiredStudies ungültig. Zahl erwartet: " + req.body.userstudy.requiredStudies);
          }
        }
      } else {
        validationErrors.push("requiredStudies ungültig, Array von Zahlen erwartet: " + req.body.userstudy.isFutureStudyFor);
      }
      if (Array.isArray(req.body.userstudy.news)) {
        for (var j=0; j<req.body.userstudy.news; j+=1){
          if (!Validator.isNumeric(req.body.userstudy.news)) {
            validationErrors.push("News ungültig. Zahl erwartet: " + req.body.userstudy.news);
          }
        }
      } else {
        validationErrors.push("News ungültig. Array von Zahlen erwartet: " + req.body.userstudy.news);
      }
      if (Array.isArray(req.body.userstudy.labels)) {
        for (var k=0; k<req.body.userstudy.labels; k+=1){
          if (!Validator.isNumeric(req.body.userstudy.labels)) {
            validationErrors.push("labels ungültig. Zahl erwartet: " + req.body.userstudy.labels);
          }
        }
      } else {
        validationErrors.push("labels ungültig. Array von Zahlen erwartet: " + req.body.userstudy.labels);
      }
      if (req.body.userstudy.fromDate > req.body.userstudy.untilDate) {
        validationErrors.push("Das from-Datum muss vor dem until-Datum liegen.");
      }
    }

    if (validationErrors.length > 0) {
      reject(validationErrors);
    } else {
      var userStudyData = {
        title: Validator.toString(req.body.userstudy.title),
        tutorId: Validator.toString(req.body.userstudy.tutor),
        executorId: Validator.toString(req.body.userstudy.executor),
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
        labels: req.body.userstudy.labels,
        templateId: req.body.userstudy.template
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
        reject("Der Nutzerstudie wurde nicht gefunden");
      } else {
        resolve(result[0]);
      }
    });

  });
};

module.exports.userstudyHasSpace = function(userstudyId) {
  return new Promise(function(resolve, reject){
    Userstudy.getUserstudyById(userstudyId,function(err,result){
      if (err) {reject(err);}
      var userstudy = result[0];
      if (result.length === 0) {
        reject("Nutzerstudie wurde nicht gefunden.");
      } else {
        Userstudy.getUsersRegisteredToStudy(userstudyId, function(err,result){
          if (err) {
            reject(err);
          } else if (result.length < userstudy.space) {
            resolve(result[0]);
          } else {
            reject("Die Nutzerstudie " + userstudy.title + " hat keine offenen Plätze.");
          }
        });
      }
    });
  });
};

module.exports.userIsRegisteredToStudy = function(userId, userstudyId){
  return new Promise(function(resolve, reject){
    Userstudy.getUsersRegisteredToStudy(userstudyId, function(err,result){
      if (err) {
        reject(err);
      } else {
        var registered = false;
        for (var i= 0; i<result.length; i+=1) {
          if (result[i].id === parseInt(userId)) {
            registered = true;
            break;
          }
        }

        if (registered) {
          resolve(userId);
        } else {
          reject("Der Nutzer " + userId + " ist nicht zur Nutzerstudie " + userstudyId + " registriert");
        }
      }
    });
  });
};

module.exports.userIsNotConfirmed = function(userId,studyId){
  return new Promise(function(resolve, reject){
    Userstudy.getStudiesRelationFor(studyId, "users", function(err,result){
      if (err) {
        reject(err);
      } else {
        var confirmed = false;
        for (var i= 0; i<result.length; i+=1) {
          if (result[i].userId === parseInt(userId) && result[i].confirmed === 1 && result[i].studyId === parseInt(studyId)) {
            confirmed = true;
            break;
          }
        }

        if (!confirmed) {
          resolve();
        } else {
          reject("Die Telnahme des Nutzers " + userId + " an der Nutzerstudie " + studyId + " ist schon bestätigt");
        }
      }
    });
  });
};


module.exports.userIsNOTRegisteredToStudy = function(userId,userstudyId){
  return new Promise(function(resolve, reject){
    Userstudy.getUsersRegisteredToStudy(userstudyId, function(err,result){
      if (err) {
        reject(err);
      } else {
        var registered = false;
        for (var i= 0; i<result.length; i+=1) {
          if (result[i].id === userId) {
            registered = true;
            break;
          }
        }

        if (registered) {
          reject("Der Nutzer " + userId + " ist schon zur Nutzerstudie " + userstudyId + "registriert");
        } else {
          resolve(userId);
        }
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


