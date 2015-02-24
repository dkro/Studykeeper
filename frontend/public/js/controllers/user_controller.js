StudyManager.UserController = Ember.Controller.extend({
    needs: ['application', 'users'],

    actions: {
        deleteUser: function() {
            this.set('statusMessage', null);
            var thisUser = this.get('model');
            var that = this;
            var name = thisUser.get('username');

            if (confirm('Wollen Sie den User \"' + name + '\" wirklich löschen?')) {
                this.set('isDeleteLoading', true);
                thisUser.deleteRecord();

                thisUser.save().then(function(response) {
                    that.set('isDeleteLoading', false);
                    that.transitionToRoute('users').then(function () {
                        var aMessage = 'Nutzer \"' + name + '\" erfolgreich gelöscht!';
                        that.get('controllers.users').set('statusMessage', { message: aMessage, isSuccess: true });
                    });
                }, function(error) {
                    thisUser.rollback();
                    that.set('isDeleteLoading', false);
                    that.set('statusMessage', { message: error.responseJSON.message, isSuccess: false });
                });
            }
        },

        updateUser: function(newData) {
            this.set('statusMessage', null);

            var thisUser = this.get('model');
            thisUser.set('username', newData.usernameNew);
            thisUser.set('firstname', newData.firstnameNew);
            thisUser.set('lastname', newData.lastnameNew);
            thisUser.set('mmi', newData.mmiNew);
            thisUser.set('collectsMMI', newData.isMMIUserNew);
            thisUser.set('role', newData.selectedRoleNew);

            var that = this;
            var name = thisUser.get('username');
            thisUser.save().then(function(response) {
                that.set('isUpdateLoading', false);
                that.set('updateDataWasValid', true);
                that.transitionToRoute('users').then(function () {
                    var aMessage = 'Nutzer \"' + name + '\" erfolgreich geändert!';
                    that.get('controllers.users').set('statusMessage', { message: aMessage, isSuccess: true });
                });
            }, function(error) {
                thisUser.rollback();
                that.set('isUpdateLoading', false);
                that.set('updateDataWasValid', false);
                that.set('statusMessage', { message: error.responseJSON.message, isSuccess: false });
            });
        },

        cancelView: function() {
            this.transitionToRoute('users');
        },

        goToStudy: function(study) {
            this.transitionToRoute('userstudy', study);
        }
    },

    init: function() {
        this._super();
        this.set('roles', this.get('controllers.application').get('roles'));
        this.set('mmiValues', this.get('controllers.application').get('mmiValues'));
    },

    reset: function() {
        this.set('statusMessage', null);
        this.set('isUpdateLoading', false);
        this.set('isDeleteLoading', false);
        this.set('updateDataWasValid', true);
    },

    updateDataWasValid: true,

    isUpdateLoading: false,

    isDeleteLoading: false,

    statusMessage: null,

    firstName: null,

    lastName: null,

    userName: null,

    mmiPoints: 0,

    isMMIUser: false,

    selectedRole: null,

    roles: null,

    mmiValues: null,

    tutoredStudies: [],

    registeredStudies: [],

    executedStudies: []

});
