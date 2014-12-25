StudyManager.ApplicationSerializer = DS.RESTSerializer.extend({
    normalizePayload: function(type, payload) {
        if (type.toString() === 'StudyManager.SearchOption') {
            return payload.name;
        }
    }
});