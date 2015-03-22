StudyManager.DashboardController = Ember.Controller.extend({
    needs: ['application', 'userstudies'],

    actions: {
        displayStudies: function() {
            this.set('isLoading', true);
            this.transitionToRoute('userstudies');
        },

        displayStudy: function(study) {
            this.transitionToRoute('userstudy', study);
        }
    },

    determineInitialProperties: function() {
        this.set('isLoading', false);

        var isTutor = this.get('controllers.application').get('isTutor');

        this.set('isTutor', isTutor);
    },

    /**
     * This fix is necessary so that the initial values are set correctly.
     */
    determineAsyncProperties: function() {
        var that = this;

        this.get('model').currentUser.get('registeredFor').then(function(regStudies) {
            var history = regStudies.filter(function(study) {
                return study.get('closed');
            });

            var futureStudies = regStudies.filter(function(study) {
                return !study.get('closed');
            });

            that.set('history', history);
            that.set('futureRegisteredStudies', futureStudies);
        });


        this.get('model').currentUser.get('isExecutorFor').then(function(createStudies) {
            that.set('ownCreatedStudies', createStudies);
        });
    },

    isLoading: false,

    isTutor: false,

    collectsMMI: false,

    history: [],

    futureRegisteredStudies: [],

    ownCreatedStudies: []
});


