StudyManager.LabelsController = Ember.Controller.extend({
    actions: {
        setCurrentlySelectedId: function(newId) {
            this.set('currentlySelectedId', newId);
        },

        createLabel: function() {
            this.store.createRecord('label', {
                title: this.get('newLabelValue')
            });

            this.set('newLabelValue', null);
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
