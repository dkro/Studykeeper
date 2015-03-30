/**
 * Component for displaying a list of studies wrapped by Bootstrap component.
 * This component is especially used for the dashboard.
 */
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