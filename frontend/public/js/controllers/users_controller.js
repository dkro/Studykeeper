StudyManager.UsersController = Ember.Controller.extend({
    actions: {
        showUserConfig: function(user) {
            this.transitionToRoute('user', user);
        }

    }
});
