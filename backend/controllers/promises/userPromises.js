"use strict";
var User         = require('../../models/users');
var Promise      = require('es6-promise').Promise;
var Validator    = require('validator');

module.exports.validUserReq = function(req){
  return new Promise(function(resolve, reject){

  });
};

module.exports.validCreateUserReq = function(req){
  return new Promise(function(resolve, reject){

  });
};

module.exports.userExists = function(user){
  return new Promise(function(resolve, reject){
    User.getUserByName(user.username,function(err,result){
      if (err) {reject(err);}
      if (result.length === 0) {reject({message: 'User:' + user + ' not found'});}
      resolve(result[0]);
    });
  });
};

module.exports.usernameAvailable = function(user){
  return new Promise(function(resolve, reject){
    User.getUserByName(user.username, function(err, result){
      if (err) {reject(err);}
      if (result.length > 0) {reject({message: 'user:' + user + ' exists already'});}
      if (result.length === 0) {resolve(result[0]);
      } else {
        reject({message: 'Username is already taken.'});
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