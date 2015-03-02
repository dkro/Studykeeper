StudyManager.NotFoundController = Ember.Controller.extend({
    needs: ['application'],

    actions: {
        doTransition: function() {
            this.set('isLoading', true);

            if (this.get('isLoggedIn')) {
                this.transitionToRoute('dashboard');
            } else {
                this.transitionToRoute('login');
            }
        }
    },

    determineState: function() {
        this.set('isLoading', false);

        var isLoggedIn = this.get('controllers.application').get('isLoggedIn');
        this.set('isLoggedIn', isLoggedIn);
    },

    isLoggedIn: false,

    isLoading: false
});
