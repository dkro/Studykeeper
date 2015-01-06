"use strict";
var User         = require('../../models/users');
var Promise      = require('es6-promise').Promise;
var Validator    = require('validator');

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
      if (result.length === 0) {resolve(result[0]);
      } else {
        reject({message: 'Username already taken.', username: username});
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
            if (err) {reject(err);}
            if (result.length > 0) {resolve(result[0]);
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