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
            this.set('errorMessage', null);

            newLabel.save().then(function(response) {
                that.set('newLabelValue', null);
            }, function(error) {
                that.set('errorMessage', error.responseJSON.message);
                newLabel.deleteRecord();
                that.set('newLabelValue', null);
            });
        },

        deleteLabel: function(labelId) {
            this.store.find('label', labelId).then(function (label) {
                label.deleteRecord();
                label.save().then(function(response) {
                }, function(error) {
                    label.rollback();
                })
            });
        }
    },

    errorMessage: null,

    currentlySelectedId: null,

    newLabelValue: null,

    isCreateButtonDisabled: true,

    changeCreateButtonDisabled: function() {
        this.set('isCreateButtonDisabled', Ember.empty(this.get('newLabelValue')))
    }.observes('newLabelValue')
});
