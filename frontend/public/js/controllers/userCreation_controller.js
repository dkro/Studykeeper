StudyManager.UserCreationController = Ember.Controller.extend({
    needs: ['application', 'users'],

    actions: {
        createUser: function(newData) {
            var newUser = this.store.createRecord('user', {
                firstname: newData.firstnameNew,
                lastname: newData.lastnameNew,
                username: newData.usernameNew,
                password: '1234567',
                mmi: newData.mmiNew,
                collectsMMI: newData.isMMIUserNew,
                role: newData.selectedRoleNew
            });

            var that = this;
            var name = newUser.get('username');

            newUser.save().then(function(response) {
                that.transitionToRoute('users').then(function () {
                    that.get('controllers.users').set('statusMessage', { message: 'Nutzer \"' + name + '\" erstellt!', isSuccess: true });
                });
            }, function(error) {
                newUser.deleteRecord();
                that.set('statusMessage', { message: 'Nutzer konnte nicht erstellt werden!', isSuccess: false });
            });
        },

        cancelView: function() {
            this.transitionToRoute('users');
        }
    },

    init: function() {
        this._super();
        this.set('roles', this.get('controllers.application').get('roles'));
        this.set('mmiValues', this.get('controllers.application').get('mmiValues'));
    },

    firstNameInvalid: null,

    lastNameInvalid: null,

    userNameInvalid: null,

    statusMessage: null,

    mmiValues: null,

    roles: null
});
