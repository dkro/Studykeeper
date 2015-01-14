StudyManager.DashboardController = Ember.Controller.extend({
    needs: ['application', 'userstudies'],

    actions: {
        displayStudies: function(selectedTags) {
            this.get('controllers.userstudies').set('searchTags', selectedTags);
            this.transitionToRoute('userstudies');
        },

        displayStudy: function(study) {
            this.transitionToRoute('userstudy', study);
        }
    },

    init: function() {
        this._super();
    },

    isTutor: localStorage.isTutor,

    searchTags: []
});


