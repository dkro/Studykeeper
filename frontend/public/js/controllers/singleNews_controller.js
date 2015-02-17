StudyManager.SingleNewsController = Ember.Controller.extend({
    needs: ['application', 'news'],

    actions: {
        deleteNews: function() {
            this.set('statusMessage', null);
            var thisNews = this.get('model');
            var that = this;
            var name = thisNews.get('title');

            if (confirm('Wollen Sie die News \"' + name + '\" wirklich löschen?')) {
                thisNews.deleteRecord();

                thisNews.save().then(function(response) {
                    that.transitionToRoute('news').then(function () {
                        var aMessage = 'News \"' + name + '\" erfolgreich gelöscht!';
                        that.get('controllers.news').set('statusMessage', { message: aMessage, isSuccess: true });
                    });
                }, function(error) {
                    thisNews.rollback();
                    that.set('statusMessage', { message: error.responseJSON.message, isSuccess: false });
                });
            }
        },

        updateNews: function(newData) {
            this.set('statusMessage', null);
            var thisNews = this.get('model');
            thisNews.set('title', newData.titleNew);
            thisNews.set('date', newData.dateNew);
            thisNews.set('description', newData.descriptionNew);
            thisNews.set('link', newData.linkNew);

            var that = this;
            var name = thisNews.get('title');
            thisNews.save().then(function(response) {
                that.transitionToRoute('news').then(function () {
                    var aMessage = 'News \"' + name + '\" erfolgreich geändert!';
                    that.get('controllers.news').set('statusMessage', { message: aMessage, isSuccess: true });
                });
            }, function(error) {
                thisNews.rollback();
                that.set('statusMessage', { message: error.responseJSON.message, isSuccess: false });
            });
        },

        cancelView: function() {
            this.transitionToRoute('news');
        }
    },

    reset: function() {
        this.set('statusMessage', null);
    },

    statusMessage: null,

    title: null,

    date: null,

    description: null,

    link: null
});
