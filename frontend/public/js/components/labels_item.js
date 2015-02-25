StudyManager.LabelsItemComponent = Ember.Component.extend({
    tagName: 'li',

    classNameBindings: [':list-group-item', ':component__labelsItem', 'isSelected:component__labelsItem--selected'],

    actions: {
        removeLabel: function() {
            this.sendAction('gotRemoved', this.get('selfId'));
        },

        clickOnStudy: function(study) {
            this.sendAction('studyClicked', study);
        }
    },

    click: function() {
        var oldState = this.get('isSelected');
        this.set('isSelected', !oldState);
    },

    isSelected: false,

    name: null,

    selfId: null,

    relatedStudies: []
});