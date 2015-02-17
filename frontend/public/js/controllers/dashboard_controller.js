StudyManager.DashboardController = Ember.Controller.extend({
    needs: ['application', 'userstudies'],

    actions: {
        displayStudies: function() {
            this.transitionToRoute('userstudies');
        },

        displayStudy: function(study) {
            this.transitionToRoute('userstudy', study);
        }
    },

    determineInitialProperties: function() {
        var isTutor = this.get('controllers.application').get('isTutor');

        this.set('isTutor', isTutor);
    },

    isTutor: false,

    collectsMMI: false
});


