var User = require('../models/users');

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

exports.test = function(req, res) {
  res.json('This is the story of a girl');
};
