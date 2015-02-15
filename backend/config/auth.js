var passport  = require('passport');
var UserController = require('../controllers/users');

exports.loginAuthenticate = function(req, res, next) {
  passport.authenticate('local', {session: false},
      function(err, user, info){
        if(err) {
          res.json(500, {status: "failure", message: 'Server Error', internal: err});
        } else if(user.length === 0 || user === false) {
          res.json(401, {status: "failure", message: "Ungültige Anmeldedaten.", internal: info});
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
        res.json(500, {status: "failure", message: 'Server Error', internal: err});
      } else if (token === false || token.length === 0) {
        res.json(401, {status: "failure", message: 'Token ungültig.'});
      } else {
        req.token = token;
        next();
      }
    }
  )(req, res, next);
};

exports.requiresRole = function(role) {
  return function (req, res, next) {
    // token auth strategy puts the token into req.token
    if (role[0] === "self"){
      if (req.token.userId.toString() === req.params.id){
        next();
      } else {
        res.send(403, {status: 'failure', message: 'Keine Rechte.'});
      }
    } else {
      UserController.validateRole(role, req.token.roleId, function(err,roleValidated){
        if (err) {
          res.send(500, {status: 'failure', message: 'Server Error', internal: err});
        } else if(!roleValidated) {
          res.send(403, {status: 'failure', message: 'Keine Rechte.'});
        } else {
          next();
        }
      });
    }
  };
};
