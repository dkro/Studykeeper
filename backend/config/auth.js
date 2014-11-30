var passport  = require('passport');

exports.loginAuthenticate = function(req, res, next) {
  passport.authenticate('local', {session: false},
      function(err, user, info){
        if(err) {
          return next(err);
        }

        if(user.length === 0 || user === false) {
          return res.send(info);
        }

        next ();
      }
  )(req, res, next);
};

exports.tokenAuthenticate = function(req, res, next) {
  passport.authenticate('bearer', {session: false},
    function(err, user, info) {
      if (err) {
        return next(err);
      }

      if (user === false || user.length === 0) {
        return res.send(info);
      }

      next();
    }
  )(req, res, next);
};

exports.requiresRole = function(role) {
  return function (req, res, next) {
    if(!req.isAuthenticate() || req.user.roles.indexOf(role) === -1) {
      res.status(403);
      res.send();
    } else {
      next();
    }
  };
};
