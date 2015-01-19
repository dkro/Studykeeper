StudyManager.StatusMessageComponent = Ember.Component.extend({
    tagName: 'p',

    classNameBindings: [':alert', 'isSuccess:alert-success:alert-danger', 'additionalClassNames'],

    actions: {
    },

    isSuccess: true,

    message: null,

    additionalClassNames: ""
});