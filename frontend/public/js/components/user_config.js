StudyManager.UserConfigComponent = Ember.Component.extend({
    actions: {
        cancelClick: function() {
            this.sendAction('cancel');
        },

        saveClick: function() {
            var params = {
                usernameNew: this.get('userName'),
                firstnameNew: this.get('firstName'),
                lastnameNew: this.get('lastName'),
                mmiNew: this.get('selectedMMI')
            };

            this.resetValidation();

            if (this.isValid(params)) {
                this.sendAction('save', params);
            }
        }
    },

    init: function () {
        this._super();
        this.reset();
    },

    reset: function() {
        var mmiPoints = [];

        for (var i = 0; i <= 20; i++) {
            mmiPoints[i] = i;
        }

        this.set('mmiOptions', mmiPoints);
    },


    isValid: function(data) {
        var isValid = true;

        if (Ember.empty(data.firstnameNew)) {
            this.set('firstNameInvalid', 'Der Vorname darf nicht leer sein!')
            isValid = false;
        }

        if (Ember.empty(data.lastnameNew)) {
            this.set('lastNameInvalid', 'Der Nachname darf nicht leer sein!')
            isValid = false;
        }

        if (!this.isRegularEmail(data.usernameNew)) {
            this.set('userNameInvalid',  'Bitte geben Sie eine Email-Adresse an!')
            isValid = false;
        }

        return isValid;
    },

    isRegularEmail: function(email) {
        var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
    },

    resetValidation: function() {
        this.set('firstNameInvalid', null);
        this.set('lastNameInvalid', null);
        this.set('userNameInvalid', null);
    },

    isUserCreation: false,

    firstName: null,

    lastName: null,

    userName: null,

    selectedMMI: null,

    firstNameInvalid: null,

    lastNameInvalid: null,

    userNameInvalid: null
});