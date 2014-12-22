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

module.exports = function(app) {

  app.use(passport.initialize());
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
  app.get('/api/user/test', userController.getUsers);
  app.get('/api/user/single', auth.tokenAuthenticate, userController.getUser);
  app.get('/api/user/all', auth.tokenAuthenticate, userController.getUsers);

  app.post('/api/user/login', auth.loginAuthenticate, userController.login);
  app.post('/api/user/logout', auth.tokenAuthenticate, userController.logout);
  app.post('/api/user/changePassword', auth.tokenAuthenticate, userController.changePW);
  app.post('/api/user/create', auth.tokenAuthenticate, auth.requiresRole('tutor'), userController.createUser);
  app.post('/api/user/delete', auth.tokenAuthenticate, auth.requiresRole('admin'), userController.deleteUser);


  // --------------- Userstudy routes ---------------
  app.get('/api/userstudy/test', userStudyController.allUserstudies);
  app.get('/api/userstudy/single', auth.tokenAuthenticate, userStudyController.getUserstudy);
  app.get('/api/userstudy/all', auth.tokenAuthenticate, userStudyController.allUserstudies);
//auth.tokenAuthenticate, auth.requiresRole('tutor'),
  app.post('/api/userstudy/create',  userStudyController.createUserstudy);
  app.post('/api/userstudy/delete', auth.tokenAuthenticate, auth.requiresRole('admin'), userStudyController.deleteUserstudy);
  app.post('/api/userstudy/edit', auth.tokenAuthenticate, auth.requiresRole('tutor'), userStudyController.editUserstudy);


  // --------------- Templates routes ---------------


};