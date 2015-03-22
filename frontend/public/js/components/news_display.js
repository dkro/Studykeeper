StudyManager.NewsDisplayComponent = Ember.Component.extend({
    tagName: 'div',

    classNameBindings: [':panel', ':panel-default', 'additionalClassNames'],

    actions: {
        expandOrCollapse: function() {
            if (this.get('isCollapsed')) {
                this.set('displayedNews', this.get('news'));
            } else {
                this.set('displayedNews', []);
                var that = this;
                var counter = 0;

                this.get('news').any(function(singleNews) {
                    if (counter >= 3) {
                        return true;
                    } else {
                        that.get('displayedNews').pushObject(singleNews);
                        counter++;
                    }
                });
            }

            this.set('isCollapsed', !this.get('isCollapsed'));
        }
    },

    determineDisplayedNews: function() {
        var counter = 0;
        var that = this;

        this.get('news').any(function(singleNews) {
            if (counter >= 3) {
                that.set('newsCountOverThreshold', true);
                return true;
            } else {
                that.get('displayedNews').pushObject(singleNews);
                counter++;
            }
        });
    }.on('init'),

    news: null,

    displayedNews: [],

    title: null,

    additionalClassNames: '',

    isCollapsed: true,

    newsCountOverThreshold: false
});