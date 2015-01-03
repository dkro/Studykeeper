StudyManager.DashboardController = Ember.Controller.extend({
    needs: ['application', 'studies'],

    actions: {
        displayStudies: function(selectedTags) {
            this.get('controllers.studies').set('searchTags', selectedTags);
            this.transitionToRoute('studies');
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


