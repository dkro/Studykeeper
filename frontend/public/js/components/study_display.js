StudyManager.StudyDisplayComponent = Ember.Component.extend({
    actions: {
        displayStudy: function(study) {
            this.sendAction('action', study);
        }
    },

    studies: null,

    title: null,

    additionalClassNames: ''

});