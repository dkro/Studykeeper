StudyManager.NewsController = Ember.Controller.extend(StudyManager.TableFilterMixin, {
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

    titleFilterChanged: function() {
        var shouldClearStatus = !Ember.empty(this.get('titleFilter'));
        this.filterAll(shouldClearStatus);
    }.observes('titleFilter'),

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
            res = this.firstContainsSecondString(title, this.get('titleFilter'));
        }

        return res;
    },

    filterDate: function(date) {
        var res = true;

        if (!(Ember.empty(this.get('selectedDateFilter')))) {
            res = this.objectsAreEqual(date, this.get('selectedDateFilter'));
        }

        return res;
    },

    showMessage: function(statusMessage) {
        this.set('statusMessage', statusMessage);
    }
});
