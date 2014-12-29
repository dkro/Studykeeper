StudyManager.AccConfigController = Ember.Controller.extend({
    actions: {
        showPasswordEdit: function() {
            this.set('isEditIcon', false);
        }
    },

    reset: function() {
        // Properties are created the first time this method is called (usually from the according route) if they're not
        // already existing! If they're already existing, only their values will be reset.
        this.set('selectedStudentType', null);
        this.set('isEditIcon', true);
        this.set('oldPassword', null);
        this.set('newPassword', null);
        this.set('newPasswordConfirm', null);
    },

    studentTypeOptions: ['Default', 'MMI Student']
});
