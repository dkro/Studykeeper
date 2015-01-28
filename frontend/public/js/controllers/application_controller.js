StudyManager.ApplicationController = Ember.Controller.extend({
    needs: ['login', 'dashboard'],

    actions: {
        logout: function() {
            var that = this;

            /*Ember.$.post('http://localhost:10001/api/users/logout', { token: localStorage.token }).then(
                function() {
                    this.resetLocalStorage();
                    this.transitionToRoute('login');
                },
                function() {
                    alert("Logout failed!");
                }
            );*/
            this.resetLocalStorage();
            this.transitionToRoute('login');
        },

        openAccountSettings: function() {
            this.transitionToRoute('acc-config');
        }
    },

    init: function() {
        this._super();

        var mmiPoints = [];
        var val = 0;

        for (var i = 0; i <= 30; i++) {
            mmiPoints[i] = parseFloat(val);
            val += 0.5;
        }

        this.set('mmiValues', mmiPoints);
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

    currentUserId: localStorage.currentUserId,

    currentUserIdChanged: function() {
        localStorage.currentUserId = this.get('currentUserId');
    }.observes('currentUserId'),

    token: localStorage.token,

    tokenChanged: function() {
        localStorage.token = this.get('token');
    }.observes('token'),

    resetLocalStorage: function() {
        this.set('userRole', null);
        this.set('isLoggedIn', false);
        this.set('isTutor', false);
        this.set('currentUserId', null);
        this.set('token', null);

        window.localStorage.clear();
    },

    roles: ['executor', 'participant', 'tutor'],

    mmiValues: null
});
