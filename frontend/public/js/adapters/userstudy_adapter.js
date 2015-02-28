StudyManager.UserstudyAdapter = DS.RESTAdapter.extend({
    namespace: 'api',

    headers: function() {
        return {
            'Authorization': 'Bearer ' + localStorage.token
        };
    }.property().volatile(),


    pathForType: function(type) {
        return 'userstudies';
    }
});
