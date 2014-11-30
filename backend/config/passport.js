var passport       = require('passport');
var LocalStrategy  = require('passport-local').Strategy;
var BearerStrategy = require('passport-http-bearer').Strategy;
var User           = require('../models/users');

module.exports = function() {

  // Local Strategy used to initially login the user
  passport.use(new LocalStrategy(
      function(username, password, done) {
        User.getUserByName({ username: username }, function(err, user) {
          if (err) {
            return done(err);
          }

          if (!user) {
            return done(null, false, { message: 'Incorrect username.' });
          }

          if (user[0].password != password ) {
            return done(null, false, { message: 'Incorrect password.' });
          }

          return done(null, user);
        });
      }
  ));

  // Bearer Strategy used to authenticate after login
  passport.use(new BearerStrategy ({},
    function(token, done) {
      User.getUserByToken(token, function(err, user) {
        if (err) {
          return done(err);
        }

        if (user === false || user.length === 0) {
          return done(null, false, { message: 'Token not found.' });
        }

        return done(null, user);
      });
    }
  ));

};