/**
 * Component representing a single label used by the study-searchform component.
 */
StudyManager.StudySearchtagComponent = Ember.Component.extend({
    action: 'removeTag',
    targetObject: Em.computed.alias('parentView'),
    actions: {
        removeTag: function(tag) {
            this.sendAction('action', tag);
        }
    },

    classNames: ['studies__tagFilter__tag']
});