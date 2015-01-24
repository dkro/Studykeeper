StudyManager.SingleNewsController = Ember.Controller.extend({
    needs: ['application', 'news'],

    actions: {
        deleteUser: function() {
            /*var thisUser = this.get('model');
            var that = this;
            var name = thisUser.get('username');


            thisUser.deleteRecord();

            thisUser.save().then(function(response) {
                that.transitionToRoute('users').then(function () {
                    var aMessage = 'Nutzer \"' + name + '\" erfolgreich gelöscht!';
                    that.get('controllers.users').set('statusMessage', { message: aMessage, isSuccess: true });
                });
            }, function(error) {
                thisUser.rollback();
                var aMessage = 'Nutzer \"' + name + '\" konnte nicht gelöscht werden!';
                that.set('statusMessage', { message: aMessage, isSuccess: false });
            });*/
        },

        updateUser: function(newData) {
            /*var thisUser = this.get('model');
            thisUser.set('username', newData.usernameNew);
            thisUser.set('firstname', newData.firstnameNew);
            thisUser.set('lastname', newData.lastnameNew);
            thisUser.set('mmi', newData.mmiNew);
            thisUser.set('collectsMMI', newData.isMMIUserNew);
            thisUser.set('role', newData.selectedRoleNew);

            var that = this;
            var name = thisUser.get('username');
            thisUser.save().then(function(response) {
                that.transitionToRoute('users').then(function () {
                    var aMessage = 'Nutzer \"' + name + '\" erfolgreich geändert!';
                    that.get('controllers.users').set('statusMessage', { message: aMessage, isSuccess: true });
                });
            }, function(error) {
                thisUser.rollback();
                var aMessage = 'Nutzer \"' + name + '\" konnte nicht geändert werden!';
                that.set('statusMessage', { message: aMessage, isSuccess: false });
            });*/
        },

        cancelView: function() {
            this.transitionToRoute('news');
        }
    },

    init: function() {
        this._super();
    },

    statusMessage: null,

    title: null,

    date: null,

    description: null,

    link: null
});
