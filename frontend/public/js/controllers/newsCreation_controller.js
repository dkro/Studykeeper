StudyManager.NewsCreationController = Ember.Controller.extend({
    needs: ['application', 'news'],

    actions: {
        createNews: function(newData) {
            var newNews = this.store.createRecord('news', {
                title: newData.titleNew,
                date: newData.dateNew,
                description: newData.descriptionNew,
                link: newData.linkNew
            });

            var that = this;
            var name = newNews.get('title');

            newNews.save().then(function(response) {
                that.store.find('news').filterBy('id', null).forEach(function(item) {
                    item.deleteRecord();
                });

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

    statusMessage: null,

    title: null,

    date: null,

    description: null,

    link: null
});
