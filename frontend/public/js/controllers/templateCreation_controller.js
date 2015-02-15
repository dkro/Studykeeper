StudyManager.TemplateCreationController = Ember.ArrayController.extend({
    needs: ['application', 'templates'],

    actions: {
        createTemplate: function(newData) {
            var newTemplate = this.store.createRecord('template', {
                title: newData.titleNew,
                fields: newData.fieldsNew
            });

            var that = this;
            var name = newTemplate.get('title');

            newTemplate.save().then(function(response) {
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
