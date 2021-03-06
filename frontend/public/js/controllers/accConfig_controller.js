StudyManager.AccConfigController = Ember.Controller.extend({
    actions: {
        showPasswordEdit: function() {
            this.set('isEditIcon', false);
        },

        validatePasswordChange: function() {
            this.set('isLoading', true);
            this.set('savingDataWasValid', true);
            this.resetValidation();
            var errorTexts = [];
            var index = 0;

            if (Ember.empty(this.get('oldPassword'))) {
                errorTexts[index] = "Geben Sie Ihr altes Passwort an!";
                index++;
                this.set('isOldPasswordValid', false);
            }

            if (this.get('newPassword') === null || this.get('newPassword').length < 7) {
                errorTexts[index] = 'Das Passwort muss mindestens 7 Zeichen enthalten!';
                index++;
                this.set('isNewPasswordValid', false);
            }

            if (this.get('newPasswordConfirm') === null || this.get('newPassword') !== this.get('newPasswordConfirm')) {
                errorTexts[index] = 'Die neuen Passwörter stimmen nicht überein!';
                this.set('isNewPasswordConfirmValid', false);
            }

            this.set('passwordValidationMessages', errorTexts);

            if (Ember.empty(this.get('passwordValidationMessages'))) {
                this.doPasswordChange();
            } else {
                this.set('isLoading', false);
                this.set('savingDataWasValid', false);
            }
        }
    },

    doPasswordChange: function () {
        this.set('statusMessage', null);
        var userId = this.get('model').get('id');
        var that = this;

        var payload = {
            oldPassword: this.get('oldPassword'),
            newPassword: this.get('newPassword'),
            newPasswordConfirmation: this.get('newPasswordConfirm')
        };

        Ember.$.ajax({
            url: '/api/users/' + userId + '/changePassword',
            type: "POST",
            data: payload,
            beforeSend: function(request) {
                request.setRequestHeader('Authorization', 'Bearer ' + localStorage.token)
            }
        }).then(
            function(response) {
                that.set('isLoading', false);
                that.set('savingDataWasValid', true);
                that.set('oldPassword', null);
                that.set('newPassword', null);
                that.set('newPasswordConfirm', null);
                that.set('isEditIcon', true);
                that.set('statusMessage', { message: 'Passwort erfolgreich geändert!', isSuccess: true });
            },
            function(error) {
                that.set('isLoading', false);
                that.set('savingDataWasValid', false);
                that.set('statusMessage', { message: error.responseJSON.message, isSuccess: false });
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
        this.set('savingDataWasValid', true);
        this.set('isLoading', false);
        this.resetValidation();
    },

    resetValidation: function() {
        this.set('isOldPasswordValid', true);
        this.set('isNewPasswordValid', true);
        this.set('isNewPasswordConfirmValid', true);
        this.set('passwordValidationMessages', []);
    }
});
