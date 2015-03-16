"use strict";
var Userstudy    = require('../../models/userstudies');
var Template    = require('../../models/templates');
var Promise      = require('es6-promise').Promise;
var Validator    = require('validator');

module.exports.validFullUserstudyReq = function(req){
  return new Promise(function(resolve,reject) {
    var validationErrors = [];
    if (!req.body.userstudy) {
      validationErrors.push("Nutzerstudien Anfrage hat ein falsches Format.");
    } else {
      if (!req.body.userstudy.title || !Validator.isAlpha(req.body.userstudy.title) && !Validator.isLength(req.body.userstudy.title, 3)) {
        validationErrors.push("Title ungültig. Minimum 3 Charakter. Erhalten: " + req.body.userstudy.title);
      }
      if (!req.body.userstudy.tutor || !Validator.isNumeric(req.body.userstudy.tutor)) {
        validationErrors.push("Tutor-ID ungültig. Zahl erwartet. Erhalten: " + req.body.userstudy.tutor);
      }
      if (!req.body.userstudy.executor || !Validator.isNumeric(req.body.userstudy.executor)) {
        validationErrors.push("Executor-ID ungültig. Zahl erwartet. Erhalten: " + req.body.userstudy.executor);
      }
      if (!req.body.userstudy.fromDate || !Validator.isDate(req.body.userstudy.fromDate)) {
        validationErrors.push("FromDate ungültig. Datum Fromat erwartet YYYY-MM-DD. Erhalten: " + req.body.userstudy.fromDate);
      }
      if (!req.body.userstudy.untilDate || !Validator.isDate(req.body.userstudy.untilDate)) {
        validationErrors.push("UntilDate ungültig. Datum Fromat erwartet  YYYY-MM-DD. Erhalten: " + req.body.userstudy.untilDate);
      }
      if (!req.body.userstudy.description || !Validator.isLength(req.body.userstudy.description, 3)) {
        validationErrors.push("Description ungültig. Minimum 3 Charakter. Erhalten: " + req.body.userstudy.description);
      }
      if (req.body.userstudy.link) {
        if (!/^(f|ht)tps?:\/\//i.test(req.body.userstudy.link)) {
          req.body.userstudy.link = "http://" + req.body.userstudy.link;
        }
        if (!Validator.isURL(req.body.userstudy.link)) {
          validationErrors.push("Link ungültig. URL Format (http://www.beispiel.de) erwartet. Erhalten: " + req.body.userstudy.link);
        }
      }
      if (!req.body.userstudy.hasOwnProperty("mmi") || !Validator.isFloat(req.body.userstudy.mmi)) {
        validationErrors.push("MMI-Punkte ungültig. Es wird eine Zahl erwartet. Erhalten: " + req.body.userstudy.mmi);
      }
      if (!req.body.userstudy.hasOwnProperty("compensation")) {
        validationErrors.push("Prämie ungültig. Erhalten: " + req.body.userstudy.compensation);
      }
      if (!req.body.userstudy.location || !Validator.isLength(req.body.userstudy.location, 3)) {
        validationErrors.push("Ort ungültig. Minimum 3 Charakter. Erhalten: " + req.body.userstudy.location);
      }
      if (!req.body.userstudy.hasOwnProperty("space") || !Validator.isInt(req.body.userstudy.space)) {
        validationErrors.push("Teilnehmeranzahl ungültig. Es wird eine Zahl erwartet. Erhalten: " + req.body.userstudy.space);
      }
      if (!req.body.userstudy.template || !Validator.isNumeric(req.body.userstudy.template)) {
        validationErrors.push("Die Template-Id ist ungültig. Es wird eine Zahl erwartet. Erhalten: " + req.body.userstudy.template);
      }
      if (!req.body.userstudy.templateValues || !Array.isArray(req.body.userstudy.templateValues)) {
        validationErrors.push("Die templateValues ungültig. Es wird ein Array erwartet. Erhalten: " + req.body.userstudy.templateValues);
      }
      if (!req.body.userstudy.requiredStudies || Array.isArray(req.body.userstudy.requiredStudies)) {
        for (var i=0; i<req.body.userstudy.requiredStudies; i+=1){
          if (!Validator.isNumeric(req.body.userstudy.requiredStudies)) {
            validationErrors.push("requiredStudies ungültig. Zahl erwartet. Erhalten: " + req.body.userstudy.requiredStudies);
          }
        }
      } else {
        validationErrors.push("requiredStudies ungültig, Array von Zahlen erwartet: " + req.body.userstudy.isFutureStudyFor);
      }
      if (!req.body.userstudy.news || Array.isArray(req.body.userstudy.news)) {
        for (var j=0; j<req.body.userstudy.news; j+=1){
          if (!Validator.isNumeric(req.body.userstudy.news)) {
            validationErrors.push("News ungültig. Zahl erwartet. Erhalten: " + req.body.userstudy.news);
          }
        }
      } else {
        validationErrors.push("News ungültig. Array von Zahlen erwartet. Erhalten: " + req.body.userstudy.news);
      }
      if (!req.body.userstudy.registeredUsers || Array.isArray(req.body.userstudy.registeredUsers)) {
        for (var m=0; m<req.body.userstudy.registeredUsers; m+=1){
          if (!Validator.isNumeric(req.body.userstudy.registeredUsers)) {
            validationErrors.push("registeredUsers ungültig. Zahl erwartet. Erhalten: " + req.body.userstudy.registeredUsers);
          }
        }
      } else {
        validationErrors.push("registeredUsers ungültig. Array von Zahlen erwartet. Erhalten: " + req.body.userstudy.registeredUsers);
      }
      if (!req.body.userstudy.labels || Array.isArray(req.body.userstudy.labels)) {
        for (var k=0; k<req.body.userstudy.labels; k+=1){
          if (!Validator.isNumeric(req.body.userstudy.labels)) {
            validationErrors.push("labels ungültig. Zahl erwartet. Erhalten: " + req.body.userstudy.labels);
          }
        }
      } else {
        validationErrors.push("labels ungültig. Array von Zahlen erwartet. Erhalten: " + req.body.userstudy.labels);
      }
      if (req.body.userstudy.fromDate > req.body.userstudy.untilDate) {
        validationErrors.push("Das vom-Datum muss vor dem dann-Datum liegen.");
      }
    }

    if (validationErrors.length > 0) {
      reject(validationErrors.join(' '));
    } else {
      var userStudyData = {
        title: Validator.toString(req.body.userstudy.title),
        tutorId: Validator.toString(req.body.userstudy.tutor),
        executorId: Validator.toString(req.body.userstudy.executor),
        fromDate: Validator.toString(req.body.userstudy.fromDate),
        untilDate: Validator.toString(req.body.userstudy.untilDate),
        description: Validator.toString(req.body.userstudy.description),
        link: Validator.toString(req.body.userstudy.link),
        mmi: Validator.toString(req.body.userstudy.mmi),
        compensation: Validator.toString(req.body.userstudy.compensation),
        location: Validator.toString(req.body.userstudy.location),
        space: Validator.toString(req.body.userstudy.space),
        registeredUsers: req.body.userstudy.registeredUsers,
        requiredStudies: req.body.userstudy.requiredStudies,
        news: req.body.userstudy.news,
        labels: req.body.userstudy.labels,
        templateId: req.body.userstudy.template,
        templateValues: req.body.userstudy.templateValues
      };
      resolve(userStudyData);
    }
  });
};

module.exports.validCloseRequest = function(req){
  return new Promise(function(resolve,reject) {

    var validationErrors = [];

    if (!req.body.users || Array.isArray(req.body.users)) {
      for (var i=0; i<req.body.users; i+=1){
        if (!Validator.isNumeric(req.body.users[i].userId)) {
          validationErrors.push("UserId ungültig. Zahl erwartet: " + req.body.users.userId);
        }
        if (req.body.users[i].getsMMI !== true || req.body.users[i].getsMMI !== false ) {
          validationErrors.push("getsMMI ungültig. Boolean erwartet: " + req.body.users.getsMMI);
        }
      }
    } else {
      validationErrors.push("Close Request ungültig, Array von {userId:1,getsMMI:false} Objekten erwartet: " + req.body.users);
    }

    if (validationErrors.length > 0) {
      reject(validationErrors.join(' '));
    } else {
      var closeData = req.body.users;
      resolve(closeData);
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

module.exports.userstudyIsOpen = function(userstudy) {
  return new Promise(function(resolve, reject){
    if (userstudy.closed === 1) {
      reject("Der Nutzerstudie wurde ist schon geschlossen. Editieren/Löschen verboten");
    } else {
      resolve(userstudy);
    }
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

module.exports.userCompletedAllRequiredStudies = function(userid,userstudyId) {
  return new Promise(function(resolve, reject){
    var userstudy;
    Userstudy.getUserstudyById(userstudyId, function(err, result){
      if (err) {
        reject(err);
      } else {
        userstudy = result[0];
        if (userstudy.requiredStudies===null){
          resolve();
        } else {
          userstudy.requiredStudies = userstudy.requiredStudies.split(",").map(function(x){return parseInt(x);});
          Userstudy.getStudiesFinishedByUser(userid, function(err,studies){
            if (err) {
              reject(err);
            } else {
              var ids = studies.map(function(value){
                return value.studyId;
              });
              var allowed = userstudy.requiredStudies.every(function(element){
                return (ids.indexOf(element) > -1);
              });

              if (allowed){
                resolve();
              } else {
                reject("Der Nutzer hat nicht alle benötigten Nutzerstudien beendet.");
              }
            }
          });
        }
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
          reject("Der Nutzer " + userId + " ist schon zur Nutzerstudie " + userstudyId + " registriert");
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

module.exports.studyTemplateValueCountIsTemplateTitleCount = function(templateId,templateValuesArr) {
  return new Promise(function (resolve, reject) {
    Template.getTemplateById(templateId, function (err, template) {
      if (err) {
        reject(err);
      } else if (template.length === 0 ){
        reject("Template wurde nicht gefunden.");
      } else if (templateValuesArr.length === template.length) {
        resolve();
      } else {
        reject("Die Anzahl der Titel für das Template stimmt nicht mit der gesendeten Anzahl an Feldern überein. " +
        "Erwartet: " + template.length + " Erhalten: " + templateValuesArr.length);
      }
    });
  });
};

module.exports.userIsExecutorForStudyOrTutor = function(user,userstudyId) {
  return new Promise(function (resolve, reject) {
    if (user.role === "executor") {
      Userstudy.getStudiesUserIsExecutor({id:user.id},function(err,result){
        if (err) {
          throw(err);
        } else {
          var allowed = false;
          for (var i = 0; i < result.length; i+=1) {
            if (result[i].id === parseInt(userstudyId)) {
              allowed = true;
              break;
            }
          }

          if (allowed){
            resolve(true);
          } else {
            reject('Sie haben keine Rechte diese Nutzerstudie zu editieren. Sie können ' +
            'nur Nutzerstudien editieren die Sie ausführen.');
          }
        }
      });
    } else if (user.role === "tutor") {
      resolve(false);
    } else {
      reject("Keine Rechte");
    }
  });
};


