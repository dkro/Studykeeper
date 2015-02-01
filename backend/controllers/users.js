"use strict";
var User       = require('../models/users');
var Promise      = require('es6-promise').Promise;
var UserPromise = require('./promises/userPromises');
var UserstudyPromise = require('./promises/userstudyPromises');
var crypt      = require('../utilities/encryption');
var validator  = require('validator');
var Async       = require('async');
var uuid       = require('node-uuid');

var passwordMinimumLength = 7;

module.exports.getUser = function(req, res) {
  User.getUserById(req.params.id,function(err,result){
    if (err) {
      res.json(500, {status: 'failure', message: 'Server Fehler.', internal: err});
    } else {
      res.json({user: result});
    }
  });
};

module.exports.getUserById = function(req, res) {
  User.getUserById(req.params.id,function(err,result){
    if (err) {
      res.json(500, {status: 'failure', message: 'Server Fehler.', internal: err});
    } else if (result.length === 0 ){
      res.json(500, {status: 'failure', message: 'Der Nutzer wurde nicht gefunden.'});
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
          res.json(500, {status: 'failure', message: 'Server Fehler.', internal: err});
        });

    }
  });
};

module.exports.getUsers = function(req, res) {
  User.getUsers(function(err,list){
      if (err) {
        res.json(500, {status: 'failure', message: 'Server Fehler.', internal: err});
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
            res.json(500, {status:'failure', message: 'Server Fehler.', internal: err});
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
              res.send(500, {status:'failure', message: 'Server Fehler.', internal: err});
            } else {
              User.getTokensForUser(user, function (err, result) {
                if (err) {
                  res.send(500, {status:'failure', message: 'Server Fehler.', internal: err});
                } else {
                  // Sort token result so that newest token is the first in array
                  result.sort(function (a, b) {
                    a = new Date(a.timestamp);
                    b = new Date(b.timestamp);
                    return a > b ? -1 : a < b ? 1 : 0;
                  });

                  res.json({
                    status: 'success',
                    message: 'Ein neuer Nutzer wurde erfolgreich erstellt.',
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
      res.json(500, {status: 'failure', message: 'Server Fehler.', internal: err});
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
              message: 'Login erfolgreich.',
              user: {
              id: user.id,
              username: user.username,
              role: user.role,
              token: tokens[0].token
              }
            });
        })
        .catch(function(err){
          res.json(500, {status: 'failure', message: 'Server Fehler.', internal: err});
        });

    })
    .catch(function(err){
      res.json(500, {status: 'failure', message: 'Server Fehler.', internal: err});
    });
};

module.exports.logout = function(req, res) {
  UserPromise.userFromToken(req)
    .then(function(user){
      User.deleteToken(user.token, function(err){
        if (err) {
          res.send(500, {status: 'failure', message: 'Server Fehler. Bitte loggen Sie sich erneut ein.', internal: err});
        } else {

          var now = new Date();
          var ThirtyMinutesFromNow = new Date(now - 1000*60*30);

          User.deleteTokensForUserBeforeTimestamp(user.username, ThirtyMinutesFromNow, function(err){
            if (err) {
              res.send(500, {status: 'failure', message: 'Server Fehler. Bitte loggen Sie sich erneut ein.', internal: err});
            } else {
              res.json({
                status: 'success',
                message: 'Ausgeloggt.',
                user: {
                  username: user.username
                }
              });
            }
          });
        }
      })
    .catch(function(err){
      res.json({status: 'failure', message: err});
    });
  });
};

module.exports.createUser = function(req, res) {
  var user;

  UserPromise.validCreateUserReq(req)
  .then(function(result){
    user = result;

    return UserPromise.usernameAvailable(user.username);
  })
  .then(function(){
    user.password = uuid.v1();

    User.saveUser(user,function(err) {
      if (err){
        res.send(500, {status:'failure', message: 'Server Fehler.', internal: err});
      } else {
        res.json({message: 'Ein neuer Nutzer wurde erfolgreich erstellt.'});
      }
    });
  })
  .catch(function(err){
    res.json(500, {status:'failure', message: err});
  });
};

module.exports.editUser = function(req, res) {
  var user;

  UserPromise.validEditUserReq(req)
    .then(function(result){
      user = result;

      return UserPromise.userExistsById(req.params.id);
    })
    .then(function(result){
      // Executors can not be participants if they have an open study
      if (user.role === "participant" && result.role === "executor") {
        return UserPromise.executorHasNoOpenStudies(result.id);
      // Tutors can not be participants/executors if they have an open study
      } else if (user.role === "participant" || user.role === "executor"  && result.role === "tutor") {
        return UserPromise.tutorHasNoOpenStudies(result.id);
      } else {
        return result;
      }
    })
    .then(function(){
      User.editUser(user,function(err) {
        if (err){
          if (err.code === "ER_DUP_ENTRY"){
            res.send(500, {status:'failure', message: 'Email-adresse schon vergeben.'});
          } else {
            res.send(500, {status:'failure', message: 'Server Fehler.', internal: err});
          }
        } else {
          res.json({message: 'Der Nutzer wurde erfolgreich editiert.'});
        }
      });
    })
    .catch(function(err){
      res.json(500, {status:'failure', message: err});
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
          res.json({status: 'success', message: 'Nutzer wurde erfolgreich gelöscht.'});
        }
      });
    })
    .catch(function(err){
      res.json(500, {status: 'failure', message: 'Server Fehler.', internal: err});
    });
};


module.exports.validateRole = function(roleArray, roleId, callback) {
  var roleValidated = false;
  User.getRole(roleId, function(err, result){
    if (err) {
      callback(err);
    } else if (roleArray.indexOf(result[0].name) > -1) {
      roleValidated = true;
      callback(err,roleValidated);
    } else {
      roleValidated = false;
      callback(err,roleValidated);
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
    res.json(500,{
      status: "failure",
      message: "Die Passwörter stimmen nicht überein."
    });
  } else if (user.newPassword.length < passwordMinimumLength) {
    res.json(500,{
      status: "failure",
      message: "Das Passwort ist zu kurz. Es muss mindestens 7 Charakter haben."
    });
  } else {
      User.getUserByName(user.username, function(err, userResult) {
        if (err) {
          res.send(err);
        } else {
          if (userResult.length < 1) {
            res.send(500,{status: 'failure', message: 'Email schon vergeben.'});
          } else {
            crypt.comparePassword(userResult[0].password, user.oldPassword,
              function (err, isPasswordMatch) {
                if (err) {
                  return res(err);
                }

                if (!isPasswordMatch) {
                  res.send(500,{
                    status: 'failure',
                    message: 'Falsches Password.'
                  });
                } else {
                  User.setPassword(user.newPassword, user.username, function (err) {
                    if (err) {
                      res.send(err);
                    } else {
                      res.json({
                        status: "success",
                        message: "Password wurde erfolgreich geändert."
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
