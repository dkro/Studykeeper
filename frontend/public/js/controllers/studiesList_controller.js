StudyManager.StudiesListController = Ember.Controller.extend({
    actions: {
        enableDisableFilter: function() {
            var enabled = this.get('isFilterVisible');
            this.set('isFilterVisible', !enabled);
        }
    },

    studies: [
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

    searchTags: null,

    isFilterVisible: false,

    filterButtonText: "Filter einblenden",

    adaptFilterButtonText: function() {
        if (this.get('isFilterVisible')) {
            this.set('filterButtonText', "Filter ausblenden");
        } else {
            this.set('filterButtonText', "Filter einblenden");
        }
    }.observes('isFilterVisible')

});
