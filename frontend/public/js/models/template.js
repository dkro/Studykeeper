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
                title: "A1Title",
                value: "A1Value"
            },
            {
                title: "A2Title",
                value: "A2Value"
            }
        ],
        userstudies: [1, 2, 3]
    },
    {
        id: 2,
        title: 'Option B',
        fields: [
            {
                title: "B1Title",
                value: "B1Value"
            },
            {
                title: "B2Title",
                value: "B2Value"
            }
        ],
        userstudies: [4, 5]
    }
];