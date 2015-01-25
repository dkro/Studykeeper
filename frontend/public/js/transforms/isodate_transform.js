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
            return moment(deserialized).toISOString();
        }
        return deserialized;
    }
});