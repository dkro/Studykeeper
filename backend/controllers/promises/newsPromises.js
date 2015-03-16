"use strict";
var News         = require('../../models/news');
var Promise      = require('es6-promise').Promise;
var Validator    = require('validator');

module.exports.validNewsReq = function(req){
  return new Promise(function(resolve,reject) {
    var validationErrors = [];

    if (!req.body.news){
      validationErrors.push("Die gesendeten Daten sind nicht im geforderten Format. " +
      "Bitte wenden Sie sich an einen Administrator.");
    } else {
      if (!Validator.isLength(req.body.news.title, 3)) {
        validationErrors.push("Ein News Titel muss mindestens aus drei Zeichen bestehen. Erhalten: \"" + req.body.news.title + "\"");
      }
      if (!Validator.isDate(req.body.news.date)) {
        validationErrors.push("Das News Datum hat ein falsches Format. Erhalten: " + req.body.news.date + "\"");
      }
      if (!Validator.isLength(req.body.news.description, 3)) {
        validationErrors.push("Eine News Beschreibung muss mindestens aus drei Zeichen bestehen. Erhalten: \"" + req.body.news.description + "\"");
      }
      if (req.body.news.link) {
        if (!/^(f|ht)tps?:\/\//i.test(req.body.news.link)) {
          req.body.news.link= "http://" + req.body.news.link;
        }
        if (!Validator.isURL(req.body.news.link)) {
          validationErrors.push("Ein News Link muss ein URL Format besitzen. Z.B. http://www.beispiel.de. Erhalten: " + req.body.userstudy.link + "\"");
        }
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
        reject('Die News existiert nicht.');
      }
    });
  });
};


