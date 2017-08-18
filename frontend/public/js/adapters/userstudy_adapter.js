/**
 * Custom adapter only for requests of the "Userstudy" model invoked (See Ember.js documentation about model specific
 * adapters for furhter information)
 */
StudyManager.UserstudyAdapter = DS.RESTAdapter.extend({
    namespace: 'api',

    headers: function() {
        return {
            'Authorization': 'Bearer ' + localStorage.token
        };
    }.property().volatile(),


    // Workaround to be conform to the Backend API expecting "api/userstudies" for study related requests
    // But Ember.js would implicitly enhance the study type with an "s". So without this fix, the default application
    // would build the path "api/userstudys" which is not desired. See the Ember.js documentation about adapters.
    pathForType: function(type) {
        return 'userstudies';
    }
});
