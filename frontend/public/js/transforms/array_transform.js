/**
 * Transform used to make it possible to use an array as type for model property.
 * See Ember.js documentation about transform for further information.
 */
StudyManager.ArrayTransform = DS.Transform.extend({
    deserialize: function(serialized) {
        return (Ember.typeOf(serialized) === "array")
            ? serialized
            : [];
    },

    serialize: function(deserialized) {
        var type = Ember.typeOf(deserialized);
        if (type === 'array') {
            return deserialized
        } else if (type === 'string') {
            return deserialized.split(',').map(function(item) {
                return jQuery.trim(item);
            });
        } else {
            return [];
        }
    }
});