StudyManager.UserstudiesController = Ember.Controller.extend({
    actions: {
        showStudy: function(study) {
            this.transitionToRoute('userstudy', study);
        },

        deleteStudy: function(study) {
            this.set('statusMessage', null);
            var name = study.get('title');
            var that = this;

            if (confirm('Wollen Sie die Studie \"' + name + '\" wirklich löschen?')) {
                study.deleteRecord();
                study.save().then(function(response) {
                    var successMessage = 'Studie \"' + name + '\" wurde erfolgreich gelöscht!';
                    that.set('statusMessage', { message: successMessage, isSuccess: true });
                }, function(error) {
                    study.rollback();
                    var failMessage = 'Studie \"' + name + '\" konnte nicht gelöscht werden!';
                    that.set('statusMessage', { message: failMessage, isSuccess: false });
                });
            }
        }
    },

    reset: function() {
        this.set('statusMessage', null);
        this.set('selectedStateFilter', null);
        this.set('selectedFromFilter', null);
        this.set('selectedToFiler', null);
        this.set('selectedNameFilter', null);
        this.set('selectedLocationFilter', null);
        this.set('selectedPersonFilter', null);
        this.set('selectedMMIFilter', null);
        this.set('selectedAmazonFilter', null);
    },

    statusMessage: null,

    searchTags: null,

    stateFilterOptions: ['', 'Zukünftig', 'Abgelaufen'],

    mmiFilterOptions: ['', '1', '2', '3', '4', '5'],

    amazonFilterOptions: ['', '5€', '10€', '15€', '20€', '25€'],

    selectedStateFilter: null,

    selectedFromFilter: null,

    selectedToFiler: null,

    selectedNameFilter: null,

    selectedLocationFilter: null,

    selectedPersonFilter: null,

    selectedMMIFilter: '',

    selectedAmazonFilter: ''
});
