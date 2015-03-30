StudyManager.StatusController = Ember.Controller.extend({
    needs: ['application'],

    actions: {

    },

    reset: function() {
        this.set('type', null);
        this.set('hash', null);
        this.set('statusMessage', null);
        this.set('isLoading', false);
    },

    /**
     * This method is called each time after a transition to the status route.
     * This is a kind of workaround as this route is used for password recovery and account activation purposes.
     * The controller decides for which message to display by extracting the hash data.
     *
     * This could be solved in a better way!
     */
    requestData: function(type, hash) {
        this.set('isLoading', true);
        this.set('type', type);
        this.set('hash', hash);

        var that = this;
        var url;

        if (this.get('type') === 'confirm') {
            url = '/api/users/confirm/' + this.get('hash');
        } else if (this.get('type') === 'recover') {
            url = '/api/users/recover/' + this.get('hash');
        }

        Ember.$.ajax({
            url: url,
            type: "POST"
        }).then(
            function(response) {
                that.set('isLoading', false);
                that.set('statusMessage', { message: response.message, isSuccess: true });
            },
            function(error) {
                that.set('isLoading', false);
                that.set('statusMessage', { message: error.responseJSON.message, isSuccess: false });
            });
    },

    type: null,

    hash: null,

    statusMessage: null,

    isLoading: false
});
