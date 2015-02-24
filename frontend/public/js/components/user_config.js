StudyManager.UserConfigComponent = Ember.Component.extend({
    actions: {
        cancelClick: function() {
            this.set('isCancelLoading', true);
            this.sendAction('cancel');
        },

        saveClick: function() {
            this.set('isSaveLoading', true);
            this.set('createUpdateDataWasValid', true);

            var params = {
                usernameNew: this.get('userName'),
                firstnameNew: this.get('firstName'),
                lastnameNew: this.get('lastName'),
                mmiNew: this.get('selectedMMI'),
                isMMIUserNew: this.get('isMMIUser'),
                selectedRoleNew: this.get('selectedRole')
            };

            this.resetValidation();

            if (this.isValid(params)) {
                this.sendAction('save', params);
            } else {
                this.set('isSaveLoading', false);
                this.set('createUpdateDataWasValid', false);
            }
        },

        studyClick: function(study) {
            this.sendAction('clickOnStudy', study);
        }
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

    isSaveLoading: false,

    isCancelLoading: false,

    createUpdateDataWasValid: true,

    firstName: null,

    lastName: null,

    userName: null,

    selectedMMI: 0,

    isMMIUser: false,

    selectedRole: null,

    roles: null,

    mmiOptions: null,

    tutoredStudies: [],

    registeredStudies: [],

    executedStudies: [],

    firstNameInvalid: null,

    lastNameInvalid: null,

    userNameInvalid: null
});