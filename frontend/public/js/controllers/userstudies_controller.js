StudyManager.UserstudiesController = Ember.Controller.extend({
    actions: {
        showStudyConfig: function(study) {
            this.transitionToRoute('userstudy', study);
        },

        createStudy: function() {
            this.transitionToRoute('userstudy-creation');
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

        labelsChanged: function(labelVals) {
            this.set('selectedLabelsFilter', labelVals);
            this.filterAll(true);
        },

        filterStudies: function() {
            this.filterAll(true);
        },

        clearFromFilter: function() {
            this.set('selectedFromFilter', null);
        },

        clearToFilter: function() {
            this.set('selectedToFilter', null);
        }
    },

    reset: function() {
        this.set('statusMessage', null);
        this.set('selectedFromFilter', null);
        this.set('selectedToFilter', null);
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
                that.filterLocation(study.get('location')) &&
                that.filterDateRange(study.get('fromDate'), study.get('untilDate')) &&
                that.filterLabels(study.get('labels'));
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

    filterAmazon: function(amount) {
        var res = true;

        if (!(Ember.empty(this.get('selectedAmazonFilter')))) {
            res = amount === this.get('selectedAmazonFilter');
        }

        return res;
    },

    filterMMI: function(points) {
        var res = true;

        if (!(Ember.empty(this.get('selectedMMIFilter')))) {
            res = points === this.get('selectedMMIFilter');
        }

        return res;
    },

    filterLabels: function(labels) {
        var res = false;

        // If there are labels currently selected
        if (!(Ember.empty(this.get('selectedLabelsFilter')))) {
            // Iterate over all selected filter labels
            this.get('selectedLabelsFilter').some(function(filterLabel) {
                var hasLabel = false;

                labels.some(function(studyLabel) {
                    // If study has the filter label assigned
                    if (filterLabel === studyLabel.get('title')) {
                        // Equivalent to break (See documentation for "some")
                        return hasLabel = true;
                    }
                });

                res = hasLabel;

                // If already a non-match
                if (!hasLabel) {
                    // equivalent to break (See documentation for "some"
                    return true;
                }
            });
        } else {
            res = true;
        }

        return res;
    },

    filterDateRange: function(from, to) {
        var res = true;
        var fromFilter = this.get('selectedFromFilter');
        var toFilter = this.get('selectedToFilter');

        if (!Ember.empty(fromFilter) && !Ember.empty(toFilter)) {
            res = this.inRange(from, fromFilter, toFilter) && this.inRange(to, fromFilter, toFilter);
        } else if (!Ember.empty(fromFilter) && Ember.empty(toFilter)) {
            res = (this.compare(from, fromFilter) >= 0) && (this.compare(to, fromFilter) >= 0);
        } else if (Ember.empty(fromFilter) && !Ember.empty(toFilter)) {
            res = (this.compare(from, fromFilter) <= 0) && (this.compare(to, fromFilter) <= 0);
        }

        return res;
    },

    parseDate: function(input) {
        var parts = input.match(/(\d+)/g);
        return new Date(parts[2], parts[1]-1, parts[0]);
    },

    compare: function(date1, date2) {
        //  -1 : if a < b
        //   0 : if a = b
        //   1 : if a > b
        return (
            isFinite(date1=this.parseDate(date1).valueOf()) &&
            isFinite(date2=this.parseDate(date2).valueOf()) ?
            (date1>date2)-(date1<date2) :
                NaN
        );
    },

    inRange:function(date, startRange, endRange) {
        return (
            isFinite(date=this.parseDate(date).valueOf()) &&
            isFinite(startRange=this.parseDate(startRange).valueOf()) &&
            isFinite(endRange=this.parseDate(endRange).valueOf()) ?
            startRange <= date && date <= endRange :
                NaN
        );
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

    mmiFilterOptions: [null, 0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5, 5.5, 6, 6.5, 7, 7.5, 8, 8.5, 9, 9.5, 10],

    amazonFilterOptions: [null, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50],

    selectedFromFilter: null,

    selectedFromFilterChanged: function() {
        var shouldClearStatus = !Ember.empty(this.get('selectedFromFilter'));
        this.filterAll(shouldClearStatus);
    }.observes('selectedFromFilter'),

    selectedToFilter: null,

    selectedToFilerChanged: function() {
        var shouldClearStatus = !Ember.empty(this.get('selectedToFilter'));
        this.filterAll(shouldClearStatus);
    }.observes('selectedToFilter'),

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
    }.observes('selectedAmazonFilter'),

    selectedLabelsFilter: []
});
