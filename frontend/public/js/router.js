StudyManager.Router.map(function() {
  this.route('login', { path: '/' });
  this.route('signup');
  this.route('acc-config');
  this.route('logout');
  this.route('user');
  this.route('studiesList');
});

StudyManager.AuthenticationRoute = Ember.Route.extend({
  actions: {
    error: function(error, transition) {
      if (error.status === 401) {
        this.redirectToLogin(transition);
      }
    }
  },

  beforeModel: function(transition) {
    if (!this.controllerFor('login').get('token')) {
      this.redirectToLogin(transition);
    }
  },

  redirectToLogin: function(transition) {
    this.controllerFor('login').set('errorMessage', 'You must be logged in to view that page.');
    this.controllerFor('login').set('attemptedTransition', transition);
    this.transitionToRoute('login');
  }
});


StudyManager.LoginRoute = Ember.Route.extend({
  setupController: function(controller) {
    controller.reset();
  }
});

StudyManager.SignupRoute = Ember.Route.extend({
  setupController: function(controller) {
    // reset properties so that old states are not shown by transitioning to this route
    controller.reset();
  }
});

StudyManager.AccConfigRoute = StudyManager.AuthenticationRoute.extend({

});

StudyManager.UserRoute = StudyManager.AuthenticationRoute.extend({
});

StudyManager.StudiesListRoute = StudyManager.AuthenticationRoute.extend({
  model: function() {
    return this.ApplicationStore.find('study-minimal');
  }
});


