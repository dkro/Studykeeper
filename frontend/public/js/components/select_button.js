/**
 * The selection button used by the search table component.
 */
StudyManager.SelectButtonComponent = Ember.Component.extend({
    classNameBindings: ['isSelected:component__selectButton--selected:component__selectButton--notSelected'],

    tagName: 'span',

    actions: {
    },

    click: function() {
        if (!(this.get('selectedEntities').contains(this.get('entry')))) {
            this.get('selectedEntities').pushObject(this.get('entry'));
        }
    },

    isSelected: false,

    entry: null,

    selectionChanged: function() {
        this.set('isSelected', this.get('selectedEntities').contains(this.get('entry')));
    }.on('init'),

    selectedEntities: [],

    selectedEntitiesChanged: function() {
        this.set('isSelected', this.get('selectedEntities').contains(this.get('entry')));
    }.observes('selectedEntities.length')
});