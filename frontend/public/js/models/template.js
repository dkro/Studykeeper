StudyManager.Template = DS.Model.extend({
    title: DS.attr('string'),
    fields: DS.attr('array'),
    userstudies: DS.hasMany('userstudy', { async: true })
});

StudyManager.Template.FIXTURES = [
    {
        id: 1,
        title: 'Option A',
        fields: ['A1', 'A2'],
        userstudies: [1, 2, 3]
    },
    {
        id: 2,
        title: 'Option B',
        fields: ['B1', 'B2', 'B3'],
        userstudies: [4, 5]
    }
];