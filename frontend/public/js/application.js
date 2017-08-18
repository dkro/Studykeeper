window.StudyManager = Ember.Application.create();

// IMPORTANT: If wanting to switch to mocking mode, this line has NOT to be in comments
// In addition the path for the concatenation of adapters in the Grunt.js "concat" task needs to be commented out
// as otherwise the adapters (specified in the directory used for the task) would override the fixture adapter
//StudyManager.ApplicationAdapter = DS.FixtureAdapter;


StudyManager.ApplicationStore = DS.Store.extend({
});

