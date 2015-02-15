StudyManager.UserstudyConfirmController = Ember.Controller.extend({
    needs: ['application', 'userstudy-edit'],

    actions: {
        cancel: function() {
            this.transitionToRoute('userstudy-edit', this.get('model').study.get('id'));
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
