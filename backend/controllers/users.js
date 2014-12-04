var User = require('../models/users');
var validator = require('validator');

exports.createUser = function(req, res) {
    var user = new User({
      username: req.body.username,
      password: req.body.password
    });

    user.save(function(err) {
      if (err){
        res.send(err);
      } else {
        res.json({message: 'New user has been created'});
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

  User.getUserByName(user,function(err,result){
    if (result.length > 0) {
      res.json({message: "Email already in use."});
    } else {
      if (validator.isEmail(user.username)) {
        User.saveUser(user,function(err) {
          if (err){
            res.send(err);
          } else {
            User.createTokenForUser(user, function(err){
              if (err){
                res.send(err);
              } else {
                User.getTokensForUser(user, function(err, result){
                  if (err) {
                    res.send(err);
                  } else {
                    res.json({message: 'New user has been created successfully',
                      username: user.username,
                      role: user.role,
                      token: result[0].token});
                    // TODO get the newest token after signup
                  }
                });
              }
            });
          }
        });
      } else {
        res.json({message: "Invalid email address."});
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
            User.getUserRole(user, function (err, roleResult) {
              if (err) {
                res.send(err);
              } else {
                res.json({
                  // TODO send newest token( the one just created )
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

exports.addUser = function(req, res) {
  var user = new User({
    username: req.body.username,
    password: req.body.password,
    role    : req.body.role
  });

  // TODO check for email username, user password existing

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

exports.validateRole = function(role, token, callback) {
  return callback(true);
};