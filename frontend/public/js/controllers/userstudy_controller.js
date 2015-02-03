StudyManager.UserstudyController = Ember.Controller.extend({
    needs: ['userstudies', 'application'],

    actions: {
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
