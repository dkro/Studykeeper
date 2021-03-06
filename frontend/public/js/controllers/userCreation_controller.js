StudyManager.UserCreationController = Ember.Controller.extend({
    needs: ['application', 'users'],

    actions: {
        createUser: function(newData) {
            this.set('statusMessage', null);

            var newUser = this.store.createRecord('user', {
                firstname: newData.firstnameNew,
                lastname: newData.lastnameNew,
                username: newData.usernameNew,
                mmi: newData.mmiNew,
                collectsMMI: newData.isMMIUserNew,
                role: this.get('controllers.application').toServiceRole(newData.selectedRoleNew)
            });

            var that = this;
            var name = newUser.get('username');

            newUser.save().then(function(response) {
                that.set('isLoading', false);
                that.set('createDataWasValid', true);
                that.transitionToRoute('users').then(function () {
                    that.get('controllers.users').set('statusMessage', { message: 'Nutzer \"' + name + '\" erstellt!', isSuccess: true });
                });
            }, function(error) {
                newUser.deleteRecord();
                that.set('isLoading', false);
                that.set('createDataWasValid', false);
                that.set('statusMessage', { message: error.responseJSON.message, isSuccess: false });
            });
        },

        cancelView: function() {
            this.transitionToRoute('users');
        }
    },

    init: function() {
        this._super();
        this.set('roles', this.get('controllers.application').get('roles'));

        var mmiValues = this.get('controllers.application').get('mmiValues');
        this.set('mmiValues', mmiValues);
    },

    reset: function() {
        this.set('statusMessage', null);
        this.set('isLoading', false);
        this.set('createDataWasValid', true);
    },

    firstNameInvalid: null,

    lastNameInvalid: null,

    userNameInvalid: null,

    statusMessage: null,

    mmiValues: null,

    roles: null,

    isLoading: false,

    createDataWasValid: true
});
