StudyManager.TemplateCreationController = Ember.ArrayController.extend({
    needs: ['application', 'templates'],

    actions: {
        createTemplate: function(newData) {
            var usedFields = [];

            newData.fieldsNew.forEach(function(field, index) {
                var addedField = {
                    title: field.get('title'),
                    value: field.get('value')
                };

                usedFields.push(addedField);
            });

            var newTemplate = this.store.createRecord('template', {
                title: newData.titleNew,
                fields: usedFields
            });

            var that = this;
            var name = newTemplate.get('title');

            newTemplate.save().then(function(response) {
                that.store.find('template').filterBy('id', null).forEach(function(item) {
                    item.deleteRecord();
                });

                that.transitionToRoute('templates').then(function () {
                    that.get('controllers.templates').set('statusMessage', { message: 'Template \"' + name + '\" erstellt!', isSuccess: true });
                });
            }, function(error) {
                newTemplate.deleteRecord();
                that.set('statusMessage', { message: error.responseJSON.message, isSuccess: false });
            });
        },

        cancelView: function() {
            this.transitionToRoute('templates');
        }
    },

    statusMessage: null
});
