"use strict";
var User         = require('../../models/users');
var Promise      = require('es6-promise').Promise;
var Validator    = require('validator');

var lmuStaff = function(req) {
  return (req.body.user.username.indexOf("@cip.ifi.lmu.de") >= 0 || req.body.user.username.indexOf("@campus.lmu.de") >= 0);
};

module.exports.validSignupReq = function(req){
  return new Promise(function(resolve, reject){
    var validationErrors = [];

    if (!Validator.isEmail(req.body.user.username)) {
      validationErrors.push("Email ungültig.");
    }
    if (!Validator.isLength(req.body.user.firstname,1)) {
      validationErrors.push("Vorname ungültig.");
    }
    if (!Validator.isLength(req.body.user.lastname,1)) {
      validationErrors.push("Nachname ungültig.");
    }
    if (!Validator.isLength(req.body.user.password,7)) {
      validationErrors.push("Passwort ungültig. Minimum 7 Charakter.");
    }
    if (!Validator.isLength(req.body.user.confirmPassword,7)) {
      validationErrors.push("Passwort bestätigung ungültig, Minimum 7 Charakter.");
    }
    if (req.body.user.password !== req.body.user.confirmPassword){
      validationErrors.push("Passwörter stimmen nicht überein.");
    }
    if (req.body.user.mmi.toString() !== "0" && req.body.user.mmi.toString() !== "1") {
      validationErrors.push({message: "MMI ungültig. 0 oder 1 erwartet."});
    }
    if (!lmuStaff(req) && req.body.user.mmi.toString() === "1") {
      validationErrors.push({message: "Nur Nutzer mit @campus.lmu.de oder @cip.ifi.lmu.de Adressen können MMI Punkte sammeln."});
    }
    if (validationErrors.length > 0) {
      reject(validationErrors.join(' '));
    } else {
      var userData = {
        username: Validator.toString(req.body.user.username),
        firstname: Validator.toString(req.body.user.firstname),
        lastname: Validator.toString(req.body.user.lastname),
        password: Validator.toString(req.body.user.password),
        confirmPassword : Validator.toString(req.body.user.confirmPassword),
        collectsMMI: Validator.toString(req.body.user.mmi),
        mmi: 0,
        role:'participant',
        lmuStaff: 0
      };
      if (lmuStaff(req)) {
        userData.lmuStaff = 1;
      } else {
        userData.lmuStaff = 0;
      }
      resolve(userData);
    }
  });
};

module.exports.validLoginReq = function(req){
  return new Promise(function(resolve, reject){
    var validationErrors = [];

    if (!Validator.isLength(req.body.username,1)) {
      validationErrors.push("Email erwartet.");
    }
    if (!Validator.isLength(req.body.password,1)) {
      validationErrors.push("Passwort erwartet.");
    }

    if (validationErrors.length > 0) {
      reject(validationErrors.join(' '));
    } else {
      var userData = {
        username: Validator.toString(req.body.username)
      };
      resolve(userData);
    }
  });
};

module.exports.validCreateUserReq = function(req){
  return new Promise(function(resolve,reject) {
    var validationErrors = [];
    if (!req.body.user) {
      validationErrors.push("User request hat ein falsches Format");
    } else {
      if (!Validator.isEmail(req.body.user.username)) {
        validationErrors.push("Email ungültig.");
      }
      if (!Validator.isLength(req.body.user.firstname, 1)) {
        validationErrors.push("Vorname ungültig.");
      }
      if (!Validator.isLength(req.body.user.lastname, 1)) {
        validationErrors.push("Nachname ungültig.");
      }
      if (!Validator.isNumeric(req.body.user.mmi)) {
        validationErrors.push("MMI Punkte ungültig. Zahl erwartet.");
      }
      var roleArr = ['participant','executor','tutor'];
      if (roleArr.indexOf(req.body.user.role.toString()) === -1) {
        validationErrors.push("Rolle ungültig, " + roleArr  +" erwartet : " + req.body.user.role);
      }
      var roleArr2 = ['executor','tutor'];
      if (!lmuStaff(req) && roleArr2.indexOf(req.body.user.role.toString()) > -1) {
        validationErrors.push('Der Nutzer kann kein executor oder tutor sein. Nur Nutzer mit ' +
        '@cip.ifi.lmu.de oder @campus.lmu.de email Adressen können diese Rollen beinhalten.');
      }
      if (!lmuStaff(req) && req.body.user.collectsMMI === true) {
        validationErrors.push('Der Nutzer kann keine MMI Punkte sammeln. Nur Nutzer mit ' +
        '@cip.ifi.lmu.de oder @campus.lmu.de email Adressen können MMI Punkte sammeln.');
      }
    }

    if (validationErrors.length > 0) {
      reject(validationErrors.join(' '));
    } else {
      var userData = {
        username: Validator.toString(req.body.user.username),
        firstname: Validator.toString(req.body.user.firstname),
        lastname: Validator.toString(req.body.user.lastname),
        password: Validator.toString(req.body.user.password),
        confirmPassword : Validator.toString(req.body.user.confirmPassword),
        mmi: Validator.toString(req.body.user.mmi),
        collectsMMI: req.body.user.collectsMMI ? 1 : 0,
        role    : Validator.toString(req.body.user.role),
        lmuStaff: 0
      };
      if (lmuStaff(req)) {
        userData.lmuStaff = 1;
      } else {
        userData.lmuStaff = 0;
      }
      resolve(userData);
    }
  });
};

module.exports.validEditUserReq = function(req){
  return new Promise(function(resolve,reject) {
    var validationErrors = [];
    if (!req.body.user) {
      validationErrors.push("User request hat ein falsches Format");
    } else {
      if (!Validator.isEmail(req.body.user.username)) {
        validationErrors.push("Email ungültig: " + req.body.user.username);
      }
      if (!Validator.isLength(req.body.user.firstname, 3)) {
        validationErrors.push("Vorname ungültig, Minimum  3 Charakter: " + req.body.user.firstname);
      }
      if (!Validator.isLength(req.body.user.lastname, 3)) {
        validationErrors.push("Nachname ungültig, Minimum 3 Charakter: " + req.body.user.lastname);
      }
      if (!Validator.isNumeric(req.body.user.mmi)) {
        validationErrors.push("MMI ungültig. Zahl erwartet: " + req.body.user.mmi);
      }
      var roleArr = ['participant','executor','tutor'];
      if (roleArr.indexOf(req.body.user.role.toString()) === -1) {
        validationErrors.push("Rolle ungültig, " + roleArr  +" erwartet : " + req.body.user.role);
      }
      var roleArr2 = ['executor','tutor'];
      if (!lmuStaff(req) && roleArr2.indexOf(req.body.user.role.toString()) > -1) {
        validationErrors.push('Der Nutzer kann kein executor oder tutor sein. Nur Nutzer mit ' +
        '@cip.ifi.lmu.de oder @campus.lmu.de email Adressen können diese Rollen beinhalten.');
      }
      if (!lmuStaff(req) && req.body.user.collectsMMI === true) {
        validationErrors.push('Der Nutzer kann keine MMI Punkte sammeln. Nur Nutzer mit ' +
        '@cip.ifi.lmu.de oder @campus.lmu.de email Adressen können MMI Punkte sammeln.');
      }
    }

    if (validationErrors.length > 0) {
      reject(validationErrors.join(' '));
    } else {
      var userData = {
        username: Validator.toString(req.body.user.username),
        firstname: Validator.toString(req.body.user.firstname),
        lastname: Validator.toString(req.body.user.lastname),
        mmi: Validator.toString(req.body.user.mmi),
        collectsMMI: req.body.user.collectsMMI ? 1 : 0,
        role    : Validator.toString(req.body.user.role),
        lmuStaff: 0,
        id: req.params.id
      };
      if (lmuStaff(req)) {
        userData.lmuStaff = 1;
      } else {
        userData.lmuStaff = 0;
      }
      resolve(userData);
    }
  });
};

module.exports.userExists = function(username){
  return new Promise(function(resolve, reject){
    User.getUserByName(username,function(err,result){
      if (err) {
        reject(err);
      } else if (result.length === 0) {
        reject('Der Nutzer wurde nicht gefunden.');
      } else {
        resolve(result[0]);
      }
    });
  });
};

module.exports.userExistsById = function(userId){
  return new Promise(function(resolve, reject){
    User.getUserById(userId,function(err,result){
      if (err) {
        reject(err);
      } else if (result.length === 0){
        reject('Der Nutzer wurde nicht gefunden.');
      } else {
        resolve(result[0]);
      }
    });
  });
};

module.exports.usernameAvailable = function(username){
  return new Promise(function(resolve, reject){
    User.getUserByName(username, function(err, result){
      if (err) {
        reject(err);
      } else if (result.length === 0) {
        resolve();
      } else {
        reject('Email-adresse wird schon benutzt.');
      }
    });
  });
};

module.exports.userFromToken = function(req){
  return new Promise(function(resolve, reject){

    if (req.headers && req.headers.authorization) {
      var parts = req.headers.authorization.split(' ');
      if (parts.length === 2) {
        var scheme = parts[0],token = parts[1];
        if (/^Bearer$/i.test(scheme)) {

          User.getUserByToken(token, function(err, result){
            if (err) {
              reject(err);
            } else if (result.length > 0) {
              result[0].token = token;
              resolve(result[0]);
            } else {
              reject("Der Nutzer wurde nicht gefunden");
            }
          });
        }
      } else {
        reject("Der Authorization header ist ungültig");
      }
    }
  });
};

module.exports.userFromNameWithConfirmationData = function(user){
  return new Promise(function(resolve, reject){
    User.getUserByNameWithConfirmationData(user.username, function(err, result){
      if (err) {
        reject(err);
      } else if (result.length > 0) {
        if (result[0].confirmed === 1){
          resolve(result[0]);
        } else {
          reject("Die Email-Adresse wurde nicht bestätigt. Bitte Bestätigen Sie Ihre Email-Adresse, bevor Sie sich " +
          "einloggen können");
        }
      } else {
        reject("Der Nutzer wurde nicht gefunden");
      }
    });
  });
};

module.exports.userHasRole = function(userId, roleArr){
  return new Promise(function(resolve, reject){
    User.getUserById(userId, function(err, result){
      if (err) {
        reject(err);
      } else if (result.length > 0) {
        if (roleArr.indexOf(result[0].role > -1)) {
          resolve(result[0]);
        } else {
          reject("Der Nutzer hat keine der erwarteten Rollen. Erwartet: " + roleArr + " Nutzerrolle: " + result[0].role);
        }
      } else {
        reject("Der Nutzer wurde nicht gefunden");
      }
    });
  });
};

module.exports.executorHasNoOpenStudies = function(userId) {
  return new Promise(function(resolve,reject){
    User.getOpenStudieIdsForExecutor(userId, function(err,result){
      if (err) {
        reject(err);
      } else if (result.length > 0) {
        var str = "";
        for (var i = 0; i<result.length; i+=1){
          str = str + " " + result[i].id;
        }
        reject("Der Nutzer (Rolle Ausführer) hat noch offene Nutzerstudien. Seine Rolle " +
        "kann nur zum 'participant' gändert werden wenn diese geschlossen worden sind: " + str);
      } else {
        resolve();
      }
    });
  });
};

module.exports.tutorHasNoOpenStudies = function(userId ){
  return new Promise(function(resolve,reject){
    User.getOpenStudieIdsForTutor(userId, function(err,result){
      if (err) {
        reject(err);
      } else if (result.length > 0) {
        var str = "";
        for (var i = 0; i<result.length; i+=1){
          str = str + " " + result[i].id;
        }
        reject("Der Nutzer (Rolle Tutor) hat noch offene Nutzerstudien. Seine Rolle " +
        "kann nur zum 'participant/executor' gändert werden wenn diese geschlossen worden sind: " + str);
      } else {
        resolve();
      }
    });
  });
};

module.exports.createTokensForUser = function(user){
  return new Promise(function(resolve, reject){
    User.createTokenForUser(user, function(err, result){
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
};

module.exports.deleteOldTokensForUser = function(user){
  var now = new Date();
  var ThirtyMinutesFromNow = new Date(now - 1000*60*30);

  return new Promise(function(resolve, reject){
    User.deleteTokensForUserBeforeTimestamp(user.username,
      ThirtyMinutesFromNow,
      function(err){
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
};

module.exports.getTokensForUserOrderedByDate = function(user){
  return new Promise(function(resolve, reject){
    User.getTokensForUser(user, function(err, result){
      if (err) {
        reject(err);
      } else {
        result.sort(function(a, b) {
          a = new Date(a.timestamp);
          b = new Date(b.timestamp);
          return a>b ? -1 : a<b ? 1 : 0;
        });

        resolve(result);
      }
    });
  });
};