"use strict";
var UserStudy    = require('../models/userstudies');
var User         = require('../models/users');
var Promise      = require('es6-promise').Promise;
var UserPromise  = require('./promises/userPromises');
var UserstudyPromise = require('./promises/userstudyPromises');
var Async       = require('async');


module.exports.createUserstudy = function(req, res) {

  var promises = [UserstudyPromise.validFullUserstudyReq(req),
    UserPromise.userFromToken(req),
    UserPromise.userHasRole(req.body.userstudy.tutor, "tutor"),
    UserPromise.userHasRole(req.body.userstudy.executor, "executor")];

  Promise.all(promises).then(function(results){
    results[0].creatorId = results[1].id;
    UserStudy.addUserStudy(results[0], function (err,insertId) {
      if (err) {
        res.json(500, {status: 'failure', message: 'Server Fehler.', internal: err});
      } else {
        results[0].id = insertId;
        res.json({status: 'success', message: 'Die Nutzerstudie wurde erstellt.', userstudy: results[0]});
      }
    });
  }).catch(function(err){
    res.json(500, {status: 'failure', message: err});
  });
};

module.exports.editUserstudy = function(req, res) {
  var userstudy;
  UserstudyPromise.validFullUserstudyReq(req)
    .then(function(result){
      userstudy = result;
      userstudy.id = req.params.id;

      return UserstudyPromise.userstudyExists(userstudy);
    })
    .then(function() {
      UserStudy.editUserStudy(userstudy, function (err) {
        if (err) {
          res.json({status:'failure', message: 'Server Fehler.', internal: err});
        } else {
          res.json({status: 'success', message: 'Die Nutzerstudie wurde geändert.', userstudy: userstudy});
        }
      });
    })
    .catch(function(err){
      res.json(500, {status: 'failure', message: err});
    });
};

module.exports.deleteUserstudy = function(req, res) {
  var userstudyId = req.params.id;

  UserstudyPromise.userstudyExists({id: userstudyId})
    .then(function(){
      UserStudy.deleteUserstudy(userstudyId, function(err){
        if (err) {
          res.json({status:'failure', message: 'Server Fehler.', internal: err});
        } else {
          res.json({status: 'success', message: 'Die Nutzerstudie wurde gelöscht.'});
        }
      });
    })
    .catch(function(err){
      res.json(500, {status: 'failure', message: err});
    });
};

module.exports.publishUserstudy = function(req, res) {

    UserstudyPromise.userstudyExists({id:req.params.id})
    .then(function(userstudy){
      UserStudy.publishUserstudy(userstudy, function(err) {
        if (err) {
          res.json({status:'failure', message: 'Server Fehler.', internal: err});
        } else {
          res.json({status: 'success', message: 'Die Nutzerstudie wurde veröffentlicht.', userstudy: req.params.id});
        }
      });
    })
    .catch(function(err){
      res.json(500, {status: 'failure', message: err});
    });

};

module.exports.getUserstudyById = function(req, res) {
  UserStudy.getUserstudyById(req.params.id, function(err,result){
    if (err) {
      res.json(500, {status: 'failure', message: 'Server Fehler.', internal: err});
    } else if (result.length === 0 ){
      res.json(500, {status: 'failure', message: 'Die Nutzerstudie wurde nicht gefunden.'});
    } else {

      var userstudy = result[0];
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

      userstudy.closed = !!userstudy.closed;
      res.json({userstudy: userstudy});
    }
  });
};

module.exports.getPublicUserstudyById = function(req, res) {
  UserStudy.getPublicUserstudyById(req.params.id, function(err,result){
    if (err) {
      res.json(500, {status: 'failure', message: 'Server Fehler.', internal: err});
    } else if (result.length === 0 ){
      res.json(500, {status: 'failure', message: 'Die Nutzerstudie wurde nicht gefunden.'});
    } else {

      var userstudy = result[0];

      userstudy.closed = !!userstudy.closed;
      res.json({userstudy: userstudy});
    }
  });
};

module.exports.allUserstudies = function(req, res) {
  UserStudy.getAllUserstudies(function(err, list){
    if (err) {
      res.json({status:'failure', message: 'Server Fehler.', internal: err});
      } else {
          Async.eachSeries(list, function(item, callback){
            if (item.requiredStudies === null) {
              item.requiredStudies = [];
            } else {
              item.requiredStudies = item.requiredStudies.split(",").map(function(x){return parseInt(x);});
            }
            if (item.news === null) {
              item.news = [];
            } else {
              item.news = item.news.split(",").map(function(x){return parseInt(x);});
            }
            if (item.labels === null) {
              item.labels = [];
            } else {
              item.labels = item.labels.split(",").map(function(x){return parseInt(x);});
            }
            if (item.registeredUsers === null) {
              item.registeredUsers = [];
            } else {
              item.registeredUsers = item.registeredUsers.split(",").map(function(x){return parseInt(x);});
            }

            item.closed = !!item.closed;
            callback();
          }, function(err){
            if(err){
              res.json({status:'failure', message: 'Server Fehler.', internal: err});
            } else {
              res.json({userstudies:list});
            }
          });
      }
  });
};

module.exports.allUserstudiesFilteredForUser = function(req, res) {

  UserPromise.userFromToken(req)
    .then(function(user){
      UserStudy.getAllUserstudiesFilteredForUser(user, function(err, list){
        if (err) {
          throw err;
        } else {
          Async.eachSeries(list, function(item, callback){
            if (item.requiredStudies === null) {
              item.requiredStudies = [];
            } else {
              item.requiredStudies = item.requiredStudies.split(",").map(function(x){return parseInt(x);});
            }
            if (item.news === null) {
              item.news = [];
            } else {
              item.news = item.news.split(",").map(function(x){return parseInt(x);});
            }
            if (item.labels === null) {
              item.labels = [];
            } else {
              item.labels = item.labels.split(",").map(function(x){return parseInt(x);});
            }
            if (item.registeredUsers === null) {
              item.registeredUsers = [];
            } else {
              item.registeredUsers = item.registeredUsers.split(",").map(function(x){return parseInt(x);});
            }

            item.closed = !!item.closed;
            callback();
          }, function(err){
            if(err){
              res.json({status:'failure', message: 'Server Fehler.', internal: err});
            } else {
              res.json({userstudies:list});
            }
          });
        }
      });
    })
    .catch(function (err){
      res.json(500, {status: 'failure', message: err});
    });
};


module.exports.allUserstudiesCreatedByUser = function(req, res) {

  UserPromise.userFromToken(req)
    .then(function(user){
      UserStudy.getStudiesCreatedByUser(user, function(err, list){
        if (err) {
          res.json({status:'failure', message: 'Server Fehler.', internal: err});
        } else {
          res.json({userstudies: list});
        }
      });
    })
    .catch(function (err){
      res.json(500, {status: 'failure', message: err});
    });
};


module.exports.registerUserToStudy = function(req, res){
  var userstudyId = req.params.id;
  var userId;

  UserPromise.userFromToken(req)
    .then(function(result){
      userId = result.id;

      return UserstudyPromise.userIsNOTRegisteredToStudy(userId,userstudyId);
    })
    .then(function(){
      UserStudy.mapUserToStudy(userId, userstudyId, function(err){
        if (err) {
          res.json({status:'failure', message: 'Server Fehler.', internal: err});
        } else {
          res.json({status: 'success', message: 'Der Nutzer wurde zur Nutzerstudie angemeldet.',
                    user: userId, userstudy: userstudyId});
        }
    });
  })
  .catch(function (err){
    res.json(500, {status: 'failure', message: err});
  });
};

module.exports.signoff = function(req, res){
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
        } else {
          res.json({status: 'success', message: 'Der Nutzer wurde von der Nutzerstudie entfernt.',
                    user: userId, userstudy: userstudyId});
        }
    });
  })
  .catch(function (err){
    res.json(500, {status: 'failure', message: err});
  });
};

module.exports.removeUserFromStudy = function(req, res){
  var userstudyId = req.params.id;
  var userId = req.params.userId;

  UserPromise.userFromToken(req)
    .then(function(user){
      if (user.role === "executor") {
        UserStudy.getStudiesUserIsExecutor({id:userId},function(err,result){
          if (err) {
            res.json(500, {status: 'failure', message: 'Server Fehler.', internal: err});
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
        } else {
          res.json({status: 'success', message: 'Der Nutzer wurde von der Nutzerstudie entfernt.',
            user: userId, userstudy: userstudyId});
        }
      });
    })
    .catch(function (err){
      res.json(500, {status: 'failure', message: err});
    });
};

module.exports.confirmUserParticipation = function(req, res){
  var promises = [UserPromise.userExistsById(req.params.userId),
  UserstudyPromise.userstudyExists({id:req.params.id})];

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
          res.json({status:'failure', message: 'Server Fehler.', internal: err});
        } else {
          res.json({
            status: 'success', message: 'Teilnahme des Nutzers an der Nutzerstudie bestätigt.',
            user: user, userstudy: userstudy
          });
        }
      });
    })
    .catch(function(err){
      res.json(500, {status: 'failure', message: err});
    });
};

module.exports.closeUserstudy = function(req, res){

   UserstudyPromise.userstudyExists({id:req.params.id})
    .then(function(userstudy){

      UserStudy.closeUserstudy(userstudy, function(err, list){
        if (err) {
          res.json({status:'failure', message: 'Server Fehler.', internal: err});
        } else {
          res.json({status: 'success', message: 'Nutzerstudie geschlossen.', userstudy: req.params.id});
        }
      }).catch(function(err){
        res.json(500, {status: 'failure', message: err});
      });
    });
};

