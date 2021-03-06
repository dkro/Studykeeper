StudyManager.LabelsController = Ember.Controller.extend({
    actions: {
        createLabel: function() {
            this.set('isCreateLoading', true);
            this.set('createDataWasValid', true);

            var newLabel = this.store.createRecord('label', {
                title: this.get('newLabelValue')
            });
            var that = this;
            this.set('statusMessage', null);

            newLabel.save().then(function(response) {
                that.set('newLabelValue', null);
                that.set('isCreateLoading', false);
                var message = 'Label \"' + newLabel.get('title') + '\" wurde erstellt!';
                that.set('statusMessage', { message: message, isSuccess: true });
            }, function(error) {
                newLabel.deleteRecord();
                that.set('isCreateLoading', false);
                that.set('createDataWasValid', false);
                that.set('statusMessage', { message: error.responseJSON.message, isSuccess: false });
                that.set('newLabelValue', null);
            });
        },

        deleteLabel: function(labelId) {
            if (confirm("Wollen Sie das Label wirklich löschen?")) {
                this.set('isDeleteLoading', true);
                var that = this;
                this.set('statusMessage', null);

                this.store.find('label', labelId).then(function (label) {
                    label.deleteRecord();
                    var name = label.get('title');
                    label.save().then(function(response) {
                        that.set('isDeleteLoading', false);
                        var message = 'Label \"' + name + '\" wurde gelöscht!';
                        that.set('statusMessage', { message: message, isSuccess: true });
                    }, function(error) {
                        label.rollback();
                        that.set('isDeleteLoading', false);
                        that.set('statusMessage', { message: error.responseJSON.message, isSuccess: false });
                    })
                });
            }
        },

        goToStudy: function(study) {
            this.transitionToRoute('userstudy', study);
        }
    },

    reset: function() {
        this.set('statusMessage', null);
        this.set('newLabelValue', null);
        this.set('isDeleteLoading', false);
        this.set('isCreateLoading', false);
        this.set('createDataWasValid', true);
        this.set('isHelpTextDisplayed', false);
    },

    statusMessage: null,

    newLabelValue: null,

    isCreateButtonDisabled: true,

    isHelpTextDisplayed: false,

    isDeleteLoading: false,

    isCreateLoading: false,

    createDataWasValid: true,

    changeCreateButtonDisabled: function() {
        if (Ember.empty(this.get('newLabelValue'))) {
            this.set('isHelpTextDisplayed', false);
            this.set('isCreateButtonDisabled', true);
        } else {
            this.set('statusMessage', null);
            var shouldDisplayHelpText = (this.get('newLabelValue').length < 3);
            this.set('isHelpTextDisplayed', shouldDisplayHelpText);
            this.set('isCreateButtonDisabled', shouldDisplayHelpText);
        }
    }.observes('newLabelValue')
});
