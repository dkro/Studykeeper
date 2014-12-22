"use strict";
var Passport       = require('passport');
var LocalStrategy  = require('passport-local').Strategy;
var BearerStrategy = require('passport-http-bearer').Strategy;
var User           = require('../models/users');
var crypt          = require('../utilities/encryption');

module.exports = function() {

  // Local Strategy used to initially login the user
  Passport.use(new LocalStrategy(
      function(username, password, done) {
        User.getUserByName(username, function(err, user) {
          if (err) {
            return done(err);
          }

          if (user.length < 1) {
            return done(null, false, { status: 'failure', message: 'Incorrect username.' });
          }

          crypt.comparePassword(user[0].password, password,
            function(err,isPasswordMatch) {
              if (err) {
                return done(err);
              }

              if (!isPasswordMatch) {
                return done(null, false, { status:'failure',  message: 'Incorrect password.' });
              } else {
                return done(null, user);
              }
            }
          );
        });
      }
  ));

  // Bearer Strategy used to authenticate after login
  Passport.use(new BearerStrategy ({},
    function(token, done) {
      User.getToken(token, function(err, tokenResult) {
        if (err) {
          return done(err, false);
        } else if (tokenResult.length < 1) {
          return done(null, false, {status: 'failure', message: 'Token not found.'});
        } else {
            User.getTokenTimestamp(token, function (err, timestampResult) {
              if (err) {
                return (done(err));
              }

              if ((new Date() - timestampResult[0].timestamp) / (1000 * 60) < 30) {
                User.getUserByToken(token, function (err, user) {
                  if (err) {
                    return done(err);
                  }

                  if (user === false || user.length === 0) {
                    return done(null, false, {status: 'failure', message: 'User not found.'});
                  }

                  // User Token timestamp gets updated with every request
                  User.updateToken(token, function (err) {
                    if (err) {
                      return done(err);
                    }

                    return done(null, user, token);
                  });
                });
              } else {

                // clean up old token
                User.deleteToken(token);

                return done(null, false, {status: 'failure', message: 'Token expired.'});
              }
            });
          }
      });
    }
  ));

};