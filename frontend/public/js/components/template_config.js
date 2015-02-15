StudyManager.TemplateConfigComponent = Ember.Component.extend({
    actions: {
        cancelClick: function() {
            this.sendAction('cancel');
        },

        saveClick: function() {
            var fields = [];
            this.get('fields').forEach(function (item) {
                fields.push(item.get('title'));
            });

            var params = {
                titleNew: this.get('title'),
                fieldsNew: fields
            };

            this.resetValidation();

            if (this.isValid(params)) {
                this.sendAction('save', params);
            }
        },

        addField: function() {
            var field = StudyManager.Tfield.create();
            field.set('title', '');

            this.get('fields').pushObject(field);
        },

        removeField: function(field) {
            this.get('fields').removeObject(field);
        }
    },

    isValid: function(data) {
        var isValid = true;

        if (Ember.empty(data.titleNew)) {
            this.set('titleInvalid', 'Der Titel darf nicht leer sein!');
            isValid = false;
        }

        return isValid;
    },

    resetValidation: function() {
        this.set('titleInvalid', null);
    },


    isTemplateCreation: false,

    title: null,

    fields: [],

    fieldsChanged: function() {
        this.set('hasFields', !Ember.empty(this.get('fields')));
    }.observes('fields'),

    hasFields: false
});