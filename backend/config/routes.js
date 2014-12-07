var auth           = require('./auth');
// TODO require all controller here
var userController = require('../controllers/users');
var passport = require('passport');

module.exports = function(app) {

  app.use(passport.initialize());

  // Basic Routes
  app.get('/', function(req, res){
    res.json({ 'message' : 'Bow Wow'});
  });

  app.post('/api/user/signup', userController.signup);

  app.post('/api/user/retrievePassword', userController.retrievePW);

  // Protected Routes (All Roles)
  app.post('/api/user/login', auth.loginAuthenticate, userController.login);

  app.post('/api/user/logout', auth.tokenAuthenticate, userController.logout);

  app.post('/api/user/changePassword', auth.tokenAuthenticate, userController.changePW);

  app.get('/api/user/all', userController.getUsers);

  app.get('/api/user/test', auth.tokenAuthenticate, auth.requiresRole('executor'), userController.getUsers);

  app.post('/api/user/add', auth.tokenAuthenticate, auth.requiresRole('tutor'), userController.addUser);
  // Tutor Routes


  // Creator Routes


  // Participant Routes


  // Super-Admin Routes

};