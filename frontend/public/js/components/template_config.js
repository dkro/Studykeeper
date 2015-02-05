StudyManager.TemplateConfigComponent = Ember.Component.extend({
    actions: {
        cancelClick: function() {
            this.sendAction('cancel');
        },

        saveClick: function() {
            var params = {
                titleNew: this.get('title'),
                fieldsNew: this.get('fields')
            };

            this.resetValidation();

            if (this.isValid(params)) {
                this.sendAction('save', params);
            }
        },

        addField: function() {
            this.sendAction('add');
        },

        removeField: function(field) {
            this.sendAction('remove', field);
        },

        removePersistedField: function(field) {
            this.get('persistedFields').removeObject(field);
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

    persistedFields: [],

    notPersistedFields: [],

    fieldsChanged: function() {
        this.set('hasFields', !Ember.empty(this.get('persistedFields')) && !Ember.empty(this.get('notPersistedFields')));
    }.observes('persistedFields', 'notPersistedFields'),

    hasFields: false
});