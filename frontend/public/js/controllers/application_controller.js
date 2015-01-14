StudyManager.ApplicationController = Ember.Controller.extend({
    needs: ['login', 'dashboard'],

    actions: {
        /*logout: function() {
            var that = this;

            Ember.$.get('/logout', { access_token: localStorage.token }).then(
                function() {
                    that.get('controllers.login').set('token', null);
                    that.transitionToRoute('index');
                },
                function() {
                    that.alert("Logout failed!");
                }
            );
        }*/
        logout: function() {
            this.get('controllers.login').set('token', null);
            this.set('isLoggedIn', false);
            this.resetLocalStorage();
            this.transitionToRoute('login');
        },

        openAccountSettings: function() {
            this.transitionToRoute('acc-config');
        }
    },

    init: function() {
        this._super();
    },

    userRole: localStorage.userRole,

    userRoleChanged: function() {
        localStorage.userRole = this.get('userRole');
        var isTutor = this.get('userRole') === 'tutor';
        this.set('isTutor', isTutor);
        this.get('controllers.dashboard').set('isTutor', isTutor);
    }.observes('userRole'),

    isLoggedIn: localStorage.isLoggedIn,

    isLoggedInChanged: function() {
        localStorage.isLoggedIn = this.get('isLoggedIn');
    }.observes('isLoggedIn'),

    isTutor: localStorage.isTutor,

    isTutorChanged: function() {
        localStorage.isTutor = this.get('isTutor');
    }.observes('isTutor'),

    resetLocalStorage: function() {
        this.set('userRole', null);
        this.set('isLoggedIn', false);
        this.set('isTutor', false);
        this.controllerFor('login').set('currentUserId', null);
        this.controllerFor('login').set('token', null);

        window.localStorage.clear();
    }
});
