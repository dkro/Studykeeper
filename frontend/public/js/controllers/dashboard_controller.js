StudyManager.DashboardController = Ember.Controller.extend({
    needs: ['application', 'userstudies'],

    actions: {
        displayStudies: function() {
            this.set('isLoading', true);
            this.transitionToRoute('userstudies');
        },

        displayStudy: function(study) {
            this.transitionToRoute('userstudy', study);
        }
    },

    determineInitialProperties: function() {
        this.set('isLoading', false);

        var isTutor = this.get('controllers.application').get('isTutor');

        this.set('isTutor', isTutor);
    },

    isLoading: false,

    isTutor: false,

    collectsMMI: false
});


