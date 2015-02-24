StudyManager.TemplateConfigComponent = Ember.Component.extend({
    actions: {
        cancelClick: function() {
            this.set('isCancelLoading', true);
            this.sendAction('cancel');
        },

        saveClick: function() {
            this.set('isSaveLoading', true);
            this.set('createUpdateDataWasValid', true);

            var params = {
                titleNew: this.get('title'),
                fieldsNew: this.get('fields')
            };

            this.resetValidation();

            if (this.isValid(params)) {
                this.sendAction('save', params);
            } else {
                this.set('isSaveLoading', false);
                this.set('createUpdateDataWasValid', false);
            }
        },

        addField: function() {
            var field = StudyManager.Tfield.create();
            field.set('title', '');

            this.get('fields').pushObject(field);
        },

        removeField: function(field) {
            this.get('fields').removeObject(field);
        },

        studyClick: function(study) {
            this.sendAction('clickOnStudy', study);
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

    isSaveLoading: false,

    isCancelLoading: false,

    createUpdateDataWasValid: true,

    title: null,

    relatedStudies: [],

    fields: [],

    fieldsChanged: function() {
        this.set('hasFields', !Ember.empty(this.get('fields')));
    }.observes('fields'),

    hasFields: false
});