StudyManager.UserstudyController = Ember.Controller.extend({
    needs: ['userstudies', 'application'],

    actions: {
        registerButtonClick: function() {
                this.set('statusMessage', null);
                this.set('isRegisterLoading', true);

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
                            that.store.fetch('userstudy', that.get('model').get('id')).then(function(study) {
                                that.set('model', study);
                                that.determineNeededProperties();
                                that.set('statusMessage', { message: successMessage, isSuccess: true });
                            })
                        },
                        function(error) {
                            that.set('isRegisterLoading', false);
                            that.set('statusMessage', { message: error.responseJSON.message, isSuccess: false });
                        });
        },

        editButtonClick: function() {
            if (this.get('canEdit')) {
                this.set('isEditLoading', true);
                this.transitionToRoute('userstudy-edit', this.get('model').get('id'));
            }
        },

        cancelButtonClick: function() {
            this.set('isBackToStudiesLoading', true);
            this.transitionToRoute('userstudies');
        },

        publicButtonClick: function() {
            this.set('isPublishPublicLoading', true);
            this.transitionToRoute('userstudy-public', this.get('model').get('id'));
        },

        publishButtonClick: function() {
            this.set('isPublishPublicLoading', true);
            this.set('statusMessage', null);

            var studyId = this.get('model').get('id');
            var that = this;
            var successMessage = 'Die Studie wurde veröffentlicht!';
            var usedUrl = '/api/userstudies/' + studyId + '/publish';

            Ember.$.ajax({
                url: usedUrl,
                type: "POST",
                beforeSend: function(request) {
                    request.setRequestHeader('Authorization', 'Bearer ' + localStorage.token)
                }
            }).then(
                function(response) {
                    that.store.fetch('userstudy', that.get('model').get('id')).then(function(study) {
                        that.set('model', study);
                        that.determineNeededProperties();
                        that.set('statusMessage', { message: successMessage, isSuccess: true });
                    })
                },
                function(error) {
                    that.set('isPublishPublicLoading', false);
                    that.set('statusMessage', { message: error.responseJSON.message, isSuccess: false });
                });
        }
    },

    determineNeededProperties: function() {
        this.determineCanEdit();
        this.determineIsRegistered();
        this.determineFreeSpace();
        this.determineTemplateFields();
        this.determineMailTos();
        this.determineRegisteredUsers();

        var isTutor = this.get('controllers.application').get('isTutor');
        this.set('isTutor', isTutor);
        this.set('statusMessage', null);
        this.set('isEditLoading', false);
        this.set('isRegisterLoading', false);
        this.set('isBackToStudiesLoading', false);
        this.set('isPublishPublicLoading', false);
    },

    isTutor: false,

    canEdit: false,

    determineCanEdit: function() {
        var userRole = this.get('controllers.application').get('userRole');
        var currentUserId = parseInt(this.get('controllers.application').get('currentUserId'));
        var that = this;

        this.get('model').get('executor').then(function(executor) {
            var executorId = parseInt(executor.get('id'));
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
                fieldsToValues.pushObject(entry);
            });

            that.set('fieldNameToValues', fieldsToValues);
        })
    },

    mailToTutor: null,

    mailToExecutor: null,

    determineMailTos: function() {
        var that = this;

        this.get('model').get('tutor').then(function(tutor) {
            var res = 'mailto:' + tutor.get('username');
            that.set('mailToTutor', res);
        });

        this.get('model').get('executor').then(function(executor) {
            var res = 'mailto:' + executor.get('username');
            that.set('mailToExecutor', res);
        });
    },

    registeredUsers: [],

    determineRegisteredUsers: function() {
        var that = this;
        this.get('model').get('registeredUsers').then(function(users){
            that.set('registeredUsers', users);
        });
    },

    statusMessage: null,

    isEditLoading: false,

    isRegisterLoading: false,

    isBackToStudiesLoading: false,

    isPublishPublicLoading: false
});
