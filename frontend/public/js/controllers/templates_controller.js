StudyManager.TemplatesController = Ember.Controller.extend({
    needs: 'application',

    actions: {
        showTemplateConfig: function(template) {
            this.set('isTableLoading', true);
            this.transitionToRoute('template', template);
        },

        createTemplate: function() {
            this.set('isCreateLoading', true);
            this.transitionToRoute('template-creation');
        },

        filterTemplates: function() {
            this.filterAll(true);
        }
    },

    reset: function() {
        this.set('isTableLoading', false);
        this.set('isCreateLoading', false);
        this.set('statusMessage', null);
        this.set('titleFilter', null);
        this.set('fieldCountFilter', null);

        var counts = [];

        for (var i = 0; i <= 30; i++) {
            counts.pushObject(i);
        }

        this.set('totalFieldsCount', counts);
    },

    isTableLoading: false,

    isCreateLoading: false,

    statusMessage: null,

    titleFilter: null,

    fieldCountFilter: null,

    fieldCountFilterChanged: function() {
        var shouldClearStatus = !Ember.empty(this.get('mmiFilter'));
        this.filterAll(shouldClearStatus);
    }.observes('fieldCountFilter'),

    totalFieldsCount: null,

    templatesList: [],

    filterAll: function(shouldClearStatus) {
        this.set('isTableLoading', true);
        var that = this;

        var filteredList = this.store.filter('template', (function(template){
            return that.filterTitle(template.get('title')) &&
                that.filterFieldCount(template.get('fields').length);
        }));

        this.set('templatesList', filteredList);
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

    filterFieldCount: function(count) {
        var res = true;

        if (!(Ember.empty(this.get('fieldCountFilter')))) {
            res = count === parseFloat(this.get('fieldCountFilter'));
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
