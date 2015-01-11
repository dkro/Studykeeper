StudyManager.LoginController = Ember.Controller.extend({
    needs: ['application', 'dashboard'],

    actions: {
        login: function() {
            // DEFAULT
/*
            var userData = this.getProperties('username', 'password');
            var that = this;

            that.set('errorMessage', null);

            Ember.$.post('http://localhost:8080/api/users/login', userData).then(function(response) {
                that.set('token', response.token);
                that.set('currentUserId', response.id);
                that.get('controllers.application').set('userRole', response.role);
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
                userRole = 'EXECUTOR';
            } else if (this.get('username') === 'student' &&
                this.get('password') === '123') {
                userRole = 'TUTOR';
            } else if (this.get('username') === 'student' &&
                this.get('password') === 'abc') {
                userRole = 'DEFAULT';
            }

            if (userRole === null) {
                this.set('errorMessage', 'Passwort falsch oder User existiert nicht!');
            } else {
                this.get('controllers.application').set('userRole', userRole);
                this.get('controllers.application').set('isLoggedIn', true);
                this.set('token', 'EinToken');
                this.set('currentUserId', 1);

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
            password: '',
            currentUserId: null
        });
    },


    token: localStorage.token,

    tokenChanged: function() {
        localStorage.token = this.get('token');
    }.observes('token')
});
