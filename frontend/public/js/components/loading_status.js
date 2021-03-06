/**
 * Component for displaying animated icon for loading.
 */
StudyManager.LoadingStatusComponent = Ember.Component.extend({
    tagName: 'span',

    classNameBindings: [':fa', ':fa-spinner', ':fa-pulse', 'additionalClassNames'],

    additionalClassNames: ''
});