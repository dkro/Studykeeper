var passport  = require('passport');
var UserController = require('../controllers/users');

exports.loginAuthenticate = function(req, res, next) {
  passport.authenticate('local', {session: false},
      function(err, user, info){
        if(err) {
          res.json(500, {status: "failure", message: 'Server Fehler', internal: err});
        } else if(user.length === 0 || user === false) {
          res.json(401, {status: "failure", message: "Ungültige Anmeldedaten. Entweder der Nutzer existiert nicht oder das Passwort ist falsch.", internal: info});
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
        res.json(500, {status: "failure", message: 'Server Fehler', internal: err});
      } else if (token === false || token.length === 0) {
        res.json(401, {status: "failure", message: 'Ihre Sitzung ist abgelaufen. Bitte melden Sie sich neu an.'});
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
        res.send(403, {status: 'failure', message: 'Sie haben nicht die erforderliche Rolle, um diese Aktion durchführen zu können.'});
      }
    } else {
      UserController.validateRole(role, req.token.roleId, function(err,roleValidated){
        if (err) {
          res.send(500, {status: 'failure', message: 'Server Error', internal: err});
        } else if(!roleValidated) {
          res.send(403, {status: 'failure', message: 'Sie haben nicht die erforderliche Rolle, um diese Aktion durchführen zu können.'});
        } else {
          next();
        }
      });
    }
  };
};
