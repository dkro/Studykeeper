StudyManager.Router.map(function() {
  this.route('login', { path: '/' });
  this.route('signup');
  this.route('password-recovery', { path: '/passwordRecovery' });
  this.route('acc-config', { path: '/account' });
  this.route('about');
  this.route('logout');
  this.resource('dashboard');
  this.resource('userstudies');
  this.resource('userstudy', { path: '/userstudies/:userstudy_id' });
  this.resource('userstudy-public', { path: '/userstudies/public/:userstudy_id' });
  this.resource('userstudy-edit', { path: '/userstudies/:userstudy_id/studyEdit' });
  this.resource('userstudy-creation', { path: '/createStudy' });
  this.resource('userstudy-confirm', { path: '/userstudies/:userstudy_id/studyConfirm' });
  this.resource('labels');
  this.resource('users');
  this.resource('user', { path: '/users/:user_id' });
  this.route('user-creation', { path: '/createUser' });
  this.resource('news');
  this.resource('single-news', { path: '/news/:news_id' });
  this.route('news-creation', { path: '/createNews' });
  this.resource('templates');
  this.resource('template', { path: '/templates/:template_id' });
  this.route('template-creation', { path: '/createTemplate' });
});

StudyManager.ApplicationRoute = Ember.Route.extend({
  actions: {
    showModal: function(name, model) {
      return this.render(name, {
        into: 'application',
        outlet: 'modal',
        model: model
      });
    },

    removeModal: function() {
      return this.disconnectOutlet({
        outlet: 'modal',
        parentView: 'application'
      });
    }
  }
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
    if (Ember.empty(this.controllerFor('application').get('token'))) {
      this.redirectToLogin(transition);
    }
  },

  redirectToLogin: function(transition) {
    var that = this;

    this.controllerFor('application').resetLocalStorage();
    this.transitionTo('login').then(function () {
      that.controllerFor('login').set('statusMessage', { message: 'Sie müssen eingeloggt sein, um diese Seite sehen zu können!', isSuccess: false });
    });
  }
});


StudyManager.LoginRoute = Ember.Route.extend({
  beforeModel: function(transition) {
    if (this.controllerFor('application').get('token')) {
      this.transitionTo('dashboard');
    }
  },

  setupController: function(controller) {
    controller.reset();
  }
});

StudyManager.AboutRoute = Ember.Route.extend({
});

StudyManager.SignupRoute = Ember.Route.extend({
  setupController: function(controller) {
    // reset properties so that old states are not shown by transitioning to this route
    controller.reset();
  }
});

StudyManager.PasswordRecoveryRoute = Ember.Route.extend({
  setupController: function(controller) {
    controller.reset();
  }
});

StudyManager.AccConfigRoute = StudyManager.AuthenticationRoute.extend({
  model: function() {
    var uId = this.controllerFor('application').get('currentUserId');
    return this.store.find('user', uId);
  },

  setupController: function(controller, model) {
    // reset properties so that old states are not shown by transitioning to this route
    controller.reset();
    controller.set('model', model);
  }
});

StudyManager.DashboardRoute = StudyManager.AuthenticationRoute.extend({
  model: function() {
    var uId = this.controllerFor('application').get('currentUserId');
    var that = this;

    return this.store.find('user', uId).then(function(user) {
      return Ember.RSVP.hash({
        registeredStudies: user.get('registeredFor'),
        createdStudies: user.get('isExecutorFor'),
        mmiPoints: user.get('mmi'),
        news: that.store.find('news'),
        collectsMMI: user.get('collectsMMI')
      });
    });
  },

  setupController: function(controller, model) {
    var history = model.registeredStudies.filterBy('closed', true);
    var futureStudies = model.registeredStudies.filterBy('closed', false);

    controller.set('model', model);
    controller.set('history', history);
    controller.set('futureRegisteredStudies', futureStudies);
    controller.set('collectsMMI', model.collectsMMI);
    controller.determineInitialProperties();
  }
});

StudyManager.UserstudiesRoute = StudyManager.AuthenticationRoute.extend({
  model: function() {
    return Ember.RSVP.hash({
      searchTags: this.store.find('label'),
      studies: this.store.find('userstudy')
    });
  },

  setupController: function(controller, model) {
    // needed so that the search form component can operate only on string arrays
    var transformedTags = model.searchTags.map(function (item) {
      return item.get('title');
    });

    controller.set('model', model);
    controller.set('studiesList', model.studies);
    controller.set('searchTags', transformedTags);
    controller.reset();
  }
});

StudyManager.UserstudyRoute = StudyManager.AuthenticationRoute.extend({
  model: function(params) {
    return this.store.fetch('userstudy', params.userstudy_id);
  },

  setupController: function(controller, model) {
    controller.set('model', model);
    controller.determineNeededProperties();
  }
});

StudyManager.UserstudyPublicRoute = Ember.Route.extend({
  model: function(params) {
    var that = this;

    return this.store.fetch('studypublic', params.userstudy_id).then(function(study) {
      return study;
    }, function(error) {
      that.transitionTo('login');
    });
  },

  setupController: function(controller, model) {
    controller.set('model', model);
    controller.determineNeededProperties();
  }
});

StudyManager.UserstudyEditRoute = StudyManager.AuthenticationRoute.extend({
  model: function(params) {
    var that = this;

    return Ember.RSVP.hash({
      allNews: that.store.find('news'),
      allLabels: that.store.find('label'),
      allUsers: that.store.find('user'),
      allTemplates: that.store.find('template'),
      allStudies: that.store.find('userstudy'),
      study: that.store.find('userstudy', params.userstudy_id)
    });
  },

  setupController: function(controller, model) {
    controller.set('model', model);
    var possibleRequiredStudies = model.allStudies.filter(function (study) {
      return study.get('id') !== model.study.get('id');
    });
    controller.set('allRequiredStudies', possibleRequiredStudies);
    var allTutors = model.allUsers.filter(function(user) {
      return user.get('role') === 'tutor';
    });
    var allExecutors = model.allUsers.filter(function(user) {
      return user.get('role') === 'executor' || user.get('role') === 'tutor';
    });
    controller.set('possibleTutors', allTutors);
    controller.set('possibleExecutors', allExecutors);
    controller.determineAsyncProperties();
  }
});

StudyManager.UserstudyConfirmRoute = StudyManager.AuthenticationRoute.extend({
  model: function(params) {
    var that = this;

    return Ember.RSVP.hash({
      allUsers: that.store.find('user'),
      study: that.store.find('userstudy', params.userstudy_id)
    });
  },

  setupController: function(controller, model) {
    controller.set('model', model);
    var usersWithCompensation = [];

    model.study.get('registeredUsers').forEach(function(user, index) {
      var canGetMMI = user.get('collectsMMI');

      var userWithCompensation = {
        user: user,
        canGetMMI: canGetMMI,
        chosenCompensation: canGetMMI ? 'MMI-Punkte' : 'Amazon-Gutschein'
      };

      usersWithCompensation.pushObject(userWithCompensation);
    });

    controller.set('usersWithCompensation', usersWithCompensation);
  }
});

StudyManager.UserstudyCreationRoute = StudyManager.AuthenticationRoute.extend({
  model: function() {
    var that = this;

    return Ember.RSVP.hash({
      allNews: that.store.find('news'),
      allLabels: that.store.find('label'),
      allUsers: that.store.find('user'),
      allTemplates: that.store.find('template'),
      allStudies: that.store.find('userstudy')
    });
  },

  setupController: function(controller, model) {
    controller.set('model', model);

    var allTutors = model.allUsers.filter(function(user) {
      return user.get('role') === 'tutor';
    });
    var allExecutors = model.allUsers.filter(function(user) {
      return user.get('role') === 'executor' || user.get('role') === 'tutor';
    });
    controller.set('possibleTutors', allTutors);
    controller.set('possibleExecutors', allExecutors);
  }
});

StudyManager.LabelsRoute = StudyManager.AuthenticationRoute.extend({
  model: function() {
    return this.store.find('label');
  },

  setupController: function(controller, model) {
    var labels = this.store.filter('label', function (label) {
      return !label.get('isDirty');
    });

    controller.set('model', labels);
    controller.reset();
  },

  actions: {
    refreshLabels: function() {
      this.refresh();
    }
  }
});

StudyManager.UsersRoute = StudyManager.AuthenticationRoute.extend({
  model: function() {
    return this.store.find('user');
  },

  setupController: function(controller, model) {
    controller.set('model', model);
    controller.set('usersList', model);
    controller.reset();
  }
});

StudyManager.UserRoute = StudyManager.AuthenticationRoute.extend({
  model: function(params) {
    return this.store.fetch('user', params.user_id);
  },

  setupController: function(controller, model) {
    controller.set('model', model);
    controller.set('firstName', model.get('firstname'));
    controller.set('lastName', model.get('lastname'));
    controller.set('userName', model.get('username'));
    controller.set('mmiPoints', model.get('mmi'));
    controller.set('isMMIUser', model.get('collectsMMI'));
    controller.set('selectedRole', model.get('role'));
  }
});

StudyManager.UserCreationRoute = StudyManager.AuthenticationRoute.extend({
});

StudyManager.TemplatesRoute = StudyManager.AuthenticationRoute.extend({
  model: function() {
    return this.store.find('template');
  },

  setupController: function(controller, model) {
    controller.set('model', model);
    controller.set('templatesList', model);
    controller.reset();
  }
});

StudyManager.TemplateRoute = StudyManager.AuthenticationRoute.extend({
  model: function(params) {
    return this.store.fetch('template', params.template_id);
  },

  setupController: function(controller, model) {
    controller.set('model', model);
    controller.set('title', model.get('title'));
    var fields = [];
    model.get('fields').forEach(function(item) {
      var field = StudyManager.Tfield.create();
      field.set('title', item);

      fields.pushObject(field);
    });
    controller.set('fields', fields);
    controller.reset();
  }
});

StudyManager.TemplateCreationRoute = StudyManager.AuthenticationRoute.extend({
});

StudyManager.NewsRoute = StudyManager.AuthenticationRoute.extend({
  model: function() {
    return this.store.find('news');
  },

  setupController: function(controller, model) {
    controller.set('model', model);
    controller.set('newsList', model);
    controller.reset();
  }
});

StudyManager.SingleNewsRoute = StudyManager.AuthenticationRoute.extend({
  model: function(params) {
    return this.store.fetch('news', params.news_id);
  },

  setupController: function(controller, model) {
    controller.set('model', model);
    controller.set('title', model.get('title'));
    controller.set('date', model.get('date'));
    controller.set('description', model.get('description'));
    controller.set('link', model.get('link'));
    controller.reset();
  }
});

StudyManager.NewsCreationRoute = StudyManager.AuthenticationRoute.extend({
});

