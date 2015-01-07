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
//var newsfeedController  = require('../controllers/newsfeed');
var templateController  = require('../controllers/templates');

module.exports = function(app) {

  app.use(passport.initialize());
  // todo remove this... this is a hack for Ama to be able to use the backend from windows
  app.use(restify.CORS());
  app.use(restify.fullResponse());

  var directory = path.resolve('./frontend/public/');
  // All routes are mapped to frontend/public except for /api/* routes
  // This supplies the static content of the frontend.
  // This also means all new routes need to be added with a /api/* prefix!!!
  app.get(/^\/(?!api).*/, restify.serveStatic({
    'directory': directory,
    'default' : 'index.html'
  }));

  // --------------- Public routes ---------------
  app.post('/api/user/signup', userController.signup);
  app.post('/api/user/retrievePassword', userController.retrievePW);


  // --------------- User routes ---------------
  //app.get('/api/user/single', auth.tokenAuthenticate, userController.getUser); // todo make this work with query
  app.get('/api/user/all', auth.tokenAuthenticate, userController.getUsers);
  //app.get('/api/user/allTutors', auth.tokenAuthenticate, userController.getUsers);
  //app.get('/api/user/allExecutors', auth.tokenAuthenticate, userController.getUsers);

  app.post('/api/user/login', auth.loginAuthenticate, userController.login);
  app.post('/api/user/logout', auth.tokenAuthenticate, userController.logout);
  app.post('/api/user/changePassword', auth.tokenAuthenticate, userController.changePW);
  app.post('/api/user/create', auth.tokenAuthenticate, auth.requiresRole('tutor'), userController.createUser);
  app.post('/api/user/delete', auth.tokenAuthenticate, auth.requiresRole('admin'), userController.deleteUser);


  // --------------- Userstudy routes ---------------
  //app.get('/api/userstudy/single', userStudyController.getUserstudy); // todo add newsfeed and label to these
  app.get('/api/userstudy/all', userStudyController.allUserstudies); // todo also add templates mapped to these
  //app.get('/api/userstudy/allFilteredForUser', userStudyController.allUserstudiesFilteredForUser);
  app.get('/api/userstudy/registeredUsers', userStudyController.usersRegisteredToStudy);

  app.post('/api/userstudy/allFiltered', userStudyController.allUserstudiesFiltered);
  app.post('/api/userstudy/create',  userStudyController.createUserstudy);
  app.post('/api/userstudy/edit', userStudyController.editUserstudy);
  app.post('/api/userstudy/delete', userStudyController.deleteUserstudy);
  app.post('/api/userstudy/publish',  userStudyController.publishUserstudy);
  app.post('/api/userstudy/registerUser',  userStudyController.registerUserToStudy);
  app.post('/api/userstudy/removeUser',  userStudyController.removeUserFromStudy);
  app.post('/api/userstudy/confirmUserParticipation',  userStudyController.confirmUserParticipation);
  app.post('/api/userstudy/close',  userStudyController.closeUserstudy);


  // --------------- Label routes ---------------
  app.get('/api/label/all', labelController.allLabels);

  app.post('/api/label/create', labelController.createLabel);
  app.post('/api/userstudy/addLabel',  labelController.addLabeltoUserstudy);


  // --------------- Newsfeed routes ---------------
  //app.get('/api/newsfeed/all, newsfeedController.all);

  //app.post('/api/newsfeed/create', newsfeedController.createNews);
  //app.post('/api/newsfeed/delete', newsfeedController.deleteNews);
  //app.post('/api/newsfeed/edit', newsfeedController.editNews);
  //app.post('/api/userstudy/addNews', newsfeedController.allNewsToUserstudy);


  // --------------- Templates routes ---------------
  //app.get('/api/template/all', templateController.all)

  app.post('/api/template/createTemplate', templateController.createTemplate);
  app.post('/api/template/deleteTemplate', templateController.deleteTemplate);
  //app.post('/api/template/edit', templateController.editTemplate);
  //app.post('/api/userstudy/addTemplate', templateController.addTemplateToUserstudy);

  // Mails
  // tutore sind sueradmins. Mails enden bei loeschen von nutzerstudien

};
