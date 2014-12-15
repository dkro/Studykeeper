var restify        = require('restify');
var auth           = require('./auth');
// TODO require all controller here
var userController = require('../controllers/users');
var passport       = require('passport');
var path           = require('path');

module.exports = function(app) {

  app.use(passport.initialize());

  // Basic Routes
  var directory = path.resolve('./frontend/public/');
  // All routes mapped to frontend/publich except for /api/* routes
  app.get(/^\/(?!api).*/, restify.serveStatic({
    'directory': directory,
    'default' : 'index.html'
  }));

  app.post('/api/user/signup', userController.signup);

  app.post('/api/user/retrievePassword', userController.retrievePW);

  // Protected Routes (All Roles)
  app.post('/api/user/login', auth.loginAuthenticate, userController.login);

  app.post('/api/user/logout', auth.tokenAuthenticate, userController.logout);

  app.post('/api/user/changePassword', auth.tokenAuthenticate, userController.changePW);

  app.get('/api/user/all', userController.getUsers);

  app.get('/api/user/test', auth.tokenAuthenticate, auth.requiresRole('executor'), userController.getUsers);

  app.post('/api/user/create', auth.tokenAuthenticate, auth.requiresRole('tutor'), userController.createUser);

  app.post('/api/user/delete', auth.tokenAuthenticate, auth.requiresRole('admin'), userController.deleteUser);
  // Tutor Routes


  // Creator Routes


  // Participant Routes


  // Super-Admin Routes

};