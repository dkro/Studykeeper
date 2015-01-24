StudyManager.NewsController = Ember.Controller.extend({
    needs: 'application',

    actions: {
        showNewsConfig: function(news) {
            this.transitionToRoute('single-news', news);
        },

        createNews: function() {
            //this.transitionToRoute('user-creation');
        },

        deleteNews: function(news) {
            this.set('statusMessage', null);
            var title = news.get('title');
            var that = this;

            news.deleteRecord();
            news.save().then(function(response) {
                var successMessage = 'News \"' + title + '\" wurde erfolgreich gelöscht!';
                that.set('statusMessage', { message: successMessage, isSuccess: true });
            }, function(error) {
                user.rollback();
                var failMessage = 'News \"' + title + '\" konnte nicht gelöscht werden!';
                that.set('statusMessage', { message: failMessage, isSuccess: false });
            });
        },

        filterNews: function() {
            this.filterAll();
        }
    },

    reset: function() {
        this.set('statusMessage', null);
        this.set('titleFilter', null);
        this.set('selectedDateFilter', null);
    },

    statusMessage: null,

    titleFilter: null,

    selectedDateFilter: null,

    newsList: [],

    isLoading: false,

    filterAll: function() {
        this.set('isLoading', true);
        var that = this;

        var filteredList = this.store.filter('news', (function(news){
            return that.filterTitle(news.get('title')) &&
                that.filterDate(news.get('date'));
        }));

        this.set('newsList', filteredList);
        this.set('isLoading', false);
        this.set('statusMessage', null);
    },

    filterTitle: function(title) {
        var res = true;

        if (!(Ember.empty(this.get('titleFilter')))) {
            res = this.firstContainsSecond(title, this.get('titleFilter'));
        }

        return res;
    },

    filterDate: function(lastname) {
        var res = true;

        return res;
    },

    firstContainsSecond: function(first, second) {
        return first.indexOf(second) > -1;
    },

    showMessage: function(statusMessage) {
        this.set('statusMessage', statusMessage);
    }
});
