StudyManager.LabelsController = Ember.Controller.extend({
    actions: {
        setCurrentlySelectedId: function(newId) {
            this.set('currentlySelectedId', newId);
        },

        createLabel: function() {
            var newLabel = this.store.createRecord('label', {
                title: this.get('newLabelValue')
            });
            var that = this;
            this.set('statusMessage', null);

            newLabel.save().then(function(response) {
                that.set('newLabelValue', null);
                var message = 'Label \"' + newLabel.get('title') + '\" wurde erstellt!';
                that.set('statusMessage', { message: message, isSuccess: true });
            }, function(error) {
                that.set('statusMessage', { message: error.responseJSON.message, isSuccess: false });
                newLabel.deleteRecord();
                that.set('newLabelValue', null);
            });
        },

        deleteLabel: function(labelId) {
            var that = this;
            this.set('statusMessage', null);

            this.store.find('label', labelId).then(function (label) {
                label.deleteRecord();
                var name = label.get('title');
                label.save().then(function(response) {
                    var message = 'Label \"' + name + '\" wurde gelöscht!';
                    that.set('statusMessage', { message: message, isSuccess: true });
                }, function(error) {
                    label.rollback();
                    that.set('statusMessage', { message: error.responseJSON.message, isSuccess: false });
                })
            });
        }
    },

    reset: function() {
        this.set('statusMessage', null);
        this.set('currentlySelectedId', null);
        this.set('newLabelValue', null);
    },

    statusMessage: null,

    currentlySelectedId: null,

    newLabelValue: null,

    isCreateButtonDisabled: true,

    changeCreateButtonDisabled: function() {
        this.set('isCreateButtonDisabled', Ember.empty(this.get('newLabelValue')))
    }.observes('newLabelValue')
});
