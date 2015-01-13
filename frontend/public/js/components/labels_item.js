StudyManager.LabelsItemComponent = Ember.Component.extend({
    tagName: 'li',

    classNameBindings: [':list-group-item', ':labels__label', 'isSelected:labels__label--active'],

    actions: {
        saveLabel: function() {
            if (this.get('persistedName') === this.get('nameValue')) {
                this.set('isSelected', false);
            } else if (!Ember.empty(this.get('nameValue'))) {
                var store = this.get('targetObject.store');
                var that = this;

                store.find('label', this.get('selfId')).then(function (label) {
                    label.set('title', that.get('nameValue'));
                    label.save();

                    that.set('persistedName', that.get('nameValue'));
                    that.set('isSelected', false);
                });
            }
        },

        removeLabel: function() {
            this.sendAction('gotRemoved', this.get('selfId'));
        }
    },

    isSelected: false,

    click: function() {
        this.set('nameValue', this.get('persistedName'));
        this.set('isSelected', true);
        this.sendAction('gotSelected', this.get('selfId'));
    },

    init: function() {
        this._super();
        this.set('nameValue', Ember.copy(this.get('persistedName')));
    },

    persistedName: null,

    nameValue: null,

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