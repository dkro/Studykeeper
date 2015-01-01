StudyManager.User = DS.Model.extend({
    name: DS.attr('string'),
    surname: DS.attr('string'),
    email: DS.attr('string'),
    password: DS.attr('string'),
    mmiTotal: DS.attr('number')
});

StudyManager.User.FIXTURES = [
    {
        id: 1,
        name: 'Max',
        surname: 'Mustermann',
        email: 'mustermann@campus.lmu.de',
        password: '1234567',
        mmiTotal: 2
    }
];