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

            this.sendAction('save', params);
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

    isUserCreation: false,

    firstName: null,

    lastName: null,

    userName: null,

    selectedMMI: null
});