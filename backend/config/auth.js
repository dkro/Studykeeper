var passport  = require('passport');
var userController = require('../controllers/users');

exports.loginAuthenticate = function(req, res, next) {
  passport.authenticate('local', {session: false},
      function(err, user, info){
        if(err) {
          res.json(401, {status: "failure", message: err});
        }

        if(user.length === 0 || user === false) {
          res.json(401, {status: "failure", message: 'Login: User not found.'});
        } else {
          next();
        }
      }
  )(req, res, next);
};

exports.tokenAuthenticate = function(req, res, next) {
  passport.authenticate('bearer', {session: false},
    function(err, token) {
      if (err) {
        res.json(401, {status: "failure", message: err});
      } else if (token === false || token.length === 0) {
        res.json(401, {status: "failure", message: 'Token invalid.'});
      } else {
        req.token = token;
        next();
      }
    }
  )(req, res, next);
};

exports.requiresRole = function(role) {
  return function (req, res, next) {
    userController.validateRole(role, req.token.roleId, function(err,roleValidated){
      if (err) {
        res.send(500, {status: 'failure', message: err});
      } else if(!roleValidated) {
        res.send(403, {status: 'failure', message: 'Your are not allowed to this resource.'});
      } else {
        next();
      }
    });
  };
};
