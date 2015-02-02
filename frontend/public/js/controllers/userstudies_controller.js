StudyManager.UserstudiesController = Ember.Controller.extend({
    actions: {
        showStudyConfig: function(study) {
            this.transitionToRoute('userstudy', study);
        },

        createStudy: function() {
            this.transitionToRoute('study-creation');
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
        },

        filterStudies: function() {
            this.filterAll(true);
        }
    },

    reset: function() {
        this.set('statusMessage', null);
        this.set('selectedFromFilter', null);
        this.set('selectedToFiler', null);
        this.set('selectedTitleFilter', null);
        this.set('selectedLocationFilter', null);
        this.set('selectedExecutorFilter', null);
        this.set('selectedMMIFilter', null);
        this.set('selectedAmazonFilter', null);
    },

    filterAll: function(shouldClearStatus) {
        var that = this;

        var filteredList = this.store.filter('userstudy', (function(study){
            return that.filterStudyTitle(study.get('title')) &&
                that.filterExecutor(study.get('executor')) &&
                that.filterAmazon(study.get('compensation')) &&
                that.filterMMI(study.get('mmi')) &&
                that.filterLocation(study.get('location'));
        }));

        this.set('studiesList', filteredList);

        if (shouldClearStatus) {
            this.set('statusMessage', null);
        }
    },

    filterStudyTitle: function(title) {
        var res = true;

        if (!(Ember.empty(this.get('selectedTitleFilter')))) {
            res = this.firstContainsSecond(title, this.get('selectedTitleFilter'));
        }

        return res;
    },

    filterLocation: function(location) {
        var res = true;

        if (!(Ember.empty(this.get('selectedLocationFilter')))) {
            res = this.firstContainsSecond(location, this.get('selectedLocationFilter'));
        }

        return res;
    },

    filterExecutor: function(executor) {
        var res = true;
        var firstName = executor.get('firstname');
        var lastName = executor.get('lastname');

        if (!(Ember.empty(this.get('selectedExecutorFilter')))) {
            res = this.firstContainsSecond(firstName, this.get('selectedExecutorFilter')) ||
                    this.firstContainsSecond(lastName, this.get('selectedExecutorFilter')) ;
        }

        return res;
    },

    filterAmazon: function(points) {
        var res = true;

        if (!(Ember.empty(this.get('selectedAmazonFilter')))) {
            res = this.firstContainsSecond(parseInt(points), this.get('selectedAmazonFilter'));
        }

        return res;
    },

    firstContainsSecond: function(first, second) {
        return first.indexOf(second) > -1;
    },

    showMessage: function(statusMessage) {
        this.set('statusMessage', statusMessage);
    },

    statusMessage: null,

    searchTags: null,

    studiesList: [],

    mmiFilterOptions: ['', '1', '2', '3', '4', '5'],

    amazonFilterOptions: ['', '5', '10', '15', '20', '25'],

    selectedFromFilter: null,

    selectedToFiler: null,

    selectedTitleFilter: null,

    selectedLocationFilter: null,

    selectedExecutorFilter: null,

    selectedMMIFilter: null,

    selectedMMIFilterChanged: function() {
        var shouldClearStatus = !Ember.empty(this.get('selectedMMIFilter'));
        this.filterAll(shouldClearStatus);
    }.observes('selectedMMIFilter'),

    selectedAmazonFilter: null,

    selectedAmazonFilterChanged: function() {
        var shouldClearStatus = !Ember.empty(this.get('selectedAmazonFilter'));
        this.filterAll(shouldClearStatus);
    }.observes('selectedAmazonFilter')
});
