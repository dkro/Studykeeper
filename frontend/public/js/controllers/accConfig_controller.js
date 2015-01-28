StudyManager.AccConfigController = Ember.Controller.extend({
    actions: {
        showPasswordEdit: function() {
            this.set('isEditIcon', false);
        },

        validatePasswordChange: function() {
            this.resetValidation();
            var errorTexts = [];
            var index = 0;

            if (Ember.empty(this.get('oldPassword'))) {
                errorTexts[index] = "Ihr altes Passwort kann nicht leer sein!";
                index++;
                this.set('isOldPasswordValid', false);
            }

            if (this.get('newPassword') === null || this.get('newPassword').length < 7) {
                errorTexts[index] = 'Das Passwort muss mindestens 7 Zeichen enthalten!';
                index++;
                this.set('isNewPasswordValid', false);
            }

            if (this.get('newPasswordConfirm') === null || this.get('newPassword') !== this.get('newPasswordConfirm')) {
                errorTexts[index] = 'Die Passwörter stimmen nicht überein!';
                index++;
                this.set('isNewPasswordConfirmValid', false);
            }

            this.set('passwordValidationMessages', errorTexts);

            if (Ember.empty(this.get('passwordValidationMessages'))) {
                this.doPasswordChange();
            }
        }
    },

    doPasswordChange: function () {
        var thisUser = this.get('model');
        thisUser.set('password', this.get('newPassword'));

        var that = this;
        thisUser.save().then(function(response) {
            that.set('isEditIcon', true);
            that.set('statusMessage', { message: 'Passwort erfolgreich geändert!', isSuccess: true });
        }, function(error) {
            thisUser.rollback();
            that.set('statusMessage', { message: 'TODO: Password Change failed!', isSuccess: false });
        });
    },

    reset: function() {
        // Properties are created the first time this method is called (usually from the according route) if they're not
        // already existing! If they're already existing, only their values will be reset.
        this.set('isEditIcon', true);
        this.set('oldPassword', null);
        this.set('newPassword', null);
        this.set('newPasswordConfirm', null);
        this.set('statusMessage', null);
        this.resetValidation();
    },

    resetValidation: function() {
        this.set('isOldPasswordValid', true);
        this.set('isNewPasswordValid', true);
        this.set('isNewPasswordConfirmValid', true);
        this.set('passwordValidationMessages', []);
    }
});
