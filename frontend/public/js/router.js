StudyManager.Router.map(function() {
  this.route('login', { path: '/' });
  this.route('signup');
  this.route('password-recovery', { path: '/passwordRecovery' });
  this.route('acc-config', { path: '/account' });
  this.route('about');
  this.route('logout');
  this.route('status');
  this.route('not-found', {path: '/*wildcard'});
  this.route('record-nonexisting');
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

StudyManager.StatusRoute = Ember.Route.extend({
  type: null,

  hash: null,

  beforeModel: function(transition){
    this.set('type', transition.queryParams.type);
    this.set('hash', transition.queryParams.hash);
  },

  setupController: function(controller) {
    controller.reset();
    controller.requestData(this.get('type'), this.get('hash'));
  }
});

StudyManager.NotFoundRoute = Ember.Route.extend({
  setupController: function(controller) {
    controller.determineState();
  }
});

StudyManager.RecordNonexistingRoute = Ember.Route.extend({
  type: null,

  id: null,

  beforeModel: function(transition){
    this.set('type', transition.queryParams.type);
    this.set('id', transition.queryParams.recordId);
  },

  setupController: function(controller) {
    controller.reset();
    controller.setDisplayData(this.get('type'), this.get('id'));
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
        currentUser: user,
        allStudies: that.store.find('userstudy'),
        mmiPoints: user.get('mmi'),
        news: that.store.find('news'),
        collectsMMI: user.get('collectsMMI')
      });
    });
  },

  setupController: function(controller, model) {
    controller.set('model', model);
    controller.set('collectsMMI', model.collectsMMI);
    controller.determineInitialProperties();
    controller.determineAsyncProperties();
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

    // Workaround because of Ember cache
    var filteredStudies = model.studies.filter(function (study) {
        return !(study.get('title') === undefined);
    });


    controller.set('model', model);
    controller.reset();
    controller.set('studiesList', filteredStudies);
    controller.set('searchTags', transformedTags);
  }
});

StudyManager.UserstudyRoute = StudyManager.AuthenticationRoute.extend({
  model: function(params) {
    var that = this;

    return this.store.find('userstudy', params.userstudy_id).then(function(study) {
      return study;
    }, function(error) {
      that.transitionTo('record-nonexisting', {queryParams: {recordId: params.userstudy_id, type: 'study'}});
    });
  },

  setupController: function(controller, model) {
    controller.set('model', model);
    controller.determineNeededProperties();
  }
});

StudyManager.UserstudyPublicRoute = Ember.Route.extend({
  model: function(params) {
    var that = this;

    return this.store.find('studypublic', params.userstudy_id).then(function(study) {
      return study;
    }, function(error) {
      that.transitionTo('record-nonexisting', {queryParams: {recordId: params.userstudy_id, type: 'study'}});
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
      study: that.store.find('userstudy', params.userstudy_id).then(function(study) {
        return study;
      }, function(error) {
        that.transitionTo('record-nonexisting', {queryParams: {recordId: params.userstudy_id, type: 'study'}});
      })
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
      study: that.store.find('userstudy', params.userstudy_id).then(function(study) {
        return study;
      }, function(error) {
        that.transitionTo('record-nonexisting', {queryParams: {recordId: params.userstudy_id, type: 'study'}});
      })
    });
  },

  setupController: function(controller, model) {
    controller.set('model', model);
    controller.reset();

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
    controller.reset();

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
  }
});

StudyManager.UsersRoute = StudyManager.AuthenticationRoute.extend({
  model: function() {
    return this.store.find('user');
  },

  setupController: function(controller, model) {
    controller.set('model', model);
    controller.reset();
    var filteredUsers = model.filter(function (user) {
      return !(user.get('username') === undefined);
    });
    controller.set('usersList', filteredUsers);
  }
});

StudyManager.UserRoute = StudyManager.AuthenticationRoute.extend({
  model: function(params) {
    var that = this;

    return this.store.find('user', params.user_id).then(function(user) {
      return user;
    }, function(error) {
      that.transitionTo('record-nonexisting', {queryParams: {recordId: params.user_id, type: 'user'}});
    });
  },

  setupController: function(controller, model) {
    controller.set('model', model);
    controller.reset();
    controller.set('firstName', model.get('firstname'));
    controller.set('lastName', model.get('lastname'));
    controller.set('userName', model.get('username'));
    controller.set('mmiPoints', model.get('mmi'));
    controller.set('isMMIUser', model.get('collectsMMI'));
    controller.set('tutoredStudies', model.get('isTutorFor'));
    controller.set('registeredStudies', model.get('registeredFor'));
    controller.set('executedStudies', model.get('isExecutorFor'));
    controller.determineSelectedRole();
  }
});

StudyManager.UserCreationRoute = StudyManager.AuthenticationRoute.extend({
  setupController: function(controller) {
    controller.reset();
  }
});

StudyManager.TemplatesRoute = StudyManager.AuthenticationRoute.extend({
  model: function() {
    return this.store.find('template');
  },

  setupController: function(controller, model) {
    controller.set('model', model);
    controller.reset();
    var filteredTemplates = model.filter(function (template) {
      return !(template.get('title') === undefined);
    });
    controller.set('templatesList', filteredTemplates);
  }
});

StudyManager.TemplateRoute = StudyManager.AuthenticationRoute.extend({
  model: function(params) {
    var that = this;

    return this.store.find('template', params.template_id).then(function(template) {
      return template;
    }, function(error) {
      that.transitionTo('record-nonexisting', {queryParams: {recordId: params.template_id, type: 'template'}});
    });
  },

  setupController: function(controller, model) {
    controller.set('model', model);
    controller.reset();
    controller.set('title', model.get('title'));

    var fields = [];
    model.get('fields').forEach(function(item) {
      var field = StudyManager.Tfield.create();
      field.set('title', item);

      fields.pushObject(field);
    });
    controller.set('fields', fields);
    controller.set('relatedStudies', model.get('userstudies'));
  }
});

StudyManager.TemplateCreationRoute = StudyManager.AuthenticationRoute.extend({
  setupController: function(controller) {
    controller.reset();
  }
});

StudyManager.NewsRoute = StudyManager.AuthenticationRoute.extend({
  model: function() {
    return this.store.find('news');
  },

  setupController: function(controller, model) {
    controller.set('model', model);

    var filteredNews = model.filter(function (news) {
      return !(news.get('title') === undefined);
    });
    controller.set('newsList', filteredNews);
    controller.reset();
  }
});

StudyManager.SingleNewsRoute = StudyManager.AuthenticationRoute.extend({
  model: function(params) {
    var that = this;

    return this.store.find('news', params.news_id).then(function(news) {
      return news;
    }, function(error) {
        that.transitionTo('record-nonexisting', {queryParams: {recordId: params.news_id, type: 'news'}});
    });
  },

  setupController: function(controller, model) {
    controller.set('model', model);
    controller.reset();
    controller.set('title', model.get('title'));
    controller.set('date', model.get('date'));
    controller.set('description', model.get('description'));
    controller.set('link', model.get('link'));
    controller.set('relatedStudies', model.get('userstudies'));
  }
});

StudyManager.NewsCreationRoute = StudyManager.AuthenticationRoute.extend({
  setupController: function(controller) {
    controller.reset();
  }
});

