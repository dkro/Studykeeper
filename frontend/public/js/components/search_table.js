/**
 * Generic component making it possible to search for records of a given resource type.
 * Records can then be selected or unselected by using a table display.
 */
StudyManager.SearchTableComponent = Ember.Component.extend(StudyManager.TableFilterMixin, {
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

                return that.firstContainsSecondString(entityValue, filterValue);
            });

            if (Ember.empty(filteredEntities)) {
                this.set('showEmptySearch', true);
            }

            this.set('searchList', filteredEntities);
        }
    }.observes('searchValue')
});