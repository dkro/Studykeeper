window.StudyManager = Ember.Application.create();

StudyManager.ApplicationAdapter = DS.FixtureAdapter;

StudyManager.Store = DS.Store.extend({
    adapter: DS.FixtureAdapter
});

var validationInput = Ember.TextField.extend({
    keyDown : function (event) {
        this.sendAction('key-up', this, event);
    }
});

Ember.Handlebars.helper('validation-input', validationInput);

// Important: Ember.js has new deprecations added for "global lookup of views" in version 1.8.
// That means: Views for example have to be named : "TestView" or "SuperTestView"
// and are used in the HTML file by using "{{view "test"}}" or {{view "super-test"}}
StudyManager.DatePickerView = Ember.TextField.extend({
    _picker: null,

    modelChangedValue: function(){
        var picker = this.get("_picker");
        if (picker){
            picker.setDate(this.get("value"));
        }
    }.observes("value"),

    didInsertElement: function(){
        currentYear = (new Date()).getFullYear();
        formElement = this.$()[0];
        picker = new Pikaday({
            field: formElement,
            // Include moment.js before ember-pikaday so that formatting is working!
            format: "DD.MM.YYYY",
            yearRange: [1900,currentYear+2]
        });
        this.set("_picker", picker);
    },

    willDestroyElement: function(){
        picker = this.get("_picker");
        if (picker) {
            picker.destroy();
        }
        this.set("_picker", null);
    }
});