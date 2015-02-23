StudyManager.UserstudyCreationController = Ember.Controller.extend({
    needs: ['application', 'userstudies'],

    actions: {
        createStudy: function(newData) {
            this.set('statusMessage', null);

            var newStudy = this.store.createRecord('userstudy', {
                title: newData.titleNew,
                fromDate: newData.fromNew,
                untilDate: newData.toNew,
                location: newData.locationNew,
                description: newData.descriptionNew,
                space: newData.capacityNew,
                link: newData.linkNew,
                mmi: newData.mmiNew,
                compensation: newData.amazonNew,
                templateValues: newData.templateValuesNew
            });

            newStudy.get('labels').pushObjects(this.get('selectedLabels'));
            newStudy.get('news').pushObjects(this.get('selectedNews'));
            newStudy.set('template', this.get('template'));
            newStudy.set('executor', this.get('executor'));
            newStudy.set('tutor', this.get('tutor'));
            newStudy.get('registeredUsers').pushObjects(this.get('registeredUsers'));
            newStudy.get('requiredStudies').pushObjects(this.get('requiredStudies'));

            var that = this;
            var name = newStudy.get('title');
            newStudy.save().then(function(response) {
                that.set('isLoading', false);
                that.set('createDataWasValid', true);
                that.transitionToRoute('userstudies').then(function () {
                    var aMessage = 'Studie \"' + name + '\" erfolgreich erstellt!';
                    that.get('controllers.userstudies').set('statusMessage', { message: aMessage, isSuccess: true });
                });
            }, function(error) {
                newStudy.deleteRecord();
                that.set('isLoading', false);
                that.set('createDataWasValid', false);
                that.set('statusMessage', { message: error.responseJSON.message, isSuccess: false });
            });
        },

        cancelView: function() {
            this.transitionToRoute('userstudies');
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

    reset: function() {
        this.set('isLoading', false);
        this.set('createDataWasValid', true);
        this.set('statusMessage', null);
        this.set('title', null);
        this.set('fromDate', null);
        this.set('toDate', null);
        this.set('location', null);
        this.set('description', null);
        this.set('link', null);
        this.set('capacity', 0);
        this.set('mmi', 0);
        this.set('amazon', 0);
        this.set('executor', null);
        this.set('tutor', null);
        this.set('selectedLabels', []);
        this.set('selectedNews', []);
        this.set('registeredUsers', []);
        this.set('template', null);
        this.set('requiredStudies', []);
    },

    statusMessage: null,

    isTutorUser: false,

    title: null,

    fromDate: null,

    toDate: null,

    location: null,

    description: null,

    link: null,

    capacity: 0,

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

    requiredStudies: [],

    isLoading: false,

    createDataWasValid: true
});
