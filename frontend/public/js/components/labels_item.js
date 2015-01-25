StudyManager.LabelsItemComponent = Ember.Component.extend({
    tagName: 'li',

    classNameBindings: [':list-group-item', ':labels__label'],

    actions: {
        removeLabel: function() {
            this.sendAction('gotRemoved', this.get('selfId'));
        }
    },

    name: null,

    selfId: null
});