StudyManager.UserstudyController = Ember.Controller.extend({
    needs: ['userstudies', 'application'],

    actions: {
        primaryButtonClick: function() {
            if (this.get('canEdit')) {
                this.transitionToRoute('userstudy-edit', this.get('model').get('id'));
            } else {
                var studyId = this.get('model').get('id');
                var currentUserId = this.get('controllers.application').get('currentUserId');
                var that = this;
                var successMessage;
                var usedUrl;

                if (this.get('isRegistered')) {
                    successMessage = 'Abmeldung erfolgreich';
                    usedUrl = '/api/userstudies/' + studyId + '/signoff/' + currentUserId;
                } else {
                    successMessage = 'Anmeldung erfolgreich';
                    usedUrl = '/api/userstudies/' + studyId + '/register/' + currentUserId;
                }

                Ember.$.ajax({
                        url: usedUrl,
                        type: "POST",
                        beforeSend: function(request) {
                            request.setRequestHeader('Authorization', 'Bearer ' + localStorage.token)
                        }
                    }).then(
                        function(response) {
                            that.store.fetch('userstudy', studyId).then(function(study) {
                                that.set('model', study);
                                that.set('statusMessage', { message: successMessage, isSuccess: true });
                            });
                        },
                        function(error) {
                            that.set('statusMessage', { message: error.responseJSON.message, isSuccess: false });
                        });
            }
        },

        cancelButtonClick: function() {
            this.transitionToRoute('userstudies');
        },

        publicButtonClick: function() {
            this.transitionToRoute('userstudy-public', this.get('model').get('id'));
        }
    },

    determineNeededProperties: function() {
        this.determineCanEdit();
        this.determineIsRegistered();
    },

    canEdit: false,

    determineCanEdit: function() {
        var userRole = this.get('controllers.application').get('userRole');
        var currentUserId = this.get('controllers.application').get('currentUserId');

        var isTutor = userRole === 'tutor';
        var isExecutor = userRole === 'tutor' && this.get('model').get('executor').get('id') === currentUserId;

        this.set('canEdit', isTutor || isExecutor);
    },

    isRegistered: false,

    determineIsRegistered: function() {
        var currentUserId = this.get('controllers.application').get('currentUserId');
        var that = this;

        this.store.find('user', currentUserId).then(function(user) {
            var isRegistered = that.get('model').get('registeredUsers').contains(user);
            that.set('isRegistered', isRegistered);
        });
    },

    statusMessage: null
});
