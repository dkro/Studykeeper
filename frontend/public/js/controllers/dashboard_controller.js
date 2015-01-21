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

    isTutor: localStorage.isTutor
});


