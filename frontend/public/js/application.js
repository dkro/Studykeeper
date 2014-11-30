window.StudyManager = Ember.Application.create();

StudyManager.ApplicationAdapter = DS.FixtureAdapter;

StudyManager.Store = DS.Store.extend({
    adapter: DS.FixtureAdapter
});