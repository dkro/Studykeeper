StudyManager.UserstudyPublicController = Ember.Controller.extend({
    needs: ['userstudies', 'application'],

    actions: {
        register: function() {
            if (this.get('isLoggedIn')) {
                alert('TODO: Anmelden zur Studie');
            } else {
                this.transitionToRoute('login');
            }
        }
    },

    isLoggedIn: localStorage.isLoggedIn
});
