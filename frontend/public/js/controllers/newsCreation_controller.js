StudyManager.NewsCreationController = Ember.Controller.extend({
    needs: ['application', 'news'],

    actions: {
        createNews: function(newData) {
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
            this.transitionToRoute('news');
        }
    },

    statusMessage: null,

    title: null,

    date: null,

    description: null,

    link: null
});
