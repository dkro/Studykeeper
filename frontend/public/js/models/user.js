StudyManager.User = DS.Model.extend({
    firstname: DS.attr('string'),
    lastname: DS.attr('string'),
    username: DS.attr('string'),
    password: DS.attr('string'),
    collectsMMI: DS.attr('boolean'),
    role: DS.attr('string'),
    mmi: DS.attr('number'),
    lmuStaff: DS.attr('boolean'),
    isExecutorFor: DS.hasMany('userstudy', { async: true }),
    isTutorFor: DS.hasMany('userstudy', { async: true }),
    registeredFor: DS.hasMany('userstudy', { async: true }),
    mailTo: function () {
        return 'mailto:' + this.get('username');
    }.property('username')
});

StudyManager.User.FIXTURES = [
    {
        id: 1,
        firstname: 'Max',
        lastname: 'Mustermann',
        username: 'mustermann@campus.lmu.de',
        password: '1234567',
        collectsMMI: true,
        role: 'tutor',
        mmi: 2,
        lmuStaff: true,
        isExecutorFor: [1, 2],
        isTutorFor: [1, 2],
        registeredFor: [1, 2, 3]
    },
    {
        id: 2,
        firstname: 'Max2',
        lastname: 'Mustermann2',
        username: 'mustermann2@campus.lmu.de',
        password: '1234567',
        collectsMMI: false,
        role: 'executor',
        mmi: 0,
        lmuStaff: true,
        isExecutorFor: [3, 4, 5],
        isTutorFor: [3, 4, 5],
        registeredFor: [1, 2, 4]
    },
    {
        id: 3,
        firstname: 'Max3',
        lastname: 'Mustermann3',
        username: 'mustermann3@test.de',
        password: '1234567',
        collectsMMI: false,
        role: 'participant',
        mmi: 0,
        lmuStaff: false,
        isExecutorFor: [],
        isTutorFor: [],
        registeredFor: []
    }
];