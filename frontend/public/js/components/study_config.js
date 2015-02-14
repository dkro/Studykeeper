StudyManager.StudyConfigComponent = Ember.Component.extend({
    actions: {
        cancelClick: function() {
            this.sendAction('cancel');
        },

        saveClick: function() {
            var params = {
                titleNew: this.get('title'),
                fromNew: this.get('fromDate'),
                toNew: this.get('toDate'),
                locationNew: this.get('location'),
                descriptionNew: this.get('description'),
                linkNew: this.get('link'),
                amazonNew: this.get('amazon'),
                mmiNew: this.get('mmi'),
                capacityNew: this.get('capacity')
            };

            this.resetValidation();

            if (this.isValid(params)) {
                this.sendAction('save', params);
            }
        }
    },

    isValid: function(data) {
        var isValid = true;

        if (Ember.empty(data.titleNew)) {
            this.set('titleInvalid', 'Der Titel darf nicht leer sein!');
            isValid = false;
        }

        if (Ember.empty(data.fromNew)) {
            this.set('fromDateInvalid', 'Bitte geben Sie einen Beginn für den Zeitraum an!');
            isValid = false;
        }

        if (Ember.empty(data.toNew)) {
            this.set('toDateInvalid', 'Bitte geben Sie ein Ende für den Zeitraum an!');
            isValid = false;
        }

        if (Ember.empty(data.locationNew)) {
            this.set('locationInvalid', 'Bitte geben Sie einen Ort für die Studie an!');
            isValid = false;
        }

        if (Ember.empty(data.descriptionNew)) {
            this.set('descriptionInvalid', 'Bitte geben Sie eine Beschreibung an!');
            isValid = false;
        }

        return isValid;
    },

    resetValidation: function() {
        this.set('titleInvalid', null);
        this.set('fromDateInvalid', null);
        this.set('toDateInvalid', null);
        this.set('locationInvalid', null);
        this.set('descriptionInvalid', null);
        this.set('linkInvalid', null);
    },


    isStudyCreation: false,

    title: null,

    fromDate: null,

    toDate: null,

    location: null,

    description: null,

    link: null,

    amazon: null,

    mmi: null,

    mmiPoints: [],

    amazonValues: [],

    titleInvalid: null,

    fromDateInvalid: null,

    toDateInvalid: null,

    locationInvalid: null,

    descriptionInvalid: null,

    linkInvalid: null,

    capacity: 0,

    labels: [],

    selectedLabels: [],

    news: [],

    selectedNews: [],

    users: [],

    registeredUsers: [],

    templates: [],

    template: null,

    executor: null,

    tutor: null,

    allRequiredStudies: [],

    requiredStudies: []
});