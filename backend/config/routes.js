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

  // Protected Routes (All Roles)
  app.post('/api/user/login', auth.loginAuthenticate, userController.login);

  app.get('/api/user/all', userController.getUsers);

  app.get('/api/user/test', auth.tokenAuthenticate, userController.getUsers);

  app.post('/api/user/add', auth.tokenAuthenticate, auth.requiresRole('tutor'), userController.addUser);
  // Tutor Routes


  // Creator Routes


  // Participant Routes


  // Super-Admin Routes

};