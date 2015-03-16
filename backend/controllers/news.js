"use strict";
var News = require('../models/news');
var Promise = require('es6-promise').Promise;
var NewsPromise = require('./promises/newsPromises');
var Async       = require('async');


module.exports.createNews = function (req, res, next) {

  NewsPromise.validNewsReq(req)
    .then(function (news) {
      News.addNews(news, function (err,result) {
        if (err) {
          throw err;
        } else {
          news.id = result.insertId;
          res.json({news: news});
          return next();
        }
      });
    })
    .catch(function (err) {
      res.json(500, {status: 'failure', message: err});
      return next();
    });
};

module.exports.editNews = function (req, res, next) {
  var news;
  NewsPromise.validNewsReq(req)
    .then(function (result) {
      news = result;
      news.id = req.params.id;
      return NewsPromise.newsExists(req.params.id);
    })
    .then(function () {
      News.editNews(news, function (err) {
        if (err) {
          throw err;
        } else {
          res.json({status: 'success', message: 'News geändert.', news: news});
          return next();
        }
      });
    })
    .catch(function (err) {
      res.json(500, {status: 'failure', message: err});
      return next();
    });
};

module.exports.deleteNews = function (req, res, next) {
  News.getNewsById(req.params.id, function (err, result) {
    if (err) {
      res.json(500, {status: 'failure', message: 'Server Fehler.', internal: err});
      return next();
    } else if (result.length === 0) {
      res.json(500, {status: 'failure', message: 'Diese News existiert nicht.'});
      return next();
    } else {
      var news = result[0];
      if (news.userstudies === null) {
        News.deleteNewsById(req.params.id, function(err){
          if (err) {
            res.json({status: 'failure', message: 'Server Fehler.', internal: err});
            return next();
          } else {
            res.json({});
            return next();
          }
        });
      } else {
        news.userstudies = news.userstudies.split(",").map(function(x){return parseInt(x);});
        res.json(500, {status: 'failure',
          message: 'Diese News konnte nicht gelöscht werden, da sie zurzeit von mindestens einer Nutzerstudie ' +
          'verwendet wird.',
          userstudies: news.userstudies});
        return next();
      }
    }
  });
};


module.exports.getNewsById = function (req, res, next) {
  News.getNewsById(req.params.id, function (err, result) {
    if (err) {
      res.json(500, {status: 'failure', message: 'Server Fehler.', internal: err});
      return next();
    } else if (result.length === 0) {
      res.json({status: 'failure', message: 'Diese News existiert nicht.'});
      return next();
    } else {
      var news = result[0];
      if (news.userstudies === null) {
        news.userstudies = [];
      } else {
        news.userstudies = news.userstudies.split(",").map(function(x){return parseInt(x);});
      }

      res.json({news: news});
      return next();
    }
  });
};

module.exports.allNews = function (req, res, next) {
  News.getAllNews(function (err, list) {
    if (err) {
      res.json(500, {status: 'failure', message: 'Server Fehler.', internal: err});
      return next();
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
          return next();
        } else {
          res.json({news: list});
          return next();
        }
      });
    }
  });
};



