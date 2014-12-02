StudyManager.StudySearchformComponent = Ember.Component.extend({
    actions: {
        removeTag: function (tag) {
            this.selectedValues.removeObject(tag);
            this.unselectedValues.pushObject(tag);

            if (this.selectedValues.length === 0) {
                this.set('hasTagsSelected', false);
            }
        }
    },

    init: function() {
        this._super();
        this.reset();
    },

    defaultOption: "Studientag auswählen...",

    currentSelected: this.defaultOption,

    allOptions: null,

    unselectedValues: [],

    selectedValues: [],

    hasTagsSelected: false,

    reset: function () {
        this.set('hasTagsSelected', false);
        this.set('currentSelected', this.defaultOption);
        this.selectedValues.clear();
        this.unselectedValues.clear();
        this.unselectedValues.pushObject(this.defaultOption);
        this.unselectedValues.pushObjects(this.allOptions.slice());
    },

    selectLabel: function () {
        if (this.currentSelected !== this.defaultOption) {
            this.selectedValues.pushObject(this.currentSelected);
            this.unselectedValues.removeObject(this.currentSelected);
            this.set('currentSelected', this.defaultOption);

            if (!this.hasTagsSelected) {
                this.set('hasTagsSelected', true);
            }
        }
    }.observes('currentSelected')
});