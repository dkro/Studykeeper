StudyManager.Router.map(function() {
  // TODO: Change this!
  this.route('login', { path: '/' });
  this.route('sign-up');
  this.route('acc-config');
  this.route('logout');
  this.route('user');
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
    this.transitionTo('login');
  }
});


StudyManager.LoginRoute = Ember.Route.extend({
  setupController: function(controller) {
    controller.reset();
  }
});

StudyManager.SignUpRoute = Ember.Route.extend({

});

StudyManager.AccConfigRoute = Ember.Route.extend({

});

StudyManager.UserRoute = Ember.Route.extend({
  /*model: function () {
    return this.store.find('SearchOption');
  },

  setupController: function(controller, model){
    this._super(controller, model);
    controller.set('allOptions', this.store.find('SearchOption'));
  }*/
});


