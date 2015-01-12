var passport  = require('passport');
var userController = require('../controllers/users');

exports.loginAuthenticate = function(req, res, next) {
  passport.authenticate('local', {session: false},
      function(err, user, info){
        if(err) {
          res.json(401, {status: "failure", message: err});
        }

        if(user.length === 0 || user === false) {
          res.json(401, {status: "failure", message: 'User not found.'});
        } else {
          next();
        }
      }
  )(req, res, next);
};

exports.tokenAuthenticate = function(req, res, next) {
  passport.authenticate('bearer', {session: false},
    function(err, user, info) {
      if (err) {
        res.json(401, {status: "failure", message: err});
      }

      if (user === false || user.length === 0) {
        res.json(401, {status: "failure", message: 'User not found'});
      } else {
        req.user = user;
        req.token = info;
        next();
      }
    }
  )(req, res, next);
};

exports.requiresRole = function(role) {
  return function (req, res, next) {
    userController.validateRole(role, req.user[0].username, res, function(roleValidated){
      if(!roleValidated) {
        res.send(403, {status: 'failure', message: 'Your role is not allowed to this resource.'});
      } else {
        next();
      }
    });
  };
};
