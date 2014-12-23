"use strict";
var UserStudy    = require('../models/userstudies');
var User         = require('../models/users');
var Promise      = require('es6-promise').Promise;
var UserPromise  = require('./promises/userPromises');
var UserstudyPromise = require('./promises/userstudyPromises');


module.exports.createUserstudy = function(req, res) {

  var promises = [UserPromise.validFullUserstudyReq(req),
    UserPromise.userExists(req.body.tutorname),
    UserPromise.userExists(req.body.executorname)];

  Promise.all(promises).then(function(results){
    UserStudy.addUserStudy(results[0], function (err) {
      if (err) {
        throw err;
      } else {
        res.json({status: 'success', message: 'userstudy created.',
          userstudy: results[0]});
      }
    });
  }).catch(function(err){
    res.json(500, {status: 'failure', errors: err});
  });
};

module.exports.editUserstudy = function(req, res) {

  var promises = [UserstudyPromise.validFullUserstudyReq(req),
  UserPromise.userstudyExists(req.body.id,req.body.title)];

  Promise.all(promises).then(function(results){
    UserStudy.editUserStudy(results[0], function(err){
      if (err) {
        throw err;
      } else {
        res.json({status: 'success', message: 'userstudy edited.'});
      }
    }).catch(function(err){
      res.json(500, {status: 'failure', errors: err});
    });
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
          res.json({status: 'success', message: 'userstudy deleted.'});
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
          res.json({status: 'success', message: 'userstudy published.'});
        }
      });
    })
    .catch(function(err){
      res.json(500, {status: 'failure', errors: err});
    });

};

module.exports.getUserstudy = function(req, res) {
  UserPromise.validUserstudyReq(req)
    .then(function(userstudy){
      return UserPromise.userstudyExists(userstudy);
    })
    .then(function(userstudy){
      UserStudy.getUserstudy(userstudy, function(err, result){
        if (err) {
          throw err;
        } else {
          res.json(result[0]);
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
      res.json(list);
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
          res.json(list);
        }
      });
    })
    .catch(function (err){
      res.json(500, {status: 'failure', errors: err});
    });
};

module.exports.allUserstudiesFilteredForUser = function(req, res) {
  var promises = [
    UserstudyPromise.validFilterReq(req),
    UserPromise.validUserReq(req)
  ];
// TODO need to rewrite this to get user from token and filter from there.
  Promise.all(promises).then(function(filters){


    UserStudy.getAllUserstudiesFilteredForUser(filters, function(err, list){
      if (err) {
        throw err;
      } else {
        res.json(list);
      }
    });
  })
  .catch(function (err){
    res.json(500, {status: 'failure', errors: err});
  });
};

module.exports.registerUserToStudy = function(req, res){
  var promises = [UserstudyPromise.validUserstudyReq(req),
    UserPromise.userFromToken(req)];

  var user;
  var userstudy;

  Promise.all(promises)
    .then(function(result){
      user = result[0];
      userstudy = result[1];

      return UserstudyPromise.userIsNOTRegisteredToStudy(user,userstudy);
    })
    .then(function(){
      UserStudy.mapUserToStudy(user, userstudy, function(err){
        if (err) {
          throw err;
        } else {
          res.json({status: 'success', message: 'User ' + user + ' registered to userstudy ' + userstudy});
        }
    });
  })
  .catch(function (err){
    res.json(500, {status: 'failure', errors: err});
  });
};

module.exports.removeUserFromStudy = function(req, res){
  var promises = [UserstudyPromise.validUserstudyReq(req),
    UserPromise.userFromToken(req)];

  Promise.all(promises).then(function(result){
    var user = result[0];
    var userstudy = result[1];

    UserStudy.unmapUserFromStudy(user,userstudy, function(err){
      if (err) {
        throw err;
      } else {
        res.json({status: 'success', message: 'User ' + user + ' registered to userstudy ' + userstudy});
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
          res.json({status: 'success', message: 'User ' + user + ' confirmed participation of userstudy ' + userstudy});
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

