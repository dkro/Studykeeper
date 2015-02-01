"use strict";
var News = require('../models/news');
var Promise = require('es6-promise').Promise;
var NewsPromise = require('./promises/newsPromises');
var Async       = require('async');


module.exports.createNews = function (req, res) {

  NewsPromise.validNewsReq(req)
    .then(function (news) {
      News.addNews(news, function (err, result) {
        if (err) {
          throw err;
        } else {
          news.id = result.insertId;
          res.json({status: 'success', message: 'News erstellt', news: news});
        }
      });
    })
    .catch(function (err) {
      res.json(500, {status: 'failure', message: err});
    });
};

module.exports.editNews = function (req, res) {
  var news;
  NewsPromise.validNewsReq(req)
    .then(function (result) {
      news = result;
      return NewsPromise.newsExists(news);
    })
    .then(function () {
      News.editNews(news, function (err) {
        if (err) {
          throw err;
        } else {
          res.json({status: 'success', message: 'News geändert.', news: news});
        }
      });
    })
    .catch(function (err) {
      res.json(500, {status: 'failure', message: err});
    });
};

module.exports.deleteNews = function (req, res) {
  News.getNewsById(req.params.id, function (err, result) {
    if (err) {
      res.json(500, {status: 'failure', message: 'Server Fehler.', internal: err});
    } else if (result.length === 0) {
      res.json(500, {status: 'failure', message: 'News wurde nicht gefunden'});
    } else {
      var news = result[0];
      if (news.userstudies === null) {
        News.deleteNewsById(req.params.id, function(err){
          if (err) {
            res.json({status: 'failure', message: 'Server Fehler.', internal: err});
          } else {
            res.json({status: 'success', message: 'News wurde gelöscht.'});
          }
        });
      } else {
        news.userstudies = news.userstudies.split(",").map(function(x){return parseInt(x);});
        res.json(500, {status: 'failure',
          message: 'Die News konnte nicht gelöscht werden, da mindestens eine Nutzerstudie diese News anzeigt.',
          userstudies: news.userstudies});
      }
    }
  });
};


module.exports.getNewsById = function (req, res) {
  News.getNewsById(req.params.id, function (err, result) {
    if (err) {
      res.json(500, {status: 'failure', message: 'Server Fehler.', internal: err});
    } else if (result.length === 0) {
      res.json({status: 'failure', message: 'News wurde nicht gefunden'});
    } else {
      var news = result[0];
      if (news.userstudies === null) {
        news.userstudies = [];
      } else {
        news.userstudies = news.userstudies.split(",").map(function(x){return parseInt(x);});
      }

      res.json({news: news});
    }
  });
};

module.exports.allNews = function (req, res) {
  News.getAllNews(function (err, list) {
    if (err) {
      res.json(500, {status: 'failure', message: 'Server Fehler.', internal: err});
    } else {
      Async.eachSeries(list, function(item, callback){
        if (item.userstudies === null) {
          item.userstudies = [];
        } else {
          item.userstudies = item.userstudies.split(",").map(function(x){return parseInt(x);});
        }

        callback();
      }, function(err){
        if(err){
          res.json(500, {status:'failure', message: 'Server Fehler.', internal: err});
        } else {
          res.json({news: list});
        }
      });
    }
  });
};



