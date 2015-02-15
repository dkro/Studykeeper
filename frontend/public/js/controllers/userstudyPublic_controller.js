StudyManager.UserstudyPublicController = Ember.Controller.extend({
    needs: ['userstudies', 'application'],

    actions: {
        register: function() {
            this.transitionToRoute('login');
        },

        cancelButtonClick: function() {
            this.transitionToRoute('userstudies');
        }
    },

    determineLoggedIn: function() {
        var isLoggedIn = this.get('controllers.application').get('isLoggedIn');
        this.set('isLoggedIn', isLoggedIn);
    },

    isLoggedIn: false
});