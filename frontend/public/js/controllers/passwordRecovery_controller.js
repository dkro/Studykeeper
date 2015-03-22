StudyManager.PasswordRecoveryController = Ember.Controller.extend({
    actions: {
        recoverPassword: function() {
            this.set('statusMessage', null);
            this.set('sentDataWasValid', true);
            this.set('isLoading', true);
            this.set('sendButtonDisabled', true);
            var that = this;
            var payload = { userEmail: this.get('userEmail')};

            if (this.emailIsValid()) {
                Ember.$.post('/api/users/recovery', payload).then(function(response) {
                    that.set('isLoading', false);
                    that.set('sendButtonDisabled', false);
                    that.set('passwordRecoverySuccessful', true);
                }, function(error) {
                    that.set('statusMessage', { message: error.responseJSON.message, isSuccess: false })
                    that.set('sentDataWasValid', false);
                    that.set('isLoading', false);
                    that.set('sendButtonDisabled', false);
                });
            } else {
                this.set('sentDataWasValid', false);
                this.set('isLoading', false);
                this.set('sendButtonDisabled', false);
                this.set('statusMessage', { message: 'Geben Sie bitte eine valide Email Adresse an!', isSuccess: false });
            }
        }
    },

    emailIsValid: function() {
        var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(this.get('userEmail'));
    },

    reset: function() {
        this.set('statusMessage', null);
        this.set('userEmail', null);
        this.set('sendButtonDisabled', true);
        this.set('passwordRecoverySuccessful', false);
        this.set('sentDataWasValid', true);
        this.set('isLoading', false);
    },

    statusMessage: null,

    userEmail: null,

    sendButtonDisabled: true,

    changeSendButtonDisabled: function() {
        this.set('sendButtonDisabled', Ember.empty(this.get('userEmail')))
    }.observes('userEmail'),

    passwordRecoverySuccessful: false,

    sentDataWasValid: true,

    isLoading: false
});
