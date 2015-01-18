"use strict";
var User       = require('../models/users');
var Promise      = require('es6-promise').Promise;
var UserPromise = require('./promises/userPromises');
var UserstudyPromise = require('./promises/userstudyPromises');
var crypt      = require('../utilities/encryption');
var validator  = require('validator');
var Async       = require('async');

var passwordMinimumLength = 7;

module.exports.getUser = function(req, res) {
  User.getUserById(req.params.id,function(err,result){
    if (err) {
      res.json(500, {status: 'failure', errors: err});
    } else {
      res.json({user: result});
    }
  });
};

module.exports.getUserById = function(req, res) {
  User.getUserById(req.params.id,function(err,result){
    if (err) {
      res.json(500, {status: 'failure', errors: err});
    } else if (result.length === 0 ){
      res.json({status: 'failure', errors: [{message: 'User not found'}]});
    } else {

      var user = result[0];
      // Add arrays of Ids for mapping for ember-data
      var promises = [UserstudyPromise.userIsExecutorFor(user),
        UserstudyPromise.userIsTutorFor(user),
        UserstudyPromise.userRegisteredStudies(user)];

      Promise.all(promises).then(function(results){
        var executorIds = [];
        for (var i = 0; i < results[0].length; i += 1) {
          executorIds.push(results[0][i].id);
        }
        var tutorIds = [];
        for (var j = 0; j < results[1].length; j += 1) {
          tutorIds.push(results[1][j].id);
        }
        var registeredStudies = [];
        for (var l = 0; l < results[2].length; l += 1) {
          registeredStudies.push(results[2][l].id);
        }


        user.isExecutorFor = executorIds;
        user.isTutorFor = tutorIds;
        user.registeredStudies = registeredStudies;
        res.json({user: user});
      })
        .catch(function(err){
          res.json(500, {status: 'failure', errors: err});
        });

    }
  });
};

module.exports.getUsers = function(req, res) {
  User.getUsers(function(err,list){
      if (err) {
        res.json(500, {status: 'failure', errors: err});
      } else {
        Async.eachSeries(list, function(item, callback){
          if (item.isExecutorFor === null) {
            item.isExecutorFor = [];
          } else {
            item.isExecutorFor = item.isExecutorFor.split(",").map(function(x){return parseInt(x);});
          }
          if (item.isTutorFor === null) {
            item.isTutorFor = [];
          } else {
            item.isTutorFor = item.isTutorFor.split(",").map(function(x){return parseInt(x);});
          }
          if (item.registeredFor === null) {
            item.registeredFor = [];
          } else {
            item.registeredFor = item.registeredFor.split(",").map(function(x){return parseInt(x);});
          }

          callback();
        }, function(err){
          if(err){
            res.json({status:'failure',message: err});
          } else {
            res.json({users:list});
          }
        });
    }
  });
};

module.exports.signup = function(req, res) {

  var user;
  var promises = [UserPromise.validSignupReq(req), UserPromise.usernameAvailable(req.body.user.username)];

  Promise.all(promises)
    .then(function(results) {
      user = results[0];
      return new Promise(function (resolve, reject) {
        if (user.username.indexOf("@cip.ifi.lmu.de") >= 0 || user.username.indexOf("@campus.lmu.de") >= 0) {
          user.lmuStaff = 1;
        }

        resolve();
      });

    })
    .then(function(){

      User.saveUser(user, function (err,result) {
        user.id = result.insertId;
        if (err) {
          throw err;
        } else {
          User.createTokenForUser(user, function (err) {
            if (err) {
              res.send(500, err);
            } else {
              User.getTokensForUser(user, function (err, result) {
                if (err) {
                  res.send(err);
                } else {
                  // Sort token result so that newest token is the first in array
                  result.sort(function (a, b) {
                    a = new Date(a.timestamp);
                    b = new Date(b.timestamp);
                    return a > b ? -1 : a < b ? 1 : 0;
                  });

                  res.json({
                    status: 'success',
                    message: 'New user has been created successfully',
                    user: {
                      id: user.id,
                      username: user.username,
                      role: user.role,
                      token: result[0].token
                    }
                  });
                }
              });
            }
          });
        }
      });
    })
   .catch(function(err){
      res.json(500, {status: 'failure', errors: err});
    });

};

module.exports.login = function(req, res) {
  var user;

  UserPromise.validLoginReq(req)
    .then(function (user){
      return UserPromise.userFromName(user);
    })
    .then(function (result){
        user = result;
        var promises = [UserPromise.createTokensForUser(user),
          UserPromise.deleteOldTokensForUser(user)];

        Promise.all(promises).then(function(){
          return UserPromise.getTokensForUserOrderedByDate(user);
        })
        .then(function(tokens){
            res.json({
              status: 'success',
              message: 'Login successful',
              user: {
              id: user.id,
              username: user.username,
              role: user.role,
              token: tokens[0].token
              }
            });
        })
        .catch(function(err){
          res.json(500, {status: 'failure', errors: err});
        });

    })
    .catch(function(err){
      res.json(500, {status: 'failure', errors: err});
    });
};

module.exports.logout = function(req, res) {
  UserPromise.userFromToken(req)
    .then(function(user){
      User.deleteToken(user.token, function(err){
        if (err) {
          res.send(err);
        } else {

          var now = new Date();
          var ThirtyMinutesFromNow = new Date(now - 1000*60*30);

          User.deleteTokensForUserBeforeTimestamp(user.username, ThirtyMinutesFromNow, function(err){
            if (err) {
              res.send(err);
            } else {
              res.json({
                status: 'success',
                message: 'Logged out.',
                user: {
                  username: user.username
                }
              });
            }
          });
        }
      })
    .catch(function(err){
          res.json({status: 'failure', errors: err});
    });
  });
};

module.exports.createUser = function(req, res) {
  var user;

  UserPromise.validCreateUserReq(req).then(function(result){
    user = result;

    return UserPromise.usernameAvailable(user.username);
  })
  .then(function(result){
    User.saveUser(user,function(err) {
      if (err){
        res.send(err);
      } else {
        res.json({message: 'New user has been created successfully',
          user:{
            id: user.id,
            username: user.username,
            role: user.role
          }
        });
      }
    });
  })
  .catch(function(err){
    res.json({status:'failure',message: err});
  });
};

module.exports.deleteUser = function(req, res) {
  var userId = req.params.id;
  UserPromise.userExistsById(userId)
    .then(function(){
      User.deleteUser(userId, function(err){
        if (err) {
          throw err;
        } else {
          res.json({status: 'success', message: 'user deleted', user: userId});
        }
      });
    })
    .catch(function(err){
      res.json(500, {status: 'failure', errors: err});
    });
};


module.exports.validateRole = function(role, username, res, callback) {
  var roleValidated = false;
  User.getUserRole(username, function(err, result){
    if (err) {
      res.send(err);
    } else if (result[0].name === role) {
      roleValidated = true;
      return callback(roleValidated);
    } else {
      roleValidated = false;
      return callback(roleValidated);
  }
  });
};


module.exports.retrievePW = function(){

};

module.exports.changePW = function(req, res) {
  var user = {
    username: req.body.username,
    oldPassword: req.body.oldPassword,
    newPassword: req.body.newPassword,
    newPasswordConfirmation: req.body.newPasswordConfirmation
  };

  if (user.newPassword !== user.newPasswordConfirmation) {
    res.json({
      status: "failure",
      message: "New passwords don't match."
    });
  } else if (user.newPassword.length < passwordMinimumLength) {
    res.json({
      status: "failure",
      message: "New password is too short. Minimum of 7 chars."
    });
  } else {
      User.getUserByName(user.username, function(err, userResult) {
        if (err) {
          res.send(err);
        } else {
          if (userResult.length < 1) {
            res.send({status: 'failure', message: 'Incorrect username.'});
          } else {
            crypt.comparePassword(userResult[0].password, user.oldPassword,
              function (err, isPasswordMatch) {
                if (err) {
                  return res(err);
                }

                if (!isPasswordMatch) {
                  res.send({
                    status: 'failure',
                    message: 'Incorrect password.'
                  });
                } else {
                  User.setPassword(user.newPassword, user.username, function (err) {
                    if (err) {
                      res.send(err);
                    } else {
                      res.json({
                        status: "success",
                        message: "Password successfully changed."
                      });
                    }
                  });
                }
              });
          }
        }
      });
  }
};
