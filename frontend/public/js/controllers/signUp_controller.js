StudyManager.SignupController = Ember.Controller.extend({
    actions: {
        validateAllAction: function() {
            this.validateFirstName();
            this.validateLastName();
            this.validateEmail();
            this.validatePassword();
            this.validatePasswordConfirm();
        },

        validateFirstNameAction: function() {
            this.validateFirstName();
        },

        validateLastNameAction: function() {
            this.validateLastName();
        },

        validateEmailAction: function() {
            this.validateEmail();
        },

        validatePasswordAction: function() {
            this.validatePassword();
        },

        validatePasswordConfirmAction: function() {
            this.validatePasswordConfirm();
        }
    },

    reset: function() {
        // Properties are created the first time this method is called (usually from the according route) if they're not
        // already existing! If they're already existing, only their values will be reset.
        this.set('firstName', "");
        this.set('firstNameValidationClass', "");
        this.set('firstNameHelpText', null);

        this.set('lastName', "");
        this.set('lastNameValidationClass', "");
        this.set('lastNameHelpText', null);

        this.set('email', "");
        this.set('emailValidationClass', "");
        this.set('emailHelpText', null);

        this.set('password', "");
        this.set('passwordValidationClass', "");
        this.set('passwordHelpText', null);

        this.set('passwordConfirm', "");
        this.set('passwordConfirmValidationClass', "");
        this.set('passwordConfirmHelpText', null);
    },

    validateFirstName: function() {
        if (Ember.empty(this.firstName)) {
            this.set('firstNameHelpText', "Vorname darf nicht leer sein!");
            this.set('firstNameValidationClass', "has-error");
        } else {
            this.set('firstNameHelpText', null);
            this.set('firstNameValidationClass', "has-success");
        }
    }.observes('firstName'),

    validateLastName: function() {
        if (Ember.empty(this.lastName)) {
            this.set('lastNameHelpText', "Name darf nicht leer sein!");
            this.set('lastNameValidationClass', "has-error");
        } else {
            this.set('lastNameHelpText', null);
            this.set('lastNameValidationClass', "has-success");
        }
    }.observes('lastName'),

    validateEmail: function() {
        if (Ember.empty(this.email)) {
            this.set('emailHelpText', "Dies ist keine zulässige Email!");
            this.set('emailValidationClass', "has-error");
        } else {
            this.set('emailHelpText', null);
            this.set('emailValidationClass', "has-success");
        }
    }.observes('email'),

    validatePassword: function() {
        if (this.password.length < 7) {
            this.set('passwordHelpText', "Das Passwort muss mindestens 7 Zeichen enthalten!");
            this.set('passwordValidationClass', "has-error");
        } else {
            this.set('passwordHelpText', null);
            this.set('passwordValidationClass', "has-success");
        }
    }.observes('password'),

    validatePasswordConfirm: function() {
        if (this.passwordConfirm.length === 0) {
            this.set('passwordConfirmHelpText', "Das Passwort muss mindestens 7 Zeichen enthalten!");
            this.set('passwordConfirmValidationClass', "has-error");
        } else if (this.password !== this.passwordConfirm) {
            this.set('passwordConfirmHelpText', "Die Passwörter stimmen nicht überein!");
            this.set('passwordConfirmValidationClass', "has-error");
        } else {
            this.set('passwordConfirmHelpText', null);
            this.set('passwordConfirmValidationClass', "has-success");
        }
    }.observes('passwordConfirm')
});
