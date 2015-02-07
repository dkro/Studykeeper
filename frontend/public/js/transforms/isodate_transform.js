StudyManager.IsodateTransform = DS.Transform.extend({
    deserialize: function (serialized) {
        if (serialized) {/*
            // Use German date representation for displaying on the client
            return moment(serialized).format('DD.MM.YYYY');*/
            return serialized;
        }
        return serialized;
    },

    serialize: function (deserialized) {
        if (deserialized) {
           /* var parts = deserialized.match(/(\d+)/g);
            return new Date(parts[2], parts[1]-1, parts[0]);*/
            return deserialized;
        }

        return deserialized;
    }
});