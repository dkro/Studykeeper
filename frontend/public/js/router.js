StudyManager.Router.map(function() {
  this.route('login', { path: '/' });
  this.route('signup');
  this.route('acc-config');
  this.route('logout');
  this.resource('dashboard');
  this.resource('userstudies');
  this.resource('userstudy', { path: '/userstudy/:userstudy_id' });
  this.resource('labels');
  this.resource('users');
  this.resource('user', { path: '/users/:user_id' });
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
  model: function() {
    return this.store.find('user', 1);
  },

  setupController: function(controller, model) {
    // reset properties so that old states are not shown by transitioning to this route
    controller.reset();
    controller.set('model', model);
  }
});

StudyManager.DashboardRoute = StudyManager.AuthenticationRoute.extend({
  model: function() {
    var uId = this.controllerFor('login').get('currentUserId');
    var that = this;

    return this.store.find('user', uId).then(function(user) {
      return Ember.RSVP.hash({
        searchTags: that.store.find('label'),
        registeredStudies: user.get('futureRegisteredStudies'),
        createdStudies: user.get('isExecutorFor'),
        history: user.get('studyHistory'),
        mmiPoints: user.get('mmi'),
        news: that.store.find('news')
      });
    });
  },

  setupController: function(controller, model) {
    // needed so that the search form component can operate only on string arrays
    var transformedTags = model.searchTags.map(function (item) {
      return item.get('title');
    });

    controller.set('searchTags', transformedTags);
    controller.set('model', model);
  }
});

StudyManager.UserstudiesRoute = StudyManager.AuthenticationRoute.extend({
  model: function() {
    return this.store.find('userstudy');
  }
});

StudyManager.UserstudyRoute = StudyManager.AuthenticationRoute.extend({
  model: function() {
    return this.store.find('userstudy', params.userstudy_id);
  }
});

StudyManager.LabelsRoute = StudyManager.AuthenticationRoute.extend({
  model: function() {
    return this.store.find('label');
  }
});

StudyManager.UsersRoute = StudyManager.AuthenticationRoute.extend({
  model: function() {
    return this.store.find('user');
  }
});

StudyManager.UserRoute = StudyManager.AuthenticationRoute.extend({
  model: function(params) {
    return this.store.find('user', params.user_id);
  }
});

