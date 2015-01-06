"use strict";
var Template         = require('../models/templates');
var Promise          = require('es6-promise').Promise;
var UserstudyPromise = require('./promises/userstudyPromises');
var TemplatePromise  = require('./promises/templatePromises');


module.exports.createTemplate = function(req, res){
  var template;
  TemplatePromise.validFullTemplateReq(req)
    .then(function(result){
      template = result;
      return TemplatePromise.templateAvailable(template);
    })
    .then(function(){
      Template.addTemplate(template, function(err){
        if (err) {
          throw err;
        } else {
          res.json({status: 'success', message: 'Template created.', template: template});
        }
      });
    })
    .catch(function(err){
      res.json(500, {status: 'failure', errors: err});
    });
};