StudyManager.UserstudyAdapter = DS.RESTAdapter.extend({
    namespace: 'api/userstudies',

    host: 'http://localhost:8080',

    ajax: function(url, type, hash) {
        if (Ember.isEmpty(hash)) {
            hash = {};
        }

        if (Ember.isEmpty(hash.data)) {
            hash.data = {};
        }

        hash.beforeSend = function(xhr) {
            xhr.setRequestHeader('Authorization', 'Bearer ' + localStorage.token);
        };

        return this._super(url, type, hash);
    }
});
