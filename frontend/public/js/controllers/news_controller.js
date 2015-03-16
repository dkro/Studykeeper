StudyManager.NewsController = Ember.Controller.extend({
    needs: 'application',

    actions: {
        showNewsConfig: function(news) {
            this.set('isTableLoading', true);
            this.transitionToRoute('single-news', news);
        },

        createNews: function() {
            this.set('isCreateLoading', true);
            this.transitionToRoute('news-creation');
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
        this.set('isTableLoading', false);
        this.set('isCreateLoading', false);
    },

    isTableLoading: false,

    isCreateLoading: false,

    statusMessage: null,

    titleFilter: null,

    selectedDateFilter: null,

    selectedDateFilterChanged: function() {
        var shouldClearStatus = !Ember.empty(this.get('selectedDateFilter'));
        this.filterAll(shouldClearStatus);
    }.observes('selectedDateFilter'),

    newsList: [],

    filterAll: function(shouldClearStatus) {
        this.set('isTableLoading', true);
        var that = this;

        var filteredList = this.store.filter('news', (function(news){
            return that.filterTitle(news.get('title')) &&
                that.filterDate(news.get('date'));
        }));

        this.set('newsList', filteredList);
        this.set('isTableLoading', false);

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
