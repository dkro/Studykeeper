StudyManager.UserCreationController = Ember.Controller.extend({
    actions: {
        createUser: function(user) {

        },

        cancelView: function() {
            this.transitionToRoute('users');
        }
    }
});
