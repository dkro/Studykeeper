StudyManager.LoginController = Ember.Controller.extend({
    needs: 'application',

    usermail: null,

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
            this.set('errorMessage', null);
            var userRole = null;

            if (this.get('usermail') === "studycreator" &&
                this.get('password') === "creator") {
                userRole = 1;
            } else if (this.get('usermail') === "studyadviser" &&
                this.get('password') === "adviser") {
                userRole = 2;
            } else if (this.get('usermail') === "student" &&
                this.get('password') === "abc") {
                userRole = 0;
            }

            if (userRole == null) {
                this.set('errorMessage', "Passwort falsch oder User existiert nicht!");
            } else {
                this.get('controllers.application').set('userRole', userRole);
                this.get('controllers.application').set('isLoggedIn', true);
                this.transitionToRoute('user');
            }
        },

        signUp: function() {
            this.transitionToRoute('sign-up');
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
