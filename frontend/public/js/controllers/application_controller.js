StudyManager.ApplicationController = Ember.Controller.extend({
    needs: ['login', 'dashboard'],

    isLoggedIn: false,

    userRole: null,

    isTutor: false,

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
            this.transitionToRoute('login');
        },

        openAccountSettings: function() {
            this.transitionToRoute('acc-config');
        }
    },

    userRoleChanged: function() {
        var isTutor = this.get('userRole') === 'TUTOR';
        this.set('isTutor', isTutor);
        this.get('controllers.dashboard').set('isTutor', isTutor);
    }.observes('userRole')
});
