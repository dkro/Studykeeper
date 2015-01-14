StudyManager.Label = DS.Model.extend({
    title: DS.attr('string'),
    userstudies: DS.hasMany('userstudy', { async: true })
});

StudyManager.Label.FIXTURES = [
    {
        id: 1,
        title: 'Option A',
        userstudies: [1, 4]
    },
    {
        id: 2,
        title: 'Option B',
        userstudies: [1, 2, 4]
    },
    {
        id: 3,
        title: 'Option C',
        userstudies: [4]
    },
    {
        id: 4,
        title: 'Option D',
        userstudies: [5]
    }
];