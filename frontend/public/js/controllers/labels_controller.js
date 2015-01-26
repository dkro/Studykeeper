StudyManager.LabelsController = Ember.Controller.extend({
    actions: {
        createLabel: function() {
            var newLabel = this.store.createRecord('label', {
                title: this.get('newLabelValue')
            });
            var that = this;
            this.set('statusMessage', null);

            newLabel.save().then(function(response) {
                that.send('refreshLabels');
                that.set('newLabelValue', null);
                var message = 'Label \"' + newLabel.get('title') + '\" wurde erstellt!';
                that.set('statusMessage', { message: message, isSuccess: true });
            }, function(error) {
                that.set('statusMessage', { message: error.responseJSON.errors[0].message, isSuccess: false });
                newLabel.deleteRecord();
                that.set('newLabelValue', null);
                that.send('refreshLabels');
            });
        },

        deleteLabel: function(labelId) {
            if (confirm("Wollen Sie das Label wirklich löschen?")) {
                var that = this;
                this.set('statusMessage', null);

                this.store.find('label', labelId).then(function (label) {
                    label.deleteRecord();
                    var name = label.get('title');
                    label.save().then(function(response) {
                        that.send('refreshLabels');
                        var message = 'Label \"' + name + '\" wurde gelöscht!';
                        that.set('statusMessage', { message: message, isSuccess: true });
                    }, function(error) {
                        label.rollback();
                        that.set('statusMessage', { message: error.responseJSON.errors[0].message, isSuccess: false });
                        that.send('refreshLabels');
                    })
                });
            }
        }
    },

    reset: function() {
        this.set('statusMessage', null);
        this.set('newLabelValue', null);
    },

    statusMessage: null,

    newLabelValue: null,

    isCreateButtonDisabled: true,

    changeCreateButtonDisabled: function() {
        this.set('isCreateButtonDisabled', Ember.empty(this.get('newLabelValue')))
    }.observes('newLabelValue')
});
