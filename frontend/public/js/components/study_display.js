StudyManager.StudyDisplayComponent = Ember.Component.extend({
    tagName: 'div',

    classNameBindings: [':panel', ':panel-default', 'additionalClassNames'],

    actions: {
        displayStudy: function(study) {
            this.sendAction('action', study);
        }
    },

    studiesDisplayed: null,

    title: null,

    additionalClassNames: ''
});