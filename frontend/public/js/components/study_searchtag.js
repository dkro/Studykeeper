StudyManager.StudySearchtagComponent = Ember.Component.extend({
    action: 'removeTag',
    targetObject: Em.computed.alias('parentView'),
    actions: {
        removeTag: function(tag) {
            this.sendAction('action', tag);
        }
    },

    classNames: ['studySearch__tag']
});