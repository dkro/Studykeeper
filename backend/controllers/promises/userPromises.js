"use strict";
var User         = require('../../models/users');
var Promise      = require('es6-promise').Promise;
var Validator    = require('validator');

var lmuStaff = function(req) {
  return (req.body.user.username.indexOf("@cip.ifi.lmu.de") >= 0 || req.body.user.username.indexOf("@campus.lmu.de") >= 0 || req.body.user.username.indexOf("@ifi.lmu.de") >= 0);
};

/**
 * Validates the the body in the Request to be of the following form:
 * {
 *  "user": {
 *    "username": "user1@studykeeper.com",
 *    "firstname": "firstnamea",
 *    "lastname": "lastnameb",
 *    "password": "password",
 *    "confirmPasswor": "password",
 *    "mmi": false
 *  }
 *}
 *
 * @param req Incoming Request Object
 * @returns {Promise} A Promise with the validated User Request
 */
module.exports.validSignupReq = function(req){
  return new Promise(function(resolve, reject){
    var validationErrors = [];

    if (!req.body.user.username || !Validator.isEmail(req.body.user.username)) {
      validationErrors.push("Email ungültig.");
    }
    if (!req.body.user.firstname || !Validator.isLength(req.body.user.firstname,1)) {
      validationErrors.push("Vorname ungültig.");
    }
    if (!req.body.user.lastname || !Validator.isLength(req.body.user.lastname,1)) {
      validationErrors.push("Nachname ungültig.");
    }
    if (!req.body.user.password || !Validator.isLength(req.body.user.password,7)) {
      validationErrors.push("Passwort ungültig. Das Passwort muss mindestens aus sieben Zeichen bestehen.");
    }
    if (!req.body.user.confirmPassword || !Validator.isLength(req.body.user.confirmPassword,7)) {
      validationErrors.push("Passwort Bestätigung ungültig. Sie muss mindestens aus sieben Zeichen bestehen.");
    }
    if (req.body.user.password !== req.body.user.confirmPassword){
      validationErrors.push("Die Passwörter stimmen nicht überein.");
    }
    if (req.body.user.mmi !== "true" && req.body.user.mmi !== "false") {
      validationErrors.push("Die MMI Flagge ist ungültig. Es wird ein Boolean erwartet.");
    }
    if (!lmuStaff(req) && req.body.user.mmi === "true") {
      validationErrors.push("Nur Nutzer mit @campus.lmu.de, @ifi.lmu.de oder @cip.ifi.lmu.de Adressen können MMI Punkte sammeln.");
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
        mmi: 0,
        role:'participant',
        lmuStaff: 0
      };
      if (lmuStaff(req)) {
        userData.lmuStaff = 1;
      } else {
        userData.lmuStaff = 0;
      }
      if (req.body.user.mmi === "true") {
        userData.collectsMMI = 1;
      } else {
        userData.collectsMMI = 0;
      }
      resolve(userData);
    }
  });
};

/**
 * Validates the the body in the Request to be of the following form:
 * {
    "username" : "user1@studykeeper.com",
    "password" : "1234567"
  }
 *
 * @param req Incoming Request Object
 * @returns {Promise} A Promise with the validated User Request
 */
module.exports.validLoginReq = function(req){
  return new Promise(function(resolve, reject){
    var validationErrors = [];

    if (!Validator.isLength(req.body.username,1)) {
      validationErrors.push("Email ungültig.");
    }
    if (!Validator.isLength(req.body.password,1)) {
      validationErrors.push("Passwort ungültig.");
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

/**
 * Validates the the body in the Request to be of the following form:
 * {
 *  "user": {
 *    "username": "user1@studykeeper.com",
 *    "firstname": "firstnamea",
 *    "lastname": "lastnameb",
 *    "mmi": 10,
 *    "role": "participant",
 *    "collectsMMI": false
 *  }
 *}
 *
 * @param req Incoming Request Object
 * @returns {Promise} A Promise with the validated User Request
 */
module.exports.validCreateUserReq = function(req){
  return new Promise(function(resolve,reject) {
    var validationErrors = [];
    if (!req.body.user) {
      validationErrors.push("Die gesendeten Daten sind nicht im geforderten Format. " +
      "Bitte wenden Sie sich an einen Administrator.");
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
        validationErrors.push("Die MMI Punkte sind ungültig. Es wird eine Zahl erwartet.");
      }
      var roleArr = ['participant','executor','tutor'];
      if (roleArr.indexOf(req.body.user.role.toString()) === -1) {
        validationErrors.push("Die Rolle ist ungültig, Es wird \"participant\", \"executor\", \"tutor\", erwartet. Erhalten: " + req.body.user.role);
      }
      var roleArr2 = ['executor','tutor'];
      if (!lmuStaff(req) && roleArr2.indexOf(req.body.user.role.toString()) > -1) {
        validationErrors.push('Dem Nutzer kann nicht die Rolle Tutor oder ausführender Student zugewiesen werden. Nur Nutzer mit ' +
        '\"@cip.ifi.lmu.de\", \"@ifi.lmu.de\" oder \"@campus.lmu.de\" Email Adressen können diese Rollen besitzen.');
      }
      if (!lmuStaff(req) && req.body.user.collectsMMI === true) {
        validationErrors.push('Der Nutzer kann keine MMI Punkte sammeln. Nur Nutzer mit ' +
        '\"@cip.ifi.lmu.de\", \"@ifi.lmu.de\" oder \"@campus.lmu.de\" Email Adressen können MMI Punkte sammeln.');
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

/**
 * Validates the the body in the Request to be of the following form:
 * {
 *  "user": {
 *    "username": "user1@studykeeper.com",
 *    "firstname": "firstnamea",
 *    "lastname": "lastnameb",
 *    "mmi": 10,
 *    "role": "participant",
 *    "collectsMMI": false
 *  }
 *}
 *
 * @param req Incoming Request Object
 * @returns {Promise} A Promise with the validated User Request
 */
module.exports.validEditUserReq = function(req){
  return new Promise(function(resolve,reject) {
    var validationErrors = [];
    if (!req.body.user) {
      validationErrors.push("Die gesendeten Daten sind nicht im geforderten Format. " +
      "Bitte wenden Sie sich an einen Administrator.");
    } else {
      if (!Validator.isEmail(req.body.user.username)) {
        validationErrors.push("Email ungültig. Erhalten: " + req.body.user.username);
      }
      if (!Validator.isLength(req.body.user.firstname, 1)) {
        validationErrors.push("Vorname ungültig. Erhalten: " + req.body.user.firstname);
      }
      if (!Validator.isLength(req.body.user.lastname, 1)) {
        validationErrors.push("Nachname ungültig. Erhalten: " + req.body.user.lastname);
      }
      if (!Validator.isFloat(req.body.user.mmi)) {
        validationErrors.push("MMI ungültig. Zahl erwartet: " + req.body.user.mmi);
      }
      var roleArr = ['participant','executor','tutor'];
      if (roleArr.indexOf(req.body.user.role.toString()) === -1) {
        validationErrors.push("Die Rolle ist ungültig, Es wird \"participant\", \"executor\", \"tutor\", erwartet. Erhalten: " + req.body.user.role);
      }
      var roleArr2 = ['executor','tutor'];
      if (!lmuStaff(req) && roleArr2.indexOf(req.body.user.role.toString()) > -1) {
        validationErrors.push('Der Nutzer kann kein executor oder tutor sein. Nur Nutzer mit ' +
        '@cip.ifi.lmu.de, @ifi.lmu.de oder @campus.lmu.de email Adressen können diese Rollen beinhalten.');
      }
      if (!lmuStaff(req) && req.body.user.collectsMMI === true) {
        validationErrors.push('Der Nutzer kann keine MMI Punkte sammeln. Nur Nutzer mit ' +
        '@cip.ifi.lmu.de, @ifi.lmu.de  oder @campus.lmu.de email Adressen können MMI Punkte sammeln.');
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

/**
 * Promises that the user with a certain username exists
 * @param username the username for the user
 * @returns {Promise} A Promise with the user Object
 */
module.exports.userExists = function(username){
  return new Promise(function(resolve, reject){
    User.getUserByName(username,function(err,result){
      if (err) {
        reject(err);
      } else if (result.length === 0) {
        reject('Der Nutzer existiert nicht.');
      } else {
        resolve(result[0]);
      }
    });
  });
};

/**
 * Promises that the user with a certain id exists
 * @param userId the userid for the user
 * @returns {Promise} A Promise with the user Object
 */
module.exports.userExistsById = function(userId){
  return new Promise(function(resolve, reject){
    User.getUserById(userId,function(err,result){
      if (err) {
        reject(err);
      } else if (result.length === 0){
        reject('Der Nutzer existiert nicht.');
      } else {
        resolve(result[0]);
      }
    });
  });
};

/**
 * Promises that the username is not taken yet
 * @param username the username for the user
 * @returns {Promise} A Promise
 */
module.exports.usernameAvailable = function(username){
  return new Promise(function(resolve, reject){
    User.getUserByName(username, function(err, result){
      if (err) {
        reject(err);
      } else if (result.length === 0) {
        resolve();
      } else {
        reject('Die Email Adresse ist bereits vergeben.');
      }
    });
  });
};

/**
 * Promises the userdata from a token
 * @param req The request object containing the token
 * @returns {Promise} A Promise with the user object
 */
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
              reject("Der Nutzer existiert nicht.");
            }
          });
        }
      } else {
        reject("Ihre Sitzung ist ungültigt. Bitte melden Sie sich neu an.");
      }
    }
  });
};

/**
 * Promises that the users email adress is confirmed
 * @param user the user object with the email adress
 * @returns {Promise} A Promise with the user data
 */
module.exports.userFromNameWithConfirmationData = function(user){
  return new Promise(function(resolve, reject){
    User.getUserByNameWithConfirmationData(user.username, function(err, result){
      if (err) {
        reject(err);
      } else if (result.length > 0) {
        if (result[0].confirmed === 1){
          resolve(result[0]);
        } else {
          reject("Die Email Adresse wurde noch nicht bestätigt. Bitte bestätigen Sie Ihre Email Adresse, damit Sie sich " +
          "anmelden können.");
        }
      } else {
        reject("Der Nutzer existiert nicht.");
      }
    });
  });
};

/**
 * Promises that the user Role is contained in the given role Array
 * @param userId the user Id
 * @param roleArr the roles to be checked against
 * @returns {Promise} A Promise that the role of the user in the system is part of the role Array
 */
module.exports.userHasRole = function(userId, roleArr){
  return new Promise(function(resolve, reject){
    User.getUserById(userId, function(err, result){
      if (err) {
        reject(err);
      } else if (result.length > 0) {
        if (roleArr.indexOf(result[0].role > -1)) {
          resolve(result[0]);
        } else {
          reject("Sie haben nicht die erforderlichen Rechte, um diese Aktion ausführen zu können.");
        }
      } else {
        reject("Der Nutzer existiert nicht.");
      }
    });
  });
};

/**
 * Promises that the users lmuStaff Flag is set to true
 *
 * @param user the user Object for check for lmuStaff
 * @returns {Promise} A Promise containing the user
 */
module.exports.userIsLMU = function(user){
  return new Promise(function(resolve, reject){
    if (user.lmuStaff) {
      resolve(user);
    } else {
      reject("Der Nutzer besitzt keine LMU Email Adresse (Erforderlich: @cip.ifi.lmu.de, @campus.lmu.de, @ifi.lmu.de" +
      ") und kann daher keine MMI Punkte sammeln.");
    }
  });
};

/**
 * Promises that the user with the role executor does not have any open studies
 * @param userId the executors id
 * @returns {Promise} An empty Promise
 */
module.exports.executorHasNoOpenStudies = function(userId) {
  return new Promise(function(resolve,reject){
    User.getOpenStudieIdsForExecutor(userId, function(err,result){
      if (err) {
        reject(err);
      } else if (result.length > 0) {
        reject("Der ausführenden Person sind noch offene Nutzerstudien zugewiesen. Die Rolle " +
        "kann nur zu einem Teilnehmer gändert werden, wenn diese Studien abgeschlossen worden sind.");
      } else {
        resolve();
      }
    });
  });
};

/**
 * Promises that the user with the role tutor does not have any open studies
 * @param userId the tutors id
 * @returns {Promise} An empty Promise
 */
module.exports.tutorHasNoOpenStudies = function(userId ){
  return new Promise(function(resolve,reject){
    User.getOpenStudieIdsForTutor(userId, function(err,result){
      if (err) {
        reject(err);
      } else if (result.length > 0) {
        reject("Dem Tutor sind noch offene Nutzerstudien zugewiesen. Seine Rolle " +
        "kann nur zum 'Teilnehmer/Ausführende Person' gändert werden, wenn diese abgeschlossen worden sind.");
      } else {
        resolve();
      }
    });
  });
};

/**
 * Creates a Token for the user
 * @param user the user object for which a token should be created
 * @returns {Promise} An empty Promise
 */
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

/**
 * Deletes all Tokens for the user which are older than 30 Minutes
 * @param user the user object for which the tokens should be deleted
 * @returns {Promise} An empty Promise
 */
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

/**
 * Gets the Users Tokens ordered by Date
 * @param user the user object
 * @returns {Promise} A Promise containing all tokens for the user ordered by Date
 */
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