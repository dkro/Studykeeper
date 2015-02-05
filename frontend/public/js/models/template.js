StudyManager.Template = DS.Model.extend({
    title: DS.attr('string'),
    fields: DS.hasMany('field', { async: true }),
    userstudies: DS.hasMany('userstudy', { async: true })
});

StudyManager.Template.FIXTURES = [
    {
        id: 1,
        title: 'Option A',
        fields: [1, 2],
        userstudies: [1, 2, 3]
    },
    {
        id: 2,
        title: 'Option B',
        fields: [3, 4],
        userstudies: [4, 5]
    }
];