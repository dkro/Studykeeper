StudyManager.SearchTableComponent = Ember.Component.extend({
    actions: {
        deselectEntry: function(entry) {
            this.get('selectedEntities').removeObject(entry);
        }
    },

    type: null,

    placeholderText: null,

    searchValue: null,

    searchList: [],

    showEmptySearch: false,

    allEntities: [],

    selectedEntities: [],

    searchValueChanged: function() {
        var filterValue = this.get('searchValue');
        var that = this;

        if (Ember.empty(filterValue)) {
            this.set('searchList', []);
            this.set('showEmptySearch', false);
        } else {
            var filteredEntities = this.get('allEntities').filter(function(entity) {
                var entityValue = '';

                if (that.get('type') === 'USER_TYPE') {
                    entityValue = entity.get('username');
                } else if (that.get('type') === 'NEWS_TYPE') {
                    entityValue = entity.get('title');
                } else if (that.get('type') === 'STUDY_TYPE') {
                    entityValue = entity.get('title');
                }

                return that.firstContainsSecond(entityValue, filterValue);
            });

            if (Ember.empty(filteredEntities)) {
                this.set('showEmptySearch', true);
            }

            this.set('searchList', filteredEntities);
        }
    }.observes('searchValue'),

    firstContainsSecond: function(first, second) {
        return first.indexOf(second) > -1;
    }
});