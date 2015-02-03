StudyManager.Template = DS.Model.extend({
    title: DS.attr('string'),
    fields: DS.attr('array'),
    userstudies: DS.hasMany('userstudy', { async: true })
});

StudyManager.Template.FIXTURES = [
    {
        id: 1,
        title: 'Option A',
        fields: [
            {
                name: 'One',
                value: '1'
            },
            {
                name: 'Two',
                value: '2'
            }
        ],
        userstudies: [1, 2, 3]
    },
    {
        id: 2,
        title: 'Option B',
        fields: [
            {
                name: 'Three',
                value: '3'
            },
            {
                name: 'Four',
                value: '4'
            },
            {
                name: 'Five',
                value: '5'
            }
        ],
        userstudies: [4, 5]
    }
];