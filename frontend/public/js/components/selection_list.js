/**
 * Generic component displaying a list of records.
 * Each record in this list is selectable and unselectable
 */
StudyManager.SelectionListComponent = Ember.Component.extend({
    classNames: ['component__selectionList'],

    actions: {
    },

    itemList: [],

    itemType: null,

    selections: []
});