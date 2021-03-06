var validationInput = Ember.TextField.extend({
    keyDown : function (event) {
        this.sendAction('key-up', this, event);
    }
});

// Important: Ember.js has new deprecations added for "global lookup of views" in version 1.8.
// That means: Views for example have to be named : "TestView" or "SuperTestView"
// and are used in the HTML file by using "{{view "test"}}" or {{view "super-test"}}
StudyManager.DatePickerView = Ember.TextField.extend({
    _picker: null,

    modelChangedValue: function(){
        var picker = this.get('_picker');
        if (picker){
            picker.setDate(this.get('value'));
        }
    }.observes('value'),

    didInsertElement: function(){
        var currentYear = (new Date()).getFullYear();
        var formElement = this.$()[0];
        var picker = new Pikaday({
            field: formElement,
            // Include moment.js before ember-pikaday so that formatting is working!
            format: 'DD.MM.YYYY',
            yearRange: [1900,currentYear+2]
        });
        this.set('_picker', picker);
    },

    willDestroyElement: function(){
        var picker = this.get('_picker');
        if (picker) {
            picker.destroy();
        }
        this.set('_picker', null);
    }
});

StudyManager.DateFieldView = Ember.TextField.extend({
    picker: null,

    updateValues: (function() {
        var date;

        var val = this.get("value");

        if (Ember.empty(val)) {
            this.set("date", null);
        } else {
            var parts = val.match(/(\d+)/g);
            date = moment(new Date(parts[2], parts[1]-1, parts[0]));
            if (date.isValid()) {
                this.set("date", date);
            } else {
                this.set("date", null);
            }
        }
    }).observes("value"),

    didInsertElement: function() {
        var picker;
        picker = new Pikaday({
            field: this.$()[0],
            format: "DD.MM.YYYY"
        });
        return this.set("picker", picker);
    }
});