StudyManager.ArrayTransform = DS.Transform.extend({
    deserialize: function (serialized) {
        return serialized;
    },

    serialize: function (deserialized) {
        return deserialized;
    }
});