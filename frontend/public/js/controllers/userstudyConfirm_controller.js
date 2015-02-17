StudyManager.UserstudyConfirmController = Ember.Controller.extend({
    needs: ['application', 'userstudy-edit', 'userstudy'],

    actions: {
        cancel: function() {
            this.transitionToRoute('userstudy-edit', this.get('model').study.get('id'));
        },

        confirmStudy: function() {
            var confirmText = 'Wenn Sie die Studie abschließen, werden allen ausgewählten Teilnehmern die entsprechende ' +
                              'Entlohnung gutgeschrieben.\n\n' +
                              'Sie können die Studie dann weiterhin editieren und auch erneut abschließen, aber bereits ' +
                              'zugewiesenen Entlohnungen werden nicht rückgängig gemacht!\n\n' +
                              'Wollen Sie die Studie wirklich abschließen?';

            if (confirm(confirmText)) {
                var studyId = this.get('model').study.get('id');
                var that = this;
                var innerPayload = [];

                this.get('usersWithCompensation').forEach(function(user) {
                    var userId = user.user.get('id');
                    var comp = user.chosenCompensation === 'MMI-Punkte';

                    var confirmedUser = {
                        userId: userId,
                        getsMMI: comp
                    };

                    innerPayload.push(confirmedUser);
                });

                var payload = {
                    users: innerPayload
                };

                Ember.$.ajax({
                    url: '/api/userstudies/' + studyId + '/close',
                    type: "POST",
                    data: payload,
                    beforeSend: function(request) {
                        request.setRequestHeader('Authorization', 'Bearer ' + localStorage.token)
                    }
                }).then(
                    function(response) {
                        that.transitionToRoute('userstudy', studyId).then(function() {
                            that.get('controllers.userstudy').set('statusMessage', { message: 'Studie erfolgreich abgeschlossen!', isSuccess: true });
                        });
                    },
                    function(error) {
                        that.set('statusMessage', { message: error.responseJSON.message, isSuccess: false });
                    });

            }
        }
    },

    statusMessage: null,

    usersWithCompensation: [],

    confirmOptions: ['Amazon-Gutschein', 'MMI-Punkte']
});
