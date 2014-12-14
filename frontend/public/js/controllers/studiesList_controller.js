StudyManager.StudiesListController = Ember.Controller.extend({
    actions: {
        enableDisableFilter: function() {
            var enabled = this.get('isFilterVisible');
            this.set('isFilterVisible', !enabled);
        }
    },

    studies: [
        {
            name: "Studie 0",
            executor: "Person 0",
            from: "20.09.2011",
            to: "21.09.2011",
            location: "Hauptgebäude, Raum 045",
            amazon: 5,
            mmi: 2,
            expired: true
        },
        {
            name: "Studie A",
            executor: "Person A",
            from: "20.09.2015",
            to: "21.09.2015",
            location: "Hauptgebäude, Raum 045",
            amazon: 10,
            mmi: 3,
            expired: false
        },
        {
            name: "Studie B",
            executor: "Person B",
            from: "10.03.2012",
            to: "21.09.2012",
            location: "Amalienstraße, Raum 5",
            amazon: 5,
            mmi: 1,
            expired: false
        },
        {
            name: "Studie C",
            executor: "Person C",
            from: "02.02.2010",
            to: "15.02.2010",
            location: "Schellingstraße 3, Raum 012",
            amazon: 20,
            mmi: 4,
            expired: true
        },
        {
            name: "Studie D",
            executor: "Person D",
            from: "08.09.2015",
            to: "27.09.2015",
            location: "Hauptgebäude, Raum B145",
            amazon: 5,
            mmi: 2,
            expired: false
        }
    ],

    searchTags: null,

    stateFilterOptions: ["", "Zukünftig", "Abgelaufen"],

    mmiFilterOptions: ["", "1", "2", "3", "4", "5"],

    amazonFilterOptions: ["", "5€", "10€", "15€", "20€", "25€"],

    selectedStateFilter: "",

    selectedFromFilter: null,

    selectedToFiler: null,

    selectedNameFilter: null,

    selectedLocationFilter: null,

    selectedPersonFilter: null,

    selectedMMIFilter: "",

    selectedAmazonFilter: "",

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
