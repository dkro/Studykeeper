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
        res.json(500, {status: 'failure', message: err});
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
  var isExecutor = false;
  UserstudyPromise.validFullUserstudyReq(req)
    .then(function(result){
      userstudy = result;
      userstudy.id = req.params.id;
      return UserPromise.userFromToken(req);
    })
    .then(function(user){
      return UserstudyPromise.userIsExecutorForStudyOrTutor(user,userstudy.id);
    })
    .then(function(executorBoolean){
      isExecutor = executorBoolean;
      var promises = [UserstudyPromise.userstudyExists(userstudy),
        UserPromise.userHasRole(req.body.userstudy.tutor, ["tutor"]),
        UserPromise.userHasRole(req.body.userstudy.executor, ["executor","tutor"]),
        UserstudyPromise.studyTemplateValueCountIsTemplateTitleCount(userstudy.templateId,userstudy.templateValues)];

      return Promise.all(promises);
    })
    .then(function() {
      UserStudy.editUserStudy(userstudy, isExecutor, function (err) {
        if (err) {
          res.json(500, {status:'failure', message: err});
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
          res.json(500, {status:'failure', message: 'Server Fehler.', internal: err});
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
        res.json(500, {status:'failure', message: 'Server Fehler.', internal: err});
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
            res.json(500, {status: 'failure', message: 'Server Fehler.', internal: err});
            return next();
          } else if (result.length === 0 ){
            res.json(500, {status: 'failure', message: 'Die Nutzerstudie existiert nicht.'});
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
            res.json(500, {status: 'failure', message: 'Server Fehler.', internal: err});
          } else if (result.length === 0 ){
            res.json(500, {status: 'failure', message: 'Die Nutzerstudie existiert nicht.'});
            return next();
          } else {

            var userstudy = result[0];
            parseUserstudy(userstudy);
            removeReqStudies([userstudy],user.id,function(err,result){
              if (err) {
                res.json(500, {status: 'failure', message: err});
                return next();
              } else if (result.length == 0) {
                res.json(500, {status: 'failure', message: 'Die Nutzerstudie existiert nicht.'});
                return next();
              } else {
                res.json({userstudy: result});
                return next();
              }
            });
          }
        });
      } else {
        UserStudy.getUserstudyByIdFilteredForUser(req.params.id, user.id, function(err, result){
          if (err) {
            res.json(500, {status: 'failure', message: 'Server Fehler.', internal: err});
          } else if (result.length === 0 ){
            res.json(500, {status: 'failure', message: 'Die Nutzerstudie existiert nicht.'});
            return next();
          } else {

            var userstudy = result[0];
            parseUserstudy(userstudy);
            removeReqStudies([userstudy],user.id,function(err,result){
              if (err) {
                res.json(500, {status: 'failure', message: err});
                return next();
              } else if (result.length == 0) {
                res.json(500, {status: 'failure', message: 'Die Nutzerstudie existiert nicht.'});
                return next();
              } else {
                res.json({userstudy: result});
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

module.exports.getPublicUserstudyById = function(req, res, next) {
  UserStudy.getPublicUserstudyById(req.params.id, function(err,result){
    if (err) {
      res.json(500, {status: 'failure', message: 'Server Fehler.', internal: err});
      return next();
    } else if (result.length === 0 ){
      res.json(500, {status: 'failure', message: 'Die Nutzerstudie existiert nicht.'});
      return next();
    } else {

      var userstudy = result[0];

      userstudy.closed = !!userstudy.closed;

      userstudy.templateKeysToValues = [];

      var titles = [];
      if (userstudy.titles === null) {
        userstudy.titles = [];
      } else {
        titles = userstudy.titles.split(",").map(function(x){return x;});
      }

      var values = [];
      if (userstudy.valuess === null) {
        userstudy.valuess = [];
      } else {
        values = userstudy.valuess.split(",").map(function(x){return x;});
      }

      if (userstudy.labels === null) {
        userstudy.labels = [];
      } else {
        userstudy.labels = userstudy.labels.split(",").map(function(x){return x;});
      }


      for (var i = 0; i < titles.length; i += 1) {
        userstudy.templateKeysToValues[i] = {};
        userstudy.templateKeysToValues[i].title = titles[i];
      }

      for (var j = 0; j < values.length; j += 1) {
        userstudy.templateKeysToValues[j].value = values[j];
      }

      delete userstudy.titles;
      delete userstudy.valuess;

      res.json({studypublic: userstudy});
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
            res.json(500, {status: 'failure', message: 'Server Fehler.', internal: err});
            return next();
          } else {
            Async.eachSeries(list, function (item, callback) {
              parseUserstudy(item);
              callback();
            }, function (err) {
              if (err) {
                res.json(500, {status: 'failure', message: 'Server Fehler.', internal: err});
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
                res.json(500, {status:'failure', message: 'Server Fehler.', internal: err});
                return next();
              } else {
                removeReqStudies(list,user.id,function(err,result){
                  if (err) {
                    res.json(500, {status: 'failure', message: err});
                    return next();
                  } else if (result.length == 0) {
                    res.json(500, {status: 'failure', message: 'Die Nutzerstudie existiert nicht.'});
                    return next();
                  } else {
                    res.json({userstudies: result});
                    return next();
                  }
                });
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
                res.json(500, {status:'failure', message: 'Server Fehler.', internal: err});
                return next();
              } else {
                removeReqStudies(list,user.id,function(err,result){
                  if (err) {
                    res.json(500, {status: 'failure', message: err});
                    return next();
                  } else if (result.length == 0) {
                    res.json(500, {status: 'failure', message: 'Die Nutzerstudie existiert nicht.'});
                    return next();
                  } else {
                    res.json({userstudies: result});
                    return next();
                  }
                });
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

var removeReqStudies = function (userstudyList, userId, cb) {
  var reqStudies = []
  UserStudy.getRequiredStudyList(function(err, result){
    if (err) {
      cb(err);
    } else {
      reqStudies = result
      UserStudy.getStudiesFinishedByUser(userId, function(err,finished){
        if (err){
          cb(err);
        } else {
          var studiesToRemove = []
          Async.each(reqStudies,
            function(item, callback){
              var ids = item.requiresIds.split(",").map(function(x){return parseInt(x);})
              var finishedIds = finished.map(function(item){
                return item.studyId
              });
              if (ids.every(function(val) {
                  return finishedIds.indexOf(val) >= 0; })
              ){
                callback();
              } else {
                studiesToRemove.push(item.studyId)
                callback()
              };
            },
            function(err){
              if (err) {
                cb(err);
              } else {
                for(var i = userstudyList.length; i--;) {
                  if(studiesToRemove.indexOf(userstudyList[i].id) >= 0 && userstudyList[i].executor !== userId) {
                    userstudyList.splice(i, 1);
                  }
                }
                cb(null,userstudyList)
              }
            }
          );
        }
      });
    }
  });
}

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
    userstudy.templateValues = userstudy.templateValues.split(",").map(function(x){
      x = x.replace(/\d+[:]/, "");
      return x;
    });
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
        UserstudyPromise.userCompletedAllRequiredStudies(userId,userstudyId),
        UserstudyPromise.userstudyIsOpen(userstudyId)];
      return Promise.all(promises);
    })
    .then(function(){
      UserStudy.mapUserToStudy(userId, userstudyId, function(err){
        if (err) {
          res.json(500, {status:'failure', message: 'Server Fehler.', internal: err});
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
      return UserstudyPromise.userstudyIsOpen(userstudyId);
    })
    .then(function(){
      UserStudy.unmapUserFromStudy(userId,userstudyId, function(err){
        if (err) {
          res.json(500, {status:'failure', message: 'Server Fehler.', internal: err});
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
              res.json(500, {status:'failure', message: 'Die ausführende Persone hat keine Rechte an dieser Nutzerstudie Nutzer zu entfernen.'});
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
          res.json(500, {status:'failure', message: 'Server Fehler.', internal: err});
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
    res.json(500, {status: 'failure', message: "Die gesendeten Daten sind nicht im geforderten Format. " +
      "Bitte wenden Sie sich an einen Administrator.", internal: "Erwartet {getsMMI:boolean}"});
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
                    res.json(500, {status:'failure', message: 'Die Nutzerteilnahme wurde bestätigt. Es gab jedoch Probleme ' +
                    'bei der Verteilung der MMI Punkte. Bitte kontaktieren Sie einen Administrator mit der folgenden Fehler Nachricht: ' +  err});
                  } else {
                    res.json({
                      status: 'success', message: 'Teilnahme des Nutzers an der Nutzerstudie bestätigt. Dem Nutzer wurden ' +
                      'die MMI Punkte der Nutzerstudie gutgeschrieben.',
                      user: user, userstudy: userstudy
                    });
                  }
                });
              } else {
                res.json({
                  status: 'success', message: 'Die Teilnahme des Nutzers an der Nutzerstudie wurde bestätigt. ' +
                  'Dem Nutzer konnten keine MMI Punkte zugeteilt werden, da er nicht berechtigt ist, MMI Punkte zu sammeln. Nur ' +
                  'Nutzer mit LMU Email Adressen sind dazu berechtigt MMI Punkt zu sammeln.',
                  user: user, userstudy: userstudy
                });
                return next();
              }
            } else {
              res.json({
                status: 'success', message: 'Die Teilnahme des Nutzers an der Nutzerstudie wurde bestätigt.',
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

  var userstudy = {};
  var closeReq = {};
  var userFromToken = {};
  var promises = [UserstudyPromise.userstudyExists({id:req.params.id}),
    UserstudyPromise.validCloseRequest(req),
    UserPromise.userFromToken(req)];

  Promise.all(promises)
    .then(function(results){
      userstudy = results[0];
      closeReq = results[1];
      userFromToken = results[2];

      promises = [];
      for (var i = 0; i < closeReq.length; i += 1) {
        promises.push(UserPromise.userExistsById(closeReq[i].userId));
      }

      return Promise.all(promises);
    })
    .then(function(users) {
      promises = [];
      for (var i = 0; i < users.length; i += 1) {
        promises.push(UserstudyPromise.userIsRegisteredToStudy(users[i].id,userstudy.id));
      }

      promises.push(new Promise(function(resolve,reject){
        var registered = userstudy.registeredUsers.split(",").map(function(x){return parseInt(x);});
        if (registered.length !== closeReq.length){
          reject("Die Nutzeranzahl zum Abschliessen der Nutzerstudie stimmt nicht mit der Nutzeranzahl der registrierten " +
          "Nutzer überein. Anzahl registrierter Nutzer: " + registered.length + " Anzahl der Nutzer, die " +
          "abgeschlossen werden sollen: " + closeReq.length);
        } else {
          resolve();
        }
      }));
      promises.push(UserstudyPromise.userIsExecutorForStudyOrTutor(userFromToken,userstudy.id));
      return Promise.all(promises);
    })
    .then(function() {
      UserStudy.closeUserstudy(userstudy.id, closeReq, function (err) {
        if (err) {
          res.json(500, {status: 'failure', message: 'Server Fehler.', internal: err});
          return next();
        } else {
          res.json({status: 'success', message: 'Die Nutzerstudie wurde abgeschlossen. Alle Teilnehmer wurden bestätigt.', userstudy: req.params.id});
          return next();
        }
      });
    }).catch(function (err) {
      res.json(500, {status: 'failure', message: err});
      return next();
    });
};

