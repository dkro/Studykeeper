StudyManager.UserstudyEditController = Ember.Controller.extend({
    needs: ['application', 'userstudy', 'userstudies'],

    actions: {
        deleteStudy: function() {
            this.set('statusMessage', null);

            var thisStudy = this.get('model').study;
            var that = this;
            var name = thisStudy.get('title');

            if (confirm('Wollen Sie die Studie \"' + name + '\" wirklich löschen?')) {
                this.set('isDeleteLoading', true);
                thisStudy.deleteRecord();

                thisStudy.save().then(function(response) {
                    that.set('isDeleteLoading', false);
                    that.transitionToRoute('userstudies').then(function () {
                        var aMessage = 'Studie \"' + name + '\" erfolgreich gelöscht!';
                        that.get('controllers.userstudies').set('statusMessage', { message: aMessage, isSuccess: true });
                    });
                }, function(error) {
                    thisStudy.rollback();
                    that.set('isDeleteLoading', false);
                    that.set('statusMessage', { message: error.responseJSON.message, isSuccess: false });
                });
            }
        },

        updateStudy: function(newData) {
            this.set('statusMessage', null);

            var thisStudy = this.get('model').study;
            var id = thisStudy.get('id');
            thisStudy.set('title', newData.titleNew);
            thisStudy.set('fromDate', newData.fromNew);
            thisStudy.set('untilDate', newData.toNew);
            thisStudy.set('location', newData.locationNew);
            thisStudy.set('description', newData.descriptionNew);
            thisStudy.set('link', newData.linkNew);
            thisStudy.set('mmi', newData.mmiNew);
            thisStudy.set('compensation', newData.compensationNew);
            thisStudy.set('space', newData.capacityNew);
            thisStudy.set('templateValues', newData.templateValuesNew);
            thisStudy.set('tutor', this.get('tutor'));
            thisStudy.set('executor', this.get('executor'));
            thisStudy.set('template', this.get('template'));

            var that = this;
            var name = thisStudy.get('title');
            thisStudy.save().then(function(response) {
                that.set('isUpdateLoading', false);
                that.set('updateDataWasValid', true);
                that.transitionToRoute('userstudy', id).then(function () {
                    var aMessage = 'Studie \"' + name + '\" erfolgreich geändert!';
                    that.get('controllers.userstudy').set('statusMessage', { message: aMessage, isSuccess: true });
                });
            }, function(error) {
                thisStudy.rollback();
                that.set('isUpdateLoading', false);
                that.set('updateDataWasValid', false);
                that.set('statusMessage', { message: error.responseJSON.message, isSuccess: false });
            });
        },

        cancelView: function() {
            this.transitionToRoute('userstudy', this.get('model').study.get('id'));
        },

        goToStudyConfirm: function() {
            this.set('isConfirmLoading', true);
            this.transitionToRoute('userstudy-confirm', this.get('model').study.get('id'));
        }
    },

    init: function() {
        this._super();
        var mmiPoints = this.get('controllers.application').get('mmiValues');
        mmiPoints.removeObject(null);
        this.set('mmiPoints', mmiPoints);
        this.set('isTutorUser', this.get('controllers.application').get('isTutor'));
    },

    determineAsyncProperties: function() {
        this.determineExecutor();
        this.determineTutor();
        this.determineTemplate();

        this.set('statusMessage', null);
        this.set('isUpdateLoading', false);
        this.set('isDeleteLoading', false);
        this.set('updateDataWasValid', true);
        this.set('isConfirmLoading', false);
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

    updateDataWasValid: true,

    isUpdateLoading: false,

    isDeleteLoading: false,

    isConfirmLoading: false,

    isTutorUser: false,

    title: null,

    fromDate: null,

    toDate: null,

    location: null,

    description: null,

    link: null,

    mmi: 0,

    mmiPoints: [],

    compensation: null,

    executor: null,

    tutor: null,

    possibleTutors: [],

    possibleExecutors: [],

    template: null,

    allRequiredStudies: []
});
