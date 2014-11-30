StudyManager.LoginController = Ember.Controller.extend({
    username: null,

    password: null,

    errorMessage: null,

    attemptedTransition: null,

    actions: {
        login: function() {
            /*var userData = this.getProperties('username', 'password');
            var that = this;

            that.set('errorMessage', null);

            Ember.$.post('/login', userData).then(function(response) {
                that.set('token', response.token);

                var attemptedTransition = that.get('attemptedTransition');
                if (attemptedTransition) {
                    attemptedTransition.retry();
                    that.set('attemptedTransition', null);
                } else {
                    /*that.transitionToRoute('pins');*/
                   /* that.alert("Login worked!")
                }
            /*}, function(error) {
                if (401 === error.status) {
                    that.set('errorMessage', 'Login failed!');
                }
            });*/

            this.transitionToRoute('user');
        }
    },

    reset: function() {
        this.setProperties({
            errorMessage: '',
            username: '',
            password: ''
        });
    },

    token: localStorage.token,

    tokenChanged: function() {
        localStorage.token = this.get('token');
    }.observes('token')
});
