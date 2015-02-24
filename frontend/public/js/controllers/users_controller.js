StudyManager.UsersController = Ember.Controller.extend({
    needs: 'application',

    actions: {
        showUserConfig: function(user) {
            this.set('isTableLoading', true);
            this.transitionToRoute('user', user);
        },

        createUser: function() {
            this.set('isCreateLoading', true);
            this.transitionToRoute('user-creation');
        },

        deleteUser: function(user) {
            this.set('statusMessage', null);
            var name = user.get('username');
            var that = this;

            if (confirm('Wollen Sie den User \"' + name + '\" wirklich löschen?')) {
                this.set('isTableLoading', true);
                user.deleteRecord();
                user.save().then(function(response) {
                    that.set('isTableLoading', false);
                    var successMessage = 'Nutzer \"' + name + '\" wurde erfolgreich gelöscht!';
                    that.set('statusMessage', { message: successMessage, isSuccess: true });
                }, function(error) {
                    user.rollback();
                    that.set('isTableLoading', false);
                    that.set('statusMessage', { message: error.responseJSON.message, isSuccess: false });
                });
            }
        },

        filterUsers: function() {
            this.filterAll(true);
        }
    },

    init: function() {
        this._super();

        var filterableRoles = [];
        filterableRoles.pushObject('');
        filterableRoles.pushObjects(this.get('controllers.application').get('roles'));
        this.set('roles', filterableRoles);

        var filterMMIOptions = [];
        filterMMIOptions.pushObject(null);
        filterMMIOptions.pushObjects(this.get('controllers.application').get('mmiValues'));
        this.set('mmiFilterOptions', filterMMIOptions);
    },

    reset: function() {
        this.set('statusMessage', null);
        this.set('firstNameFilter', null);
        this.set('lastNameFilter', null);
        this.set('userNameFilter', null);
        this.set('mmiFilter', null);
        this.set('roleFilter', null);
        this.set('isTableLoading', false);
        this.set('isCreateLoading', false);
    },

    isCreateLoading: false,

    isTableLoading: false,

    statusMessage: null,

    firstNameFilter: null,

    lastNameFilter: null,

    userNameFilter: null,

    mmiFilter: null,

    mmiFilterChanged: function() {
        var shouldClearStatus = !Ember.empty(this.get('mmiFilter'));
        this.filterAll(shouldClearStatus);
    }.observes('mmiFilter'),

    roles: null,

    roleFilter: null,

    roleFilterChanged: function() {
        var shouldClearStatus = !Ember.empty(this.get('roleFilter'));
        this.filterAll(shouldClearStatus);
    }.observes('roleFilter'),

    usersList: [],

    isLoading: false,

    mmiFilterOptions: [],

    filterAll: function(shouldClearStatus) {
        this.set('isLoading', true);
        var that = this;

        var filteredList = this.store.filter('user', (function(user){
            return that.filterUserName(user.get('username')) &&
                that.filterFirstName(user.get('firstname')) &&
                that.filterLastName(user.get('lastname')) &&
                that.filterMMI(user.get('mmi')) &&
                that.filterRole(user.get('role'));
        }));

        this.set('usersList', filteredList);
        this.set('isLoading', false);

        if (shouldClearStatus) {
            this.set('statusMessage', null);
        }
    },

    filterFirstName: function(firstname) {
        var res = true;

        if (!(Ember.empty(this.get('firstNameFilter')))) {
            res = this.firstContainsSecond(firstname, this.get('firstNameFilter'));
        }

        return res;
    },

    filterLastName: function(lastname) {
        var res = true;

        if (!(Ember.empty(this.get('lastNameFilter')))) {
            res = this.firstContainsSecond(lastname, this.get('lastNameFilter'));
        }

        return res;
    },

    filterUserName: function(username) {
        var res = true;

        if (!(Ember.empty(this.get('userNameFilter')))) {
            res = this.firstContainsSecond(username, this.get('userNameFilter'));
        }

        return res;
    },

    filterMMI: function(mmi) {
        var res = true;

        if (!(Ember.empty(this.get('mmiFilter')))) {
            res = mmi === parseFloat(this.get('mmiFilter'));
        }

        return res;
    },

    filterRole: function(role) {
        var res = true;

        if (!(Ember.empty(this.get('roleFilter')))) {
            res = role === this.get('roleFilter');
        }

        return res;
    },

    firstContainsSecond: function(first, second) {
        return first.indexOf(second) > -1;
    },

    showMessage: function(statusMessage) {
        this.set('statusMessage', statusMessage);
    }
});
