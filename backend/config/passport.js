"use strict";
var Passport       = require('passport');
var LocalStrategy  = require('passport-local').Strategy;
var BearerStrategy = require('passport-http-bearer').Strategy;
var User           = require('../models/users');
var crypt          = require('../utilities/encryption');

module.exports = function() {

  /**
   * Local Authentication Strategy used to authenticate the User with Username and Password
   */
  Passport.use(new LocalStrategy(
      function(username, password, done) {
        User.getUserByName(username, function(err, user) {
          if (err) {
            return done(err);
          }

          if (user.length < 1) {
            return done(null, false, 'Falscher Nutzername.');
          }

          crypt.comparePassword(user[0].password, password,
            function(err,isPasswordMatch) {
              if (err) {
                return done(err);
              }

              if (!isPasswordMatch) {
                return done(null, false, 'Falsches Passwort.');
              } else {
                return done(null, user);
              }
            }
          );
        });
      }
  ));

  /**
   * Bearer Strategy used to authenticate the user to give access to protected Ressources on the Server
   */
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
                  // User Token timestamp gets updated with every request
                  User.updateToken(token, function (err) {
                    if (err) {
                      return done(err);
                    } else {
                      return done(null, tokenResult[0]);
                    }
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