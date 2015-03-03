StudyManager.RecordNonexistingController = Ember.Controller.extend({
    actions: {
    },

    reset: function() {
        this.set('type', null);
        this.set('id', null);
    },

    setDisplayData: function(type, id) {
        var convertedType = '';

        if (type === 'news') {
            convertedType = 'NEWS_TYPE';
        } else if (type === 'label') {
            convertedType = 'LABEL_TYPE';
        } else if (type === 'study') {
            convertedType = 'STUDY_TYPE';
        } else if (type === 'template') {
            convertedType = 'TEMPLATE_TYPE';
        } else if (type === 'user') {
            convertedType = 'USER_TYPE';
        }

        this.set('type', convertedType);
        this.set('recordId', id);
    },

    hasDisplayData: false,

    hasDisplayDataChanged: function() {
        var newValue = !(Ember.empty(this.get('type')) || Ember.empty(this.get('recordId')));
        this.set('hasDisplayData', newValue);
    }.observes('type', 'recordId'),

    type: null,

    recordId: null
});
