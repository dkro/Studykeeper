StudyManager.UserstudyPublicController = Ember.Controller.extend({
    needs: ['userstudies', 'application'],

    actions: {
        register: function() {
            this.transitionToRoute('login');
        },

        cancelButtonClick: function() {
            this.transitionToRoute('userstudies');
        }
    },

    determineNeededProperties: function() {
        this.determineLoggedIn();
        this.determineTemplateFields();
    },

    determineLoggedIn: function() {
        var isLoggedIn = this.get('controllers.application').get('isLoggedIn');
        this.set('isLoggedIn', isLoggedIn);
    },

    isLoggedIn: false,

    fieldNameToValues: [],

    determineTemplateFields: function() {
        var fieldsToValues = [];
        var vals = this.get('model').get('templateValues');
        var that = this;

        this.get('model').get('template').then(function(template) {
            template.get('fields').forEach(function(field, index) {
                var entry = { title: field, value: vals.objectAt(index) };
                fieldsToValues.push(entry);
            });

            that.set('fieldNameToValues', fieldsToValues);
        })
    }
});
