var passport  = require('passport');

exports.authenticate = function(req, res, next) {
  passport.authenticate('bearer', {session: false},
    function(err, user, info) {
      console.log('auth.js')
      if (err) {
        return next(err);
      }

      if (user.length==0) {
        return res.send(info + ' User not found authjs');
      }

      next();
    }
  )(req, res, next);
};

exports.requiresRole = function(role) {
  return function (req, res, next) {
    if(!req.isAuthenticate() || req.user.roles.indexOf(role) == -1) {
      res.status(403);
      res.send();
    } else {
      next();
    }
  }
};