StudyManager.NotFoundController = Ember.Controller.extend({
    needs: ['application'],

    actions: {
        doTransition: function() {
            if (this.get('isLoggedIn')) {
                this.transitionToRoute('dashboard');
            } else {
                this.transitionToRoute('login');
            }
        }
    },

    determineState: function() {
        var isLoggedIn = this.get('controllers.application').get('isLoggedIn');
        this.set('isLoggedIn', isLoggedIn);
    },

    isLoggedIn: false
});
