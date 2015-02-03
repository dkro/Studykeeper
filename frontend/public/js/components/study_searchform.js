StudyManager.StudySearchformComponent = Ember.Component.extend({
    actions: {
        removeTag: function (tag) {
            this.selectedValues.removeObject(tag);
            this.unselectedValues.pushObject(tag);

            if (this.selectedValues.length === 0) {
                this.set('hasTagsSelected', false);
            }

            this.sendAction('action', this.get('selectedValues'));
        }
    },

    init: function() {
        this._super();
        this.reset();
    },

    defaultOption: 'Studientag auswählen...',

    currentSelected: this.defaultOption,

    allOptions: [],

    abc: [],

    unselectedValues: [],

    selectedValues: [],

    hasTagsSelected: false,

    buttonText: 'Zeige alle Studien',

    changeButtonText: function() {
        var res = 'Filter Studien';

        if (this.selectedValues.length === 0) {
            res = 'Zeige alle Studien';
        }

        this.set('buttonText', res);
    }.observes('selectedValues.length'),

    reset: function () {
        this.set('hasTagsSelected', false);
        this.set('currentSelected', this.defaultOption);
        this.selectedValues.clear();
        this.unselectedValues.clear();
        this.unselectedValues.pushObject(this.defaultOption);
        this.unselectedValues.pushObjects(this.allOptions.slice());
        /*this.unselectedValues.pushObjects(this.allOptions.map(function (item) {
            return item.get('name');
        }));*/
    },

    selectLabel: function () {
        if (this.currentSelected !== this.defaultOption) {
            this.selectedValues.pushObject(this.currentSelected);
            this.unselectedValues.removeObject(this.currentSelected);
            this.set('currentSelected', this.defaultOption);

            if (!this.hasTagsSelected) {
                this.set('hasTagsSelected', true);
            }

            this.sendAction('action', this.get('selectedValues'));
        }
    }.observes('currentSelected')
});