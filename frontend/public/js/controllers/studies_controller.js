StudyManager.StudiesController = Ember.Controller.extend({
    actions: {
        enableDisableFilter: function() {
            var enabled = this.get('isFilterVisible');
            this.set('isFilterVisible', !enabled);
        },

        showStudy: function(study) {
            this.transitionToRoute('study', study);
        }
    },

    searchTags: null,

    stateFilterOptions: ['', 'Zukünftig', 'Abgelaufen'],

    mmiFilterOptions: ['', '1', '2', '3', '4', '5'],

    amazonFilterOptions: ['', '5€', '10€', '15€', '20€', '25€'],

    selectedStateFilter: '',

    selectedFromFilter: null,

    selectedToFiler: null,

    selectedNameFilter: null,

    selectedLocationFilter: null,

    selectedPersonFilter: null,

    selectedMMIFilter: '',

    selectedAmazonFilter: '',

    isFilterVisible: false,

    filterButtonText: 'Filter einblenden',

    adaptFilterButtonText: function() {
        if (this.get('isFilterVisible')) {
            this.set('filterButtonText', 'Filter ausblenden');
        } else {
            this.set('filterButtonText', 'Filter einblenden');
        }
    }.observes('isFilterVisible')
});
