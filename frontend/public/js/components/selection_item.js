StudyManager.SelectionItemComponent = Ember.Component.extend({
    tagName: 'li',

    classNameBindings: [':list-group-item', ':component__selectionItem','isClicked:list-group-item-info'],

    isClicked: false,

    actions: {
    },

    click: function() {
        this.set('isClicked', !this.get('isClicked'));
    },

    itemType: null,

    item: null
});