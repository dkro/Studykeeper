StudyManager.Template = DS.Model.extend({
    title: DS.attr('string'),
    fields: DS.attr('array')
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
        ]
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
        ]
    }
];