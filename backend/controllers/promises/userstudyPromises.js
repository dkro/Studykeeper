"use strict";
var Userstudy    = require('../../models/userstudies');
var Promise      = require('es6-promise').Promise;
var Validator    = require('validator');


module.exports.validUserstudyReq = function(req){
  return new Promise(function(resolve,reject) {
    var validationErrors = [];
    if (!Validator.isNumeric(req.body.userstudy.id)) {
      validationErrors.push({message: "Id invalid, has to be numeric: " + req.body.userstudy.id});
    }
    if (!Validator.isAlpha(req.body.userstudy.title) && !Validator.isLength(req.body.userstudy.title, 3)) {
      validationErrors.push({message: "Title invalid, minimum 3 characters: " + req.body.userstudy.title});
    }
    if (validationErrors.length > 0) {
      reject(validationErrors);
    } else {
      var userStudyData = {
        id: Validator.toString(req.body.userstudy.id),
        title: Validator.toString(req.body.userstudy.title)
      };
      resolve(userStudyData);
    }
  });
};

module.exports.validFullUserstudyReq = function(req){
  return new Promise(function(resolve,reject) {
    var validationErrors = [];
    if (!Validator.isAlpha(req.body.userstudy.title) && !Validator.isLength(req.body.userstudy.title, 3)) {
      validationErrors.push({message: "Title invalid, minimum 3 characters: " + req.body.userstudy.title});
    }
    if (!Validator.isEmail(req.body.userstudy.tutorname)) {
      validationErrors.push({message: "Tutorname invalid, has be an email: " + req.body.userstudy.tutorname});
    }
    if (!Validator.isEmail(req.body.userstudy.executorname)) {
      validationErrors.push({message: "Executorname invalid, has be an email:: " + req.body.userstudy.executorname});
    }
    if (!Validator.isNumeric(req.body.userstudy.tutorId)) {
      validationErrors.push({message: "Tutor-ID invalid, has be numeric: " + req.body.userstudy.tutorId});
    }
    if (!Validator.isNumeric(req.body.userstudy.executorId)) {
      validationErrors.push({message: "Executor-ID invalid, has be numeric:: " + req.body.userstudy.executorId});
    }
    if (!Validator.isDate(req.body.userstudy.fromDate)) {
      validationErrors.push({message: "FromDate invalid, has to be of form YYYY-MM-DD: " + req.body.userstudy.fromDate});
    }
    if (!Validator.isDate(req.body.userstudy.untilDate)) {
      validationErrors.push({message: "UntilDate invalid, has to be of form YYYY-MM-DD: " + req.body.userstudy.untilDate});
    }
    if (!Validator.isLength(req.body.userstudy.description, 3)) {
      validationErrors.push({message: "Description invalid, minimum 3 characters: " + req.body.userstudy.description});
    }
    if (req.body.userstudy.doodleLink !== undefined && !Validator.isURL(req.body.userstudy.doodleLink)) {
      validationErrors.push({message: "DoodleLink invalid, has to be a valid URL: " + req.body.userstudy.doodleLink});
    }
    if (req.body.userstudy.paper !== undefined && !Validator.isURL(req.body.userstudy.paper)) {
      validationErrors.push({message: "Paper invalid, has to be a valid URL: " + req.body.userstudy.paper});
    }
    if (!Validator.isNumeric(req.body.userstudy.mmi)) {
      validationErrors.push({message: "MMI Points invalid, numeric required: " + req.body.userstudy.mmi});
    }
    if (!Validator.isNumeric(req.body.userstudy.compensation)) {
      validationErrors.push({message: "Compensation invalid, numeric required: " + req.body.userstudy.compensation});
    }
    if (!Validator.isLength(req.body.userstudy.location, 3)) {
      validationErrors.push({message: "Location invalid, minimum 3 characters: " + req.body.userstudy.location});
    }
    if (!Validator.isNumeric(req.body.userstudy.space, 3)) {
      validationErrors.push({message: "Space invalid, numeric required: " + req.body.userstudy.space});
    }
    if (Array.isArray(req.body.userstudy.isFutureStudyFor)) {
      for (var i=0; i<req.body.userstudy.isFutureStudyFor; i+=1){
        if (!Validator.isNumeric(req.body.userstudy.isFutureStudyFor)) {
          validationErrors.push({message: "isFutureStudyFor invalid, numeric required: " + req.body.userstudy.isFutureStudyFor});
        }
      }
    } else {
      validationErrors.push({message: "isFutureStudyFor invalid, Array of Ids required: " + req.body.userstudy.isFutureStudyFor});
    }
    if (Array.isArray(req.body.userstudy.isHistoryFor)) {
      for (var j=0; j<req.body.userstudy.isHistoryFor; j+=1){
        if (!Validator.isNumeric(req.body.userstudy.isHistoryFor)) {
          validationErrors.push({message: "isHistoryFor invalid, numeric required: " + req.body.userstudy.isHistoryFor});
        }
      }
    } else {
      validationErrors.push({message: "isHistoryFor invalid, Array of Ids required: " + req.body.userstudy.isHistoryFor});
    }
    if (req.body.userstudy.fromDate > req.body.userstudy.untilDate) {
      validationErrors.push({message: 'The from-date needs to be before the until-date.'});
    }
    if (validationErrors.length > 0) {
      reject(validationErrors);
    } else {
      var userStudyData = {
        title: Validator.toString(req.body.userstudy.title),
        tutorname: Validator.toString(req.body.userstudy.tutorname),
        executorname: Validator.toString(req.body.userstudy.executorname),
        tutorId: Validator.toString(req.body.userstudy.tutorId),
        executorId: Validator.toString(req.body.userstudy.executorId),
        fromDate: Validator.toString(req.body.userstudy.fromDate),
        untilDate: Validator.toString(req.body.userstudy.untilDate),
        description: Validator.toString(req.body.userstudy.description),
        doodleLink: Validator.toString(req.body.userstudy.doodleLink),
        paper: Validator.toString(req.body.userstudy.paper),
        mmi: Validator.toString(req.body.userstudy.mmi),
        compensation: Validator.toString(req.body.userstudy.compensation),
        location: Validator.toString(req.body.userstudy.location),
        space: Validator.toString(req.body.userstudy.space),
        isFutureStudyFor: req.body.userstudy.isFutureStudyFor,
        isHistoryFor: req.body.userstudy.isHistoryFor
      };
      resolve(userStudyData);
    }
  });
};

module.exports.validFilterReq = function(req){
  return new Promise(function(resolve,reject) {
    var validationErrors = [];

    var order;
    if (req.body.filter.order && req.body.filter.order!=="desc" && req.body.filter.order!=="asc") {
      validationErrors.push({message: "Invalid filter-order. \"asc\" or \"desc\" required"});
    } else {
      order = Validator.toString(req.body.filter.order);
    }

    var orderBy;
    var arr = ["title","fromDate","untilDate","tutorname","executorname","space","location"];
    if (req.body.filter.orderBy && arr.indexOf(req.body.filter.orderBy) === -1) {
      validationErrors.push({message: "Invalid filter-orderBy. " + arr + " required"});
    } else {
      orderBy = Validator.toString(req.body.filter.orderBy);
    }

    // todo regex for limit

    // todo correct labe check
    var label;
    if (!req.body.label){
      label = "";
    } else {
      label = req.body.label;
    }

    if (req.body.filter.title && !Validator.isAlpha(req.body.filter.title) && !Validator.isLength(req.body.userstudy.title, 3)) {
      validationErrors.push({message: "Title invalid, minimum 3 characters: " + req.body.filter.title});
    }
    if (req.body.filter.tutorname && !Validator.isEmail(req.body.filter.tutorname)) {
      validationErrors.push({message: "Tutorname invalid, has be an email: " + req.body.filter.tutorname});
    }
    if (req.body.filter.executorname && !Validator.isEmail(req.body.filter.executorname)) {
      validationErrors.push({message: "Executorname invalid, has be an email:: " + req.body.filter.executorname});
    }
    if (req.body.filter.fromDate && !Validator.isDate(req.body.filter.fromDate)) {
      validationErrors.push({message: "FromDate invalid, has to be of form YYYY-MM-DD: " + req.body.filter.fromDate});
    }
    if (req.body.filter.untilDate && !Validator.isDate(req.body.filter.untilDate)) {
      validationErrors.push({message: "UntilDate invalid, has to be of form YYYY-MM-DD: " + req.body.filter.untilDate});
    }
    if (req.body.filter.description && !Validator.isLength(req.body.filter.description, 3)) {
      validationErrors.push({message: "Description invalid, minimum 3 characters: " + req.body.filter.description});
    }
    if (req.body.filter.visible && !Validator.isNumeric(req.body.filter.visible)) {
      validationErrors.push({message: "Visible invalid, has to be numeric: " + req.body.filter.visible});
    }
    if (req.body.filter.published && !Validator.isNumeric(req.body.filter.published)) {
      validationErrors.push({message: "Published invalid, has to be numeric: " + req.body.filter.published});
    }
    if (req.body.filter.closed && !Validator.isNumeric(req.body.filter.closed)) {
      validationErrors.push({message: "Closed invalid, has to be numeric: " + req.body.filter.closed});
    }

    if (validationErrors.length > 0) {
      reject(validationErrors);
    } else {
      var filterData = {
        order: order,
        orderBy: orderBy,
        label: label,
        limit: Validator.toString(req.body.filter.limit),
        fromDate: Validator.toString(req.body.filter.fromDate),
        untilDate:Validator.toString(req.body.filter.untilDate),
        title: Validator.toString(req.body.filter.title),
        description: Validator.toString(req.body.filter.description),
        tutor: Validator.toString(req.body.filter.tutor),
        executor: Validator.toString(req.body.filter.executor),
        visible: Validator.toString(req.body.filter.visible),
        published: Validator.toString(req.body.filter.published),
        closed: Validator.toString(req.body.filter.closed)
      };
      resolve(filterData);
    }
  });
};

module.exports.userstudyExists = function(userstudy) {
  return new Promise(function(resolve, reject){

    Userstudy.getUserstudyById(userstudy.id,function(err,result){
      if (err) {
        reject(err);
      } else if (result.length === 0) {
        reject({message: 'userstudy not found', userstudy: {
          id: userstudy.id,
          title: userstudy.title
        }});
      } else {
        resolve(result[0]);
      }
    });

  });
};

module.exports.userstudyHasSpace = function(userstudy) {
  return new Promise(function(resolve, reject){
    Userstudy.getUserstudy(userstudy,function(err,result){
      if (err) {reject(err);}
      var space = result[0].space;
      if (result.length === 0) {reject({message: 'userstudy not found', userstudy: userstudy});}

      Userstudy.getUsersRegisteredToStudy(userstudy, function(err,result){
        if (err) {reject(err);}

        if (result.length < space) {
          resolve(result[0]);
        } else {
          reject({message: 'userstudy: ' + userstudy.title + ' has not open slots'});
        }
      });

    });
  });
};

module.exports.userIsRegisteredToStudy = function(userId, userstudyId){
  return new Promise(function(resolve, reject){
    Userstudy.getUsersRegisteredToStudy(userstudyId, function(err,result){
      if (err) {reject(err);}

      var registered = false;
      for (var i= 0; i<result.length; i+=1) {
        if (result[i].id === userId) {
          registered = true;
          break;
        }
      }

      if (registered) {
        resolve(userId);
      } else {
        reject({message: 'user: ' + userId + ' is not registered to userstudy: ' + userstudyId});
      }
    });
  });
};

module.exports.userIsNOTRegisteredToStudy = function(userId,userstudyId){
  return new Promise(function(resolve, reject){
    Userstudy.getUsersRegisteredToStudy(userstudyId, function(err,result){
      if (err) {reject(err);}

      var registered = false;
      for (var i= 0; i<result.length; i+=1) {
        if (result[i].id === userId) {
          registered = true;
          break;
        }
      }

      if (registered) {
        reject({message: 'user: ' + userId + ' is registered already to userstudy: ' + userstudyId});
      } else {
        resolve(userId);
      }
    });
  });
};

module.exports.labelsForUserstudy = function(userstudy){
  return new Promise(function(resolve, reject){
    Userstudy.getLabelsForStudy(userstudy, function(err, result) {
      if (err) {
        reject(err);
      } else {
        resolve(result[0]);
      }
    });
  });
};

module.exports.userIsExecutorFor = function(user) {
  return new Promise(function (resolve, reject) {
    Userstudy.getStudiesUserIsExecutor(user, function (err, result) {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
};

module.exports.userIsTutorFor = function(user) {
  return new Promise(function (resolve, reject) {
    Userstudy.getStudiesUserIsTutor(user, function (err, result) {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
};

module.exports.userStudyHistory = function(user) {
  return new Promise(function (resolve, reject) {
    Userstudy.getStudiesFinishedByUser(user, function (err, result) {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
};

module.exports.userRegisteredStudies = function(user) {
  return new Promise(function (resolve, reject) {
    Userstudy.getStudiesCurrentByUser(user, function (err, result) {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
};

module.exports.studiesRequiredByStudy = function(userstudy) {
  return new Promise(function (resolve, reject) {
    Userstudy.getStudiesRequiredFor(userstudy, function (err, result) {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
};

module.exports.studiesRestricedByStudy = function(userstudy) {
  return new Promise(function (resolve, reject) {
    Userstudy.getStudiesRestricedBy(userstudy, function (err, result) {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
};