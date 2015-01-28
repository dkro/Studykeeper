StudyManager.LoginController = Ember.Controller.extend({
    needs: ['application', 'dashboard'],

    actions: {
        login: function() {
            // DEFAULT

            var userData = this.getProperties('username', 'password');
            var that = this;

            that.set('statusMessage', null);

            Ember.$.post('http://localhost:10001/api/users/login', userData).then(function(response) {
                that.get('controllers.application').set('token', response.user.token);
                that.get('controllers.application').set('currentUserId', response.user.id);
                that.get('controllers.application').set('userRole', response.user.role);
                that.get('controllers.application').set('isLoggedIn', true);

                that.transitionToRoute('dashboard');
            }, function(error) {
                    that.set('statusMessage', { message: 'TODO: Login failed!', isSuccess: false });
            });
/*

            // MOCK
            this.set('statusMessage', null);
            var userRole = null;

            if (this.get('username') === 'studycreator' &&
                this.get('password') === 'creator') {
                userRole = 'executor';
            } else if (this.get('username') === 'student' &&
                this.get('password') === '123') {
                userRole = 'tutor';
            } else if (this.get('username') === 'student' &&
                this.get('password') === 'abc') {
                userRole = 'default';
            }

            if (userRole === null) {
                this.set('statusMessage', { message: 'Login fehlgeschlagen!', isSuccess: false } );
            } else {
                this.get('controllers.application').set('userRole', userRole);
                this.get('controllers.application').set('isLoggedIn', true);
                this.get('controllers.application').set('token', 'EinToken');
                this.get('controllers.application').set('currentUserId', 1);

                this.transitionToRoute('dashboard');
            }*/
        },

        toSignUp: function() {
            this.transitionToRoute('signup');
        },

        toPasswordRecovery: function() {
            this.transitionToRoute('password-recovery');
        }
    },

    reset: function() {
        this.setProperties({
            statusMessage: '',
            username: '',
            password: ''
        });
    },

    statusMessage: null
});
