StudyManager.UserCreationController = Ember.Controller.extend({
    needs: 'users',
    
    actions: {
        createUser: function(newData) {
            var newUser = this.store.createRecord('user', {
                firstname: newData.firstnameNew,
                lastname: newData.lastnameNew,
                username: newData.usernameNew,
                password: '1234567',
                mmi: newData.mmiNew
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

    statusMessage: null
});
