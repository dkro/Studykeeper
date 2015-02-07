StudyManager.TemplateController = Ember.Controller.extend({
    needs: ['application', 'templates'],

    actions: {
        deleteTemplate: function() {
            var thisTemplate = this.get('model');
            var that = this;
            var name = thisTemplate.get('title');

            if (confirm('Wollen Sie die News \"' + name + '\" wirklich löschen?')) {
                thisTemplate.deleteRecord();

                thisTemplate.save().then(function(response) {
                    that.transitionToRoute('templates').then(function () {
                        var aMessage = 'Template \"' + name + '\" erfolgreich gelöscht!';
                        that.get('controllers.templates').set('statusMessage', { message: aMessage, isSuccess: true });
                    });
                }, function(error) {
                    thisTemplate.rollback();
                    var aMessage = 'Template \"' + name + '\" konnte nicht gelöscht werden!';
                    that.set('statusMessage', { message: aMessage, isSuccess: false });
                });
            }
        },

        updateTemplate: function(newData) {
            var thisTemplate = this.get('model');
            thisTemplate.set('title', newData.titleNew);
            thisTemplate.set('fields', newData.fieldsNew);

            var that = this;
            var name = thisTemplate.get('title');
            thisTemplate.save().then(function(response) {
                that.transitionToRoute('templates').then(function () {
                    var aMessage = 'Template \"' + name + '\" erfolgreich geändert!';
                    that.get('controllers.templates').set('statusMessage', { message: aMessage, isSuccess: true });
                });
            }, function(error) {
                thisTemplate.rollback();
                that.set('statusMessage', { message: error.responseJSON.message, isSuccess: false });
            });
        },

        cancelView: function() {
            this.transitionToRoute('templates');
        }
    },

    reset: function() {
        this.set('statusMessage', null);
    },

    statusMessage: null,

    title: null,

    fields: []
});
