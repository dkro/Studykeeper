StudyManager.TemplateCreationController = Ember.ArrayController.extend({
    needs: ['application', 'templates'],

    actions: {
        createTemplate: function(newData) {
            this.set('statusMessage', null);
            var fields = [];

            newData.fieldsNew.forEach(function (item) {
                fields.push(item.get('title'));
            });

            var newTemplate = this.store.createRecord('template', {
                title: newData.titleNew,
                fields: fields
            });

            var that = this;
            var name = newTemplate.get('title');

            newTemplate.save().then(function(response) {
                that.set('isLoading', false);
                that.set('createDataWasValid', true);
                that.transitionToRoute('templates').then(function () {
                    that.get('controllers.templates').set('statusMessage', { message: 'Template \"' + name + '\" erstellt!', isSuccess: true });
                });
            }, function(error) {
                newTemplate.deleteRecord();
                that.set('isLoading', false);
                that.set('createDataWasValid', false);
                that.set('statusMessage', { message: error.responseJSON.message, isSuccess: false });
            });
        },

        cancelView: function() {
            this.transitionToRoute('templates');
        }
    },

    reset: function() {
        this.set('statusMessage', null);
        this.set('fields', []);
        this.set('isLoading', false);
        this.set('createDataWasValid', true);
    },

    isLoading: false,

    createDataWasValid: true,

    statusMessage: null,

    fields: []
});
