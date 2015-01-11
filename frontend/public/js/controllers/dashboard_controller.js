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

    isAdviser: false,

    isCreator: false,

    searchTags: [],

    changeOfUserRole: function(userRole) {
        if (userRole === 0) {
            this.set('isCreator', false);
            this.set('isAdviser', false);
        } else if (userRole === 1) {
            this.set('isCreator', true);
            this.set('isAdviser', false);
        } else if (userRole === 2) {
            this.set('isCreator', false);
            this.set('isAdviser', true);
        }
    }
});


