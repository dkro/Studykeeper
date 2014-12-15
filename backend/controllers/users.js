var User = require('../models/users');
var crypt      = require('../utilities/encryption');
var validator = require('validator');

var passwordMinimumLength = 7;

exports.createUser = function(req, res) {
    var user = new User({
      username: req.body.username,
      password: req.body.password
    });

    user.save(function(err) {
      if (err){
        res.send(err);
      } else {
        res.json({
          status: 'success',
          message: 'New user has been created'});
      }
    });
};

exports.getUsers = function(req, res) {
  User.getUsers(function(err,result){
              if (err) throw err;
              console.log(result);
              return res.json(result);
            });
};

exports.getUser = function(name, res) {
  User.getUserByName(name, function(err,result){
              if (err) throw err;
              console.log(result);
              return res.json(result);
            });
};

exports.signup = function(req, res) {
  var user = {
    username: req.body.username,
    password: req.body.password,
    role    : 'participant'
  };

  User.getUserByName(user, function(err,result){
    //TODO error

    if (result.length > 0) {
      res.json({
        status: "failure",
        message: "Email already in use."});
    } else {
      if (validator.isEmail(user.username)) {
        if (user.password.length >= passwordMinimumLength) {
          User.saveUser(user, function (err) {
            if (err) {
              res.send(err);
            } else {

              if (user.username.indexOf("@cip.ifi.lmu.de") >= 0 || user.username.indexOf("@campus.lmu.de") >= 0) {
                User.setLMUStaff(user.username, true, function(err) {
                  if (err) {
                    // TODO log error correctly
                    console.log(err);
                  }
                });
              }

              User.createTokenForUser(user, function (err) {
                if (err) {
                  res.send(err);
                } else {
                  User.getTokensForUser(user, function (err, result) {
                    if (err) {
                      res.send(err);
                    } else {
                      // Sort tokenresult so that newest token is the first in array
                      result.sort(function (a, b) {
                        a = new Date(a.timestamp);
                        b = new Date(b.timestamp);
                        return a > b ? -1 : a < b ? 1 : 0;
                      });

                      res.json({
                        status: 'success',
                        message: 'New user has been created successfully',
                        username: user.username,
                        role: user.role,
                        token: result[0].token
                      });
                    }
                  });
                }
              });
            }
          });
        } else {
          res.json({
            status: 'failure',
            message: "Password too short. 7 chars minimum."});
        }
      } else {
        res.json({
          status: 'failure',
          message: "Invalid email address."});
      }
    }
  });
};

exports.login = function(req, res) {
  var user = {
    username: req.body.username
  };

  User.getUserByName(user,function(err,userResult) {

    User.createTokenForUser(user, function (err) {
      if (err) {
        res.send(err);
      } else {

        var now = new Date();
        var ThirtyMinutesFromNow = new Date(now - 1000*60*30);
        User.deleteTokensForUserBeforeTimestamp(user.username, ThirtyMinutesFromNow);

        User.getTokensForUser(user, function (err, tokenResult) {
          if (err) {
            res.send(err);
          } else {

            // Sort tokenresult so that newest token is the first in array
            tokenResult.sort(function(a, b) {
              a = new Date(a.timestamp);
              b = new Date(b.timestamp);
              return a>b ? -1 : a<b ? 1 : 0;
            });

            User.getUserRole(user.username, function (err, roleResult) {
              if (err) {
                res.send(err);
              } else {
                res.json({
                  status: 'success',
                  message: 'Login successful',
                  username: userResult[0].username,
                  role: roleResult[0].name,
                  token: tokenResult[0].token
                });
              }
            });
          }
        });
      }
    });
  });
};

exports.logout = function(req, res) {
  User.deleteToken(req.token, function(err){
    if (err) {
      res.send(err);
    } else {

      var now = new Date();
      var ThirtyMinutesFromNow = new Date(now - 1000*60*30);

      User.deleteTokensForUserBeforeTimestamp(req.user[0].username, ThirtyMinutesFromNow, function(err){
        if (err) {
          res.send(err);
        } else {
          res.json({
            status: 'success',
            username: req.user[0].username,
            message: 'Logged out.'
          });
        }
      });
    }
  });
};

exports.createUser = function(req, res) {
  var user = {
    username: req.body.username,
    password: req.body.password,
    confirmPassword : req.body.confirmPassword,
    role    : req.body.role
  };

  // TODO check for missing values

  if (user.password !== user.confirmPassword) {
    res.json({
      status: "failure",
      message: "The passwords don't match."
    });
  } else {
    User.getUserByName(user, function(err,result){
      if (result.length > 0) {
        res.json({
          status: "failure",
          message: "Email already in use."});
      } else {
        if (validator.isEmail(user.username)) {
          if (user.password.length >= passwordMinimumLength) {
            User.saveUser(user, function (err) {
              if (err) {
                res.send(err);
              } else {
                if (user.username.indexOf("@cip.ifi.lmu.de") >= 0 || user.username.indexOf("@campus.lmu.de") >= 0) {
                  User.setLMUStaff(user.username, true, function(err) {
                    if (err) {
                      // TODO log error correctly
                      console.log(err);
                    }
                  });
                }

                res.json({
                  status: 'success',
                  message: 'New user has been created successfully',
                  username: user.username,
                  role: user.role
                });
              }
            });
          } else {
            res.json({
              status: 'failure',
              message: "Password too short. 7 chars minimum."});
          }
        } else {
          res.json({
            status: 'failure',
            message: "Invalid email address."});
        }
      }
    });
  }
};

exports.deleteUser = function(req, res) {
  var user = new User({
    username: req.body.username,
    password: req.body.password,
    role    : req.body.role
  });

  user.saveUser(user,function(err) {
    if (err){
      res.send(err);
    } else {
      user.setRole(user, function(err) {
        if (err){
          res.send(err);
        } else {
          res.json({message: 'New user has been created successfully',
            username: user.username,
            role: user.role});
        }
      });
    }
  });
};

exports.validateRole = function(role, username, res, callback) {
  var roleValidated = false;
  User.getUserRole(username, function(err, result){
    if (err) {
      res.send(err);
    } else if (result[0].name === role) {
      roleValidated = true;
      return callback(roleValidated);
    } else {
      roleValidated = false;
      return callback(roleValidated);
  }
  });
};


exports.retrievePW = function(){

};

exports.changePW = function(req, res) {
  var user = {
    username: req.body.username,
    oldPassword: req.body.oldPassword,
    newPassword: req.body.newPassword,
    newPasswordConfirmation: req.body.newPasswordConfirmation
  };

  if (user.newPassword !== user.newPasswordConfirmation) {
    res.json({
      status: "failure",
      message: "New passwords don't match."
    });
  } else if (user.newPassword.length < passwordMinimumLength) {
    res.json({
      status: "failure",
      message: "New password is too short. Minimum of 7 chars."
    });
  } else {
      User.getUserByName(user, function(err, userResult) {
        if (err) {
          res.send(err);
        } else {
          if (userResult.length < 1) {
            res.send({status: 'failure', message: 'Incorrect username.'});
          } else {
            crypt.comparePassword(userResult[0].password, user.oldPassword,
              function (err, isPasswordMatch) {
                if (err) {
                  return res(err);
                }

                if (!isPasswordMatch) {
                  res.send({
                    status: 'failure',
                    message: 'Incorrect password.'
                  });
                } else {
                  User.setPassword(user.newPassword, user.username, function (err) {
                    if (err) {
                      res.send(err);
                    } else {
                      res.json({
                        status: "success",
                        message: "Password successfully changed."
                      });
                    }
                  });
                }
              });
          }
        }
      });
  }
};
