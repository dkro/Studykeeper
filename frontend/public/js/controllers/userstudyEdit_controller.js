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
            thisStudy.set('title', newData.titleNew);
            thisStudy.set('fromDate', newData.fromNew);
            thisStudy.set('untilDate', newData.toNew);
            thisStudy.set('location', newData.locationNew);
            thisStudy.set('description', newData.descriptionNew);
            thisStudy.set('link', newData.linkNew);
            thisStudy.set('mmi', newData.mmiNew);
            thisStudy.set('amazon', newData.amazonNew);

            var that = this;
            var name = thisStudy.get('title');
            thisStudy.save().then(function(response) {
                that.transitionToRoute('userstudy').then(function () {
                    var aMessage = 'Studie \"' + name + '\" erfolgreich geändert!';
                    that.get('controllers.userstudy').set('statusMessage', { message: aMessage, isSuccess: true });
                });
            }, function(error) {
                thisStudy.rollback();
                var aMessage = 'Studie \"' + name + '\" konnte nicht geändert werden!';
                that.set('statusMessage', { message: aMessage, isSuccess: false });
            });
        },

        cancelView: function() {
            this.transitionToRoute('userstudy', this.get('model').study);
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

    amazonValues: []
});
