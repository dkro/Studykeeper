StudyManager.UserstudyController = Ember.Controller.extend({
    needs: ['userstudies', 'application'],

    actions: {
        primaryButtonClick: function() {
            if (this.get('canEdit')) {
                this.transitionToRoute('userstudy-edit', this.get('model').get('id'));
            } else {
                alert('TODO: Anmelden zur Studie');
            }
        },

        cancelButtonClick: function() {
            this.transitionToRoute('userstudies');
        }
    },

    canEdit: false,

    determineCanEdit: function() {
        var userRole = this.get('controllers.application').get('userRole');
        var currentUserId = this.get('controllers.application').get('currentUserId');

        var isTutor = userRole === 'tutor';
        var isExecutor = userRole === 'tutor' && this.get('model').get('executor').get('id') === currentUserId;

        this.set('canEdit', isTutor || isExecutor);
    }
});
