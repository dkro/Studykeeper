/**
 * Component representing a single element of a selection list component.
 */
StudyManager.SelectionItemComponent = Ember.Component.extend({
    tagName: 'li',

    classNameBindings: [':list-group-item', ':component__selectionItem','isSelected:list-group-item-info'],

    isSelected: function() {
        if (this.get('selections') === undefined) {
            return false;
        } else {
            return this.get('selections').contains(this.get('item'));
        }
    }.property('selections.@each'),

    actions: {
    },

    click: function() {
        var newState = !this.get('isSelected');

        if (newState) {
            this.get('selections').pushObject(this.get('item'));
        } else {
            this.get('selections').removeObject(this.get('item'));
        }
    },

    itemType: null,

    item: null,

    selections: []
});