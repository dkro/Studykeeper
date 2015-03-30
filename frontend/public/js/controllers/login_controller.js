StudyManager.LoginController = Ember.Controller.extend({
    needs: ['application', 'dashboard'],

    actions: {
        login: function() {
            // DEFAULT
            this.set('isLoading', true);
            this.set('loginDataWasValid', true);

            var userData = this.getProperties('username', 'password');
            var that = this;

            that.set('statusMessage', null);

            Ember.$.post('/api/users/login', userData).then(function(response) {
                that.get('controllers.application').set('token', response.user.token);
                that.get('controllers.application').set('currentUserId', response.user.id);
                that.get('controllers.application').set('userRole', response.user.role);
                that.get('controllers.application').set('isLoggedIn', true);

                if (!Ember.empty(that.get('controllers.application').get('toTransitionedStudy'))) {
                    var studyId = that.get('controllers.application').get('toTransitionedStudy');
                    that.get('controllers.application').set('toTransitionedStudy', null);
                    that.transitionToRoute('userstudy', studyId);
                } else {
                    that.transitionToRoute('dashboard');
                }

                that.set('isLoading', false);
            }, function(error) {
                    that.set('isLoading', false);
                    that.set('loginDataWasValid', false);
                    that.set('statusMessage', { message: error.responseJSON.message, isSuccess: false });
            });
/*

            //Use this code for mocking by using fixtures (The code above then needs to be commented out)
            this.set('statusMessage', null);
            var userId = null;

            if (this.get('username') === 'student' &&
                this.get('password') === '123') {
                userId = 1;
            } else if (this.get('username') === 'student' &&
                this.get('password') === 'abc') {
                userId = 2;
            } else if (this.get('username') === 'student' &&
                this.get('password') === 'xyz') {
                userId = 3;
            }

            if (Ember.empty(userId)) {
                this.set('statusMessage', { message: 'Login fehlgeschlagen!', isSuccess: false } );
            } else {
                var that = this;
                this.store.find('user', userId).then(function(user) {
                    that.get('controllers.application').set('userRole', user.get('role'));
                    that.get('controllers.application').set('isLoggedIn', true);
                    that.get('controllers.application').set('token', 'EinToken');
                    that.get('controllers.application').set('currentUserId', userId);
                    that.get('controllers.application').set('isLMUStaff', user.get('lmuStaff'));

                    that.transitionToRoute('dashboard');
                });
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
            password: '',
            isLoading: false,
            loginDataWasValid: true
        });
    },

    statusMessage: null,

    isLoading: false,

    loginDataWasValid: true
});
