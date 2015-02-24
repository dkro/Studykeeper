StudyManager.ApplicationAdapter = DS.RESTAdapter.extend({
    namespace: 'api',

    headers: function() {
        return {
            'Authorization': 'Bearer ' + localStorage.token
        };
    }.property().volatile()
});
