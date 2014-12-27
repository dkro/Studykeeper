StudyManager.DashboardController = Ember.Controller.extend({
    needs: ['application', 'studies'],

    actions: {
        displayStudies: function(selectedTags) {
            this.get('controllers.studies').set('searchTags', selectedTags);
            this.transitionToRoute('studies');
        }
    },

    /*allOptions: ["ABC", "BCDEFGH", "C", "DEFGHIJKL"],

    registeredStudies: [
        {
            name: "Studie A",
            date: "20.09.2015",
            location: "Hauptgebäude, Raum 045"
        },
        {
            name: "Studie B",
            date: "25.06.2015",
            location: "Amalienstraße, Raum 5"
        },
        {
            name: "Studie C",
            date: "11.03.2015",
            location: "Schellingstraße 3, Raum 012"
        },
        {
            name: "Studie D",
            date: "06.07.2015",
            location: "Hauptgebäude, Raum B145"
        }
    ],

    createdStudies: [
        {
            name: "Studie X",
            date: "20.09.2015",
            location: "Hauptgebäude, Raum 045"
        },
        {
            name: "Studie Y",
            date: "25.06.2015",
            location: "Amalienstraße, Raum 5"
        }
    ],*/

    isAdviser: false,

    isCreator: false,

    isMMIStudent: false,

    searchTags: [],

    bla: [],

    changeOfUserRole: function(userRole) {
        if (userRole === 0) {
            this.set('isCreator', false);
            this.set('isAdviser', false);
        } else if (userRole === 1) {
            this.set('isCreator', true);
            this.set('isAdviser', false);
        } else if (userRole == 2) {
            this.set('isCreator', false);
            this.set('isAdviser', true);
        }
    }
});


