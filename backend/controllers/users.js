"use strict";
var User       = require('../models/users');
var Promise      = require('es6-promise').Promise;
var UserPromise = require('./promises/userPromises');
var UserstudyPromise = require('./promises/userstudyPromises');
var crypt      = require('../utilities/encryption');
var Async       = require('async');
var uuid       = require('node-uuid');
var Mail      = require('../utilities/mail');

var passwordMinimumLength = 7;

module.exports.getUser = function(req, res, next) {
  User.getUserById(req.params.id,function(err,result){
    if (err) {
      res.json(500, {status: 'failure', message: 'Server Fehler.', internal: err});
      return next();
    } else {
      result.lmuStaff = !!result.lmuStaff;
      res.json({user: result});
      return next();
    }
  });
};

module.exports.getUserById = function(req, res, next) {
  User.getUserById(req.params.id,function(err,result){
    if (err) {
      res.json(500, {status: 'failure', message: 'Server Fehler.', internal: err});
      return next();
    } else if (result.length === 0 ){
      res.json(500, {status: 'failure', message: 'Der Nutzer wurde nicht gefunden.'});
      return next();
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
        var registeredFor = [];
        for (var l = 0; l < results[2].length; l += 1) {
          registeredFor.push(results[2][l].id);
        }


        user.isExecutorFor = executorIds;
        user.isTutorFor = tutorIds;
        user.registeredFor = registeredFor;
        user.lmuStaff = !!user.lmuStaff;
        user.collectsMMI = !!user.collectsMMI;
        res.json({user: user});
        return next();
      })
        .catch(function(err){
          res.json(500, {status: 'failure', message: 'Server Fehler.', internal: err});
          return next();
        });

    }
  });
};

module.exports.getUsers = function(req, res, next) {
  User.getUsers(function(err,list){
      if (err) {
        res.json(500, {status: 'failure', message: 'Server Fehler.', internal: err});
        return next();
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

          item.collectsMMI = !!item.collectsMMI;
          item.lmuStaff = !!item.lmuStaff;
          callback();
        }, function(err){
          if(err){
            res.json(500, {status:'failure', message: 'Server Fehler.', internal: err});
            return next();
          } else {
            res.json({users:list});
            return next();
          }
        });
    }
  });
};

module.exports.signup = function(req, res, next) {

  var user;
  var promises = [UserPromise.validSignupReq(req), UserPromise.usernameAvailable(req.body.user.username)];

  Promise.all(promises)
    .then(function(results) {
      user = results[0];
    })
    .then(function(){
      User.saveUser(user, function (err, result) {
        if (err) {
          throw err;
        } else {
          user.id = result.insertId;
          sendSignUpMail(user, function (err, result){
            if (err) {
              res.json(500, {status: 'failure', message: 'Server Fehler.', internal: err});
            } else {
              res.json({
                status: 'success',
                message: 'Ein neuer Nutzer wurde erfolgreich erstellt und eine Mail versandt.',
                user: {
                  id: user.id,
                  username: user.username,
                  role: user.role
                }
              });
            }
              return next();
            });
          }
        });
    })
   .catch(function(err){
      res.json(500, {status: 'failure', message: err});
      return next();
    });

};

var sendSignUpMail = function(user, callback){
  var hash = uuid.v1();
  User.createConfirmationLink(user.id,hash,function(err){
    if (err){
      callback(err);
    } else {
      var mail = {
        from: 'StudyKeeper <no-reply@studykeeper.com>',
        to: user.username,
        subject: 'Bitte Bestätigen Sie Ihre Email Adresse',
        html: "Bitte clicken Sie <a href=\"http://studykeeper.medien.ifi.lmu.de:10001/api/users/confirm/" + hash + "\">hier</a> " +
        "um Ihre Email-Adresse zu bestätigten und melden sich dann " +
        "mit Ihren Nutzerdaten an."};
      Mail.sendMail(mail,function(err,result){
        if (err) {
          callback(err);
        } else {
          callback(err,result);
        }
      });
    }
  });
};

module.exports.confirmUser = function(req, res, next){
 var hash = req.params.hash;
  User.getUserForHash(hash,function(err,result){
    if (!result || result.length === 0){
      res.json(500, {status: 'failure', message: 'Die Hash wurde nicht gefunden. Bitte melden Sie sich erneut an.'});
    } else {
      var hashentry = result[0];
      var now = new Date();
      var ThreeDaysFromNow = new Date(now - 1000*60*60*24*3);


      if (result[0].timestamp < ThreeDaysFromNow) {
        User.deleteUnconfirmedUser(hashentry.userId,function(err){
          if (err){
            res.json(500, {status: 'failure', message: 'Server Fehler.', internal: err});
          } else {
            res.json(500, {status: 'failure', message: 'Der Token ist nicht mehr gültig. Bitte melden Sie sich erneut an'});
          }
        });
        next();
      } else {
        User.confirmUser(hash, function(err, result){
          if (err){
            res.json(500, {status: 'failure', message: 'Server Fehler.', internal: err});
          } else {
            res.header('Location', '/');
            res.send(302);
          }
        });
      }
    }
  });
};

module.exports.login = function(req, res, next) {
  var user;

  UserPromise.validLoginReq(req)
    .then(function (user){
      return UserPromise.userFromNameWithConfirmationData(user);
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
              token: tokens[0].token,
              collectsMMI: !!user.collectsMMI
              }
            });
            return next();
        })
        .catch(function(err){
          res.json(500, {status: 'failure', message: 'Server Fehler.', internal: err});
          return next();
        });

    })
    .catch(function(err){
      res.json(500, {status: 'failure', message: err});
      return next();
    });
};

module.exports.logout = function(req, res, next) {
  UserPromise.userFromToken(req)
    .then(function(user){
      User.deleteToken(user.token, function(err){
        if (err) {
          res.send(500, {status: 'failure', message: 'Server Fehler. Bitte loggen Sie sich erneut ein.', internal: err});
          return next();
        } else {

          var now = new Date();
          var ThirtyMinutesFromNow = new Date(now - 1000*60*30);

          User.deleteTokensForUserBeforeTimestamp(user.username, ThirtyMinutesFromNow, function(err){
            if (err) {
              res.send(500, {status: 'failure', message: 'Server Fehler. Bitte loggen Sie sich erneut ein.', internal: err});
              return next();
            } else {
              res.json({
                status: 'success',
                message: 'Ausgeloggt.',
                user: {
                  username: user.username
                }
              });
              return next();
            }
          });
        }
      })
    .catch(function(err){
      res.json({status: 'failure', message: err});
      return next();
    });
  });
};

module.exports.createUser = function(req, res, next) {
  var user;

  UserPromise.validCreateUserReq(req)
  .then(function(result){
    user = result;

    return UserPromise.usernameAvailable(user.username);
  })
  .then(function(){
    user.password = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for( var i=0; i < 10; i+= 1 ) {
      user.password += possible.charAt(Math.floor(Math.random() * possible.length));
    }

    User.saveUser(user,function(err,result) {
      if (err){
        res.send(500, {status:'failure', message: 'Server Fehler.', internal: err});
        return next();
      } else {
        user.id = result.insertId;
        sendUserWelcomeMail(user.username,user.password, function(err){
          if (err) {
            res.send(500, {status:'failure', message: 'Der Nutzer wurde erstellt, jedoch kam es zu einem Fehler ' +
            'beim Senden der Willkommens-Mail mit dem Passwort.', internal: err});
            next();
          } else {
            sendSignUpMail(user, function(err){
              if (err) {
                res.send(500, {status:'failure', message: 'Der Nutzer wurde erstellt, jedoch kam es zu einem Fehler ' +
                'beim senden der ConfirmationMail.', internal: err});
                next();
              } else {
                res.json({user: user});
                next();
              }
            });
          }
        });
        return next();
      }
    });
  })
  .catch(function(err){
    res.json(500, {status:'failure', message: err});
    return next();
  });
};

module.exports.editUser = function(req, res, next) {
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
            return next();
          } else {
            res.send(500, {status:'failure', message: 'Server Fehler.', internal: err});
            return next();
          }
        } else {
          res.json({message: 'Der Nutzer wurde erfolgreich editiert.'});
          return next();
        }
      });
    })
    .catch(function(err){
      res.json(500, {status:'failure', message: err});
      return next();
    });
};

var sendUserWelcomeMail = function(email,password,callback) {
  var mail = {
    from: 'StudyKeeper <no-reply@studykeeper.com>',
    to: email,
    subject: 'Es wurde ein Account für Sie erstellt.',
    html: "Ein Tutor bei Studykeeper hat einen Account für Sie erstellt. Sie werden in Kürze eine Mail zum Bestätigen " +
    "Ihrer Email Adresse bekommen. Nachdem Sie Ihre Email Adresse bestätigt haben, können Sie sich mit dieser " +
    "und diesem Passwort: " + password + " bei der folgenden URL anmelden: " +
    "<a href=\"http://studykeeper.medien.ifi.lmu.de:10001\">http://studykeeper.medien.ifi.lmu.de:10001</a> " +
    " Das Passwort können Sie jederzeit in den Account Einstellungen ändern."};
  Mail.sendMail(mail,function(err,result){
    if (err) {
      callback(err);
    } else {
      callback(err,result);
    }
  });
};

module.exports.deleteUser = function(req, res, next) {
  var userId = req.params.id;
  UserPromise.userExistsById(userId)
    .then(function(){
      User.deleteUser(userId, function(err){
        if (err) {
          throw err;
        } else {
          res.json({});
          return next();
        }
      });
    })
    .catch(function(err){
      res.json(500, {status: 'failure', message: 'Server Fehler.', internal: err});
      return next();
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


module.exports.recoverPasswordRequest = function(req, res, next){
  var email = req.body.userEmail;

  if (!email) {
    res.json(500, {status: 'failure', message: 'Kommunikations Fehler.', internal: 'Es wird eine email-Adresse in dieser ' +
    'Form erwartet: {"userEmail":"example@email.com"}'});
  } else {
    UserPromise.userExists(email)
      .then(function(){
        sendPasswordRetrievalRequest(email,function(err){
          if(err){
            res.json(500, {status: 'failure', message: 'Server Fehler.', internal: err});
            next();
          } else {
            res.json({status: 'success', message: 'Email wurde versandt.'});
            next();
          }
        });
      })
      .catch(function(err){
        res.json(500, {status: 'failure', message: err});
        next();
      });
  }
};

module.exports.recoverPasswordAction = function(req, res, next){
  var now = new Date();
  var ThreeDaysFromNow = new Date(now - 1000*60*60*24*3);
  var hash = req.params.hash;

  User.getPasswordRetrievalData(hash, function(err, result){
    if (err) {
      res.json(500, {status: 'failure', message: 'Server Fehler.', internal: err});
      next();
    } else if (!result || result.length === 0) {
      res.json(500, {status: 'failure', message: 'Keine Anfrage zur Password-Wiederherstullung gefunden. ' +
      'Eventuell ist Sie abgelaufen und wurde entfernt.'});
      next();
    } else if (result[0].timestamp < ThreeDaysFromNow) {
      User.deleteOldPasswortRetrievalData(ThreeDaysFromNow,function(err){
        if (err) {
          res.json(500, {status: 'failure', message: 'Server Fehler.', internal: err});
        } else {
          res.json(500, {status: 'failure', message: 'Die Anfrage ist älter als drei Tage. Bitte führen Sie ' +
          'erneut eine Anfrage zur Password Wiederherstellung aus.'});
        }
      });
    } else {
      var pwData = result[0];
      var newpw = "";
      var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

      for( var i=0; i < 10; i+= 1 ) {
        newpw += possible.charAt(Math.floor(Math.random() * possible.length));
      }

      new Promise(function(resolve, reject){
        User.setPassword(newpw, pwData.userId, function(err){
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        });
      })
      .then(function(){
        return new Promise(function(resolve,reject){
          User.deletePasswortRetrievalData(pwData.userId, function(err){
            if (err) {
              reject(err);
            } else {
              resolve();
            }
          });
        });
      })
      .then(function(){
        sendPasswordRetrievalAction(pwData.username,newpw,function(err){
          if (err) {
            res.json(500, {status: 'failure', message: 'Server Fehler beim senden der Email. ' +
            'Bitte Kontaktieren Sie uns persönlich um Ihr Passwort ' +
            'widerherzustellen.', internal: err});
          } else {
            res.json({status: 'success', message: 'Email wurde versandt.'});
            next();
          }
        });
      })
      .catch(function(err){
          res.json(500, {status: 'failure', message: 'Server Fehler.', internal: err});
          next();
      });
    }
  });
};

var sendPasswordRetrievalRequest = function(email, callback){
  var hash = uuid.v1();
  User.createPasswordRetrievalData(email,hash,function(err){
    if (err){
      callback(err);
    } else {
      var mail = {
        from: 'StudyKeeper <no-reply@studykeeper.com>',
        to: email,
        subject: 'Passwort vergessen?',
        html: "Bitte klicken Sie auf folgenden Link, um Ihr Passwort zurückzusetzen. Falls Sie diese Mail nicht  " +
        "angefordert haben, ignorieren Sie diese Mail. "+
        "<a href=\"http://studykeeper.medien.ifi.lmu.de:10001/api/users/recover/" + hash + "\">hier</a>"};
      Mail.sendMail(mail,function(err,result){
        if (err) {
          callback(err);
        } else {
          callback(err,result);
        }
      });
    }
  });
};

var sendPasswordRetrievalAction = function(email, newpw, callback){
  var mail = {
    from: 'StudyKeeper <no-reply@studykeeper.com>',
    to: email,
    subject: 'Ihr Passwort wurde zurückgesetzt',
    html: "Ihr Passwort wurde zurückgesetzt. Ihr neues Passwort lautet: " + newpw + ". Bitte loggen Sie sich " +
    "mit diesem ein und ändern Sie Ihr Passwort in den Account Einstellungen. " +
    "<a href=\"http://studykeeper.medien.ifi.lmu.de:10001\">http://studykeeper.medien.ifi.lmu.de:10001</a> "};
  Mail.sendMail(mail,function(err,result){
    if (err) {
      callback(err);
    } else {
      callback(err,result);
    }
  });
};

module.exports.changePW = function(req, res, next) {
  var user = {
    oldPassword: req.body.oldPassword,
    newPassword: req.body.newPassword,
    newPasswordConfirmation: req.body.newPasswordConfirmation
  };

  if (user.newPassword !== user.newPasswordConfirmation) {
    res.json(500,{
      status: "failure",
      message: "Die Passwörter stimmen nicht überein."
    });
    return next();
  } else if (user.newPassword.length < passwordMinimumLength) {
    res.json(500,{
      status: "failure",
      message: "Das Passwort ist zu kurz. Es muss mindestens 7 Charakter haben."
    });
    return next();
  } else {
      User.getPasswordById(req.params.id, function(err, userResult) {
        if (err) {
          res.send(err);
        } else {
          if (userResult.length < 1) {
            res.send(500,{status: 'failure', message: 'Nutzer wurde nicht gefunden.'});
            return next();
          } else {
            crypt.comparePassword(userResult[0].password,user.oldPassword,
              function (err, isPasswordMatch) {
                if (err) {
                  res.json(500, {status: 'failure', message: 'Server Fehler.', internal: err});
                  return next();
                } else if (!isPasswordMatch) {
                  res.send(500,{
                    status: 'failure',
                    message: 'Ihr altes Passwort ist nicht korrekt.'
                  });
                  return next();
                } else {
                  User.setPassword(user.newPassword, userResult[0].id, function (err) {
                    if (err) {
                      res.send(err);
                    } else {
                      res.json({
                        status: "success",
                        message: "Password wurde erfolgreich geändert."
                      });
                      return next();
                    }
                  });
                }
              });
          }
        }
      });
  }
};
