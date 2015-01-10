"use strict";
var News        = require('../models/news');
var Promise      = require('es6-promise').Promise;
var UserstudyPromise = require('./promises/userstudyPromises');
var NewsPromise = require('./promises/newsPromises');


module.exports.createNews = function(req, res){

  NewsPromise.validFullNewsReq(req,false)
    .then(function(news){
      News.addNews(news, function(err){
        if (err) {
          throw err;
        } else {
          res.json({status: 'success', message: 'News created', news: news});
        }
      });
    })
    .catch(function(err){
      res.json(500, {status: 'failure', errors: err});
    });
};

module.exports.editNews = function(req, res){
 var news;
 NewsPromise.validFullNewsReq(req,true)
  .then(function(result){
     news = result;
     return NewsPromise.newsExists(news);
  })
  .then(function(){
      News.editNews(news, function(err){
        if (err) {
          throw err;
        } else {
          res.json({status: 'success', message: 'News edited', news: news});
        }
      });
  })
  .catch(function(err){
    res.json(500, {status: 'failure', errors: err});
  });
};


module.exports.getNewsById = function(req, res){
  News.getNewsById(req.params.id, function(err,result){
    if (err) {
      res.json(500, {status: 'failure', errors: err});
    } else if (result.length === 0 ){
      res.jon({status: 'failure', errors: [{message: 'Label not found'}]});
    } else {
      res.json(result);
    }
  });
};

module.exports.allNews = function(req, res){
  News.getAllNews(function(err, list){
    if (err){
      res.json(500,{status: 'failure', errors: {message: 'Internal error, please try again.'}});
    } else {
      res.json({news: list});
    }
  });
};

module.exports.addNewstoUserstudy = function(req, res){
  var validationPromises = [UserstudyPromise.validUserstudyReq(req), NewsPromise.validNewsReq(req)];

  Promise.all(validationPromises).then(function(results){
    var userstudy = results[0];
    var news = results[1];

    var existencePromises = [UserstudyPromise.userstudyExists(userstudy), NewsPromise.newsExists(news)];

    Promise.all(existencePromises).then(function(){
      News.mapNewstoUserstudy(news, userstudy, function(err){
        if (err) {
          throw err;
        } else {
          res.json({status: 'success', message: 'News added to userstudy', news: news, usertudy: userstudy});
        }
      });
    })
    .catch(function(err){
      res.json(500, {status: 'failure', errors: err});
    });
  })
  .catch(function(err){
    res.json(500, {status: 'failure', errors: err});
  });
};


