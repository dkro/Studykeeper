var passport       = require('passport');
var BearerStrategy = require('passport-http-bearer').Strategy;
var User           = require('../models/users');

module.exports = function() {
  passport.use(new BearerStrategy ({},
    function(token, done) {
      User.getUserByToken(token, function(err, user) {
        if (err) {
          return done(err); 
        }

        if (!user) {
          return done(null, false, { message: 'User not found passportjs.' });
        }

        return done(null, user);
      })
    }
  ));
};