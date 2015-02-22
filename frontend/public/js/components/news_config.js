StudyManager.NewsConfigComponent = Ember.Component.extend({
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
                dateNew: this.get('date'),
                descriptionNew: this.get('description'),
                linkNew: this.get('link')
            };

            this.resetValidation();

            if (this.isValid(params)) {
                this.sendAction('save', params);
            } else {
                this.set('isSaveLoading', true);
                this.set('createUpdateDataWasValid', false);
            }
        }
    },

    isValid: function(data) {
        var isValid = true;

        if (Ember.empty(data.titleNew)) {
            this.set('titleInvalid', 'Der Titel darf nicht leer sein!')
            isValid = false;
        }

        if (Ember.empty(data.dateNew)) {
            this.set('dateInvalid', 'Bitte geben Sie ein Datum an!')
            isValid = false;
        }

        if (Ember.empty(data.descriptionNew)) {
            this.set('descriptionInvalid', 'Bitte geben Sie eine Beschreibung an!')
            isValid = false;
        }

        if (Ember.empty(data.linkNew)) {
            this.set('linkInvalid',  'Bitte geben Sie einen Link an!')
            isValid = false;
        }

        return isValid;
    },

    resetValidation: function() {
        this.set('titleInvalid', null);
        this.set('dateInvalid', null);
        this.set('descriptionInvalid', null);
        this.set('linkInvalid', null);
    },


    isNewsCreation: false,

    isSaveLoading: false,

    isCancelLoading: false,

    createUpdateDataWasValid: true,

    title: null,

    date: null,

    description: null,

    link: null,

    titleInvalid: null,

    dateInvalid: null,

    descriptionInvalid: null,

    linkInvalid: null
});