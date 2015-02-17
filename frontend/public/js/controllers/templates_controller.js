StudyManager.TemplatesController = Ember.Controller.extend({
    needs: 'application',

    actions: {
        showTemplateConfig: function(template) {
            this.transitionToRoute('template', template);
        },

        createTemplate: function() {
            this.transitionToRoute('template-creation');
        },

        deleteTemplate: function(template) {
            this.set('statusMessage', null);
            var title = template.get('title');
            var that = this;

            if (confirm('Wollen Sie das Template \"' + title + '\" wirklich löschen?')) {
                template.deleteRecord();
                template.save().then(function(response) {
                    var successMessage = 'Template \"' + title + '\" wurde erfolgreich gelöscht!';
                    that.set('statusMessage', { message: successMessage, isSuccess: true });
                }, function(error) {
                    template.rollback();
                    var failMessage = 'Template \"' + title + '\" konnte nicht gelöscht werden!';
                    that.set('statusMessage', { message: failMessage, isSuccess: false });
                });
            }
        },

        filterTemplates: function() {
            this.filterAll(true);
        }
    },

    reset: function() {
        this.set('statusMessage', null);
        this.set('titleFilter', null);
        this.set('fieldCountFilter', null);

        var counts = [];
        counts.pushObject(null);

        for (var i = 0; i <= 30; i++) {
            counts.pushObject(i);
        }

        this.set('totalFieldsCount', counts);
    },

    statusMessage: null,

    titleFilter: null,

    fieldCountFilter: null,

    fieldCountFilterChanged: function() {
        var shouldClearStatus = !Ember.empty(this.get('mmiFilter'));
        this.filterAll(shouldClearStatus);
    }.observes('fieldCountFilter'),

    totalFieldsCount: null,

    templatesList: [],

    isLoading: false,

    filterAll: function(shouldClearStatus) {
        this.set('isLoading', true);
        var that = this;

        var filteredList = this.store.filter('template', (function(template){
            return that.filterTitle(template.get('title')) &&
                that.filterFieldCount(template.get('fields').length);
        }));

        this.set('templatesList', filteredList);
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
