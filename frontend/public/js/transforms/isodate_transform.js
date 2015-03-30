/**
 * Transform used for handling dates in German format
 * See Ember.js documentation about transform for further information.
 */
StudyManager.IsodateTransform = DS.Transform.extend({
    deserialize: function (serialized) {
        if (serialized) {
            // Use German date representation for displaying on the client
            return moment(serialized).format('DD.MM.YYYY');
        }
        return serialized;
    },

    serialize: function (deserialized) {
        if (deserialized) {
            // Transform back to concrete JavaScript date for the server
            var parts = deserialized.match(/(\d+)/g);
            return new Date(parts[2], parts[1]-1, parts[0], 12, 0, 0, 0);
        }

        return deserialized;
    }
});