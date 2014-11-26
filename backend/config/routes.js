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

  app.get('/user/all', userController.getUsers);

  // Protected Routes
  app.get('/user/dav', auth.authenticate, userController.test);

  app.get('user/cha', passport.authenticate('bearer', {session:false}), function(req, res){
    res.json({ username: req.user.username, email: req.user.email });
  });

}