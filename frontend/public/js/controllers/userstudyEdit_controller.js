StudyManager.UserstudyEditController = Ember.Controller.extend({
    needs: ['application', 'userstudy', 'userstudies'],

    actions: {
        deleteStudy: function() {
            var thisStudy = this.get('model').study;
            var that = this;
            var name = thisStudy.get('title');

            if (confirm('Wollen Sie die Studie \"' + name + '\" wirklich löschen?')) {
                thisStudy.deleteRecord();

                thisStudy.save().then(function(response) {
                    that.transitionToRoute('userstudies').then(function () {
                        var aMessage = 'Studie \"' + name + '\" erfolgreich gelöscht!';
                        that.get('controllers.userstudies').set('statusMessage', { message: aMessage, isSuccess: true });
                    });
                }, function(error) {
                    thisStudy.rollback();
                    var aMessage = 'Studie \"' + name + '\" konnte nicht gelöscht werden!';
                    that.set('statusMessage', { message: aMessage, isSuccess: false });
                });
            }
        },

        updateStudy: function(newData) {
            var thisStudy = this.get('model').study;
            var id = thisStudy.get('id');
            thisStudy.set('title', newData.titleNew);
            thisStudy.set('fromDate', newData.fromNew);
            thisStudy.set('untilDate', newData.toNew);
            thisStudy.set('location', newData.locationNew);
            thisStudy.set('description', newData.descriptionNew);
            thisStudy.set('link', newData.linkNew);
            thisStudy.set('mmi', newData.mmiNew);
            thisStudy.set('compensation', newData.amazonNew);
            thisStudy.set('space', newData.capacityNew);
            thisStudy.get('labels').clear();
            thisStudy.get('labels').pushObjects(this.get('selectedLabels'));
            thisStudy.get('news').clear();
            thisStudy.get('news').pushObjects(this.get('selectedNews'));
            thisStudy.set('template', this.get('template'));
            thisStudy.set('executor', this.get('executor'));
            thisStudy.set('tutor', this.get('tutor'));
            thisStudy.get('registeredUsers').clear();
            thisStudy.get('registeredUsers').pushObjects(this.get('registeredUsers'));
            thisStudy.get('requiredStudies').clear();
            thisStudy.get('requiredStudies').pushObjects(this.get('requiredStudies'));

            var that = this;
            var name = thisStudy.get('title');
            thisStudy.save().then(function(response) {
                that.transitionToRoute('userstudy', id).then(function () {
                    var aMessage = 'Studie \"' + name + '\" erfolgreich geändert!';
                    that.get('controllers.userstudy').set('statusMessage', { message: aMessage, isSuccess: true });
                });
            }, function(error) {
                thisStudy.rollback();
                that.transitionToRoute('userstudy', id).then(function () {
                    var aMessage = error.responseJSON.message;
                    that.get('controllers.userstudy').set('statusMessage', { message: aMessage, isSuccess: false });
                });
            });
        },

        cancelView: function() {
            this.transitionToRoute('userstudy', this.get('model').study);
        }
    },

    init: function() {
        this._super();
        var mmiPoints = this.get('controllers.application').get('mmiValues');
        mmiPoints.removeObject(null);
        this.set('mmiPoints', mmiPoints);
        var amazonValues = this.get('controllers.application').get('amazonValues');
        amazonValues.removeObject(null);
        this.set('amazonValues', amazonValues);
        this.set('isTutorUser', this.get('controllers.application').get('isTutor'));
    },

    determineAsyncProperties: function() {
        this.determineExecutor();
        this.determineTutor();
        this.determineTemplate();
    },

    /**
     * This fix is necessary so that the initial value is set correctly.
     */
    determineExecutor: function() {
        var that = this;
        var theExecutor = this.get('model').study.get('executor').then(function(anExecutor){
            that.set('executor', anExecutor);
        });
    },

    /**
     * This fix is necessary so that the initial value is set correctly.
     */
    determineTutor: function() {
        var that = this;
        var theTutor = this.get('model').study.get('tutor').then(function(anTutor){
            that.set('tutor', anTutor);
        });
    },

    /**
     * This fix is necessary so that the initial value is set correctly.
     */
    determineTemplate: function() {
        var that = this;
        var theTemplate = this.get('model').study.get('template').then(function(aTemplate){
            that.set('template', aTemplate);
        });
    },

    statusMessage: null,

    isTutorUser: false,

    title: null,

    fromDate: null,

    toDate: null,

    location: null,

    description: null,

    link: null,

    mmi: 0,

    mmiPoints: [],

    amazon: 0,

    amazonValues: [],

    executor: null,

    tutor: null,

    selectedLabels: [],

    selectedNews: [],

    registeredUsers: [],

    possibleTutors: [],

    possibleExecutors: [],

    template: null,

    allRequiredStudies: [],

    requiredStudies: []
});
