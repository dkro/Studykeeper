StudyManager.UserstudyCreationController = Ember.Controller.extend({
    needs: ['application', 'userstudies'],

    actions: {
        createStudy: function(newData) {
            var newStudy = this.store.createRecord('userstudy', {
                title: newData.titleNew,
                fromDate: newData.fromNew,
                untilDate: newData.toNew,
                location: newData.locationNew,
                description: newData.descriptionNew,
                link: newData.linkNew,
                mmi: newData.mmiNew,
                compensation: newData.amazonNew
            });

            // TODO: space!
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
                that.transitionToRoute('userstudies').then(function () {
                    var aMessage = 'Studie \"' + name + '\" erfolgreich erstellt!';
                    that.get('controllers.userstudies').set('statusMessage', { message: aMessage, isSuccess: true });
                });
            }, function(error) {
                newStudy.deleteRecord();
                that.set('statusMessage', { message: error.responseJSON.message, isSuccess: false });
            });
        },

        cancelView: function() {
            this.transitionToRoute('userstudies');
        }
    },

    init: function() {
        this._super();
        this.set('mmiPoints', this.get('controllers.application').get('mmiValues'));
        this.set('amazonValues', this.get('controllers.application').get('amazonValues'));
    },

    statusMessage: null,

    title: null,

    fromDate: null,

    toDate: null,

    location: null,

    description: null,

    link: null,

    mmi: null,

    mmiPoints: [],

    amazon: null,

    amazonValues: [],

    executor: null,

    tutor: null,

    selectedLabels: [],

    selectedNews: [],

    registeredUsers: [],

    template: null,

    allRequiredStudies: [],

    requiredStudies: []
});
