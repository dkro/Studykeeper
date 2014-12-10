StudyManager.ApplicationController = Ember.Controller.extend({
    needs: ['login', 'user'],

    isLoggedIn: false,

    userRole: 0,

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
        this.get('controllers.user').changeOfUserRole(this.get('userRole'));
    }.observes('userRole')
});
