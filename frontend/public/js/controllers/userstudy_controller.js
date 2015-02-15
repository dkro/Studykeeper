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
                                that.sendAction('refreshRoute');
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
        this.determineFreeSpace();
        this.determineTemplateFields();
    },

    canEdit: false,

    determineCanEdit: function() {
        var userRole = this.get('controllers.application').get('userRole');
        var currentUserId = this.get('controllers.application').get('currentUserId');
        var that = this;

        this.get('model').get('executor').then(function(executor) {
            var executorId = executor.get('id');
            var isTutor = userRole === 'tutor';
            var isExecutor = userRole === 'executor' && executorId === currentUserId;
            var canEdit = (isTutor || isExecutor);

            that.set('canEdit', canEdit);
        });
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

    freeSpace: 0,

    determineFreeSpace: function() {
        var registeredUsersCount = this.get('model').get('registeredUsers.length');
        var freeSpace = this.get('model').get('space') - registeredUsersCount;

        this.set('freeSpace', freeSpace);
    },

    fieldNameToValues: [],

    determineTemplateFields: function() {
        var fieldsToValues = [];
        var vals = this.get('model').get('templateValues');
        var that = this;

        this.get('model').get('template').then(function(template) {
            template.get('fields').forEach(function(field, index) {
                var entry = { title: field, value: vals.objectAt(index) };
                fieldsToValues.push(entry);
            });

            that.set('fieldNameToValues', fieldsToValues);
        })
    },

    statusMessage: null
});
