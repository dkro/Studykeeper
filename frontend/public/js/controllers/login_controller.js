StudyManager.LoginController = Ember.Controller.extend({
    needs: ['application', 'dashboard'],

    username: null,

    password: null,

    errorMessage: null,

    attemptedTransition: null,

    actions: {
        login: function() {
            // DEFAULT
            /*
            var userData = this.getProperties('username', 'password');
            var that = this;

            that.set('errorMessage', null);

            Ember.$.post('http://localhost:8080/api/users/login', userData).then(function(response) {
                that.set('token', response.token);

                that.get('controllers.application').set('userRole', 0);
                that.get('controllers.application').set('isLoggedIn', true);
                that.transitionToRoute('dashboard');
            }, function(error) {
                    that.set('errorMessage', 'Login failed!');
            });
            */


            // MOCK
            this.set('errorMessage', null);
            var userRole = null;

            if (this.get('username') === 'studycreator' &&
                this.get('password') === 'creator') {
                userRole = 1;
            } else if (this.get('username') === 'studyadviser' &&
                this.get('password') === 'adviser') {
                userRole = 2;
            } else if (this.get('username') === 'student' &&
                this.get('password') === 'abc') {
                userRole = 0;
            }

            if (userRole === null) {
                this.set('errorMessage', 'Passwort falsch oder User existiert nicht!');
            } else {
                this.get('controllers.application').set('userRole', userRole);
                this.get('controllers.application').set('isLoggedIn', true);
                this.set('token', 'Das funzt!');


                this.transitionToRoute('dashboard');
            }
        },

        toSignUp: function() {
            this.transitionToRoute('signup');
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
