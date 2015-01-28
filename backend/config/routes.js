"use strict";
// Server libraries
var restify             = require('restify');
var path                = require('path');

// Authentication libraries
var passport            = require('passport');
var auth                = require('./auth');

// controllers
var userController      = require('../controllers/users');
var userStudyController = require('../controllers/userstudies');
var labelController     = require('../controllers/labels');
var templateController  = require('../controllers/templates');
var newsfeedController  = require('../controllers/news');

module.exports = function(app) {

  app.use(passport.initialize());
  // todo remove this... this is a hack for Ama to be able to use the backend from windows
  app.use(restify.CORS());
  app.use(restify.fullResponse());
  restify.CORS.ALLOW_HEADERS.push('authorization');

  var directory = path.resolve('../frontend/public/');
  // All routes are mapped to frontend/public except for /api/* routes
  // This supplies the static content of the frontend.
  // This also means all new routes need to be added with a /api/* prefix!!!
  app.get(/^\/(?!api).*/, restify.serveStatic({
    'directory': directory,
    'default' : 'index.html'
  }));

  // --------------- Public routes ---------------
  app.post('/api/users/signup', userController.signup);
  app.post('/api/users/retrievePassword', userController.retrievePW);
  app.get('/api/userstudiesp/:id', userStudyController.getPublicUserstudyById);


  // --------------- Login routes ---------------
  app.post('/api/users/login', auth.loginAuthenticate, userController.login);
  app.post('/api/users/logout', auth.tokenAuthenticate, userController.logout);
  app.post('/api/users/changePassword', auth.tokenAuthenticate, userController.changePW);

  // --------------- User routes ---------------
  app.get('/api/users', userController.getUsers);
  app.get('/api/users/:id', userController.getUserById);

  app.post('/api/users', userController.createUser);
  app.del('/api/users/:id', userController.deleteUser);

  // --------------- Userstudy routes ---------------
  app.get('/api/userstudies', userStudyController.allUserstudies); //todo filtering on userbase
  app.get('/api/userstudies/:id', userStudyController.getUserstudyById); //
  app.get('/api/userstudies/all', userStudyController.allUserstudiesFilteredForUser);
  //app.get('/api/userstudies/created', userStudyController.allUserstudiesCreatedByUser);

  app.post('/api/userstudies',  userStudyController.createUserstudy);
  app.del('/api/userstudies/:id', userStudyController.deleteUserstudy);
  app.put('/api/userstudies/:id', userStudyController.editUserstudy);
  app.post('/api/userstudies/:id/publish',  userStudyController.publishUserstudy);
  app.post('/api/userstudies/:id/close',  userStudyController.closeUserstudy);

  app.post('/api/userstudies/:id/register',  userStudyController.registerUserToStudy);
  app.post('/api/userstudies/:id/signoff',  userStudyController.removeUserFromStudy);
  app.post('/api/userstudies/:id/confirm/:userId',  userStudyController.confirmUserParticipation);

  // --------------- Label routes ---------------
  app.get('/api/labels', labelController.allLabels);
  app.get('/api/labels/:id', labelController.getLabelById);

  app.post('/api/labels', labelController.createLabel);
  app.del('/api/labels/:id', labelController.deleteLabel); // todo make it only possible to delete when its not mapped

  // --------------- Newsfeed routes ---------------
  app.get('/api/news', newsfeedController.allNews);
  app.get('/api/news/:id', newsfeedController.getNewsById);

  app.post('/api/news', newsfeedController.createNews);
  app.del('/api/news/:id', newsfeedController.deleteNews); // todo make it only possible to delete when its not mapped
  app.put('/api/news/edit', newsfeedController.editNews);

  // --------------- Templates routes ---------------
  app.get('/api/templates', templateController.allTemplates);
  app.get('/api/templates/:id', templateController.getTemplateById);

  app.post('/api/templates', templateController.createTemplate);
  app.del('/api/templates/:id', templateController.deleteTemplate); // todo make it only possible to delete when its not mapped
  app.put('/api/templates/:id', templateController.editTemplate);

  // Mails
  // tutore sind sueradmins. Mails enden bei loeschen von nutzerstudien

};
