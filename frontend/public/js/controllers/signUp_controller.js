StudyManager.SignupController = Ember.Controller.extend({
    actions: {
        validateAllAction: function() {
            this.set('isDataNotValid', false);
            this.set('isLoading', true);
            this.set('signUpDataWasValid', true);


            this.validateFirstName();
            this.validateLastName();
            this.validateEmail();
            this.validatePassword();
            this.validatePasswordConfirm();

            if (!this.get('isDataNotValid')) {
                this.doSignUp();
            } else {
                this.set('isLoading', false);
                this.set('signUpDataWasValid', false);
            }
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
        this.set('isDataNotValid', false);
        this.set('signUpSuccessful', false);
        this.set('statusMessage', null);
        this.set('isLoading', false);
        this.set('signUpDataWasValid', true);

        this.set('firstName', '');
        this.set('firstNameValidationClass', '');
        this.set('firstNameHelpText', null);

        this.set('lastName', '');
        this.set('lastNameValidationClass', '');
        this.set('lastNameHelpText', null);

        this.set('username', '');
        this.set('emailValidationClass', '');
        this.set('emailHelpText', null);

        this.set('password', '');
        this.set('passwordValidationClass', '');
        this.set('passwordHelpText', null);

        this.set('passwordConfirm', '');
        this.set('passwordConfirmValidationClass', '');
        this.set('passwordConfirmHelpText', null);

        this.set('collectsMMI', false);
        this.set('isShowingMMIHelpText', false);
    },


    doSignUp: function() {
        this.set('statusMessage', null);

        var userData = {
            "user": {
                firstname:  this.get('firstName'),
                lastname:  this.get('lastName'),
                username:  this.get('username'),
                password:  this.get('password'),
                confirmPassword:  this.get('passwordConfirm'),
                mmi: this.get('collectsMMI')
            }
        };

        var that = this;

        Ember.$.post('/api/users/signup', userData).then(function(response) {
            that.set('isLoading', false);
            that.set('signUpSuccessful', true);
        }, function(error) {
            that.set('isLoading', false);
            that.set('signUpDataWasValid', false);
            that.set('statusMessage', { message: error.responseJSON.message, isSuccess: false })
        });
    },

    validateFirstName: function() {
        if (Ember.empty(this.get('firstName'))) {
            this.set('firstNameHelpText', 'Bitte geben Sie einen Vornamen an!');
            this.set('firstNameValidationClass', 'has-error');
            this.set('isDataNotValid', true);
        } else {
            this.set('firstNameHelpText', null);
            this.set('firstNameValidationClass', 'has-success');
        }
    }.observes('firstName'),

    validateLastName: function() {
        if (Ember.empty(this.get('lastName'))) {
            this.set('lastNameHelpText', 'Bitte geben Sie einen Nachnamen an!');
            this.set('lastNameValidationClass', 'has-error');
            this.set('isDataNotValid', true);
        } else {
            this.set('lastNameHelpText', null);
            this.set('lastNameValidationClass', 'has-success');
        }
    }.observes('lastName'),

    validateEmail: function() {
        if (Ember.empty(this.get('username')) || !this.isRegularEmail(this.get('username'))) {
            this.set('emailHelpText', 'Bitte geben Sie eine Email-Adresse an!');
            this.set('emailValidationClass', 'has-error');
            this.set('isDataNotValid', true);
        } else {
            this.set('emailHelpText', null);
            this.set('emailValidationClass', 'has-success');
        }
    }.observes('username'),

    isRegularEmail: function(email) {
        var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
    },

    validatePassword: function() {
        if (this.get('password').length < 7) {
            this.set('passwordHelpText', 'Das Passwort muss mindestens 7 Zeichen enthalten!');
            this.set('passwordValidationClass', 'has-error');
            this.set('isDataNotValid', true);
        } else {
            this.set('passwordHelpText', null);
            this.set('passwordValidationClass', 'has-success');
        }
    }.observes('password'),

    validatePasswordConfirm: function() {
        if (this.get('passwordConfirm').length === 0) {
            this.set('passwordConfirmHelpText', 'Das Passwort muss mindestens 7 Zeichen enthalten!');
            this.set('passwordConfirmValidationClass', 'has-error');
            this.set('isDataNotValid', true);
        } else if (this.get('password') !== this.get('passwordConfirm')) {
            this.set('passwordConfirmHelpText', 'Die Passwörter stimmen nicht überein!');
            this.set('passwordConfirmValidationClass', 'has-error');
            this.set('isDataNotValid', true);
        } else {
            this.set('passwordConfirmHelpText', null);
            this.set('passwordConfirmValidationClass', 'has-success');
        }
    }.observes('passwordConfirm'),

    collectsMMIChanged: function() {
        this.set('isShowingMMIHelpText', this.get('collectsMMI'));
    }.observes('collectsMMI')
});
