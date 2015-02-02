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
  app.post('/api/users/:id/changePassword', auth.tokenAuthenticate, auth.requiresRole(['self']), userController.changePW);

  // --------------- User routes ---------------
  app.get('/api/users', auth.tokenAuthenticate, auth.requiresRole(['tutor', 'executor', 'participant']), userController.getUsers);
  app.get('/api/users/:id', auth.tokenAuthenticate, auth.requiresRole(['tutor', 'executor', 'participant']), userController.getUserById);

  app.post('/api/users', auth.tokenAuthenticate, auth.requiresRole(['tutor']), userController.createUser);
  app.put('/api/users/:id', auth.tokenAuthenticate, auth.requiresRole(['tutor']), userController.editUser);
  app.del('/api/users/:id', auth.tokenAuthenticate, auth.requiresRole(['tutor']), userController.deleteUser);

  // --------------- Userstudy routes ---------------
  app.get('/api/userstudies', auth.tokenAuthenticate, auth.requiresRole(['tutor', 'executor', 'participant']), userStudyController.allUserstudies); //todo filtering on userbase
  app.get('/api/userstudies/:id', auth.tokenAuthenticate, auth.requiresRole(['tutor', 'executor', 'participant']), userStudyController.getUserstudyById); //
  app.get('/api/userstudies/all', auth.tokenAuthenticate, auth.requiresRole(['tutor']), userStudyController.allUserstudiesFilteredForUser);
  //app.get('/api/userstudies/created', userStudyController.allUserstudiesCreatedByUser);

  app.post('/api/userstudies',  auth.tokenAuthenticate, auth.requiresRole(['tutor']), userStudyController.createUserstudy);
  app.del('/api/userstudies/:id', auth.tokenAuthenticate, auth.requiresRole(['tutor']), userStudyController.deleteUserstudy);
  app.put('/api/userstudies/:id', auth.tokenAuthenticate, auth.requiresRole(['tutor', 'executor']), userStudyController.editUserstudy);
  app.post('/api/userstudies/:id/publish',  auth.tokenAuthenticate, auth.requiresRole(['tutor', 'executor']), userStudyController.publishUserstudy);
  app.post('/api/userstudies/:id/close',  auth.tokenAuthenticate, auth.requiresRole(['tutor']), userStudyController.closeUserstudy);

  app.post('/api/userstudies/:id/register',  auth.tokenAuthenticate, auth.requiresRole(['tutor', 'executor', 'participant']), userStudyController.registerUserToStudy);
  app.post('/api/userstudies/:id/signoff',  auth.tokenAuthenticate, auth.requiresRole(['tutor', 'executor', 'participant']), userStudyController.removeUserFromStudy);
  app.post('/api/userstudies/:id/confirm/:userId',  auth.tokenAuthenticate, auth.requiresRole(['executor']), userStudyController.confirmUserParticipation);

  // --------------- Label routes ---------------
  app.get('/api/labels', auth.tokenAuthenticate, auth.requiresRole(['tutor', 'executor', 'participant']), labelController.allLabels);
  app.get('/api/labels/:id', auth.tokenAuthenticate, auth.requiresRole(['tutor', 'executor', 'participant']), labelController.getLabelById);

  app.post('/api/labels', auth.tokenAuthenticate, auth.requiresRole(['tutor']), labelController.createLabel);
  app.del('/api/labels/:id', auth.tokenAuthenticate, auth.requiresRole(['tutor']), labelController.deleteLabel);

  // --------------- Newsfeed routes ---------------
  app.get('/api/news', auth.tokenAuthenticate, auth.requiresRole(['tutor', 'executor', 'participant']), newsfeedController.allNews);
  app.get('/api/news/:id', auth.tokenAuthenticate, auth.requiresRole(['tutor', 'executor', 'participant']), newsfeedController.getNewsById);

  app.post('/api/news', auth.tokenAuthenticate, auth.requiresRole(['tutor']), newsfeedController.createNews);
  app.del('/api/news/:id', auth.tokenAuthenticate, auth.requiresRole(['tutor']), newsfeedController.deleteNews);
  app.put('/api/news/:id', auth.tokenAuthenticate, auth.requiresRole(['tutor']), newsfeedController.editNews);

  // --------------- Templates routes ---------------
  app.get('/api/templates', auth.tokenAuthenticate, auth.requiresRole(['tutor', 'executor', 'participant']), templateController.allTemplates);
  app.get('/api/templates/:id', auth.tokenAuthenticate, auth.requiresRole(['tutor', 'executor', 'participant']), templateController.getTemplateById);

  app.post('/api/templates', auth.tokenAuthenticate, auth.requiresRole(['tutor']), templateController.createTemplate);
  app.del('/api/templates/:id', auth.tokenAuthenticate, auth.requiresRole(['tutor']), templateController.deleteTemplate);
  app.put('/api/templates/:id', auth.tokenAuthenticate, auth.requiresRole(['tutor']), templateController.editTemplate);

  // Mails
  // tutore sind sueradmins. Mails enden bei loeschen von nutzerstudien

};
