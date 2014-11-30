var auth           = require('./auth');
// TODO require all user controller here
var userController = require('../controllers/users');
var passport = require('passport');

module.exports = function(app) {

  app.use(passport.initialize());

  // Basic Routes
  app.get('/', function(req, res){
    res.json({ 'message' : 'Bow Wow'});
  });

  // Protected Routes (All Roles)
  app.post('/api/login', auth.loginAuthenticate, userController.test);

  app.get('/api/user/all', userController.getUsers);

  app.get('/api/user/dav', auth.tokenAuthenticate, userController.test);

  //app.post('/api/signup');
  // Tutor Routes


  // Creator Routes


  // Participant Routes


  // Super-Admin Routes

};