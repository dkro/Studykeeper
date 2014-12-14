StudyManager.CustomSelectComponent = Ember.Component.extend({
    actions: {
        buttonClick: function() {
            this.sendAction('action', this.get('selectedValues'));
        }
    },

    currentSelected: null,

    values: [],

    reset: function () {
        this.set('hasTagsSelected', false);
        this.set('currentSelected', this.defaultOption);
        this.selectedValues.clear();
        this.unselectedValues.clear();
        this.unselectedValues.pushObject(this.defaultOption);
        this.unselectedValues.pushObjects(this.allOptions.slice());
    }
});