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
        var isLMUStaff = this.get('controllers.application').get('isLMUStaff');

        this.set('isTutor', isTutor);
        this.set('isLMUStaff', isLMUStaff);
    },

    isTutor: false,

    isLMUStaff: false
});


