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


  // --------------- Login routes ---------------
  app.post('/api/users/login', auth.loginAuthenticate, userController.login);


  // --------------- User routes ---------------
  //app.get('/api/users/single', auth.tokenAuthenticate, userController.getUser); // todo make this work with query
  app.get('/api/users', userController.getUsers);
  app.get('/api/users/:id', userController.getUserById);
  app.get('/api/users/self', userController.getUser);

  //app.get('/api/users/allTutors', auth.tokenAuthenticate, userController.getUsers);
  //app.get('/api/users/allExecutors', auth.tokenAuthenticate, userController.getUsers);

  app.post('/api/users/logout', auth.tokenAuthenticate, userController.logout);
  app.post('/api/users/changePassword', auth.tokenAuthenticate, userController.changePW);
  app.post('/api/users/create', auth.tokenAuthenticate, auth.requiresRole('tutor'), userController.createUser);
  app.post('/api/users/delete', auth.tokenAuthenticate, auth.requiresRole('admin'), userController.deleteUser);


  // --------------- Userstudy routes ---------------
  //app.get('/api/userstudies/single', userStudyController.getUserstudy); // todo add newsfeed and label to these
  app.get('/api/userstudies', userStudyController.allUserstudies); // todo also add templates mapped to these
  app.get('/api/userstudies/:id', userStudyController.getUserstudyById);
  //app.get('/api/userstudies/allFilteredForUser', userStudyController.allUserstudiesFilteredForUser);
  app.get('/api/userstudies/registeredUsers', userStudyController.usersRegisteredToStudy);
  app.get('/api/userstudies/current', userStudyController.allUserstudiesCurrentForUser);
  app.get('/api/userstudies/history', userStudyController.allUserstudiesHistoryForUser);
  app.get('/api/userstudies/created', userStudyController.allUserstudiesCreatedByUser);

  app.post('/api/userstudies/allFiltered', userStudyController.allUserstudiesFiltered); // todo this get with query params
  app.post('/api/userstudies/create',  userStudyController.createUserstudy);
  app.post('/api/userstudies/edit', userStudyController.editUserstudy);
  app.post('/api/userstudies/delete', userStudyController.deleteUserstudy);
  app.post('/api/userstudies/publish',  userStudyController.publishUserstudy);
  app.post('/api/userstudies/registerUser',  userStudyController.registerUserToStudy);
  app.post('/api/userstudies/removeUser',  userStudyController.removeUserFromStudy);
  app.post('/api/userstudies/confirmUserParticipation',  userStudyController.confirmUserParticipation);
  app.post('/api/userstudies/close',  userStudyController.closeUserstudy);
  app.post('/api/userstudies/addNews', newsfeedController.addNewstoUserstudy);
  app.post('/api/userstudies/addLabel',  labelController.addLabeltoUserstudy);


  // --------------- Label routes ---------------
  app.get('/api/labels', labelController.allLabels);
  app.get('/api/labels/:id', labelController.getLabelById);

  app.put('/api/labels', labelController.createLabel);
  app.del('/api/labels/:id', labelController.deleteLabel);


  // --------------- Newsfeed routes ---------------
  app.get('/api/news', newsfeedController.allNews);
  app.get('/api/news/:id', newsfeedController.getNewsById);

  app.put('/api/news', newsfeedController.createNews);
  //app.del('/api/news', newsfeedController.deleteNews);
  app.post('/api/news/edit', newsfeedController.editNews);


  // --------------- Templates routes ---------------
  app.get('/api/templates', templateController.allTemplates); //todo smarter query results

  app.post('/api/templates/createTemplate', templateController.createTemplate);
  app.post('/api/templates/deleteTemplate', templateController.deleteTemplate);
  //app.post('/api/template/edit', templateController.editTemplate);
  //app.post('/api/userstudy/addTemplate', templateController.addTemplateToUserstudy);

  // Mails
  // tutore sind sueradmins. Mails enden bei loeschen von nutzerstudien

};
