StudyManager.NewsCreationController = Ember.Controller.extend({
    needs: ['application', 'news'],

    actions: {
        createNews: function(newData) {
            this.set('statusMessage', null);
            var newNews = this.store.createRecord('news', {
                title: newData.titleNew,
                date: newData.dateNew,
                description: newData.descriptionNew,
                link: newData.linkNew
            });

            var that = this;
            var name = newNews.get('title');

            newNews.save().then(function(response) {
                that.transitionToRoute('news').then(function () {
                    that.get('controllers.news').set('statusMessage', { message: 'News \"' + name + '\" erstellt!', isSuccess: true });
                });
            }, function(error) {
                newNews.deleteRecord();
                that.set('statusMessage', { message: error.responseJSON.message, isSuccess: false });
            });
        },

        cancelView: function() {
            this.transitionToRoute('news');
        }
    },

    reset: function() {
        this.set('statusMessage', null);
        this.set('title', null);
        this.set('date', null);
        this.set('description', null);
        this.set('link', null);
    },

    statusMessage: null,

    title: null,

    date: null,

    description: null,

    link: null
});
