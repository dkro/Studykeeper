StudyManager.UserstudyAdapter = DS.RESTAdapter.extend({
    namespace: 'api',

    host: 'http://localhost:10001',

    headers: function() {
        return {
            'Authorization': 'Bearer ' + localStorage.token
        };
    }.property().volatile(),


    pathForType: function(type) {
        return 'userstudies';
    }
});
