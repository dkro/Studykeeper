"use strict";
var News         = require('../../models/news');
var Promise      = require('es6-promise').Promise;
var Validator    = require('validator');

module.exports.validNewsReq = function(req){
  return new Promise(function(resolve,reject) {
    var validationErrors = [];
    if (!Validator.isNumeric(req.body.news.id)) {
      validationErrors.push({message: "News Id invalid, numeric required: " + req.body.news.id});
    }
    if (!Validator.isLength(req.body.news.title, 3)) {
      validationErrors.push({message: "News Title invalid, minimum 3 characters: " + req.body.news.title});
    }

    if (validationErrors.length > 0) {
      reject(validationErrors);
    } else {
      var newsData = {
        id: Validator.toString(req.body.news.id),
        title: Validator.toString(req.body.news.title)
      };
      resolve(newsData);
    }
  });
};

module.exports.validFullNewsReq = function(req){
  return new Promise(function(resolve,reject) {
    var validationErrors = [];
    if (!Validator.isLength(req.body.news.title, 3)) {
      validationErrors.push({message: "News Title invalid, minimum 3 characters: " + req.body.news.title});
    }
    if (!Validator.isDate(req.body.news.date)) {
      validationErrors.push({message: "News Date invalid, date required: " + req.body.news.date});
    }
    if (!Validator.isLength(req.body.news.description, 3)) {
      validationErrors.push({message: "News Description invalid, minimum 3 characters: " + req.body.news.description});
    }
    if (!Validator.isURL(req.body.news.link)) {
      validationErrors.push({message: "News link invalid, valid URL required: " + req.body.news.link});
    }

    if (validationErrors.length > 0) {
      reject(validationErrors);
    } else {
      var newsData = {
        title: Validator.toString(req.body.news.title),
        date: Validator.toString(req.body.news.date),
        description: Validator.toString(req.body.news.description),
        link: Validator.toString(req.body.news.link)
      };
      if (hasId) {
        newsData.id = req.body.news.id;
      }
      resolve(newsData);
    }
  });
};

module.exports.newsExists = function(news){
  return new Promise(function(resolve, reject){
    News.getNewsById(news.id, function(err, result){
      if (err) {
        reject({message: 'Internal error, please try again.'});
      }

      if (result.length > 0){
        resolve(result[0]);
      } else {
        reject({message: 'News not found.'});
      }
    });
  });
};


