window.StudyManager = Ember.Application.create();

StudyManager.ApplicationAdapter = DS.FixtureAdapter;

StudyManager.Store = DS.Store.extend({
    adapter: DS.FixtureAdapter
});

var validationInput = Ember.TextField.extend({
    keyDown : function (event) {
        this.sendAction('key-up', this, event);
    }
});

Ember.Handlebars.helper('validation-input', validationInput);