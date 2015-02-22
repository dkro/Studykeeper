StudyManager.NewsController = Ember.Controller.extend({
    needs: 'application',

    actions: {
        showNewsConfig: function(news) {
            this.set('isTableLoading', true);
            this.transitionToRoute('single-news', news);
        },

        createNews: function() {
            this.transitionToRoute('news-creation');
        },

        deleteNews: function(news) {
            this.set('statusMessage', null);
            var title = news.get('title');
            var that = this;

            if (confirm('Wollen Sie die News \"' + title + '\" wirklich löschen?')) {
                this.set('isTableLoading', true);
                news.deleteRecord();
                news.save().then(function(response) {
                    that.set('isTableLoading', false);
                    var successMessage = 'News \"' + title + '\" wurde erfolgreich gelöscht!';
                    that.set('statusMessage', { message: successMessage, isSuccess: true });
                }, function(error) {
                    news.rollback();
                    that.set('isTableLoading', false);
                    that.set('statusMessage', { message: error.responseJSON.message, isSuccess: false });
                });
            }
        },

        filterNews: function() {
            this.filterAll(true);
        },

        clearDatePicker: function() {
            this.set('selectedDateFilter', null);
        }
    },

    reset: function() {
        this.set('statusMessage', null);
        this.set('titleFilter', null);
        this.set('selectedDateFilter', null);
        this.set('isLoading', false);
        this.set('isTableLoading', false);
    },

    isTableLoading: false,

    statusMessage: null,

    titleFilter: null,

    selectedDateFilter: null,

    selectedDateFilterChanged: function() {
        var shouldClearStatus = !Ember.empty(this.get('selectedDateFilter'));
        this.filterAll(shouldClearStatus);
    }.observes('selectedDateFilter'),

    newsList: [],

    isLoading: false,

    filterAll: function(shouldClearStatus) {
        this.set('isLoading', true);
        var that = this;

        var filteredList = this.store.filter('news', (function(news){
            return that.filterTitle(news.get('title')) &&
                that.filterDate(news.get('date'));
        }));

        this.set('newsList', filteredList);
        this.set('isLoading', false);

        if (shouldClearStatus) {
            this.set('statusMessage', null);
        }
    },

    filterTitle: function(title) {
        var res = true;

        if (!(Ember.empty(this.get('titleFilter')))) {
            res = this.firstContainsSecond(title, this.get('titleFilter'));
        }

        return res;
    },

    filterDate: function(date) {
        var res = true;

        if (!(Ember.empty(this.get('selectedDateFilter')))) {
            res = date === this.get('selectedDateFilter');
        }

        return res;
    },

    firstContainsSecond: function(first, second) {
        return first.indexOf(second) > -1;
    },

    showMessage: function(statusMessage) {
        this.set('statusMessage', statusMessage);
    }
});
