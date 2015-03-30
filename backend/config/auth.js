var passport  = require('passport');
var UserController = require('../controllers/users');

/**
 * Authenticates the user with the Local Authentication Strategy with Passport.
 * The username and password have to be supplied in the Request Body.
 *
 * @param req Incoming Request Object
 * @param res Outgoing Response Object
 * @param next Next Handler in Routing Chain
 */
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

/**
 * Authenticates the user with the Bearer Token Authentication Strategy with Passport.
 * The Token has to be supplied in the Request Header Authorization in this form: Bearer {token}
 *
 * @param req Incoming Request Object
 * @param res Outgoing Response Object
 * @param next Next Handler in Routing Chain
 */
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

/**
 * Compares the role of the user with the given role Array.
 * The user token information has to be present in the Request Object
 *
 * @param role Array consisting of Strings describing the Role
 * @returns next Next Handler in the Routing Chain
 */
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
