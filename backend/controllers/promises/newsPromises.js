"use strict";
var News         = require('../../models/news');
var Promise      = require('es6-promise').Promise;
var Validator    = require('validator');

module.exports.validNewsReq = function(req){
  return new Promise(function(resolve,reject) {
    var validationErrors = [];

    if (!req.body.news){
      validationErrors.push("News request hat ein falsches Format.");
    } else {
      if (!Validator.isLength(req.body.news.title, 3)) {
        validationErrors.push("News Title ungültig. Minimum 3 Charakter: " + req.body.news.title);
      }
      if (!Validator.isDate(req.body.news.date)) {
        validationErrors.push("News Datum ungültig. Datum Format erwartet: " + req.body.news.date);
      }
      if (!Validator.isLength(req.body.news.description, 3)) {
        validationErrors.push("News Beschreibung ungültig, Minimum 3 Charakter: " + req.body.news.description);
      }
      if (!Validator.isURL(req.body.news.link, {require_protocol: true})) {
        validationErrors.push("News link ungültig. URL Format (http://www.beispiel.de) erwartet: " + req.body.news.link);
      }
    }

    if (validationErrors.length > 0) {
      reject(validationErrors.join(' '));
    } else {
      var newsData = {
        title: Validator.toString(req.body.news.title),
        date: Validator.toString(req.body.news.date),
        description: Validator.toString(req.body.news.description),
        link: Validator.toString(req.body.news.link)
      };
      resolve(newsData);
    }
  });
};

module.exports.newsExists = function(newsId){
  return new Promise(function(resolve, reject){
    News.getNewsById(newsId, function(err, result){
      if (err) {
        reject(err);
      }

      if (result.length > 0){
        resolve(result[0]);
      } else {
        reject('News wurde nicht gefunden.');
      }
    });
  });
};


