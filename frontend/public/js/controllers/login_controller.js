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
                that.get('controllers.application').set('isLMUStaff', response.user.lmuStaff);
                that.get('controllers.application').set('isLoggedIn', true);

                that.transitionToRoute('dashboard');
            }, function(error) {
                    that.set('statusMessage', { message: error.responseJSON.message, isSuccess: false });
            });
/*

            // MOCK
            this.set('statusMessage', null);
            var canLogin = null;

            if (this.get('username') === 'student' &&
                this.get('password') === '123') {
                canLogin = true;
            }

            if (!canLogin) {
                this.set('statusMessage', { message: 'Login fehlgeschlagen!', isSuccess: false } );
            } else {
                var userId = 2;
                var currentUser = this.store.find('user', userId);
                this.get('controllers.application').set('userRole', currentUser.get('role'));
                this.get('controllers.application').set('isLoggedIn', true);
                this.get('controllers.application').set('token', 'EinToken');
                this.get('controllers.application').set('currentUserId', userId);
                this.get('controllers.application').set('isLMUStaff', currentUser.get('lmuStaff'));

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
