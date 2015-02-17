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

    determineNeededProperties: function() {
        this.determineLoggedIn();
        this.determineMailTos();
    },

    determineLoggedIn: function() {
        var isLoggedIn = this.get('controllers.application').get('isLoggedIn');
        this.set('isLoggedIn', isLoggedIn);
    },

    mailToTutor: null,

    mailToExecutor: null,

    determineMailTos: function() {
        this.set('mailToTutor', this.get('model').get('tutorEmail'));
        this.set('mailToExecutor', this.get('model').get('tutorEmail'));
    },

    isLoggedIn: false
});
