StudyManager.UserController = Ember.Controller.extend({
    needs: 'users',

    actions: {
        deleteUser: function() {
            var thisUser = this.get('model');
            thisUser.deleteRecord();
            thisUser.save().then(function(response) {

            }, function(error) {
                thisUser.rollback();
            });
        },

        updateUser: function(newData) {
            var thisUser = this.get('model');
            thisUser.set('username', newData.usernameNew);
            thisUser.set('firstname', newData.firstnameNew);
            thisUser.set('lastname', newData.lastnameNew);
            thisUser.set('mmi', newData.mmiNew);

            var that = this;
            thisUser.save().then(function(response) {
                that.transitionToRoute('users').then(function () {
                    that.get('controllers.users').set('statusMessage', { message: 'Nutzer erfolgreich gespeichert!', isSuccess: true });
                });
            }, function(error) {
                thisUser.rollback();
                that.set('statusMessage', { message: 'Nutzer konnte nicht gespeichert werden!', isSuccess: false })
            });
        },

        cancelView: function() {
            this.transitionToRoute('users');
        }
    },

    statusMessage: null,

    firstName: null,

    lastName: null,

    userName: null,

    mmiPoints: null
});
