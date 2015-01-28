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
        res.json(500, {status: 'failure', errors: err});
      } else {
        results[0].id = insertId;
        res.json({status: 'success', message: 'Userstudy created.', userstudy: results[0]});
      }
    });
  }).catch(function(err){
    res.json(500, {status: 'failure', errors: err});
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
          throw err;
        } else {
          res.json({status: 'success', message: 'Userstudy edited.', userstudy: userstudy});
        }
      });
    })
    .catch(function(err){
      res.json(500, {status: 'failure', errors: err});
    });
};

module.exports.deleteUserstudy = function(req, res) {
  var userstudyId = req.params.id;

  UserstudyPromise.userstudyExists({id: userstudyId})
    .then(function(){
      UserStudy.deleteUserstudy(userstudyId, function(err){
        if (err) {
          throw err;
        } else {
          res.json({status: 'success', message: 'Userstudy deleted.', userstudy: userstudyId});
        }
      });
    })
    .catch(function(err){
      res.json(500, {status: 'failure', errors: err});
    });
};

module.exports.publishUserstudy = function(req, res) {

    UserstudyPromise.userstudyExists({id:req.params.id})
    .then(function(userstudy){
      UserStudy.publishUserstudy(userstudy, function(err) {
        if (err) {
          throw err;
        } else {
          res.json({status: 'success', message: 'Userstudy published.', userstudy: req.params.id});
        }
      });
    })
    .catch(function(err){
      res.json(500, {status: 'failure', errors: err});
    });

};

module.exports.getUserstudy = function(req, res) {
  var userstudy;

  UserstudyPromise.validUserstudyReq(req)
    .then(function(result){
      userstudy = result;
      return UserstudyPromise.userstudyExists(userstudy);
    })
    .then(function(){
      return UserstudyPromise.labelsForUserstudy(userstudy);
    })
    .then(function(labels){
      UserStudy.getUserstudy(userstudy, function(err, result){
        if (err) {
          throw err;
        } else {
          var study = result[0];
          study.labels = labels;
          res.json({userstudy: study});
        }
      });
    })
    .catch(function(err){
      res.json(500, {status: 'failure', errors: err});
    });
};

module.exports.getUserstudyById = function(req, res) {
  UserStudy.getUserstudyById(req.params.id, function(err,result){
    if (err) {
      res.json(500, {status: 'failure', errors: err});
    } else if (result.length === 0 ){
      res.json({status: 'failure', errors: [{message: 'Userstudy not found'}]});
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
      res.json(500, {status: 'failure', errors: err});
    } else if (result.length === 0 ){
      res.json({status: 'failure', errors: [{message: 'Userstudy not found'}]});
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
      res.json(err);
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
              res.json({status:'failure',message: err});
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
              res.json({status:'failure',message: err});
            } else {
              res.json({userstudies:list});
            }
          });
        }
      });
    })
    .catch(function (err){
      res.json(500, {status: 'failure', errors: err});
    });
};


module.exports.allUserstudiesCreatedByUser = function(req, res) {

  UserPromise.userFromToken(req)
    .then(function(user){
      UserStudy.getStudiesCreatedByUser(user, function(err, list){
        if (err) {
          throw err;
        } else {
          res.json({userstudies: list});
        }
      });
    })
    .catch(function (err){
      res.json(500, {status: 'failure', errors: err});
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
          throw err;
        } else {
          res.json({status: 'success', message: 'User registered to userstudy.',
                    user: userId, userstudy: userstudyId});
        }
    });
  })
  .catch(function (err){
    res.json(500, {status: 'failure', errors: err});
  });
};

module.exports.removeUserFromStudy = function(req, res){
  var userstudyId = req.params.id;
  var userId;

  UserPromise.userFromToken(req)
    .then(function(result){
      userId = result.id;

      return UserstudyPromise.userIsRegisteredToStudy(userId,userstudyId);
     })
    .then(function(){
      UserStudy.unmapUserFromStudy(userId,userstudyId, function(err){
        if (err) {
          throw err;
        } else {
          res.json({status: 'success', message: 'User removed from userstudy.',
                    user: userId, userstudy: userstudyId});
        }
    });
  })
  .catch(function (err){
    res.json(500, {status: 'failure', errors: err});
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
    .then(function() {
      UserStudy.confirmUser(user, userstudy, function (err) {
        if (err) {
          throw err;
        } else {
          res.json({
            status: 'success', message: 'Confirmed user participation of userstudy',
            user: user, userstudy: userstudy
          });
        }
      });
    })
    .catch(function(err){
      res.json(500, {status: 'failure', errors: err});
    });
};

module.exports.closeUserstudy = function(req, res){

   UserstudyPromise.userstudyExists({id:req.params.id})
    .then(function(userstudy){

      UserStudy.closeUserstudy(userstudy, function(err, list){
        if (err) {
          throw err;
        } else {
          res.json({status: 'success', message: 'Userstudy closed.', userstudy: req.params.id});
        }
      }).catch(function(err){
        res.json(500, {status: 'failure', errors: err});
      });
    });
};

