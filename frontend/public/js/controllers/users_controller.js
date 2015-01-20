StudyManager.UsersController = Ember.Controller.extend({
    actions: {
        showUserConfig: function(user) {
            this.transitionToRoute('user', user);
        },

        createUser: function() {
            this.transitionToRoute('user-creation');
        },

        deleteUser: function(user) {
            this.set('statusMessage', null);
            var name = user.get('username');
            var that = this;

            user.deleteRecord();
            user.save().then(function(response) {
                var successMessage = 'Nutzer \"' + name + '\" wurde erfolgreich gelöscht!';
                that.set('statusMessage', { message: successMessage, isSuccess: true });
            }, function(error) {
                user.rollback();
                var failMessage = 'Nutzer \"' + name + '\" konnte nicht gelöscht werden!';
                that.set('statusMessage', { message: failMessage, isSuccess: false });
            });
        },

        filterUsers: function() {
            this.filterAll();
        }
    },

    init: function() {
        this._super();
        this.initalizeMMIOptions();
    },

    reset: function() {
        this.set('statusMessage', null);
        this.set('firstNameFilter', null);
        this.set('lastNameFiler', null);
        this.set('userNameFilter', null);
        this.set('mmiFilter', null);
    },

    initalizeMMIOptions: function() {
        this.mmiFilterOptions[0] = '';

        for (var i = 1; i <= 20; i++) {
            this.mmiFilterOptions[i] = '' + i;
        }
    },

    statusMessage: null,

    firstNameFilter: null,

    lastNameFiler: null,

    userNameFilter: null,

    mmiFilter: null,

    mmiFilterChanged: function() {
        this.filterAll();
    }.observes('mmiFilter'),

    usersList: [],

    isLoading: false,

    mmiFilterOptions: [],

    filterAll: function() {
        this.set('isLoading', true);
        var that = this;

        var filteredList = this.store.filter('user', (function(user){
            return that.filterUserName(user.get('username')) &&
                that.filterFirstName(user.get('firstname')) &&
                that.filterLastName(user.get('lastname')) &&
                that.filterMMI(user.get('mmi'));
        }));

        this.set('usersList', filteredList);
        this.set('isLoading', false);
        this.set('statusMessage', null);
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

        if (!(Ember.empty(this.get('lastNameFiler')))) {
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
            res = mmi === parseInt(this.get('mmiFilter'));
        }

        return res;
    },

    firstContainsSecond: function(first, second) {
        return first.indexOf(second) > -1;
    }
});
