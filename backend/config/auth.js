var passport  = require('passport');
var userController = require('../controllers/users');

exports.loginAuthenticate = function(req, res, next) {
  passport.authenticate('local', {session: false},
      function(err, user, info){
        if(err) {
          return next(err);
        }

        if(user.length === 0 || user === false) {
          return res.send(info);
        } else {
          next ();
        }
      }
  )(req, res, next);
};

exports.tokenAuthenticate = function(req, res, next) {
  passport.authenticate('bearer', {session: false},
    function(err, user, token, info) {
      if (err) {
        return next(err);
      }

      if (user === false || user.length === 0) {
        return res.send(info);
      } else {
        req.user = user;
        req.token = token;
        next();
      }
    }
  )(req, res, next);
};

exports.requiresRole = function(role) {
  return function (req, res, next) {
    userController.validateRole(role, token, function(roleValidated){
      if(!roleValidated) {
        res.status(403);
        res.send();
      } else {
        next();
      }
    });
  };
};
