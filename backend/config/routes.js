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
  app.get('/api/users', auth.tokenAuthenticate, auth.requiresRole(['tutor']), userController.getUsers);
  app.get('/api/users/:id', auth.tokenAuthenticate, userController.getUserById);

  app.post('/api/users', auth.tokenAuthenticate, userController.createUser);
  app.put('/api/users/:id', auth.tokenAuthenticate, userController.editUser);
  app.del('/api/users/:id', auth.tokenAuthenticate, userController.deleteUser);

  // --------------- Userstudy routes ---------------
  app.get('/api/userstudies', auth.tokenAuthenticate, userStudyController.allUserstudies); //todo filtering on userbase
  app.get('/api/userstudies/:id', auth.tokenAuthenticate, userStudyController.getUserstudyById); //
  app.get('/api/userstudies/all', auth.tokenAuthenticate, userStudyController.allUserstudiesFilteredForUser);
  //app.get('/api/userstudies/created', userStudyController.allUserstudiesCreatedByUser);

  app.post('/api/userstudies',  auth.tokenAuthenticate, userStudyController.createUserstudy);
  app.del('/api/userstudies/:id', auth.tokenAuthenticate, userStudyController.deleteUserstudy);
  app.put('/api/userstudies/:id', auth.tokenAuthenticate, userStudyController.editUserstudy);
  app.post('/api/userstudies/:id/publish',  auth.tokenAuthenticate, userStudyController.publishUserstudy);
  app.post('/api/userstudies/:id/close',  auth.tokenAuthenticate, userStudyController.closeUserstudy);

  app.post('/api/userstudies/:id/register',  auth.tokenAuthenticate, userStudyController.registerUserToStudy);
  app.post('/api/userstudies/:id/signoff',  auth.tokenAuthenticate, userStudyController.removeUserFromStudy);
  app.post('/api/userstudies/:id/confirm/:userId',  auth.tokenAuthenticate, userStudyController.confirmUserParticipation);

  // --------------- Label routes ---------------
  app.get('/api/labels', auth.tokenAuthenticate, labelController.allLabels);
  app.get('/api/labels/:id', auth.tokenAuthenticate, labelController.getLabelById);

  app.post('/api/labels', auth.tokenAuthenticate, labelController.createLabel);
  app.del('/api/labels/:id', auth.tokenAuthenticate, labelController.deleteLabel); // todo make it only possible to delete when its not mapped

  // --------------- Newsfeed routes ---------------
  app.get('/api/news', auth.tokenAuthenticate, newsfeedController.allNews);
  app.get('/api/news/:id', auth.tokenAuthenticate, newsfeedController.getNewsById);

  app.post('/api/news', auth.tokenAuthenticate, newsfeedController.createNews);
  app.del('/api/news/:id', auth.tokenAuthenticate, newsfeedController.deleteNews); // todo make it only possible to delete when its not mapped
  app.put('/api/news/edit', auth.tokenAuthenticate, newsfeedController.editNews);

  // --------------- Templates routes ---------------
  app.get('/api/templates', auth.tokenAuthenticate, templateController.allTemplates);
  app.get('/api/templates/:id', auth.tokenAuthenticate, templateController.getTemplateById);

  app.post('/api/templates', auth.tokenAuthenticate, templateController.createTemplate);
  app.del('/api/templates/:id', auth.tokenAuthenticate, templateController.deleteTemplate); // todo make it only possible to delete when its not mapped
  app.put('/api/templates/:id', auth.tokenAuthenticate, templateController.editTemplate);

  // Mails
  // tutore sind sueradmins. Mails enden bei loeschen von nutzerstudien

};
