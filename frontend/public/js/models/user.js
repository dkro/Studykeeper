StudyManager.User = DS.Model.extend({
    firstname: DS.attr('string'),
    lastname: DS.attr('string'),
    username: DS.attr('string'),
    password: DS.attr('string'),
    mmi: DS.attr('number'),
    isExecutorFor: DS.hasMany('userstudy', { async: true }),
    isTutorFor: DS.hasMany('userstudy', { async: true }),
    registeredFor: DS.hasMany('userstudy', { async: true })
});

StudyManager.User.FIXTURES = [
    {
        id: 1,
        firstname: 'Max',
        lastname: 'Mustermann',
        username: 'mustermann@campus.lmu.de',
        password: '1234567',
        mmi: 2,
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
        mmi: 4,
        isExecutorFor: [3, 4, 5],
        isTutorFor: [3, 4, 5],
        registeredFor: [1, 2, 4]
    }
];