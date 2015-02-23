StudyManager.TemplateController = Ember.Controller.extend({
    needs: ['application', 'templates'],

    actions: {
        deleteTemplate: function() {
            this.set('statusMessage', null);
            var thisTemplate = this.get('model');
            var that = this;
            var name = thisTemplate.get('title');

            if (confirm('Wollen Sie die News \"' + name + '\" wirklich löschen?')) {
                this.set('isDeleteLoading', true);
                thisTemplate.deleteRecord();

                thisTemplate.save().then(function(response) {
                    that.set('isDeleteLoading', false);
                    that.transitionToRoute('templates').then(function () {
                        var aMessage = 'Template \"' + name + '\" erfolgreich gelöscht!';
                        that.get('controllers.templates').set('statusMessage', { message: aMessage, isSuccess: true });
                    });
                }, function(error) {
                    thisTemplate.rollback();
                    that.set('isDeleteLoading', false);
                    that.set('statusMessage', { message: error.responseJSON.message, isSuccess: false });
                });
            }
        },

        updateTemplate: function(newData) {
            this.set('statusMessage', null);
            var fields = [];

            newData.fieldsNew.forEach(function (item) {
                fields.push(item.get('title'));
            });

            var thisTemplate = this.get('model');
            thisTemplate.set('title', newData.titleNew);
            thisTemplate.set('fields', fields);

            var that = this;
            var name = thisTemplate.get('title');
            thisTemplate.save().then(function(response) {
                that.set('isUpdateLoading', false);
                that.set('updateDataWasValid', true);
                that.transitionToRoute('templates').then(function () {
                    var aMessage = 'Template \"' + name + '\" erfolgreich geändert!';
                    that.get('controllers.templates').set('statusMessage', { message: aMessage, isSuccess: true });
                });
            }, function(error) {
                thisTemplate.rollback();
                that.set('isUpdateLoading', false);
                that.set('updateDataWasValid', false);
                that.set('statusMessage', { message: error.responseJSON.message, isSuccess: false });
            });
        },

        cancelView: function() {
            this.transitionToRoute('templates');
        }
    },

    reset: function() {
        this.set('statusMessage', null);
        this.set('isUpdateLoading', false);
        this.set('isDeleteLoading', false);
        this.set('updateDataWasValid', true);
    },

    updateDataWasValid: true,

    isUpdateLoading: false,

    isDeleteLoading: false,

    statusMessage: null,

    title: null,

    fields: []
});
