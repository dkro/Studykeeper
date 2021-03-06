"use strict";
// Server libraries
var restify             = require('restify');

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

  // All routes are mapped to frontend/public except for /api/* routes
  // This supplies the static content of the frontend.
  // This also means all new routes need to be added with a /api/* prefix!!!
  app.get(/^\/(?!api).*/, restify.serveStatic({
    'directory': '../frontend/public/',
    'default' : 'index.html'
  }));

  // --------------- 404 ---------------
  app.on('ResourceNotFound', function (req, res, next) {
    res.header('Location', '/#/notfound');
    res.send(302);
    next();
  });

  app.on('NotFound', function (req, res, next) {
    res.header('Location', '/#/notfound');
    res.send(302);
    next();
  });

  // --------------- Public routes ---------------
  app.post('/api/users/signup', userController.signup);
  app.post('/api/users/confirm/:hash', userController.confirmUser);
  app.post('/api/users/recovery', userController.recoverPasswordRequest);
  app.post('/api/users/recover/:hash', userController.recoverPasswordAction);
  app.get('/api/studypublics/:id', userStudyController.getPublicUserstudyById);

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
  app.get('/api/userstudies', auth.tokenAuthenticate, auth.requiresRole(['tutor', 'executor', 'participant']), userStudyController.allUserstudies);
  app.get('/api/userstudies/:id', auth.tokenAuthenticate, auth.requiresRole(['tutor', 'executor', 'participant']), userStudyController.getUserstudyById);

  app.post('/api/userstudies',  auth.tokenAuthenticate, auth.requiresRole(['tutor']), userStudyController.createUserstudy);
  app.del('/api/userstudies/:id', auth.tokenAuthenticate, auth.requiresRole(['tutor']), userStudyController.deleteUserstudy);
  app.put('/api/userstudies/:id', auth.tokenAuthenticate, auth.requiresRole(['tutor', 'executor']), userStudyController.editUserstudy);
  app.post('/api/userstudies/:id/publish',  auth.tokenAuthenticate, auth.requiresRole(['tutor']), userStudyController.publishUserstudy);
  app.post('/api/userstudies/:id/close',  auth.tokenAuthenticate, auth.requiresRole(['tutor','executor']), userStudyController.closeUserstudy);

  app.post('/api/userstudies/:studyId/register/:id',  auth.tokenAuthenticate, auth.requiresRole(['self']), userStudyController.registerUserToStudy);
  app.post('/api/userstudies/:studyId/signoff/:id',  auth.tokenAuthenticate, auth.requiresRole(['self']), userStudyController.signoff);

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

};
