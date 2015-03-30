/**
 * General adapter used for each network request.
 */
StudyManager.ApplicationAdapter = DS.RESTAdapter.extend({
    namespace: 'api',

    /**
     * Send the session's authorization token for each network request by using he HTTP header.
     */
    headers: function() {
        return {
            'Authorization': 'Bearer ' + localStorage.token
        };
    }.property().volatile()
});
