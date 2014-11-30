StudyManager.ApplicationController = Ember.Controller.extend({
    needs: ['login'],

    actions: {
        logout: function() {
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
        }
    }
});
