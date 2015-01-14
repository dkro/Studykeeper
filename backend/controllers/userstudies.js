"use strict";
var UserStudy    = require('../models/userstudies');
var User         = require('../models/users');
var Promise      = require('es6-promise').Promise;
var UserPromise  = require('./promises/userPromises');
var UserstudyPromise = require('./promises/userstudyPromises');
var Async       = require('async');


module.exports.createUserstudy = function(req, res) {

  // TODO add the creator id to the database
  // TODO smarter promises... reduce database queries...
  var promises = [UserstudyPromise.validFullUserstudyReq(req)];
//,
//  UserPromise.userExists(req.body.userstudy.tutorname),
//    UserPromise.userExists(req.body.userstudy.executorname),
//    UserPromise.userHasRole(req.body.userstudy.tutorname),
//    UserPromise.userHasRole(req.body.userstudy.executorname)

  Promise.all(promises).then(function(results){
    UserStudy.addUserStudy(results[0], function (err) {
      if (err) {
        throw err;
      } else {
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

  UserPromise.validUserstudyReq(req)
    .then(function(userstudy){
      return UserPromise.userstudyExists(userstudy);
    })
    .then(function(userstudy){
      UserStudy.deleteUserstudy(userstudy, function(err){
        if (err) {
          throw err;
        } else {
          res.json({status: 'success', message: 'Userstudy deleted.', userstudy: userstudy});
        }
      });
    })
    .catch(function(err){
      res.json(500, {status: 'failure', errors: err});
    });
};

module.exports.publishUserstudy = function(req, res) {

  UserPromise.validUserstudyReq(req)
    .then(function(userstudy){
      return UserPromise.userstudyExists(userstudy);
    })
    .then(function(userstudy){
      UserStudy.publishUserstudy(userstudy, function(err) {
        if (err) {
          throw err;
        } else {
          res.json({status: 'success', message: 'Userstudy published.'});
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

module.exports.allUserstudies = function(req, res) {
  UserStudy.getAllUserstudies(function(err, list){
    if (err) {
      res.json(err);
    } else {
      // each (withour series) will use mutliple database connectionts
      // todo investigate if this has any negative side effects
        Async.eachSeries(list, function(item, callback){
          UserStudy.getStudiesRelationFor(item.id,'labels').then(function(results) {
            var labelIds = [];
            for (var j = 0; j < results.length; j += 1) {
              labelIds.push(results[j].id);
            }

            // setting news and requireStudies empty for the all userstudy request
            // This reduces the amount of database queries
            // This data will be provided by a single get requiest for one userstudy
            item.requiredStudies = [];
            item.news = [];
            item.labels = labelIds;
            item.closed = !!item.closed;
            callback();
          });
        }, function(err){
          if(err){
            res.json({status:'failure',message: err});
          } else {
            res.json(list);
          }
        });
    }
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
      var promises = [
        UserStudy.getStudiesRelationFor(req.params.id,'requires'),
        UserStudy.getStudiesRelationFor(req.params.id,'labels'),
        UserStudy.getStudiesRelationFor(req.params.id,'news')
      ];

      Promise.all(promises).then(function(results){

        var requiredStudiesIds = [];
        for (var i = 0; i < results[0].length; i += 1) {
          requiredStudiesIds.push(results[0][i].id);
        }
        var labelIds = [];
        for (var j = 0; j < results[1].length; j += 1) {
          labelIds.push(results[1][j].id);
        }
        var newsIds = [];
        for (var k = 0; j < results[2].length; k += 1) {
          newsIds.push(results[2][j].id);
        }

        userstudy.requiredStudies = requiredStudiesIds;
        userstudy.news = newsIds;
        userstudy.labels = labelIds;

        userstudy.closed = !!userstudy.closed;
        res.json({userstudy: userstudy});
      })
      .catch(function(err){
        res.json(500, {status: 'failure', errors: err});
      });
    }
  });
};

module.exports.allUserstudiesFiltered = function(req, res) {
  UserstudyPromise.validFilterReq(req)
    .then(function(filters){
      UserStudy.getAllUserstudiesFiltered(filters, function(err, list){
        if (err) {
          throw err;
        } else {
          res.json({userstudies:list});
        }
      });
    })
    .catch(function (err){
      res.json(500, {status: 'failure', errors: err});
    });
};

module.exports.allUserstudiesFilteredForUser = function(req, res) {
  var filter;

  UserstudyPromise.validFilterReq(req)
    .then(function(result){
        filter = result;

        return UserPromise.userFromToken(req);
    })
    .then(function(user){
      UserStudy.getAllUserstudiesFilteredForUser(user, filter, function(err, list){
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

module.exports.allUserstudiesCurrentForUser = function(req, res) {

  UserPromise.userFromToken(req)
    .then(function(user){
      UserStudy.getStudiesCurrentByUser(user, function(err, list){
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


module.exports.allUserstudiesHistoryForUser = function(req, res) {

  UserPromise.userFromToken(req)
    .then(function(user){
      UserStudy.getStudiesFinishedByUser(user, function(err, list){
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
  var promises = [UserPromise.userExists,
  UserstudyPromise.userstudyExists];

  var user;
  var userstudy;

  Promise.all(promises)
    .then(function(result){
      user = result[0];
      userstudy = result[1];

      UserPromise.userIsRegisteredToStudy(user,userstudy);
    })
    .then(function(){
      UserStudy.confirmUser(user, userstudy, function(err){
        if (err) {
          throw err;
        } else {
          res.json({status: 'success', message: 'Confirmed user participation of userstudy',
            user: user, userstudy: userstudy});
        }
    }).catch(function(err){
      res.json(500, {status: 'failure', errors: err});
    });
  });
};

module.exports.usersRegisteredToStudy = function(req, res){

  UserstudyPromise.validUserstudyReq(req)
    .then(function(userstudy){
      return UserstudyPromise.userstudyExists(userstudy);
    })
    .then(function(userstudy){
      UserStudy.getUsersRegisteredToStudy(userstudy, userstudy, function(err, list){
        if (err) {
          throw err;
        } else {
          res.json(list);
        }
    }).catch(function(err){
        res.json(500, {status: 'failure', errors: err});
      });
  });
};

module.exports.closeUserstudy = function(req, res){

  UserstudyPromise.validUserstudyReq(req)
    .then(function(userstudy){
      return UserstudyPromise.userstudyExists(userstudy);
    })
    .then(function(userstudy){

      UserStudy.closeUserstudy(userstudy, function(err, list){
        if (err) {
          throw err;
        } else {
          res.json(list);
        }
      }).catch(function(err){
        res.json(500, {status: 'failure', errors: err});
      });
    });
};

