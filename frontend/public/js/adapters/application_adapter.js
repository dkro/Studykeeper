StudyManager.ApplicationAdapter = DS.RESTAdapter.extend({
    namespace: 'api',

    host: 'http://localhost:10001',

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
    },

    ajaxError: function(jqXHR) {
        var error = this._super(jqXHR);
        if (jqXHR && jqXHR.status === 422) {
            var jsonErrors = Ember.$.parseJSON(jqXHR.responseText)["errors"];
            return new DS.InvalidError(jsonErrors);
        } else {
            return error;
        }
    }
});
