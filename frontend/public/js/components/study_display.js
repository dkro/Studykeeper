StudyManager.StudyDisplayComponent = Ember.Component.extend({
    tagName: 'div',

    classNameBindings: [':panel', ':panel-default', 'additionalClassNames'],

    actions: {
        displayStudy: function(study) {
            this.sendAction('action', study);
        },

        expandOrCollapse: function() {
            if (this.get('isCollapsed')) {
                this.set('studiesForDisplay', this.get('studiesAll'));
            } else {
                this.set('studiesForDisplay', []);
                var that = this;
                var counter = 0;

                this.get('studiesAll').any(function(study) {
                    if (counter >= 3) {
                        return true;
                    } else {
                        that.get('studiesForDisplay').pushObject(study);
                        counter++;
                    }
                });
            }

            this.set('isCollapsed', !this.get('isCollapsed'));
        }
    },

    studiesAll: null,

    determineDisplayedStudies: function() {
        var counter = 0;
        var that = this;

        this.get('studiesAll').any(function(study) {
            if (counter >= 3) {
                that.set('studyCountOverThreshold', true);
                return true;
            } else {
                that.get('studiesForDisplay').pushObject(study);
                counter++;
            }
        });
    }.on('init'),

    title: null,

    additionalClassNames: '',

    studiesForDisplay: [],

    isCollapsed: true,

    studyCountOverThreshold: false
});