StudyManager.StudyConfigComponent = Ember.Component.extend({
    actions: {
        cancelClick: function() {
            this.set('isCancelLoading', true);
            this.sendAction('cancel');
        },

        saveClick: function() {
            this.set('isSaveLoading', true);
            this.set('createUpdateDataWasValid', true);

            var values = [];

            this.get('templateFieldsToValue').forEach(function(item, index) {
                values.pushObject(item.get('value'));
            });

            var params = {
                titleNew: this.get('title'),
                fromNew: this.get('fromDate'),
                toNew: this.get('toDate'),
                locationNew: this.get('location'),
                descriptionNew: this.get('description'),
                linkNew: this.get('link'),
                amazonNew: this.get('amazon'),
                mmiNew: this.get('mmi'),
                capacityNew: this.get('capacity'),
                templateValuesNew: values
            };

            this.resetValidation();

            if (this.isValid(params)) {
                this.sendAction('save', params);
            } else {
                this.set('isSaveLoading', false);
                this.set('createUpdateDataWasValid', false);
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
        } else if (!Ember.empty(data.toNew)) {
            if (this.compare(data.fromNew, data.toNew) > 0) {
                isValid = false;
                this.set('fromDateInvalid', 'Das Beginndatum muss vor dem Enddatum liegen!');
            }
        }

        if (Ember.empty(data.toNew)) {
            this.set('toDateInvalid', 'Bitte geben Sie ein Ende für den Zeitraum an!');
            isValid = false;
        } else if (!Ember.empty(data.fromDate)) {
            if (this.compare(data.fromNew, data.toNew) > 0) {
                isValid = false;
                this.set('toDateInvalid', 'Das Enddatum muss nach dem Beginndatum folgen!');
            }
        }

        if (Ember.empty(data.locationNew)) {
            this.set('locationInvalid', 'Bitte geben Sie einen Ort für die Studie an!');
            isValid = false;
        }

        if (Ember.empty(data.descriptionNew)) {
            this.set('descriptionInvalid', 'Bitte geben Sie eine Beschreibung an!');
            isValid = false;
        }

        if (Ember.empty(data.linkNew)) {
            this.set('linkInvalid', 'Bitte geben Sie einen Link zur Studie an!');
            isValid = false;
        }

        if (Ember.empty(data.capacityNew)) {
            this.set('spaceInvalid', 'Bitte geben Sie die maximale Anzahl an Teilnehmern an!');
            isValid = false;
        } else {
            var parsedNumber = parseInt(data.capacityNew);

            if (isNaN(parsedNumber)) {
                this.set('spaceInvalid', 'Bitte geben Sie eine ganze Zahl für die Studienkapazität an!');
                isValid = false;
            }
        }

        this.set('isValidState', isValid);

        return isValid;
    },

    init: function() {
        this._super();
        this.templateChanged();
    },

    resetValidation: function() {
        this.set('titleInvalid', null);
        this.set('fromDateInvalid', null);
        this.set('toDateInvalid', null);
        this.set('locationInvalid', null);
        this.set('descriptionInvalid', null);
        this.set('linkInvalid', null);
        this.set('spaceInvalid', null);
    },

    parseDate: function(input) {
        var parts = input.match(/(\d+)/g);
        return new Date(parts[2], parts[1]-1, parts[0], 12, 0, 0, 0);
    },

    compare: function(date1, date2) {
        //  -1 : if a < b
        //   0 : if a = b
        //   1 : if a > b
        return (
            isFinite(date1=this.parseDate(date1).valueOf()) &&
            isFinite(date2=this.parseDate(date2).valueOf()) ?
            (date1>date2)-(date1<date2) :
                NaN
        );
    },


    isValidState: true,

    isStudyCreation: false,

    isSaveLoading: false,

    isCancelLoading: false,

    createUpdateDataWasValid: true,

    isTutorUser: false,

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

    spaceInvalid: null,

    capacity: 0,

    labels: [],

    selectedLabels: [],

    news: [],

    selectedNews: [],

    users: [],

    possibleTutors: [],

    possibleExecutors: [],

    usersChanged: function() {
        var allTutors = this.get('users').filter(function(user) {
            return user.get('role') === 'tutor';
        });

        var allExecutors = this.get('users').filter(function(user) {
            return user.get('role') === 'executor';
        });

        this.set('possibleTutors', allTutors);
        this.set('possibleExecutors', allExecutors);
    },

    registeredUsers: [],

    templates: [],

    template: null,

    templateChanged: function () {
        var fieldsToValues = [];
        var vals = this.get('templateValues');
        var newVals = [];
        var that = this;

        if (!Ember.empty(this.get('template'))) {
            this.get('template').get('fields').forEach(function(field, index) {
                if (Ember.empty(vals)) {
                    var val = '';
                } else {
                    var val = vals.objectAt(index) === undefined ? '' : vals.objectAt(index);
                }

                var entry = StudyManager.Field.create();
                entry.set('title', field);
                entry.set('value', val);

                newVals.pushObject(val);
                fieldsToValues.pushObject(entry);
            });
        }

        that.set('templateValues', vals);
        that.set('templateFieldsToValue', fieldsToValues);
    }.observes('template'),

    templateValues: [],

    templateFieldsToValue: [],

    executor: null,

    tutor: null,

    allRequiredStudies: [],

    requiredStudies: []
});