StudyManager.UserstudyConfirmController = Ember.Controller.extend({
    needs: ['application', 'userstudy-edit'],

    actions: {
        cancel: function() {
            this.transitionToRoute('userstudy-edit', this.get('model').study.get('id'));
        },

        confirmStudy: function() {
            var confirmText = 'Wenn Sie die Studie abschließen, werden alle Einstellungen persistent gespeichert.\n\n' +
                              'Sie können dann keine Änderungen mehr vornehmen!\n\n' +
                              'Wollen Sie die Studie wirklich schon abschließen?';

            if (confirm(confirmText)) {
                var payload = [];
                var text = '';

                this.get('usersWithCompensation').forEach(function(user) {
                    var userId = user.user.get('id');
                    var comp = user.chosenCompensation === 'MMI-Punkte';

                    var confirmedUser = {
                        userId: userId,
                        getsMMI: comp
                    };

                    payload.push(confirmedUser);
                    text += 'userId: ' + userId + ' ||| getsMMI: ' + comp + '\n';
                });

                alert(text);
            }
        }
    },

    statusMessage: null,

    usersWithCompensation: [],

    confirmOptions: ['Amazon-Gutschein', 'MMI-Punkte']
});
