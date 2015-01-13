StudyManager.LabelsController = Ember.Controller.extend({
    actions: {
        setCurrentlySelectedId: function(newId) {
            this.set('currentlySelectedId', newId);
        },

        createLabel: function() {
            var newLabel = this.store.createRecord('label', {
                title: this.get('newLabelValue')
            });

            newLabel.save();

            this.set('newLabelValue', null);
        },

        deleteLabel: function(labelId) {
            this.store.find('label', labelId).then(function (label) {
                label.destroyRecord();
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
