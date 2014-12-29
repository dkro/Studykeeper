StudyManager.Router.map(function() {
  this.route('login', { path: '/' });
  this.route('signup');
  this.route('acc-config');
  this.route('logout');
  this.resource('dashboard');
  this.resource('studies');
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
  setupController: function(controller) {
    // reset properties so that old states are not shown by transitioning to this route
    controller.reset();
  }
});

StudyManager.DashboardRoute = StudyManager.AuthenticationRoute.extend({
  model: function() {
      return Ember.RSVP.hash({
        searchTags: this.store.findAll('searchOption'),
        registeredStudies: this.store.findAll('study'),
        createdStudies: this.store.findAll('study'),
        news: this.store.findAll('dashboardNews'),
        history: this.store.findAll('study')
      });
  },

  setupController: function(controller, model) {
    // needed so that the search form component can operate only on string arrays
    var transformedTags = model.searchTags.map(function (item) {
      return item.get('name');
    });

    controller.set('searchTags', transformedTags);
    controller.set('model', model);
  }
});

StudyManager.StudiesRoute = StudyManager.AuthenticationRoute.extend({
  model: function() {
    return this.store.find('study');
  }
});

