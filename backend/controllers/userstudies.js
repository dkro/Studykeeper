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
  UserPromise.userstudyExists(req.body.id,req.body.userstudyTitle)];

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
      UserStudy.deleteUserStudy(userstudy, function(err){
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
      UserStudy.publishUserStudy(userstudy, function(err) {
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

module.exports.addLabeltoUserstudy = function(req, res){
  var validationPromises = [UserstudyPromise.validUserstudyReq(req),
    UserstudyPromise.validLabelReq(req)];

  Promise.all(validationPromises).then(function(results){

    var existencePromises = [UserstudyPromise.userstudyExists(results[0]),
      UserstudyPromise.labelExists(results[1])];

    Promise.all(existencePromises).then(function(results){
      var userstudyLabel = results;// TODO

      UserStudy.addLabel(userstudyLabel, function(err){
        if (err) {
          throw err;
        } else {
          res.json({status: 'success', message: 'label edited.'});
        }
      });
    })
    .catch(function(err){
      res.json(500, {status: 'failure', errors: err});
    });
  });
};

module.exports.createLabel = function(req, res){

};

module.exports.registerUserToStudy = function(req, res){
  var promises = [UserstudyPromise.validUserstudyReq(req),
    UserPromise.userFromToken(req)];

  Promise.all(promises).then(function(result){
    var user = result[0];
    var userstudy = result[1];

    UserStudy.mapUserToStudy(user,userstudy, function(err){
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

};

module.exports.getUsersRegisteredToStudy = function(req, res){

};

module.exports.closeUserstudy = function(req, res){

};

