StudyManager.UserstudyPublicController = Ember.Controller.extend({
    needs: ['userstudies', 'application'],

    actions: {
        register: function() {
            this.set('isLoading', true);
            this.transitionToRoute('login');
        },

        cancelButtonClick: function() {
            this.set('isLoading', true);
            this.transitionToRoute('userstudies');
        }
    },

    determineNeededProperties: function() {
        this.determineLoggedIn();
        this.determineMailTos();
        this.set('isLoading', false);
    },

    determineLoggedIn: function() {
        var isLoggedIn = this.get('controllers.application').get('isLoggedIn');
        this.set('isLoggedIn', isLoggedIn);
    },

    mailToTutor: null,

    mailToExecutor: null,

    determineMailTos: function() {
        this.set('mailToTutor', 'mailto:' + this.get('model').get('tutorEmail'));
        this.set('mailToExecutor', 'mailto:' + this.get('model').get('tutorEmail'));
    },

    isLoggedIn: false,

    isLoading: false
});
