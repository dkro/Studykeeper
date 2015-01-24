StudyManager.NewsConfigComponent = Ember.Component.extend({
    actions: {
        cancelClick: function() {
            this.sendAction('cancel');
        },

        saveClick: function() {
            /*var params = {
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
            }*/
        }
    },

    isValid: function(data) {
        return true;
    },

    isRegularEmail: function(email) {
        var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
    },

    resetValidation: function() {
        this.set('titleInvalid', null);
        this.set('dateInvalid', null);
        this.set('descriptionInvalid', null);
        this.set('linkInvalid', null);
    },


    isNewsCreation: false,

    title: null,

    date: null,

    description: null,

    link: null,

    titleInvalid: null,

    dateInvalid: null,

    descriptionInvalid: null,

    linkInvalid: null
});