StudyManager.LabelsItemComponent = Ember.Component.extend({
    tagName: 'li',

    classNameBindings: [':list-group-item', ':labels__label', 'isSelected:labels__label--active'],

    actions: {
        removeLabel: function() {
            this.sendAction('gotRemoved', this.get('selfId'));
        }
    },

    isSelected: false,

    click: function() {
        this.set('isSelected', true);
        this.sendAction('gotSelected', this.get('selfId'));
    },

    name: null,

    selfId: null,

    currentlySelectedLabelId: null,

    currentlySelectedLabelChanged: function() {
        if (this.get('selfId') === this.get('currentlySelectedLabelId')) {
            this.set('isSelected', true);
        } else {
            this.set('isSelected', false);
        }

    }.observes('currentlySelectedLabelId')
});