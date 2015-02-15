StudyManager.UserstudyConfirmController = Ember.Controller.extend({
    needs: ['application', 'userstudy-edit'],

    actions: {
        cancel: function() {
            this.transitionToRoute('userstudy', this.get('model').study);
        },

        confirmStudy: function() {
        }
    },

    init: function() {
        this._super();
    },

    statusMessage: null,

    usersWithCompensation: []
});
