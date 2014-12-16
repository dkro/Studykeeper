var UserStudy    = require('../models/userstudies');
var User         = require('../models/users');
var promise      = require('es6-promise');
var validator    = require('validator');

module.exports.createUserstudy = function(req, res) {

  var validationErrors = [];

  if (!validator.isAlpha(req.body.title)){
    validationErrors.push("Title invalid: " + req.body.title);
  }
  if (!validator.isEmail(req.body.tutorname)){
    validationErrors.push("Tutorname invalid: " + req.body.tutorname);
  }
  if (!validator.isEmail(req.body.executorname)){
    validationErrors.push("Executorname invalid: " + req.body.executorname);
  }
  if (!validator.isDate(req.body.fromDate)){
    validationErrors.push("FromDate invalid: " + req.body.fromDate);
  }
  if (!validator.isDate(req.body.untilDate)){
    validationErrors.push("UntilDate invalid: " + req.body.untilDate);
  }
  if (!validator.isAlpha(req.body.description)){
    validationErrors.push("Description invalid: " + req.body.description);
  }
  if (req.body.doodleLink !== undefined && !validator.isURL(req.body.doodleLink)){
    validationErrors.push("DoodleLink invalid: " + req.body.doodleLink);
  }
  if (req.body.paper !== undefined && !validator.isURL(req.body.paper)){
    validationErrors.push("Paper invalid: " + req.body.paper);
  }
  if (!validator.isNumeric(req.body.mmi)){
    validationErrors.push("MMI Points invalid: " + req.body.mmi);
  }
  if (!validator.isNumeric(req.body.compensation)){
    validationErrors.push("Compensation invalid: " + req.body.compensation);
  }
  if (!validator.isAlpha(req.body.location)){
    validationErrors.push("Location invalid: " + req.body.location);
  }

  if (validationErrors.length > 0) {
    res.json(500 , {status: 'failure', message: 'There have been validation errors: ' + validationErrors});
  } else {
    var userStudy = {
      title: validator.toString(req.body.title),
      tutorname: validator.toString(req.body.tutorname),
      executorname : validator.toString(req.body.executorname),
      fromDate: validator.toString(req.body.fromDate),
      untilDate: validator.toString(req.body.untilDate),
      description: validator.toString(req.body.description),
      doodleLink: validator.toString(req.body.doodleLink),
      paper: validator.toString(req.body.paper),
      mmi: validator.toString(req.body.mmi),
      compensation: validator.toString(req.body.compensation),
      location: validator.toString(req.body.location)
    };

    if (userStudy.fromDate > userStudy.untilDate) {
      res.json({status: 'failure', message:'The from date cant be greater than the until date.'});
    } else {
      User.getUserByName(userStudy.tutorname, function(err,tutor){
        if (tutor.length === 0) {
          res.json({status: 'failure', message: 'tutor not found'});
        } else {
          User.getUserByName(userStudy.executorname, function(err,executor){
            if (executor.length === 0) {
              res.json({status: 'failure', message: 'executor not found'});
            } else {
              UserStudy.addUserStudy(userStudy, function (err) {
                if (err) {
                  res.json(err);
                } else {
                  res.json({
                    'title': userStudy.title
                  });
                }
              });
            }
          });
        }
      });
    }
  }
};

module.exports.editUserstudy = function(req, res) {
  //todo
};

module.exports.deleteUserstudy = function(req, res) {
  //todo
};

module.exports.publishUserstudy = function(req, res) {
  //todo
};

module.exports.userstudyList = function(req, res) {
  UserStudy.getAllUserstudies(function(err, list){
    if (err) {
      res.json(err);
    } else {
      res.json(list);
    }
  })
};

module.exports.getUserstudy = function(req, res) {
  var userStudy = {
    id: validator.toString(req.body.id)
  };
  UserStudy.getUserstudyById(userStudy.id, function(err, study){
    if (err) {
      res.json(err);
    } else if (study.length === 0) {
      res.json({status: 'failure', message: 'Userstudy not found'});
    } else {
      res.json(study);
    }
  });
};



