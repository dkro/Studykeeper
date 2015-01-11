"use strict";
var User         = require('../../models/users');
var Promise      = require('es6-promise').Promise;
var Validator    = require('validator');

module.exports.validSignupReq = function(req){
  return new Promise(function(resolve, reject){
    var validationErrors = [];

    if (!Validator.isEmail(req.body.user.username)) {
      validationErrors.push({message: "Username invalid, email format required: " + req.body.user.title});
    }
    if (!Validator.isLength(req.body.user.firstname,1)) {
      validationErrors.push({message: "Firstname invalid, minimum 1 chars required."});
    }
    if (!Validator.isLength(req.body.user.lastname,1)) {
      validationErrors.push({message: "Surname invalid, minimum 1 chars required."});
    }
    if (!Validator.isLength(req.body.user.password,7)) {
      validationErrors.push({message: "Password invalid, minimum 7 chars required."});
    }
    if (!Validator.isLength(req.body.user.confirmPassword,7)) {
      validationErrors.push({message: "Confirm Password invalid, minimum 7 chars required."});
    }
    if (req.body.user.password !== req.body.user.confirmPassword){
      validationErrors.push({message: "Passwords dont match"});
    }
    if (req.body.user.mmi.toString() !== "0" && req.body.user.mmi.toString() !== "1") {
      validationErrors.push({message: "MMI Flag invalid, 0 or 1 required: " + req.body.user.mmi});
    }
    if (validationErrors.length > 0) {
      reject(validationErrors);
    } else {
      var userData = {
        username: Validator.toString(req.body.user.username),
        firstname: Validator.toString(req.body.user.firstname),
        lastname: Validator.toString(req.body.user.lastname),
        password: Validator.toString(req.body.user.password),
        confirmPassword : Validator.toString(req.body.user.confirmPassword),
        mmi: Validator.toString(req.body.user.mmi),
        role    : 'participant',
        lmuStaff: 0
      };
      resolve(userData);
    }
  });
};

module.exports.validLoginReq = function(req){
  return new Promise(function(resolve, reject){
    var validationErrors = [];

    if (!Validator.isLength(req.body.username,1)) {
      validationErrors.push({message: "Username required."});
    }
    if (!Validator.isLength(req.body.password,1)) {
      validationErrors.push({message: "Password required."});
    }

    if (validationErrors.length > 0) {
      reject(validationErrors);
    } else {
      var userData = {
        username: Validator.toString(req.body.username)
      };
      resolve(userData);
    }
  });
};

module.exports.validUserReq = function(req){
  return new Promise(function(resolve,reject) {
    var validationErrors = [];
    if (!Validator.isNumeric(req.body.user.id)) {
      validationErrors.push({message: "Id invalid, has to be numeric: " + req.body.user.id});
    }
    if (!Validator.isEmail(req.body.user.username)) {
      validationErrors.push({message: "Username invalid, email format required: " + req.body.user.title});
    }
    if (validationErrors.length > 0) {
      reject(validationErrors);
    } else {
      var userData = {
        id: Validator.toString(req.body.user.id),
        username: Validator.toString(req.body.user.username)
      };
      resolve(userData);
    }
  });
};

module.exports.validCreateUserReq = function(req){
  return new Promise(function(resolve,reject) {
    var validationErrors = [];
    if (!Validator.isNumeric(req.body.user.id)) {
      validationErrors.push({message: "Id invalid, has to be numeric: " + req.body.user.id});
    }
    if (!Validator.isAlpha(req.body.user.username)) {
      validationErrors.push({message: "Title invalid, minimum 3 characters: " + req.body.user.title});
    }
    if (!Validator.isLength(req.body.user.title, 7)) {
      validationErrors.push({message: "Password invalid, minimum 7 characters: " + req.body.user.password});
    }
    if (!Validator.isLength(req.body.user.title, 7)) {
      validationErrors.push({message: "Confirm Password invalid, minimum 7 characters: " + req.body.user.confirmPassword});
    }
    if (validationErrors.length > 0) {
      reject(validationErrors);
    } else {
      var userData = {
        id: Validator.toString(req.body.user.id),
        title: Validator.toString(req.body.user.title),
        password: Validator.toString(req.body.user.password),
        confirmPassword: Validator.toString(req.body.user.confirmPassword)
      };
      resolve(userData);
    }
  });
};

module.exports.userExists = function(username){
  return new Promise(function(resolve, reject){
    User.getUserByName(username,function(err,result){
      if (err) {reject(err);}
      if (result.length === 0) {reject({message: 'User not found', user: username});}
      resolve(result[0]);
    });
  });
};

module.exports.usernameAvailable = function(username){
  return new Promise(function(resolve, reject){
    User.getUserByName(username, function(err, result){
      if (err) {reject(err);}
      if (result.length === 0) {
        resolve();
      } else {
        reject({message: 'Email already in use.', username: username});
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
            } else if (result.length > 0) {resolve(result[0]);
            } else {
              reject({message: 'User not found'});
            }
          });
        }
      } else {
        reject({message: 'Authorization header is invalid'});
      }
    }
  });
};

module.exports.userFromName = function(user){
  return new Promise(function(resolve, reject){
    User.getUserByName(user.username, function(err, result){
      if (err) {
        reject(err);
      } else if (result.length > 0) {resolve(result[0]);
      } else {
        reject({message: 'User not found'});
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