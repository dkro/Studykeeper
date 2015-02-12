StudyManager.ApplicationController = Ember.Controller.extend({
    needs: ['login', 'dashboard'],

    actions: {
        logout: function() {
            var that = this;

            Ember.$.ajax({
                url: "/api/users/logout",
                type: "POST",
                beforeSend: function(request) {
                    request.setRequestHeader('Authorization', 'Bearer ' + localStorage.token)
                }
            }).then(
                function(response) {
                    that.resetLocalStorage();
                    that.transitionToRoute('login');
                },
                function(error) {
                    that.resetLocalStorage();
                    that.transitionToRoute('login');
                    alert('Logout fehlgeschlagen! ' + error.responseJSON.message);
                });

            /*
            this.resetLocalStorage();
            this.transitionToRoute('login');*/
        },

        openAccountSettings: function() {
            this.transitionToRoute('acc-config');
        }
    },

    init: function() {
        this._super();

        var mmiPoints = [];
        mmiPoints[0] = null;
        var val = 0;

        for (var i = 1; i <= 30; i++) {
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

    isLMUStaff: localStorage.isLMUStaff,

    LMUStaffChanged: function() {
        localStorage.isLMUStaff = this.get('isLMUStaff');
    }.observes('isLMUStaff'),

    resetLocalStorage: function() {
        this.set('userRole', null);
        this.set('isLoggedIn', false);
        this.set('isTutor', false);
        this.set('currentUserId', null);
        this.set('token', null);
        this.set('isLMUStaff', false);

        window.localStorage.clear();
    },

    roles: ['executor', 'participant', 'tutor'],

    mmiValues: null,

    amazonValues: [null, 0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50]
});
