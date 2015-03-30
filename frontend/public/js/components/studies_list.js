/**
 * Generic component used to display associated studies of a resource record.
 * This component is especially used for the creation and editing routes of resource types other than userstudies.
 */
StudyManager.StudiesListComponent = Ember.Component.extend({
    tagName: 'div',

    classNames: ['col-sm-10'],

    actions: {
        studyClick: function(study) {
            this.sendAction('action', study);
        },

        showHideStudies: function() {
            var oldState = this.get('showStudiesEnabled');
            this.set('showStudiesEnabled', !oldState);
        }
    },

    studies: null,

    showStudiesEnabled: false
});