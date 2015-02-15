"use strict";
var UserStudy    = require('../models/userstudies');
var User         = require('../models/users');
var Promise      = require('es6-promise').Promise;
var UserPromise  = require('./promises/userPromises');
var UserstudyPromise = require('./promises/userstudyPromises');
var Async       = require('async');


module.exports.createUserstudy = function(req, res, next) {

  var userstudy = {};
  UserstudyPromise.validFullUserstudyReq(req)
  .then(function(result){
    userstudy = result;
    var promises = [UserPromise.userFromToken(req),
      UserPromise.userHasRole(req.body.userstudy.tutor, ["tutor"]),
      UserPromise.userHasRole(req.body.userstudy.executor, ["executor","tutor"]),
      UserstudyPromise.studyTemplateValueCountIsTemplateTitleCount(userstudy.templateId,userstudy.templateValues)];

    return Promise.all(promises);
  })
  .then(function(results){
    userstudy.creatorId = results[0].id;
    UserStudy.addUserStudy(userstudy, function (err,userstudyId) {
      if (err) {
        res.json(500, {status: 'failure', message: 'Server Fehler.', internal: err});
        return next();
      } else {
        userstudy.id = userstudyId;
        res.json({userstudy: userstudy});
        return next();
      }
    });
  }).catch(function(err){
    res.json(500, {status: 'failure', message: err});
    return next();
  });
};

module.exports.editUserstudy = function(req, res, next) {
  var userstudy;
  UserstudyPromise.validFullUserstudyReq(req)
    .then(function(result){
      userstudy = result;
      userstudy.id = req.params.id;

      var promises = [UserstudyPromise.userstudyExists(userstudy),
        UserPromise.userHasRole(req.body.userstudy.tutor, ["tutor"]),
        UserPromise.userHasRole(req.body.userstudy.executor, ["executor","tutor"]),
        UserstudyPromise.studyTemplateValueCountIsTemplateTitleCount(userstudy.templateId,userstudy.templateValues)];

      return Promise.all(promises);
    })
    .then(function() {
      UserStudy.editUserStudy(userstudy, function (err) {
        if (err) {
          res.json({status:'failure', message: 'Server Fehler.', internal: err});
          return next();
        } else {
          res.json({status: 'success', message: 'Die Nutzerstudie wurde geändert.', userstudy: userstudy});
          return next();
        }
      });
    })
    .catch(function(err){
      res.json(500, {status: 'failure', message: err});
      return next();
    });
};

module.exports.deleteUserstudy = function(req, res, next) {
  var userstudyId = req.params.id;

  UserstudyPromise.userstudyExists({id: userstudyId})
    .then(function(){
      UserStudy.deleteUserstudy(userstudyId, function(err){
        if (err) {
          res.json({status:'failure', message: 'Server Fehler.', internal: err});
          return next();
        } else {
          res.json({});
          return next();
        }
      });
    })
    .catch(function(err){
      res.json(500, {status: 'failure', message: err});
      return next();
    });
};

module.exports.publishUserstudy = function(req, res, next) {
  UserstudyPromise.userstudyExists({id:req.params.id})
  .then(function(userstudy){
    UserStudy.publishUserstudy(userstudy, function(err) {
      if (err) {
        res.json({status:'failure', message: 'Server Fehler.', internal: err});
        return next();
      } else {
        res.json({status: 'success', message: 'Die Nutzerstudie wurde veröffentlicht.', userstudy: req.params.id});
        return next();
      }
    });
  })
  .catch(function(err){
    res.json(500, {status: 'failure', message: err});
    return next();
  });
};

module.exports.getUserstudyById = function(req, res, next) {
  UserPromise.userFromToken(req)
    .then(function(user){
      if (user.role === 'tutor') {
        UserStudy.getUserstudyById(req.params.id, function (err, result) {
          if (err) {
            res.json({status: 'failure', message: 'Server Fehler.', internal: err});
            return next();
          } else if (result.length === 0 ){
            res.json(500, {status: 'failure', message: 'Die Nutzerstudie wurde nicht gefunden.'});
            return next();
          } else {

            var userstudy = result[0];
            parseUserstudy(userstudy);
            res.json({userstudy: userstudy});
            return next();
          }
        });
      } else if (user.role === 'executor') {
        UserStudy.getUserstudyByIdFilteredForExecutor(req.params.id, user.id, function(err, result){
          if (err) {
            throw err;
          } else if (result.length === 0 ){
            res.json(500, {status: 'failure', message: 'Die Nutzerstudie wurde nicht gefunden.'});
            return next();
          } else {

            var userstudy = result[0];
            parseUserstudy(userstudy);
            res.json({userstudy: userstudy});
            return next();
          }
        });
      } else {
        UserStudy.getUserstudyByIdFilteredForUser(req.params.id, user.id, function(err, result){
          if (err) {
            throw err;
          } else if (result.length === 0 ){
            res.json(500, {status: 'failure', message: 'Die Nutzerstudie wurde nicht gefunden.'});
            return next();
          } else {

            var userstudy = result[0];
            parseUserstudy(userstudy);
            res.json({userstudy: userstudy});
            return next();
          }
        });
      }
    })
    .catch(function (err){
      res.json(500, {status: 'failure', message: err});
      return next();
    });

};

module.exports.getPublicUserstudyById = function(req, res, next) {
  UserStudy.getPublicUserstudyById(req.params.id, function(err,result){
    if (err) {
      res.json(500, {status: 'failure', message: 'Server Fehler.', internal: err});
      return next();
    } else if (result.length === 0 ){
      res.json(500, {status: 'failure', message: 'Die Nutzerstudie wurde nicht gefunden.'});
      return next();
    } else {

      var userstudy = result[0];

      userstudy.closed = !!userstudy.closed;
      res.json({userstudy: userstudy});
      return next();
    }
  });
};

module.exports.allUserstudies = function(req, res, next) {
  UserPromise.userFromToken(req)
    .then(function(user){
      if (user.role === 'tutor') {
        UserStudy.getAllUserstudies(function (err, list) {
          if (err) {
            res.json({status: 'failure', message: 'Server Fehler.', internal: err});
            return next();
          } else {
            Async.eachSeries(list, function (item, callback) {
              parseUserstudy(item);
              callback();
            }, function (err) {
              if (err) {
                res.json({status: 'failure', message: 'Server Fehler.', internal: err});
                return next();
              } else {
                res.json({userstudies: list});
                return next();
              }
            });
          }
        });
      } else if (user.role === 'executor') {
        UserStudy.getAllUserstudiesFilteredForExecutor(user, function(err, list){
          if (err) {
            throw err;
          } else {
            Async.eachSeries(list, function(item, callback){
              parseUserstudy(item);
              callback();
            }, function(err){
              if(err){
                res.json({status:'failure', message: 'Server Fehler.', internal: err});
                return next();
              } else {
                res.json({userstudies:list});
                return next();
              }
            });
          }
        });
      } else {
        UserStudy.getAllUserstudiesFilteredForUser(user, function(err, list){
          if (err) {
            throw err;
          } else {
            Async.eachSeries(list, function(item, callback){
              parseUserstudy(item);
              callback();
            }, function(err){
              if(err){
                res.json({status:'failure', message: 'Server Fehler.', internal: err});
                return next();
              } else {
                res.json({userstudies:list});
                return next();
              }
            });
          }
        });
      }
    })
  .catch(function (err){
    res.json(500, {status: 'failure', message: err});
    return next();
  });
};

var parseUserstudy = function (userstudy) {
  if (userstudy.requiredStudies === null) {
    userstudy.requiredStudies = [];
  } else {
    userstudy.requiredStudies = userstudy.requiredStudies.split(",").map(function(x){return parseInt(x);});
  }
  if (userstudy.news === null) {
    userstudy.news = [];
  } else {
    userstudy.news = userstudy.news.split(",").map(function(x){return parseInt(x);});
  }
  if (userstudy.labels === null) {
    userstudy.labels = [];
  } else {
    userstudy.labels = userstudy.labels.split(",").map(function(x){return parseInt(x);});
  }
  if (userstudy.registeredUsers === null) {
    userstudy.registeredUsers = [];
  } else {
    userstudy.registeredUsers = userstudy.registeredUsers.split(",").map(function(x){return parseInt(x);});
  }
  if (userstudy.templateValues === null) {
    userstudy.templateValues = [];
  } else {
    userstudy.templateValues = userstudy.templateValues.split(",").map(function(x){return x;});
  }

  userstudy.closed = !!userstudy.closed;
  userstudy.published = !!userstudy.published;
  return userstudy;
};

module.exports.registerUserToStudy = function(req, res, next){
  var userstudyId = req.params.studyId;
  var userId;

  UserPromise.userFromToken(req)
    .then(function(result){
      userId = result.id;

      var promises =
        [UserstudyPromise.userstudyExists({id:userstudyId}),
        UserstudyPromise.userIsNOTRegisteredToStudy(userId,userstudyId),
        UserstudyPromise.userstudyHasSpace(userstudyId),
        UserstudyPromise.userCompletedAllRequiredStudies(userId,userstudyId)];
      return Promise.all(promises);
    })
    .then(function(){
      UserStudy.mapUserToStudy(userId, userstudyId, function(err){
        if (err) {
          res.json({status:'failure', message: 'Server Fehler.', internal: err});
          return next();
        } else {
          res.json({status: 'success', message: 'Der Nutzer wurde zur Nutzerstudie angemeldet.',
                    user: userId, userstudy: userstudyId});
          return next();
        }
    });
  })
  .catch(function (err){
    res.json(500, {status: 'failure', message: err});
      return next();
  });
};

module.exports.signoff = function(req, res, next){
  var userstudyId = req.params.studyId;
  var userId;

  UserPromise.userFromToken(req)
    .then(function(result){
      userId = result.id;

      return UserstudyPromise.userIsRegisteredToStudy(userId,userstudyId);
     })
    .then(function(){
      return UserstudyPromise.userIsNotConfirmed(userId,userstudyId);
    })
    .then(function(){
      UserStudy.unmapUserFromStudy(userId,userstudyId, function(err){
        if (err) {
          res.json({status:'failure', message: 'Server Fehler.', internal: err});
          return next();
        } else {
          res.json({status: 'success', message: 'Der Nutzer wurde von der Nutzerstudie entfernt.',
                    user: userId, userstudy: userstudyId});
          return next();
        }
    });
  })
  .catch(function (err){
    res.json(500, {status: 'failure', message: err});
    return next();
  });
};

module.exports.removeUserFromStudy = function(req, res, next){
  var userstudyId = req.params.id;
  var userId = req.params.userId;

  UserPromise.userFromToken(req)
    .then(function(user){
      if (user.role === "executor") {
        UserStudy.getStudiesUserIsExecutor({id:userId},function(err,result){
          if (err) {
            res.json(500, {status: 'failure', message: 'Server Fehler.', internal: err});
            return next();
          } else {
            var allowed = false;
            for (var i = 0; i < result.length; i+=1) {
              if (result[i].id === parseInt(userstudyId)) {
                allowed = true;
                break;
              }
            }

            if (allowed){
              return UserstudyPromise.userIsRegisteredToStudy(userId,userstudyId);
            } else {
              res.json({status:'failure', message: 'Der Executor hat keine Rechte an dieser Nutzerstudie Nutzer zu entfernen.'});
              return next();
            }
          }
        });
      } else {
        return UserstudyPromise.userIsRegisteredToStudy(userId,userstudyId);
      }
    })
    .then(function(){
      return UserstudyPromise.userIsNotConfirmed(userId,userstudyId);
    })
    .then(function(){
      UserStudy.unmapUserFromStudy(userId,userstudyId, function(err){
        if (err) {
          res.json({status:'failure', message: 'Server Fehler.', internal: err});
          return next();
        } else {
          res.json({status: 'success', message: 'Der Nutzer wurde von der Nutzerstudie entfernt.',
            user: userId, userstudy: userstudyId});
          return next();
        }
      });
    })
    .catch(function (err){
      res.json(500, {status: 'failure', message: err});
      return next();
    });
};

module.exports.confirmUserParticipation = function(req, res, next){
  var getsMMI = req.body.getsMMI;

  if (!getsMMI) {
    res.json(500, {status: 'failure', message: "Kommunikations Fehler.", internal: "Erwartet {getsMMI:boolean}"});
  } else {
    var promises = [UserPromise.userExistsById(req.params.userId), UserstudyPromise.userstudyExists({id:req.params.id})];
    var user;
    var userstudy;

    Promise.all(promises)
      .then(function(result){
        user = result[0];
        userstudy = result[1];

        return UserstudyPromise.userIsRegisteredToStudy(user.id,userstudy.id);
      })
      .then(function(){
        return UserstudyPromise.userIsNotConfirmed(user.id,userstudy.id);
      })
      .then(function() {
        UserStudy.confirmUser(user, userstudy, function (err) {
          if (err) {
            res.json(500, {status:'failure', message: 'Server Fehler.', internal: err});
            return next();
          } else {
            if (getsMMI) {
              if (user.lmuStaff) {
                User.addMMI(user.id,userstudy.id,function(err,result){
                  if (err) {
                    res.json(500, {status:'failure', message: 'Nutzerteilnahme bestätigt. Es gab jedoch Probleme ' +
                    'bei der zuteilung der MMI Punkte. Bitte kontaktieren sie uns mit der folgenden Error Nachricht: ' +  err});
                  } else {
                    res.json({
                      status: 'success', message: 'Teilnahme des Nutzers an der Nutzerstudie bestätigt. Dem Nutzer wurden ' +
                      'die MMI Punkte der Nutzerstudie gutgeschrieben.',
                      user: user, userstudy: userstudy
                    });
                  }
                })
              } else {
                res.json({
                  status: 'success', message: 'Teilnahme des Nutzers an der Nutzerstudie bestätigt. ' +
                  'Es wurden jedoch dem Nutzer keine MMI Punkte zugeteilt, da er nicht berechtigt ist. Nur ' +
                  'Nutzer mit lmu email Adressen sind dazu berechtigt MMI Punkt zu sammeln.',
                  user: user, userstudy: userstudy
                });
                return next();
              }
            } else {
              res.json({
                status: 'success', message: 'Teilnahme des Nutzers an der Nutzerstudie bestätigt.',
                user: user, userstudy: userstudy
              });
              return next();
            }
          }
        });
      })
      .catch(function(err){
        res.json(500, {status: 'failure', message: err});
        return next();
      });
  }
};

module.exports.closeUserstudy = function(req, res, next){

   UserstudyPromise.userstudyExists({id:req.params.id})
    .then(function(userstudy){

      UserStudy.closeUserstudy(userstudy, function(err, list){
        if (err) {
          res.json({status:'failure', message: 'Server Fehler.', internal: err});
          return next();
        } else {
          res.json({status: 'success', message: 'Nutzerstudie geschlossen.', userstudy: req.params.id});
          return next();
        }
      }).catch(function(err){
        res.json(500, {status: 'failure', message: err});
        return next();
      });
    });
};

